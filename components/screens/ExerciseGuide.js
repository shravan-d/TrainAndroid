import {React, useEffect, useState, useContext, useMemo} from 'react';
import {StyleSheet, ImageBackground, View, Text, Dimensions, TouchableOpacity, TextInput} from 'react-native';
import ExerciseCard from '../views/ExerciseCard';
import Dropdown from '../views/Dropdown';
import MenuBar from '../views/MenuBar';
import NavBar from '../views/NavBar';
import { ScrollView } from 'react-native-gesture-handler';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { supabase } from '../../supabaseClient';
import { AuthContext } from '../../App';

var screenHeight = Dimensions.get('window').height;
var screenWidth = Dimensions.get('window').width;

const ExerciseGuide = () => {
  const user = useContext(AuthContext);
  var bg = require ('../../assets/media/bg.png');
  var overlays = [require('../../assets/media/ig1.jpg')]
  var muscleGroupDetails = [
    {id: 0, label: 'All', value: ''},
    {id: 1, primary_img: 'https://imgur.com/td3BZl0.jpg', secondary_img: '', label: 'Chest', value: 'Chest'},
    {id: 2, primary_img: '', secondary_img: '', label: 'Back', value: 'Back'},
    {id: 3, primary_img: '', secondary_img: '', label: 'Legs', value: 'Legs'},
    {id: 4, primary_img: '', secondary_img: '', label: 'Shoulder', value: 'Shoulder'},
    {id: 5, primary_img: 'https://imgur.com/flps7Wn.jpg', secondary_img: '', label: 'Biceps', value: 'Biceps'},
    {id: 6, primary_img: '', secondary_img: '', label: 'Triceps', value: 'Triceps'},
    {id: 7, primary_img: '', secondary_img: '', label: 'Abs', value: 'Abs'},
  ];

  const [showFavorites, setShowFavorites] = useState(false);
  const [search, setSearch] = useState('');
  const [openSearch, setOpenSearch] = useState(false)
  const [muscleGroup, setMuscleGroup] = useState('');
  const [exerciseList, setExerciseList] = useState([]);
  const [modifyFavourites, setModifyFavourites] = useState([]);

  const filteredExercises = useMemo( () => { return exerciseList.filter(function (item) {
    const itemData = item.exercise_name.toUpperCase();
    const textData = search.toUpperCase();
    var searchBool = search == '' ? true : itemData.indexOf(textData) > -1;
    var favoritesBool = !showFavorites ? true : item.favourite == showFavorites;
    const mgItemData = item.muscle_group.toUpperCase();
    const mgTextData = muscleGroup.toUpperCase();
    var groupBool = muscleGroup == '' ? true : mgItemData.indexOf(mgTextData) > -1;
    return favoritesBool && groupBool && searchBool;
  })}, [showFavorites, muscleGroup, search, exerciseList])


  const changeFavouriteCallback = (favorite, exercise_id) =>{
    var temp = modifyFavourites;
    if (favorite){
      temp.push(exercise_id);
    } else {
      temp.push(-1*exercise_id);
    }
    setModifyFavourites(temp)
  }

  const getExerciseList = async () => {
    const {data, error} = await supabase.from('exercises').select();
    if(error) console.error(error.message)
    for (var exercise of data)
      exercise.favourite = false;
    const favouriteRes = await supabase.from('user_exercise_fav').select('exercise_id').eq('user_id', user.id);
    if(favouriteRes.error) console.error(favouriteRes.error.message)
    for (const fav of favouriteRes.data){
      var idx = data.findIndex((obj => obj.id == fav.exercise_id));
      data[idx].favourite = true;
    }
    setExerciseList(data)
  }

  useEffect(() => {
    getExerciseList();
  }, []);

  useEffect(() => {

    return async () => {
      var insertData = []
      var deleteData = []
      for (const ele of modifyFavourites){
        if (ele < 0){
          var idx = insertData.map(e => e.exercise_id).indexOf(-1*ele);
          if (idx > -1){
            insertData.splice(idx, 1);
          } else 
            deleteData.push({user_id: user.id, exercise_id: -1*ele})
        } else {
          var idx = deleteData.map(e => e.exercise_id).indexOf(ele);
          if (idx > -1){
            deleteData.splice(idx, 1);
          } else
            insertData.push({user_id: user.id, exercise_id: ele})
        }
      }
      if (insertData.length > 0){
        const insertRes = await supabase.from('user_exercise_fav').insert(insertData);
        if(insertRes.error) console.error(insertRes.error)
      }
      for (const del of deleteData){
        const deleteRes = await supabase.from('user_exercise_fav').delete().eq('user_id', del.user_id).eq('exercise_id', del.exercise_id);
        if(deleteRes.error) console.error(deleteRes.error)
      }
    }
  }, [muscleGroup])

  return (
    <View style={styles.container}>
      <View style={{height: '94%'}}>
      <ImageBackground source={overlays[0]} imageStyle={{opacity:0.06}} style={{height: '100%'}}>
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
        <View style={styles.headerContainer}>
          <View >
            <Dropdown value={muscleGroup} setValue={setMuscleGroup} 
            header={"What muscle group would you like to workout today?"} dropdownItems={muscleGroupDetails} elevation={1} zIndex={1}/>      
          </View>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.exerciseContainer}>
          <View style={styles.favouritesContainer}>
            <Text style={styles.text}>{showFavorites?'Show All':'Show favorites'}</Text>
            <TouchableOpacity onPress={() => setShowFavorites(!showFavorites)}>
            <IonIcon name="heart" size={18} color={showFavorites ? '#D4AF37' : 'white'} />
            </TouchableOpacity>
          </View>
          {filteredExercises.map((exercise) => (
            <ExerciseCard key={exercise.id} exercise={exercise} changeFavouriteCallback={changeFavouriteCallback}/>
          ))}
        </ScrollView>
      </ImageBackground>
      </View>
      <NavBar />
      <MenuBar currentScreenId={0}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    width: '100%', 
    height: '100%', 
    minHeight: 0.94*screenHeight
  },
  headerContainer: {
    marginTop: 55,
    paddingHorizontal: 10,
    paddingBottom: 10,
    zIndex: 1,
    elevation: 1
  },
  favouritesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 20
  },
  text: {
    color: 'white',
    fontFamily: 'Montserrat-Regular'
  },
  exerciseContainer: {
    width: "100%",
    padding: 10,
    zIndex: 0,
    elevation: 0
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

export default ExerciseGuide;