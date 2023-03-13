import {React, useEffect, useState, useContext, useRef} from 'react';
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
  const navigation = useNavigation();
  const user = useContext(AuthContext);
  const { routine, self, myRoutineCallback, my_rating } = route.params
  var rating = routine.rating_count==0?-1:routine.rating_score * 5 / routine.rating_count;
  const [myRating, setMyRating] = useState(my_rating==null?0:my_rating);
  const creator = user.id===routine.created_by;

  const [routineName, setRoutineName] = useState(routine.routine_name);
  const [inMyList, setInMyList] = useState(self);
  const [dayList, setDayList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newWorkoutName, setNewWorkoutName] = useState('');
  const [dropdownItems, setDropdownItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [exerciseName, setExerciseName] = useState(null);
  const [newExercises, setNewExercises] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const myRoutineRef = useRef(inMyList);
  const myRatingRef = useRef(myRating)


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

  const modifyMyRoutine = (newVal) => {
    setInMyList(newVal);
    myRoutineRef.current = newVal;
  }

  const modifyMyRating = (newVal) => {
    setMyRating(newVal);
    myRatingRef.current = newVal;
  }

  const deleteRoutine = async () => {
    const myDeleteRes = await supabase.from('routines').delete().eq('id', routine.id);
    if (myDeleteRes.error) console.error(myDeleteRes.error)
    myRoutineCallback(routine.id, 'Del')
    navigation.goBack();
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
    
    return async () => {
      var temp = my_rating==null?0:my_rating;
      if(myRatingRef.current != temp){
        const myUpdateRes = await supabase.from('user_routine_my').update({my_rating: myRatingRef.current}).eq('user_id', user.id).eq('routine_id', routine.id);
        if (myUpdateRes.error) console.error(myUpdateRes.error)
      }
      if(myRoutineRef.current==self) return;
      if(myRoutineRef.current){
        const myInsertRes = await supabase.from('user_routine_my').insert({user_id: user.id, routine_id: routine.id});
        if(myInsertRes.error?.code=='23505'){
          console.log('Already Present');
        } else {
          myRoutineCallback(routine.id, 'Add')
        }
      } else {
        const myDeleteRes = await supabase.from('user_routine_my').delete().eq('user_id', user.id).eq('routine_id', routine.id);
        if (myDeleteRes.error) console.error(myDeleteRes.error)
        myRoutineCallback(routine.id, 'Rem')
      }
    }
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} style={[styles.contentContainer, (modalVisible||deleteModal)?{opacity: 0.5}:{}]}> 
      <ImageBackground source={overlays} imageStyle={{opacity: 0.07}} style={styles.overlay}>
          <TextInput editable={creator} style={styles.headerTextInputStyle}  maxLength={20} onChangeText={(text) => setRoutineName(text)} value={routineName} cursorColor={"rgba(0,0,0,1)"}/>
          <View style={styles.subTextContainer}>
            {(creator || !inMyList) &&
            <View style={styles.starContainer}>
              <Text style={styles.subText}>Rating: </Text>
              <IonIcon name="star" size={12} color={rating > 0 ? '#D4AF37' : 'white'} />
              <IonIcon name="star" size={12} color={rating > 1 ? '#D4AF37' : 'white'} />
              <IonIcon name="star" size={12} color={rating > 2 ? '#D4AF37' : 'white'} />
              <IonIcon name="star" size={12} color={rating > 3 ? '#D4AF37' : 'white'} />
              <IonIcon name="star" size={12} color={rating > 4 ? '#D4AF37' : 'white'} />
            </View>}
            {(!creator && inMyList) &&
            <View style={styles.starContainer}>
              <Text style={styles.subText}>My Rating: </Text>
              <TouchableOpacity onPress={()=>modifyMyRating(1)}><IonIcon name="star" size={12} color={myRating > 0 ? '#D4AF37' : 'white'} /></TouchableOpacity>
              <TouchableOpacity onPress={()=>modifyMyRating(2)}><IonIcon name="star" size={12} color={myRating > 1 ? '#D4AF37' : 'white'} /></TouchableOpacity>
              <TouchableOpacity onPress={()=>modifyMyRating(3)}><IonIcon name="star" size={12} color={myRating > 2 ? '#D4AF37' : 'white'} /></TouchableOpacity>
              <TouchableOpacity onPress={()=>modifyMyRating(4)}><IonIcon name="star" size={12} color={myRating > 3 ? '#D4AF37' : 'white'} /></TouchableOpacity>
              <TouchableOpacity onPress={()=>modifyMyRating(5)}><IonIcon name="star" size={12} color={myRating > 4 ? '#D4AF37' : 'white'} /></TouchableOpacity>
            </View>}
            <Text style={styles.subText}>Added by: {routine.added_by} users</Text>
          </View>
          <View style={styles.addListContainer}>
            {!creator &&
            <TouchableOpacity onPress={() => modifyMyRoutine(!inMyList)}>
              <View style={styles.addListContainer_}>
              <Text style={styles.addListText}>
                {inMyList?'Remove this routine from your list':'Add this routine to your list'}
              </Text>
              {!inMyList&&<IonIcon name="ios-add-outline" color="rgba(250,250,250,1)" size={20} />}
              {inMyList&&<IonIcon name="ios-remove-outline" color="rgba(250,250,250,1)" size={20} />}
              </View>
            </TouchableOpacity>}
            {creator && 
            <TouchableOpacity onPress={() => setDeleteModal(true)}>
              <View style={styles.addListContainer_}>
              <Text style={styles.addListText}>Delete this routine</Text>
              <IonIcon name="ios-remove-outline" color="rgba(250,250,250,1)" size={20} />
              </View>
            </TouchableOpacity>}
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
                  listMode='MODAL'
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
                  modalContentContainerStyle={{
                    backgroundColor: "black",
                    borderColor: '#D4AF37',
                    borderTopColor: '#dfdfdf',
                  }}
                  placeholderStyle={{
                    textAlign: 'center',
                    color: 'black'
                  }}
                  arrowIonIconStyle={{
                    position: 'absolute',
                    right: "5%",
                    top: "-27%"
                  }}
                  searchContainerStyle={{
                    borderBottomColor: "#D4AF37"
                  }}
                  listItemLabelStyle={{
                    color: "white"
                  }}
                  listParentLabelStyle={{
                    fontWeight: "bold",
                    color: 'white'
                  }}
                  listParentContainerStyle={{
                    borderBottomColor: '#dfdfdf',
                    borderBottomWidth: 1
                  }}
                  searchTextInputStyle={{
                    borderWidth: 0,
                    textAlign: 'center',
                    color: 'white'
                  }}
                  searchTextInputProps={cursorColor='white'}
                />
                <View style={styles.exerciseContainer}>
                {newExercises.map((exercise, index) => (
                  <TouchableOpacity key={index} 
                  style={{marginBottom: 5, width: '45%'}}
                  onPress={() => removeNewExercise(index)}>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={{fontFamily: 'Montserrat-Bold', marginRight: 5, color: 'black'}}>{index+1}</Text>
                      <Text style={{fontFamily: 'Montserrat-Regular', color: 'black'}}>{exercise.name}</Text>    
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
          <Modal animationType="fade" transparent={true} visible={deleteModal}
            onRequestClose={() => { setDeleteModal(false); }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={{fontFamily: 'Montserrat-Regular', color: 'black'}}>Are you sure you want to delete this routine? </Text>
                <View style={{flexDirection: 'row', marginTop: 25}}>
                <Pressable style={[styles.button, {backgroundColor: 'rgba(30,30,30,0.8)'}]} onPress={() => setDeleteModal(false)}>
                  <Text style={{fontFamily: 'Montserrat-Regular', color: 'white'}}>Cancel</Text>
                </Pressable>
                <Pressable style={[styles.button, {backgroundColor: '#D4AF37'}]} onPress={() => deleteRoutine()}>
                  <Text style={{fontFamily: 'Montserrat-Regular', color: 'white'}}>Yes</Text>
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
    marginTop: 55
  },
  createDayContainer: {
    width: '100%',
    height: 90,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  },
  subTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 10
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
    marginVertical: 15,
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
    marginBottom: 15
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