import {React, useEffect, useState} from 'react';
import {StyleSheet, ImageBackground, View, Text, Dimensions, TouchableOpacity, TextInput} from 'react-native';
import ExerciseCard from '../views/ExerciseCard';
import Dropdown from '../views/Dropdown';
import MenuBar from '../views/MenuBar';
import NavBar from '../views/NavBar';
import { ScrollView } from 'react-native-gesture-handler';
import IonIonIcon from 'react-native-vector-icons/Ionicons';

var screenHeight = Dimensions.get('window').height;
var screenWidth = Dimensions.get('window').width;

const ExerciseGuide = () => {
  var bg = require ('../../assets/media/bg.png');
  overlays = [require('../../assets/media/ig1.jpg')]
  let dropdownItems = [
    {label: 'Chest', value: 'Chest'},
    {label: 'Back', value: 'Back'},
    {label: 'Legs', value: 'Legs'},
    {label: 'Shoulder', value: 'Shoulder'},
    {label: 'Biceps', value: 'Biceps'},
    {label: 'Triceps', value: 'Triceps'},
    {label: 'Abs', value: 'Abs'},
  ];

  const [showFavorites, setShowFavorites] = useState(false);
  const [search, setSearch] = useState('');
  const [openSearch, setOpenSearch] = useState(false)
  const [muscleGroup, setMuscleGroup] = useState(null);
  const [exerciseList, setExerciseList] = useState([
    {id: 2, name: 'Bench Press', requirements: 'Bench, Barbell', image:'https://imgur.com/ZphSDXT.jpg', steps: "Lay back down on a flat bench placing the hands up on the bar using an underhand grip slightly wider than shoulder width apart"},
    {id: 3, name: "Pull Ups", requirements: "Pull-up bar", image:"https://imgur.com/5lMl8ry.jpg", steps: "Place your hands, wider than shoulder width, with palms facing away from you.Lock your legs, and pull yourself up until your face is level with the bar.Go back down to your starting position in a steady motion"},
    {id: 4, name: "Machine Chest Flys", requirements: "Fly Machine", image:"https://imgur.com/tk9wNJL.jpg", steps: "Hold the handles of the machine with elbows bent a little.Push your hands forward, so that your fists meet each other right in front of you.Pause for a second, before going back slowly to your starting position.You should feel your chest contracting towards the center when pushing"},
    {id: 5, name: "Lunges", requirements: "Dumbells", image:"https://imgur.com/DjvMo0F.jpg", steps: "Hold the dumbells in each hand and place one leg forward, and the other slightly behind.With your forward leg completely placed, and back leg on it's toes, bend both knees in a downward motion.Go down until your back knee is close to the ground, then return to starting position"},
    {id: 6, name: "Squats", requirements: "", image:"https://imgur.com/qbEgEqJ.jpg", steps: "Stand with feet at shoulder width.Bend your knees, while pushing your hip backwards until you are in a seated position.Stand back up to the staring position"},
    {id: 7, name: "Tricep Bench Dips", requirements: "Bench", image:"https://imgur.com/SGF0wEP.jpg", steps: "Sit on a bench hands next to your hips.Bring your hips forward with elbows stretched, but not locked.Bend your elbows and lower your hips down, keeping your hips close to the bench.Push back up to reach starting position"},
    {id: 1, name: "Incline Dumbell Press", requirements: "Dumbell, Bench", image:"", steps: "Lie on the bench with one dumbell in each hand, with the bench inclined at 45 degrees.Looking up, push both the dumbells away from you, pushing against the bench.Pause for a minute at full extension, before slowly bring back to starting position."},
  ]);
  const [filteredExerciseList, setFilteredExerciseList] = useState(exerciseList);

  //use effect fetch all exercise list first, and on change muschle group, fetch releavant
  useEffect(() => {
    setFilteredExerciseList(exerciseList);
  }, [muscleGroup]);

  const [headerHeight, setHeaderHeight] = useState('32%');
  const scrollE = (e) => {
    if (e.nativeEvent.contentOffset.y > 50)
      setHeaderHeight('18%')
    if (e.nativeEvent.contentOffset.y < 50)
      setHeaderHeight('32%')
  }

  const searchFilterFunction = (text) => {
    if (text) {
      const newData = exerciseList.filter(function (item) {
        const itemData = item.name? item.name.toUpperCase(): ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredExerciseList(newData);
      setSearch(text);
    } else {
      setFilteredExerciseList(exerciseList);
      setSearch(text);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
          {!openSearch &&
          <TouchableOpacity onPress={() => {setOpenSearch(!openSearch)}} style={styles.searchButton}>
            <IonIonIcon name="ios-search-outline" color="rgba(255,255,255,0.8)" size={24} />
          </TouchableOpacity>
          }
          {openSearch &&
          <TextInput 
            style={styles.textInputStyle} 
            maxLength={10}
            onChangeText={(text) => searchFilterFunction(text)}
            onSubmitEditing = {() => {setOpenSearch(!openSearch); setSearch('')}}
            value={search}
            cursorColor={"rgba(255,255,255,1)"}
            underlineColorAndroid="rgba(0,0,0,0)"
          />
          } 
      </View>
      <View style={[styles.headerContainer, {height: headerHeight}]}>
      <ImageBackground source={overlays[0]} imageStyle={{opacity:0.08}} style={styles.overlay}>
        <View style={{marginTop: "15%"}} >
          <Dropdown value={muscleGroup} setValue={setMuscleGroup} header={"What muscle group would you like to workout today?"} dropdownItems={dropdownItems}/>      
        </View>
        <View style={styles.favouritesContainer}>
          <Text style={styles.text}>Show favorites</Text>
          <TouchableOpacity onPress={() => setShowFavorites(!showFavorites)}>
          <IonIonIcon name="heart" size={18} color={showFavorites ? '#D4AF37' : 'white'} />
          </TouchableOpacity>
        </View>
        <View><Text style={styles.groupHeader}>{muscleGroup}</Text></View>
      </ImageBackground>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} style={[styles.exerciseContainer, {maxHeight: headerHeight=='32%'?'59%':'73%'}]}  onScroll={scrollE} scrollEventThrottle={16}> 
      <ImageBackground source={bg} style={styles.background}>
        {filteredExerciseList.map((exercise) => (
          <ExerciseCard key={exercise.id} exercise={exercise}/>
        ))}
      </ImageBackground>
      </ScrollView>
      <NavBar />
      <MenuBar currentScreenId={0}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: '100%',
    backgroundColor: "black"
  },
  headerContainer: {
    justifyContent: 'space-between',
  },
  favouritesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: '6%'
  },
  text: {
    color: 'white',
    fontFamily: 'Montserrat-Regular'
  },
  exerciseContainer: {
    width: "100%",
    marginTop: '5%',
  },
  groupHeader: {
    color: "white",
    textAlign: "center",
    fontFamily: 'Montserrat-Bold',
    fontSize: 24,
    marginTop: "6%"
  },
  topBar: {
    position: 'absolute',
    width: 0.85*screenWidth,
    alignSelf: 'flex-end',
    height: '7%',
    backgroundColor: "rgba(0,0,0,0)",
    lineHeight: "7%",
    zIndex: 1,
    elevation: 1,
  },
  searchButton: {
    position: 'absolute',
    right: "3%",
    top: "25%",
  },
  textInputStyle: {
    marginTop: '3%',
    marginLeft: 50+0.04*screenWidth,
    fontFamily: 'Montserrat-Regular',
    paddingVertical: 5,
    fontSize: 14,
    textDecorationColor: 'rgba(0,0,0,0)',
    color: 'white',
    backgroundColor: 'rgba(250,250,250,0.1)',
    borderRadius: 20
  }
});

export default ExerciseGuide;

// flicker on scroll(animation), pagination