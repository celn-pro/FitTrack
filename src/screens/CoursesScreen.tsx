import React, { useState, useCallback, useEffect } from 'react';
import { FlatList, RefreshControl, ActivityIndicator, ScrollView } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { useAuthStore } from '../store/authStore';
import LinearGradient from 'react-native-linear-gradient';
import { GET_COURSES } from '../graphql/queries';
import { useQuery } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

const levels = ['Beginner', 'Intermediate', 'Advanced'];

const CoursesScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { user } = useAuthStore();

  const [refreshing, setRefreshing] = useState(false);
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);

  // Always fetch from network on refresh for up-to-date data
  const { loading, error, data, refetch } = useQuery(GET_COURSES, {
    fetchPolicy: 'cache-and-network',
  });

  const getCourseCompletedKey = (courseId: string) => `course-completed-${courseId}`;

const markCompletedCourses = async (courses: any[]) => {
  const entries = await Promise.all(
    courses.map(async (course) => {
      const completed = await AsyncStorage.getItem(getCourseCompletedKey(course.id));
      return { ...course, completed: completed === 'true' };
    })
  );
  return entries;
};

  // Filter courses by user goal when data or user changes
useEffect(() => {
  const updateCourses = async () => {
    if (user && data?.getCourses) {
      const filtered = data.getCourses.filter((course: any) => course.goal === user.fitnessGoal);
      const withCompleted = await markCompletedCourses(filtered);
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
    <Container>
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          margin: 18,
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
        <FlatList
          data={levels}
          keyExtractor={(level) => level}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
          renderItem={({ item: level }) => {
            const courses = filteredCourses.filter((c: any) => c.level === level);
            if (!courses.length) return null;
            return (
              <LevelSection>
                <LevelTitle>{level}</LevelTitle>
                {courses.map((course: any) => (
                  <CourseCard
                    key={course.id}
                    activeOpacity={0.85}
                    onPress={() => navigation.navigate('CourseDetail', { course })}
                    style={course.completed ? { opacity: 0.6 } : {}}
                  >
                    {course.coverImage && (
                      <CourseImage source={{ uri: course.coverImage }} />
                    )}
                    <CourseInfo>
                      <CourseTitle>{course.title}</CourseTitle>
                      <CourseDesc numberOfLines={2}>{course.description}</CourseDesc>
                    </CourseInfo>
                    {course.completed && (
                      <CompletedIconContainer>
                        <Icon name="check-circle" size={20} color={theme.colors.primary} />
                      </CompletedIconContainer>
                    )}
                  </CourseCard>
                ))}
              </LevelSection>
            );
          }}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
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
  width: 60px;
  height: 60px;
  border-radius: 8px;
  margin-right: 12px;
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

export default CoursesScreen;