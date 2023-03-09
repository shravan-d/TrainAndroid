import React, { useEffect, useState } from 'react';
import {StyleSheet, Image, View, Text, Dimensions} from 'react-native';
import IonIonIcon from 'react-native-vector-icons/Ionicons';

const screenHeight = Dimensions.get("window").height
const screenWidth = Dimensions.get("window").width

const ContactCard = ({ contact, highlight }) => {
  const [newShot, setNewShot] = useState(contact.newShot);
  const [newMsg, setNewMsg] = useState(contact.newMsg);
  const [timeDisplay, setTimeDisplay] = useState('');

  const getTime = () => {
    if(contact.lastMessageTime == null)
      return;
    var currentDate = new Date()
    var date = new Date(contact.lastMessageTime)
    var msg = '';
    
    if(date.getFullYear()==currentDate.getFullYear()){
      if(date.getMonth()==currentDate.getMonth()){
          if(date.getDate()==currentDate.getDate()){
              var mins = String(date.getMinutes())
              setTimeDisplay(String(date.getHours())+":"+mins)
          } else if(date.getDate()==currentDate.getDate()-1){
              setTimeDisplay("Yesterday")
          } else {
              setTimeDisplay(String(currentDate.getDate()-date.getDate())+" days ago")
          }
      } else {
          let month = currentDate.getMonth()-date.getMonth();
          msg = month==1?"Last month":String(month)+" months ago"
          setTimeDisplay(msg)
      } 
    } else {
        let year = currentDate.getFullYear()-date.getFullYear();
        msg = year==1?"Last year":year.toString()+" years ago"
        if (year.toString() === 'NaN') msg = '';
        setTimeDisplay(msg)
    } 
  }

  useEffect(() => { 
    setNewMsg(contact.newMsg);
    setNewShot(contact.newShot);
    getTime();
  }, [contact]);
  
  var defaultIcon = require ('../../assets/media/logo.png');
  let image = contact.user.avatar_url?{uri: 'https://mhtzqkkrssrxagqjbpdd.supabase.co/storage/v1/object/public/avatars/'+contact.user.avatar_url}:defaultIcon;
  let subText = newShot? "New training shot": (newMsg ? "New message" : contact.user.username);

  return (
    <View style={styles.container}>
        <View style={styles.cardContainer}>
            <View style={styles.contactImage}>
                <Image style={[styles.image, highlight?{borderColor: '#D4AF37', borderWidth: 1}:{}]} source={image} />
            </View>
            <View>
                <Text style={styles.contactName}>{contact.user.display_name}</Text>
                <View style={{flexDirection: "row"}}><View style={[styles.newDot, newShot?{backgroundColor:"#D4AF37"}:newMsg?{backgroundColor:"green"}:{width:0}]}></View><Text style={styles.contactMsg}>{subText}</Text></View>
            </View>
            <View style={styles.contactTime}>
                {timeDisplay != '' && <Text style={styles.contactTime_}>{timeDisplay}</Text>}
                {contact.streak > 0 && 
                <View style={{flexDirection: "row", justifyContent: 'center'}}>
                  <Text style={{color: "white", fontFamily: 'Montserrat-Italic', marginRight:'8%'}}>{contact.streak}</Text>
                  <IonIonIcon name="ios-fitness-sharp" color="#D4AF37" size={18} />
                </View>
                }
            </View>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    width: "99%",
    height: 90,
    marginTop: 5
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
    marginRight: "2%",
    justifyContent: 'center',
    alignItems: 'center'
  },
  contactName: {
    fontFamily: 'Montserrat-Regular',
    color: "white",
    fontSize: 18,
  },
  contactMsg: {
    fontFamily: 'Montserrat-Italic',
    color: "rgba(250,250,250,0.8)",
    fontSize: 14,
  },
  contactTime_: {
    fontFamily: 'Montserrat-Regular',
    color: "rgba(250,250,250,0.8)",
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
