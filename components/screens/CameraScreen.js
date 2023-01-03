import { React, useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {StyleSheet, View, Text, TouchableHighlight, TouchableOpacity} from 'react-native';
import { useCameraDevices, Camera } from 'react-native-vision-camera';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useIsForeground } from '../hooks/useIsAppForeground';
import IonIcon from 'react-native-vector-icons/Ionicons';

const CameraScreen = () => {
  const [camPerm, setCamPerm] = useState('not-determined');
  const navigation = useNavigation();
//   const [microphonePermission, setMicrophonePermission] = useState();

  const isAppForeground = useIsForeground()
  const isFocused = useIsFocused()
  const isActive = isAppForeground && isFocused
  const [isRecording, setIsRecording] = useState(false);
  const [cameraPos, setCameraPos] = useState(true);
  const [flash, setFlash] = useState('off');

  const photoOptions = useMemo(
    () => ({
      photoCodec: 'jpeg',
      qualityPrioritization: 'speed',
      flash: flash,
      quality: 90,
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
    } catch (e) {
      console.error('failed to stop recording!', e);
    }
  }, [camera]);

  const onMediaCaptured = useCallback(
    (media, type) => {
      navigation.navigate('MediaScreen', {
        path: media.path,
        type: type,
      });
    },
    [navigation],
  );

  const getPermission = async () => {
    let status = await Camera.getCameraPermissionStatus();
    if (status !== 'authorized') {
        await Camera.requestCameraPermission();
    }
    setCamPerm('authorized');
  }   

  const devices = useCameraDevices()
  const device = cameraPos? devices.back : devices.front
  const camera = useRef()

  useEffect(() => { 
    getPermission();
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

  return (
    <View style={styles.container} onStartShouldSetResponder={(evt) => onDoublePress()}>
        {camPerm ==='authorized' && device != null &&
        <>
        <Camera
            ref={camera}
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={isActive}
            photo={true}
            video={true}
        />
        <TouchableOpacity disabled={!isActive} onLongPress={()=>{startRecording()}} onPressOut={()=>(isRecording?stopRecording():{})} onPress={() => {takePhoto()}} style={[styles.captureButton, isRecording?{backgroundColor: "rgba(250,0,0,0.7)"}:{}]}><></></TouchableOpacity>
        <TouchableHighlight onPress={() => {setCameraPos(!cameraPos)}} style={styles.revButton}><IonIcon name="camera-reverse-outline" color="rgba(255,255,255,0.8)" size={30} /></TouchableHighlight>
        <TouchableHighlight onPress={() => {setFlash(flash=='off'?'on':'off')}} style={styles.flashButton}><IonIcon name="ios-flash-outline"  color="rgba(255,255,255,0.8)" size={30} /></TouchableHighlight>
        </>
        }
    </View>
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
    bottom: "5%"
  },
  flashButton: {
    position: 'absolute',
    bottom: "5%",
    right: "5%"
  },
  revButton: {
    position: 'absolute',
    bottom: "5%",
    left: "5%"
  }
});

export default CameraScreen;

// zoom, filters