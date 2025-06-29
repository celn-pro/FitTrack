import React, { useEffect, useState } from 'react';
import { ScrollView, Animated, Text, View, Dimensions, StatusBar, TouchableOpacity, Image } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import { Recommendation } from '../types/types';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

// Custom component to handle GIFs properly
const ExerciseMediaComponent: React.FC<{
  source: { uri: string };
  mediaType: string;
  style?: any;
}> = ({ source, mediaType, style }) => {
  const [imageError, setImageError] = useState(false);
  const theme = useTheme();

  // Debug: Log the media URL and type
  useEffect(() => {
    console.log('Loading media:', { url: source.uri, type: mediaType });
  }, [source.uri, mediaType]);

  // Handle empty or invalid URLs
  if (!source?.uri || source.uri.trim() === '') {
    return (
      <View style={[style, { backgroundColor: theme.colors.card, justifyContent: 'center', alignItems: 'center' }]}>
        <Icon name="image" size={40} color={theme.colors.border} />
        <Text style={{ color: theme.colors.secondaryText, fontSize: 12, marginTop: 8 }}>No {mediaType} URL</Text>
      </View>
    );
  }

  if (imageError) {
    return (
      <View style={[style, { backgroundColor: theme.colors.card, justifyContent: 'center', alignItems: 'center' }]}>
        <Icon name="broken-image" size={40} color={theme.colors.border} />
        <Text style={{ color: theme.colors.secondaryText, fontSize: 12, marginTop: 8 }}>Failed to load {mediaType}</Text>
      </View>
    );
  }

  // Since backend is sending PNG images (not actual GIFs), treat them all as images
  // Use FastImage for better performance and caching
  return (
    <FastImage
      source={{
        uri: source.uri,
        priority: FastImage.priority.high,
      }}
      style={style}
      resizeMode={FastImage.resizeMode.contain} // Use contain for exercise images
      onError={() => {
        console.log('Failed to load exercise image:', source.uri);
        setImageError(true);
      }}
      onLoad={() => console.log('Successfully loaded exercise image:', source.uri)}
    />
  );
};

