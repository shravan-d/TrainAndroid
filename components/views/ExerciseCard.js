import {React, useState} from 'react';
import {StyleSheet, TouchableOpacity, View, Text, Dimensions, Image, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

var width = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

const ExerciseCard = ({ exercise }) => {
  const navigation = useNavigation();
  const [cardPress, setCardPress] = useState(false);
  const exerciseSteps = exercise.steps.split(".").slice(0,2);
  var defaultIcon = require ('../../assets/media/logo1.png');
  let image = exercise.image?{uri: exercise.image}:defaultIcon;
  return (
    <View style={[styles.container, cardPress?{height:0.25*screenHeight}:{height:0.12*screenHeight}]}>
      {!cardPress && 
        <View style={styles.smallCard}>
          <View style={styles.cardContent}>
            <View style={styles.cardImage}><Image style={{width:"90%", height: "100%", borderRadius: 5,}} source={image}/></View>
            <View style={styles.cardText}>
              <Text style={styles.cardHeader}>{exercise.name}</Text>
              <Text style={styles.cardSubtext}>{exercise.requirements?exercise.requirements:"None"}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => {setCardPress(!cardPress)}} style={styles.expandArrow}>
            <Icon name="angle-down" size={30} color="#D4AF37" />
          </TouchableOpacity>
        </View>
      }
      {cardPress && 
        <View style={styles.bigCard}>
            <View style={styles.cardContent}>
                <View style={styles.cardImageContent}>
                    <Text style={styles.bigCardHeader}>{exercise.name}</Text>
                    <View style={styles.bigCardImage}><Image style={{width:"90%", height: "100%", borderRadius: 5,}} source={image}/></View>
                </View>
                <View style={styles.bigCardText}>
                  <View style={styles.bigCardText2}>
                      { exerciseSteps.map((item)=> <Text style={styles.bigCardSubtext}>{item}.</Text>) }
                  </View>
                  <TouchableOpacity onPress={() =>navigation.navigate('ExerciseDetailScreen', {exerciseIdList: [exercise.id], currIdx: 0})} style={{paddingBottom: 10}}>
                  <Text style={{fontFamily: 'Montserrat-Italic', marginTop: '5%'}}>Click to read more</Text>
                  </TouchableOpacity>
                </View>
            </View>
            <TouchableOpacity onPress={() => {setCardPress(!cardPress)}} style={styles.expandArrow}>
            <Icon name="angle-up" size={30} color="#D4AF37" />
            </TouchableOpacity>
        </View>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 0.025*screenHeight,
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
    marginLeft: "1%",
  },
  cardText: {
    // marginLeft: "2%",
    marginTop: "5%"
  },
  cardHeader: {
    fontFamily: 'Montserrat-Italic',
    fontSize: 18,
  },
  cardSubtext: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    marginTop: "4%"
  },
  bigCard: {
    height: "100%",
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 5,
  },
  cardImageContent:{
    flex: 1,
    flexBasis: "40%",
    flexGrow: 0,
    flexShrink: 0,
    marginLeft: "1%",
    height: "90%",
    alignSelf: 'center',
    flexDirection: 'column',
    justifyContent: 'space-evenly'
  },
  bigCardImage: {
    height: "65%",
    width: "100%",
  },
  bigCardText: {
    marginTop: "3%",
    width: "100%",
  },
  bigCardText2: {
    width: "60%"
  },
  bigCardHeader: {
    fontFamily: 'Montserrat-Italic',
    fontSize: 18,
    marginLeft: "2%",
  },
  bigCardSubtext: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    marginTop: "4%",
    marginRight: "6%"
  },
  expandArrow: {
    height: 40,
    width: 40,
    backgroundColor: "rgba(0,0,0,0)",
    position: 'absolute',
    marginLeft: "90%",
    paddingLeft: 11
  }
});

export default ExerciseCard;
