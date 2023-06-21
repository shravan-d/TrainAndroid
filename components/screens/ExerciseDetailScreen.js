import {React, useEffect, useState, useCallback, useMemo} from 'react';
import { StyleSheet, Image, ActivityIndicator, ImageBackground, View, Text, Dimensions, TouchableOpacity, Pressable } from 'react-native';
import ExerciseCard from '../views/ExerciseCard';
import MenuBar from '../views/MenuBar';
import NavBar from '../views/NavBar';
import {ScrollView} from 'react-native-gesture-handler';
import Video from 'react-native-video';
import {useIsFocused} from '@react-navigation/core';
import {useIsForeground} from '../hooks/useIsAppForeground';
import { supabase } from '../../supabaseClient';
import IonIcon from 'react-native-vector-icons/Ionicons';

var screenHeight = Dimensions.get('window').height;
var screenWidth = Dimensions.get('window').width;

const ExerciseDetailScreen = ({ route }) => {
  var bg = require('../../assets/media/bg.png');
  const isForeground = useIsForeground();
  const isScreenFocused = useIsFocused();
  const isVideoPaused = !isForeground || !isScreenFocused;
  var muscleGroupDetails = [
    {id: 1, primary_img: 'https://imgur.com/td3BZl0.jpg', secondary_img: 'https://imgur.com/td3BZl0.jpg', label: 'Chest', value: 'Chest'},
    {id: 2, primary_img: 'https://imgur.com/td3BZl0.jpg', secondary_img: 'https://imgur.com/td3BZl0.jpg', label: 'Back', value: 'Back'},
    {id: 3, primary_img: 'https://imgur.com/td3BZl0.jpg', secondary_img: 'https://imgur.com/td3BZl0.jpg', label: 'Legs', value: 'Legs'},
    {id: 4, primary_img: 'https://imgur.com/td3BZl0.jpg', secondary_img: 'https://imgur.com/td3BZl0.jpg', label: 'Shoulder', value: 'Shoulder'},
    {id: 5, primary_img: 'https://imgur.com/td3BZl0.jpg', secondary_img: 'https://imgur.com/flps7Wn.jpg', label: 'Biceps', value: 'Biceps'},
    {id: 6, primary_img: 'https://imgur.com/td3BZl0.jpg', secondary_img: 'https://imgur.com/td3BZl0.jpg', label: 'Triceps', value: 'Triceps'},
    {id: 7, primary_img: 'https://imgur.com/td3BZl0.jpg', secondary_img: 'https://imgur.com/td3BZl0.jpg', label: 'Abs', value: 'Abs'},
  ];
  const { exercise, exerciseList } = route.params;

  const [isLoading, setIsLoading] = useState(false);
  const [variation, setVariation] = useState(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const currentExercise = useMemo( () => {
    if (exercise!=null) return exercise;
    return exerciseList[index];
  }, [index])

  const loadingView = () => {
    if (isLoading)
      return (
        <ActivityIndicator
          color="rgba(250,250,250,0.8)"
          size="large"
          style={{
            position: 'absolute',
            alignSelf: 'center',
            top: '45%'
          }}
        />
      );
    else return <View />;
  };

  const getDetails = async () => {
    const detailRes = await supabase.from('exercises').select().eq('exercise_id', currentExercise.id);
    if (detailRes.error) console.error(detailRes.error)
    setExerciseDetails({
      steps: detailRes.data[0].steps.split('.'), 
      mistakes: detailRes.data[0].mistakes?.split('.'), 
      recommended_sets: detailRes.data[0].recommended_sets?.split('.')})
    if (!currentExercise.variation_id) return;
    const variationRes = await supabase.from('exercises').select().eq('id', currentExercise.variation_id);
    setVariation(variationRes.data[0])
  }

  useEffect(() => {
    getDetails();
  }, [currentExercise])

  var buttonsRequired = exerciseList?.length > 1;
  const [exerciseDetails, setExerciseDetails] = useState({steps: [], mistakes: [], recommended_sets: []});
  const source = useMemo(() => ({ uri: currentExercise.gifUrl }), [currentExercise]);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.exerciseContainer}>
        <ImageBackground source={bg} imageStyle={{opacity: 0.4}}>
          <View style={{height: 0.5*screenHeight}}>
            {/* <Video
              source={source}
              style={{height: '100%'}}
              paused={isVideoPaused||paused}
              resizeMode="cover"
              muted={true}
              posterResizeMode="cover"
              allowsExternalPlayback={false}
              automaticallyWaitsToMinimizeStalling={false}
              disableFocus={true}
              repeat={true}
              useTextureView={false}
              controls={false}
              playWhenInactive={true}
              ignoreSilentSwitch="ignore"
              onBuffer={onVideoBuffer}
              onError={onMediaLoadError}
            /> */}
            <Image 
              source={source}  
              style={{height: '100%'}}
            />
            {loadingView()}
            {buttonsRequired && (
              <>
              {index != 0 &&
              <View style={styles.controlButtonContainer}>
                <Pressable onPress={()=>setIndex(index-1)}>
                <View style={styles.controlButton_}>
                  <Text style={{fontFamily: 'Montserrat-Regular', color: '#D4AF37'}}>Previous</Text>
                </View>
                </Pressable>
              </View>}
              {index != exerciseList.length-1 && 
              <View style={[styles.controlButtonContainer, {alignSelf: 'flex-end'}]}>
                <Pressable onPress={()=>setIndex(index+1)}>
                <View style={styles.controlButton_}>
                  <Text style={{fontFamily: 'Montserrat-Regular', color: '#D4AF37'}}>Next</Text>
                </View>
                </Pressable>
              </View>}
              </>
            )}
            {/* <View style={styles.pauseButton}>
              <Pressable onPress={()=>setPaused(!paused)}>
              {!paused && <IonIcon name="pause-outline" size={18} color="white" />}
              {paused && <IonIcon name="play" size={18} color="white" />}
              </Pressable>
            </View> */}
          </View>
          <View style={styles.contentContainer}>
            <Text style={styles.header}>{currentExercise.name}</Text>
            <View style={styles.muscleContainer}>
              <View>
                <Text style={[styles.subtext, {textTransform: 'capitalize'}]}>
                  {/* {currentExercise.equipment?currentExercise.equipment:'No Equipment Required'} */}
                  {currentExercise.target}
                </Text>
                <View style={{flexDirection: 'row', marginTop: '5%'}}>
                  <Text style={[styles.subtext, {color: '#CD3B3C', marginRight: '5%'} ]}>Primary</Text>
                  {muscleGroupDetails.find((ele) => ele.label==currentExercise.secondary_mg) &&
                  <Text style={[styles.subtext, {color: '#A06B6F'}]}>Secondary</Text>}
                </View>
              </View>
              <View style={styles.mgContainer}>
                <Image
                  style={styles.mgImage}
                  source={{uri: muscleGroupDetails.find((ele) => ele.label==currentExercise.bodyPart)?.primary_img}}
                />
                <Image
                  style={styles.mgImage}
                  source={{uri: muscleGroupDetails.find((ele) => ele.label==currentExercise.bodyPart)?.secondary_img}}
                />
              </View>
            </View>
            {exerciseDetails.steps &&
            <View style={styles.steps}>
              <Text style={styles.subHeader}>Steps</Text>
              {exerciseDetails.steps.map((item, index) => (
                <View key={index} style={{flexDirection: 'row', marginBottom: '2%'}}>
                  <Text style={styles.counter}>{index + 1}</Text>
                  <Text style={styles.subtext}>{item}.</Text>
                </View>
              ))}
            </View> }
            {exerciseDetails.mistakes &&
            <View style={styles.steps}>
              <Text style={styles.subHeader}>Common Mistakes to Avoid</Text>
              {exerciseDetails.mistakes.map((item, index) => (
                <View key={index} style={{flexDirection: 'row', marginBottom: '2%'}}>
                  <Text style={styles.counter}>{index + 1}</Text>
                  <Text style={styles.subtext}>{item}.</Text>
                </View>
              ))}
            </View>}
            {exerciseDetails.recommended_sets &&
            <View style={styles.steps}>
              <Text style={styles.subHeader}>Recommended sets for beginners</Text>
              <Text style={styles.subtext}>
                {exerciseDetails.recommended_sets}
              </Text>
            </View>}
            {variation && 
            <View style={styles.steps}>
              <Text style={styles.subHeader}>Variations</Text>
              <ExerciseCard key={variation.id} exercise={variation} />
            </View>}
          </View>
        </ImageBackground>
      </ScrollView>
      <MenuBar currentScreenId={0} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
  },
  exerciseContainer: {
    width: '100%',
    maxHeight: '94%'
  },
  contentContainer: {
    marginVertical: 10,
  },
  header: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Montserrat-Bold',
    fontSize: 28,
    textTransform: 'capitalize'
  },
  subHeader: {
    color: 'white',
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    marginBottom: 10,
  },
  muscleContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '3%',
    alignItems: 'center',
  },
  mgContainer: {
    flexDirection: 'row',
  },
  mgImage: {
    width: 55,
    height: 55,
  },
  subtext: {
    color: 'white',
    fontFamily: 'Montserrat-Regular',
    marginLeft: 8,
  },
  steps: {
    marginTop: 10,
    paddingHorizontal: 15,
  },
  counter: {
    color: '#D4AF37',
    position: 'relative',
    fontSize: 20,
  },
  controlButtonContainer: {
    position: 'absolute',
    width: '30%',
    bottom: 0
  },
  controlButton_: {
    backgroundColor: 'rgba(30,30,30,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10
  },
  pauseButton: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    padding: 10
  }
});

export default ExerciseDetailScreen;
