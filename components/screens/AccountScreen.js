import React, { useEffect, useState, useContext } from 'react';
import {StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity, TextInput, Dimensions, ScrollView, ActivityIndicator} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { supabase } from '../../supabaseClient';
import {useNavigation} from '@react-navigation/native';
import { AuthContext } from '../../App';

var screenHeight = Dimensions.get('screen').height;

const AccountScreen = () => {
  const navigation = useNavigation();
  var bg = require ('../../assets/media/bg.png');
  const user = useContext(AuthContext);

  const [avatar, setAvatar] = useState(user?.user_metadata.avatar_url)
  const [email, setEmail] = useState(user?.email);
  const [displayName, setDisplayName] = useState(user?.user_metadata.display_name);
  const [username, setUsername] = useState(user?.user_metadata.username);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPasswordContainer, setShowPasswordContainer] = useState(false);
  const [monthActiveData, setMonthActiveData] = useState([]);
  const [updating, setUpdating] = useState(-1);
  var days = ["2018-10-28", "2018-10-29", "2018-10-30", "2018-11-3", "2018-11-4"];
  
  const setActiveList = () => {
    let currentMonth =  new Date()
    let monthUpto = 10;
    let months = [];
    months.push({name: 'January', activeDays: new Array(31).fill(0)})
    if(monthUpto>0) months.push({name: 'February', activeDays: new Array(28).fill(0)})
    if(monthUpto>1)months.push({name: 'March', activeDays: new Array(31).fill(0)})
    if(monthUpto>2)months.push({name: 'April', activeDays: new Array(30).fill(0)})
    if(monthUpto>3)months.push({name: 'May', activeDays: new Array(31).fill(0)})
    if(monthUpto>4)months.push({name: 'June', activeDays: new Array(30).fill(0)})
    if(monthUpto>5)months.push({name: 'July', activeDays: new Array(31).fill(0)})
    if(monthUpto>6)months.push({name: 'August', activeDays: new Array(32).fill(0)})
    if(monthUpto>7)months.push({name: 'September', activeDays: new Array(30).fill(0)})
    if(monthUpto>8)months.push({name: 'October', activeDays: new Array(31).fill(0)})
    if(monthUpto>9)months.push({name: 'November', activeDays: new Array(30).fill(0)})
    if(monthUpto>10)months.push({name: 'December', activeDays: new Array(31).fill(0)})
    for(let i = 0;i<days.length;i++){
      let date = new Date(days[i])
      let day = date.getDate();
      let month = date.getMonth();
      months[month].activeDays[day] = 1;
    }
    setMonthActiveData(months);
  }

  const updateUserData = async () => {
    if(email===user.email&&username===user.user_metadata.username&&displayName===user.user_metadata.display_name){
      return;
    }
    setUpdating(0);
    try {
      const { error } = await supabase.auth.updateUser({
        email: email,
        options: {
          data: { username: username, display_name: displayName }
        }
      })
      if (error) throw error;
      setUpdating(1);
    }
    catch (error) {
      console.error(error.message);
      setUpdating(-2);
    }
    finally {
      console.log('Updated')
      // setUpdating(1);
    }
  }
  var defaultIonIcon = require ('../../assets/media/logo.png');
  let image = avatar?{uri: avatar}:defaultIonIcon;
  useEffect(()=>{
    setActiveList();
  },[])

  return (
    <View style={styles.container}>
    <ImageBackground source={bg} style={styles.background}>
      <ScrollView style={styles.contentContainer}>
        <Text style={styles.header}>Account Details</Text>
          <View style={styles.contactImage}>
            <TouchableOpacity onPress={() => {console.log('Press')}}>
              <Image style={styles.image} source={image} />
            </TouchableOpacity>
          </View>
          <View style={styles.field}>
            <Text style={{fontFamily: 'Montserrat-Italic', color: 'white'}}>Email: </Text>
            <TextInput 
            style={[styles.textInputStyle, {marginLeft: 'auto', marginRight: 10}]}
            onChangeText={(text) => setEmail(text)}
            onSubmitEditing = {() => {setEmail('')}}
            // editable={false}//Change if can be updated
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
                    <Text style={{fontFamily: 'Montserrat-Regular', color: 'white'}}>
                        {showPasswordContainer?'Cancel':'Change Password'}</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity 
            disabled={updating!=-1}
            onPress={()=>updateUserData()}
            style={{width: '40%', marginLeft: 'auto', marginRight: 10}}>
                <View style={styles.buttonContainer}>
                    {updating==-1&&<Text style={{fontFamily: 'Montserrat-Regular', color: 'white'}}>Save Changes</Text>}
                    {updating==1&&<Text style={{fontFamily: 'Montserrat-Regular', color: 'white'}}>Changes Saved</Text>}
                    {updating==-2&&<Text style={{fontFamily: 'Montserrat-Regular', color: 'white'}}>Unable to save</Text>}
                    {updating==-0&&<ActivityIndicator color="rgba(250,250,250,0.8)" />}
                </View>
            </TouchableOpacity>
        </View>
        <Text style={[styles.header, {marginTop: '5%'}]}>Daily Activity Chart</Text>
        <View style={styles.activityContainer}>
          {monthActiveData.map((month, index) => (
            <View key={index} style={styles.monthBox}>
            <Text style={{fontFamily: 'Montserrat-Italic', color: 'white'}}>{month.name}</Text>
            <View style={{flexDirection: 'row', flexWrap: 'wrap', marginVertical: 4}}>
            {month.activeDays.map((day, idx) => {
              if (day) return <View key={idx} style={[styles.dayBox, {backgroundColor: '#D4AF37'}]}></View>
              else return <View key={idx} style={styles.dayBox}></View>
            })} 
            </View>
            </View>
          ))}
        </View>
      </ScrollView>
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
    contactImage: {
      width: 80,
      height: 80,
      borderRadius: 80,
      alignSelf: 'center',
      marginBottom: '3%'
    },
    image: {
      width: "100%", 
      height: "100%",
      borderRadius: 80,
    },
    header: {
      fontFamily: 'Montserrat-Regular',
      color: "#D4AF37",
      fontWeight: "600",
      textAlign: "center",
      fontSize: 20,
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
    },
    activityContainer: {
      backgroundColor: 'rgba(0,0,0,0.7)',
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      padding: 10,
      justifyContent: 'center'
    },
    monthBox: {
      margin: 2,
      maxWidth: '22%',
      alignItems: 'center'
    },
    dayBox: {
      width: 8,
      height: 8,
      margin: 1,
      borderRadius: 2,
      backgroundColor: 'rgba(20,20,20,0.8)'
    }
});

export default AccountScreen;

