import React, { useEffect, useState } from 'react';
import {StyleSheet, View, Text, ImageBackground, TouchableOpacity, TextInput, ActivityIndicator, Linking} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Link, useNavigation} from '@react-navigation/native';
import { supabase } from '../../supabaseClient';

const LoginScreen = () => {
  const navigation = useNavigation();
  var bg = require ('../../assets/media/bg.png');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState('')
  const [loginLinkReceived, setLoginLinkReceived] = useState(false);
  const [otp, setOtp] = useState();

  const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };

  const signInWithOtp = async () => {
    const { data, error } = await supabase.auth.verifyOtp({ email:email, token: otp, type: 'magiclink'})
    if (error) console.error(error)
    navigation.navigate('Home')
  }

  async function signInWithEmail(e) {
    e.preventDefault();
    if(loginLinkReceived && otp){
      signInWithOtp();
      return;
    }
    if(!validateEmail(email)){
      setShowErrorMessage('Invalid Email');
      return;
    }
    setShowErrorMessage('');
    setLoading(true);
    const res = await supabase.auth.signInWithPassword({ email: email, password: password })
    if(res.data.session){
      navigation.navigate('Home')
    }
    if (res.error){
      console.error(res.error.message)
      if(res.error.message==='Invalid login credentials'){
        setShowErrorMessage('Invalid login credentials')
      }
    }
    setLoading(false)
  }

  const signInWithLink = async (e) => {
    e.preventDefault()
    try {
      if(!validateEmail(email)){
        setShowErrorMessage('Invalid Email');
        return;
      }
      if(password.length < 6) {
        setShowErrorMessage('Password should be atleast 6 characters');
        return;
      }
      const { data, error } = await supabase.from('profiles').select('id').eq('email', email)
      if(data.length == 0){
        setShowErrorMessage('Given email is not registered. Please sign up for an account.');
        return;
      }
      setShowErrorMessage('');
      setLoading(true)
      const res = await supabase.auth.signInWithOtp({ email })
      if (res.error) throw res.error
      setLoginLinkReceived(true)
    } catch (error) {
      console.error(error.error_description || error.message)
      setShowErrorMessage(error.message);
    } finally {
      setLoading(false)
    }
  }

  const signInWithProvider = async (provider) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider,
    })
    console.log(data)
    await Linking.openURL(data.url)
    if (error) console.error(error.message)
  }

  useEffect(() => {
    Linking.addEventListener('url', event => {
      let urlString = event.url.replace('#', '?');
      const url = new URL(urlString);

      const refreshToken = url.searchParams.get('refresh_token');
      const accessToken = url.searchParams.get('access_token');
      const type = url.searchParams.get('type');

      console.log(urlString)

      if (accessToken && refreshToken) {
        supabase.auth.setSession({ refresh_token: refreshToken, access_token: accessToken })
          .then(res => { navigation.navigate('Home') })
          .catch(err => console.log({err}));
      }
    })
    return () => {
      Linking.removeAllListeners('url');
    };
  }, [])

  return (
    <View style={styles.container}>
    <ImageBackground source={bg} style={styles.background}>
      <View style={styles.contentContainer}>
        {/* <TouchableOpacity style={{width:40, height:40, backgroundColor:'red'}} onPress={()=>{navigation.navigate('DebugScreen')}} /> */}
        <Text style={styles.header}>Log in to your fitness account</Text>
        <View style={styles.loginContainer}>
          <TextInput 
            style={[styles.textInputStyle, showErrorMessage!=''?{borderBottomColor: 'red'}:{borderBottomColor: '#D4AF37'}]}
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
            style={[styles.textInputStyle, showErrorMessage!=''?{borderBottomColor: 'red'}:{borderBottomColor: '#D4AF37'}]}
            onChangeText={(text) => setPassword(text)}
            onSubmitEditing = {() => {setPassword('')}}
            value={password}
            secureTextEntry={true}
            placeholder='Enter your password'
            placeholderTextColor={'rgba(250,250,250,0.3)'}
            cursorColor='white'
            underlineColorAndroid="transparent"
          />
          <Text style={{fontFamily: 'Montserrat-Regular', fontSize: 12, color: 'rgba(250,250,250,0.8)', textAlign: 'center', margin: '2%'}}>Or</Text>
          <View style={styles.linkContainer}>
            <TouchableOpacity onPress={(e) => signInWithLink(e)}>
              <Text style={{fontFamily: 'Montserrat-Italic', color: 'white'}}>Receive Login Link</Text>
            </TouchableOpacity>
            {loginLinkReceived && <TextInput keyboardType = 'numeric' letterSpacing={5} maxLength={6} style={styles.otpInput} value={otp} onChangeText={(text) => setOtp(text)} placeholder='OTP'/>}
          </View>
          <Text style={{fontFamily: 'Montserrat-Regular', fontSize: 12, color: 'rgba(250,250,250,0.8)', textAlign: 'center', margin: '2%'}}>Or</Text>
          <View style={styles.socialsContainer}>
            <TouchableOpacity onPress={()=>signInWithProvider('google')}><FontAwesome name='google' size={16} color='white' /></TouchableOpacity>
            <TouchableOpacity><FontAwesome name='facebook' size={16} color='white' /></TouchableOpacity>
            <TouchableOpacity onPress={()=>signInWithProvider('spotify')}><FontAwesome name='spotify' size={16} color='white' /></TouchableOpacity>
          </View>
          <View style={styles.footerContainer}>
            <Text style={{fontFamily: 'Montserrat-Regular', color: 'white'}}>New User? </Text>
            <TouchableOpacity onPress={() => {navigation.navigate('SignupScreen')}}>
              <Text style={{fontFamily: 'Montserrat-Italic', color: 'white'}}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={{width: '75%'}} onPress={(e) => signInWithEmail(e)}>
          <View style={styles.loginButton}>
            {loading && <ActivityIndicator color="rgba(250,250,250,0.8)" />}
            {!loading && <Text style={{fontFamily: 'Montserrat-Regular', color: 'white'}}>Login</Text>}
          </View>
        </TouchableOpacity>
        {loginLinkReceived && <Text style={{fontFamily: 'Montserrat-Regular', color: 'white', marginTop: 10}}>Check your email for the login link</Text>}
        {showErrorMessage!='' && <Text style={{fontFamily: 'Montserrat-Regular', color: 'white', marginTop: 10}}>{showErrorMessage}</Text>}
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
      borderBottomWidth: 1,
      borderTopEndRadius: 10,
      width: '100%'
    },
    otpInput: {
      marginTop: '4%',
      fontFamily: 'Montserrat-Regular',
      fontSize: 20,
      color: 'white',
      backgroundColor: 'rgba(20,20,20,0.2)',
      borderBottomWidth: 1,
      borderTopEndRadius: 10,
      width: '60%',
      textAlign: 'center'
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

export default LoginScreen;
