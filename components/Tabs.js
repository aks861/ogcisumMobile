import React from 'react';
import {StyleSheet, View, Image, Text} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import NowPlaying from '../screens/NowPlaying';
import Profile from '../screens/Profile';
import Map from '../screens/Map';
import {Appearance} from 'react-native';
import {colors} from '../data/theme';
import icons from '../data/icons';
import LinearGradient from 'react-native-linear-gradient';

const Tab = createBottomTabNavigator();
const colorScheme = Appearance.getColorScheme();

/**
 * This function is used to create and customize each icon on bottom tab
 * @param {boolean} focused - highlight the focused icon
 * @param {File} icon - to add the icon image
 * @param {boolean} isNearby - to determine if music is nearby or not
 * @param {integer} size - to determine the width of the icon
 * @returns {JSX} TabIcon component
 */
function TabIcon({focused, icon, isNearby, size}) {
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: focused
          ? colors.blackColorTranslucentLess
          : 'transparent',
        height: 70,
        width: size + 50,
      }}>
      <Image
        source={icon}
        resizeMode="contain"
        style={{
          width: size,
          height: 40,
          tintColor:
            focused || isNearby
              ? colors['light'].bgColor
              : colors['dark'].fgColorLighter,
        }}
      />
      {isNearby ? (
        <Text style={styles.header}>There's Music Nearby</Text>
      ) : (
        <></>
      )}
    </View>
  );
}

/**
 * This function is used to style bottom tab navigator
 * @param {File} icon - to add the icon image
 * @param {boolean} isNearby - to determine if music is nearby or not
 * @param {integer} size - to determine the width of the icon
 */
function tabOptions(icon, isNearby, size) {
  return {
    tabBarIcon: ({focused}) => (
      <TabIcon focused={focused} icon={icon} isNearby={isNearby} size={size} />
    ),
    tabBarBackground: () => (
      <LinearGradient
        colors={[colors.purpleColorLighter, colors.blueColorDarker]}
        style={{
          height: 70,
        }}
      />
    ),
    tabBarHideOnKeyboard: true,
    tabBarActiveTintColor: colors[colorScheme].fgColor,
    tabBarInactiveTintColor: colors[colorScheme].fgColorLighter,
    tabBarStyle: {
      height: 70,
    },
    tabBarShowLabel: false,
    headerShown: false,
  };
}

/**
 * This component is used as a bottom tab navigator
 * @param {ReactNavigation} navigation - used for navigation
 * @param {Object} photoState - used to display the user's photo
 * @param {Function} setPhotoState - used to set the photo state
 * @param {String} text - used to display the user's name
 * @param {Function} setText - used to set the text state
 * @param {Object} mapState - used to get the map data
 * @param {Function} setMapState - used to set the map state
 * @returns {JSX} Tabs component
 */
export default function Tabs({
  navigation,
  photoState,
  setPhotoState,
  text,
  setText,
  mapState,
  setMapState,
}) {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Map"
        children={() => (
          <Map
            navigation={navigation}
            mapState={mapState}
            setMapState={setMapState}
          />
        )}
        options={() => tabOptions(icons.tabMapWhite, false, 40)}
      />
      <Tab.Screen
        name="Ogcisum"
        children={() => (
          <NowPlaying
            navigation={navigation}
            photoState={photoState}
            setPhotoState={setPhotoState}
            text={text}
            setText={setText}
            mapState={mapState}
            setMapState={setMapState}
          />
        )}
        options={() =>
          tabOptions(
            icons.logoWhite,
            typeof mapState.nearbyLocation.distance !== 'undefined' &&
              mapState.nearbyLocation.distance.nearby,
            100,
          )
        }
      />
      <Tab.Screen
        name="Profile"
        children={() => (
          <Profile
            navigation={navigation}
            photoState={photoState}
            setPhotoState={setPhotoState}
            text={text}
            setText={setText}
            mapState={mapState}
            setMapState={setMapState}
          />
        )}
        options={() => tabOptions(icons.tabProfileWhite, false, 40)}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  header: {
    color: colors[colorScheme].headerTextColor,
  },
});
