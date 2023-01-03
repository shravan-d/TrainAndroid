import {React, useState} from 'react';
import {StyleSheet, TouchableHighlight, View, Text, Dimensions, Image, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

const RoutineCard = ({ routine, self }) => {
  var defaultIcon = require ('../../assets/media/logo1.png');
  let image = routine.image?{uri: routine.image}:defaultIcon;
  let experienceMap = {'0': 'Beginner', '1': 'Intermediate', '2': 'Expert'};
  let experienceColorMap = {'0': '#ABE6CE', '1': '#CECBD6', '2': '#F388B1'};

  return (
    <View style={[styles.container, self?{height: 0.11*screenHeight}:{height: 0.14*screenHeight}]}>
        <View style={styles.card}>
          <View style={styles.cardContent}>
            <View style={styles.cardImage}>
                <Image style={{width:"90%", height: "100%", borderRadius: 5,}} source={image}/>
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardHeader}>{routine.name}</Text>
              {!self && 
              <View style={styles.cardSubtextContainer}>
                <Text style={[styles.cardSubtext, {color: experienceColorMap[routine.experience]}]}>{experienceMap[routine.experience]}</Text>
                {/* <Text style={styles.cardSubtext}>{routine.duration} weeks</Text> */}
                <View style={styles.starContainer}>
                  <Icon name="star" size={12} color={routine.rating>0?"#D4AF37":"white"} />
                  <Icon name="star" size={12} color={routine.rating>1?"#D4AF37":"white"} />
                  <Icon name="star" size={12} color={routine.rating>2?"#D4AF37":"white"} />
                  <Icon name="star" size={12} color={routine.rating>3?"#D4AF37":"white"} />
                  <Icon name="star" size={12} color={routine.rating>4?"#D4AF37":"white"} />
                </View>
              </View>
              }
              <TouchableHighlight onPress={() => {}} style={styles.moreIcon}>
              <View style={styles.cardMoretext}>
                <Text style={{fontFamily: 'Montserrat-Regular', fontSize: 14, marginRight: "2%"}}>{self?"Start Now":"Show More"}</Text>
                <Icon name="arrow-forward" size={18} color="#D4AF37" />
              </View>
              </TouchableHighlight>
            </View>
          </View>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 0.025*screenHeight,
    
  },
  card: {
    height: "100%",
    backgroundColor: "white",
    borderRadius: 5,
  },
  cardContent:{
    flex: 1,
    flexDirection: 'row',
  },
  cardImage: {
    height: "85%",
    width: "40%",
    alignSelf: 'center',
    marginLeft: "1%",
  },
  cardText: {
    marginTop: "3%"
  },
  cardHeader: {
    fontFamily: 'Montserrat-Italic',
    fontSize: 18,
    color: 'rgba(20,20,20,0.9)'
  },
  cardSubtextContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    marginTop: "4%",
  },
  cardSubtext: {
    fontFamily: 'Montserrat-Italic',
    fontSize: 14,
    color: 'rgba(20,20,20,0.8)',
  },
  cardMoretext: {
    marginTop: "6%",
    flexDirection: 'row',
    color: 'rgba(20,20,20,0.8)',
    justifyContent: 'center'
  },
  starContainer: {
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
  },
});

export default RoutineCard;
