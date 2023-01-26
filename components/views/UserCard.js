import React, { useEffect, useState } from 'react';
import {StyleSheet, Image, View, Text, Dimensions} from 'react-native';
import IonIonIcon from 'react-native-vector-icons/Ionicons';

const screenHeight = Dimensions.get("window").height
const screenWidth = Dimensions.get("window").width

const UserCard = ({ user }) => {
  var defaultIcon = require ('../../assets/media/logo.png');
  let image = user.avatar_url?{uri: user.avatar_url}:defaultIcon;
  return (
    <View style={styles.container}>
        <View style={styles.cardContainer}>
            <View style={styles.contactImage}>
                <Image style={styles.image} source={image} />
            </View>
            <View style={styles.nameContainer}>
                <Text style={styles.contactName}>{user.display_name}</Text>
                <Text style={[styles.contactName, {fontFamily: 'Montserrat-Italic'}]}>{user.username}</Text>
            </View>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 0.08*screenHeight,
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
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: "3%",
  },
  image: {
    width: "100%", 
    height: "100%",
    borderRadius: 50,
  },
  nameContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around'
  },
  contactName: {
    fontFamily: 'Montserrat-Regular',
    color: "white",
    fontSize: 18,
  }
});

export default UserCard;
