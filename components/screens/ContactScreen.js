import React, { useState, useCallback, useEffect, useContext} from 'react';
import {StyleSheet, ImageBackground, View, Text, TextInput, ScrollView, TouchableOpacity, FlatList, Dimensions} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import ContactCard from '../views/ContactCard';
import MenuBar from '../views/MenuBar';
import NavBar from '../views/NavBar';
import { useNavigation } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';
import UserCard from '../views/UserCard';
import { supabase } from '../../supabaseClient';
import { AuthContext } from '../../App';

const screenHeight = Dimensions.get("window").height
const screenWidth = Dimensions.get("window").width

const ContactScreen = ({ route }) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused()
  const { path, type, sendCapture } = route.params;
  const user = useContext(AuthContext);
  var bg = require ('../../assets/media/bg.png');

  const [contactList, setContactList] = useState([]);
  const [filteredContactList, setFilteredContactList] = useState(contactList);
  const [userList, setUserList] = useState([]);
  const [search, setSearch] = useState('');
  const [openSearch, setOpenSearch] = useState(false)
  const [openUserSearch, setOpenUserSearch] = useState(false)
  const [selectedContacts, setSelectedContacts] = useState([]);

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
    if (sendCapture){
        const index = selectedContacts.indexOf(contact.user.id);
        if (index > -1) { 
          setSelectedContacts(oldArray => oldArray.filter((old_id)=> {return old_id != contact.user.id}));
        } else
          setSelectedContacts(oldArray => [...oldArray, contact.user.id] )
    } else {
      // var tempContacts = [...contactList.slice(0, idx), {...contactList[idx], newMsg: false}, ...contactList.slice(idx+1)];
      // setContactList(tempContacts);
      // setFilteredContactList(tempContacts);
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
        var tempContact = {user: res_.data[0], chatroomId: chatroom.chatroom_id, streak: 0,
          lastMessageTime: '2023-1-28 12:43', newMsg: res__.data[0]?.sent_unread_msg, newShot: false, lastSeen: '6'};
        tempContacts.push(tempContact)
      }
      setContactList(tempContacts);
      setFilteredContactList(tempContacts);
    }
  }
  
  useEffect(() => { 
    setSelectedContacts([]);
  }, [isFocused]);

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
        <TouchableOpacity onPress={() => {navigation.navigate('CameraScreen');}} style={styles.addButton}>
            <>
              {!sendCapture && <IonIcon name="camera-outline" color="rgba(250,250,250,0.8)" size={30} />}
              {sendCapture && <IonIcon name="send-sharp" color="rgba(250,250,250,0.8)" size={30} />}
            </>
          </TouchableOpacity>
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