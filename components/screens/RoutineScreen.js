import {React, useEffect, useState} from 'react';
import { 
  StyleSheet, ImageBackground, View, Text, Dimensions, TouchableOpacity, TextInput, Modal, Pressable
} from 'react-native';
import Dropdown from '../views/Dropdown';
import MenuBar from '../views/MenuBar';
import NavBar from '../views/NavBar';
import {ScrollView} from 'react-native-gesture-handler';
import IonIonIcon from 'react-native-vector-icons/Ionicons';
import RoutineCard from '../views/RoutineCard';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';

var screenHeight = Dimensions.get('window').height;
var screenWidth = Dimensions.get('window').width;

const RoutineScreen = () => {
  const navigation = useNavigation();
  var bg = require('../../assets/media/bg.png');
  overlays = [require('../../assets/media/ig3.jpg')];
  const [experience, setExperience] = useState(null);
  const [rating, setRating] = useState(4);
  const [newRoutineName, setNewRoutineName] = useState('');
  let dropdownItems = [
    {label: 'Beginner', value: '0'},
    {label: 'Intermediate', value: '1'},
    {label: 'Expert', value: '2'},
  ];
  const [routineList, setRoutineList] = useState([
    {
      id: 0,
      name: 'Workout Program 1',
      image: '',
      duration: '8',
      rating: '5',
      experience: '0',
    },
    {
      id: 1,
      name: 'Workout Program 2',
      image: '',
      duration: '4',
      rating: '3',
      experience: '2',
    },
    {
      id: 2,
      name: 'Workout Program 3',
      image: '',
      duration: '6',
      rating: '4',
      experience: '1',
    },
  ]);
  const [myRoutineList, setMyRoutineList] = useState([
    {id: 0, name: 'My Routine 1', image: '', duration: '2'},
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const createNewRoutine = () => {
    //create new routine with given name and retrive id
    let id = 0
    navigation.navigate('RoutineDetailScreen', {
      routineId: id,
      self: true
    });
  }
  useEffect(() => {}, []);

  return (
    <View style={styles.container}>
      <ImageBackground
            source={overlays[0]}
            imageStyle={{opacity: 0.12}} style={{height: '100%'}}>
      <ScrollView showsVerticalScrollIndicator={false} style={[styles.contentContainer, modalVisible?{opacity: 0.5}:{}]}>
        <View style={styles.myRoutineContainer}>
          
            <Text style={styles.header}>My Routines</Text>
            {myRoutineList.map(routine => (
              <RoutineCard key={routine.id} routine={routine} self={true} />
            ))}
            <View style={styles.createCard}>
              <Text style={styles.createCardText}>Create New Routine</Text>
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <IonIonIcon
                  name="ios-add-circle-outline"
                  color="rgba(30,30,30,0.8)"
                  size={40}
                />
              </TouchableOpacity>
            </View>
        </View>
        <View style={styles.routinesContainer}>
          <ImageBackground source={bg} style={styles.background}>
            <Text style={styles.header}>Community Routines</Text>
            <Dropdown
              value={experience}
              setValue={setExperience}
              header={'How experienced are you with working out?'}
              dropdownItems={dropdownItems}
            />
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>Minimum Rating</Text>
              <View style={styles.starContainer}>
                <TouchableOpacity
                  onPress={() => {
                    setRating(1);
                  }}
                  style={styles.starTouch}>
                  <IonIcon
                    name="star"
                    size={18}
                    color={rating > 0 ? '#D4AF37' : 'white'}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setRating(2);
                  }}
                  style={styles.starTouch}>
                  <IonIcon
                    name="star"
                    size={18}
                    color={rating > 1 ? '#D4AF37' : 'white'}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setRating(3);
                  }}
                  style={styles.starTouch}>
                  <IonIcon
                    name="star"
                    size={18}
                    color={rating > 2 ? '#D4AF37' : 'white'}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setRating(4);
                  }}
                  style={styles.starTouch}>
                  <IonIcon
                    name="star"
                    size={18}
                    color={rating > 3 ? '#D4AF37' : 'white'}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setRating(5);
                  }}
                  style={styles.starTouch}>
                  <IonIcon
                    name="star"
                    size={18}
                    color={rating > 4 ? '#D4AF37' : 'white'}
                  />
                </TouchableOpacity>
              </View>
            </View>
            {routineList.map(routine => (
              <RoutineCard key={routine.id} routine={routine} self={false} />
            ))}
          </ImageBackground>
        </View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={{fontFamily: 'Montserrat-Regular'}}>Enter the name of your routine</Text>
              <TextInput autoCapitalize='words' style={styles.textInputStyle}  maxLength={20} onChangeText={(text) => setNewRoutineName(text)} value={newRoutineName} cursorColor={"rgba(0,0,0,1)"}/>
              <View style={{flexDirection: 'row'}}>
              <Pressable style={[styles.button, {backgroundColor: 'rgba(30,30,30,0.8)'}]} onPress={() => setModalVisible(!modalVisible)}>
                <Text style={{fontFamily: 'Montserrat-Regular', color: 'white'}}>Cancel</Text>
              </Pressable>
              <Pressable style={[styles.button, {backgroundColor: '#D4AF37'}]} onPress={() => createNewRoutine()}>
                <Text style={{fontFamily: 'Montserrat-Regular', color: 'white'}}>Continue</Text>
              </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
      <NavBar />
      <MenuBar currentScreenId={1} />
          </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
  },
  contentContainer: {
    width: '100%',
    maxHeight: '94%',
  },
  routinesContainer: {
    marginTop: '5%',
    minHeight: 0.4 * screenHeight,
  },
  myRoutineContainer: {
    marginTop: '15%',
  },
  header: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
    marginBottom: '5%',
  },
  createCard: {
    width: '100%',
    marginBottom: 0.025 * screenHeight,
    height: 0.11 * screenHeight,
    backgroundColor: 'white',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createCardText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 18,
    color: 'black',
  },
  ratingContainer: {
    flexDirection: 'row',
    margin: '8%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingText: {
    color: 'white',
    fontFamily: 'Montserrat-Regular',
  },
  starContainer: {
    width: 0.3 * screenWidth,
    height: 0.04 * screenHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  starTouch: {
    marginRight: '2%',
  },
  textInputStyle: {
    marginVertical: '5%',
    paddingVertical: 2,
    fontFamily: 'Montserrat-Regular',
    color: 'black',
    width: 180,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 8
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 10,
    borderColor: 'mediumorchid',
    borderWidth: 1,
    padding: 25,
    alignItems: "center",
    shadowColor: "#D4AF37",
    shadowOffset: {
      width: 4,
      height: 4
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 2,
    padding: 7,
    elevation: 2,
    marginHorizontal: 15
  },
});

export default RoutineScreen;

// search?
