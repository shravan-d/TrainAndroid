import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, useColorScheme, View, Text} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LandingPage from './components/screens/LandingPage';
import ExerciseGuide from './components/screens/ExerciseGuide';
import MediaScreen from './components/screens/MediaScreen';
import ContactScreen from './components/screens/ContactScreen';
import ChatScreen from './components/screens/ChatScreen';
import CameraScreen from './components/screens/CameraScreen';
import RoutineScreen from './components/screens/RoutineScreen';
import ExerciseDetailScreen from './components/screens/ExerciseDetailScreen';
import RoutineDetailScreen from './components/screens/RoutineDetailScreen';

const Stack = createNativeStackNavigator();
const App = () => {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={LandingPage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ExerciseGuide"
            component={ExerciseGuide}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="CameraScreen"
            component={CameraScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="MediaScreen"
            component={MediaScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ContactScreen"
            component={ContactScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ChatScreen"
            component={ChatScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="RoutineScreen"
            component={RoutineScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ExerciseDetailScreen"
            component={ExerciseDetailScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="RoutineDetailScreen"
            component={RoutineDetailScreen}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

const styles = StyleSheet.create({});

export default App;

// Phase 1 UI -> Creating workout and routine, fixing dimensions for multiple device sizes, naming conventions
// Phase 2 UI -> Settings, Homepage, Animation, Blog posts, Loading in between screens, Ads, IOS
// Phase 1 BE -> Authentication, DB setup, BE queries for guides, DB for messaging, BE for messaging
// Phase 2 BE -> User roles
