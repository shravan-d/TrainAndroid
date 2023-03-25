import { React, useState, useCallback, useMemo, useEffect, useRef } from 'react';
import {StyleSheet, Image, Dimensions, TouchableOpacity, Alert, PermissionsAndroid, ActivityIndicator, View, Text} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import { useNavigation } from '@react-navigation/native';
import Video from 'react-native-video';
import { useIsFocused } from '@react-navigation/core';
import { useIsForeground } from '../hooks/useIsAppForeground';
import DraggableText from '../views/DraggableText';
import {GestureHandlerRootView} from 'react-native-gesture-handler'
import { TextInput } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';

var screenHeight = Dimensions.get('window').height;

const requestSavePermission = async () => {
  if (Platform.OS !== 'android') return true;
  const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
  if (permission == null) return false;
  let hasPermission = await PermissionsAndroid.check(permission);
  if (!hasPermission) {
    const permissionRequestResult = await PermissionsAndroid.request(permission);
    hasPermission = permissionRequestResult === 'granted';
  } 
  return hasPermission;
};

const MediaScreen = ({ route }) => {
  const navigation = useNavigation();
  var { path, type, send, shots } = route.params;
    
  const [hasMediaLoaded, setHasMediaLoaded] = useState(false);
  const [savingState, setSavingState] = useState('none');
  const isForeground = useIsForeground();
  const isScreenFocused = useIsFocused();
  const isVideoPaused = !isForeground || !isScreenFocused;
  const [index, setIndex] = useState(0);
  const [source, setSource] = useState({ uri: `file://${path}` });
  const [mediaType, setMediaType] = useState(type);
  const [text, setText] = useState(!send?shots[0].contentText:null);
  const positionY = useSharedValue(!send?shots[0].positionY:500);
  
  const onSavePressed = useCallback(async () => {
    try {
      setSavingState('saving');
      const hasPermission = await requestSavePermission();
      if (!hasPermission) {
        Alert.alert('Permission denied!', 'Vision Camera does not have permission to save the media to your camera roll.');
        return;
      }
      else{
        await CameraRoll.save(`file://${path}`, {
          type: type,
          album: 'Train'
        });
        setSavingState('saved');
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : JSON.stringify(e);
      setSavingState('none');
      Alert.alert('Failed to save!', `An unexpected error occured while trying to save your ${type}. ${message}`);
    }
  }, [path, type]);

  const sendCapture = () => {
    var data = {
      path: path,
      type: type,
      sendCapture: true
    }
    if(text!=null){
      data.contentText = text,
      data.positionY = positionY.value
    }
    navigation.navigate('ContactScreen', data);
  }
  const onMediaLoadEnd = useCallback(() => {
    setHasMediaLoaded(true);
  }, []);

  const onMediaLoadError = useCallback((error) => {
    console.log(`failed to load media: ${JSON.stringify(error)}`);
  }, []);

  useEffect(() => {
    if (!send) {
      setSource({ uri: shots[index].url })
      setMediaType( shots[index].url.includes('.mp4')?'video':'photo' )
      setText(shots[index].contentText);
      positionY.value = shots[index].positionY;
    }
  }, [index])
  
  const screenStyle = useMemo(() => ({ opacity: hasMediaLoaded ? 1 : 0, backgroundColor: 'black' }), [hasMediaLoaded]);

  return (
    <GestureHandlerRootView style={[styles.container, screenStyle]}>
        {mediaType === 'photo' && (
        <Image source={source} style={StyleSheet.absoluteFill} resizeMode="cover" onLoadEnd={onMediaLoadEnd} />
        )}
        {mediaType === 'video' && (
        <Video
          source={source}
          style={StyleSheet.absoluteFill}
          paused={isVideoPaused}
          resizeMode="cover"
          posterResizeMode="cover"
          allowsExternalPlayback={false}
          automaticallyWaitsToMinimizeStalling={false}
          disableFocus={true}
          repeat={true}
          useTextureView={false}
          controls={false}
          playWhenInactive={true}
          ignoreSilentSwitch="ignore"
          onReadyForDisplay={onMediaLoadEnd}
          onError={onMediaLoadError}
        />
        )}
        {text !== null && 
        <DraggableText style={{}} initialX={-1} initialY={positionY.value} positionY={positionY} disabled={!send}>
          {send && <View style={{width: 60, height: 12, backgroundColor: 'rgba(0, 0, 0, 0.8)', borderTopEndRadius: 5, borderTopStartRadius: 5, alignSelf: 'flex-end'}}>
          </View>}
          <View style={styles.textContainer} >
          <TextInput 
            style={styles.textInputStyle}
            onChangeText={(text) => setText(text)}
            value={text}
            cursorColor='white'
            multiline={true}
            autoFocus={send}
            textAlign='center'
            disabled={!send}
            />
          </View>
        </DraggableText>}
        {send &&
        <>
        <TouchableOpacity onPress={() => {setText(text==null?'':null)}} style={styles.textButton}>
          <IonIcon name="md-pencil-outline"  color="rgba(255,255,255,0.8)" size={30} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {sendCapture()}} style={styles.sendButton}><IonIcon name="send-sharp" color="rgba(255,255,255,0.8)" size={30} /></TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={onSavePressed} disabled={savingState !== 'none'}>
          <>
          {savingState === 'none' && <IonIcon name="download-outline" size={30} color="rgba(255,255,255,0.8)" />}
          {savingState === 'saved' && <IonIcon name="ios-checkmark" size={30} color="rgba(255,255,255,0.8)" />}
          {savingState === 'saving' && <ActivityIndicator color="rgba(250,250,250,0.8)" />}
          </>
        </TouchableOpacity>
        </>}
        {!send && 
        <>
        {index != 0 &&
        <TouchableOpacity onPress={() => {setIndex(index-1)}} style={[styles.nextButton, {left: '5%'}]}>
          <IonIcon name="caret-back-outline"  color="rgba(255,255,255,0.8)" size={30} />
        </TouchableOpacity>}
        {index != shots.length-1 && 
        <TouchableOpacity onPress={() => {setIndex(index+1)}} style={[styles.nextButton, {right: '5%'}]}>
          <IonIcon name="caret-forward-outline"  color="rgba(255,255,255,0.8)" size={30} />
        </TouchableOpacity>}
        </>}
        <TouchableOpacity onPress={() => {navigation.goBack()}} style={styles.closeButton}>
          <IonIcon name="close-outline"  color="rgba(255,255,255,0.8)" size={30} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {navigation.navigate('CameraScreen')}} style={styles.retakeButton}><></></TouchableOpacity>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    minHeight: screenHeight
  },
  textContainer: {
    width: '100%', 
    backgroundColor: 'rgba(0, 0, 0, 0.8)', 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  sendButton: {
    position: 'absolute',
    bottom: 50,
    right: 30
  },
  closeButton: {
    position: 'absolute',
    top: 30,
    right: 30
  },
  saveButton: {
    position: 'absolute',
    bottom: 50,
    left: 30
  },
  nextButton: {
    position: 'absolute',
    bottom: "50%",
  },
  textButton: {
    position: 'absolute',
    bottom: 150,
    right: 30
  },
  retakeButton: {
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
  textInputStyle: {
    fontFamily: 'Montserrat-Regular',
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    paddingVertical: 0,
    paddingHorizontal: 2,
  }
});

export default MediaScreen;