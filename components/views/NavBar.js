import React, { useState } from 'react';
import {StyleSheet, ImageBackground, View, Button, TouchableOpacity, Text} from 'react-native';

const NavBar = () => {
  const [showSidebar, setShowSidebar] = useState(false);
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
            <View style={styles.sidebar}></View>
        }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    marginTop: "1%",
    width: "40%",
    height: "94%",
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
    backgroundColor: "black"
  },
  button: {
    margin: 5,
    width: 50,
    height: 40,
    zIndex: 2,
  }   
});

export default NavBar;

        {/* <Button
            onPress={() => {setShowSidebar(!showSidebar)}}
            title=""
            color="rgba(0,0,0,0)"
        /> 
        <View style = {styles.menuLine}></View>
        <View style = {styles.menuLine}></View>     */}