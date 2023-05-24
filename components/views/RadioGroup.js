import React, { useState } from 'react';
import {StyleSheet, View, Text, Pressable, Dimensions} from 'react-native';

const RadioGroup = ( { data, onSelect, currentValue } ) => {
    return (
    <View style={styles.container}>
        {data.map((item, index) => {
            return (
                <Pressable key={index} onPress={() => onSelect(item.value)}>
                    <View style={styles.buttonContainer}>
                        <Text style={[{fontFamily: 'Montserrat-Regular'}, currentValue===item.value?{color: '#D4AF37'}:{color: 'white'}]}> 
                            {item.label}
                        </Text>
                    </View>
                </Pressable>
            )
        })}
    </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-around",
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    button: {
        marginLeft: 5,
        width: 10,
        height: 10,
        borderRadius: 20
    }
});

export default RadioGroup;