import {React, useEffect, useState} from 'react';
import {
  StyleSheet,
  ImageBackground,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  TextInput, Modal, Pressable
} from 'react-native';
import Dropdown from '../views/Dropdown';
import MenuBar from '../views/MenuBar';
import NavBar from '../views/NavBar';
import {ScrollView} from 'react-native-gesture-handler';
import RoutineCard from '../views/RoutineCard';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import RoutineDayCard from '../views/RoutineDayCard';
import DropDownPicker from 'react-native-dropdown-picker';

var screenHeight = Dimensions.get('window').height;
var screenWidth = Dimensions.get('window').width;

const RoutineDetailScreen = ({ route }) => {
  var bg = require('../../assets/media/bg.png');
  overlays = require('../../assets/media/ig4.jpg');
  const {routineId, self} = route.params
  const [inMyList, setInMyList] = useState(self);
  const [routineName, setRoutineName] = useState('Workout Program 1');
  const [newWorkoutName, setNewWorkoutName] = useState('');

  const [dayList, setDayList] = useState([
    {id: '1', name: 'Day 1: Chest workout', complete: true, exerciseIds: ['0', '1', '2', '3', '4', '5', '6', '7']},
    {id: '2', name: 'Day 2: Back workout', complete: false, exerciseIds: ['0', '1', '2', '3', '4', '5', '6', '7', '0', '1', '2', '3', '4', '5', '6', '7']},
    {id: '3', name: 'Day 3: Arms workout', complete: false, exerciseIds: ['0', '1', '2', '3', '4']},
    {id: '4', name: 'Day 4: Legs and Cardio', complete: false, exerciseIds: ['0', '1']},
  ])

  const [modalVisible, setModalVisible] = useState(false);
  const createNewRoutine = () => {
    //create new workout with given name and retrive id
    let id = 0
    setModalVisible(false);
  }

  let dropdownItems = [
    {value: 'ch', label: 'Chest'},
    {value: 'ba', label: 'Back'},
    {value: 'lg', label: 'Legs'},
    {value: 'tr', label: 'Triceps'},
    {value: 2, label: 'Bench Press', parent: 'ch'},
    {value: 3, label: "Pull Ups", parent: 'ba'}, 
    {value: 4, label: "Machine Chest Flys", parent: 'ch'}, 
    {value: 5, label: "Lunges", parent: 'lg'}, 
    {value: 7, label: "Tricep Bench Dips", parent: 'tr'}, 
    {value: 1, label: "Incline Dumbell Press", parent: 'ch'}, 
  ];
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(dropdownItems);
  const [exerciseName, setExerciseName] = useState(null);
  const [newExercises, setNewExercises] = useState([]);

  const addExercise = (item) => {
    const found = newExercises.some(el => el.id == item.value);
    if (!found) {
      setNewExercises([...newExercises, {name: item.label, id: item.value}])
    }
  }

  useEffect(() => {}, []); 
  return (
    <View style={styles.container}>
    <ImageBackground source={overlays} imageStyle={{opacity: 0.07}} style={styles.overlay}>
      <ScrollView showsVerticalScrollIndicator={false} style={[styles.contentContainer, modalVisible?{opacity: 0.5}:{}]}>
          <TextInput  style={styles.headerTextInputStyle}  maxLength={20} onChangeText={(text) => setRoutineName(text)} value={routineName} cursorColor={"rgba(0,0,0,1)"}/>
          <View style={styles.addListContainer}>
            <TouchableOpacity onPress={() => {setInMyList(!inMyList)}}>
              <View style={styles.addListContainer_}>
              <Text style={styles.addListText}>{inMyList?'Remove this routine from your list':'Add this routine to your list'}</Text>
              {!inMyList&&<IonIcon name="ios-add-outline" color="rgba(250,250,250,1)" size={20} />}
              {inMyList&&<IonIcon name="ios-close-outline" color="rgba(250,250,250,1)" size={20} />}
              </View>
            </TouchableOpacity>
          </View>
          {dayList.map((day, index) => (
            <RoutineDayCard day={day} />
          ))}
          {inMyList &&
          <View style={styles.createDayContainer}>
            <Text style={styles.createCardText}>Add New Workout</Text>
            <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
              <IonIcon name="ios-add-circle-outline" color="rgba(10,10,10,0.7)" size={40} />
            </TouchableOpacity>
          </View>
          }
          <Modal animationType="fade" transparent={true} visible={modalVisible}
            onRequestClose={() => { setModalVisible(!modalVisible); }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={{fontFamily: 'Montserrat-Regular'}}>Enter the name of your workout</Text>
                <TextInput  style={styles.textInputStyle}  maxLength={20} onChangeText={(text) => setNewWorkoutName(text)} value={newWorkoutName} cursorColor={"rgba(0,0,0,1)"}/>
                <DropDownPicker
                  open={open}
                  value={exerciseName}
                  items={items}
                  searchable={true}
                  setOpen={setOpen}
                  setValue={setExerciseName}
                  setItems={setItems}
                  categorySelectable={false}
                  onSelectItem={(item) => {addExercise(item)}}
                  showTickIonIcon={false}
                  placeholder="Select exercies to add"
                  searchPlaceholder="Type exercise name"
                  style={{
                    backgroundColor: "rgba(0,0,0,0)",
                    borderColor: 'white',
                    borderBottomColor: '#D4AF37',
                    marginBottom: '5%'
                  }}
                  dropDownContainerStyle={{
                    backgroundColor: "rgba(250,250,250,1)",
                    borderColor: '#D4AF37',
                    borderTopColor: '#dfdfdf',
                  }}
                  placeholderStyle={{
                    textAlign: 'center'
                  }}
                  labelStyle={{
                    textAlign: 'center'
                  }}
                  textStyle={{
                    fontFamily: 'Montserrat-Regular',
                    color: 'black'
                  }}
                  arrowIonIconStyle={{
                    position: 'absolute',
                    right: "5%",
                    top: "-27%"
                  }}
                  searchContainerStyle={{
                    borderBottomColor: "#dfdfdf"
                  }}
                  listItemLabelStyle={{
                    color: "#000"
                  }}
                  listParentLabelStyle={{
                    fontWeight: "bold"
                  }}
                  listParentContainerStyle={{
                    borderBottomColor: '#dfdfdf',
                    borderBottomWidth: 1
                  }}
                  searchTextInputStyle={{
                    borderWidth: 0,
                    textAlign: 'center'
                  }}
                />
                <View style={styles.exerciseContainer}>
                {newExercises.map((exercise, index) => (
                    <View style={{marginBottom: '2%', width: '30%', flexDirection: 'row'}}>
                        <Text style={{fontFamily: 'Montserrat-Bold', marginRight: '3%'}}>{index+1}</Text>
                        <Text style={{fontFamily: 'Montserrat-Regular'}}>{exercise.name}</Text>
                    </View>
                ))}
                </View>
                <View style={{flexDirection: 'row'}}>
                <Pressable style={[styles.button, {backgroundColor: 'rgba(20,20,20,0.8)'}]} onPress={() => setModalVisible(!modalVisible)}>
                  <Text style={{fontFamily: 'Montserrat-Regular', color: 'white'}}>Cancel</Text>
                </Pressable>
                <Pressable style={[styles.button, {backgroundColor: '#D4AF37'}]} onPress={() => createNewRoutine()}>
                  <Text style={{fontFamily: 'Montserrat-Regular', color: 'white'}}>Save</Text>
                </Pressable>
                </View>
              </View>
            </View>
          </Modal>
      </ScrollView>
      </ImageBackground>
      <NavBar />
      <MenuBar currentScreenId={1} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: screenHeight,
    backgroundColor: 'black',
  },
  contentContainer: {
    width: '100%',
    maxHeight: 0.94 * screenHeight,
    marginTop: 0.07 * screenHeight,
  },
  createDayContainer: {
    width: '100%',
    height: 0.1 * screenHeight,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  },
  createCardText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 18,
  },
  addListContainer: {
    flexDirection: 'row',
    marginBottom: '5%',
    justifyContent: 'center',
  },
  addListContainer_: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 2,
    borderRadius: 50,
    borderWidth: 1
  },
  addListText: {
    fontFamily: 'Montserrat-Italic',
    color: 'white',
    marginRight: '5%'
  },
  textInputStyle: {
    paddingVertical: 2,
    marginVertical: '5%',
    fontFamily: 'Montserrat-Regular',
    color: 'black',
    width: 180,
    backgroundColor: 'rgba(20,20,20,0.1)',
    borderRadius: 8
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "rgba(250,250,250,1)",
    borderRadius: 10,
    borderColor: 'mediumorchid',
    borderWidth: 1,
    padding: 25,
    alignItems: "center",
    shadowColor: "gold",
    shadowOffset: {
      width: 4,
      height: 4
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 3,
    padding: 5,
    elevation: 2,
    marginHorizontal: 15
  },
  exerciseContainer: {
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-evenly',
    marginBottom: '5%'
  },
  headerTextInputStyle: {
    paddingVertical: 2,
    color: "white",
    textAlign: "center",
    fontFamily: 'Montserrat-Bold',
    fontSize: 20,
    marginBottom: "4%",
    color: 'white',
    textDecorationColor: '',
    backgroundColor: 'rgba(20,20,20,0.1)',
  },
});

export default RoutineDetailScreen;

// Reorder position