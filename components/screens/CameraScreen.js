import { React, useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Dimensions} from 'react-native';
import { useCameraDevices, Camera } from 'react-native-vision-camera';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useIsForeground } from '../hooks/useIsAppForeground';
import IonIonIcon from 'react-native-vector-icons/Ionicons';
import Reanimated, { interpolate, Extrapolate, useSharedValue, useAnimatedProps, useAnimatedStyle, useAnimatedGestureHandler, withTiming } from 'react-native-reanimated';
import Animated from 'react-native-reanimated';
import {GestureHandlerRootView} from 'react-native-gesture-handler'
import { PanGestureHandler } from 'react-native-gesture-handler';

const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera)
Reanimated.addWhitelistedNativeProps({
  zoom: true,
})
const MAX_ZOOM = 3;
const zoomBarHeight = 120;
var screenHeight = Dimensions.get('window').height;
var screenWidth = Dimensions.get('window').width;

const CameraScreen = () => {
  const [camPerm, setCamPerm] = useState('not-determined');
  const navigation = useNavigation();
  const [microphonePermission, setMicrophonePermission] = useState('not-determined');
  const [recordAudio, setRecordAudio] = useState(false);
  const isAppForeground = useIsForeground()
  const isFocused = useIsFocused()
  const isActive = isAppForeground && isFocused
  const [isRecording, setIsRecording] = useState(false);
  const [cameraPos, setCameraPos] = useState(true);
  const [flash, setFlash] = useState('off');
  const [videoTime, setVideoTime] = useState(0);
  const [focusPos, setFocusPos] = useState({x: -1, y: -1, show: false});

  const photoOptions = useMemo(
    () => ({
      photoCodec: 'jpeg',
      qualityPrioritization: 'quality',
      flash: flash,
      quality: 100,
      skipMetadata: true,
    }),
    [flash],
  );
  const takePhoto = useCallback(async () => {
    try {
      if (camera.current == null) throw new Error('Camera ref is null!');
      const photo = await camera.current.takePhoto(photoOptions);
      onMediaCaptured(photo, 'photo');
    } catch (e) {
      console.error('Failed to take photo!', e);
    }
  }, [camera, photoOptions]);

  const startRecording = useCallback(() => {
    try {
      increment();
      if (camera.current == null) throw new Error('Camera ref is null!');
      camera.current.startRecording({
        flash: flash,
        onRecordingError: (error) => {
          console.error('Recording failed!', error);
          setIsRecording(false);
        },
        onRecordingFinished: (video) => {
          console.log(`Recording successfully finished! ${video.path}`);
          onMediaCaptured(video, 'video');
          setIsRecording(false);
        },
      });
      setIsRecording(true);
    } catch (e) {
      console.error('failed to start recording!', e, 'camera');
    }
  }, [camera, flash, onMediaCaptured, isRecording]);

  const stopRecording = useCallback(async () => {
    try {
        if (camera.current == null) throw new Error('Camera ref is null!');
        await camera.current.stopRecording();
        setIsRecording(false);
        clearInterval(timer.current);
        setTimeout(() => {setVideoTime(0)}, 1000);
    } catch (e) {
      console.error('failed to stop recording!', e);
    }
  }, [camera]);

  const timer = useRef(null);
  const increment = () => {
    var secondsPassed = 0;
    timer.current = setInterval(() => {
      setVideoTime(prev => prev + 1)
      secondsPassed += 1;
      if (secondsPassed == 10)
        stopRecording()
    }, 1000);
  }

  const onMediaCaptured = useCallback(
    (media, type) => {
      navigation.navigate('MediaScreen', {
        path: media.path,
        type: type,
        send: true
      });
    },
    [navigation],
  );

  const getCamPermission = async () => {
    let status = await Camera.getCameraPermissionStatus();
    if (status !== 'authorized') {
        await Camera.requestCameraPermission();
    }
    setCamPerm(status);
  }   

  const getMicPermission = async () => {
    let status = await Camera.getMicrophonePermissionStatus();
    if (status !== 'authorized') {
        await Camera.requestMicrophonePermission();
    }
    setMicrophonePermission(status);
  } 

  const devices = useCameraDevices()
  const device = cameraPos? devices.back : devices.front
  const camera = useRef()

  useEffect(() => { 
    getCamPermission();
    getMicPermission();
  }, []);

  let lastPress = 0;
  const onDoublePress = () => {
    const time = new Date().getTime();
    const delta = time - lastPress;
    const DOUBLE_PRESS_DELAY = 400;
    if (delta < DOUBLE_PRESS_DELAY) {
        setCameraPos(!cameraPos);
    }
    lastPress = time;
  };

  const y = useSharedValue(zoomBarHeight-15);
  const zoom = useSharedValue(0)
  const height = useSharedValue(1);
  
  const gestureHandler = useAnimatedGestureHandler({
      onStart: (_, ctx) => {
          ctx.startY = y.value;
      },
      onActive: (event, ctx) => {
          y.value = Math.min(zoomBarHeight-15, Math.max(0, ctx.startY + event.translationY));
          height.value = interpolate(y.value, [0, zoomBarHeight-15], [0, 1], Extrapolate.CLAMP);
          zoom.value = interpolate(1 - height.value, [0, 1], [1, MAX_ZOOM], Extrapolate.CLAMP);
      },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return { transform: [{ translateY: y.value }] };
  });

  const animatedHeightStyle = useAnimatedStyle(() => {
    return { transform: [{ scaleY: height.value }, {translateY: zoomBarHeight / 2}] };
  });

  const animatedHeightStyle2 = useAnimatedStyle(() => {
    return { transform: [{ scaleY: 1 - height.value }, {translateY: -zoomBarHeight / 2}] };
  });

  const animatedProps = useAnimatedProps(
    () => ({ zoom: zoom.value }),
    [zoom]
  )

  const focusCamera = async (event) => {
    if(focusPos.show) return;
    if(100 * event.pageX / screenWidth > 80 && 100 * event.pageY / screenHeight > 55) return;
    if(100 * event.pageY / screenHeight > 85) return;
    setFocusPos({show:true, x: event.pageX, y: event.pageY})
    var timeout, response;
    const timeoutPromise = new Promise((resolve, reject) => {
      timeout = setTimeout(() => {
        resolve(false);
      }, 1000);
    });
    try{
      response = await Promise.race([camera.current.focus({ x: event.pageX, y: event.pageY }), timeoutPromise]);
    } catch (e) {
      
    } finally {
      if(timeout){ 
        clearTimeout(timeout);
      }
      console.log(response)
      setFocusPos({show: false})
    }
  }

  return (
    <GestureHandlerRootView style={styles.container} onStartShouldSetResponder={() => onDoublePress()} 
      onTouchStart={(event)=>{focusCamera(event.nativeEvent)}}>
        {camPerm ==='authorized' && device != null &&
        <>
        <ReanimatedCamera
          ref={camera}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={isActive}
          photo={true}
          video={true}
          audio={recordAudio&&(microphonePermission==='authorized'?true:false)}
          animatedProps={animatedProps}
        />
        <View style={styles.zoomContainer}>
          <Animated.View style={[animatedHeightStyle, {width: 2, height: zoomBarHeight-15, backgroundColor: 'white', borderRadius: 5, position: 'absolute', top: -zoomBarHeight/2}]}></Animated.View>
          <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={[animatedStyle, styles.zoomLever]}>
          </Animated.View>
          </PanGestureHandler>
          <Animated.View style={[animatedHeightStyle2, {marginTop: 15, width: 2, height: zoomBarHeight-15, backgroundColor: 'white', borderRadius: 5, position: 'absolute', top: zoomBarHeight/2}]}></Animated.View>
         </View>
        {focusPos.show && 
        <View 
        style={[styles.focusBox, {top:focusPos.y, left: focusPos.x}]}>
        </View>
        }
        <TouchableOpacity disabled={!isActive} onLongPress={()=>{startRecording()}} onPressOut={()=>(isRecording?stopRecording():{})} onPress={() => {takePhoto()}} style={[styles.captureButton, isRecording?{backgroundColor: "rgba(250,0,0,0.7)"}:{}]}><></></TouchableOpacity>
        <TouchableOpacity onPress={() => {setCameraPos(!cameraPos)}} style={styles.revButton}><IonIonIcon name="camera-reverse-outline" color="rgba(255,255,255,0.8)" size={30} /></TouchableOpacity>
        {flash=='off'&&<TouchableOpacity onPress={() => {setFlash(flash=='off'?'on':'off')}} style={styles.flashButton}><IonIonIcon name="ios-flash-outline"  color="rgba(255,255,255,0.8)" size={30} /></TouchableOpacity>}
        {flash=='on'&&<TouchableOpacity onPress={() => {setFlash(flash=='off'?'on':'off')}} style={styles.flashButton}><IonIonIcon name="ios-flash"  color="rgba(255,255,255,0.8)" size={30} /></TouchableOpacity>}
        {recordAudio && <TouchableOpacity onPress={() => {setRecordAudio(!recordAudio)}} style={styles.volumeButton}><IonIonIcon name="ios-volume-off"  color="rgba(255,255,255,0.8)" size={30} /></TouchableOpacity>}
        {!recordAudio && <TouchableOpacity onPress={() => {setRecordAudio(!recordAudio)}} style={styles.volumeButton}><IonIonIcon name="ios-volume-off-outline"  color="rgba(255,255,255,0.8)" size={30} /></TouchableOpacity>}
        {isRecording && <View style={styles.timeContainer}><Text style={{fontSize: 20, fontFamily: 'Montserrat-Italic'}}>{videoTime}</Text></View>}       
        </>
        }
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
  captureButton: {
    width: 60,
    height: 60,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderColor: "rgba(255,255,255,0.5)",
    borderWidth: 4,
    borderRadius: 60,
    alignSelf: 'center',
    position: 'absolute',
    bottom: 50
  },
  flashButton: {
    position: 'absolute',
    bottom: 50,
    right: 30
  },
  revButton: {
    position: 'absolute',
    bottom: 50,
    left: 30
  },
  volumeButton: {
    position: 'absolute',
    bottom: 150,
    right: 30
  },
  timeContainer: {
    position: 'absolute',
    top: 50,
    right: 30,
    width: 30,
    height: 30,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderColor: "rgba(255,255,255,0.5)",
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3
  },
  zoomContainer: {
    height: zoomBarHeight,
    width: 30,
    position: 'absolute',
    bottom: 250,
    right: 30,
    alignItems: 'center',
  },
  zoomLever: {
    width: 20,
    height: 15, 
    borderRadius: 5,
    borderColor: 'rgba(220, 220, 220, 1)',
    borderWidth: 2, 
    backgroundColor: 'rgba(0,0,0,0)',
    position: 'absolute'
  },
  focusBox: {
    position: 'absolute', 
    width: 30, 
    height: 30, 
    borderRadius: 50,
    borderColor: 'rgba(220, 220, 220, 1)', 
    borderWidth: 2, 
    backgroundColor:'rgba(0,0,0,0)'
  }
});

export default CameraScreen;