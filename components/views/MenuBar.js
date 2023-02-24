import React, { useContext, useState, useEffect } from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Dimensions} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NewMessageContext } from '../../App';

var screenHeight = Dimensions.get('window').height;
var screenWidth = Dimensions.get('window').width;

const MenuBar = ( { currentScreenId } ) => {
  const navigation = useNavigation();
  const [messageBubble, setMessageBubble] = useState(false);
  const newMessage= useContext(NewMessageContext)

  const updateReceivedMsg = () => {
    if(!newMessage) return;
    if(!didRender) return;
    setMessageBubble(true);
  }
  const [didRender, setDidRender]=useState(false);

  useEffect(()=>{
    setDidRender(true);
  },[]);
  
  useEffect(() => {updateReceivedMsg()}, [newMessage])

  return (
    <View style={styles.container}>
        <TouchableOpacity onPress={() =>navigation.navigate('ExerciseGuide')}>
            <View style={styles.menuButton}>
                <Text style={[styles.menuText, currentScreenId==0?{color: '#D4AF37'}:{color: 'white'}]}>Guide</Text>
            </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() =>navigation.navigate('RoutineScreen')}>
            <View style={styles.menuButton}>
                <Text style={[styles.menuText, currentScreenId==1?{color: '#D4AF37'}:{color: 'white'}]}>Routines</Text>
            </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {setMessageBubble(false); navigation.navigate('ContactScreen', { sendCapture: false})}}>
            <View style={styles.menuButton}>
                <Text style={[styles.menuText, currentScreenId==2?{color: '#D4AF37'}:{color: 'white'}]}>Social</Text>
                {messageBubble && <View style={[styles.bubble, {backgroundColor: 'green'}]}></View>}
                {/* <View style={[styles.bubble, {backgroundColor: '#D4AF37'}]}></View> */}
            </View>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        alignSelf: "center",
        width: "96%",
        height: 0.06*screenHeight,
        borderTopWidth: 1,
        borderTopColor: "#D4AF37",
        position: "absolute",
        bottom: 0,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: 'center'
    },
    menuButton: {
        height: "100%",
        paddingHorizontal: "10%",        
        borderRightColor: "rgba(255,255,255,0.1)",
        borderRightWidth: 1,
        justifyContent: 'center'
    },
    menuText: {
        textAlign: 'center',
        fontFamily: 'Montserrat-Regular',
    },
    bubble: {
        width: 10,
        height: 10,
        borderRadius: 20,
        position: 'absolute',
        right: 15,
        top: '15%'

    }
});

export default MenuBar;

// Screen going down in long phones