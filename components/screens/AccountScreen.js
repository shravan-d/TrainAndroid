import React, { useEffect, useState, useContext } from 'react';
import {StyleSheet, View, Text, Modal, ImageBackground, Image, TouchableOpacity, TextInput, Dimensions, ScrollView, ActivityIndicator} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { supabase } from '../../supabaseClient';
import {useNavigation} from '@react-navigation/native';
import { AuthContext } from '../../App';
import ImgToBase64 from 'react-native-image-base64';
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import IonIcon from 'react-native-vector-icons/Ionicons';
import Dropdown from '../views/Dropdown';

var screenHeight = Dimensions.get('screen').height;
var screenWidth = Dimensions.get('screen').width;

const AccountScreen = () => {
  const navigation = useNavigation();
  var bg = require ('../../assets/media/bg.png');
  const user = useContext(AuthContext);
  var defaultIcon = require ('../../assets/media/logo.png');
  
  const [avatar, setAvatar] = useState(user?.user_metadata.avatar_url)
  const [newAvatar, setNewAvatar] = useState(null);
  const [image, setImage] = useState(defaultIcon)
  const [email, setEmail] = useState(user?.email);
  const [displayName, setDisplayName] = useState(user?.user_metadata.display_name||user?.user_metadata.name);
  const [username, setUsername] = useState(user?.user_metadata.username);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPasswordContainer, setShowPasswordContainer] = useState(false);
  const [monthActiveData, setMonthActiveData] = useState([]);
  const [updating, setUpdating] = useState(-1);
  const [showGallery, setShowGallery] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [albumNames, setAlbumNames] = useState([]);
  const [value, setValue] = useState(null);
  const [usernameExists, setUsernameExists] = useState(0);
  var days = ["2018-10-28", "2018-10-29", "2018-10-30", "2018-11-3", "2018-11-4"];
  const Buffer = require("buffer").Buffer;

  const uploadImage = async () => {
    var count = Math.floor(Math.random() * 1000);
    var filename = 'public/avatar'+user.id.toString()+count.toString()+'.jpg';
    var base64Data = await ImgToBase64.getBase64String(newAvatar);
    const buf = Buffer.from(base64Data, 'base64');
    const { data, error } = await supabase
      .storage
      .from('avatars')
      .upload(filename, buf, {
        contentType: 'image/jpeg',
        upsert: true,
      })
    if (error) console.error(error.message)
    else return data.path;
  }

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

  const updatePassword = async () => {
    setUpdating(0);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error;
      setUpdating(1);
    }
    catch (error) {
      console.error(error.message);
      setUpdating(-2);
    }

  }

  const updateUserData = async () => {
    if (showPasswordContainer) {
      updatePassword();
      return;
    }
    if(username===user.user_metadata.username&&displayName===user.user_metadata.display_name&&avatar===newAvatar){
      return;
    }
    setUpdating(0);
    try {
      var newData = {};
      if(username!==user.user_metadata.username){
        newData.username = username;
      }
      if(displayName!==user.user_metadata.display_name){
        newData.display_name = displayName;
      }
      if(newAvatar){
        var avatar_url = await uploadImage();
        if(avatar_url) newData.avatar_url = avatar_url;
        else throw { message: 'RLS' };
        console.log(avatar_url)
        setAvatar(avatar_url);
      }
      const { error } = await supabase.auth.updateUser({ data: newData })
      newData.updated_at = Date.now();
      const { profileError } = await supabase.from('profiles').update(newData).eq('id', user.id)
      if (error) throw error;
      if (profileError) throw profileError;
      setUpdating(1);
    }
    catch (error) {
      console.error(error.message);
      setUpdating(-2);
    }
  }

  const getPhotos = (albumName) => {
    var data = {
      first: 30,
      assetType: 'Photos'
    }
    if(albumName){
      data.groupTypes = 'Album';
      data.groupName = albumName;
    }
    CameraRoll.getPhotos(data)
    .then(r => setGalleryImages(r.edges));
  }

  const getAlbums = () => {
    CameraRoll.getAlbums({
      assetType: 'Photos',
    })
    .then(r => {
      var data = [];
      r.map(a => { data.push({label: a.title, value: a.title} ) })
      setAlbumNames(data)
    })
  }

  const setNewAvatarFunc = (idx) => {
    setNewAvatar(galleryImages.at(idx).node.image.uri);
    setImage({uri: galleryImages.at(idx).node.image.uri})
    setShowGallery(false);
  }

  const getUsername = async () => {
    if (user.user_metadata.username != null) return;
    const { data, error } = await supabase.from('profiles').select('username').eq('email', user.email);
    if(error) console.error(error)
    else setUsername(data[0].username);
  }

  const checkUsernames = async () => {
    if(username==null) return;
    if (user.user_metadata.username == username) return;
    console.log('chainge')
    const { data, error } = await supabase.from('profiles').select().eq('username', username).neq('id', user.id);
    if(error) console.error(error)
    if (data.length > 0)
      setUsernameExists(1);
    else 
      setUsernameExists(2);
  }

  useEffect(()=>{
    getAlbums();
    setActiveList();
    getUsername();
  },[])

  useEffect(() => {
    if(!avatar) return;
    if(avatar.indexOf('avatar') > -1){
      const { data } = supabase
      .storage
      .from('avatars')
      .getPublicUrl(avatar)
      if (data) setImage({uri: data.publicUrl});
    } else if (avatar.indexOf('google') > -1) {
      setImage({uri: avatar})
    }
  }, [avatar])

  useEffect(() => {
    getPhotos(value);
  }, [value])

  useEffect(()=> {checkUsernames()}, [username])
  
  return (
    <View style={styles.container}>
    <ImageBackground source={bg} style={styles.background} imageStyle={{opacity: 0.4}}>
      <ScrollView style={styles.contentContainer}>
        <Text style={styles.header}>Account Details</Text>
        <View style={styles.contactImage}>
          <TouchableOpacity onPress={() => {setShowGallery(!showGallery);getPhotos()}}>
            <Image style={styles.image} source={image} />
          </TouchableOpacity>
        </View>
        <View style={styles.field}>
          <Text style={{fontFamily: 'Montserrat-Italic', color: 'white'}}>Email: </Text>
          <TextInput 
          style={[styles.textInputStyle, {marginLeft: 'auto', marginRight: 10}]}
          onChangeText={(text) => setEmail(text)}
          onSubmitEditing = {() => {setEmail('')}}
          editable={false}
          keyboardType='email-address'
          value={email}
          cursorColor='white'
          underlineColorAndroid="transparent"
          placeholder='Enter your email'
          placeholderTextColor={'rgba(250,250,250,0.3)'}
          />
        </View>
        {!showPasswordContainer && 
        <>
        <View style={styles.field}>
          <Text style={{fontFamily: 'Montserrat-Italic', color: 'white'}}>Display Name: </Text>
          <TextInput 
          style={[styles.textInputStyle, {marginLeft: 'auto', marginRight: 10}]}
          onChangeText={(text) => setDisplayName(text)}
          onSubmitEditing = {() => {setDisplayName('')}}
          value={displayName}
          cursorColor='white'
          underlineColorAndroid="transparent"
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
          placeholderTextColor={'rgba(250,250,250,0.3)'}
        />
        <View style={{flexDirection: 'row', position: 'absolute', right: 20, alignItems: 'center'}}>
          {usernameExists == 1 && <IonIcon name="ios-close-circle" color="rgba(250,0,0,0.8)" size={14} />}
          {usernameExists == 2 && <IonIcon name="ios-checkmark-circle" color="rgba(0,250,0,0.8)" size={14} />}
          {usernameExists == 1 && <Text style={{fontFamily: 'Montserrat-Italic', color: 'white', marginLeft: 5}}>Exists!</Text>}
        </View>
        </View>
        </>}
        {showPasswordContainer &&
        <>
        <View style={styles.field}>
          <Text style={{fontFamily: 'Montserrat-Italic', color: 'white'}}>Current Password: </Text>
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
        </View>
        <View style={styles.field}>
          <Text style={{fontFamily: 'Montserrat-Italic', color: 'white'}}>New Password: </Text>
          <TextInput 
          style={[styles.textInputStyle, {marginLeft: 'auto', marginRight: 10}]}
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
        </>
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
        <Modal
        animationType="fade"
        transparent={true}
        visible={showGallery}
        onRequestClose={() => {setShowGallery(!showGallery)}}
        >
          <View style={styles.centeredView}>
            <Text style={styles.header}>Pick your new avatar</Text>
            <Dropdown value={value} setValue={setValue} header={''} dropdownItems={albumNames} elevation={1} />
            <ScrollView>
            <View style={styles.imageGrid}>
            {galleryImages.map((p, idx) => 
            (
              <TouchableOpacity key={idx} onPress={() => setNewAvatarFunc(idx)}>
                <Image style={{width: 0.3333*screenWidth, height: 0.3333*screenWidth}} source={{uri: p.node.image.uri}} />
              </TouchableOpacity>
            )
            )}
            </View>
            </ScrollView>
          </View>
        </Modal>
      </ScrollView>
      
    </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      width: "100%",
      height: '100%',
      backgroundColor: 'black'
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
      marginVertical: '3%',
      borderWidth: 0.3,
      borderColor: '#D4AF37',
      justifyContent: 'center',
      // alignItems: 'center'
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
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingTop: 50,
      backgroundColor: 'black'
    },
    imageGrid: {
      marginTop: '5%',
      backgroundColor: "white",
      flexDirection: 'row',
      flexWrap: 'wrap'
    },
});

export default AccountScreen;

