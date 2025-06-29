import React, { useState, useCallback } from 'react';
import {
  FlatList,
  RefreshControl,
  View,
  StyleSheet,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FastImage from 'react-native-fast-image';
import { useAuthStore } from '../store/authStore';
import { useQuery, useMutation } from '@apollo/client';
import { GET_SOCIAL_FEED, ADD_COMMENT, LIKE_POST, CREATE_FEED_POST, DELETE_FEED_POST, UPDATE_FEED_POST } from '../graphql/queries';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { Picker } from '@react-native-picker/picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// New Components
import { Screen, Header } from '../components/layout';
import { Card, CardHeader, CardContent, Button, Avatar as UIAvatar, Modal as UIModal, LoadingSpinner } from '../components/ui';
import { ScreenTransition } from '../components/navigation';
import { ThemeType } from '../styles/theme';
import { getActivityIcon as getActivityIconUtil } from '../utils/getHealthTipIcon';

const { width } = Dimensions.get('window');

const ACTIVITY_TYPES = [
  { label: 'Workout', value: 'workout' },
  { label: 'Nutrition', value: 'nutrition' },
  { label: 'Achievement', value: 'achievement' },
  { label: 'General', value: 'general' },
];

interface FeedComment {
  user: {
    id?: string;
    firstName?: string;
    lastName?: string;
    name: string;
    avatar?: string;
  };
  comment: string;
  createdAt: string;
}

interface FeedPost {
  id: string;
  user: {
    id?: string;
    firstName?: string;
    lastName?: string;
    name: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
  image?: string;
  likes: number;
  likedByCurrentUser?: boolean;
  comments: FeedComment[];
  activityType?: 'workout' | 'nutrition' | 'achievement' | 'general';
  activityValue?: string;
}

const SocialFeed: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuthStore();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();

  const [refreshing, setRefreshing] = useState(false);
  const [likeLoading, setLikeLoading] = useState<string | null>(null);
  const [commentingPostId, setCommentingPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [openCommentsPostId, setOpenCommentsPostId] = useState<string | null>(null);

  const { loading, error, data, refetch } = useQuery(GET_SOCIAL_FEED, {
    fetchPolicy: 'cache-and-network',
  });

  const [likePost] = useMutation(LIKE_POST);
  const [addComment] = useMutation(ADD_COMMENT);
  const [createFeedPost] = useMutation(CREATE_FEED_POST);
  const [deleteFeedPost] = useMutation(DELETE_FEED_POST);
  const [updateFeedPost] = useMutation(UPDATE_FEED_POST);

  const [showPostModal, setShowPostModal] = useState(false);
  const [postForm, setPostForm] = useState({
    content: '',
    activityType: '',
    activityValue: '',
    image: '',
  });
  const [creating, setCreating] = useState(false);
  const [editingPost, setEditingPost] = useState<FeedPost | null>(null);

  const posts: FeedPost[] = data?.getSocialFeed || [];

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  // --- Like handler ---
  const handleLike = async (postId: string) => {
    if (likeLoading === postId) return;
    setLikeLoading(postId);
    try {
      await likePost({ variables: { id: postId } });
      refetch();
    } catch (e) {
      Alert.alert('Error', 'Could not like post.');
    } finally {
      setLikeLoading(null);
    }
  };

  // --- Comment handler ---
  const handleAddComment = async (postId: string) => {
    if (!commentText.trim()) return;
    try {
      await addComment({ variables: { id: postId, comment: commentText.trim() } });
      setCommentText('');
      setCommentingPostId(null);
      refetch();
    } catch (e) {
      Alert.alert('Error', 'Could not add comment.');
    }
  };

  // --- Post create/edit handler ---
const handleSubmitPost = async () => {
  if (!postForm.content.trim()) return;
  setCreating(true);
  try {
    if (!user) {
      Alert.alert('Error', 'User not found.');
      setCreating(false);
      return;
    }
    if (editingPost) {
      // Use UPDATE_FEED_POST for editing
      await updateFeedPost({
        variables: {
          id: editingPost.id,
          input: {
            content: postForm.content,
            activityType: postForm.activityType,
            activityValue: postForm.activityValue,
            image: postForm.image,
          },
        },
      });
    } else {
      // Use CREATE_FEED_POST for new post
      await createFeedPost({
        variables: {
          input: {
            content: postForm.content,
            activityType: postForm.activityType,
            activityValue: postForm.activityValue,
            image: postForm.image,
          },
        },
      });
    }
    setShowPostModal(false);
    setPostForm({ content: '', activityType: '', activityValue: '', image: '' });
    setEditingPost(null);
    refetch();
  } catch (e) {
    Alert.alert('Error', 'Could not save post.');
  } finally {
    setCreating(false);
  }
};

  // --- Post delete handler ---
  const handleDeletePost = async () => {
    if (!editingPost) return;
    Alert.alert('Delete Post', 'Are you sure you want to delete this post?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteFeedPost({ variables: { id: editingPost.id } });
            setShowPostModal(false);
            setEditingPost(null);
            setPostForm({ content: '', activityType: '', activityValue: '' , image: ''});
            refetch();
          } catch (e) {
            Alert.alert('Error', 'Could not delete post.');
          }
        },
      },
    ]);
  };

  // --- Render ---
  if (loading && !refreshing) {
    return (
      <Screen variant="default" padding>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <LoadingSpinner size="large" variant="gradient" />
        </View>
      </Screen>
    );
  }

  if (error) {
    return (
      <Container>
        <EmptyText>Error loading feed.</EmptyText>
        <FlatList
          data={[]}
          renderItem={() => null}
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
    <ScreenTransition type="slideUp">
      <Screen variant="default" scrollable={false} padding={false}>
        <Header
          title="Community Feed"
          subtitle="See what others are achieving and get inspired!"
          variant="gradient"
          rightIcon="add"
          onRightPress={() => {
            setEditingPost(null);
            setPostForm({ content: '', activityType: '', activityValue: '', image: '' });
            setShowPostModal(true);
          }}
        />
        {posts.length === 0 ? (
          <EmptyState>
            <Icon name="people" size={40} color={theme.colors.secondary} />
            <EmptyText>No posts yet. Start by sharing your progress!</EmptyText>
          </EmptyState>
        ) : (
          <FlatList
            data={posts}
            keyExtractor={item => item.id}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[theme.colors.primary]}
                tintColor={theme.colors.primary}
              />
            }
            renderItem={({ item }) => (
              <Card variant="default" margin="medium" padding="medium">
                <CardHeader>
                  <UIAvatar
                    source={item.user.avatar}
                    name={item.user.name}
                    size="medium"
                  />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <FeedUserName>{item.user.name}</FeedUserName>
                    <FeedDate>{formatDate(item.createdAt)}</FeedDate>
                  </View>
                  {item.activityType && (
                    <ActivityBadge>
                      <Icon name={getActivityIcon(item.activityType)} size={16} color={theme.colors.white} />
                      <ActivityBadgeText>
                        {item.activityType === 'workout' && (item.activityValue ? `${item.activityValue}` : 'Workout')}
                        {item.activityType === 'nutrition' && (item.activityValue ? `${item.activityValue}` : 'Nutrition')}
                        {item.activityType === 'achievement' && (item.activityValue ? `${item.activityValue}` : 'Achievement')}
                        {item.activityType === 'general' && (item.activityValue ? `${item.activityValue}` : 'General')}
                      </ActivityBadgeText>
                    </ActivityBadge>
                  )}
                </CardHeader>
              <FeedContent>{item.content}</FeedContent>
              {item.image && (
                <FeedImage source={{ uri: item.image }} />
              )}
              <FeedActions>
                <Action
                  onPress={() => handleLike(item.id)}
                  disabled={likeLoading === item.id}
                  activeOpacity={0.7}
                >
                  <Icon
                    name={item.likedByCurrentUser ? 'thumb-up' : 'thumb-up-off-alt'}
                    size={18}
                    color={item.likedByCurrentUser ? theme.colors.primary : theme.colors.secondaryText}
                  />
                  <ActionText>
                    {item.likes}
                  </ActionText>
                </Action>
                <Action
                  onPress={() =>
                    setOpenCommentsPostId(openCommentsPostId === item.id ? null : item.id)
                  }
                  activeOpacity={0.7}
                >
                  <Icon name="chat-bubble-outline" size={18} color={theme.colors.secondaryText} />
                  <ActionText>{item.comments?.length || 0}</ActionText>
                </Action>
                {/* Spacer to push edit icon to the right */}
                <View style={{ flex: 1 }} />
                {user && item.user.id === user.id && (
                  <EditAction onPress={() => {
                    setEditingPost(item);
                    setPostForm({
                      content: item.content,
                      activityType: item.activityType || '',
                      activityValue: item.activityValue || '',
                      image: item.image || '',
                    });
                    setShowPostModal(true);
                  }}>
                    <Icon name="edit" size={18} color={theme.colors.primary} />
                  </EditAction>
                )}
              </FeedActions>

              {openCommentsPostId === item.id && (
                <>
                  {item.comments && item.comments.length > 0 && (
                    <CommentsContainer>
                      {item.comments.slice(-3).map((c, idx) => (
                        <CommentRow key={idx}>
                          {c.user.avatar ? (
                            <CommentAvatar source={{ uri: c.user.avatar }} />
                          ) : (
                            <CommentAvatarPlaceholder>
                              <Icon name="person" size={16} color={theme.colors.primary} />
                            </CommentAvatarPlaceholder>
                          )}
                          <CommentBubble>
                            <CommentUser>{c.user.name}</CommentUser>
                            <CommentText>{c.comment}</CommentText>
                            <CommentDate>{formatDate(c.createdAt)}</CommentDate>
                          </CommentBubble>
                        </CommentRow>
                      ))}
                      {item.comments.length > 3 && (
                        <MoreCommentsText>View all {item.comments.length} comments</MoreCommentsText>
                      )}
                    </CommentsContainer>
                  )}
                  <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    keyboardVerticalOffset={80}
                  >
                    <CommentInputRow>
                      <CommentInput
                        placeholder="Add a comment..."
                        value={commentText}
                        onChangeText={setCommentText}
                        placeholderTextColor={theme.colors.secondaryText}
                      />
                      <SendButton onPress={() => handleAddComment(item.id)}>
                        <Icon name="send" size={20} color={theme.colors.primary} />
                      </SendButton>
                    </CommentInputRow>
                  </KeyboardAvoidingView>
                </>
              )}
              </Card>
          )}
          contentContainerStyle={{ paddingBottom: 40 }}
          />
        )}

        {/* Create Post Modal */}
        <UIModal
          visible={showPostModal}
          onClose={() => {
            setShowPostModal(false);
            setEditingPost(null);
          }}
          title={editingPost ? 'Edit Post' : 'Create Post'}
          variant="bottom"
        >
          <View>
            <TextInput
              placeholder="What's on your mind?"
              value={postForm.content}
              onChangeText={text => setPostForm(f => ({ ...f, content: text }))}
              multiline
              style={{
                minHeight: 80,
                marginBottom: 12,
                color: theme.colors.text,
                backgroundColor: theme.colors.surface,
                borderRadius: 8,
                padding: 12,
                borderWidth: 1,
                borderColor: theme.colors.border,
              }}
              placeholderTextColor={theme.colors.secondaryText}
            />

            <Picker
              selectedValue={postForm.activityType}
              onValueChange={val => setPostForm(f => ({ ...f, activityType: val }))}
              style={{
                marginBottom: 12,
                color: theme.colors.text,
                backgroundColor: theme.colors.surface,
                borderRadius: 8,
              }}
            >
              <Picker.Item label="Select Activity Type" value="" />
              {ACTIVITY_TYPES.map(type => (
                <Picker.Item key={type.value} label={type.label} value={type.value} />
              ))}
            </Picker>

            {postForm.activityType && (
              <TextInput
                placeholder="Activity Value (optional)"
                value={postForm.activityValue}
                onChangeText={val => setPostForm(f => ({ ...f, activityValue: val }))}
                style={{
                  marginBottom: 12,
                  color: theme.colors.text,
                  backgroundColor: theme.colors.surface,
                  borderRadius: 8,
                  padding: 12,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                }}
                placeholderTextColor={theme.colors.secondaryText}
              />
            )}

            <TextInput
              placeholder="Image URL (optional)"
              value={postForm.image || ''}
              onChangeText={val => setPostForm(f => ({ ...f, image: val }))}
              style={{
                marginBottom: 20,
                color: theme.colors.text,
                backgroundColor: theme.colors.surface,
                borderRadius: 8,
                padding: 12,
                borderWidth: 1,
                borderColor: theme.colors.border,
              }}
              placeholderTextColor={theme.colors.secondaryText}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              {editingPost && (
                <Button
                  title="Delete"
                  variant="ghost"
                  onPress={handleDeletePost}
                  icon="delete"
                />
              )}
              <Button
                title={creating ? 'Posting...' : editingPost ? 'Update' : 'Post'}
                variant="primary"
                disabled={creating || !postForm.content.trim()}
                loading={creating}
                onPress={handleSubmitPost}
                style={{ marginLeft: 'auto' }}
              />
            </View>
          </View>
        </UIModal>
      </Screen>
    </ScreenTransition>
  );
};

