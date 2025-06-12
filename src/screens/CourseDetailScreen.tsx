import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, RefreshControl, TouchableOpacity, Image, ScrollView } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { Course } from '../constants';
import YoutubePlayer from "react-native-youtube-iframe";
import { WebView } from 'react-native-webview';
import styled, { useTheme } from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage'; // <-- Add this import

type RouteParams = { course: Course };

const motivationalMsg = "Progress is personal—come back anytime and mark steps as complete when you're ready!";

// Helper to get storage key for a course
const getCourseCompletedKey = (courseId: string) => `course-completed-${courseId}`;

const CourseDetailScreen: React.FC = () => {
  const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
  const navigation = useNavigation();
  const { course } = route.params;
  const theme = useTheme();

  const [completed, setCompleted] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Load completed state from AsyncStorage
  useEffect(() => {
    const loadCompleted = async () => {
      try {
        const value = await AsyncStorage.getItem(getCourseCompletedKey(course.id));
        setCompleted(value === 'true');
      } catch (e) {
        // handle error if needed
      }
    };
    loadCompleted();
  }, [course.id]);

  // Toggle and store completed state
  const toggleCompleted = async () => {
    try {
      const newCompleted = !completed;
      setCompleted(newCompleted);
      await AsyncStorage.setItem(getCourseCompletedKey(course.id), newCompleted ? 'true' : 'false');
    } catch (e) {
      // handle error if needed
    }
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
    <Container>
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
          {course.level} • {course.goal}
        </HeaderSubtitle>
        <Motivation >
          {motivationalMsg}
        </Motivation>
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
        {/* Top Mark as Completed */}
        <MarkCompletedBtn
          completed={completed}
          onPress={toggleCompleted}
        >
          <MarkCompletedText completed={completed}>
            {completed ? 'Course Completed ✓' : 'Mark Course as Completed'}
          </MarkCompletedText>
        </MarkCompletedBtn>

        <CourseDesc>{course.description}</CourseDesc>

        {course.topics.map((topic, tIdx) => (
          <TopicCard key={topic.id}>
            <TopicTitle>
              {tIdx + 1}. {topic.title}
            </TopicTitle>
            {topic.description && (
              <TopicDesc>{topic.description}</TopicDesc>
            )}
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
          </TopicCard>
        ))}

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

export default CourseDetailScreen;

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

const VideoBox = styled.View`
  height: 220px;
  margin-top: 8px;
  border-radius: 8px;
  overflow: hidden;
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