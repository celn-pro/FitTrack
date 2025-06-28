import React, { useState, useCallback, useEffect } from 'react';
import { RefreshControl, ActivityIndicator, ScrollView } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { useAuthStore } from '../store/authStore';

// Helper functions for user-specific storage
const getUserStorageKey = (userEmail: string, key: string) => `user-${userEmail}-${key}`;
const getCourseCompletedKey = (userEmail: string, courseId: string) =>
  getUserStorageKey(userEmail, `course-completed-${courseId}`);
const getCourseLessonsKey = (userEmail: string, courseId: string) =>
  getUserStorageKey(userEmail, `course-lessons-${courseId}`);
import LinearGradient from 'react-native-linear-gradient';
import { GET_COURSES } from '../graphql/queries';
import { useQuery } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

const CoursesScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { user } = useAuthStore();

  const [refreshing, setRefreshing] = useState(false);
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  const insets = useSafeAreaInsets();
  // Always fetch from network on refresh for up-to-date data
  const { loading, error, data, refetch } = useQuery(GET_COURSES, {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all', // Return partial data even if there are errors
  });

const markCompletedCourses = async (courses: any[], userEmail: string) => {
  if (!userEmail) return courses.map(course => ({ ...course, completed: false }));

  const entries = await Promise.all(
    courses.map(async (course) => {
      try {
        // Check completion status
        const completed = await AsyncStorage.getItem(getCourseCompletedKey(userEmail, course.id));

        // Load lesson progress
        const lessonsProgress = await AsyncStorage.getItem(getCourseLessonsKey(userEmail, course.id));
        const completedLessons = lessonsProgress ? JSON.parse(lessonsProgress) : [];

        // Calculate progress percentage
        const totalLessons = course.lessons?.length || course.topics?.length || 1;
        const progress = Math.round((completedLessons.length / totalLessons) * 100);

        return {
          ...course,
          completed: completed === 'true',
          progress: progress > 0 ? progress : undefined,
          completedLessons: completedLessons.length
        };
      } catch (error) {
        console.error('Error loading course progress:', error);
        return { ...course, completed: false };
      }
    })
  );
  return entries;
};

  // Filter courses by user goal when data or user changes
