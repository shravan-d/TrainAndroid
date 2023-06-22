import React, { useContext } from 'react';
import {StyleSheet, View, Text, ImageBackground } from 'react-native';
import MenuBar from '../views/MenuBar';
import NavBar from '../views/NavBar';
import { AuthContext } from '../../App';

const LandingPage = () => {
  var bg = require ('../../assets/media/bg.png');
  const user = useContext(AuthContext);

  return (
    <View style={styles.container}>
    <ImageBackground source={bg} style={styles.background}>
        {user && <Text style={styles.header}>Hello {user.user_metadata.display_name||user.user_metadata.name}</Text>}
        <Text style={styles.header}>Welcome to Train</Text>
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
