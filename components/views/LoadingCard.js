import React, {useRef, useEffect} from "react"
import {Animated, Easing, View, StyleSheet } from 'react-native';

const LoadingRect = (props) => {
  const pulseAnim = useRef(new Animated.Value(0)).current;
 
  useEffect(() => {
    const sharedAnimationConfig = {
      duration: 1500,
      useNativeDriver: true,
    };
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          ...sharedAnimationConfig,
          toValue: 1,
          easing: Easing.out(Easing.ease),
        }),
        Animated.timing(pulseAnim, {
          ...sharedAnimationConfig,
          toValue: 0,
          easing: Easing.in(Easing.ease),
        }),
      ])
    ).start();
 
    return () => {
      pulseAnim.stopAnimation();
    };
  }, []);
 
  const opacityAnim = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.05, 0.25],
  });

  return (
    <Animated.View
      style={[
        { width: props.width, height: props.height, backgroundColor: '#BAC5CB', marginBottom: 10, borderRadius: props.borderRadius },
        { opacity: opacityAnim },
        props.style,
      ]}
    />
  );
};
 
const LoadingCard = () => {
  return (
    <View style={[styles.smallCard, {backgroundColor: "white"}]}>
      <View style={styles.cardContent}>
        <View style={[styles.cardImage, {width: '25%'}]}>
          <LoadingRect width={'100%'} height={'100%'} />
        </View>
        <View style={styles.cardText}>
          <LoadingRect width={'100%'} height={10} />
          <LoadingRect width={'60%'} height={10} />
        </View>
      </View>
    </View>
  );
};

const LoadingContactCard = () => {
  return (
    <View style={[styles.smallCard, {backgroundColor: "rgba(30,30,30,0.8)", width: '98%', alignSelf: 'center'}]}>
      <View style={styles.cardContent}>
        <View style={[styles.cardImage]}>
          <LoadingRect width={65} height={65} borderRadius={65}/>
        </View>
        <View style={styles.cardText}>
          <LoadingRect width={'50%'} height={10} />
          <LoadingRect width={'30%'} height={10} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  smallCard: {
    height: 90,
    borderRadius: 5,
    marginBottom: 10,
  },
  cardContent:{
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardImage: {
    height: "85%",
    alignSelf: 'center',
    marginHorizontal: 5,
  },
  cardText: {
    paddingVertical: '3%',
    width: '50%',
  }
})

export { LoadingCard, LoadingContactCard } 