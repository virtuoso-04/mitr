import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Icon,
  Button,
  ScrollView,
  Pressable,
  Progress,
  Divider,
  AspectRatio,
  Center,
  useToast,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { BreathingExercise } from '../../types';

// Mock breathing exercises
const BREATHING_EXERCISES: BreathingExercise[] = [
  {
    id: '1',
    name: '4-7-8 Technique',
    description: 'Calms your nervous system and helps with anxiety',
    durationSeconds: 120,
    steps: [
      { type: 'inhale', durationSeconds: 4, instruction: 'Breathe in through your nose' },
      { type: 'hold', durationSeconds: 7, instruction: 'Hold your breath' },
      { type: 'exhale', durationSeconds: 8, instruction: 'Exhale completely through your mouth' },
    ],
  },
  {
    id: '2',
    name: 'Box Breathing',
    description: 'Reduces stress and improves concentration',
    durationSeconds: 100,
    steps: [
      { type: 'inhale', durationSeconds: 4, instruction: 'Breathe in slowly' },
      { type: 'hold', durationSeconds: 4, instruction: 'Hold your breath' },
      { type: 'exhale', durationSeconds: 4, instruction: 'Breathe out slowly' },
      { type: 'hold', durationSeconds: 4, instruction: 'Hold your breath' },
    ],
  },
  {
    id: '3',
    name: 'Mindful Breathing',
    description: 'Focus on the present moment and clear your mind',
    durationSeconds: 180,
    steps: [
      { type: 'inhale', durationSeconds: 6, instruction: 'Breathe in deeply through your nose' },
      { type: 'hold', durationSeconds: 2, instruction: 'Pause briefly' },
      { type: 'exhale', durationSeconds: 6, instruction: 'Exhale fully through your mouth' },
    ],
  },
];

