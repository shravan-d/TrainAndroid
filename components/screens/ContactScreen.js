import React, { useState, useMemo, useEffect, useContext} from 'react';
import {StyleSheet, ImageBackground, View, Text, TextInput, ScrollView, TouchableOpacity, FlatList, Dimensions} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import ContactCard from '../views/ContactCard';
import MenuBar from '../views/MenuBar';
import NavBar from '../views/NavBar';
import { useNavigation } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';
import UserCard from '../views/UserCard';
import { supabase } from '../../supabaseClient';
import { AuthContext, NewMessageContext, NewShotContext } from '../../App';
import ImgToBase64 from 'react-native-image-base64';
import { useSelector, useDispatch } from 'react-redux';

const screenHeight = Dimensions.get("window").height
const screenWidth = Dimensions.get("window").width

const ContactScreen = ({ route }) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused()
  const { path, type, sendCapture } = route.params;
  const mediaSource = useMemo(() => (`file://${path}`), [path]);
  const user = useContext(AuthContext);
  var bg = require ('../../assets/media/bg.png');
  
  const [contactList, setContactList] = useState([]);
  const [filteredContactList, setFilteredContactList] = useState(contactList);
  const [userList, setUserList] = useState([]);
  const [search, setSearch] = useState('');
  const [openSearch, setOpenSearch] = useState(false)
  const [openUserSearch, setOpenUserSearch] = useState(false)
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [sendScreen, setSendScreen] = useState(sendCapture);

  // const newMessage = useContext(NewMessageContext)
  // const newShot = useContext(NewShotContext)

  const newMessage = useSelector(state => state.newMessage)
  const hasNewMessage = useSelector(state => state.hasNewMessage)
  const newShot = useSelector(state => state.newShot)
  const hasNewShot = useSelector(state => state.hasNewShot)
  const dispatch = useDispatch();




  contactList.sort(function(a, b) {return (new Date(a.lastMessageTime) > new Date(b.lastMessageTime))?-1:1;});

  const searchFilterFunction = (text) => {
    if (text) {
      const newData = contactList.filter(function (item) {
        const itemData = item.user.display_name? item.user.display_name.toUpperCase(): ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredContactList(newData);
      setSearch(text);
    } else {
      setFilteredContactList(contactList);
      setSearch(text);
    }
  }

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
      var { data, error } = await supabase
      .from('chat_room')
      .insert({})
      .select('id')
      if(error) console.error(error)
      var chatroomId = data[0].id;
      var { data, error } = await supabase
      .from('participants')
      .insert([{chatroom_id: chatroomId, user_id: user.id}, {chatroom_id: chatroomId, user_id: secondUser.id}])
      if(error) console.error(error)
      navigation.navigate('ChatScreen', { secondUser: secondUser, chatroomId: chatroomId })
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
      var tempContacts = [...filteredContactList.slice(0, idx), {...contact, newMsg: false}, ...filteredContactList.slice(idx+1)];
      setContactList(tempContacts);
      navigation.navigate('ChatScreen', { secondUser: contact.user, chatroomId: contact.chatroomId });
      setOpenUserSearch(false);
    }
  };

  const getChatrooms = async () => {
    var tempContacts = []
    const { data, error } = await supabase.from('participants').select('chatroom_id').eq('user_id', user.id);
    if(error) console.error(error.message)
    if(data){
      for (const chatroom of data){
        const res = await supabase.from('participants').select('user_id').eq('chatroom_id', chatroom.chatroom_id).neq('user_id', user.id)
        if(res.error) console.error(res.error)
        const res_ = await supabase.from('profiles').select().eq('id', res.data[0].user_id);
        if(res_.error) console.error(res_.error)
        const res__ = await supabase.from('participants').select('sent_unread_msg').eq('user_id', res.data[0].user_id)
        .eq('chatroom_id', chatroom.chatroom_id);
        if(res__.error) console.error(res__.error)
        const streakData = await supabase.from('chat_room').select('streak').eq('id', chatroom.chatroom_id)
        if(streakData.error) console.error(streakData.error)

        // check if you can avoid these two calls. Biggest tables called often. Maybe could call in app open.
        const messageRes= await supabase.from('messages').select('sent_at').eq('sender_id', res.data[0].user_id)
        .eq('chatroom_id', chatroom.chatroom_id).order('sent_at', {ascending: false}).limit(1);
        if(messageRes.error) console.error(messageRes.error)
        const shotRes = await supabase.from('shots').select('sent_at').eq('receiver_id', user.id).eq('read_bool', false)
        .eq('sender_id', res.data[0].user_id).order('sent_at', {ascending: false}).limit(1);
        if(shotRes.error) console.error(shotRes.error)

        var timeToDisplay;
        if (messageRes.data.length > 0 && shotRes.data.length > 0)
          timeToDisplay = new Date(messageRes.data[0]?.sent_at) > new Date(shotRes.data[0]?.sent_at) ?
          new Date(messageRes.data[0]?.sent_at) : new Date(shotRes.data[0]?.sent_at);
        else if (messageRes.data.length) timeToDisplay =  new Date(messageRes.data[0]?.sent_at)
        else if (shotRes.data.length) timeToDisplay = new Date(shotRes.data[0]?.sent_at);
        var tempContact = {user: res_.data[0], chatroomId: chatroom.chatroom_id, streak: streakData.data[0]?.streak,
          lastMessageTime: timeToDisplay, newMsg: res__.data[0]?.sent_unread_msg, newShot: shotRes.data.length>0};
        tempContacts.push(tempContact)
      }
      setContactList(tempContacts);
      setFilteredContactList(tempContacts);
    }
  }

  const Buffer = require("buffer").Buffer;
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

  const sendShot = async () => {
    var media_url = type=='photo'?await uploadImage():await uploadVideo();
    var newShots = [];
    for (const secondUserId of selectedContacts){
      newShots.push({sender_id: user.id, receiver_id: secondUserId, content_url: media_url});
    }
    const { data, error } = await supabase.from('shots').insert(newShots);
    if(error) console.error(error.message)

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
        console.log(res_)
      }
    }

    setSendScreen(false)
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
      setFilteredContactList(contacts);
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
      setFilteredContactList(contacts);
    }
  }

  useEffect(() => {updateReceivedShot()}, [hasNewShot])
  
  useEffect(() => { 
    setSelectedContacts([]);
    setFilteredContactList(contactList);
  }, [isFocused]);

  useEffect(() => {
    setSendScreen(sendCapture)
  }, [sendCapture])

  useEffect(() => {
    getChatrooms();
  }, [])

  return (
    <View style={styles.container}>  
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
            onChangeText={(text) => searchFilterFunction(text)}
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
        <View style={[styles.contactContainer, openUserSearch?{height: '58%'}:{height: '86%', marginTop:'15%'}]}>
          <ScrollView>
            {filteredContactList.map((contact, idx) => (
                <TouchableOpacity key={contact.user.id} onPress={() => onCardPress(contact, idx)}>
                  <ContactCard contact={contact} highlight={selectedContacts.includes(contact.user.id)} />
                </TouchableOpacity>
            ))}
          </ScrollView>
          {!sendScreen && <TouchableOpacity onPress={() => {navigation.navigate('CameraScreen');}} style={styles.addButton}>
            <IonIcon name="camera-outline" color="rgba(250,250,250,0.8)" size={30} />
          </TouchableOpacity>}
          {sendScreen && selectedContacts.length > 0 && <TouchableOpacity onPress={() => sendShot()} style={styles.addButton}>
            <IonIcon name="send-sharp" color="rgba(250,250,250,0.8)" size={30} />
          </TouchableOpacity>}
        </View>
        <NavBar />
        <MenuBar currentScreenId={2} />
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
  userContainer: {
    marginTop: '15%',
    height: 210,
  },
  contactContainer: {
    // height: '86%',
    // marginTop: '15%'
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
  },
  header: {
    fontFamily: 'Montserrat-Italic',
    fontSize: 20,
    color: "white",
    marginTop: "4%",
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
  addButton: {
    position: 'absolute',
    right: "3%",
    bottom: "15%",
    width: "30%",
    height: 50,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderColor: "rgba(255,255,255,0.5)",
    borderWidth: 2,
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  textInputStyle: {
    marginTop: '3%',
    fontFamily: 'Montserrat-Regular',
    paddingVertical: 5,
    fontSize: 14,
    color: 'white',
    backgroundColor: 'rgba(250,250,250,0.1)',
    borderRadius: 20
  }
});

export default ContactScreen;

// Add friends