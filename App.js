import {NavigationContainer} from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
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
import LoginScreen from './components/screens/LoginScreen';
import SignupScreen from './components/screens/SignupScreen';
import { supabase } from './supabaseClient';
import { DebugScreen } from './components/screens/DebugScreen';
import AccountScreen from './components/screens/AcoountScreen';

const Stack = createNativeStackNavigator();
const App = () => {
  const [auth, setAuth] = useState(false);

  useEffect(()=>{
    // setAuth(supabase.auth.session());
    supabase.auth.onAuthStateChange((event, session) => {
      console.log(session);
      setAuth(session);
    })
  }, [])
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
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SignupScreen"
            component={SignupScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="AccountScreen"
            component={AccountScreen}
            options={{headerShown: false}}
          />


          <Stack.Screen
            name="DebugScreen"
            component={DebugScreen}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

const styles = StyleSheet.create({});

export default App;
