import {React, useEffect, useState} from 'react';
import {StyleSheet, ImageBackground, View, Text, Dimensions, TouchableHighlight, TextInput} from 'react-native';
import Dropdown from '../views/Dropdown';
import MenuBar from '../views/MenuBar';
import NavBar from '../views/NavBar';
import { ScrollView } from 'react-native-gesture-handler';
import IonIcon from 'react-native-vector-icons/Ionicons';
import RoutineCard from '../views/RoutineCard';
import Icon from 'react-native-vector-icons/Ionicons';

var screenHeight = Dimensions.get('window').height;
var screenWidth = Dimensions.get('window').width;

const RoutineScreen = () => {
  var bg = require ('../../assets/media/bg.png');
  overlays = [require('../../assets/media/ig3.jpg')]
  const [experience, setExperience] = useState(null);
  const [rating, setRating] = useState(4);

  let dropdownItems = [
    {label: 'Beginner', value: '0'},
    {label: 'Intermediate', value: '1'},
    {label: 'Expert', value: '2'}
  ];
  const [routineList, setRoutineList] = useState([
    {id: 0, name: 'Workout Program 1', image: '', duration: '8', rating: '5', experience: '0'},
    {id: 1, name: 'Workout Program 2', image: '', duration: '4', rating: '3', experience: '2'},
    {id: 2, name: 'Workout Program 3', image: '', duration: '6', rating: '4', experience: '1'},
  ]);
  const [myRoutineList, setMyRoutineList] = useState([
    {id: 0, name: 'My Routine 1', image: '', duration: '2'},
  ]);

  useEffect(() => {
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.exerciseContainer}> 
        <View style={styles.myRoutineContainer}>
        <ImageBackground source={overlays[0]} imageStyle={{opacity:0.1}} style={styles.overlay}>
            <Text style={styles.header}>My Routines</Text>
            {myRoutineList.map((routine) => (
                <RoutineCard key={routine.id} routine={routine} self={true} />
            ))}
            <View style={styles.createCard}>
                <Text style={styles.createCardText}>Create New Routine</Text>
                <TouchableHighlight><IonIcon name="ios-add-circle-outline" color="rgba(10,10,10,0.7)" size={40} /></TouchableHighlight>
            </View>
        </ImageBackground>
        </View>
        <View style={styles.routinesContainer}>
        <ImageBackground source={bg} style={styles.background}>
            <Text style={styles.header}>Community Routines</Text>
            <Dropdown value={experience} setValue={setExperience} header={"How experienced are you with working out?"} dropdownItems={dropdownItems}/>      
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>Minimum Rating</Text>
              <View style={styles.starContainer}>
                <TouchableHighlight onPress={()=>{setRating(1)}} style={styles.starTouch}><Icon name="star" size={18} color={rating>0?"#D4AF37":"white"} /></TouchableHighlight>
                <TouchableHighlight onPress={()=>{setRating(2)}} style={styles.starTouch}><Icon name="star" size={18} color={rating>1?"#D4AF37":"white"} /></TouchableHighlight>
                <TouchableHighlight onPress={()=>{setRating(3)}} style={styles.starTouch}><Icon name="star" size={18} color={rating>2?"#D4AF37":"white"} /></TouchableHighlight>
                <TouchableHighlight onPress={()=>{setRating(4)}} style={styles.starTouch}><Icon name="star" size={18} color={rating>3?"#D4AF37":"white"} /></TouchableHighlight>
                <TouchableHighlight onPress={()=>{setRating(5)}} style={styles.starTouch}><Icon name="star" size={18} color={rating>4?"#D4AF37":"white"} /></TouchableHighlight>
              </View>
            </View>
            {routineList.map((routine) => (
                <RoutineCard key={routine.id} routine={routine} self={false} />
            ))}
        </ImageBackground>
        </View>
      </ScrollView>
      <NavBar />
      <MenuBar currentScreenId={1}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: screenHeight,
    backgroundColor: "black"
  },
  exerciseContainer: {
    width: "100%",
    maxHeight: 0.94*screenHeight,
  },
  routinesContainer: {
    marginTop: 0.04*screenHeight,
    minHeight: 0.4*screenHeight
  },
  myRoutineContainer: {
    marginTop: 0.08*screenHeight,
  },
  header: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 24,
    color: "white",
    textAlign: 'center',
    marginBottom: "5%"
  },
  createCard: {
    width: "100%",
    marginBottom: 0.025*screenHeight,
    height: 0.11*screenHeight,
    backgroundColor: "white",
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  createCardText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 18,
    color: 'black'
  },
  ratingContainer: {
    flexDirection: 'row',
    margin: "8%",
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  ratingText: {
    color: 'white',
    fontFamily: 'Montserrat-Regular',
  },
  starContainer: {
    width: 0.3*screenWidth,
    height: 0.04*screenHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  starTouch: {
    marginRight: '2%'
  }

});

export default RoutineScreen;

// routine card, my routines, dropdown and other routines, community routines, 
// routine day wise split page, exercise detail with (sets, reps,next,prev), search?, add to my routines