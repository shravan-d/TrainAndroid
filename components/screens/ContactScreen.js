import React, { useState, useMemo, useEffect, useContext, useRef} from 'react';
import {StyleSheet, ImageBackground, View, Text, TextInput, ScrollView, TouchableOpacity, Animated, Dimensions} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import ContactCard from '../views/ContactCard';
import MenuBar from '../views/MenuBar';
import NavBar from '../views/NavBar';
import { useNavigation } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';
import UserCard from '../views/UserCard';
import { supabase } from '../../supabaseClient';
import { AuthContext } from '../../App';
import ImgToBase64 from 'react-native-image-base64';
import { useSelector, useDispatch } from 'react-redux';
import { LoadingCard, LoadingContactCard } from '../views/LoadingCard';

const screenHeight = Dimensions.get("window").height
const screenWidth = Dimensions.get("window").width

const ContactScreen = ({ route }) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused()
  const { path, type, sendCapture, contentText, positionY } = route.params;
  const mediaSource = useMemo(() => (`file://${path}`), [path]);
  const user = useContext(AuthContext);
  var bg = require ('../../assets/media/bg.png');
  const Buffer = require("buffer").Buffer;
  var ballAnimatedValue = useRef(new Animated.Value(0)).current;
  
  const [contactList, setContactList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [search, setSearch] = useState('');
  const [openSearch, setOpenSearch] = useState(false)
  const [openUserSearch, setOpenUserSearch] = useState(false)
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [sendScreen, setSendScreen] = useState(sendCapture);
  const [loading, setLoading] = useState(true);

  const newMessage = useSelector(state => state.newMessage)
  const hasNewMessage = useSelector(state => state.hasNewMessage)
  const newShot = useSelector(state => state.newShot)
  const hasNewShot = useSelector(state => state.hasNewShot)

  contactList.sort(function(a, b) {return (new Date(a.lastMessageTime) > new Date(b.lastMessageTime))?-1:1;});

  const filteredContacts = useMemo( () => { return contactList.filter(function (item) {
    const itemData1 = item.user.display_name.toUpperCase();
    const itemData2 = item.user.username.toUpperCase();
    const textData = search.toUpperCase();
    var searchBool1 = search==''?true:itemData1.indexOf(textData) > -1;
    var searchBool2 = search==''?true:itemData2.indexOf(textData) > -1;
    return searchBool1 || searchBool2;
  })}, [search, contactList])


  const searchUsers = async (text) => {
    if (text!='') {
      setSearch(text);
      const {data, error} = await supabase.from('profiles').select().like('username', text+'%').neq('id', user.id).limit(10);
      if (error) console.error(error.message)
      else setUserList(data)
    } else {
      setUserList([])
      setSearch(text);
    }
  }
  
  const createNewChat = async (secondUser) => {
    var chatExists = contactList.filter(ele => ele.user.id==secondUser.id);
    if(chatExists.length > 0) {
      navigation.navigate('ChatScreen', { secondUser: secondUser, chatroomId: chatExists[0].chatroomId });
      setOpenUserSearch(false);
    } else {
      var { data, error } = await supabase.from('chat_room').insert({}).select('id')
      if(error) console.error(error)
      var chatroomId = data[0].id;
      navigation.navigate('ChatScreen', { secondUser: secondUser, chatroomId: chatroomId })
      var { data, error } = await supabase.from('participants')
      .insert([{chatroom_id: chatroomId, user_id: user.id}, {chatroom_id: chatroomId, user_id: secondUser.id}])
      if(error) console.error(error)
      var tempContact = {user: secondUser, chatroomId: chatroomId, streak: 0, lastMessageTime: null, newMsg: false, newShot: false};
      var tempList = contactList.slice();
      tempList.push(tempContact)
      setContactList(tempList);
    }
  }

  const onCardPress = (contact, idx) => {
    if (sendScreen){
        const index = selectedContacts.indexOf(contact.user.id);
        if (index > -1) { 
          setSelectedContacts(oldArray => oldArray.filter((old_id)=> {return old_id != contact.user.id}));
        } else
          setSelectedContacts(oldArray => [...oldArray, contact.user.id] )
    } else {
      var tempContacts = [...contactList.slice(0, idx), {...contact, newMsg: false}, ...contactList.slice(idx+1)];
      setContactList(tempContacts);
      navigation.navigate('ChatScreen', { secondUser: contact.user, chatroomId: contact.chatroomId });
      setOpenUserSearch(false);
    }
  };

  const getChatrooms = async () => {
    const res = await supabase.from('participants').select('chatroom_id').eq('user_id', user.id);
    var chatrooms = res.data.map((e) => e.chatroom_id)
    const { data, error } = await supabase.from('participants').select('*, chat_room(streak), profiles(*)')
    .in('chatroom_id', chatrooms).neq('user_id', user.id)
    if(error) console.error(error);
    var tempList = data.map((ele) => {
      var timeToDisplay = null;
      if (ele.last_msg_date && ele.last_shot_date)
        timeToDisplay = new Date(ele.last_msg_date) > new Date(ele.last_shot_date) ?
        new Date(ele.last_msg_date) : new Date(ele.last_shot_date);
      else if (ele.last_msg_date) timeToDisplay =  new Date(ele.last_msg_date)
      else if (ele.last_shot_date) timeToDisplay = new Date(ele.last_shot_date);
      return {
        user: ele.profiles, chatroomId: ele.chatroom_id, streak: ele.chat_room.streak,
        lastMessageTime: timeToDisplay, newMsg: ele.sent_unread_msg, newShot: ele.sent_unseen_shot}
    })
    setContactList(tempList);
    setLoading(false);
  }

  const uploadImage = async () => {
    var count = Math.floor(Math.random() * 1000);
    var filename = 'private/'+user.id.toString()+count.toString()+'.jpg';
    var base64Data = await ImgToBase64.getBase64String(mediaSource);
    const buf = Buffer.from(base64Data, 'base64');
    const { data, error } = await supabase
      .storage
      .from('shots')
      .upload(filename, buf, {
        contentType: 'image/jpeg',
        upsert: false,
      })
    if (error) console.error(error.message)
    else return data.path;
  }

  const uploadVideo = async () => {
    var count = Math.floor(Math.random() * 1000);
    var filename = 'private/'+user.id.toString()+count.toString()+'.mp4';
    let formData = new FormData();
    formData.append(filename, {
        name: filename,
        uri: mediaSource.slice(7),
        type: 'video/mp4'
    });
    const { data, error } = await supabase
      .storage
      .from('shots')
      .upload(filename, formData, {
        contentType: 'video/mp4',
        upsert: false,
      })
    if (error) console.error(error.message)
    else return data.path;
  }

  const moveBall = () => {
    Animated.timing(ballAnimatedValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
    setTimeout(()=> {ballAnimatedValue.setValue(0);}, 1000)
  };

  const yVal = ballAnimatedValue.interpolate({
    inputRange: [0, 0.4, 0.6, 0.9, 1],
    outputRange: [0, 0, -55, -55, 0],
  });
  const opacity = ballAnimatedValue.interpolate({
    inputRange: [0, 0.1, 0.9, 1],
    outputRange: [0, 1, 1, 0],
  });
  const xVal = ballAnimatedValue.interpolate({
    inputRange: [0, 0.4, 0.6, 0.9, 1],
    outputRange: [0, 130, 130, -10, -10],
  });
  const animStyle = {
    transform: [{ translateY: yVal }, { translateX: xVal }]
  };

  const sendShot = async () => {
    var media_url = type=='photo'?await uploadImage():await uploadVideo();
    var newShots = [];
    for (const secondUserId of selectedContacts){
      var newData = {sender_id: user.id, receiver_id: secondUserId, content_url: media_url};
      if (contentText){
        newData.content_text = contentText;
        newData.text_position = Math.round(positionY);
      }
      newShots.push(newData);
    }
    const { data, error } = await supabase.from('shots').insert(newShots);
    if(error) console.error(error.message)
    moveBall();
    setSendScreen(false);

    const now = new Date()
    for (const secondUserId of selectedContacts){
      const chatroomId = contactList.find((ele) => {return ele.user.id==secondUserId}).chatroomId
      const streakData = await supabase.from('chat_room').select().eq('id', chatroomId)
      
      if (streakData.data[0].last_streak_date == now.toISOString().split('T')[0]){
        return;
      }
      const res = await supabase.from('shots').select('id').eq('sender_id', secondUserId).
      eq('receiver_id', user.id).gt('sent_at', now.toISOString().split('T')[0])
      if(res.error) console.error(res.error.message)
      if(res.data.length > 0){
        var newData = {'last_streak_date': new Date(), 'streak': streakData.data[0].streak + 1}
        if(streakData.data[0].last_streak_date == null)
          newData.start_day = now.getUTCDay();
        const res_ = await supabase.from('chat_room').update(newData).eq('id', chatroomId);
        if(res_.error) console.error(res_.error.message)
      }
    }
    setSelectedContacts([]);
  }
  
  const updateReceivedMsg = () => {
    if(!hasNewMessage) return;
    var itemIdx = -1;
    for (let idx = 0;idx < contactList.length; idx++){
      if(contactList[idx].chatroomId==newMessage.chatroom_id){
        itemIdx = idx;
        break;
      }
    }
    if(itemIdx!=-1){
      var contacts = [...contactList.slice(0, itemIdx), {...contactList[itemIdx], newMsg: true, lastMessageTime: newMessage.sent_at}, 
      ...contactList.slice(itemIdx+1)]
      setContactList(contacts);
    }
  }

  useEffect(() => {updateReceivedMsg()}, [newMessage])

  const updateReceivedShot = () => {
    if (!newShot) return;
    var itemIdx = -1;
    for (let idx = 0;idx < contactList.length; idx++){
      if(contactList[idx].user.id==newShot.sender_id){
        itemIdx = idx;
        break;
      }
    }
    if(itemIdx!=-1){
      var contacts = [...contactList.slice(0, itemIdx), {...contactList[itemIdx], newShot: hasNewShot, lastMessageTime: newShot.sent_at}, 
      ...contactList.slice(itemIdx+1)]
      setContactList(contacts);
    }
  }

  useEffect(() => {updateReceivedShot()}, [hasNewShot])
  
  useEffect(() => { 
    setSelectedContacts([]);
  }, [isFocused]);

  useEffect(() => {
    setSendScreen(sendCapture)
  }, [sendCapture])

  useEffect(() => {
    getChatrooms();
  }, [])

  return (
    <View style={styles.container}>  
      <View style={{height: '100%'}}>
      <ImageBackground source={bg} style={{height: '100%'}}>
        <View style={styles.topBar}>
          {!openSearch && !openUserSearch &&
          <>
          <Text style={styles.header}>TrainShots</Text>
          <TouchableOpacity onPress={() => {setOpenUserSearch(!openUserSearch)}} style={[styles.searchButton, {marginRight: '7%'}]}>
            <IonIcon name="ios-add-outline" color="rgba(250,250,250,0.8)" size={24} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {setOpenSearch(!openSearch)}} style={styles.searchButton}>
            <IonIcon name="ios-search-outline" color="rgba(250,250,250,0.8)" size={24} />
          </TouchableOpacity>
          </>
          }
          {openUserSearch &&
          <>
          <TextInput 
            style={styles.textInputStyle} 
            maxLength={20}
            onChangeText={(text) => searchUsers(text)}
            onSubmitEditing = {() => {setOpenUserSearch(!openUserSearch); setSearch('')}}
            value={search}
            cursorColor='white'
            underlineColorAndroid="transparent"
            placeholder='Search by username'
          />
          <TouchableOpacity onPress={() => {setOpenUserSearch(!openUserSearch)}} style={styles.closeButton}>
            <IonIcon name="close-outline" color="rgba(250,250,250,0.8)" size={24} />
          </TouchableOpacity>
          </>
          } 
          {openSearch &&
          <>
          <TextInput 
            style={styles.textInputStyle} 
            maxLength={20}
            onChangeText={(text) => setSearch(text)}
            onSubmitEditing = {() => {setOpenSearch(!openSearch); setSearch('')}}
            value={search}
            cursorColor='white'
            underlineColorAndroid="transparent"
          />
          <TouchableOpacity onPress={() => {setOpenSearch(!openSearch)}} style={styles.closeButton}>
            <IonIcon name="close-outline" color="rgba(250,250,250,0.8)" size={24} />
          </TouchableOpacity>
          </>
          } 
        </View>
        {openUserSearch &&
        <View style={styles.userContainer}>
          <ScrollView>
            {userList.map((userCard) => (
                <TouchableOpacity key={userCard.id} onPress={() => createNewChat(userCard)}>
                  <UserCard user={userCard} />
                </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        }
        <View style={[styles.contactContainer, openUserSearch?{height: '58%'}:{height: '86%', marginTop: 55}]}>
          <ScrollView>
            {loading && 
            <View>
              <LoadingContactCard />
              <LoadingContactCard />
            </View>}
            {filteredContacts.map((contact, idx) => (
                <TouchableOpacity key={contact.user.id} onPress={() => onCardPress(contact, idx)}>
                  <ContactCard contact={contact} highlight={selectedContacts.includes(contact.user.id)} />
                </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.buttonContainer}>
            {!sendScreen && <TouchableOpacity onPress={() => {navigation.navigate('CameraScreen');}} style={styles.addButton}>
              <IonIcon name="camera-outline" color="rgba(250,250,250,0.8)" size={30} />
            </TouchableOpacity>}
            {sendScreen && selectedContacts.length > 0 && <TouchableOpacity onPress={() => sendShot()} style={styles.addButton}>
              <IonIcon name="send-sharp" color="rgba(250,250,250,0.8)" size={30} />
            </TouchableOpacity>}
            <Animated.View style={[{width: 6, height: 6, borderRadius: 2, backgroundColor: '#D4AF37', opacity: opacity}, animStyle]}></Animated.View>
          </View>
        </View>
        <NavBar />
      </ImageBackground>
      </View>
      <MenuBar currentScreenId={2} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: '100%',
    backgroundColor: 'black', 
    minHeight: 0.94*screenHeight
  },
  userContainer: {
    marginTop: 55,
    height: 210,
  },
  contactContainer: {
    paddingVertical: 10
  },
  topBar: {
    borderBottomColor: "#D4AF37",
    borderBottomWidth: 1,
    position: 'absolute',
    width: 0.85*screenWidth,
    alignSelf: 'flex-end',
    height: 55,
    lineHeight: "7%",
    zIndex: 0,
    elevation: 0,
    justifyContent: 'center'
  },
  header: {
    fontFamily: 'Montserrat-Italic',
    fontSize: 20,
    color: "white"
  },
  searchButton: {
    position: 'absolute',
    right: "3%",
    top: "25%",
  },
  closeButton: {
    position: 'absolute',
    right: "3%",
    top: "30%",
  },
  buttonContainer: {
    position: 'absolute',
    right: "3%",
    bottom: "15%",
    width: "30%",
  },
  addButton: {
    width: 128,
    height: 48,
    backgroundColor: "rgba(10,10,10,10.8)",
    borderColor: "rgba(255,255,255,0.9)",
    borderWidth: 2,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInputStyle: {
    fontFamily: 'Montserrat-Regular',
    paddingVertical: 5,
    fontSize: 14,
    color: 'white',
    backgroundColor: 'rgba(250,250,250,0.1)',
    borderRadius: 20
  }
});

export default ContactScreen;
