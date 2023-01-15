import React, { useEffect, useState } from 'react';
import {StyleSheet, View, Text, ImageBackground, TouchableOpacity, TextInput, Dimensions} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { supabase } from '../../supabaseClient';
import {useNavigation} from '@react-navigation/native';

var screenHeight = Dimensions.get('screen').height;

const AccountScreen = () => {
  const navigation = useNavigation();
  var bg = require ('../../assets/media/bg.png');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [showPasswordContainer, setShowPasswordContainer] = useState(false);

  useEffect(()=>{
    setUsername('zero');
    setEmail('test@test.com');
    setDisplayName('Zero');
  },[])

  return (
    <View style={styles.container}>
    <ImageBackground source={bg} style={styles.background}>
      <View style={styles.contentContainer}>
        <Text style={styles.header}>Account Details</Text>
          <View style={styles.field}>
            <Text style={{fontFamily: 'Montserrat-Italic', color: 'white'}}>Email: </Text>
            <TextInput 
            style={[styles.textInputStyle, {marginLeft: 'auto', marginRight: 10}]}
            onChangeText={(text) => setEmail(text)}
            onSubmitEditing = {() => {setEmail('')}}
            keyboardType='email-address'
            value={email}
            cursorColor='white'
            underlineColorAndroid="transparent"
            placeholder='Enter your email'
            placeholderTextColor={'rgba(250,250,250,0.3)'}
            />
          </View>
          <View style={styles.field}>
            <Text style={{fontFamily: 'Montserrat-Italic', color: 'white'}}>Display Name: </Text>
            <TextInput 
            style={[styles.textInputStyle, {marginLeft: 'auto', marginRight: 10}]}
            onChangeText={(text) => setDisplayName(text)}
            onSubmitEditing = {() => {setDisplayName('')}}
            value={displayName}
            cursorColor='white'
            underlineColorAndroid="transparent"
            placeholder='Enter your display name'
            placeholderTextColor={'rgba(250,250,250,0.3)'}
            />
        </View>
        <View style={styles.field}>
            <Text style={{fontFamily: 'Montserrat-Italic', color: 'white'}}>User Name: </Text>   
            <TextInput 
            style={[styles.textInputStyle, {marginLeft: 'auto', marginRight: 10}]}
            onChangeText={(text) => setUsername(text)}
            onSubmitEditing = {() => {setUsername('')}}
            value={username}
            cursorColor='white'
            underlineColorAndroid="transparent"
            placeholder={username}
            placeholderTextColor={'rgba(250,250,250,0.3)'}
          />
        </View>
        {showPasswordContainer &&
        <View style={styles.passwordContainer}>
            <TextInput 
            style={styles.textInputStyle}
            onChangeText={(text) => setPassword(text)}
            onSubmitEditing = {() => {setPassword('')}}
            value={password}
            secureTextEntry={true}
            placeholder='Enter your current password'
            placeholderTextColor={'rgba(250,250,250,0.3)'}
            cursorColor='white'
            underlineColorAndroid="transparent"
          />
          <TextInput 
            style={[styles.textInputStyle, {marginTop: 10}]}
            onChangeText={(text) => setNewPassword(text)}
            onSubmitEditing = {() => {setNewPassword('')}}
            value={newPassword}
            secureTextEntry={true}
            placeholder='Enter your new password'
            placeholderTextColor={'rgba(250,250,250,0.3)'}
            cursorColor='white'
            underlineColorAndroid="transparent"
          />
        </View>
        }
        <View style={{flexDirection: 'row'}}>
            <TouchableOpacity onPress={()=>{setShowPasswordContainer(!showPasswordContainer)}}
            style={{width: '40%', marginLeft: 10}}>
                <View style={styles.buttonContainer}>
                    <Text style={{fontFamily: 'Montserrat-Italic'}}>
                        {showPasswordContainer?'Cancel':'Change Password'}</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={{width: '40%', marginLeft: 'auto', marginRight: 10}}>
                <View style={styles.buttonContainer}>
                    <Text style={{fontFamily: 'Montserrat-Italic'}}>Save Changes</Text>
                </View>
            </TouchableOpacity>
        </View>
        
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
      height: screenHeight
    },
    contentContainer: {
      flex: 1,
      paddingTop: '15%',
    },
    header: {
      fontFamily: 'Montserrat-Regular',
      color: "#D4AF37",
      fontWeight: "600",
      textAlign: "center",
      fontSize: 20,
      marginBottom: 40
    },
    field: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: '4%',
      marginLeft: 10
    },
    textInputStyle: {
      fontFamily: 'Montserrat-Regular',
      paddingVertical: 5,
      fontSize: 14,
      color: 'white',
      backgroundColor: 'rgba(20,20,20,0.2)',
      borderBottomColor: '#D4AF37',
      borderBottomWidth: 1,
      borderTopEndRadius: 10,
      width: '65%'
    },
    buttonContainer: {
      backgroundColor: '#D4AF37',
      alignItems: 'center',
      paddingVertical: 5,
      borderRadius: 5,
      marginTop: '6%',
    },
    passwordContainer: {
        alignItems: 'center',
        paddingBottom: '4%'
    }
});

export default AccountScreen;
