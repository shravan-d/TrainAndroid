import {React, useState} from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Dimensions, Image, ActivityIndicator } from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';

var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

const RoutineCard = ({routine, self}) => {
  const navigation = useNavigation();
  var defaultIcon = require('../../assets/media/logo1.png');
  let experienceMap = {0: 'Beginner', 1: 'Intermediate', 2: 'Expert'};
  let experienceColorMap = {0: '#ABE6CE', 1: '#CECBD6', 2: '#F388B1'};
  

  if (routine == undefined)
    return (<ActivityIndicator />)
  let image = routine.image_url ? {uri: routine.image_url} : defaultIcon;
  var rating = routine.rating_count==0?-1:routine.rating_score * 5 / routine.rating_count;

  return (
    <View style={[styles.container, self ? {height: 0.12 * screenHeight} : {height: 0.15 * screenHeight}]}>
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <View style={styles.cardImage}>
            <Image style={{width: '90%', height: '100%', borderRadius: 5}} source={image} />
          </View>
          <View style={styles.cardText}>
            <Text style={styles.cardHeader}>{routine.routine_name}</Text>
            <View style={styles.cardSubtextContainer}>
              <Text style={styles.cardSubtext}>Created by: {routine.created_by_username}</Text>
            </View>
            {!self && (
              <View style={[styles.cardSubtextContainer, {justifyContent: 'space-evenly'}]}>
                <Text style={[ styles.cardSubtext, {color: experienceColorMap[routine.level]} ]}>
                  {experienceMap[routine.level]}
                </Text>
                <View style={styles.starContainer}>
                  {rating == -1 && <Text style={styles.cardSubtext}>Unrated</Text>}
                  {rating > -1 && <>
                  <IonIcon name="star" size={12} color={rating > 0 ? '#D4AF37' : 'white'} />
                  <IonIcon name="star" size={12} color={rating > 1 ? '#D4AF37' : 'white'} />
                  <IonIcon name="star" size={12} color={rating > 2 ? '#D4AF37' : 'white'} />
                  <IonIcon name="star" size={12} color={rating > 3 ? '#D4AF37' : 'white'} />
                  <IonIcon name="star" size={12} color={rating > 4 ? '#D4AF37' : 'white'} /></>}
                </View>
              </View>
            )}
            <TouchableOpacity
              onPress={() => { navigation.navigate('RoutineDetailScreen', { routine: routine, self: self })}} style={styles.moreIonIcon}>
              <View style={styles.cardMoretext}>
                <Text style={{fontFamily: 'Montserrat-Regular',
                    fontSize: 14,
                    marginRight: '2%',
                    color: 'black'
                  }}> {self ? 'Start Now' : 'Show More'} </Text>
                <IonIcon name="arrow-forward" size={18} color="#D4AF37" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 0.025 * screenHeight,
  },
  card: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 5,
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
  },
  cardImage: {
    height: '85%',
    width: '30%',
    alignSelf: 'center',
    marginLeft: '1%',
  },
  cardText: {
    width: '60%',
    marginTop: '3%',
  },
  cardHeader: {
    fontFamily: 'Montserrat-Italic',
    fontSize: 18,
    color: 'rgba(0,0,0,1)',
    paddingHorizontal: 3,
  },
  cardSubtextContainer: {
    flexDirection: 'row',
    padding: 3
  },
  cardSubtext: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: 'rgba(20,20,20,1)',
  },
  cardMoretext: {
    padding: 2,
    flexDirection: 'row',
    color: 'rgba(20,20,20,0.8)',
    justifyContent: 'center',
  },
  starContainer: {
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default RoutineCard;