const WellnessScreen = () => {
  const toast = useToast();
  const [selectedExercise, setSelectedExercise] = useState<BreathingExercise | null>(null);
  const [isExerciseActive, setIsExerciseActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(0);

  // Start breathing exercise
  const startExercise = (exercise: BreathingExercise) => {
    setSelectedExercise(exercise);
    setIsExerciseActive(true);
    setCurrentStep(0);
    setSecondsRemaining(exercise.steps[0].durationSeconds);
    
    // In a real app, we would set up a timer here to progress through the steps
    toast.show({
      description: `Started ${exercise.name}`,
      placement: 'top',
    });
  };

  // Stop the current exercise
  const stopExercise = () => {
    setIsExerciseActive(false);
    setSelectedExercise(null);
    
    toast.show({
      description: 'Exercise completed',
      placement: 'top',
    });
  };

  // Get color for breathing type
  const getStepColor = (type: string) => {
    switch (type) {
      case 'inhale':
        return 'blue.500';
      case 'hold':
        return 'amber.500';
      case 'exhale':
        return 'green.500';
      default:
        return 'gray.500';
    }
  };

  return (
    <Box flex={1} bg="white" safeArea>
      <ScrollView>
        <VStack space={5} p={5}>
          <Heading size="lg" color="primary.600">Wellness Tools</Heading>

          {/* Daily Wellness Progress */}
          <Box bg="primary.100" p={4} rounded="lg">
            <VStack space={3}>
              <Heading size="sm" color="primary.800">Daily Wellness</Heading>
              <Progress value={65} colorScheme="primary" size="lg" />
              <HStack justifyContent="space-between">
                <Text color="gray.600" fontSize="sm">2 of 3 activities completed</Text>
                <Text color="primary.600" fontSize="sm" fontWeight="bold">65%</Text>
              </HStack>
            </VStack>
          </Box>

          {/* Active Exercise */}
          {isExerciseActive && selectedExercise && (
            <Box bg="blue.50" p={5} rounded="lg" shadow={1}>
              <VStack space={4} alignItems="center">
                <Heading size="md" color="blue.800">{selectedExercise.name}</Heading>
                
                <AspectRatio ratio={1} width="50%">
                  <Center
                    bg={getStepColor(selectedExercise.steps[currentStep].type)}
                    rounded="full"
                    opacity={0.8}
                  >
                    <Text color="white" fontSize="2xl" fontWeight="bold">
                      {secondsRemaining}
                    </Text>
                    <Text color="white" fontSize="md">
                      {selectedExercise.steps[currentStep].type.toUpperCase()}
                    </Text>
                  </Center>
                </AspectRatio>
                
                <Text fontSize="lg" fontWeight="medium" textAlign="center">
                  {selectedExercise.steps[currentStep].instruction}
                </Text>
                
                <Button
                  colorScheme="danger"
                  variant="subtle"
                  onPress={stopExercise}
                  leftIcon={<Icon as={Ionicons} name="stop-circle" size="sm" />}
                >
                  End Session
                </Button>
              </VStack>
            </Box>
          )}

          {/* Breathing Exercises */}
          <VStack space={2}>
            <HStack justifyContent="space-between" alignItems="center">
              <Heading size="md" color="gray.700">Breathing Exercises</Heading>
              <Button
                variant="ghost"
                size="sm"
                rightIcon={<Icon as={Ionicons} name="arrow-forward" size="xs" />}
              >
                View All
              </Button>
            </HStack>
            <Text color="gray.600" mb={2}>
              Reduce stress and anxiety with guided breathing
            </Text>
            
            <VStack space={3}>
              {BREATHING_EXERCISES.map((exercise) => (
                <Pressable 
                  key={exercise.id} 
                  onPress={() => startExercise(exercise)}
                >
                  <Box
                    bg="gray.50"
                    p={4}
                    rounded="md"
                    borderWidth={1}
                    borderColor="gray.200"
                  >
                    <HStack justifyContent="space-between" alignItems="center">
                      <VStack space={1} width="80%">
                        <Heading size="sm">{exercise.name}</Heading>
                        <Text color="gray.600" fontSize="xs">
                          {exercise.description}
                        </Text>
                        <Text color="gray.500" fontSize="2xs">
                          {Math.floor(exercise.durationSeconds / 60)} min
                        </Text>
                      </VStack>
                      <Icon
                        as={Ionicons}
                        name="play-circle"
                        size="lg"
                        color="primary.500"
                      />
                    </HStack>
                  </Box>
                </Pressable>
              ))}
            </VStack>
          </VStack>

          <Divider my={2} />

          {/* Journal */}
          <VStack space={2}>
            <Heading size="md" color="gray.700">Gratitude Journal</Heading>
            <Text color="gray.600" mb={2}>
              Practice gratitude daily to improve mental wellbeing
            </Text>
            
            <Pressable>
              <Box
                bg="amber.50"
                p={4}
                rounded="lg"
                borderWidth={1}
                borderColor="amber.200"
              >
                <HStack alignItems="center" space={3}>
                  <Icon
                    as={Ionicons}
                    name="journal-outline"
                    size="xl"
                    color="amber.600"
                  />
                  <VStack space={1}>
                    <Text color="amber.800" fontWeight="medium">Today's Entry</Text>
                    <Text color="gray.600" fontSize="xs">
                      Write down 3 things you're grateful for
                    </Text>
                  </VStack>
                  <Icon
                    as={Ionicons}
                    name="chevron-forward"
                    size="sm"
                    color="gray.400"
                    ml="auto"
                  />
                </HStack>
              </Box>
            </Pressable>
          </VStack>

          {/* Meditation */}
          <VStack space={2}>
            <Heading size="md" color="gray.700">Meditation</Heading>
            <Text color="gray.600" mb={2}>
              Guided meditations for relaxation and focus
            </Text>
            
            <HStack space={3}>
              <Pressable flex={1}>
                <Box
                  bg="indigo.50"
                  p={3}
                  rounded="md"
                  borderWidth={1}
                  borderColor="indigo.200"
                >
                  <VStack space={2} alignItems="center">
                    <Icon
                      as={Ionicons}
                      name="moon-outline"
                      size="lg"
                      color="indigo.600"
                    />
                    <Text fontWeight="medium" textAlign="center">
                      Sleep
                    </Text>
                    <Text fontSize="xs" color="gray.500" textAlign="center">
                      10 min
                    </Text>
                  </VStack>
                </Box>
              </Pressable>
              
              <Pressable flex={1}>
                <Box
                  bg="teal.50"
                  p={3}
                  rounded="md"
                  borderWidth={1}
                  borderColor="teal.200"
                >
                  <VStack space={2} alignItems="center">
                    <Icon
                      as={Ionicons}
                      name="leaf-outline"
                      size="lg"
                      color="teal.600"
                    />
                    <Text fontWeight="medium" textAlign="center">
                      Calm
                    </Text>
                    <Text fontSize="xs" color="gray.500" textAlign="center">
                      5 min
                    </Text>
                  </VStack>
                </Box>
              </Pressable>
              
              <Pressable flex={1}>
                <Box
                  bg="rose.50"
                  p={3}
                  rounded="md"
                  borderWidth={1}
                  borderColor="rose.200"
                >
                  <VStack space={2} alignItems="center">
                    <Icon
                      as={Ionicons}
                      name="heart-outline"
                      size="lg"
                      color="rose.600"
                    />
                    <Text fontWeight="medium" textAlign="center">
                      Focus
                    </Text>
                    <Text fontSize="xs" color="gray.500" textAlign="center">
                      15 min
                    </Text>
                  </VStack>
                </Box>
              </Pressable>
            </HStack>
          </VStack>
        </VStack>
      </ScrollView>
    </Box>
  );
};

export default WellnessScreen;
