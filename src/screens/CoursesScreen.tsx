import React, { useState, useCallback } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { COURSES, Course } from '../constants';
import { RootStackParamList } from '../navigation/types';
import { useAuthStore } from '../store/authStore';
import LinearGradient from 'react-native-linear-gradient';

const levels = ['Beginner', 'Intermediate', 'Advanced'];

const CoursesScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { user } = useAuthStore();

  const [refreshing, setRefreshing] = useState(false);

  // Filter courses by user goal
  const filteredCourses = user
    ? COURSES.filter((course) => course.goal === user.fitnessGoal)
    : [];

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate refresh (replace with real fetch if needed)
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

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
          const courses = filteredCourses.filter((c) => c.level === level);
          if (!courses.length) return null;
          return (
            <LevelSection>
              <LevelTitle>{level}</LevelTitle>
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  activeOpacity={0.85}
                  onPress={() => navigation.navigate('CourseDetail', { course })}
                >
                  {course.coverImage && (
                    <CourseImage source={{ uri: course.coverImage }} />
                  )}
                  <CourseInfo>
                    <CourseTitle>{course.title}</CourseTitle>
                    <CourseDesc numberOfLines={2}>{course.description}</CourseDesc>
                  </CourseInfo>
                </CourseCard>
              ))}
            </LevelSection>
          );
        }}
        ListEmptyComponent={
          <EmptyText>No courses for your goal yet.</EmptyText>
        }
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const MotivationBox = styled.View`
  background-color: ${({ theme }) => theme.colors.card || '#f6f8fa'};
  border-radius: 16px;
  margin: 18px 18px 8px 18px;
  padding: 18px 16px 14px 16px;
  elevation: 2;
  shadow-color: #000;
  shadow-opacity: 0.06;
  shadow-radius: 8px;
  shadow-offset: 0px 2px;
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

export default CoursesScreen;