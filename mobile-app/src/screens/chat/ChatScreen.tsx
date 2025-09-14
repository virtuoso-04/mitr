import React, { useState, useEffect } from 'react';
import { FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Input, 
  Button, 
  IconButton, 
  Icon, 
  Avatar, 
  Spinner, 
  useToast, 
  Select
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { Message } from '../../types';

// Mock AI personas
const AI_PERSONAS = [
  { id: 'arjuna', name: 'Arjuna', description: 'Spiritual guide inspired by Bhagavad Gita' },
  { id: 'maya', name: 'Maya', description: 'Modern companion for daily challenges' }
];

// Mock messages for demo
const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    text: 'Welcome to MindSpace! How are you feeling today?',
    sender: 'ai',
    persona: 'arjuna',
    timestamp: new Date(Date.now() - 5000),
    isLoading: false,
  }
];

// Crisis keywords for detection
const CRISIS_KEYWORDS = [
  'suicide', 
  'kill myself', 
  'end it all', 
  'end my life', 
  'want to die', 
  'no reason to live', 
  'harm myself',
  'hurt myself'
];

const ChatScreen = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [messageText, setMessageText] = useState('');
  const [selectedPersona, setSelectedPersona] = useState('arjuna');
  const [isTyping, setIsTyping] = useState(false);

  // Helper function to check for crisis keywords
  const detectCrisis = (text: string): boolean => {
    const lowerText = text.toLowerCase();
    return CRISIS_KEYWORDS.some(keyword => lowerText.includes(keyword));
  };

  // Send message function
  const sendMessage = async () => {
    if (!messageText.trim()) return;
    
    // Add user message to the list
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
      isLoading: false,
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setMessageText('');
    
    // Check for crisis
    const isCrisis = detectCrisis(messageText);
    if (isCrisis) {
      // Add crisis response immediately
      const crisisMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'I notice you might be going through a difficult time. Please remember that help is available. Would you like me to connect you with a mental health professional or a crisis helpline?',
        sender: 'ai',
        persona: selectedPersona,
        timestamp: new Date(),
        isLoading: false,
        isCrisisResponse: true,
      };
      
      setTimeout(() => {
        setMessages(prevMessages => [...prevMessages, crisisMessage]);
        toast.show({
          title: "Crisis Support",
          description: "We've activated crisis support resources",
          status: "warning",
          duration: 5000,
        });
      }, 500);
      return;
    }
    
    // Add AI typing indicator
    const typingMessageId = (Date.now() + 1).toString();
    const typingMessage: Message = {
      id: typingMessageId,
      text: '',
      sender: 'ai',
      persona: selectedPersona,
      timestamp: new Date(),
      isLoading: true,
    };
    
    setMessages(prevMessages => [...prevMessages, typingMessage]);
    setIsTyping(true);
    
    // Simulate AI response (would be a real API call in production)
    setTimeout(() => {
      // Remove typing indicator and add actual response
      setMessages(prevMessages => 
        prevMessages
          .filter(msg => msg.id !== typingMessageId)
          .concat({
            id: (Date.now() + 2).toString(),
            text: generateAIResponse(messageText, selectedPersona),
            sender: 'ai',
            persona: selectedPersona,
            timestamp: new Date(),
            isLoading: false,
          })
      );
      setIsTyping(false);
    }, 1500);
  };

  // Simulate AI response based on selected persona
  const generateAIResponse = (userMessage: string, persona: string): string => {
    const lowerMsg = userMessage.toLowerCase();
    
    if (persona === 'arjuna') {
      if (lowerMsg.includes('stress') || lowerMsg.includes('anxious')) {
        return "When the mind is restless, Krishna teaches us to find peace through mindful action. Consider focusing on your breath for a few moments. What specific situation is causing you stress?";
      } else if (lowerMsg.includes('sad') || lowerMsg.includes('depress')) {
        return "Feelings of sadness, like clouds in the sky, pass with time. The Gita reminds us that we are not our emotions, but the witness to them. What thoughts accompany your sadness?";
      } else if (lowerMsg.includes('mean') || lowerMsg.includes('purpose')) {
        return "Finding meaning is part of your dharma, your life's purpose. The Bhagavad Gita teaches that fulfilling your duty with devotion and without attachment to results leads to inner peace. What activities bring you a sense of purpose?";
      } else {
        return "I hear you. The path to wellness often begins with self-awareness. As Krishna advised Arjuna, understanding our thoughts is the first step toward clarity. Would you like to explore this further?";
      }
    } else { // Maya persona
      if (lowerMsg.includes('stress') || lowerMsg.includes('anxious')) {
        return "It sounds like you're dealing with some stress. That's completely normal in today's fast-paced world. Have you tried any relaxation techniques that worked for you before?";
      } else if (lowerMsg.includes('sad') || lowerMsg.includes('depress')) {
        return "I'm sorry you're feeling down. Many young people experience similar feelings. Sometimes talking about what's triggering these emotions can help process them. Would you like to share what might be contributing to how you're feeling?";
      } else if (lowerMsg.includes('mean') || lowerMsg.includes('purpose')) {
        return "Questioning purpose and meaning is part of growing up! Many successful people went through periods of uncertainty. What activities or causes make you feel engaged and energized?";
      } else {
        return "Thanks for sharing that with me. It takes courage to open up. Based on what you've said, would you like some practical suggestions, or would you prefer to explore your thoughts more?";
      }
    }
  };

  // Message renderer
  const renderMessage = ({ item }: { item: Message }) => {
    const isAI = item.sender === 'ai';
    
    return (
      <Box
        alignSelf={isAI ? 'flex-start' : 'flex-end'}
        bg={isAI ? 'primary.100' : 'primary.500'}
        px="3"
        py="2"
        rounded="md"
        maxW="80%"
        mb="2"
        borderColor={item.isCrisisResponse ? 'warning.500' : 'transparent'}
        borderWidth={item.isCrisisResponse ? '1' : '0'}
      >
        {isAI && (
          <HStack alignItems="center" mb="1" space="2">
            <Avatar 
              size="xs" 
              bg={item.persona === 'arjuna' ? 'amber.500' : 'teal.500'}
            >
              {item.persona === 'arjuna' ? 'A' : 'M'}
            </Avatar>
            <Text fontSize="xs" color="gray.500">
              {item.persona === 'arjuna' ? 'Arjuna' : 'Maya'}
            </Text>
          </HStack>
        )}
        
        {item.isLoading ? (
          <HStack space="2" alignItems="center">
            <Spinner size="sm" color="gray.400" />
            <Text color="gray.400">Typing...</Text>
          </HStack>
        ) : (
          <Text color={isAI ? 'darkText' : 'white'}>
            {item.text}
          </Text>
        )}
        
        <Text fontSize="xs" color={isAI ? 'gray.500' : 'white'} alignSelf="flex-end">
          {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </Box>
    );
  };

  return (
    <Box flex={1} bg="white" safeArea>
      <VStack flex={1} space="4" p="4">
        {/* Persona selector */}
        <Select
          selectedValue={selectedPersona}
          onValueChange={value => setSelectedPersona(value)}
          accessibilityLabel="Choose AI Guide"
          placeholder="Choose AI Guide"
          _selectedItem={{
            bg: "primary.100",
          }}
        >
          {AI_PERSONAS.map(persona => (
            <Select.Item 
              key={persona.id}
              label={`${persona.name} - ${persona.description}`}
              value={persona.id}
            />
          ))}
        </Select>
        
        {/* Messages list */}
        <FlatList
          flex={1}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          inverted={false}
        />
        
        {/* Message input */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={90}
        >
          <HStack space="2" alignItems="center">
            <Input
              flex={1}
              placeholder="Type a message..."
              variant="filled"
              bg="gray.100"
              py="3"
              px="4"
              fontSize="md"
              value={messageText}
              onChangeText={setMessageText}
              InputRightElement={
                isTyping ? (
                  <Spinner size="sm" mr="2" color="primary.500" />
                ) : null
              }
              onSubmitEditing={sendMessage}
            />
            <IconButton
              variant="solid"
              bg="primary.500"
              rounded="full"
              icon={<Icon as={Ionicons} name="send" size="md" color="white" />}
              onPress={sendMessage}
              disabled={isTyping || !messageText.trim()}
            />
          </HStack>
        </KeyboardAvoidingView>
      </VStack>
    </Box>
  );
};

export default ChatScreen;
