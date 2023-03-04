import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState, useCallback, useContext } from 'react';
import {StyleSheet, ImageBackground, KeyboardAvoidingView, View, TouchableOpacity, Text, Dimensions} from 'react-native';
import { GiftedChat, Bubble, InputToolbar, Time, Send, Composer} from 'react-native-gifted-chat'
import { AuthContext, NewMessageContext, NewShotContext } from '../../App';
import { supabase } from '../../supabaseClient';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';

const screenHeight = Dimensions.get("window").height
const screenWidth = Dimensions.get("window").width

const ChatScreen = () => {
  const navigation = useNavigation();
  var bg = require ('../../assets/media/bg.png');
  const user = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [shots, setShots] = useState([]);
  const route = useRoute();
  const { secondUser, chatroomId } = route.params;
  // const newMessage = useContext(NewMessageContext)
  // const newShot = useContext(NewShotContext)

  const newMessage = useSelector(state => state.newMessage)
  const hasNewMessage = useSelector(state => state.hasNewMessage)
  const newShot = useSelector(state => state.newShot)
  const hasNewShot = useSelector(state => state.hasNewShot)
  const dispatch = useDispatch();

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
    if(error) console.error(error.message)
  }

  const getShots = async () => {
    const { data, error } = await supabase.from('shots').select('content_url')
    .eq('receiver_id', user.id).eq('read_bool', false).eq('sender_id', secondUser.id);
    setShots(data);
    if(error) console.error(error.message)
  }

  const openNewShots = async () => {
    var newShots = [];
    for(const shot of shots){
      const res = await supabase.storage.from('shots').createSignedUrl(shot.content_url, 60)
      if(res.error) console.error(res.error.message)
      var publicUrl = res.data.signedUrl
      newShots.push({url: publicUrl});
    }
    navigation.navigate('MediaScreen', {
      path: newShots[0].url,
      shots: newShots,
      send: false
    });
    dispatch({ type: 'viewedShot' })
    const { data, error } = await supabase.from('shots').update({ read_bool: true })
    .eq('receiver_id', user.id).eq('read_bool', false).eq('sender_id', secondUser.id);
    if(error) console.error(error.message)
    setShots([]);
  }

  const updateReadMsg = async () => {
    const { data, error } = await supabase.from('participants').update({ sent_unread_msg: false })
      .eq('user_id', secondUser.id).eq('chatroom_id', chatroomId);
    if(error) console.error(error.message)
  }

  const updateReceivedMsg = () => {
    if (!hasNewMessage) return;
    dispatch({ type: 'viewedMessage' })
    if(newMessage.sender_id==secondUser.id){
      var tempMessage = {_id: newMessage.id, text: newMessage.content, createdAt: newMessage.sent_at, user: secondUser_};
      setMessages(previousMessages => GiftedChat.append(previousMessages, tempMessage))
    }
  }

  useEffect(() => {updateReceivedMsg()}, [newMessage])

  const updateReceivedShot = () => {
    if (!hasNewShot) return;
    if (newShot.sender_id==secondUser.id){
      setShots((shots) => [...shots, {content_url: newShot.content_url}])
    }
  }

  useEffect(() => {updateReceivedShot()}, [newShot])

  useEffect(() => {
    getMessages();
    getShots();
    updateReadMsg();
  }, [])

  const onSend = useCallback(async (message = []) => {
    var receiver_id = message[0].user._id==user.id?secondUser.id:user.id;
    var newMessage = {sender_id: message[0].user._id, receiver_id: receiver_id,chatroom_id: chatroomId, content: message[0].text, sent_at: message[0].createdAt}
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
            {shots.length > 0 && 
            <TouchableOpacity style={styles.viewShot} onPress={() => openNewShots()}>
              <Text style={styles.viewShotText}>View Shot</Text>
            </TouchableOpacity>}
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
    alignItems: 'center',
    paddingHorizontal: '5%',
    elevation: 0,
    zIndex: 0
  },
  name: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 20,
    color: "white",
  },
  viewShot: {
    backgroundColor: "#D4AF37",
    width: 110,
    height: '70%',
    borderRadius: 20,
    borderColor: "mediumorchid",
    borderWidth: 1,
    paddingHorizontal: "5%",
    justifyContent: 'center',
  },
  viewShotText: {
    fontFamily: 'Montserrat-Italic',
    color: 'white',
    alignSelf: 'center'
  }
});

export default ChatScreen;

// usereducer, sub in contact, set reducer, check if rerender is caused in chat
//input box size when long message, input box no show when keyboard active (check num of lines for text input)