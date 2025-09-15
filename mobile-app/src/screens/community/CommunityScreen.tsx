import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Input,
  IconButton,
  Icon,
  Avatar,
  Divider,
  Pressable,
  Badge,
  Switch,
  Button,
  ScrollView,
  useTheme,
  useToast,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { CommunityPost } from '../../types';

// Mock data for demo
const MOCK_POSTS: CommunityPost[] = [
  {
    id: '1',
    content: 'I\'ve been feeling really overwhelmed with college assignments lately. Any tips on managing academic stress?',
    authorId: 'anonymous',
    authorName: 'Anonymous',
    isAnonymous: true,
    likes: 12,
    comments: 4,
    createdAt: new Date(Date.now() - 3600000 * 3),
  },
  {
    id: '2',
    content: 'Just completed a 10-day meditation challenge and feeling so much calmer. The Arjuna persona really helped guide me through it!',
    authorId: 'user2',
    authorName: 'PeacefulMind',
    isAnonymous: false,
    likes: 25,
    comments: 7,
    createdAt: new Date(Date.now() - 3600000 * 24),
  },
  {
    id: '3',
    content: 'Has anyone tried the breathing exercises in the Wellness section? I\'m curious if they actually help with anxiety.',
    authorId: 'user3',
    authorName: 'WellnessSeeker',
    isAnonymous: false,
    likes: 8,
    comments: 12,
    createdAt: new Date(Date.now() - 3600000 * 48),
  },
  {
    id: '4',
    content: 'Today I took a nature walk as suggested by Maya, and it really helped clear my mind. Sometimes simple solutions are the best!',
    authorId: 'user4',
    authorName: 'GreenTherapy',
    isAnonymous: false,
    likes: 32,
    comments: 5,
    createdAt: new Date(Date.now() - 3600000 * 72),
  },
  {
    id: '5',
    content: 'I struggle with social anxiety and find it hard to make friends in college. Anyone else in the same situation?',
    authorId: 'anonymous',
    authorName: 'Anonymous',
    isAnonymous: true,
    likes: 41,
    comments: 18,
    createdAt: new Date(Date.now() - 3600000 * 96),
  },
];

