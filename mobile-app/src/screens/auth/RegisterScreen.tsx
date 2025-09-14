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
  useToast,
  Icon,
  ScrollView,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

const RegisterScreen = () => {
  const { register } = useAuth();
  const navigation = useNavigation();
  const toast = useToast();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    // Validate form inputs
    if (!username || !email || !password || !confirmPassword) {
      toast.show({
        title: "Missing information",
        description: "Please fill in all fields",
        status: "warning",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.show({
        title: "Password mismatch",
        description: "Passwords do not match",
        status: "warning",
      });
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.show({
        title: "Invalid email",
        description: "Please enter a valid email address",
        status: "warning",
      });
      return;
    }

    // Password strength validation
    if (password.length < 8) {
      toast.show({
        title: "Weak password",
        description: "Password must be at least 8 characters long",
        status: "warning",
      });
      return;
    }

    setIsLoading(true);
    try {
      await register(username, email, password);
      // Registration success is handled by the AuthContext which updates the user state
    } catch (error) {
      toast.show({
        title: "Registration Failed",
        description: "There was a problem creating your account. Please try again.",
        status: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToLogin = () => {
    // @ts-ignore - navigation typing issue
    navigation.navigate('Login');
  };

  return (
    <ScrollView flex={1} bg="white">
      <Box safeAreaTop p={6}>
        <VStack space={5} alignItems="center" justifyContent="center" w="100%">
          {/* Heading */}
          <Box alignItems="center" mb={6}>
            <Heading size="xl" color="primary.500" fontWeight="bold">
              Join MindSpace
            </Heading>
            <Text mt={2} fontSize="md" color="muted.500" textAlign="center">
              Create your account for personalized support
            </Text>
          </Box>

          {/* Registration Form */}
          <VStack space={4} w="100%">
            <FormControl isRequired>
              <FormControl.Label>Username</FormControl.Label>
              <Input
                placeholder="Choose a username"
                size="lg"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                InputLeftElement={
                  <Icon 
                    as={Ionicons} 
                    name="person-outline" 
                    size={5} 
                    ml={2} 
                    color="muted.400" 
                  />
                }
              />
            </FormControl>

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
                placeholder="Create a password"
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
              <FormControl.HelperText>
                Must be at least 8 characters long
              </FormControl.HelperText>
            </FormControl>

            <FormControl isRequired>
              <FormControl.Label>Confirm Password</FormControl.Label>
              <Input
                placeholder="Confirm your password"
                size="lg"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                InputLeftElement={
                  <Icon 
                    as={Ionicons} 
                    name="lock-closed-outline" 
                    size={5} 
                    ml={2} 
                    color="muted.400" 
                  />
                }
              />
            </FormControl>

            <Box mt={2}>
              <Text fontSize="xs" color="muted.500">
                By registering, you agree to our Terms of Service and Privacy Policy.
              </Text>
            </Box>

            <Button
              mt={4}
              size="lg"
              colorScheme="primary"
              onPress={handleRegister}
              isLoading={isLoading}
              isLoadingText="Creating account..."
            >
              Create Account
            </Button>
          </VStack>

          {/* Login Link */}
          <HStack mt={6} space={1} alignItems="center">
            <Text fontSize="sm" color="muted.500">
              Already have an account?
            </Text>
            <Link onPress={navigateToLogin}>
              <Text fontSize="sm" fontWeight="bold" color="primary.600">
                Sign In
              </Text>
            </Link>
          </HStack>
        </VStack>
      </Box>
    </ScrollView>
  );
};

export default RegisterScreen;