useEffect(() => {
  const updateCourses = async () => {
    if (data?.getFeaturedCourses) {
      // Start with all featured courses and normalize difficulty values
      let filtered = data.getFeaturedCourses.map((course: any) => {
        // Normalize difficulty values to match our filter options
        let normalizedDifficulty = course.difficulty || course.level || 'Beginner';

        // Handle common variations
        if (normalizedDifficulty.toLowerCase().includes('begin')) {
          normalizedDifficulty = 'Beginner';
        } else if (normalizedDifficulty.toLowerCase().includes('inter')) {
          normalizedDifficulty = 'Intermediate';
        } else if (normalizedDifficulty.toLowerCase().includes('adv')) {
          normalizedDifficulty = 'Advanced';
        }

        return {
          ...course,
          difficulty: normalizedDifficulty,
          level: normalizedDifficulty
        };
      });

      const withCompleted = await markCompletedCourses(filtered, user?.email || '');
      setFilteredCourses(withCompleted);
    } else {
      setFilteredCourses([]);
    }
  };
  updateCourses();
}, [data, user]);

  // Pull to refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  // Loading state
  if (loading && !refreshing) {
    return (
      <Container>
        <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 40 }} />
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container>
        <EmptyText>Error loading courses.</EmptyText>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
        />
      </Container>
    );
  }

  return (
    <Container style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          // borderBottomLeftRadius: 20,
          // borderBottomRightRadius: 20,
          // margin: 18,
          marginBottom: 8,
          padding: 18,
          paddingBottom: 14,
          elevation: 2,
        }}
      >
        <MotivationTitle style={{ color: theme.colors.white }}>
          Learn at Your Own Pace
        </MotivationTitle>
        <MotivationText style={{ color: 'rgba(255,255,255,0.85)' }}>
          Our courses are designed to fit your lifestyle. Take each lesson when you're ready—no rush, no pressure. Progress is progress!
        </MotivationText>
      </LinearGradient>
      {filteredCourses.length === 0 ? (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
          contentContainerStyle={{ flex: 1, justifyContent: 'center' }}
        >
          <EmptyText>No courses for your goal yet.</EmptyText>
        </ScrollView>
      ) : (
        <>



          {/* Difficulty Filter Tabs */}
          <FilterContainer>
            <FilterScrollView horizontal showsHorizontalScrollIndicator={false}>
              {difficulties.map((difficulty) => (
                <FilterTab
                  key={difficulty}
                  active={selectedDifficulty === difficulty}
                  onPress={() => setSelectedDifficulty(difficulty)}
                >
                  <FilterTabText active={selectedDifficulty === difficulty}>
                    {difficulty}
                  </FilterTabText>
                </FilterTab>
              ))}
            </FilterScrollView>
          </FilterContainer>

          {/* Course Display */}
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[theme.colors.primary]}
                tintColor={theme.colors.primary}
              />
            }
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            {/* Render courses based on selected difficulty */}
            {(() => {
              // Filter courses based on selected difficulty
              const getCoursesForDifficulty = () => {
                if (selectedDifficulty === 'All') {
                  return filteredCourses;
                }

                const filtered = filteredCourses.filter((c: any) => {
                  // Case-insensitive matching for difficulty/level
                  const courseDifficulty = (c.difficulty || '').toLowerCase();
                  const courseLevel = (c.level || '').toLowerCase();
                  const selectedLower = selectedDifficulty.toLowerCase();

                  return courseDifficulty === selectedLower ||
                         courseLevel === selectedLower ||
                         courseDifficulty.includes(selectedLower) ||
                         courseLevel.includes(selectedLower);
                });

                return filtered;
              };

              const coursesToShow = getCoursesForDifficulty();

              // Get difficulty style
              const getDifficultyStyle = (diff: string) => {
                switch (diff.toLowerCase()) {
                  case 'beginner':
                    return { color: '#4CAF50', icon: 'trending-up', bgColor: '#E8F5E8' };
                  case 'intermediate':
                    return { color: '#FF9800', icon: 'show-chart', bgColor: '#FFF3E0' };
                  case 'advanced':
                    return { color: '#F44336', icon: 'trending-up', bgColor: '#FFEBEE' };
                  default:
                    return { color: theme.colors.primary, icon: 'school', bgColor: theme.colors.primary + '15' };
                }
              };

              const difficultyStyle = getDifficultyStyle(selectedDifficulty);

              return (
                <DifficultySection>
                  <DifficultyHeader style={{ backgroundColor: difficultyStyle.bgColor }}>
                    <DifficultyHeaderContent>
                      <DifficultyIcon>
                        <Icon name={difficultyStyle.icon} size={24} color={difficultyStyle.color} />
                      </DifficultyIcon>
                      <DifficultyInfo>
                        <DifficultyTitle style={{ color: difficultyStyle.color }}>
                          {selectedDifficulty} Courses
                        </DifficultyTitle>
                        <DifficultySubtitle>
                          {coursesToShow.length} course{coursesToShow.length !== 1 ? 's' : ''} available
                        </DifficultySubtitle>
                      </DifficultyInfo>
                    </DifficultyHeaderContent>
                  </DifficultyHeader>

                  <CoursesGrid>
                    {coursesToShow.map((course: any) => (
                      <ModernCourseCard
                        key={course.id}
                        activeOpacity={0.85}
                        onPress={() => navigation.navigate('CourseDetail', { course })}
                        style={course.completed ? { opacity: 0.7 } : {}}
                      >
                        <CourseImageContainer>
                          {(course.thumbnailUrl || course.coverImage) ? (
                            <CourseImage source={{ uri: course.thumbnailUrl || course.coverImage }} />
                          ) : (
                            <PlaceholderImage>
                              <Icon name="fitness-center" size={32} color={theme.colors.primary} />
                            </PlaceholderImage>
                          )}
                          {course.completed && (
                            <CompletedBadge>
                              <Icon name="check-circle" size={18} color="#4CAF50" />
                            </CompletedBadge>
                          )}

                          {/* Progress indicator for enrolled courses */}
                          {course.progress && course.progress > 0 && !course.completed && (
                            <ProgressIndicator>
                              <ProgressText>{course.progress}%</ProgressText>
                            </ProgressIndicator>
                          )}

                          <DifficultyBadge style={{ backgroundColor: difficultyStyle.color }}>
                            <DifficultyBadgeText>
                              {course.difficulty || course.level || 'General'}
                            </DifficultyBadgeText>
                          </DifficultyBadge>
                        </CourseImageContainer>

                        <ModernCourseInfo>
                          <ModernCourseTitle numberOfLines={2}>{course.title}</ModernCourseTitle>
                          <ModernCourseDesc numberOfLines={2}>{course.description}</ModernCourseDesc>

                          <CourseMetaRow>
                            <MetaChip>
                              <Icon name="person" size={12} color={theme.colors.accent} />
                              <MetaChipText>{course.instructor || 'FitTrack'}</MetaChipText>
                            </MetaChip>
                            <MetaChip>
                              <Icon name="schedule" size={12} color={theme.colors.accent} />
                              <MetaChipText>{course.duration || 'N/A'}min</MetaChipText>
                            </MetaChip>
                          </CourseMetaRow>

                          <CategoryTag>
                            <CategoryTagText>{course.category || course.goal || 'General'}</CategoryTagText>
                          </CategoryTag>
                        </ModernCourseInfo>
                      </ModernCourseCard>
                    ))}
                  </CoursesGrid>
                </DifficultySection>
              );
            })()}
          </ScrollView>
        </>
      )}
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const MotivationTitle = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 6px;
`;

const MotivationText = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.secondaryText};
`;

