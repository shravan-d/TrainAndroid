import React, { useState } from 'react';
import {StyleSheet, ImageBackground, View, Button, TouchableOpacity, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const NavBar = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
        <View style = {styles.navButton}>
            <TouchableOpacity onPress={() => {setShowSidebar(!showSidebar)}} style={styles.button}>
                <>
                <View style = {[styles.menuLine, showSidebar ? styles.menuLineActive : {}]}></View>
                <View style = {[styles.menuLine, styles.menuLine2, showSidebar ? styles.menuLineActive2 : {}]}></View>
                </>
            </TouchableOpacity>
        </View>
        { showSidebar && 
            <View style={styles.sidebar}>
              <TouchableOpacity onPress={() => {navigation.navigate('DebugScreen')}} 
              style={[styles.sidebarButton, {marginTop: 50}]}>
                <Text style={{fontFamily: 'Montserrat-Regular', color: 'white'}}>Debug</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {navigation.navigate('AccountScreen')}} 
              style={styles.sidebarButton}>
                <Text style={{fontFamily: 'Montserrat-Regular', color: 'white'}}>Account</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {navigation.navigate('LoginScreen')}} 
              style={[styles.sidebarButton, {marginBottom: 20, marginTop: 'auto'}]}>
                <Text style={{fontFamily: 'Montserrat-Regular', color: 'white'}}>Login / Sign Up</Text>
              </TouchableOpacity>
            </View>
        }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    marginTop: "1%",
    width: "40%",
    height: "93%",
    backgroundColor: "rgba(0,0,0,0)",
  },
  navButton: {
    zIndex: 3,
    elevation: 3,
  },
  menuLine: {
    position: "absolute",
    top: 15,
    left: 12,
    width: "45%",
    height: 2,
    backgroundColor: "white",
  },
  menuLine2: {
    top: 22
  },
  menuLineActive: {
    backgroundColor: "#D4AF37",
    transform: [{rotate: "45deg"}],
    top: 20
  },
  menuLineActive2:{
    backgroundColor: "#D4AF37",
    transform: [{rotate: "-45deg"}],
    top: 20
  },
  sidebar: {
    zIndex: 2,
    elevation: 2,
    position: "absolute",
    height : "100%",
    width: "100%",
    backgroundColor: "rgba(10,10,10,1)"
  },
  button: {
    margin: 5,
    width: 50,
    height: 40,
    zIndex: 2,
  },
  sidebarButton: {
    width: '100%',
    paddingLeft: 10,
    paddingVertical: 8,
    borderBottomColor: 'rgba(250,250,250,0.05)',
    borderBottomWidth: 1
  }
});

export default NavBar;