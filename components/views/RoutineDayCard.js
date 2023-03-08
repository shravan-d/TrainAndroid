import {React, useEffect, useState} from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity } from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';

var screenHeight = Dimensions.get('window').height;
var screenWidth = Dimensions.get('window').width;

const RoutineDayCard = ({ day }) => {
  const navigation = useNavigation();
  const [cardPress, setCardPress] = useState(false);

  let exercises = [{name: 'Pull Ups', id: '0'}, {id: '3',name: 'Hyper extensions'}, {id: '1',name: 'Lat Pulldowns'}, {id: '2', name: 'Dumbell Rows'}, {id: '5', name: 'Single hand rows'}, {id: '6', name: 'Deadlifts'}, {id: '7', name: 'Barbell Rows'},]
  useEffect(() => {}, []);

  return (
    <View style={styles.dayContainer}>
      {!cardPress && (
        <View style={styles.cardContent}>
          <View style={styles.cardText}>
            <Text style={styles.cardHeader}>{day.day_name}</Text>
            {/* <TouchableOpacity onPress={() => {setMarkComplete(!markComplete)}} style={styles.moreIonIcon}>
                <View style={styles.cardMoretext}>
                <Text style={{fontFamily: 'Montserrat-Italic',fontSize: 11,marginRight: '2%', color: 'black' }}>
                    Mark as complete
                </Text>
                <IonIcon name="checkmark-circle" size={14} color={markComplete?"#D4AF37":'white'} style={!markComplete?{borderColor: '#D4AF37', borderRadius: 100, borderWidth: 0.2}:{}} />
                </View>
            </TouchableOpacity> */}
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
                      <Text style={{fontFamily: 'Montserrat-Regular', color: 'black'}}>{exercise.exercise_name}</Text>
                  </View>
              ))}
              </View>
              {day.exerciseList.length > 0 && 
              <TouchableOpacity 
                onPress={() => {navigation.navigate('ExerciseDetailScreen',{
                  exerciseList: day.exerciseList})
                }} 
                style={styles.moreIonIcon}>
                  <View style={styles.cardMoretext}>
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
    marginBottom: 0.01 * screenHeight,
    width: '100%',
    minHeight: 0.09 * screenHeight,
    backgroundColor: 'white',
  },
  cardContent: {
    margin: '4%'
  },
  exerciseContainer: {
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-evenly',
    alignItems:'center',
    marginTop: '2%'
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
    marginTop: '3%',
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