// ...styled components and helpers remain unchanged...
// --- Helpers ---
function formatDate(dateInput: string | number) {
  let date: Date;

  // If it's a number or a string that looks like a number, treat as timestamp
  if (
    typeof dateInput === 'number' ||
    (typeof dateInput === 'string' && /^\d+$/.test(dateInput))
  ) {
    date = new Date(Number(dateInput));
  } else {
    date = new Date(dateInput);
  }

  if (isNaN(date.getTime())) {
    return String(dateInput); // fallback: show raw value if parsing fails
  }

  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getActivityIcon(type?: string) {
  switch (type) {
    case 'workout':
      return 'fitness-center';
    case 'nutrition':
      return 'restaurant';
    case 'achievement':
      return 'emoji-events';
    case 'general':
      return 'info';
    default:
      return 'info';
  }
}

// --- Styled Components ---
const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const HeaderTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.white};
`;

const HeaderSubtitle = styled.Text`
  font-size: 14px;
  color: rgba(255,255,255,0.85);
  margin-top: 4px;
`;

const FeedCard = styled.View`
  position: relative;
  background-color: ${({ theme }) => theme.colors.card};
  border-radius: 14px;
  margin: 12px 18px;
  padding: 16px 14px 10px 14px;
  elevation: 2;
  shadow-color: #000;
  shadow-opacity: 0.04;
  shadow-radius: 4px;
  shadow-offset: 0px 1px;
