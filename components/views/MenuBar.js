import React, { useState } from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MenuBar = ( { currentScreenId } ) => {
  const navigation = useNavigation();
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
        <TouchableOpacity onPress={() =>navigation.navigate('ContactScreen', { sendCapture: false})}>
            <View style={styles.menuButton}>
                <Text style={[styles.menuText, currentScreenId==2?{color: '#D4AF37'}:{color: 'white'}]}>Social</Text>
            </View>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        alignSelf: "center",
        width: "96%",
        height: "6%",
        borderTopWidth: 1,
        borderTopColor: "#D4AF37",
        position: "absolute",
        bottom: 0,
        flex: 1,    
        flexDirection: "row",
        justifyContent: "space-around",
    },
    menuButton: {
        height: "100%",
        padding: "10%",        
        borderRightColor: "rgba(255,255,255,0.1)",
        borderRightWidth: 1,
    },
    menuText: {
        textAlign: 'center',
        fontFamily: 'Montserrat-Regular',
    }
});

export default MenuBar;
