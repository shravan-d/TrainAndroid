import React, { useState, useCallback, useEffect} from 'react';
import {StyleSheet, ImageBackground, View, Text, TextInput, ScrollView, TouchableOpacity, FlatList, Dimensions} from 'react-native';
import IonIonIcon from 'react-native-vector-icons/Ionicons';
import ContactCard from '../views/ContactCard';
import MenuBar from '../views/MenuBar';
import NavBar from '../views/NavBar';
import { useNavigation } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';

const screenHeight = Dimensions.get("window").height
const screenWidth = Dimensions.get("window").width

const ContactScreen = ({ route }) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused()
  const { path, type, sendCapture } = route.params;
  var bg = require ('../../assets/media/bg.png');
  const [contactList, setContactList] = useState([
    {id: 1, name: 'Ana', lastMessageTime: '2022-12-28 12:43', image: 'https://w0.peakpx.com/wallpaper/128/436/HD-wallpaper-ana-de-armas-beauty-girls.jpg', newShot: false, newMsg: true, lastSeen: '6 hours', streak: 6},
    {id: 2, name: 'Margot', lastMessageTime: '2022-12-28 3:12', image: 'https://i.pinimg.com/564x/77/8f/82/778f8218b0fef7d5c9ee5b5caa61cb43--face-beauty-womens-beauty.jpg', newShot: true, newMsg: true, lastSeen: '1 hour', streak: 132},
    {id: 3, name: 'Sam', lastMessageTime: '2022-12-27 17:36', image: 'https://static.toiimg.com/thumb/msid-91347515,width-900,height-1200,resizemode-6.cms', newShot: true, newdMsg: false, lastSeen: '12 hours', streak: 0},
    {id: 5, name: 'Murugesa', lastMessageTime: '2022-12-16 10:07', image: null, newShot: false, newdMsg: false, lastSeen: '12 days', streak: 2},
    {id: 6, name: 'Rachel', lastMessageTime: '2022-11-27 17:36', image: 'https://c4.wallpaperflare.com/wallpaper/760/1024/879/rachel-cook-women-model-blue-eyes-face-hd-wallpaper-preview.jpg', newShot: true, newdMsg: false, lastSeen: '12 hours', streak: 1},
    {id: 77, name: 'Odegard', lastMessageTime: '2022-08-16 10:07', image: 'https://i.pinimg.com/originals/e7/36/a6/e736a6763a56c2a4d2eceee29249f48b.png', newShot: false, newdMsg: false, lastSeen: '12 days', streak: 0},
    {id: 11, name: 'Kaipulla', lastMessageTime: '2021-12-27 17:36', image: 'https://i1.sndcdn.com/artworks-000614414847-dxnict-t500x500.jpg', newShot: true, newdMsg: false, lastSeen: '12 hours', streak: 0},
    {id: 14, name: 'Dakota', lastMessageTime: '2022-12-26 10:07', image: 'https://w0.peakpx.com/wallpaper/335/551/HD-wallpaper-dakota-johnson-red-girl-actress-tattoo-face-lips-woman.jpg', newShot: false, newdMsg: false, lastSeen: '12 days', streak: 0},
  ])

  const [search, setSearch] = useState('');
  const [filteredContactList, setFilteredContactList] = useState(contactList);
  const [openSearch, setOpenSearch] = useState(false)

  contactList.sort(function(a, b) {return (new Date(a.lastMessageTime) > new Date(b.lastMessageTime))?-1:1;});

  const searchFilterFunction = (text) => {
    if (text) {
      const newData = contactList.filter(function (item) {
        const itemData = item.name? item.name.toUpperCase(): ''.toUpperCase();
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
  
  const [selectedContacts, setSelectedContacts] = useState([]);

  const onCardPress = 
    (id) => {
      if (sendCapture){
          const index = selectedContacts.indexOf(id);
          if (index > -1) { 
            setSelectedContacts(oldArray => oldArray.filter((old_id)=> {return old_id != id}));
            console.log(selectedContacts)
          } else
            setSelectedContacts(oldArray => [...oldArray, id] )
      } else {
        navigation.navigate('ChatScreen', {
          contactId: id,
          contactName: contactList.find(x => x.id == id).name,
          contactImage: contactList.find(x => x.id == id).image,
          contactNewShot: contactList.find(x => x.id == id).newShot,
        });
      }
    };
  
    useEffect(() => { 
      setSelectedContacts([]);
    }, [isFocused]);

  return (
    <View style={styles.container}>  
        <View style={styles.topBar}>
          {!openSearch &&
          <>
          <Text style={styles.header}>TrainShots</Text>
          <TouchableOpacity onPress={() => {setOpenSearch(!openSearch)}} style={styles.searchButton}>
            <IonIonIcon name="ios-search-outline" color="rgba(255,255,255,0.8)" size={24} />
          </TouchableOpacity>
          </>
          }
          {openSearch &&
          <TextInput 
            style={styles.textInputStyle} 
            maxLength={10}
            onChangeText={(text) => searchFilterFunction(text)}
            onSubmitEditing = {() => {setOpenSearch(!openSearch); setSearch('')}}
            value={search}
            cursorColor={"rgba(255,255,255,1)"}
            underlineColorAndroid={"rgba(0,0,0,0)"}
          />
          } 
        </View>
        <View style={styles.contactContainer}>
        <ImageBackground source={bg} style={styles.background}>
          <ScrollView>
            {filteredContactList.map((contact) => (
                <TouchableOpacity key={contact.id} onPress={() => onCardPress(contact.id)}>
                  <ContactCard contact={contact} highlight={selectedContacts.includes(contact.id)} />
                </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity onPress={() => {navigation.navigate('CameraScreen');}} style={styles.addButton}>
            <>
              {!sendCapture && <IonIonIcon name="ios-add-outline" color="rgba(255,255,255,0.8)" size={30} />}
              {sendCapture && <IonIonIcon name="send-sharp" color="rgba(255,255,255,0.8)" size={30} />}
            </>
          </TouchableOpacity>
          
        </ImageBackground>
        </View>
        <NavBar />
        <MenuBar currentScreenId={2} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: '100%',
    backgroundColor: 'black'
  },
  contactContainer: {
    height: '86%',
    marginTop: '15%'
  },
  topBar: {
    borderBottomColor: "#D4AF37",
    borderBottomWidth: 1,
    position: 'absolute',
    width: 0.85*screenWidth,
    alignSelf: 'flex-end',
    height: 53,
    lineHeight: "7%",
    zIndex: 1,
    elevation: 1,
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
    marginLeft: 50+0.04*screenWidth,
    fontFamily: 'Montserrat-Regular',
    paddingVertical: 5,
    fontSize: 14,
    textDecorationColor: 'rgba(0,0,0,0)',
    color: 'white',
    backgroundColor: 'rgba(250,250,250,0.1)',
    borderRadius: 20
  }
});

export default ContactScreen;

// Add friends