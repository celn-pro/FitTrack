import React, { useState, useCallback, useEffect } from 'react';
import { View, RefreshControl, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { Course } from '../constants';
import YoutubePlayer from "react-native-youtube-iframe";
import { WebView } from 'react-native-webview';
import styled, { useTheme } from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '../store/authStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type RouteParams = { course: Course };

const motivationalMsg = "Progress is personal—come back anytime and mark steps as complete when you're ready!";

// Helper functions for user-specific storage
const getUserStorageKey = (userEmail: string, key: string) => `user-${userEmail}-${key}`;
const getCourseCompletedKey = (userEmail: string, courseId: string) =>
  getUserStorageKey(userEmail, `course-completed-${courseId}`);
const getCourseLessonsKey = (userEmail: string, courseId: string) =>
  getUserStorageKey(userEmail, `course-lessons-${courseId}`);
const getCourseEnrolledKey = (userEmail: string, courseId: string) =>
  getUserStorageKey(userEmail, `course-enrolled-${courseId}`);
const getCourseCurrentLessonKey = (userEmail: string, courseId: string) =>
  getUserStorageKey(userEmail, `course-current-lesson-${courseId}`);
const getCourseQuizResultsKey = (userEmail: string, courseId: string) =>
  getUserStorageKey(userEmail, `course-quiz-results-${courseId}`);

const CourseDetailScreen: React.FC = () => {
  const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
  const navigation = useNavigation();
  const { course } = route.params;
  const theme = useTheme();
  const { user } = useAuthStore();
  const insets = useSafeAreaInsets();

  const [completed, setCompleted] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [isEnrolled, setIsEnrolled] = useState(false);

  // Load completed state and progress from AsyncStorage
  useEffect(() => {
    const loadProgress = async () => {
      if (!user?.email) return;

      try {
        const completedValue = await AsyncStorage.getItem(getCourseCompletedKey(user.email, course.id));
        setCompleted(completedValue === 'true');

        const enrolledValue = await AsyncStorage.getItem(getCourseEnrolledKey(user.email, course.id));
        setIsEnrolled(enrolledValue === 'true');

        const lessonsProgress = await AsyncStorage.getItem(getCourseLessonsKey(user.email, course.id));
        if (lessonsProgress) {
          setCompletedLessons(new Set(JSON.parse(lessonsProgress)));
        }

        const currentLesson = await AsyncStorage.getItem(getCourseCurrentLessonKey(user.email, course.id));
        if (currentLesson) {
          setCurrentLessonIndex(parseInt(currentLesson, 10));
        }
      } catch (e) {
        console.error('Error loading course progress:', e);
      }
    };
    loadProgress();
  }, [course.id, user?.email]);

  // Enroll in course
  const handleEnrollment = async () => {
    if (!user?.email) return;

    try {
      setIsEnrolled(true);
      await AsyncStorage.setItem(getCourseEnrolledKey(user.email, course.id), 'true');
    } catch (e) {
      console.error('Error enrolling in course:', e);
    }
  };

  // Mark lesson as completed
  const markLessonCompleted = async (lessonId: string) => {
    if (!user?.email) return;

    try {
      const newCompletedLessons = new Set(completedLessons);
      newCompletedLessons.add(lessonId);
      setCompletedLessons(newCompletedLessons);

      await AsyncStorage.setItem(
        getCourseLessonsKey(user.email, course.id),
        JSON.stringify(Array.from(newCompletedLessons))
      );

      // Check if all lessons are completed
      const totalLessons = course.lessons?.length || course.topics?.length || 0;
      if (newCompletedLessons.size >= totalLessons) {
        setCompleted(true);
        await AsyncStorage.setItem(getCourseCompletedKey(user.email, course.id), 'true');
      }
    } catch (e) {
      console.error('Error marking lesson completed:', e);
    }
  };

  // Navigate to specific lesson
  const goToLesson = async (index: number) => {
    if (!user?.email) return;

    try {
      setCurrentLessonIndex(index);
      await AsyncStorage.setItem(getCourseCurrentLessonKey(user.email, course.id), index.toString());
    } catch (e) {
      console.error('Error saving current lesson:', e);
    }
  };

  // Calculate progress percentage
  const getProgressPercentage = () => {
    const totalLessons = course.lessons?.length || course.topics?.length || 1;
    return Math.round((completedLessons.size / totalLessons) * 100);
  };

  // Toggle and store completed state
  const toggleCompleted = async () => {
    if (!user?.email) return;

    try {
      const newCompleted = !completed;
      setCompleted(newCompleted);
      await AsyncStorage.setItem(getCourseCompletedKey(user.email, course.id), newCompleted ? 'true' : 'false');

      // If marking as completed, mark all lessons as completed too
      if (newCompleted) {
        const allLessonIds = course.lessons?.map(l => l.id) || course.topics?.map(t => t.id) || [];
        const allCompletedLessons = new Set(allLessonIds);
        setCompletedLessons(allCompletedLessons);
        await AsyncStorage.setItem(
          getCourseLessonsKey(user.email, course.id),
          JSON.stringify(Array.from(allCompletedLessons))
        );
      }
    } catch (e) {
      console.error('Error toggling completion:', e);
    }
  };

  // Handle quiz completion
  const handleQuizCompletion = async (lessonId: string, score: number, passed: boolean) => {
    if (!user?.email) return;

    try {
      const quizResults = {
        lessonId,
        score,
        passed,
        completedAt: new Date().toISOString()
      };

      // Store quiz results
      const existingResults = await AsyncStorage.getItem(getCourseQuizResultsKey(user.email, course.id));
      const allResults = existingResults ? JSON.parse(existingResults) : [];
      allResults.push(quizResults);
      await AsyncStorage.setItem(getCourseQuizResultsKey(user.email, course.id), JSON.stringify(allResults));

      // If quiz passed, mark lesson as completed
      if (passed) {
        await markLessonCompleted(lessonId);
      }
    } catch (e) {
      console.error('Error handling quiz completion:', e);
    }
  };

  // Simple quiz implementation
  const handleSimpleQuiz = (lessonId: string, quiz: any) => {
    Alert.alert(
      'Quiz',
      `This quiz has ${quiz.questions.length} questions with a passing score of ${quiz.passingScore}%. Would you like to take it?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Take Quiz',
          onPress: () => {
            // Simulate quiz completion with random score
            const score = Math.floor(Math.random() * 40) + 60; // 60-100%
            const passed = score >= quiz.passingScore;

            Alert.alert(
              passed ? 'Quiz Passed!' : 'Quiz Failed',
              `You scored ${score}%. ${passed ? 'Congratulations!' : 'Try again later.'}`,
              [
                {
                  text: 'OK',
                  onPress: () => handleQuizCompletion(lessonId, score, passed)
                }
              ]
            );
          }
        }
      ]
    );
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Add any refresh logic here (e.g., sync progress)
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  const isYouTubeUrl = (url: string) =>
    /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//.test(url);

  const getYoutubeId = (url: string) => {
    const match = url.match(/(?:v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : '';
  };

  return (
    <Container style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          paddingBottom: 18,
          paddingTop: 0,
        }}
      >
        <HeaderRow>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={26} color={theme.colors.white} />
          </TouchableOpacity>
          <HeaderTitle style={{ color: theme.colors.white }}>{course.title}</HeaderTitle>
          <View style={{ width: 26 }} />
        </HeaderRow>
        <HeaderSubtitle style={{ color: theme.colors.white, opacity: 0.85 }}>
          {course.difficulty || course.level} • {course.category || course.goal} • {course.instructor || 'FitTrack'}
        </HeaderSubtitle>
        <Motivation >
          {motivationalMsg}
        </Motivation>

        {/* Progress Bar */}
        {isEnrolled && (
          <ProgressContainer>
            <ProgressInfo>
              <ProgressText>Progress: {getProgressPercentage()}%</ProgressText>
              <ProgressText>{completedLessons.size} of {course.lessons?.length || course.topics?.length || 0} lessons completed</ProgressText>
            </ProgressInfo>
            <ProgressBarContainer>
              <ProgressBar width={getProgressPercentage()} />
            </ProgressBarContainer>
          </ProgressContainer>
        )}
      </LinearGradient>

      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        contentContainerStyle={{ padding: 16, paddingTop: 8 }}
      >
        {/* Enrollment Section */}
        {!isEnrolled ? (
          <EnrollmentCard>
            <EnrollmentHeader>
              <Icon name="school" size={32} color={theme.colors.primary} />
              <EnrollmentTitle>Ready to Start Learning?</EnrollmentTitle>
            </EnrollmentHeader>
            <EnrollmentDescription>
              Join this course to track your progress, access all lessons, and earn completion certificates.
            </EnrollmentDescription>
            <EnrollButton onPress={handleEnrollment}>
              <EnrollButtonText>Enroll Now - Free</EnrollButtonText>
            </EnrollButton>
          </EnrollmentCard>
        ) : (
          <LearningDashboard>
            <DashboardHeader>
              <Icon name="dashboard" size={24} color={theme.colors.primary} />
              <DashboardTitle>Your Learning Dashboard</DashboardTitle>
            </DashboardHeader>
            <StatsRow>
              <StatCard>
                <StatNumber>{getProgressPercentage()}%</StatNumber>
                <StatLabel>Complete</StatLabel>
              </StatCard>
              <StatCard>
                <StatNumber>{completedLessons.size}</StatNumber>
                <StatLabel>Lessons Done</StatLabel>
              </StatCard>
              <StatCard>
                <StatNumber>{course.duration || 'N/A'}</StatNumber>
                <StatLabel>Total Minutes</StatLabel>
              </StatCard>
            </StatsRow>
          </LearningDashboard>
        )}

        <CourseDesc>{course.description}</CourseDesc>

        {/* Show course metadata for new structure */}
        {course.learningObjectives && course.learningObjectives.length > 0 && (
          <MetaSection>
            <MetaTitle>Learning Objectives</MetaTitle>
            {course.learningObjectives.map((objective, idx) => (
              <MetaItem key={idx}>
                <Icon name="check-circle" size={16} color={theme.colors.primary} />
                <MetaText>{objective}</MetaText>
              </MetaItem>
            ))}
          </MetaSection>
        )}

        {course.targetAudience && course.targetAudience.length > 0 && (
          <MetaSection>
            <MetaTitle>Target Audience</MetaTitle>
            {course.targetAudience.map((audience, idx) => (
              <MetaItem key={idx}>
                <Icon name="person" size={16} color={theme.colors.accent} />
                <MetaText>{audience}</MetaText>
              </MetaItem>
            ))}
          </MetaSection>
        )}

        {/* Render lessons (new structure) or topics (legacy structure) */}
        {course.lessons ? (
          // New structure: lessons
          course.lessons.map((lesson, lIdx) => {
            const isLessonCompleted = completedLessons.has(lesson.id);
            const isCurrentLesson = lIdx === currentLessonIndex;

            return (
              <LessonCard key={lesson.id} completed={isLessonCompleted} current={isCurrentLesson}>
                <LessonHeader>
                  <LessonNumber completed={isLessonCompleted}>
                    {isLessonCompleted ? (
                      <Icon name="check" size={16} color="white" />
                    ) : (
                      <LessonNumberText>{lIdx + 1}</LessonNumberText>
                    )}
                  </LessonNumber>
                  <LessonTitleContainer>
                    <LessonTitle completed={isLessonCompleted}>
                      {lesson.title}
                    </LessonTitle>
                    <LessonMeta>
                      <LessonMetaItem>
                        <Icon name="schedule" size={14} color={theme.colors.accent} />
                        <LessonMetaText>{lesson.duration} min</LessonMetaText>
                      </LessonMetaItem>
                      <LessonMetaItem>
                        <Icon name="category" size={14} color={theme.colors.accent} />
                        <LessonMetaText>{lesson.contentType}</LessonMetaText>
                      </LessonMetaItem>
                    </LessonMeta>
                  </LessonTitleContainer>
                  <LessonActions>
                    {!isLessonCompleted && (
                      <CompleteButton onPress={() => markLessonCompleted(lesson.id)}>
                        <Icon name="check-circle" size={20} color={theme.colors.primary} />
                      </CompleteButton>
                    )}
                  </LessonActions>
                </LessonHeader>

                {lesson.description && (
                  <LessonDescription>{lesson.description}</LessonDescription>
                )}

                <LessonContent>
                  <StepContent>{lesson.content}</StepContent>

                  {/* Show exercises if available */}
                  {lesson.exercises && lesson.exercises.length > 0 && (
                    <ExerciseSection>
                      <ExerciseTitle>Practice Exercises</ExerciseTitle>
                      {lesson.exercises.map((exercise, eIdx) => (
                        <ExerciseCard key={eIdx}>
                          <ExerciseName>{exercise.name}</ExerciseName>
                          <ExerciseInstructions>{exercise.instructions}</ExerciseInstructions>
                          <ExerciseDetails>
                            {exercise.duration && (
                              <ExerciseDetail>
                                <Icon name="timer" size={12} color={theme.colors.accent} />
                                <ExerciseDetailText>{exercise.duration}s</ExerciseDetailText>
                              </ExerciseDetail>
                            )}
                            {exercise.reps && (
                              <ExerciseDetail>
                                <Icon name="repeat" size={12} color={theme.colors.accent} />
                                <ExerciseDetailText>{exercise.reps} reps</ExerciseDetailText>
                              </ExerciseDetail>
                            )}
                            {exercise.sets && (
                              <ExerciseDetail>
                                <Icon name="fitness-center" size={12} color={theme.colors.accent} />
                                <ExerciseDetailText>{exercise.sets} sets</ExerciseDetailText>
                              </ExerciseDetail>
                            )}
                          </ExerciseDetails>
                          {exercise.imageUrl && (
                            <StepImage
                              source={{ uri: exercise.imageUrl }}
                              resizeMode="cover"
                            />
                          )}
                        </ExerciseCard>
                      ))}
                    </ExerciseSection>
                  )}

                  {/* Show quiz if available */}
                  {lesson.quiz && (
                    <QuizSection>
                      <QuizTitle>Knowledge Check</QuizTitle>
                      <QuizInfo>
                        <Icon name="quiz" size={16} color={theme.colors.primary} />
                        <QuizInfoText>
                          {lesson.quiz.questions.length} questions • Passing score: {lesson.quiz.passingScore}%
                        </QuizInfoText>
                      </QuizInfo>
                      <QuizButton onPress={() => handleSimpleQuiz(lesson.id, lesson.quiz!)}>
                        <QuizButtonText>Take Quiz</QuizButtonText>
                      </QuizButton>
                    </QuizSection>
                  )}
                </LessonContent>
              </LessonCard>
            );
          })
        ) : course.topics ? (
          // Legacy structure: topics and steps
          course.topics.map((topic, tIdx) => {
            const isTopicCompleted = completedLessons.has(topic.id);

            return (
              <LessonCard key={topic.id} completed={isTopicCompleted} current={false}>
                <LessonHeader>
                  <LessonNumber completed={isTopicCompleted}>
                    {isTopicCompleted ? (
                      <Icon name="check" size={16} color="white" />
                    ) : (
                      <LessonNumberText>{tIdx + 1}</LessonNumberText>
                    )}
                  </LessonNumber>
                  <LessonTitleContainer>
                    <LessonTitle completed={isTopicCompleted}>
                      {topic.title}
                    </LessonTitle>
                  </LessonTitleContainer>
                  <LessonActions>
                    {!isTopicCompleted && (
                      <CompleteButton onPress={() => markLessonCompleted(topic.id)}>
                        <Icon name="check-circle" size={20} color={theme.colors.primary} />
                      </CompleteButton>
                    )}
                  </LessonActions>
                </LessonHeader>

                {topic.description && (
                  <LessonDescription>{topic.description}</LessonDescription>
                )}

                <LessonContent>
                  {topic.steps.map((step, sIdx) => (
                    <StepCard key={step.id}>
                      <StepTitle>
                        {tIdx + 1}.{sIdx + 1} {step.title}
                      </StepTitle>
                      <StepContent>{step.content}</StepContent>
                      {step.illustration && (
                        <StepImage
                          source={{ uri: step.illustration }}
                          resizeMode="cover"
                        />
                      )}
                      {step.videoUrl && (
                        isYouTubeUrl(step.videoUrl) ? (
                          <VideoBox>
                            <YoutubePlayer
                              height={220}
                              play={false}
                              videoId={getYoutubeId(step.videoUrl)}
                            />
                          </VideoBox>
                        ) : (
                          <VideoBox>
                            <WebView
                              source={{ uri: step.videoUrl }}
                              style={{ flex: 1 }}
                              allowsFullscreenVideo
                            />
                          </VideoBox>
                        )
                      )}
                    </StepCard>
                  ))}
                </LessonContent>
              </LessonCard>
            );
          })
        ) : (
          <EmptyState>
            <Icon name="school" size={48} color={theme.colors.secondaryText} />
            <EmptyStateText>No lessons available for this course yet.</EmptyStateText>
          </EmptyState>
        )}

        {/* Bottom Mark as Completed */}
        <MarkCompletedBtn
          completed={completed}
          onPress={toggleCompleted}
          style={{ marginTop: 16, marginBottom: 32 }}
        >
          <MarkCompletedText completed={completed}>
            {completed ? 'Course Completed ✓' : 'Mark Course as Completed'}
          </MarkCompletedText>
        </MarkCompletedBtn>
      </ScrollView>
    </Container>
  );
};

// --- Styled Components ---

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 18px 16px 0 16px;
`;

const CourseDesc = styled.Text`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 18px;
  margin-top: 10px;
  text-align: center;
`;

const TopicCard = styled.View`
  margin-bottom: 24px;
`;

const TopicTitle = styled.Text`
  font-size: 17px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 6px;
`;

const TopicDesc = styled.Text`
  color: ${({ theme }) => theme.colors.secondaryText};
  font-size: 14px;
  margin-bottom: 8px;
`;

const StepCard = styled.View`
  background-color: ${({ theme }) => theme.colors.card || '#f8fafc'};
  border-radius: 10px;
  padding: 14px;
  margin-bottom: 12px;
  border-left-width: 4px;
  border-left-color: ${({ theme }) => theme.colors.primary};
`;

const StepTitle = styled.Text`
  font-weight: 500;
  font-size: 15px;
  margin-bottom: 4px;
  color: ${({ theme }) => theme.colors.text};
`;

const StepContent = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 8px;
  font-size: 13px;
`;

const StepImage = styled.Image`
  width: 100%;
  height: 180px;
  border-radius: 8px;
  margin-bottom: 8px;
`;



const MarkCompletedBtn = styled.TouchableOpacity<{ completed: boolean }>`
  background-color: ${({ completed, theme }) => completed ? '#4caf50' : theme.colors.primary};
  border-radius: 8px;
  padding: 12px;
  align-items: center;
  margin-bottom: 8px;
`;

const MarkCompletedText = styled.Text<{ completed: boolean }>`
  color: #fff;
  font-weight: bold;
  font-size: 16px;
`;

const HeaderTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
  flex: 1;
  text-align: center;
`;

const HeaderSubtitle = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.secondaryText};
  text-align: center;
  margin-top: 2px;
`;
const Motivation = styled.Text`
  font-size: 13px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.white};
  text-align: center;
  margin: 10px 0 0 0;
  padding: 0 10px;
`;

const VideoBox = styled.View`
  height: 220px;
  border-radius: 12px;
  overflow: hidden;
  margin-top: 12px;
`;

const MetaSection = styled.View`
  margin-bottom: 16px;
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.background === '#1C2526' ? '#2A3439' : '#F8F9FA'};
  border-radius: 12px;
`;

const MetaTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 12px;
`;

const MetaItem = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

const MetaText = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  margin-left: 8px;
  flex: 1;
`;

const LessonMeta = styled.View`
  flex-direction: row;
  margin-bottom: 8px;
`;

const LessonMetaItem = styled.View`
  flex-direction: row;
  align-items: center;
  margin-right: 16px;
`;

const LessonMetaText = styled.Text`
  color: ${({ theme }) => theme.colors.accent};
  font-size: 12px;
  margin-left: 4px;
  font-weight: 500;
`;

const ExerciseSection = styled.View`
  margin-top: 16px;
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.background === '#1C2526' ? '#1A2328' : '#F0F8FF'};
  border-radius: 12px;
