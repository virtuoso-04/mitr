import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Text,
  Heading,
  HStack,
  IconButton,
  Button,
  ScrollView,
  Divider,
  Pressable,
  Modal,
  TextArea,
  Select,
  FormControl,
  useToast,
  Input,
  Badge,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { JournalEntry } from '../../types';

// Define the MoodTracker interface since it's missing from types
interface MoodTracker {
  id: string;
  userId: string;
  mood: string;
  timestamp: Date;
}

// Mock journal entries
const MOCK_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: '1',
    content: 'I felt really good about my progress in therapy today. The breathing exercises are helping with my anxiety.',
    mood: 4, // happy
    tags: ['therapy', 'progress', 'anxiety'],
    createdAt: new Date(2023, 5, 20),
  },
  {
    id: '2',
    content: 'Today was challenging. I struggled with social anxiety at work, but I used the grounding techniques my therapist taught me.',
    mood: 2, // anxious
    tags: ['challenge', 'anxiety', 'work', 'coping'],
    createdAt: new Date(2023, 5, 18),
  },
];

// Mock mood data
const MOCK_MOOD_DATA: MoodTracker[] = [
  { id: '1', userId: 'user123', mood: 'happy', timestamp: new Date(2023, 5, 20) },
  { id: '2', userId: 'user123', mood: 'calm', timestamp: new Date(2023, 5, 19) },
  { id: '3', userId: 'user123', mood: 'neutral', timestamp: new Date(2023, 5, 18) },
  { id: '4', userId: 'user123', mood: 'sad', timestamp: new Date(2023, 5, 17) },
  { id: '5', userId: 'user123', mood: 'anxious', timestamp: new Date(2023, 5, 16) },
  { id: '6', userId: 'user123', mood: 'calm', timestamp: new Date(2023, 5, 15) },
  { id: '7', userId: 'user123', mood: 'happy', timestamp: new Date(2023, 5, 14) },
  { id: '8', userId: 'user123', mood: 'chatpata', timestamp: new Date(2023, 5, 13) },
];

