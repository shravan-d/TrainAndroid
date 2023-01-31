import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useState, useCallback, useContext } from 'react';
import {StyleSheet, ScrollView, ImageBackground, KeyboardAvoidingView, View, TextInput, Text, Dimensions, TouchableHighlight} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { GiftedChat, Bubble, InputToolbar, Time, Send, Composer} from 'react-native-gifted-chat'
import { AuthContext } from '../../App';
import { supabase } from '../../supabaseClient';

const screenHeight = Dimensions.get("window").height
const screenWidth = Dimensions.get("window").width

const ChatScreen = ({ route }) => {
  var bg = require ('../../assets/media/bg.png');
  const user = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const { secondUser, chatroomId } = route.params;

  var secondUser_ = {
    _id: secondUser.id,
    name: secondUser.display_name,
    avatar: 'https://mhtzqkkrssrxagqjbpdd.supabase.co/storage/v1/object/public/avatars/' +  secondUser.avatar_url
  }
  var user_ = {
    _id: user.id,
    name: user.display_name,
    avatar: 'https://mhtzqkkrssrxagqjbpdd.supabase.co/storage/v1/object/public/avatars/' +  user.avatar_url
  }

  const getMessages = async () => {
    const { data, error } = await supabase.from('messages').select().eq('chatroom_id', chatroomId);
    if(error) console.error(error.message)
    if(data){
      var messages = [];
      for(const message of data){
        var sender = message.sender_id==user.id?user_:secondUser_;
        var tempMessage = {_id: message.id, text: message.content, createdAt: message.sent_at, user: sender};
        messages.push(tempMessage);
      }
      messages.sort(function(a, b) {return (new Date(a.createdAt) > new Date(b.createdAt))?-1:1});
      setMessages(messages)
    }
  }

  const updateReadMsg = async () => {
    const { data, error } = await supabase.from('participants').update({ sent_unread_msg: false })
      .eq('user_id', secondUser.id).eq('chatroom_id', chatroomId);
    if(error) console.error(error.message)
  }

  const updateReceivedMsg = (message) => {
    if(message.sender_id==secondUser.id){
      var tempMessage = {_id: message.id, text: message.content, createdAt: message.sent_at, user: secondUser_};
      setMessages(previousMessages => GiftedChat.append(previousMessages, tempMessage))
    }
  }

  useEffect(() => {
    if (user?.id === null) return
    const channel = supabase
      .channel('table-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chatroom_id=eq.${chatroomId}`
        },
        (payload) => updateReceivedMsg(payload.new)
      )
      .subscribe()
  }, [])


  useEffect(() => {
    getMessages();
    updateReadMsg();
  }, [])

  const onSend = useCallback(async (message = []) => {
    var newMessage = {sender_id: message[0].user._id, chatroom_id: chatroomId, content: message[0].text, sent_at: message[0].createdAt}
    const { data, error } = await supabase.from('messages').insert(newMessage);
    if(error) console.error(error.message)
    else setMessages(previousMessages => GiftedChat.append(previousMessages, message))
  }, [])

  const renderInputToolbar = (props) => {
    return <InputToolbar {...props} containerStyle={{borderRadius: 25, minHeight: '6%'}} textInputStyle={{marginLeft: "4%", color: "black", fontFamily:'Montserrat-Regular'}} />
  }
  const renderSend = (props) => {
    return <Send {...props} disabled={!props.text} textStyle={{alignSelf: 'center', color:"#D4AF37", fontFamily: 'Montserrat-Bold', marginEnd: "5%"}}/>
  }

  const renderTime = (props) => {
    return( <Time
        {...props}
        containerStyle={{ 
            left: {position: 'absolute', top: -25, right: -57, alignSelf: 'flex-end', flex: 1 },
            right: { position: 'absolute', top: -25, left: -57, alignSelf: 'flex-start', flex: 1 }, }}
        timeTextStyle={{
          left: { color: 'rgba(255,255,255,0.7)',  fontSize: 10, fontFamily: 'Rubik'},
          right: {color: 'rgba(255,255,255,0.7)', fontSize: 10, fontFamily: 'Rubik'},
        }}
      />)
  }
  
  function renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{ 
            right: { backgroundColor: 'white' },
            left: { backgroundColor: 'white' } }}
        textStyle={{
          right: { color: 'black', fontFamily: 'Montserrat-Regular', fontSize: 12 },
          left: { color: 'black', fontFamily: 'Montserrat-Regular', fontSize: 12 }
        }}
        containerToPreviousStyle={{
            left: { borderColor: 'mediumorchid', borderWidth: 1 },
            right: {borderColor: 'navy', borderWidth: 1 },
        }}
      />
    );
  }

  return (
    <View style={styles.container}>
        <View style={styles.nameBar}>
            <Text style={styles.name}>{secondUser.display_name}</Text>
            {/* {contactNewShot && <View style={styles.viewShot}><Text style={styles.viewShotText}>View Shot</Text></View>} */}
        </View>
        <ImageBackground source={bg} style={styles.background}>
        <View style={styles.contentContainer}>
        <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{_id: user.id,}}
            renderInputToolbar = {renderInputToolbar}
            renderBubble={renderBubble}
            renderTime={renderTime}
            renderSend={renderSend}
            // showUserAvatar={true}
            multiline
            alwaysShowSend
            scrollToBottom
        />
        {/* { Platform.OS === 'android' && <KeyboardAvoidingView behavior="padding" /> } */}
        </View>
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
  contentContainer: {
    height: '96%'
  },
  nameBar: {
    width: screenWidth,
    height: 55,
    backgroundColor: "rgba(30,30,30,0.8)",
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center'
  },
  name: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 20,
    color: "white",
    marginLeft: "5%"
  },
  viewShot: {
    backgroundColor: "#D4AF37",
    width: '25%',
    height: '70%',
    borderRadius: 20,
    borderColor: "mediumorchid",
    borderWidth: 1,
    marginRight: "5%",
    justifyContent: 'center'
  },
  viewShotText: {
    fontFamily: 'Montserrat-Italic',
    color: 'white',
    alignSelf: 'center'
  }
});

export default ChatScreen;


//input box size when long message, input box no show when keyboard active (check num of lines for text input)