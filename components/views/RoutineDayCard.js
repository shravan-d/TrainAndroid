import {React, useEffect, useState} from 'react';
import {
  StyleSheet,
  ImageBackground,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Dropdown from '../views/Dropdown';
import MenuBar from '../views/MenuBar';
import NavBar from '../views/NavBar';
import {ScrollView} from 'react-native-gesture-handler';
import RoutineCard from '../views/RoutineCard';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';

var screenHeight = Dimensions.get('window').height;
var screenWidth = Dimensions.get('window').width;

const RoutineDayCard = ({ day }) => {

  const navigation = useNavigation();
  const [cardPress, setCardPress] = useState(false);
  const [markComplete, setMarkComplete] = useState(day.complete);

  let exercises = [{name: 'Pull Ups', id: '0'}, {id: '3',name: 'Hyper extensions'}, {id: '1',name: 'Lat Pulldowns'}, {id: '2', name: 'Dumbell Rows'}, {id: '5', name: 'Single hand rows'}, {id: '6', name: 'Deadlifts'}, {id: '7', name: 'Barbell Rows'},]
  useEffect(() => {}, []);

  return (
    <View style={styles.dayContainer}>
        {!cardPress && (
            <View style={styles.cardContent}>
                <View style={styles.cardText}>
                <Text style={styles.cardHeader}>{day.name}</Text>
                <TouchableOpacity onPress={() => {setMarkComplete(!markComplete)}} style={styles.moreIonIcon}>
                    <View style={styles.cardMoretext}>
                    <Text style={{fontFamily: 'Montserrat-Italic',fontSize: 11,marginRight: '2%', color: 'black' }}>
                        Mark as complete
                    </Text>
                    <IonIcon name="checkmark-circle" size={14} color={markComplete?"#D4AF37":'white'} style={!markComplete?{borderColor: '#D4AF37', borderRadius: 100, borderWidth: 0.2}:{}} />
                    </View>
                </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => {setCardPress(!cardPress)}} style={styles.moreIonIcon}>
                <View style={styles.cardMoretext}>
                <Text style={{fontFamily: 'Montserrat-Regular',fontSize: 14, marginRight: '2%', color: 'black' }}>
                    Expand
                </Text>
                <IonIcon name="arrow-down" size={18} color="#D4AF37" />
                </View>
            </TouchableOpacity>
            </View>
        )}
        {cardPress && (
            <View style={styles.cardContent}>
                <View style={styles.cardText}>
                <Text style={styles.cardHeader}>{day.name}</Text>
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
                {exercises.map((exercise, index) => (
                    <View key={index} style={{marginBottom: '1%', width: '30%', flexDirection: 'row'}}>
                        <Text style={{fontFamily: 'Montserrat-Bold', marginRight: '3%', color: 'black'}}>{index+1}</Text>
                        <Text style={{fontFamily: 'Montserrat-Regular', color: 'black'}}>{exercise.name}</Text>
                    </View>
                ))}
                </View>
                <TouchableOpacity onPress={() => {navigation.navigate('ExerciseDetailScreen', 
                {exerciseIdList: day.exerciseIds , currIdx: 0})
                }} style={styles.moreIonIcon}>
                    <View style={styles.cardMoretext}>
                    <Text style={{fontFamily: 'Montserrat-Regular',fontSize: 14, marginRight: '2%', color: 'black' }}>
                        Start day's workout
                    </Text>
                    <IonIcon name="arrow-forward" size={18} color="#D4AF37" />
                    </View>
                </TouchableOpacity>
            </View>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  dayContainer: {
    marginBottom: 0.01 * screenHeight,
    width: '100%',
    minHeight: 0.1 * screenHeight,
    backgroundColor: 'white',
  },
  cardContent: {
    margin: '4%'
  },
  exerciseContainer: {
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-evenly',
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
