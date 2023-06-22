import {React, useEffect, useState, useContext, useMemo} from 'react';
import {StyleSheet, ImageBackground, View, Text, Dimensions, TouchableOpacity, TextInput, FlatList} from 'react-native';
import ExerciseCard from '../views/ExerciseCard';
import Dropdown from '../views/Dropdown';
import MenuBar from '../views/MenuBar';
import NavBar from '../views/NavBar';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { supabase } from '../../supabaseClient';
import { AuthContext } from '../../App';
import { exerciseStore } from '../ExerciseReducer';
import RadioGroup from '../views/RadioGroup';
import { LoadingCard } from '../views/LoadingCard';

var screenHeight = Dimensions.get('window').height;
var screenWidth = Dimensions.get('window').width;

const ExerciseGuide = () => {
  const user = useContext(AuthContext);
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
  const [equipment, setEquipment] = useState(0);
  const [exerciseList, setExerciseList] = useState([]);
  const [modifyFavourites, setModifyFavourites] = useState([]);
  
  var fullExerciseList = exerciseStore.getState().exerciseList;

  const filteredExercises = useMemo( () => { 
    if (search=='' && muscleGroup=='' && !showFavorites && equipment==0)
      return exerciseList
    else
      return fullExerciseList.filter(function (item) {
        const itemData = item.name.toUpperCase();
        const textData = search.toUpperCase();
        var searchBool = search == '' ? true : itemData.indexOf(textData) > -1;
        var favoritesBool = !showFavorites ? true : item.favourite == showFavorites;
        const mgItemData = item.bodyPart.toUpperCase();
        const mgTextData = muscleGroup.toUpperCase();
        var groupBool = muscleGroup == '' ? true : mgItemData.indexOf(mgTextData) > -1;
        const equipmentData = item.equipment;
        var equipmentBool = false;
        switch(equipment){
          case 0:
            equipmentBool = true
          case 1:
            if (equipmentData == 'body weight')
              equipmentBool = true
          case 2:
            if (equipmentData == 'resistance band' || equipmentData == 'dumbbell' || equipmentData == 'band')
              equipmentBool = true
        }
        return favoritesBool && groupBool && searchBool && equipmentBool;
      })
  }, [showFavorites, muscleGroup, search, exerciseList, equipment])


  const changeFavouriteCallback = (favorite, exercise_id) =>{
    var temp = modifyFavourites;
    if (favorite){
      temp.push(exercise_id);
    } else {
      temp.push(-1*exercise_id);
    }
    setModifyFavourites(temp)
  }
  
  const getNextExercises = () => {
    exerciseStore.dispatch({ type: 'nextPage' })
    const storeData = exerciseStore.getState()
    const data = storeData.exerciseList.slice(0, storeData.pageNum);
    setExerciseList(data)
  }

  const getExerciseList = async () => {
    if (fullExerciseList.length > 0){
      setExerciseList(fullExerciseList.slice(0, 20))
      return;
    }
    const url = 'https://exercisedb.p.rapidapi.com/exercises';
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '6922712921msha18f9f777ed4224p13d611jsnc5f3e21aa4a8',
        'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
      }
    };
    const response = await fetch(url, options);
    if(response.error) console.error(response.error);
    var data = await response.json();
    var initialData = data.slice(0, 20)

    const favouriteRes = await supabase.from('user_exercise_fav').select('exercise_id').eq('user_id', user.id);
    if(favouriteRes.error) console.error(favouriteRes.error.message)
    const favourites = favouriteRes.data.map((ele) => {return ele.exercise_id})

    for (var exercise of initialData){
      if (favourites.includes(exercise.id))
        exercise.favourite = true;
      else
        exercise.favourite = false;
    }
    setExerciseList(initialData)

    var newData = [];
    for (var exercise of data){
      if (favourites.includes(exercise.id))
        exercise.favourite = true;  
      else
        exercise.favourite = false;
      if (exercise.name.length < 30)
        newData.push(exercise)
    }
    fullExerciseList = newData;
    exerciseStore.dispatch({ type: 'fetchedExercises', payload: newData})
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
        for (var exercise of fullExerciseList){
          const favourites = insertData.map((ele) => {return ele.exercise_id})
          if (favourites.includes(exercise.id))
            exercise.favourite = true;
        }
        exerciseStore.dispatch({ type: 'fetchedExercises', payload: fullExerciseList})
      }
      for (const del of deleteData){
        const deleteRes = await supabase.from('user_exercise_fav').delete().eq('user_id', del.user_id).eq('exercise_id', del.exercise_id);
        if(deleteRes.error) console.error(deleteRes.error)
      }
    }
  }, [muscleGroup])

  const renderListHeader = () => (
    <>
      <RadioGroup 
        data={[{label: 'Full Gym', value: 0}, {label: 'No Equipment', value: 1}, {label: 'Dumbells & Band', value: 2}]}
        currentValue={equipment}
        onSelect={(value) => setEquipment(value)} />
      <View style={styles.favouritesContainer}>
        <Text style={styles.text}>{showFavorites?'Show All':'Show favorites'}</Text>
        <TouchableOpacity onPress={() => setShowFavorites(!showFavorites)}>
        <IonIcon name="heart" size={18} color={showFavorites ? '#D4AF37' : 'white'} />
        </TouchableOpacity>
      </View>
      {exerciseList.length === 0 && 
      <View>
        <LoadingCard />
        <LoadingCard />
        <LoadingCard />
      </View>}
    </>
  )

  return (
    <View style={styles.container}>
      <View style={{height: '100%'}}>
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
              maxLength={30}
              onChangeText={(text) => setSearch(text)}
              onSubmitEditing = {() => {setOpenSearch(!openSearch); setSearch('')}}
              value={search}
              cursorColor='white'
              underlineColorAndroid="rgba(0,0,0,0)"
            />
            <TouchableOpacity onPress={() => {setSearch('');setOpenSearch(!openSearch)}} style={styles.closeButton}>
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
        <View style={styles.exerciseContainer}>
          <FlatList 
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            data={filteredExercises}
            renderItem={(exercise) => (
              <ExerciseCard key={exercise.item.id} exercise={exercise.item} changeFavouriteCallback={changeFavouriteCallback}/>
            )}
            ListHeaderComponent={renderListHeader}
            onEndReached={getNextExercises}
            onEndReachedThreshold={0.2}
            keyExtractor={(item, index) => item.id}
          />
          </View>
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
    paddingVertical: 20
  },
  text: {
    color: 'white',
    fontFamily: 'Montserrat-Regular'
  },
  exerciseContainer: {
    width: "100%",
    height: '76%',
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