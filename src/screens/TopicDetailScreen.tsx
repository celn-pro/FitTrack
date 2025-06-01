import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { CourseTopic, CourseStep } from '../constants';

type RouteParams = { topic: CourseTopic };

const TopicDetailScreen: React.FC = () => {
  const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
  const { topic } = route.params;
  const [completedSteps, setCompletedSteps] = useState<{ [id: string]: boolean }>({});

  const toggleStep = (id: string) => {
    setCompletedSteps((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 10 }}>{topic.title}</Text>
      {topic.description && (
        <Text style={{ color: '#666', marginBottom: 16 }}>{topic.description}</Text>
      )}
      {topic.steps.map((step: CourseStep, idx: number) => (
        <View
          key={step.id}
          style={{
            backgroundColor: '#f8fafc',
            borderRadius: 10,
            padding: 14,
            marginBottom: 18,
            borderLeftWidth: 4,
            borderLeftColor: completedSteps[step.id] ? '#4caf50' : '#bdbdbd',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
            <TouchableOpacity
              onPress={() => toggleStep(step.id)}
              style={{
                width: 22,
                height: 22,
                borderRadius: 11,
                borderWidth: 2,
                borderColor: completedSteps[step.id] ? '#4caf50' : '#bdbdbd',
                backgroundColor: completedSteps[step.id] ? '#4caf50' : 'transparent',
                marginRight: 10,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {completedSteps[step.id] && (
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>✓</Text>
              )}
            </TouchableOpacity>
            <Text style={{ fontWeight: '600', fontSize: 15 }}>{step.title}</Text>
          </View>
          <Text style={{ color: '#444', marginBottom: 8 }}>{step.content}</Text>
          {step.illustration && (
            <Image
              source={{ uri: step.illustration }}
              style={{ width: '100%', height: 180, borderRadius: 8, marginBottom: 8 }}
              resizeMode="cover"
            />
          )}
          {step.videoUrl && (
            <TouchableOpacity
              onPress={() => {
                if (step.videoUrl) {
                  Linking.openURL(step.videoUrl);
                }
              }}
              style={{
                backgroundColor: '#1976d2',
                borderRadius: 6,
                padding: 10,
                alignItems: 'center',
                marginTop: 6,
              }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Watch Video</Text>
            </TouchableOpacity>
            // Or embed <Video source={{ uri: step.videoUrl }} ... /> if you want inline video
          )}
        </View>
      ))}
    </ScrollView>
  );
};

export default TopicDetailScreen;