`;

const FeedHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

const Avatar = styled(FastImage)`
  width: 38px;
  height: 38px;
  border-radius: 19px;
  background-color: ${({ theme }) => theme.colors.border};
`;

const AvatarPlaceholder = styled.View`
  width: 38px;
  height: 38px;
  border-radius: 19px;
  background-color: ${({ theme }) => theme.colors.border};
  align-items: center;
  justify-content: center;
`;

const FeedUserName = styled.Text`
  font-weight: 600;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text};
`;

const FeedDate = styled.Text`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.secondaryText};
`;

const ActivityBadge = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 10px;
  padding: 2px 8px;
  margin-left: 8px;
`;

const ActivityBadgeText = styled.Text`
  color: ${({ theme }) => theme.colors.white};
  font-size: 12px;
  margin-left: 4px;
`;

const FeedContent = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 8px;
`;

const FeedImage = styled(FastImage)`
  width: 100%;
  height: ${width * 0.45}px;
  border-radius: 10px;
  margin-bottom: 8px;
`;

const FeedActions = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 4px;
`;

const Action = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-right: 18px;
`;

const ActionText = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.secondaryText};
  margin-left: 4px;
`;

const EmptyState = styled.View`
  align-items: center;
  padding: 40px 20px;
`;

const EmptyText = styled.Text`
  text-align: center;
  margin: 40px 0;
  color: ${({ theme }) => theme.colors.secondaryText};
  font-size: 15px;
`;

const CommentInputRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin: 8px 0 0 0;
  padding: 0 4px;
`;

const CommentInput = styled.TextInput`
  flex: 1;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  border-radius: 18px;
  padding: 8px 14px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.background};
`;

const SendButton = styled.TouchableOpacity`
  margin-left: 8px;
  padding: 6px;
`;

const CommentsContainer = styled.View`
  margin-top: 8px;
`;

const CommentRow = styled.View`
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: 6px;
`;

const CommentAvatar = styled(FastImage)`
  width: 22px;
  height: 22px;
  border-radius: 11px;
  background-color: ${({ theme }) => theme.colors.border};
  margin-right: 8px;
`;

const CommentAvatarPlaceholder = styled.View`
  width: 22px;
  height: 22px;
  border-radius: 11px;
  background-color: ${({ theme }) => theme.colors.border};
  align-items: center;
  justify-content: center;
  margin-right: 8px;
`;

const CommentBubble = styled.View`
  background-color: ${({ theme }) => theme.colors.card};
  border-radius: 10px;
  padding: 6px 10px;
  flex: 1;
`;

const CommentUser = styled.Text`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const CommentText = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text};
`;

const CommentDate = styled.Text`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.secondaryText};
  margin-top: 2px;
`;

const MoreCommentsText = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.secondaryText};
  margin-left: 30px;
  margin-bottom: 4px;
`;

