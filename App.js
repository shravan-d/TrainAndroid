import {NavigationContainer} from '@react-navigation/native';
import React, { useEffect, useReducer, useState } from 'react';
import {StyleSheet, Linking, View, Text, ActivityIndicator} from 'react-native';
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
import AccountScreen from './components/screens/AccountScreen';
import { messageStore } from './components/MessageReducer';
import { Provider } from 'react-redux';

const Stack = createNativeStackNavigator();
export const AuthContext = React.createContext(null);

const App = () => {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(null);

  useEffect(()=>{
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuth(session)
      setLoading(false)
    })
    supabase.auth.onAuthStateChange((event, session) => {
      setAuth(session);
    })
  }, [])

  useEffect(() => {
    if(!auth) return;
    const channel = supabase
      .channel('db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${auth.user.id}`
        },
        (payload) => messageStore.dispatch({ type: 'newMessage', payload: payload.new})
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'shots',
          filter: `receiver_id=eq.${auth.user.id}`
        },
        (payload) => messageStore.dispatch({ type: 'newShot', payload: payload.new})
      )
      .subscribe()
  }, [auth])
  
  if(loading){
    return (
      <ActivityIndicator color={'white'} size={40}/>
    )
  } else
  return (
    <AuthContext.Provider value={auth?.user}>
      <Provider store={messageStore}>
      <NavigationContainer>
        {!auth?
        <Stack.Navigator>
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
            name="Home"
            component={LandingPage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="DebugScreen"
            component={DebugScreen}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
        :
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
        }
      </NavigationContainer>
      </Provider>
    </AuthContext.Provider>
  );
};

const styles = StyleSheet.create({});

export default App;
