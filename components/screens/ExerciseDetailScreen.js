import {React, useEffect, useState, useCallback, useMemo} from 'react';
import {
  StyleSheet,
  Image,
  ActivityIndicator,
  ImageBackground,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
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
  const { exerciseIdList, currIdx } = route.params;
  let exerciseId = exerciseIdList[currIdx];
  let buttonsRequired = exerciseIdList.length > 1;

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
    console.log(param)
    // console.log(isLoading);
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

  // useeffect to fetch details based on ID
  const source = useMemo(
    () => ({
      uri: 'https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master_928.m3u8',
    }),
    [exerciseDetails],
  );
  const exerciseSteps = exerciseDetails.steps.split('.');
  const exerciseMistakes = exerciseDetails.mistakes.split('.');
    console.log(currIdx)
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
                  <Text style={{fontFamily: 'Montserrat-Regular', color: 'gold'}}>Previous Exercise</Text>
                </View>
                </TouchableOpacity>
              </View>
              <View style={[styles.controlButtonContainer, {alignSelf: 'flex-end'}]}>
                <TouchableOpacity onPress={()=>{navigation.navigate('ExerciseDetailScreen', 
                    {exerciseIdList: exerciseIdList , currIdx: currIdx+1})
                  }} disabled={currIdx==exerciseIdList.length}>
                <View style={styles.controlButton_}>
                  <Text style={{fontFamily: 'Montserrat-Regular', color: 'gold'}}>Next Exercise</Text>
                </View>
                </TouchableOpacity>
              </View>
              </>
            )}
          </View>
          <View style={styles.contentContainer}>
            <Text style={styles.header}>{exerciseDetails.name}</Text>
            <View style={styles.muscleContainer}>
              <View>
                <Text style={styles.subtext}>
                  {exerciseDetails.requirements}
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
                  source={{uri: exerciseDetails.img_primary}}
                />
                <Image
                  style={styles.mgImage}
                  source={{uri: exerciseDetails.img_secondary}}
                />
              </View>
            </View>
            <View style={styles.steps}>
              <Text style={styles.subHeader}>Steps</Text>
              {exerciseSteps.map((item, index) => (
                <View style={{flexDirection: 'row', marginBottom: '2%'}}>
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
              <Text style={styles.subHeader}>
                Recommended sets for beginners
              </Text>
              <Text style={[styles.subtext, {marginBottom: '2%'}]}>
                3-4 sets of 15 reps initially.
              </Text>
              <Text style={styles.subtext}>
                3 sets of 15, 12, and 8 reps with a progressive overload of
                weights.
              </Text>
            </View>
            <View style={styles.steps}>
              <Text style={styles.subHeader}>Variations</Text>
              <ExerciseCard
                key={exerciseDetails.id}
                exercise={exerciseDetails}
              />
            </View>
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
    marginTop: '2%',
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
    color: 'rgba(212, 175, 55, 0.7)',
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
    backgroundColor: 'rgba(240,240,240,0.2)',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default ExerciseDetailScreen;

// related, onBuffer, fix prev button
