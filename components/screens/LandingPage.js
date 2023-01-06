import React from 'react';
import {StyleSheet, View, Text, ImageBackground, Dimensions, StatusBar} from 'react-native';
import MenuBar from '../views/MenuBar';
import NavBar from '../views/NavBar';
import { createDrawerNavigator } from '@react-navigation/drawer';
import ExerciseGuide from './ExerciseGuide';

var windowHeight = Dimensions.get('window').height;
var windowWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('screen').height;
var screenWidth = Dimensions.get('screen').width;
var statusHeight = StatusBar.currentHeight;

const LandingPage = () => {
  var bg = require ('../../assets/media/bg.png');
  const Drawer = createDrawerNavigator();
  return (
    <View style={styles.container}>
    <ImageBackground source={bg} style={styles.background}>
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
      position: "absolute",
      width: "100%",
      top: "32%",
      fontSize: 28,
    }
});

export default LandingPage;
