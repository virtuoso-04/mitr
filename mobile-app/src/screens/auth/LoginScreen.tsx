import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import {
  Box,
  VStack,
  Heading,
  Text,
  FormControl,
  Input,
  Button,
  HStack,
  Link,
  Image,
  useToast,
  Icon,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const { login } = useAuth();
  const navigation = useNavigation();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.show({
        title: "Missing information",
        description: "Please enter both email and password",
        status: "warning",
      });
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      // Login success is handled by the AuthContext which updates the user state
    } catch (error) {
      toast.show({
        title: "Login Failed",
        description: "Please check your credentials and try again",
        status: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToRegister = () => {
    // @ts-ignore - navigation typing issue
    navigation.navigate('Register');
  };

  return (
    <Box flex={1} bg="white" safeAreaTop p={6}>
      <VStack space={5} alignItems="center" justifyContent="center" w="100%">
        {/* Logo and Heading */}
        <Box alignItems="center" mb={6}>
          <Heading size="xl" color="primary.500" fontWeight="bold">
            MindSpace
          </Heading>
          <Text mt={2} fontSize="md" color="muted.500" textAlign="center">
            Your AI companion for mental wellbeing
          </Text>
        </Box>

        {/* Login Form */}
        <VStack space={4} w="100%">
          <FormControl isRequired>
            <FormControl.Label>Email</FormControl.Label>
            <Input
              placeholder="Enter your email"
              size="lg"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              InputLeftElement={
                <Icon 
                  as={Ionicons} 
                  name="mail-outline" 
                  size={5} 
                  ml={2} 
                  color="muted.400" 
                />
              }
            />
          </FormControl>

          <FormControl isRequired>
            <FormControl.Label>Password</FormControl.Label>
            <Input
              placeholder="Enter your password"
              size="lg"
              type={showPassword ? "text" : "password"}
              value={password}
              onChangeText={setPassword}
              InputLeftElement={
                <Icon 
                  as={Ionicons} 
                  name="lock-closed-outline" 
                  size={5} 
                  ml={2} 
                  color="muted.400" 
                />
              }
              InputRightElement={
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Icon 
                    as={Ionicons} 
                    name={showPassword ? "eye-off-outline" : "eye-outline"} 
                    size={5} 
                    mr={2} 
                    color="muted.400" 
                  />
                </TouchableOpacity>
              }
            />
            <Link alignSelf="flex-end" mt="1">
              <Text fontSize="xs" fontWeight="500" color="primary.600">
                Forgot Password?
              </Text>
            </Link>
          </FormControl>

          <Button
            mt={4}
            size="lg"
            colorScheme="primary"
            onPress={handleLogin}
            isLoading={isLoading}
            isLoadingText="Logging in..."
          >
            Sign In
          </Button>
        </VStack>

        {/* Register Link */}
        <HStack mt={6} space={1} alignItems="center">
          <Text fontSize="sm" color="muted.500">
            Don't have an account?
          </Text>
          <Link onPress={navigateToRegister}>
            <Text fontSize="sm" fontWeight="bold" color="primary.600">
              Register
            </Text>
          </Link>
        </HStack>
      </VStack>
    </Box>
  );
};

export default LoginScreen;
