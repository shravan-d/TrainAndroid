import React from 'react';
import {StyleSheet, ImageBackground, View, Text} from 'react-native';

const Template = () => {
  var bg = require ('../media/bg.png');
  return (
    <View style={styles.container}>
      <ImageBackground source={bg} style={styles.background}>
        <Text>Template</Text>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
  background: {
    width: "100%",
    height: "100%"
  },
});

export default Template;
