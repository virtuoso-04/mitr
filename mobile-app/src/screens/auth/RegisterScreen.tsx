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
import theme from '../../theme';

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
        variant: "left-accent",
        placement: "top",
        backgroundColor: "warning.500"
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.show({
        title: "Password mismatch",
        description: "Passwords do not match",
        variant: "left-accent",
        placement: "top",
        backgroundColor: "warning.500"
      });
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.show({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "left-accent",
        placement: "top",
        backgroundColor: "warning.500"
      });
      return;
    }

    // Password strength validation
    if (password.length < 8) {
      toast.show({
        title: "Weak password",
        description: "Password must be at least 8 characters long",
        variant: "left-accent",
        placement: "top",
        backgroundColor: "warning.500"
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
        variant: "left-accent",
        placement: "top",
        backgroundColor: "error.500"
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
    <ScrollView flex={1} bg="neutral.50">
      <Box safeAreaTop p={6}>
        <VStack space={5} alignItems="center" justifyContent="center" w="100%">
          {/* Heading */}
          <Box alignItems="center" mb={6}>
            <Heading size="xl" color="primary.500" fontWeight="semibold" letterSpacing="tight">
              Join Mitr
            </Heading>
            <Text mt={2} fontSize="md" color="neutral.700" textAlign="center">
              Create your account for personalized support
            </Text>
          </Box>

          {/* Registration Form */}
          <VStack space={4} w="100%">
            <FormControl isRequired>
              <FormControl.Label _text={{ color: "neutral.800", fontSize: "sm", fontWeight: "medium" }}>Username</FormControl.Label>
              <Input
                placeholder="Choose a username"
                size="lg"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                borderRadius="lg"
                borderColor="neutral.300"
                _focus={{
                  borderColor: "primary.500",
                  bg: "neutral.50",
                }}
                InputLeftElement={
                  <Icon 
                    as={Ionicons} 
                    name="person-outline" 
                    size={5} 
                    ml={2} 
                    color="primary.500" 
                  />
                }
              />
            </FormControl>

            <FormControl isRequired>
              <FormControl.Label _text={{ color: "neutral.800", fontSize: "sm", fontWeight: "medium" }}>Email</FormControl.Label>
              <Input
                placeholder="Enter your email"
                size="lg"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                borderRadius="lg"
                borderColor="neutral.300"
                _focus={{
                  borderColor: "primary.500",
                  bg: "neutral.50",
                }}
                InputLeftElement={
                  <Icon 
                    as={Ionicons} 
                    name="mail-outline" 
                    size={5} 
                    ml={2} 
                    color="primary.500" 
                  />
                }
              />
            </FormControl>

            <FormControl isRequired>
              <FormControl.Label _text={{ color: "neutral.800", fontSize: "sm", fontWeight: "medium" }}>Password</FormControl.Label>
              <Input
                placeholder="Create a password"
                size="lg"
                type={showPassword ? "text" : "password"}
                value={password}
                onChangeText={setPassword}
                borderRadius="lg"
                borderColor="neutral.300"
                _focus={{
                  borderColor: "primary.500",
                  bg: "neutral.50",
                }}
                InputLeftElement={
                  <Icon 
                    as={Ionicons} 
                    name="lock-closed-outline" 
                    size={5} 
                    ml={2} 
                    color="primary.500" 
                  />
                }
                InputRightElement={
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Icon 
                      as={Ionicons} 
                      name={showPassword ? "eye-off-outline" : "eye-outline"} 
                      size={5} 
                      mr={2} 
                      color="primary.600" 
                    />
                  </TouchableOpacity>
                }
              />
              <FormControl.HelperText _text={{ color: "neutral.600", fontSize: "xs" }}>
                Must be at least 8 characters long
              </FormControl.HelperText>
            </FormControl>

            <FormControl isRequired>
              <FormControl.Label _text={{ color: "neutral.800", fontSize: "sm", fontWeight: "medium" }}>Confirm Password</FormControl.Label>
              <Input
                placeholder="Confirm your password"
                size="lg"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                borderRadius="lg"
                borderColor="neutral.300"
                _focus={{
                  borderColor: "primary.500",
                  bg: "neutral.50",
                }}
                InputLeftElement={
                  <Icon 
                    as={Ionicons} 
                    name="lock-closed-outline" 
                    size={5} 
                    ml={2} 
                    color="primary.500" 
                  />
                }
              />
            </FormControl>

            <Box mt={2}>
              <Text fontSize="xs" color="neutral.600">
                By registering, you agree to our Terms of Service and Privacy Policy.
              </Text>
            </Box>

            <Button
              mt={4}
              size="lg"
              bg="primary.500"
              _pressed={{
                bg: "primary.600"
              }}
              shadow="sm"
              rounded="lg"
              onPress={handleRegister}
              isLoading={isLoading}
              isLoadingText="Creating account..."
              _text={{ 
                fontWeight: "medium"
              }}
            >
              Create Account
            </Button>
          </VStack>

          {/* Login Link */}
          <HStack mt={6} space={1} alignItems="center">
            <Text fontSize="sm" color="neutral.700">
              Already have an account?
            </Text>
            <Link onPress={navigateToLogin}>
              <Text fontSize="sm" fontWeight="semibold" color="primary.600">
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
