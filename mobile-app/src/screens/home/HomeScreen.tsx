import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Divider,
  Icon,
  Avatar,
  ScrollView,
  Progress,
  Pressable,
  Badge,
  useTheme,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { Challenge, HealthData } from '../../types';

// Mock data for demo
const mockHealthData: HealthData = {
  sleepHours: [7.5, 6.2, 8.1, 7.8, 7.0, 6.5, 7.2],
  activitySteps: [8500, 6200, 12000, 9500, 10800, 7500, 11200],
  moodScores: [7, 5, 8, 7, 8, 6, 7],
  screenTimeHours: [4.2, 5.8, 3.5, 4.1, 3.8, 5.2, 3.9],
  date: new Date(),
};

const mockChallenges: Challenge[] = [
  {
    id: '1',
    title: 'Morning Meditation',
    description: 'Complete a 5-minute meditation after waking up',
    points: 100,
    isCompleted: true,
    category: 'mindfulness'
  },
  {
    id: '2',
    title: 'Nature Walk',
    description: 'Take a 15-minute walk outdoors',
    points: 150,
    isCompleted: false,
    category: 'activity'
  },
  {
    id: '3',
    title: 'Gratitude Journal',
    description: 'Write down 3 things you are grateful for',
    points: 75,
    isCompleted: false,
    category: 'wellness'
  }
];

const HomeScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const theme = useTheme();
  const [weeklyScore, setWeeklyScore] = useState(76); // Mock wellness score

  // Calculate averages from health data
  const avgSleep = mockHealthData.sleepHours.reduce((a, b) => a + b, 0) / mockHealthData.sleepHours.length;
  const avgMood = mockHealthData.moodScores.reduce((a, b) => a + b, 0) / mockHealthData.moodScores.length;
  const avgScreenTime = mockHealthData.screenTimeHours.reduce((a, b) => a + b, 0) / mockHealthData.screenTimeHours.length;

  const navigateToChat = () => {
    // @ts-ignore - navigation typing issue
    navigation.navigate('Chat');
  };

  return (
    <ScrollView flex={1} bg="white">
      <Box safeArea p={4}>
        {/* Welcome Header */}
        <HStack justifyContent="space-between" alignItems="center" mb={4}>
          <VStack>
            <Text fontSize="md" color="gray.500">Welcome back,</Text>
            <Heading size="lg" color="primary.500">
              {user?.username || 'Friend'}
            </Heading>
          </VStack>
          <Avatar 
            bg="primary.500" 
            size="md"
          >
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </Avatar>
        </HStack>

        {/* Wellness Score Card */}
        <Box 
          bg="primary.100" 
          rounded="xl" 
          p={4} 
          mb={5}
          shadow={2}
        >
          <HStack justifyContent="space-between" alignItems="center" mb={2}>
            <Heading size="md" color="primary.800">Weekly Wellness</Heading>
            <Badge colorScheme={weeklyScore > 70 ? "success" : "warning"} rounded="md">
              {weeklyScore}/100
            </Badge>
          </HStack>
          <Progress 
            value={weeklyScore} 
            max={100} 
            colorScheme={weeklyScore > 70 ? "success" : "warning"} 
            size="md" 
            mb={2}
          />
          <HStack justifyContent="space-around" mt={3}>
            <VStack alignItems="center">
              <HStack alignItems="center">
                <Icon as={Ionicons} name="bed-outline" color="primary.600" size="sm" mr={1} />
                <Text fontWeight="bold">{avgSleep.toFixed(1)}h</Text>
              </HStack>
              <Text fontSize="xs" color="gray.500">Sleep</Text>
            </VStack>
            
            <VStack alignItems="center">
              <HStack alignItems="center">
                <Icon as={Ionicons} name="happy-outline" color="primary.600" size="sm" mr={1} />
                <Text fontWeight="bold">{avgMood.toFixed(1)}/10</Text>
              </HStack>
              <Text fontSize="xs" color="gray.500">Mood</Text>
            </VStack>
            
            <VStack alignItems="center">
              <HStack alignItems="center">
                <Icon as={Ionicons} name="phone-portrait-outline" color="primary.600" size="sm" mr={1} />
                <Text fontWeight="bold">{avgScreenTime.toFixed(1)}h</Text>
              </HStack>
              <Text fontSize="xs" color="gray.500">Screen</Text>
            </VStack>
          </HStack>
        </Box>

        {/* Quick Actions */}
        <Heading size="sm" mb={3} color="gray.600">Quick Actions</Heading>
        <HStack space={3} mb={5}>
          <Pressable 
            flex={1} 
            bg="secondary.100" 
            rounded="lg" 
            p={3} 
            onPress={navigateToChat}
            alignItems="center"
          >
            <Icon as={Ionicons} name="chatbubble-ellipses" size="lg" color="secondary.600" mb={1} />
            <Text fontWeight="medium" color="secondary.600">Talk Now</Text>
          </Pressable>
          
          <Pressable 
            flex={1} 
            bg="success.100" 
            rounded="lg" 
            p={3} 
            alignItems="center"
          >
            <Icon as={Ionicons} name="leaf" size="lg" color="success.600" mb={1} />
            <Text fontWeight="medium" color="success.600">Breathe</Text>
          </Pressable>
          
          <Pressable 
            flex={1} 
            bg="info.100" 
            rounded="lg" 
            p={3} 
            alignItems="center"
          >
            <Icon as={Ionicons} name="journal" size="lg" color="info.600" mb={1} />
            <Text fontWeight="medium" color="info.600">Journal</Text>
          </Pressable>
        </HStack>

        {/* Today's Challenges */}
        <Heading size="sm" mb={3} color="gray.600">Today's Challenges</Heading>
        <VStack space={3} mb={5}>
          {mockChallenges.map(challenge => (
            <HStack 
              key={challenge.id} 
              bg="gray.50" 
              p={3} 
              rounded="md" 
              space={3} 
              alignItems="center"
            >
              <Box 
                rounded="full" 
                p={2} 
                bg={challenge.isCompleted ? "success.100" : "warmGray.100"}
              >
                <Icon 
                  as={Ionicons} 
                  name={challenge.isCompleted ? "checkmark-circle" : "hourglass-outline"} 
                  color={challenge.isCompleted ? "success.600" : "warmGray.400"} 
                  size="md"
                />
              </Box>
              <VStack flex={1}>
                <Text fontWeight="medium">{challenge.title}</Text>
                <Text fontSize="xs" color="gray.500">{challenge.description}</Text>
              </VStack>
              <Badge colorScheme="purple" variant="outline">
                {challenge.points} pts
              </Badge>
            </HStack>
          ))}
          
          <Button 
            variant="subtle" 
            colorScheme="secondary" 
            size="sm"
            leftIcon={<Icon as={Ionicons} name="add-circle-outline" />}
          >
            View More Challenges
          </Button>
        </VStack>

        {/* Wellness Tip */}
        <Box bg="amber.100" p={4} rounded="lg" mb={5}>
          <HStack alignItems="center" space={2} mb={2}>
            <Icon as={Ionicons} name="bulb-outline" size="md" color="amber.600" />
            <Heading size="sm" color="amber.600">Today's Wellness Tip</Heading>
          </HStack>
          <Text color="amber.800">
            Taking short breaks throughout your day can boost productivity and reduce mental fatigue. 
            Try the 25/5 Pomodoro technique to maintain focus while giving your mind regular rest.
          </Text>
        </Box>
      </Box>
    </ScrollView>
  );
};

export default HomeScreen;
