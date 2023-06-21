import {React, useEffect, useState} from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity } from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';

const RoutineDayCard = ({ day }) => {
  const navigation = useNavigation();
  const [cardPress, setCardPress] = useState(false);
  
  return (
    <View style={styles.dayContainer}>
      {!cardPress && (
        <View style={styles.cardContent}>
          <View style={styles.cardText}>
            <Text style={styles.cardHeader}>{day.day_name}</Text>
            <TouchableOpacity onPress={() => {setCardPress(!cardPress)}} style={styles.moreIonIcon}>
              <View style={styles.cardMoretext}>
                <Text style={{fontFamily: 'Montserrat-Regular',fontSize: 14, marginRight: '2%', color: 'black' }}>Expand</Text>
                <IonIcon name="arrow-down" size={18} color="#D4AF37" />
              </View>
            </TouchableOpacity>
          </View>  
        </View>
      )}
      {cardPress && (
          <View style={styles.cardContent}>
              <View style={styles.cardText}>
              <Text style={styles.cardHeader}>{day.day_name}</Text>
              <TouchableOpacity onPress={() => {setCardPress(!cardPress)}} style={styles.moreIonIcon}>
                  <View style={styles.cardMoretext}>
                  <Text style={{fontFamily: 'Montserrat-Regular',fontSize: 14, marginRight: '2%', color: 'black'}}>
                      Shrink
                  </Text>
                  <IonIcon name="arrow-up" size={18} color="#D4AF37" />
                  </View>
              </TouchableOpacity>
              </View>
              <View style={styles.exerciseContainer}>
              {day.exerciseList.map((exercise, index) => (
                <View key={index} style={{marginBottom: '2%', width: '40%', flexDirection: 'row'}}>
                  <Text style={{fontFamily: 'Montserrat-Bold', marginRight: '3%', color: 'black'}}>{index+1}</Text>
                  <Text style={{fontFamily: 'Montserrat-Regular', textTransform: 'capitalize', color: 'black'}}>{exercise.name}</Text>
                </View>
              ))}
              </View>
              {day.exerciseList.length > 0 && 
              <TouchableOpacity 
                onPress={() => {navigation.navigate('ExerciseDetailScreen',{
                  exerciseList: day.exerciseList})
                }} 
                style={styles.moreIonIcon}>
                  <View style={[styles.cardMoretext, {marginTop: 5}]}>
                    <Text style={{fontFamily: 'Montserrat-Regular',fontSize: 14, marginRight: '2%', color: 'black' }}>
                        Start day's workout
                    </Text>
                    <IonIcon name="arrow-forward" size={18} color="#D4AF37" />
                  </View>
              </TouchableOpacity>}
          </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dayContainer: {
    marginBottom: 10,
    width: '100%',
    minHeight: 60,
    backgroundColor: 'white',
  },
  cardContent: {
    margin: 15
  },
  exerciseContainer: {
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-evenly',
    alignItems:'center',
    marginTop: 5
  },
  cardText: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  cardHeader: {
    fontFamily: 'Montserrat-Italic',
    fontSize: 18,
    color: 'black'
  },
  cardMoretext: {
    // marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  expandArrow: {
    height: 40,
    width: 40,
    backgroundColor: 'rgba(0,0,0,0)',
    position: 'absolute',
    marginLeft: '90%',
    paddingLeft: 11,
  },
});

export default RoutineDayCard;
