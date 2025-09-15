import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Image,
  ScrollView,
  Pressable,
  Icon,
  Divider,
  Button,
  Progress,
  Avatar,
  useTheme,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = () => {
  const theme = useTheme();
  
  // Mock user data
  const [user, setUser] = useState({
    name: 'Aisha Kumar',
    email: 'aisha.kumar@example.com',
    profilePicture: 'https://randomuser.me/api/portraits/women/44.jpg',
    joinDate: new Date(2023, 1, 15),
    therapySessions: 12,
    streak: 7,
    nextAppointment: new Date(2023, 6, 28),
  });

  // Mock statistics
  const [stats, setStats] = useState({
    moodScore: 74,
    chatInteractions: 32,
    journalEntries: 18,
    meditationMinutes: 240,
  });

  // Mock achievements
  const achievements = [
    { id: '1', name: 'First Chat', description: 'Started your first AI chat session', completed: true, icon: 'chatbubble-outline' },
    { id: '2', name: 'Consistent Journal', description: 'Journaled for 7 consecutive days', completed: true, icon: 'journal-outline' },
    { id: '3', name: 'Meditation Master', description: 'Completed 10 meditation sessions', completed: true, icon: 'leaf-outline' },
    { id: '4', name: 'Support Network', description: 'Connected with the community', completed: false, icon: 'people-outline' },
    { id: '5', name: 'Wellness Expert', description: 'Used all wellness tools', completed: false, icon: 'heart-outline' },
  ];

  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Box flex={1} bg="white" safeArea>
      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack space={6} p={5}>
          {/* Profile Header */}
          <VStack space={2} alignItems="center">
            <Avatar 
              source={{uri: user.profilePicture}} 
              size="xl" 
              borderWidth={3} 
              borderColor="primary.500"
            />
            <Heading size="lg" mt={2}>{user.name}</Heading>
            <Text color="gray.500">{user.email}</Text>
            <Text fontSize="xs" color="gray.400">
              Member since {formatDate(user.joinDate)}
            </Text>

            <Button
              mt={4}
              leftIcon={<Icon as={Ionicons} name="create-outline" size="sm" />}
              variant="outline"
            >
              Edit Profile
            </Button>
          </VStack>

          <Divider />
          
          {/* Wellness Stats */}
          <VStack space={4}>
            <Heading size="md" color="gray.700">Wellness Stats</Heading>

            <Box bg="primary.100" p={4} rounded="lg">
              <VStack space={2}>
                <HStack justifyContent="space-between">
                  <Text fontSize="sm" fontWeight="medium" color="gray.600">
                    Overall Wellness Score
                  </Text>
                  <Text fontWeight="bold" color="primary.600">{stats.moodScore}%</Text>
                </HStack>
                <Progress value={stats.moodScore} colorScheme="primary" size="md" />
              </VStack>
            </Box>

            <HStack space={4} justifyContent="space-between">
              <Box flex={1} bg="cyan.50" p={3} rounded="lg">
                <VStack space={1} alignItems="center">
                  <Icon 
                    as={Ionicons} 
                    name="chatbubble-ellipses-outline" 
                    size="lg" 
                    color="cyan.600" 
                  />
                  <Text fontWeight="bold" fontSize="xl" color="cyan.600">
                    {stats.chatInteractions}
                  </Text>
                  <Text fontSize="xs" textAlign="center" color="gray.500">
                    Chat Sessions
                  </Text>
                </VStack>
              </Box>

              <Box flex={1} bg="purple.50" p={3} rounded="lg">
                <VStack space={1} alignItems="center">
                  <Icon 
                    as={Ionicons} 
                    name="journal-outline" 
                    size="lg" 
                    color="purple.600" 
                  />
                  <Text fontWeight="bold" fontSize="xl" color="purple.600">
                    {stats.journalEntries}
                  </Text>
                  <Text fontSize="xs" textAlign="center" color="gray.500">
                    Journal Entries
                  </Text>
                </VStack>
              </Box>

              <Box flex={1} bg="green.50" p={3} rounded="lg">
                <VStack space={1} alignItems="center">
                  <Icon 
                    as={Ionicons} 
                    name="leaf-outline" 
                    size="lg" 
                    color="green.600" 
                  />
                  <Text fontWeight="bold" fontSize="xl" color="green.600">
                    {stats.meditationMinutes}
                  </Text>
                  <Text fontSize="xs" textAlign="center" color="gray.500">
                    Minutes Meditating
                  </Text>
                </VStack>
              </Box>
            </HStack>
          </VStack>

          {/* Current Streak */}
          <VStack space={2}>
            <Heading size="md" color="gray.700">Current Streak</Heading>
            
            <Box bg="amber.50" p={4} rounded="lg">
              <HStack space={3} alignItems="center">
                <Icon 
                  as={Ionicons} 
                  name="flame-outline" 
                  size="xl" 
                  color="amber.600" 
                />
                <VStack>
                  <Text fontWeight="bold" fontSize="lg" color="amber.600">
                    {user.streak} Days
                  </Text>
                  <Text fontSize="xs" color="gray.600">
                    Keep using the app to build your streak!
                  </Text>
                </VStack>
              </HStack>
            </Box>
          </VStack>

          {/* Achievements */}
          <VStack space={3}>
            <HStack justifyContent="space-between" alignItems="center">
              <Heading size="md" color="gray.700">Achievements</Heading>
              <Button 
                variant="ghost" 
                size="sm" 
                rightIcon={<Icon as={Ionicons} name="chevron-forward" size="sm" />}
              >
                View All
              </Button>
            </HStack>

            <VStack space={3} divider={<Divider />}>
              {achievements.slice(0, 3).map((achievement) => (
                <HStack key={achievement.id} space={3} alignItems="center">
                  <Box
                    bg={achievement.completed ? 'primary.100' : 'gray.100'}
                    p={2}
                    rounded="full"
                  >
                    <Icon
                      as={Ionicons}
                      name={achievement.icon}
                      size="md"
                      color={achievement.completed ? 'primary.600' : 'gray.400'}
                    />
                  </Box>
                  <VStack space={0} flex={1}>
                    <HStack justifyContent="space-between" alignItems="center">
                      <Text fontWeight="medium">
                        {achievement.name}
                      </Text>
                      {achievement.completed && (
                        <Icon
                          as={Ionicons}
                          name="checkmark-circle"
                          size="sm"
                          color="green.500"
                        />
                      )}
                    </HStack>
                    <Text fontSize="xs" color="gray.500">
                      {achievement.description}
                    </Text>
                  </VStack>
                </HStack>
              ))}
            </VStack>
          </VStack>

          {/* Settings and Resources */}
          <VStack space={3}>
            <Heading size="md" color="gray.700">Settings</Heading>

            <VStack space={2} divider={<Divider />}>
              <Pressable py={3}>
                <HStack space={3} alignItems="center">
                  <Icon
                    as={Ionicons}
                    name="notifications-outline"
                    size="sm"
                    color="gray.600"
                  />
                  <Text flex={1}>Notifications</Text>
                  <Icon
                    as={Ionicons}
                    name="chevron-forward"
                    size="sm"
                    color="gray.400"
                  />
                </HStack>
              </Pressable>

              <Pressable py={3}>
                <HStack space={3} alignItems="center">
                  <Icon
                    as={Ionicons}
                    name="shield-outline"
                    size="sm"
                    color="gray.600"
                  />
                  <Text flex={1}>Privacy Settings</Text>
                  <Icon
                    as={Ionicons}
                    name="chevron-forward"
                    size="sm"
                    color="gray.400"
                  />
                </HStack>
              </Pressable>

              <Pressable py={3}>
                <HStack space={3} alignItems="center">
                  <Icon
                    as={Ionicons}
                    name="help-circle-outline"
                    size="sm"
                    color="gray.600"
                  />
                  <Text flex={1}>Help & Support</Text>
                  <Icon
                    as={Ionicons}
                    name="chevron-forward"
                    size="sm"
                    color="gray.400"
                  />
                </HStack>
              </Pressable>

              <Pressable py={3}>
                <HStack space={3} alignItems="center">
                  <Icon
                    as={Ionicons}
                    name="log-out-outline"
                    size="sm"
                    color="red.500"
                  />
                  <Text color="red.500">Logout</Text>
                </HStack>
              </Pressable>
            </VStack>
          </VStack>
        </VStack>
      </ScrollView>
    </Box>
  );
};

export default ProfileScreen;
