import React, { useEffect, useState, useCallback } from 'react';
import {StyleSheet, ScrollView, ImageBackground, KeyboardAvoidingView, View, TextInput, Text, Dimensions} from 'react-native';
import { GiftedChat, Bubble, InputToolbar, Time, Send, Composer} from 'react-native-gifted-chat'

const screenHeight = Dimensions.get("window").height
const screenWidth = Dimensions.get("window").width

const ChatScreen = ({ route }) => {
  var bg = require ('../../assets/media/bg.png');
  const [messages, setMessages] = useState([]);
  const {contactId, contactName, contactImage, contactNewShot } = route.params;
  let currentUser = {_id: 0, name: "Shravan", avatar: null}

  messages.sort(function(a, b) {return (new Date(a.createdAt) > new Date(b.createdAt))?-1:1});
  useEffect(() => {
    // fetch and set messages to current user from contactId
    let user = {
        _id: contactId,
        name: contactName,
        avatar: contactImage
    }
    setMessages([
      {
        _id: 1,
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum pellentesque mauris et lectus ullamcorper, ut imperdiet ex varius. Vestibulum nec nunc dictum, rutrum eros sagittis, varius magna',
        createdAt: new Date("2022-12-29T12:35:20"),
        user: user
      },
      {
        _id: 8,
        text: 'Sed dapibus iaculis turpis, et finibus urna',
        createdAt: new Date("2022-12-29T10:35:20"),
        user: currentUser
      },
      {
        _id: 2,
        text: 'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.',
        createdAt: new Date("2022-12-28T03:59:20"),
        user: user
      },
      {
        _id: 3,
        text: 'Maecenas varius nulla vel tellus porta vulputate',
        createdAt: new Date(),
        user: user
      },
      {
        _id: 4,
        text: ' Nulla facilisi',
        createdAt: new Date(),
        user: user
      },
      {
        _id: 5,
        text: 'Hello developer Hello developer Hello developer Hello developer Hello developer Hello developer Hello developer Hello developer',
        createdAt: new Date(),
        user: currentUser
      },
      {
        _id: 6,
        text: 'No alarms and no surprises, radiohead man what a what a',
        createdAt: new Date(),
        user: currentUser
      },
      {
        _id: 7,
        text: 'Lorem Ipsum dolor I dont know the rest can you help me with it',
        createdAt: new Date(),
        user: user
      },
    ])
  }, [])

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
  }, [])

  const renderInputToolbar = (props) => {
    return <InputToolbar {...props} containerStyle={{borderRadius: 25, minHeight: 0.06*screenHeight}} textInputStyle={{marginLeft: "4%", color: "rgba(10,10,10,1)", fontFamily:'Montserrat-Regular'}} />
  }
  const renderSend = (props) => {
    return <Send {...props} disabled={!props.text} textStyle={{alignSelf: 'center', color:"#D4AF37", fontFamily: 'Montserrat-Bold', marginEnd: "4%"}}/>
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
            right: { backgroundColor: 'rgba(250,250,250,1)' },
            left: { backgroundColor: 'rgba(255,255,255,1)' } }}
        textStyle={{
          right: { color: 'rgba(20,20,20,0.9)', fontFamily: 'Montserrat-Regular', fontSize: 12 },
          left: { color: 'rgba(30,30,30,0.9)', fontFamily: 'Montserrat-Regular', fontSize: 12 }
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
      <ImageBackground source={bg} style={styles.background}>
        <View style={{ flex: 1 }}>
        <View style={styles.nameBar}>
            <Text style={styles.name}>{contactName}</Text>
            {contactNewShot && <View style={styles.viewShot}><Text style={styles.viewShotText}>View Shot</Text></View>}
        </View>
        <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{_id: 0,}}
            renderInputToolbar = {renderInputToolbar}
            renderBubble={renderBubble}
            renderTime={renderTime}
            renderSend={renderSend}
            showUserAvatar={true}
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
    height: screenHeight,
  },
  background: {
    width: "100%",
    height: screenHeight
  },
  nameBar: {
    width: screenWidth,
    height: 0.07*screenHeight,
    backgroundColor: "rgba(30,30,30,0.8)",
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center'
  },
  name: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 20,
    color: "rgba(250,250,250,0.8)",
    marginLeft: "5%"
  },
  viewShot: {
    backgroundColor: "#D4AF37",
    width: 0.25*screenWidth,
    height: 0.05*screenHeight,
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


//input box size when long message, input box no show when keyboard active