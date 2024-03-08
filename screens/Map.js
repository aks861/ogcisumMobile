import React from 'react';
import {SafeAreaView, View, FlatList, Text} from 'react-native';
import {colors} from '../data/theme';
import ShowMap from '../components/ShowMap';

/**
 * This screen is used as a map page, which display the map
 * @param {ReactNavigation} navigation - used for navigation
 * @param {Object} mapState - used to get the map state
 * @param {Function} setMapState - used to set the map state
 * @returns {JSX} Map screen
 */
export default function Map({navigation, mapState, setMapState}) {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.bgColor,
      }}>
      <ShowMap mapState={mapState} setMapState={setMapState} />
    </SafeAreaView>
  );
}