const JournalScreen = () => {
  const toast = useToast();
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(MOCK_JOURNAL_ENTRIES);
  const [moodData, setMoodData] = useState<MoodTracker[]>(MOCK_MOOD_DATA);
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [showMoodModal, setShowMoodModal] = useState(false);
  
  // New journal entry
  const [newEntry, setNewEntry] = useState({
    content: '',
    mood: 'neutral' as 'happy' | 'calm' | 'neutral' | 'sad' | 'anxious' | 'chatpata',
    tags: [] as string[],
  });

  // Map mood string to numeric value and vice versa
  const moodToNumber = (moodString: string): number => {
    switch(moodString) {
      case 'chatpata': return 5;
      case 'happy': return 4;
      case 'calm': return 3;
      case 'neutral': return 2;
      case 'sad': return 1;
      case 'anxious': return 0;
      default: return 2;
    }
  };
  
  const numberToMood = (moodNumber: number): string => {
    switch(moodNumber) {
      case 5: return 'chatpata';
      case 4: return 'happy';
      case 3: return 'calm';
      case 2: return 'neutral';
      case 1: return 'sad';
      case 0: return 'anxious';
      default: return 'neutral';
    }
  };

  // Add journal entry
  const addJournalEntry = () => {
    if (newEntry.content.trim().length === 0) {
      toast.show({
        description: 'Please enter some content for your journal',
        placement: 'top',
        backgroundColor: 'warning.500',
      });
      return;
    }

    const entry: JournalEntry = {
      id: `journal-${Date.now()}`,
      content: newEntry.content,
      mood: moodToNumber(newEntry.mood),
      tags: newEntry.tags,
      createdAt: new Date(),
    };

    setJournalEntries([entry, ...journalEntries]);
    setNewEntry({ content: '', mood: 'neutral', tags: [] });
    setShowJournalModal(false);
    
    toast.show({
      description: 'Journal entry added successfully',
      placement: 'top',
    });
  };

  // Add mood entry
  const addMoodEntry = (mood: 'happy' | 'calm' | 'neutral' | 'sad' | 'anxious') => {
    const entry: MoodTracker = {
      id: `mood-${Date.now()}`,
      userId: 'user123',
      mood: mood,
      timestamp: new Date(),
    };

    setMoodData([entry, ...moodData]);
    setShowMoodModal(false);
    
    toast.show({
      description: `Mood logged: ${mood}`,
      placement: 'top',
    });
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };
  const getMoodEmoji = (mood: string | number) => {
    // Convert numeric mood to string if needed
    const moodStr = typeof mood === 'number' ? numberToMood(mood) : mood;
    
    switch (moodStr) {
      case 'happy':
        return '😊';
      case 'calm':
        return '😌';
      case 'neutral':
        return '😐';
      case 'sad':
        return '😔';
      case 'anxious':
        return '😰';
      case 'chatpata':
        return '😜';
      default:
        return '😐';
    }
  };
  const getMoodColor = (mood: string | number) => {
    // Convert numeric mood to string if needed
    const moodStr = typeof mood === 'number' ? numberToMood(mood) : mood;
    
    switch (moodStr) {
      case 'happy':
        return 'green.500';
      case 'calm':
        return 'blue.500';
      case 'neutral':
        return 'gray.500';
      case 'sad':
        return 'purple.500';
      case 'anxious':
        return 'amber.500';
      case 'chatpata':
        return 'orange.500';
      default:
        return 'gray.500';
    }
  };

  return (
    <Box flex={1} bg="white" safeArea>
      <ScrollView>
        <VStack space={5} p={5}>
          <Heading size="lg" color="primary.600">Journal & Mood</Heading>

          {/* Mood Tracker */}
          <VStack space={3}>
            <HStack justifyContent="space-between" alignItems="center">
              <Heading size="md" color="gray.700">Mood Tracker</Heading>
              <Button
                size="sm"
                variant="ghost"
                onPress={() => setShowMoodModal(true)}
                leftIcon={<Ionicons name="add-circle-outline" size={16} color="gray" />}
              >
                Add Mood
              </Button>
            </HStack>
            
            {/* Mood Calendar */}
            <Box bg="gray.50" p={4} rounded="md" borderWidth={1} borderColor="gray.200">
              <VStack space={2}>
                <Text color="gray.600" fontSize="sm">Last 7 days</Text>
                <HStack justifyContent="space-between" mt={2}>
                  {moodData.slice(0, 7).reverse().map((mood, index) => (
                    <VStack key={mood.id} alignItems="center" space={1}>
                      <Text fontSize="xl">{getMoodEmoji(mood.mood)}</Text>
                      <Text fontSize="2xs" color="gray.500">
                        {new Date(mood.timestamp).toLocaleDateString('en-US', { weekday: 'short' }).substring(0, 3)}
                      </Text>
                    </VStack>
                  ))}
                </HStack>
              </VStack>
            </Box>
          </VStack>

          <Divider />

          {/* Journal */}
          <VStack space={3}>
            <HStack justifyContent="space-between" alignItems="center">
              <Heading size="md" color="gray.700">Journal Entries</Heading>
              <Button
                size="sm"
                variant="ghost"
                onPress={() => setShowJournalModal(true)}
                leftIcon={<Ionicons name="add-circle-outline" size={16} color="gray" />}
              >
                New Entry
              </Button>
            </HStack>

            {journalEntries.length > 0 ? (
              <VStack space={3}>
                {journalEntries.map((entry) => (
                  <Pressable key={entry.id}>
                    <Box
                      bg="gray.50"
                      p={4}
                      rounded="md"
                      borderWidth={1}
                      borderColor="gray.200"
                    >
                      <HStack justifyContent="space-between" mb={2}>
                        <Badge colorScheme={getMoodColor(entry.mood)} variant="subtle">
                          <HStack space={1} alignItems="center">
                            <Text>{getMoodEmoji(entry.mood)}</Text>
                            <Text fontSize="xs" textTransform="capitalize">{typeof entry.mood === 'number' ? numberToMood(entry.mood) : entry.mood}</Text>
                          </HStack>
                        </Badge>
                        <Text fontSize="xs" color="gray.500">{formatDate(new Date(entry.createdAt))}</Text>
                      </HStack>
                      <Text numberOfLines={3} fontSize="sm">
                        {entry.content}
                      </Text>
                    </Box>
                  </Pressable>
                ))}
              </VStack>
            ) : (
              <Box
                bg="gray.50"
                p={4}
                rounded="md"
                borderWidth={1}
                borderColor="gray.200"
                alignItems="center"
              >
                <Text color="gray.500">No journal entries yet</Text>
              </Box>
            )}
          </VStack>

          {/* Journal prompts */}
          <VStack space={2}>
            <Heading size="md" color="gray.700">Journal Prompts</Heading>
            <Text color="gray.600" fontSize="sm">
              Need inspiration? Try these prompts:
            </Text>
            
            <VStack space={3} mt={2}>
              <Pressable>
                <Box
                  bg="blue.50"
                  p={3}
                  rounded="md"
                  borderWidth={1}
                  borderColor="blue.200"
                >
                  <Text color="blue.800">What are three things you're grateful for today?</Text>
                </Box>
              </Pressable>
              
              <Pressable>
                <Box
                  bg="green.50"
                  p={3}
                  rounded="md"
                  borderWidth={1}
                  borderColor="green.200"
                >
                  <Text color="green.800">What's one small win you had today?</Text>
                </Box>
              </Pressable>
              
              <Pressable>
                <Box
                  bg="purple.50"
                  p={3}
                  rounded="md"
                  borderWidth={1}
                  borderColor="purple.200"
                >
                  <Text color="purple.800">What's something challenging you faced and how did you handle it?</Text>
                </Box>
              </Pressable>
            </VStack>
          </VStack>
        </VStack>
      </ScrollView>

      {/* New Journal Entry Modal */}
      <Modal isOpen={showJournalModal} onClose={() => setShowJournalModal(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>New Journal Entry</Modal.Header>
          <Modal.Body>
            <FormControl>
              <FormControl.Label>How are you feeling?</FormControl.Label>
              <Select
                selectedValue={newEntry.mood}
                onValueChange={(value) => setNewEntry({...newEntry, mood: value as any})}
                placeholder="Select your mood"
                mt={1}
              >
                <Select.Item label="Happy 😊" value="happy" />
                <Select.Item label="Calm 😌" value="calm" />
                <Select.Item label="Neutral 😐" value="neutral" />
                <Select.Item label="Sad 😔" value="sad" />
                <Select.Item label="Anxious 😰" value="anxious" />
                <Select.Item label="Chatpata 😜" value="chatpata" />
              </Select>
            </FormControl>
            <FormControl mt={3}>
              <FormControl.Label>What's on your mind?</FormControl.Label>
              <TextArea
                autoCompleteType="off"
                h={20}
                placeholder="Write your thoughts here..."
                value={newEntry.content}
                onChangeText={(text) => setNewEntry({...newEntry, content: text})}
              />
            </FormControl>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                onPress={() => setShowJournalModal(false)}
              >
                Cancel
              </Button>
              <Button onPress={addJournalEntry}>Save</Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      {/* Mood Modal */}
      <Modal isOpen={showMoodModal} onClose={() => setShowMoodModal(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>How are you feeling?</Modal.Header>
          <Modal.Body>
            <HStack space={3} justifyContent="space-between">
              <Pressable onPress={() => addMoodEntry('happy')}>
                <VStack alignItems="center" space={1}>
                  <Text fontSize="3xl">😊</Text>
                  <Text>Happy</Text>
                </VStack>
              </Pressable>
              <Pressable onPress={() => addMoodEntry('calm')}>
                <VStack alignItems="center" space={1}>
                  <Text fontSize="3xl">😌</Text>
                  <Text>Calm</Text>
                </VStack>
              </Pressable>
              <Pressable onPress={() => addMoodEntry('neutral')}>
                <VStack alignItems="center" space={1}>
                  <Text fontSize="3xl">😐</Text>
                  <Text>Neutral</Text>
                </VStack>
              </Pressable>
              <Pressable onPress={() => addMoodEntry('sad')}>
                <VStack alignItems="center" space={1}>
                  <Text fontSize="3xl">😔</Text>
                  <Text>Sad</Text>
                </VStack>
              </Pressable>
              <Pressable onPress={() => addMoodEntry('anxious')}>
                <VStack alignItems="center" space={1}>
                  <Text fontSize="3xl">😰</Text>
                  <Text>Anxious</Text>
                </VStack>
              </Pressable>
               <Pressable onPress={() => addMoodEntry('anxious')}>
                <VStack alignItems="center" space={1}>
                  <Text fontSize="3xl">🤪</Text>
                  <Text>Chatpata</Text>
                </VStack>
              </Pressable>
            </HStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Box>
  );
};

export default JournalScreen;
