import React, { useState } from 'react';
import {StyleSheet, View, Text, ImageBackground, TouchableOpacity, TextInput, ActivityIndicator} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { supabase } from '../../supabaseClient';
import {useNavigation} from '@react-navigation/native';

const SignupScreen = () => {
  const navigation = useNavigation();
  var bg = require ('../../assets/media/bg.png');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false)

  async function signUpWithEmail(event) {
    event.preventDefault();
    setLoading(true)
    let username = displayName.toLowerCase();
    const res = await supabase.from('profiles').select('username').like('username', username+'%');
    if(res.data.length > 0) username = username + res.data.length.toString();
    const {data, error} = await supabase.auth.signUp({
      email: email,
      password: password,  
      options: {
        data: {
          display_name: displayName,
          avatar_url: null,
          username: username
        }
      }  
    })
    if(data.user){
      console.log('Created User'); 
      navigation.navigate('Home');
    }
    if (error) console.error(error.message)
    setLoading(false)
  }

  return (
    <View style={styles.container}>
    <ImageBackground source={bg} style={styles.background}>
      <View style={styles.contentContainer}>
        <Text style={styles.header}>Create your fitness account</Text>
        <View style={styles.loginContainer}>
          <TextInput 
            style={styles.textInputStyle}
            onChangeText={(text) => setEmail(text)}
            onSubmitEditing = {() => {setEmail('')}}
            keyboardType='email-address'
            value={email}
            cursorColor='white'
            underlineColorAndroid="transparent"
            placeholder='Enter your email'
            placeholderTextColor={'rgba(250,250,250,0.3)'}
          />
          <TextInput 
            style={styles.textInputStyle}
            onChangeText={(text) => setPassword(text)}
            onSubmitEditing = {() => {setPassword('')}}
            value={password}
            secureTextEntry={true}
            placeholder='Enter your password'
            placeholderTextColor={'rgba(250,250,250,0.3)'}
            cursorColor='white'
            underlineColorAndroid="transparent"
          />
          <TextInput 
            style={styles.textInputStyle}
            onChangeText={(text) => setDisplayName(text)}
            onSubmitEditing = {() => {setDisplayName('')}}
            value={displayName}
            cursorColor='white'
            underlineColorAndroid="transparent"
            placeholder='Enter your display name'
            placeholderTextColor={'rgba(250,250,250,0.3)'}
          />
          <Text style={{fontFamily: 'Montserrat-Regular', fontSize: 12, color: 'rgba(250,250,250,0.8)', textAlign: 'center', margin: '2%'}}>Or</Text>
          <View style={styles.socialsContainer}>
            <TouchableOpacity><FontAwesome name='google' size={16} color='white' /></TouchableOpacity>
            <TouchableOpacity><FontAwesome name='facebook' size={16} color='white' /></TouchableOpacity>
            <TouchableOpacity><FontAwesome name='spotify' size={16} color='white' /></TouchableOpacity>
          </View>
          <View style={styles.footerContainer}>
            <Text style={{fontFamily: 'Montserrat-Regular', color: 'white'}}>Have an account? </Text>
            <TouchableOpacity onPress={() => {navigation.navigate('LoginScreen')}}>
              <Text style={{fontFamily: 'Montserrat-Italic', color: 'white'}}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={{width: '75%'}} onPress={(e) => signUpWithEmail(e)}>
          <View style={styles.loginButton}>
            {loading && <ActivityIndicator color="rgba(250,250,250,0.8)" />}
            {!loading && <Text style={{fontFamily: 'Montserrat-Regular', color: 'white'}}>Create Account</Text>}
          </View>
        </TouchableOpacity>
      </View>
    </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      width: "100%",
      height: '100%',
    },
    background: {
      width: "100%",
      height: "100%"
    },
    contentContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    header: {
      fontFamily: 'Montserrat-Regular',
      color: "#D4AF37",
      fontWeight: "600",
      textAlign: "center",
      fontSize: 20,
      marginBottom: 40
    },
    loginContainer: {
      width: '75%',
      backgroundColor: "rgba(20,20,20,0.95)",
      paddingTop: 30,
      paddingHorizontal: 40,
      paddingBottom: 10
    },
    textInputStyle: {
      marginBottom: '4%',
      fontFamily: 'Montserrat-Regular',
      paddingVertical: 5,
      fontSize: 14,
      color: 'white',
      backgroundColor: 'rgba(20,20,20,0.2)',
      borderBottomColor: '#D4AF37',
      borderBottomWidth: 1,
      borderTopEndRadius: 10,
      width: '100%'
    },
    linkContainer: {
      backgroundColor: 'rgba(20,20,20,0.2)',
      width: '70%',
      alignItems: 'center',
      alignSelf: 'center',
      paddingBottom: 5,
      marginVertical: '4%',
      borderBottomColor: '#D4AF37',
      borderBottomWidth: 1
    },
    socialsContainer: {
      flexDirection: 'row',
      marginTop: '4%',
      justifyContent: 'space-around'
    },
    footerContainer: {
      flexDirection: 'row',
      alignSelf: 'center',
      marginTop: '6%',
    },
    loginButton: {
      backgroundColor: '#D4AF37',
      alignItems: 'center',
      paddingVertical: 5,
      borderRadius: 5,
      marginTop: '6%'
    }
});

export default SignupScreen;
