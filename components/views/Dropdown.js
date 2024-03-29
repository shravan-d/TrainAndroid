import {React, useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const Dropdown = ({value, setValue, header, dropdownItems, elevation}) => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(dropdownItems);
  return (
    <View style={[styles.dropdown, {zIndex: elevation, elevation: elevation}]}>
        {header != "" && <Text style={styles.dropdownHeader}>{header}</Text>}
          <DropDownPicker
            listMode="SCROLLVIEW"
            open={open}
            value={value}
            items={items}
            theme= 'DARK'
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            showTickIcon={false}
            placeholder="All"
            closeOnBackPressed={true}
            style={{
              backgroundColor: "rgba(0,0,0,0)",
              borderBottomColor: '#D4AF37',
            }}
            dropDownContainerStyle={{
              backgroundColor: "rgba(0,0,0,1)",
              borderBottomColor: '#D4AF37',
              maxHeight: '100%'
            }}
            textStyle={{
              textAlign: 'center',
              fontFamily: 'Montserrat-Regular',
            }}
            arrowIonIconStyle={{
              position: 'absolute',
              right: "5%",
              top: "-27%"
            }}
          />
    </View>
  );
};

const styles = StyleSheet.create({
    dropdownHeader: {
        color: 'white',
        textAlign: 'center',
        fontFamily: 'Montserrat-Regular',
        marginBottom: "5%",
    }
});

export default Dropdown;