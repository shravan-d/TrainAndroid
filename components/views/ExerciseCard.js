import {React, useState} from 'react';
import {StyleSheet, TouchableOpacity, View, Text, Dimensions, Image, ImageBackground} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const ExerciseCard = ({ exercise, changeFavouriteCallback }) => {
  const navigation = useNavigation();
  const [favorite, setFavorite] = useState(exercise.favourite);
  const [cardPress, setCardPress] = useState(false);
  // const exerciseSteps = exercise.steps.split(".");
  var defaultIcon = require ('../../assets/media/logo1.png');
  let image = exercise.gifUrl?{uri: exercise.gifUrl}:defaultIcon;

  const onFavouriteClick = (fav) => {
    setFavorite(fav);
    changeFavouriteCallback(fav, exercise.id);
  }

  return (
    <View style={[styles.container, cardPress?{minHeight:200}:{height:90}]}> 
      <View style={styles.smallCard}>
        <View style={styles.cardContent}>
          <View style={styles.cardImage}><Image style={{width:"90%", height: "100%", borderRadius: 5}} source={image}/></View>
          <View style={styles.cardText}>
            <Text style={styles.cardHeader}>{exercise.name}</Text>
            <Text style={styles.cardSubtext}>{exercise.equipment?exercise.equipment:"No Requirements"}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() =>navigation.navigate('ExerciseDetailScreen', {exercise: exercise})} style={styles.expandArrow}>
          {/* <IonIcon name="chevron-down" size={30} color="#D4AF37" /> */}
          <IonIcon name="arrow-forward" size={18} color="#D4AF37" />
        </TouchableOpacity>
        {changeFavouriteCallback !== undefined &&
        <TouchableOpacity onPress={() => onFavouriteClick(!favorite)} style={styles.heart}>
          <IonIcon name="heart" size={18} color={favorite ? '#D4AF37' : 'rgba(20,20,20,0.2)'} />
        </TouchableOpacity>}
      </View>
      
      {/* {cardPress && 
        <View style={styles.bigCard}>
            <View style={styles.cardContent}>
                <View style={styles.cardImageContent}>
                    <Text style={styles.bigCardHeader}>{exercise.name}</Text>
                    <View style={styles.bigCardImage}><Image style={{width:"90%", height: 0.15*screenHeight, borderRadius: 5,}} source={image}/></View>
                </View>
                <View style={styles.bigCardText}>
                  <View style={styles.bigCardText2}>
                      { exerciseSteps.map((item, index)=> <Text key={index} style={styles.bigCardSubtext}>{item}.</Text>) }
                  </View>
                  <TouchableOpacity onPress={() =>navigation.navigate('ExerciseDetailScreen', {exercise: exercise})} style={{paddingBottom: 10}}>
                  {changeFavouriteCallback !== undefined &&
                  <View style={styles.cardMoretext}>
                  <Text style={{fontFamily: 'Montserrat-Italic', color: 'black'}}>Show exercise details</Text>
                  <IonIcon name="arrow-forward" size={18} color="#D4AF37" />
                  </View>}
                  </TouchableOpacity>
                </View>
            </View>
            <TouchableOpacity onPress={() => {setCardPress(!cardPress)}} style={styles.expandArrow}>
            <IonIcon name="chevron-up" size={30} color="#D4AF37" />
            </TouchableOpacity>
        </View>
      } */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 10,
  },
  smallCard: {
    height: "100%",
    backgroundColor: "white",
    borderRadius: 5,
  },
  cardContent:{
    flex: 1,
    flexDirection: 'row',
  },
  cardImage: {
    height: "85%",
    width: "40%",
    alignSelf: 'center',
    marginLeft: 5,
  },
  cardText: {
    paddingVertical: '3%',
    width: '50%',
  },
  cardHeader: {
    fontFamily: 'Montserrat-Italic',
    fontSize: 18,
    color: 'black',
    textTransform: 'capitalize'
  },
  cardSubtext: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    marginTop: 5,
    color: 'black',
    textTransform: 'capitalize'
  },
  bigCard: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 5,
  },
  cardImageContent:{
    flexBasis: "40%",
    marginLeft: "1%",
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2
  },
  bigCardImage: {
    width: "99%",
  },
  bigCardText: {
    paddingVertical: 10,
    width: "100%",
  },
  bigCardText2: {
    width: "60%"
  },
  bigCardHeader: {
    fontFamily: 'Montserrat-Italic',
    fontSize: 18,
    marginLeft: 5,
    marginVertical: 10,
    color: 'black'
  },
  bigCardSubtext: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    marginTop: 10,
    marginRight: 10,
    color: 'black'
  },
  expandArrow: {
    backgroundColor: "rgba(0,0,0,0)",
    position: 'absolute',
    right: 0,
    padding: 10
  },
  heart: {
    backgroundColor: "rgba(0,0,0,0)",
    position: 'absolute',
    right: 0,
    bottom: 5,
    padding: 10
  },
  cardMoretext: {
    marginTop: 5,
    flexDirection: 'row',
  },
});

export default ExerciseCard;
