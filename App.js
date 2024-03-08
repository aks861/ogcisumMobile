import React, {useState, useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import Tabs from './components/Tabs';
import {locations} from './data/locations';

const Stack = createStackNavigator();

const App = () => {
  const [photoState, setPhotoState] = useState({});
  const [text, setText] = useState('');

  // initial state using local locations
  const [fetchedLocations, setLocations] = useState(locations);

  useEffect(() => {
    getLocation();
  }, []);

  /**
   * This function fetches the location from the API and put it in set locations state
   */
  async function getLocation() {
    const response = await fetch(
      'http://wmp.interaction.courses/api/v1/?apiKey=KDgTO1Lg&mode=read&endpoint=locations&order=asc&limit=5',
    );
    const locationJSON = await response.json();
    const locations = locationJSON.locations.reverse();
    setLocations(locations);
  }

  // Convert string-based latlong to object-based on each location
  const updatedLocations = fetchedLocations.map(location => {
    const latlong = location.latlong.split(', ');
    location.coordinates = {
      latitude: parseFloat(latlong[0]),
      longitude: parseFloat(latlong[1]),
    };
    return location;
  });

  // Setup state for map data
  const initialMapState = {
    locationPermission: false,
    locations: updatedLocations,
    userLocation: {
      latitude: -27.49763309197018,
      longitude: 153.01291742634757,
      // Starts at Great Court, UQ
    },
    nearbyLocation: {},
  };
  const [mapState, setMapState] = useState(initialMapState);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen
          name="test"
          children={props => (
            <Tabs
              {...props}
              photoState={photoState}
              setPhotoState={setPhotoState}
              text={text}
              setText={setText}
              mapState={mapState}
              setMapState={setMapState}
            />
          )}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
