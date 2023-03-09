import {React, useEffect, useState, useContext, useMemo} from 'react';
import { StyleSheet, ImageBackground, View, Text, Dimensions, TouchableOpacity, TextInput, Modal, Pressable} from 'react-native';
import Dropdown from '../views/Dropdown';
import MenuBar from '../views/MenuBar';
import NavBar from '../views/NavBar';
import { AuthContext } from '../../App';
import {ScrollView} from 'react-native-gesture-handler';
import IonIonIcon from 'react-native-vector-icons/Ionicons';
import RoutineCard from '../views/RoutineCard';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import { supabase } from '../../supabaseClient';

var screenHeight = Dimensions.get('window').height;
var screenWidth = Dimensions.get('window').width;

const RoutineScreen = () => {
  const navigation = useNavigation();
  const user = useContext(AuthContext);
  var bg = require('../../assets/media/bg.png');
  var overlays = [require('../../assets/media/ig3.jpg')];
  let dropdownItems = [ {label: 'All', value: '-1'}, {label: 'Beginner', value: '0'}, {label: 'Intermediate', value: '1'}, {label: 'Expert', value: '2'} ];
  let experienceColorMap = {0: '#ABE6CE', 1: '#CECBD6', 2: '#F388B1'};

  const [routineList, setRoutineList] = useState([]);
  const [myRoutineList, setMyRoutineList] = useState([]);
  const [experience, setExperience] = useState(-1);
  const [rating, setRating] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [newRoutineName, setNewRoutineName] = useState('');
  const [newRoutineLevel, setNewRoutineLevel] = useState(0);
  const [search, setSearch] = useState('');
  const [openSearch, setOpenSearch] = useState(false)

  const filteredRoutines = useMemo( () => { return routineList.filter(function (item) {
    const itemData = item.routine_name.toUpperCase();
    const textData = search.toUpperCase();
    var searchBool = search==''?true:itemData.indexOf(textData) > -1;
    var levelBool = experience == -1?true:item.level == experience;
    var itemRating = item.rating_count==0?0:item.rating_score * 5 / item.rating_count;
    var ratingBool = itemRating >= rating;
    return levelBool && ratingBool && searchBool;
  })}, [experience, rating, search, routineList])

  const myRoutineCallback = (id, action) => {
    if (action == 'Add'){
      const routine = routineList.find((ele) => ele.id == id)
      var tempList = myRoutineList.slice();
      tempList.push({id: -1, routines: routine})
      setMyRoutineList(tempList);
    } else if (action == 'Rem') {
      const idx = myRoutineList.map((ele) => ele.routines.id).indexOf(id)
      setMyRoutineList([...myRoutineList.slice(0, idx), ...myRoutineList.slice(idx + 1)])
    } else if (action == 'Del') {
      const idx = routineList.map((ele) => ele.id).indexOf(id)
      const myIdx = myRoutineList.map((ele) => ele.routines.id).indexOf(id)
      if(idx > -1) setRoutineList([...routineList.slice(0, idx), ...routineList.slice(idx + 1)])
      if(myIdx > -1) setMyRoutineList([...myRoutineList.slice(0, myIdx), ...myRoutineList.slice(myIdx + 1)])
    }
  }

  const createNewRoutine = async () => {
    var newData = {routine_name: newRoutineName, level: newRoutineLevel, created_by: user.id, created_by_username: user.user_metadata.username}
    const insertRes = await supabase.from('routines').insert(newData).select();
    if(insertRes.error) console.error(insertRes.error)
    const myInsertRes = await supabase.from('user_routine_my').insert({user_id: user.id, routine_id: insertRes.data[0].id}).select('id');
    if(myInsertRes.error) console.error(myInsertRes.error)
    navigation.navigate('RoutineDetailScreen', {
      routine: insertRes.data[0],
      self: true,
      myRoutineCallback: myRoutineCallback
    });
    var tempList = myRoutineList.slice();
    tempList.push({id: myInsertRes.data[0].id, routines: insertRes.data[0]})
    setModalVisible(false);
    setMyRoutineList(tempList);
  }

  const getRoutines = async () => {
    const routineRes = await supabase.from('routines').select().eq('published', true);
    if(routineRes.error) console.error(routineRes.error)
    const myRoutineRes = await supabase.from('user_routine_my').select(`id, my_rating, routines(*)`).eq('user_id', user.id);
    if(myRoutineRes.error) console.error(myRoutineRes.error)
    var data = routineRes.data;
    data.sort(function(a, b) {return (a.added_by > b.added_by)?-1:1;});
    setRoutineList(data)
    setMyRoutineList(myRoutineRes.data)
  }

  useEffect(() => {getRoutines()}, []);
  
  return (
    <View style={styles.container}>
      <ImageBackground source={overlays[0]} imageStyle={{opacity: 0.12}} style={{height: '100%'}}>
      <ScrollView showsVerticalScrollIndicator={false} style={[styles.contentContainer, modalVisible?{opacity: 0.5}:{}]}>
      <View style={styles.topBar}>
          {!openSearch &&
          <TouchableOpacity onPress={() => {setOpenSearch(!openSearch)}} style={styles.searchButton}>
            <IonIcon name="ios-search-outline" color="rgba(250,250,250,0.8)" size={24} />
          </TouchableOpacity>
          }
          {openSearch &&
          <>
          <TextInput 
            style={styles.textInputStyle} 
            maxLength={10}
            onChangeText={(text) => setSearch(text)}
            onSubmitEditing = {() => {setOpenSearch(!openSearch); setSearch('')}}
            value={search}
            cursorColor='white'
            underlineColorAndroid="rgba(0,0,0,0)"
          />
          <TouchableOpacity onPress={() => {setOpenSearch(!openSearch)}} style={styles.closeButton}>
            <IonIcon name="close-outline" color="rgba(250,250,250,0.8)" size={24} />
          </TouchableOpacity>
          </>
          } 
      </View>
        <View style={styles.myRoutineContainer}>
            <Text style={styles.header}>My Routines</Text>
            {myRoutineList.map(routine => (
              <RoutineCard key={routine.id} routine={routine.routines} my_rating={routine.my_rating} self={true} myRoutineCallback={myRoutineCallback} />
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
              elevation={1}
            />
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>Minimum Rating</Text>
              <View style={styles.starContainer}>
                <TouchableOpacity onPress={() => { setRating(0) }} style={styles.starTouch}>
                  <IonIcon name="star" size={18} color={rating >= 0 ? '#D4AF37' : 'white'} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setRating(2) }} style={styles.starTouch}>
                  <IonIcon name="star" size={18} color={rating > 1 ? '#D4AF37' : 'white'} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setRating(3) }} style={styles.starTouch}>
                  <IonIcon name="star" size={18} color={rating > 2 ? '#D4AF37' : 'white'} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setRating(4) }} style={styles.starTouch}>
                  <IonIcon name="star" size={18} color={rating > 3 ? '#D4AF37' : 'white'} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setRating(5) }} style={styles.starTouch}>
                  <IonIcon name="star" size={18} color={rating > 4 ? '#D4AF37' : 'white'} />
                </TouchableOpacity>
              </View>
            </View>
            {filteredRoutines.map(routine => (
              <RoutineCard key={routine.id} routine={routine} self={false} myRoutineCallback={myRoutineCallback} />
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
              <Text style={{fontFamily: 'Montserrat-Regular', color: 'black'}}>Enter the name of your routine</Text>
              <TextInput autoCapitalize='words' style={styles.textInputStyleModal}  maxLength={22} onChangeText={(text) => setNewRoutineName(text)} value={newRoutineName} cursorColor={"rgba(0,0,0,1)"}/>
              <View style={{paddingBottom: 15, flexDirection: 'row'}}>
              <Pressable style={[styles.button, 
                {backgroundColor: experienceColorMap[0], borderColor: '#D4AF37', borderWidth: newRoutineLevel==0?1:0}]} onPress={() => setNewRoutineLevel(0)}>
                <Text style={{fontFamily: 'Montserrat-Regular', color: 'white'}}>Beginner</Text>
              </Pressable>
              <Pressable style={[styles.button, 
                {backgroundColor: experienceColorMap[1], borderColor: '#D4AF37', borderWidth: newRoutineLevel==1?1:0}]} 
                onPress={() => setNewRoutineLevel(1)}>
                <Text style={{fontFamily: 'Montserrat-Regular', color: 'white'}}>Intermediate</Text>
              </Pressable>
              <Pressable style={[styles.button, 
                {backgroundColor: experienceColorMap[2], borderColor: '#D4AF37', borderWidth: newRoutineLevel==2?1:0}]} onPress={() => setNewRoutineLevel(2)}>
                <Text style={{fontFamily: 'Montserrat-Regular', color: 'white'}}>Expert</Text>
              </Pressable>
              </View>
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
    paddingHorizontal: 10,
  },
  myRoutineContainer: {
    marginTop: '15%',
    paddingHorizontal: 10,
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
    height: 90,
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
  textInputStyleModal: {
    marginVertical: '5%',
    paddingVertical: 2,
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
  topBar: {
    position: 'absolute',
    width: 0.85*screenWidth,
    alignSelf: 'flex-end',
    height: 55,
    backgroundColor: "rgba(0,0,0,0)",
    lineHeight: "7%",
    zIndex: 0,
    elevation: 0,
  },
  closeButton: {
    position: 'absolute',
    right: "3%",
    top: "30%",
  },
  searchButton: {
    position: 'absolute',
    right: "3%",
    top: "25%",
  },
  textInputStyle: {
    marginTop: '3%',
    fontFamily: 'Montserrat-Regular',
    paddingVertical: 5,
    fontSize: 14,
    color: 'white',
    backgroundColor: 'rgba(250,250,250,0.1)',
    borderRadius: 20
  }
});

export default RoutineScreen;

// search?