const FAB = styled.TouchableOpacity`
  position: absolute;
  bottom: 32px;
  right: 24px;
  background: ${({ theme }) => theme.colors.primary};
  width: 56px;
  height: 56px;
  border-radius: 28px;
  align-items: center;
  justify-content: center;
  elevation: 6;
  z-index: 10;
`;

const ModalOverlay = styled.View`
  flex: 1;
  background: rgba(0,0,0,0.35);
  justify-content: flex-end;
`;

const ModalContent = styled.View`
  background: ${({ theme }) => theme.colors.background};
  border-top-left-radius: 18px;
  border-top-right-radius: 18px;
  padding: 24px 18px 32px 18px;
`;

const ModalTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 12px;
`;

const ModalActions = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 18px;
`;

const SubmitButton = styled.TouchableOpacity`
  background: ${({ theme }) => theme.colors.primary};
  padding: 10px 22px;
  border-radius: 8px;
`;

const SubmitText = styled.Text`
  color: ${({ theme }) => theme.colors.white};
  font-weight: 600;
  font-size: 15px;
`;

const DeleteButton = styled.TouchableOpacity`
  margin-right: 18px;
`;

const EditIcon = styled.TouchableOpacity`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
  background: ${({ theme }) => theme.colors.card};
  border-radius: 16px;
  padding: 4px;
`;

const CloseIcon = styled.TouchableOpacity`
  position: absolute;
  top: 14px;
  right: 14px;
  z-index: 10;
  padding: 6px;
`;

const EditAction = styled.TouchableOpacity`
  padding: 6px;
  margin-left: 8px;
`;

const styles = StyleSheet.create({
  headerGradient: {
    padding: 18,
    paddingTop: 38,
    // borderBottomLeftRadius: 20,
    // borderBottomRightRadius: 20,
    marginBottom: 8,
    elevation: 2,
  },
});

export default SocialFeed;