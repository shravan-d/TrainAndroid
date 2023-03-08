import {React, useEffect, useState, useContext} from 'react';
import { StyleSheet, ImageBackground, View, Text, Dimensions, TouchableOpacity, TextInput, Modal, Pressable } from 'react-native';
import MenuBar from '../views/MenuBar';
import NavBar from '../views/NavBar';
import {ScrollView} from 'react-native-gesture-handler';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import RoutineDayCard from '../views/RoutineDayCard';
import DropDownPicker from 'react-native-dropdown-picker';
import { supabase } from '../../supabaseClient';
import { AuthContext } from '../../App';

var screenHeight = Dimensions.get('window').height;
var screenWidth = Dimensions.get('window').width;

const RoutineDetailScreen = ({ route }) => {
  var bg = require('../../assets/media/bg.png');
  var overlays = require('../../assets/media/ig4.jpg');
  const user = useContext(AuthContext);
  const { routine, self } = route.params
  var rating = routine.rating_count==0?-1:routine.rating_score * 5 / routine.rating_count;
  const creator = user.id===routine.created_by;

  const [routineName, setRoutineName] = useState(routine.routine_name);
  const [inMyList, setInMyList] = useState(self);
  const [modalVisible, setModalVisible] = useState(false);
  const [newWorkoutName, setNewWorkoutName] = useState('');
  const [dropdownItems, setDropdownItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [exerciseName, setExerciseName] = useState(null);
  const [newExercises, setNewExercises] = useState([]);
  const [dayList, setDayList] = useState([]);

  const createNewRoutine = async () => {
    if(!newWorkoutName) return;
    if(newExercises.length == 0) return;
    const insertDayRes = await supabase.from('routine_days').insert({routine_id: routine.id, day_name: newWorkoutName}).select('id');
    if (insertDayRes.error) console.error(insertDayRes.error)
    var insertData = newExercises.map(e => {return {day_id: insertDayRes.data[0].id, exercise_id: e.id}});
    const insertMapRes = await supabase.from('days_exercise_map').insert(insertData).select('exercise_id, exercises(*)').eq('day_id', insertDayRes.data[0].id);
    if (insertMapRes.error) console.error(insertMapRes.error)
    var newDay = {id: insertDayRes.data[0].id, day_name: newWorkoutName, routine_id: routine.id, created_at: new Date()};
    newDay.exerciseList = insertMapRes.data.map(e => e.exercises);
    setDayList([...dayList, newDay]);
    setNewExercises([]);
    setNewWorkoutName('');
    setModalVisible(false);
  }

  const addExercise = (item) => {
    const found = newExercises.some(el => el.id == item.value);
    if (!found) {
      setNewExercises([...newExercises, {name: item.label, id: item.value}])
    }
  }

  const removeNewExercise = (idx) => {
    setNewExercises([...newExercises.slice(0, idx), ...newExercises.slice(idx+1)]);
  }

  const getRoutineDays = async () => {
    const dayRes = await supabase.from('routine_days').select().eq('routine_id', routine.id);
    if (dayRes.error) console.error(dayRes.error)
    var data = dayRes.data;
    data.sort(function(a, b) {return (a.created_at > b.created_at)?1:-1;});
    for(var day of data) {
      const exerciseRes = await supabase.from('days_exercise_map').select('exercise_id, exercises(*)').eq('day_id', day.id);
      if (exerciseRes.error) console.error(exerciseRes.error)
      day.exerciseList = exerciseRes.data.map(e => e.exercises);
    }
    setDayList(data)
  }

  const getExercises = async () => {
    if(!modalVisible) return;
    if(dropdownItems.length > 0) return;
    const {data, error} = await supabase.from('exercises').select('id, exercise_name, muscle_group');
    if (error) console.error(error)
    var parentList = [
      {value: 'Chest', label: 'Chest'},
      {value: 'Back', label: 'Back'},
      {value: 'Legs', label: 'Legs'},
      {value: 'Triceps', label: 'Triceps'},
      {value: 'Biceps', label: 'Biceps'},
      {value: 'Abs', label: 'Abs'},
      {value: 'Shoulder', label: 'Shoulder'},
    ];
    var exerciseList = data.map((ele) => {return {label: ele.exercise_name, parent:ele.muscle_group, value: ele.id}})
    parentList.push(...exerciseList);
    setDropdownItems(parentList);
  }

  useEffect(() => {getExercises()}, [modalVisible])

  useEffect(() => {
    getRoutineDays();
  }, []);

  // useEffect(() => {
  //   return () => {
  //     console.log(self, inMyList)
  //     // if(self==inMyList) return;
  //     console.log('Updating routine in my list1', self, inMyList)
  //   }
  // }, []);  

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} style={[styles.contentContainer, modalVisible?{opacity: 0.5}:{}]}> 
      <ImageBackground source={overlays} imageStyle={{opacity: 0.07}} style={styles.overlay}>
          <TextInput editable={creator} style={styles.headerTextInputStyle}  maxLength={20} onChangeText={(text) => setRoutineName(text)} value={routineName} cursorColor={"rgba(0,0,0,1)"}/>
          <View style={styles.subTextContainer}>
            <View style={styles.starContainer}>
              <Text style={styles.subText}>Rating: </Text>
              <IonIcon name="star" size={12} color={rating > 0 ? '#D4AF37' : 'white'} />
              <IonIcon name="star" size={12} color={rating > 1 ? '#D4AF37' : 'white'} />
              <IonIcon name="star" size={12} color={rating > 2 ? '#D4AF37' : 'white'} />
              <IonIcon name="star" size={12} color={rating > 3 ? '#D4AF37' : 'white'} />
              <IonIcon name="star" size={12} color={rating > 4 ? '#D4AF37' : 'white'} />
            </View>
            <Text style={styles.subText}>Added by: {routine.added_by} users</Text>
          </View>
          <View style={styles.addListContainer}>
            <TouchableOpacity onPress={() => {setInMyList(!inMyList)}}>
              <View style={styles.addListContainer_}>
              <Text style={styles.addListText}>
                {creator?'Delete this routine':inMyList?'Remove this routine from your list':'Add this routine to your list'}
              </Text>
              {(!creator&&!inMyList)&&<IonIcon name="ios-add-outline" color="rgba(250,250,250,1)" size={20} />}
              {(creator||inMyList)&&<IonIcon name="ios-remove-outline" color="rgba(250,250,250,1)" size={20} />}
              </View>
            </TouchableOpacity>
          </View>
          {dayList.map((day, index) => (
            <RoutineDayCard key={index} day={day} />
          ))}
          {creator &&
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
                <Text style={{fontFamily: 'Montserrat-Regular', color: 'black'}}>Enter the name of your workout</Text>
                <TextInput autoCapitalize='sentences' style={styles.textInputStyle}  maxLength={20} onChangeText={(text) => setNewWorkoutName(text)} value={newWorkoutName} cursorColor={"rgba(0,0,0,1)"}/>
                <DropDownPicker
                  open={open}
                  value={exerciseName}
                  items={dropdownItems}
                  searchable={true}
                  setOpen={setOpen}
                  setValue={setExerciseName}
                  setItems={setDropdownItems}
                  categorySelectable={false}
                  onSelectItem={(item) => {addExercise(item)}}
                  showTickIcon={false}
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
                  <TouchableOpacity key={index} 
                  style={{marginBottom: '2%', width: '40%'}}
                  onPress={() => removeNewExercise(index)}>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={{fontFamily: 'Montserrat-Bold', marginRight: '3%'}}>{index+1}</Text>
                      <Text style={{fontFamily: 'Montserrat-Regular'}}>{exercise.name}</Text>    
                    </View>
                  </TouchableOpacity>
                ))}
                </View>
                <View style={{flexDirection: 'row'}}>
                <Pressable style={[styles.button, {backgroundColor: 'rgba(30,30,30,0.8)'}]} onPress={() => setModalVisible(!modalVisible)}>
                  <Text style={{fontFamily: 'Montserrat-Regular', color: 'white'}}>Cancel</Text>
                </Pressable>
                <Pressable style={[styles.button, {backgroundColor: '#D4AF37'}]} onPress={() => createNewRoutine()}>
                  <Text style={{fontFamily: 'Montserrat-Regular', color: 'white'}}>Save</Text>
                </Pressable>
                </View>
              </View>
            </View>
          </Modal>
      </ImageBackground>
      </ScrollView>
      <NavBar />
      <MenuBar currentScreenId={1} />
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
    maxHeight: '86%',
    marginTop: '15%'
  },
  createDayContainer: {
    width: '100%',
    height: 0.1 * screenHeight,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  },
  subTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: '4%'
  },
  subText: {
    fontFamily: 'Montserrat-Regular',
    color: 'white',
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  createCardText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 18,
    color: 'black'
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
    width: '75%',
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
    padding: 25,
    alignItems: "center",
    elevation: 5,
    width: '100%'
  },
  button: {
    borderRadius: 0,
    padding: 5,
    elevation: 2,
    marginHorizontal: 15
  },
  exerciseContainer: {
    flexDirection: 'row', 
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: '5%'
  },
  headerTextInputStyle: {
    paddingVertical: 2,
    color: "white",
    textAlign: "center",
    fontFamily: 'Montserrat-Bold',
    fontSize: 20,
    color: 'white',
    textDecorationColor: '',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
});

export default RoutineDetailScreen;

// Reorder position