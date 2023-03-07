import {React, useEffect, useState, useCallback, useMemo} from 'react';
import { StyleSheet, Image, ActivityIndicator, ImageBackground, View, Text, Dimensions, TouchableOpacity } from 'react-native';
import ExerciseCard from '../views/ExerciseCard';
import Dropdown from '../views/Dropdown';
import MenuBar from '../views/MenuBar';
import NavBar from '../views/NavBar';
import {ScrollView} from 'react-native-gesture-handler';
import IonIonIcon from 'react-native-vector-icons/Ionicons';
import Video, {LoadError, OnLoadData} from 'react-native-video';
import {useIsFocused} from '@react-navigation/core';
import {useIsForeground} from '../hooks/useIsAppForeground';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../supabaseClient';

var screenHeight = Dimensions.get('window').height;
var screenWidth = Dimensions.get('window').width;

const ExerciseDetailScreen = ({ route }) => {
  const navigation = useNavigation();
  var bg = require('../../assets/media/bg.png');
  overlays = [require('../../assets/media/ig1.jpg')];
  const isForeground = useIsForeground();
  const isScreenFocused = useIsFocused();
  const isVideoPaused = !isForeground || !isScreenFocused;
  const [isLoading, setIsLoading] = useState(false);
  const [variation, setVariation] = useState(null);
  const { exercise, exerciseIdList, currIdx } = route.params;
  let buttonsRequired = exerciseIdList?.length > 1;
  var muscleGroupDetails = [
    {id: 1, primary_img: 'https://imgur.com/td3BZl0.jpg', secondary_img: '', label: 'Chest', value: 'Chest'},
    {id: 2, primary_img: '', secondary_img: '', label: 'Back', value: 'Back'},
    {id: 3, primary_img: '', secondary_img: '', label: 'Legs', value: 'Legs'},
    {id: 4, primary_img: '', secondary_img: '', label: 'Shoulder', value: 'Shoulder'},
    {id: 5, primary_img: '', secondary_img: 'https://imgur.com/flps7Wn.jpg', label: 'Biceps', value: 'Biceps'},
    {id: 6, primary_img: '', secondary_img: '', label: 'Triceps', value: 'Triceps'},
    {id: 7, primary_img: '', secondary_img: '', label: 'Abs', value: 'Abs'},
  ];

  const [exerciseDetails, setExerciseDetails] = useState({
    id: 4,
    name: 'Machine Chest Flys',
    requirements: 'Fly Machine',
    video: 'https://imgur.com/bDqkS2v.gif',
    image: 'https://imgur.com/tk9wNJL.jpg',
    img_primary: 'https://imgur.com/td3BZl0.jpg',
    img_secondary: 'https://imgur.com/flps7Wn.jpg',
    mistakes:
      'Push your chest out and keep your back glued to the seat.Your upper body should not move with your hands',
    variations: 'Dumbell flys on a bench',
    steps:
      'Hold the handles of the machine with elbows bent a little.Push your hands forward, so that your fists meet each other right in front of you.Pause for a second, before going back slowly to your starting position.You should feel your chest contracting towards the center when pushing',
  });
  const onMediaLoadError = useCallback(error => {
    console.log(`failed to load media: ${JSON.stringify(error)}`);
  }, []);

  const onVideoBuffer = param => {
    setIsLoading(param.isBuffering);
  };

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

  const source = useMemo(() => ({ uri: 'https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master_928.m3u8' }), [exerciseDetails]);
  const exerciseSteps = exercise.steps.split('.');
  const exerciseMistakes = exercise.mistakes.split('.');

  const getDetails = async () => {
    const variationRes = await supabase.from('exercises').select().eq('id', exercise.variation_id);
    setVariation(variationRes.data[0])
  }

  useEffect(() => {
    getDetails();
  }, [exercise])

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.exerciseContainer}>
        <ImageBackground source={bg} imageStyle={{opacity: 0.4}}>
          <View style={{height: 0.5*screenHeight}}>
            <Video
              source={source}
              style={{height: '100%'}}
              paused={isVideoPaused}
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
            />
            {loadingView()}
            {buttonsRequired && (
              <>
              <View style={styles.controlButtonContainer}>
                <TouchableOpacity onPress={()=>{navigation.navigate('ExerciseDetailScreen', 
                    {exerciseIdList: exerciseIdList , currIdx: currIdx-1})
                  }} disabled={currIdx==0}>
                <View style={styles.controlButton_}>
                  <Text style={{fontFamily: 'Montserrat-Regular', color: '#D4AF37'}}>Previous Exercise</Text>
                </View>
                </TouchableOpacity>
              </View>
              <View style={[styles.controlButtonContainer, {alignSelf: 'flex-end'}]}>
                <TouchableOpacity onPress={()=>{navigation.navigate('ExerciseDetailScreen', 
                    {exerciseIdList: exerciseIdList , currIdx: currIdx+1})
                  }} disabled={currIdx==exerciseIdList.length}>
                <View style={styles.controlButton_}>
                  <Text style={{fontFamily: 'Montserrat-Regular', color: '#D4AF37'}}>Next Exercise</Text>
                </View>
                </TouchableOpacity>
              </View>
              </>
            )}
          </View>
          <View style={styles.contentContainer}>
            <Text style={styles.header}>{exercise.exercise_name}</Text>
            <View style={styles.muscleContainer}>
              <View>
                <Text style={styles.subtext}>
                  {exercise.requirements}
                </Text>
                <View style={{flexDirection: 'row', marginTop: '5%'}}>
                  <Text
                    style={[
                      styles.subtext,
                      {color: '#CD3B3C', marginRight: '5%'},
                    ]}>
                    Primary
                  </Text>
                  <Text style={[styles.subtext, {color: '#A06B6F'}]}>
                    Secondary
                  </Text>
                </View>
              </View>
              <View style={styles.mgContainer}>
                <Image
                  style={styles.mgImage}
                  source={{uri: muscleGroupDetails.find((ele) => ele.label==exercise.muscle_group)?.primary_img}}
                />
                <Image
                  style={styles.mgImage}
                  source={{uri: muscleGroupDetails.find((ele) => ele.label==exercise.secondary_mg)?.secondary_img}}
                />
              </View>
            </View>
            <View style={styles.steps}>
              <Text style={styles.subHeader}>Steps</Text>
              {exerciseSteps.map((item, index) => (
                <View key={index} style={{flexDirection: 'row', marginBottom: '2%'}}>
                  <Text style={styles.counter}>{index + 1}</Text>
                  <Text style={styles.subtext}>{item}.</Text>
                </View>
              ))}
            </View>
            <View style={styles.steps}>
              <Text style={styles.subHeader}>Common Mistakes to Avoid</Text>
              {exerciseMistakes.map((item, index) => (
                <View key={index} style={{flexDirection: 'row', marginBottom: '2%'}}>
                  <Text style={styles.counter}>{index + 1}</Text>
                  <Text style={styles.subtext}>{item}.</Text>
                </View>
              ))}
            </View>
            <View style={styles.steps}>
              <Text style={styles.subHeader}>Recommended sets for beginners</Text>
              <Text style={styles.subtext}>
                {exercise.recommended_sets}
              </Text>
            </View>
            {variation && 
            <View style={styles.steps}>
              <Text style={styles.subHeader}>Variations</Text>
              <ExerciseCard key={variation.id} exercise={variation} />
            </View>}
          </View>
        </ImageBackground>
      </ScrollView>
      <NavBar />
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
    marginVertical: '2%',
  },
  header: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Montserrat-Bold',
    fontSize: 28,
  },
  subHeader: {
    color: 'white',
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    marginBottom: '3%',
  },
  muscleContainer: {
    marginTop: '5%',
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
    marginLeft: '2%',
  },
  steps: {
    marginTop: '5%',
    paddingHorizontal: '4%',
  },
  counter: {
    color: '#D4AF37',
    position: 'relative',
    fontSize: 20,
  },
  controlButtonContainer: {
    position: 'absolute',
    width: '40%',
    top: '90%',
  },
  controlButton_: {
    padding: 10,
    backgroundColor: 'rgba(30,30,30,0.8)',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default ExerciseDetailScreen;

// related, onBuffer, fix prev button