`;

const ExerciseTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 12px;
`;

const ExerciseCard = styled.View`
  margin-bottom: 16px;
  padding: 12px;
  background-color: ${({ theme }) => theme.colors.background === '#1C2526' ? '#2A3439' : '#FFFFFF'};
  border-radius: 8px;
  border-left-width: 3px;
  border-left-color: ${({ theme }) => theme.colors.primary};
`;

const ExerciseName = styled.Text`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 4px;
`;

const ExerciseInstructions = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.secondaryText};
  line-height: 18px;
  margin-bottom: 8px;
`;

const ExerciseDetails = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;

const ExerciseDetail = styled.View`
  flex-direction: row;
  align-items: center;
  margin-right: 12px;
  margin-bottom: 4px;
`;

const ExerciseDetailText = styled.Text`
  color: ${({ theme }) => theme.colors.accent};
  font-size: 11px;
  margin-left: 4px;
  font-weight: 500;
`;

const QuizSection = styled.View`
  margin-top: 16px;
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.background === '#1C2526' ? '#1A2328' : '#FFF8E1'};
  border-radius: 12px;
`;

const QuizTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 8px;
`;

const QuizInfo = styled.View`
  flex-direction: row;
  align-items: center;
`;

const QuizInfoText = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: 13px;
  margin-left: 8px;
  font-weight: 500;
