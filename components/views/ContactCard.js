import React, { useEffect, useState } from 'react';
import {StyleSheet, Image, View, Text, Dimensions} from 'react-native';
import IonIonIcon from 'react-native-vector-icons/Ionicons';

const screenHeight = Dimensions.get("window").height
const screenWidth = Dimensions.get("window").width

const ContactCard = ({ contact, highlight }) => {
  const [newShot, setNewShot] = useState(contact.newShot);
  const [newMsg, setNewMsg] = useState(contact.newMsg);
  const [timeDisplay, setTimeDisplay] = useState(contact.lastMessageTime);
  const getTime = () => {
    var currentDate = new Date()
    var date = new Date(contact.lastMessageTime)
    if(date.getFullYear()==currentDate.getFullYear()){
        if(date.getMonth()==currentDate.getMonth()){
            if(date.getDate()==currentDate.getDate()){
                setTimeDisplay(String(date.getHours())+":"+String(date.getMinutes()))
            } else if(date.getDate()==currentDate.getDate()-1){
                setTimeDisplay("Yesterday")
            } else {
                setTimeDisplay(String(currentDate.getDate()-date.getDate())+" days ago")
            }
        } else {
            let month = currentDate.getMonth()-date.getMonth();
            let msg = month==1?" month ago":" months ago"
            setTimeDisplay(String(month)+msg)
        } 
    } else {
        let year = currentDate.getFullYear()-date.getFullYear();
        let msg = year==1?" year ago":" years ago"
        setTimeDisplay(String(year)+msg)
    } 
  }
  useEffect(() => { 
    getTime();
  }, [contact]);
  
  var defaultIonIcon = require ('../../assets/media/logo.png');
  let image = contact.image?{uri: contact.image}:defaultIonIcon;
  let subText = newShot? "New training shot": (newMsg ? "New message" : "Last seen "+contact.lastSeen+" ago");
  return (
    <View style={styles.container}>
        <View style={styles.cardContainer}>
            <View style={styles.contactImage}>
                <Image style={[styles.image, highlight?{borderColor: 'rgba(212, 175, 55, 1)', borderWidth: 1}:{}]} source={image} />
            </View>
            <View>
                <Text style={styles.contactName}>{contact.name}</Text>
                <View style={{flexDirection: "row"}}><View style={[styles.newDot, newShot?{backgroundColor:"rgba(212, 175, 55, 1)"}:newMsg?{backgroundColor:"green"}:{width:0}]}></View><Text style={styles.contactMsg}>{subText}</Text></View>
            </View>
            <View style={styles.contactTime}>
                <Text style={styles.contactTime_}>{timeDisplay}</Text>
                {contact.streak > 0 && 
                <View style={{flexDirection: "row", justifyContent: 'center', marginTop: "6%"}}>
                  <Text style={{color: "white", fontFamily: 'Montserrat-Italic', marginRight:'8%'}}>{contact.streak}</Text>
                  <IonIonIcon name="ios-fitness-sharp" color="rgba(212, 175, 55, 1)" size={18} />
                </View>
                }
            </View>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 0.13*screenHeight,
    marginTop: "1%",
  },
  cardContainer: {
    flex: 1,
    flexDirection: "row",
    paddingLeft: "2%",
    alignItems: 'center',
    backgroundColor: "rgba(30,30,30,0.8)",
    borderRadius: 5
  },
  contactImage: {
    width: 0.18*screenWidth,
    height: 0.18*screenWidth,
    borderRadius: 0.18*screenWidth,
    marginRight: "3%",
  },
  image: {
    width: "100%", 
    height: "100%",
    borderRadius: 0.18*screenWidth,
  },
  contactTime: {
    marginLeft: 'auto',
    marginRight: "2%"
  },
  contactName: {
    fontFamily: 'Montserrat-Regular',
    color: "rgba(255,255,255,0.9)",
    fontSize: 18,
  },
  contactMsg: {
    fontFamily: 'Montserrat-Italic',
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
  },
  contactTime_: {
    fontFamily: 'Montserrat-Regular',
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
  },
  newDot: {
    width: 7,
    height: 7,
    borderRadius: 7,
    marginTop: 6,
    marginRight: "4%"
  }
});

export default ContactCard;
