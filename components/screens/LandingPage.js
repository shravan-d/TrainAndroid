import React, { useContext, useEffect, useState } from 'react';
import {StyleSheet, View, Text, ImageBackground, Dimensions, StatusBar} from 'react-native';
import MenuBar from '../views/MenuBar';
import NavBar from '../views/NavBar';
import { supabase } from '../../supabaseClient';
import { AuthContext } from '../../App';
import {useNavigation} from '@react-navigation/native';

var windowHeight = Dimensions.get('window').height;
var windowWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('screen').height;
var screenWidth = Dimensions.get('screen').width;
var statusHeight = StatusBar.currentHeight;

const LandingPage = () => {
  var bg = require ('../../assets/media/bg.png');
  const user = useContext(AuthContext);
  const navigation = useNavigation();
  useEffect(()=>{
  }, [])

  return (
    <View style={styles.container}>
    <ImageBackground source={bg} style={styles.background}>
        {user && <Text style={styles.header}>Hello {user.user_metadata.display_name}</Text>}
        <Text style={styles.header}>Welcome to Train.com</Text>
        <NavBar style = {styles.NavBar}/>
        <MenuBar />
    </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      width: "100%",
      height: '100%'
    },
    background: {
      width: "100%",
      height: "100%"
    },
    header: {
      fontFamily: 'Montserrat-Regular',
      color: "#D4AF37",
      fontWeight: "600",
      textAlign: "center",
      width: "100%",
      top: "32%",
      fontSize: 28,
    }
});

export default LandingPage;