const WorkoutDetailScreen: React.FC = () => {
  const theme = useTheme();
  const route = useRoute<RouteProp<{ params: { workout: Recommendation } }, 'params'>>();
  const navigation = useNavigation();
  const { workout } = route.params || {};
  const insets = useSafeAreaInsets();

  // Handle case where workout is null/undefined
  if (!workout) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Container>
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20
        }}>
          <Icon name="error-outline" size={60} color={theme.colors.accent} />
          <Text style={{
            color: theme.colors.text,
            fontSize: 18,
            fontWeight: 'bold',
            marginTop: 16,
            textAlign: 'center'
          }}>
            Workout Not Found
          </Text>
          <Text style={{
            color: theme.colors.secondaryText,
            fontSize: 14,
            marginTop: 8,
            textAlign: 'center'
          }}>
            The workout data could not be loaded.
          </Text>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              backgroundColor: theme.colors.primary,
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 8,
              marginTop: 24
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '600' }}>Go Back</Text>
          </TouchableOpacity>
        </View>
        </Container>
      </SafeAreaView>
    );
  }

  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  useEffect(() => {
    // Set status bar style based on theme
    StatusBar.setBarStyle(theme.dark ? 'light-content' : 'dark-content');

    // Debug: Log the workout data
    console.log('=== WORKOUT DEBUG ===');
    console.log('Full workout data:', JSON.stringify(workout, null, 2));
    console.log('Number of steps:', workout?.steps?.length || 0);
    workout?.steps?.forEach((step, idx) => {
      console.log(`Step ${idx + 1}:`, {
        title: step?.title,
        hasMedia: !!step?.media,
        mediaCount: step?.media?.length || 0,
        hasGifUrl: !!(step as any)?.gifUrl,
        hasImages: !!(step as any)?.images,
        stepKeys: step ? Object.keys(step) : []
      });
    });
    console.log('=== END WORKOUT DEBUG ===');

    return () => {
      StatusBar.setBarStyle('default');
    };
  }, [theme.dark]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Container>
        {/* Fixed Header - Only Title and Back Arrow */}
        <FixedHeader>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 15 }}>
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <HeaderTitle numberOfLines={1}>
            {workout?.title || 'Workout'}
          </HeaderTitle>
        </FixedHeader>

        {/* Scrollable Content - Everything else */}
        <ScrollView
          style={{ flex: 1, marginTop: 60 }}
          contentContainerStyle={{ paddingBottom: 30 }}
          showsVerticalScrollIndicator={false}
        >
        {/* Hero Image Section - Now Scrollable */}
        <ScrollableHeroSection>
          {workout.image ? (
            <HeroImage source={{ uri: workout.image }} />
          ) : (
            <HeroPlaceholder>
              <Icon name="fitness-center" size={80} color={theme.colors.primary} />
            </HeroPlaceholder>
          )}
          <HeroOverlay>
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)']}
              style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 150 }}
            />
            <HeroContent>
              <WorkoutTitle>{workout?.title || 'Workout'}</WorkoutTitle>
              <MetaRow>
                {workout?.difficultyLevel && (
                  <MetaBadge>
                    <Icon name="trending-up" size={16} color="#fff" />
                    <MetaText>{workout.difficultyLevel}</MetaText>
                  </MetaBadge>
                )}
                {workout?.estimatedDuration && (
                  <MetaBadge>
                    <Icon name="timer" size={16} color="#fff" />
                    <MetaText>{workout.estimatedDuration} min</MetaText>
                  </MetaBadge>
                )}
                <MetaBadge>
                  <Icon name="fitness-center" size={16} color="#fff" />
                  <MetaText>{workout?.steps?.length || 0} exercises</MetaText>
                </MetaBadge>
              </MetaRow>
            </HeroContent>
          </HeroOverlay>
        </ScrollableHeroSection>
        <ContentContainer>
          {/* Description */}
          <Section>
            <SectionTitle>About This Workout</SectionTitle>
            <Description>{workout?.description || 'No description available.'}</Description>
          </Section>

          {/* Exercises */}
          <Section>
            <SectionTitle>Exercises ({workout?.steps?.length || 0})</SectionTitle>
            {workout?.steps?.map((step, idx) => {
              // Skip null/undefined steps
              if (!step) return null;

              // Debug: Log each step
              console.log(`Step ${idx}:`, {
                title: step.title,
                description: step.description,
                hasMedia: !!step.media,
                mediaCount: step.media?.length || 0,
                mediaUrls: step.media?.map(m => m.url) || []
              });

              return (
                <ExerciseCard key={idx}>
                <ExerciseHeader>
                  <ExerciseNumber>
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>{idx + 1}</Text>
                  </ExerciseNumber>
                  <ExerciseInfo>
                    <ExerciseTitle>
                      {step?.title ||
                       (step?.description?.toLowerCase().includes('warm') ? 'Warm-up' :
                        step?.description?.toLowerCase().includes('cool') ? 'Cool-down' :
                        idx === 0 ? 'Warm-up' :
                        idx === (workout?.steps?.length || 0) - 1 ? 'Cool-down' :
                        `Exercise ${idx}`)}
                    </ExerciseTitle>
                    {step?.duration && (
                      <ExerciseDuration>
                        <Icon name="timer" size={14} color={theme.colors.accent} />
                        <Text style={{ color: theme.colors.accent, marginLeft: 4, fontSize: 12 }}>
                          {step.duration > 60 ? `${Math.round(step.duration / 60)} min` : `${step.duration} sec`}
                        </Text>
                      </ExerciseDuration>
                    )}
                  </ExerciseInfo>
                </ExerciseHeader>

                {/* Exercise Media - Handle both our format and exercisedb.dev format */}
                {step?.media && step.media.length > 0 ? (
                  <MediaContainer>
                    {/* Handle media from backend */}
                    {step.media.map((media, mIdx) => {
                      // Skip null/undefined media
                      if (!media || !media.url) {
                        console.log(`Skipping invalid media ${mIdx} for step ${idx}`);
                        return null;
                      }

                      console.log(`Rendering media ${mIdx} for step ${idx}:`, media);

                      return (
                        <TouchableOpacity
                          key={`media-${mIdx}`}
                          onPress={() => setSelectedImageIndex(mIdx)}
                          activeOpacity={0.8}
                        >
                          <ExerciseMediaComponent
                            source={{ uri: media.url }}
                            mediaType={media.type || 'image'}
                            style={{
                              width: '100%',
                              height: 200,
                              borderRadius: 12,
                              marginBottom: 8,
                            }}
                          />
                          {media.type === 'gif' && (
                            <MediaBadge>
                              <Text style={{ color: '#fff', fontSize: 10, fontWeight: '600' }}>GIF</Text>
                            </MediaBadge>
                          )}
                          {media.caption && (
                            <MediaCaption>{media.caption}</MediaCaption>
                          )}
                        </TouchableOpacity>
                      );
                    })}

                  </MediaContainer>
                ) : (
                  // Fallback: Show a placeholder for exercises without media
                  <MediaContainer>
                    <View style={{
                      width: '100%',
                      height: 120,
                      backgroundColor: theme.colors.primary + '20',
                      borderRadius: 12,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: 8,
                    }}>
                      <Icon name="fitness-center" size={40} color={theme.colors.primary} />
                      <Text style={{ color: theme.colors.primary, marginTop: 8, fontSize: 12 }}>
                        Exercise Demonstration
                      </Text>
                    </View>
                  </MediaContainer>
                )}

                {/* Always show description */}
                <ExerciseDescription>
                  {step?.description || 'No description available.'}
                </ExerciseDescription>
                </ExerciseCard>
              );
            })}
          </Section>

          {/* Tips */}
          {workout?.tips && workout.tips.length > 0 && (
            <Section>
              <SectionTitle>Workout Tips</SectionTitle>
              {workout.tips.map((tip, idx) => (
                <TipCard key={idx}>
                  <Icon name="lightbulb-outline" size={20} color={theme.colors.primary} />
                  <TipText>{tip}</TipText>
                </TipCard>
              ))}
            </Section>
          )}

          {/* Personalized Tips */}
          {workout?.personalizedTips && workout.personalizedTips.length > 0 && (
            <Section>
              <SectionTitle>Personalized for You</SectionTitle>
              {workout.personalizedTips.map((tip, idx) => (
                <TipCard key={`personalized-${idx}`} style={{ backgroundColor: theme.colors.primary + '10' }}>
                  <Icon name="person" size={20} color={theme.colors.primary} />
                  <TipText>{tip}</TipText>
                </TipCard>
              ))}
            </Section>
          )}
        </ContentContainer>
        </ScrollView>
      </Container>
    </SafeAreaView>
  );
};