`;

const EmptyState = styled.View`
  align-items: center;
  padding: 40px 20px;
`;

const EmptyStateText = styled.Text`
  color: ${({ theme }) => theme.colors.secondaryText};
  font-size: 16px;
  text-align: center;
  margin-top: 12px;
`;

// Progress tracking components
const ProgressContainer = styled.View`
  margin: 16px 16px 0 16px;
  padding: 16px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
`;

const ProgressInfo = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const ProgressText = styled.Text`
  color: ${({ theme }) => theme.colors.white};
  font-size: 12px;
  font-weight: 500;
`;

const ProgressBarContainer = styled.View`
  height: 6px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  overflow: hidden;
`;

const ProgressBar = styled.View<{ width: number }>`
  height: 100%;
  width: ${({ width }) => width}%;
  background-color: #4CAF50;
  border-radius: 3px;
`;

// Enrollment components
const EnrollmentCard = styled.View`
  background-color: ${({ theme }) => theme.colors.background === '#1C2526' ? '#2A3439' : '#FFFFFF'};
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 20px;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.1;
  shadow-radius: 12px;
  elevation: 6;
  border: 1px solid ${({ theme }) => theme.colors.primary + '20'};
`;

const EnrollmentHeader = styled.View`
  align-items: center;
  margin-bottom: 16px;
