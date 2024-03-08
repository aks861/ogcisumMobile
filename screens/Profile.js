import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  Dimensions,
  Text,
  ImageBackground,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Appearance,
} from 'react-native';
import {colors} from '../data/theme';
import {launchImageLibrary} from 'react-native-image-picker';

const {width, height} = Dimensions.get('window');
const colorScheme = Appearance.getColorScheme();

/**
 * This screen is used as a Profile page which display editable photo fields and name input
 * @param {ReactNavigation} navigation - used for navigation
 * @param {Object} photoState - used to display the user's photo
 * @param {Function} setPhotoState - used to set the photo state
 * @param {String} text - used to display the user's name
 * @param {Function} setText - used to set the text state
 * @returns {JSX} Profile screen
 */
export default function Profile({
  navigation,
  photoState,
  setPhotoState,
  text,
  setText,
}) {
  async function handleChangePress() {
    const result = await launchImageLibrary();
    if (typeof result.assets[0] == 'object') {
      setPhotoState(result.assets[0]);
    }
  }

  const hasPhoto = typeof photoState.uri != 'undefined';

  /**
   * This component is used to display either empty photo view or added photo view
   * @returns {JSX} Photo component
   */
  function Photo() {
    if (hasPhoto) {
      return (
        <View style={styles.photoFullView}>
          <ImageBackground
            style={styles.photoFullImage}
            resizeMode="cover"
            source={{
              uri: photoState.uri,
              width: width,
              height: height / 2,
            }}>
            <View style={styles.buttonView}>
              <TouchableOpacity
                style={styles.button}
                onPress={handleChangePress}>
                <Text style={{color: colors[colorScheme].bgColor}}>
                  Change Photo
                </Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
      );
    } else {
      return (
        <View style={styles.photoEmptyView}>
          <View style={styles.buttonViewEmpty}>
            <TouchableOpacity style={styles.button} onPress={handleChangePress}>
              <Text style={{color: colors[colorScheme].bgColor}}>
                Add Photo
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  }

  return (
    <SafeAreaView
      style={{backgroundColor: colors[colorScheme].bgColor, flex: 1}}>
      <View style={styles.container}>
        <Text style={styles.header}>Edit Profile</Text>
        <Text style={styles.base}>Mirror, Mirror On the Wall...</Text>
        <Photo />
        <TextInput
          style={styles.input}
          onChangeText={setText}
          value={text}
          placeholder="Enter Your Name"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors[colorScheme].backgroundColor,
    flex: 1,
  },
  header: {
    color: colors[colorScheme].fgColor,
    fontSize: 32,
    fontWeight: 'bold',
  },
  base: {
    color: colors[colorScheme].fgColor,
  },

  photoFullView: {
    margin: 20,
    borderWidth: 3,
    borderRadius: 10,
    borderColor: colors[colorScheme].fgColorLighter,
    justifyContent: 'center',
    flex: 1,
  },
  photoEmptyView: {
    borderWidth: 3,
    borderRadius: 10,
    borderColor: colors[colorScheme].fgColorLighter,
    borderStyle: 'dashed',
    height: height / 2,
    margin: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoFullImage: {
    width: '100%',
    borderRadius: 10,
    flex: 1,
  },
  buttonView: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: '100%',
  },
  buttonViewEmpty: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    borderRadius: 12,
    backgroundColor: colors[colorScheme].fgColor,
    padding: 10,
    width: '40%',
    alignItems: 'center',
  },
  input: {
    height: 40,
    margin: 20,
    borderRadius: 12,
    backgroundColor: colors[colorScheme].fgColorLighter,
    color: colors[colorScheme].fgColor,
    padding: 10,
    textAlign: 'center',
  },
});