const CommunityScreen = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const toast = useToast();
  
  const [posts, setPosts] = useState<CommunityPost[]>(MOCK_POSTS);
  const [newPostText, setNewPostText] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  // Format relative time
  const getRelativeTime = (date: Date) => {
    const hours = Math.floor((Date.now() - date.getTime()) / 3600000);
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (hours < 48) return 'Yesterday';
    return `${Math.floor(hours / 24)}d ago`;
  };

  // Handle post creation
  const handleCreatePost = () => {
    if (!newPostText.trim()) return;
    
    const newPost: CommunityPost = {
      id: Date.now().toString(),
      content: newPostText,
      authorId: isAnonymous ? 'anonymous' : user?.id || 'unknown',
      authorName: isAnonymous ? 'Anonymous' : user?.username || 'Unknown',
      isAnonymous,
      likes: 0,
      comments: 0,
      createdAt: new Date(),
    };
    
    setPosts([newPost, ...posts]);
    setNewPostText('');
    
    toast.show({
      description: 'Your post has been shared with the community',
      placement: 'top',
    });
  };

  // Handle like action
  const handleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, likes: post.likes + 1 };
      }
      return post;
    }));
  };

  // Filter posts
  const getFilteredPosts = () => {
    switch (activeFilter) {
      case 'anonymous':
        return posts.filter(post => post.isAnonymous);
      case 'popular':
        return [...posts].sort((a, b) => b.likes - a.likes);
      case 'recent':
        return [...posts].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      default:
        return posts;
    }
  };

  const filteredPosts = getFilteredPosts();

  return (
    <Box flex={1} bg="white" safeArea>
      <ScrollView>
        <VStack space={4} p={4}>
          {/* Community Header */}
          <Heading size="lg" color="primary.600">Community Support</Heading>
          <Text color="gray.600" mb={2}>
            Connect with peers, share experiences, and support each other anonymously
          </Text>
          
          {/* Create Post */}
          <Box bg="gray.50" rounded="lg" p={4} shadow={1}>
            <VStack space={3}>
              <Text fontWeight="medium" color="gray.700">Share with the community</Text>
              <Input
                placeholder="What's on your mind?"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                height={100}
                value={newPostText}
                onChangeText={setNewPostText}
              />
              <HStack justifyContent="space-between" alignItems="center">
                <HStack space={2} alignItems="center">
                  <Switch 
                    size="sm" 
                    isChecked={isAnonymous}
                    onToggle={() => setIsAnonymous(!isAnonymous)}
                  />
                  <Text fontSize="sm" color="gray.600">Post anonymously</Text>
                </HStack>
                <Button
                  onPress={handleCreatePost}
                  isDisabled={!newPostText.trim()}
                  leftIcon={<Icon as={Ionicons} name="send" size="sm" />}
                >
                  Share
                </Button>
              </HStack>
            </VStack>
          </Box>
          
          {/* Filters */}
          <HStack space={2} my={2}>
            {['all', 'anonymous', 'popular', 'recent'].map((filter) => (
              <Pressable key={filter} onPress={() => setActiveFilter(filter)}>
                <Badge
                  colorScheme={activeFilter === filter ? 'primary' : 'gray'}
                  variant={activeFilter === filter ? 'solid' : 'outline'}
                  rounded="full"
                  px={3}
                  py={1}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Badge>
              </Pressable>
            ))}
          </HStack>
          
          {/* Posts List */}
          <VStack space={4} mt={2}>
            {filteredPosts.map((post) => (
              <Box
                key={post.id}
                bg="white"
                rounded="lg"
                borderWidth={1}
                borderColor="gray.200"
                p={4}
                shadow={1}
              >
                <VStack space={3}>
                  {/* Author info */}
                  <HStack space={2} alignItems="center">
                    {post.isAnonymous ? (
                      <Avatar
                        bg="gray.400"
                        size="sm"
                      >
                        <Icon as={Ionicons} name="person" color="white" size="sm" />
                      </Avatar>
                    ) : (
                      <Avatar
                        bg="primary.500"
                        size="sm"
                      >
                        {post.authorName.charAt(0).toUpperCase()}
                      </Avatar>
                    )}
                    <VStack>
                      <Text fontWeight="bold">{post.authorName}</Text>
                      <Text fontSize="xs" color="gray.500">{getRelativeTime(new Date(post.createdAt))}</Text>
                    </VStack>
                    {post.isAnonymous && (
                      <Badge ml="auto" colorScheme="gray" variant="subtle" rounded="md">
                        Anonymous
                      </Badge>
                    )}
                  </HStack>
                  
                  {/* Post content */}
                  <Text>{post.content}</Text>
                  
                  <Divider my={2} />
                  
                  {/* Actions */}
                  <HStack justifyContent="space-between">
                    <Pressable onPress={() => handleLike(post.id)}>
                      <HStack space={1} alignItems="center">
                        <Icon as={Ionicons} name="heart-outline" size="sm" color="gray.500" />
                        <Text color="gray.500">{post.likes}</Text>
                      </HStack>
                    </Pressable>
                    
                    <Pressable>
                      <HStack space={1} alignItems="center">
                        <Icon as={Ionicons} name="chatbubble-outline" size="sm" color="gray.500" />
                        <Text color="gray.500">{post.comments}</Text>
                      </HStack>
                    </Pressable>
                    
                    <Pressable>
                      <HStack space={1} alignItems="center">
                        <Icon as={Ionicons} name="share-outline" size="sm" color="gray.500" />
                        <Text color="gray.500">Share</Text>
                      </HStack>
                    </Pressable>
                  </HStack>
                </VStack>
              </Box>
            ))}
          </VStack>
        </VStack>
      </ScrollView>
    </Box>
  );
};

export default CommunityScreen;