const LevelSection = styled.View`
  margin-bottom: 24px;
`;

const LevelTitle = styled.Text`
  font-weight: bold;
  font-size: 18px;
  margin: 12px 18px 8px 18px;
  color: ${({ theme }) => theme.colors.text};
`;

const CourseCard = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.card || '#f6f8fa'};
  border-radius: 12px;
  margin: 8px 18px;
  padding: 12px;
  elevation: 1;
  shadow-color: #000;
  shadow-opacity: 0.04;
  shadow-radius: 4px;
  shadow-offset: 0px 1px;
  position: relative;
`;

const CourseImage = styled.Image`
  width: 100%;
  height: 100%;
  resize-mode: cover;
`;

const CourseInfo = styled.View`
  flex: 1;
`;

const CourseTitle = styled.Text`
  font-weight: 600;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
`;

const CourseDesc = styled.Text`
  color: ${({ theme }) => theme.colors.secondaryText};
  font-size: 13px;
  margin-top: 2px;
`;

const EmptyText = styled.Text`
  text-align: center;
  margin: 40px 0;
  color: ${({ theme }) => theme.colors.secondaryText};
  font-size: 15px;
`;

const CompletedIconContainer = styled.View`
  position: absolute;
  top: 8px;
  right: 12px;
  background-color: #fff;
  border-radius: 12px;
  padding: 1px 2px;
  elevation: 2;
`;

const CourseMetaInfo = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 8px;
  gap: 8px;
`;

const CourseMetaItem = styled.View`
  flex-direction: row;
  align-items: center;
  margin-right: 12px;
`;

const CourseMetaText = styled.Text`
  color: ${({ theme }) => theme.colors.accent};
  font-size: 11px;
  margin-left: 4px;
  font-weight: 500;
`;

// Modern difficulty-based styling
const DifficultySection = styled.View`
  margin-bottom: 24px;
`;