`;

const EnrollmentTitle = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-top: 8px;
  text-align: center;
`;

const EnrollmentDescription = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.secondaryText};
  text-align: center;
  line-height: 20px;
  margin-bottom: 20px;
`;

const EnrollButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: 16px;
  border-radius: 12px;
  align-items: center;
`;

const EnrollButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: 600;
`;

// Learning dashboard components
const LearningDashboard = styled.View`
  background-color: ${({ theme }) => theme.colors.background === '#1C2526' ? '#2A3439' : '#F8F9FA'};
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  border-left-width: 4px;
  border-left-color: ${({ theme }) => theme.colors.primary};
`;

const DashboardHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
`;

const DashboardTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-left: 8px;
`;

const StatsRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const StatCard = styled.View`
  flex: 1;
  align-items: center;
  padding: 12px;
  margin: 0 4px;
  background-color: ${({ theme }) => theme.colors.background === '#1C2526' ? '#1A2328' : '#FFFFFF'};
  border-radius: 12px;
`;

const StatNumber = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 4px;
`;

const StatLabel = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.secondaryText};
  font-weight: 500;
`;

// Enhanced lesson components
const LessonCard = styled.View<{ completed: boolean; current: boolean }>`
  background-color: ${({ theme }) => theme.colors.background === '#1C2526' ? '#2A3439' : '#FFFFFF'};
  border-radius: 16px;
  margin-bottom: 16px;
  padding: 20px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
  elevation: 4;
  border-left-width: 4px;
  border-left-color: ${({ completed, current, theme }) =>
    completed ? '#4CAF50' : current ? theme.colors.primary : 'transparent'};
  opacity: ${({ completed }) => completed ? 0.8 : 1};