// Styled Components
const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const FixedHeader = styled.View`
  height: 60px;
  background-color: ${({ theme }) => theme.colors.primary};
  padding-horizontal: 20px;
  flex-direction: row;
  align-items: center;
  z-index: 1000;
`;

const HeaderTitle = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  flex: 1;
`;

const ScrollableHeroSection = styled.View`
  height: ${height * 0.35}px;
  position: relative;
`;

const HeroSection = styled.View`
  height: ${height * 0.4}px;
  position: relative;
`;

const HeroImage = styled(FastImage)`
  width: 100%;
  height: 100%;
`;

const HeroPlaceholder = styled.View`
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.primary}20;
  justify-content: center;
  align-items: center;
`;

const HeroOverlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  justify-content: space-between;
`;

const HeroContent = styled.View`
  padding: 20px;
  padding-bottom: 30px;
`;

const WorkoutTitle = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 12px;
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);
`;

const MetaRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;

const MetaBadge = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 8px 12px;
  margin-right: 8px;
  margin-bottom: 8px;
`;

const MetaText = styled.Text`
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  margin-left: 4px;
`;

const ContentContainer = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;
  margin-top: -25px;
  padding-top: 25px;
`;

const Section = styled.View`
  padding: 0 20px;
  margin-bottom: 25px;
`;

const SectionTitle = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 15px;
`;

const Description = styled.Text`
  font-size: 16px;
  line-height: 24px;
  color: ${({ theme }) => theme.colors.secondaryText};
`;

const ExerciseCard = styled.View`
  background-color: ${({ theme }) => theme.colors.card};
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  elevation: 3;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 10px;
  shadow-offset: 0px 4px;
`;

const ExerciseHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;
`;

const ExerciseNumber = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.colors.primary};
  justify-content: center;
  align-items: center;
  margin-right: 15px;
`;

const ExerciseInfo = styled.View`
  flex: 1;
`;

const ExerciseTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 4px;
`;

const ExerciseDuration = styled.View`
  flex-direction: row;
  align-items: center;
`;

const MediaContainer = styled.View`
  margin-bottom: 15px;
`;



const MediaBadge = styled.View`
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 12px;
  padding: 4px 8px;
`;

const MediaCaption = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.secondaryText};
  font-style: italic;
  margin-top: 4px;
`;

const ExerciseDescription = styled.Text`
  font-size: 15px;
  line-height: 22px;
  color: ${({ theme }) => theme.colors.text};
  margin-top: 8px;
  padding: 12px;
  background-color: ${({ theme }) => theme.colors.card};
  border-radius: 8px;
  border-left-width: 3px;
  border-left-color: ${({ theme }) => theme.colors.primary};
`;

const TipCard = styled.View`
  flex-direction: row;
  align-items: flex-start;
  background-color: ${({ theme }) => theme.colors.card};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
`;

const TipText = styled.Text`
  flex: 1;
  font-size: 15px;
  line-height: 22px;
  color: ${({ theme }) => theme.colors.text};
  margin-left: 12px;
`;

export default WorkoutDetailScreen;