const DifficultyHeader = styled.View`
  margin: 16px;
  padding: 16px;
  border-radius: 16px;
  margin-bottom: 12px;
`;

const DifficultyHeaderContent = styled.View`
  flex-direction: row;
  align-items: center;
`;

const DifficultyIcon = styled.View`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background-color: rgba(255, 255, 255, 0.9);
  justify-content: center;
  align-items: center;
  margin-right: 16px;
`;

const DifficultyInfo = styled.View`
  flex: 1;
`;

const DifficultyTitle = styled.Text`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 4px;
`;

const DifficultySubtitle = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.secondaryText};
  font-weight: 500;
`;

const CoursesGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  padding: 0 16px;
  justify-content: space-between;
`;

const ModernCourseCard = styled.TouchableOpacity`
  width: 48%;
  background-color: ${({ theme }) => theme.colors.background === '#1C2526' ? '#2A3439' : '#FFFFFF'};
  border-radius: 16px;
  margin-bottom: 16px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
  elevation: 4;
`;

const CourseImageContainer = styled.View`
  position: relative;
  height: 120px;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  overflow: hidden;
`;

const PlaceholderImage = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.primary + '20'};
  justify-content: center;
  align-items: center;
`;

const CompletedBadge = styled.View`
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 4px;
`;

const DifficultyBadge = styled.View`
  position: absolute;
  bottom: 8px;
  left: 8px;
  padding: 4px 8px;
  border-radius: 12px;
`;

const DifficultyBadgeText = styled.Text`
  color: white;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
`;

const ModernCourseInfo = styled.View`
  padding: 12px;
`;

const ModernCourseTitle = styled.Text`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 6px;
  line-height: 20px;
`;

const ModernCourseDesc = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.secondaryText};
  line-height: 16px;
  margin-bottom: 8px;
`;

const CourseMetaRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 8px;
`;

const MetaChip = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background === '#1C2526' ? '#1A2328' : '#F5F5F5'};
  padding: 6px 10px;
  border-radius: 14px;
  margin-right: 8px;
  margin-bottom: 4px;
  min-height: 24px;
`;

const MetaChipText = styled.Text`
  color: ${({ theme }) => theme.colors.accent};
  font-size: 10px;
  margin-left: 4px;
  font-weight: 500;
  line-height: 12px;
`;

const CategoryTag = styled.View`
  background-color: ${({ theme }) => theme.colors.primary + '15'};
  padding: 4px 8px;
  border-radius: 8px;
  align-self: flex-start;
`;

const CategoryTagText = styled.Text`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
`;

// Filter tabs styling
const FilterContainer = styled.View`
  padding: 16px 0 8px 0;
  background-color: ${({ theme }) => theme.colors.background};
`;

const FilterScrollView = styled.ScrollView`
  padding-left: 16px;
`;

const FilterTab = styled.TouchableOpacity<{ active: boolean }>`
  padding: 8px 16px;
  margin-right: 12px;
  border-radius: 20px;
  background-color: ${({ active, theme }) =>
    active ? theme.colors.primary : theme.colors.background === '#1C2526' ? '#2A3439' : '#F5F5F5'};
  border: 1px solid ${({ active, theme }) =>
    active ? theme.colors.primary : theme.colors.background === '#1C2526' ? '#3A4449' : '#E0E0E0'};
`;

const FilterTabText = styled.Text<{ active: boolean }>`
  color: ${({ active, theme }) =>
    active ? '#FFFFFF' : theme.colors.text};
  font-size: 14px;
  font-weight: ${({ active }) => active ? '600' : '500'};
`;

// Progress indicator components
const ProgressIndicator = styled.View`
  position: absolute;
  top: 8px;
  left: 8px;
  background-color: rgba(76, 175, 80, 0.9);
  border-radius: 12px;
  padding: 4px 8px;
`;

const ProgressText = styled.Text`
  color: white;
  font-size: 10px;
  font-weight: 600;
`;

export default CoursesScreen;