`;

const LessonHeader = styled.View`
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const LessonNumber = styled.View<{ completed: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: ${({ completed, theme }) =>
    completed ? '#4CAF50' : theme.colors.primary + '20'};
  justify-content: center;
  align-items: center;
  margin-right: 12px;
`;

const LessonNumberText = styled.Text`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 14px;
  font-weight: 600;
`;

const LessonTitleContainer = styled.View`
  flex: 1;
`;

const LessonTitle = styled.Text<{ completed: boolean }>`
  font-size: 18px;
  font-weight: 600;
  color: ${({ completed, theme }) =>
    completed ? theme.colors.secondaryText : theme.colors.text};
  margin-bottom: 4px;
  text-decoration-line: ${({ completed }) => completed ? 'line-through' : 'none'};
`;

const LessonActions = styled.View`
  flex-direction: row;
  align-items: center;
`;

const CompleteButton = styled.TouchableOpacity`
  padding: 8px;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.colors.primary + '15'};
`;

const LessonDescription = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.secondaryText};
  line-height: 20px;
  margin-bottom: 16px;
`;

const LessonContent = styled.View`
  margin-top: 8px;
`;

const QuizButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: 12px 20px;
  border-radius: 8px;
  align-items: center;
  margin-top: 12px;
`;

const QuizButtonText = styled.Text`
  color: white;
  font-size: 14px;
  font-weight: 600;
`;

export default CourseDetailScreen;