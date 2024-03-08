import React, {useState, useRef} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Appearance,
} from 'react-native';
import {colors} from '../data/theme';
import icons from '../data/icons';
import {WebView} from 'react-native-webview';

const colorScheme = Appearance.getColorScheme();
let sampleToLocationURL = `http://wmp.interaction.courses/api/v1/?apiKey=KDgTO1Lg&mode=read&endpoint=samples_to_locations`;
let sampleURL = `http://wmp.interaction.courses/api/v1/?apiKey=KDgTO1Lg&mode=read&endpoint=samples&order=desc`;

/**
 * This screen is used as a Now Playing page, which display: 
 * information about that location, its sample, and the current user when music is nearby.
 * "No Music Nearby" when music is not nearby.
 * @param {ReactNavigation} navigation - used for navigation
 * @param {Object} photoState - used to display the user's photo
 * @param {Function} setPhotoState - used to set the photo state
 * @param {String} text - used to display the user's name
 * @param {Function} setText - used to set the text state
 * @param {Object} mapState - used to get the map state
 * @param {Function} setMapState - used to set the map state
 * @returns {JSX} NowPlaying screen
 */
export default function NowPlaying({
  navigation,
  photoState,
  setPhotoState,
  text,
  setText,
  mapState,
  setMapState,
}) {
  const hasPhoto = typeof photoState.uri != 'undefined';
  const hasName = text.length !== 0;
  const defaultName = 'Enter Your Name';

  const [webViewState, setWebViewState] = useState({
    loaded: false,
    actioned: false,
  });

  const webViewRef = useRef();

  /**
   * This function is used to filter samplesToLocation from API with nearby location id and put it in an array then filter sample from API with the previous array
   * @returns {array} array of type and recording data
   */
  async function filterMusic() {
    const responseSamplesToLocation = await fetch(sampleToLocationURL);
    const sampleToLocationJSON = await responseSamplesToLocation.json();

    const responseSample = await fetch(sampleURL);
    const samplesJSON = await responseSample.json();

    const sampleToLocation = sampleToLocationJSON.samples_to_locations;
    let filteredSampleToLocationArray = sampleToLocation.filter(sample =>
      sample.locations_id.includes(mapState.nearbyLocation.id),
    );

    const musicSamples = samplesJSON.samples;
    let filteredSamples = musicSamples.filter(musicSample =>
      filteredSampleToLocationArray
        .map(sample => sample.samples_id)
        .includes(musicSample.id),
    );
    let restructureSamplesData = filteredSamples.map(musicSample => {
      return {
        type: musicSample.type,
        recording_data: JSON.parse(musicSample.recording_data),
      };
    });
    return restructureSamplesData;
  }

  function webViewLoaded() {
    setWebViewState({
      ...webViewState,
      loaded: true,
    });
  }

  /**
   * This function is called when pressing the "Play Music" or "Stop Music" button.
   * The function will setup the sample with the samples shared to that location from filterMusic function.
   * It will play the samples on "Play Music" button.
   * It will stop playing on "Stop Music" button.
   */
  async function handleActionPress() {
    if (!webViewState.actioned) {
      webViewRef.current.injectJavaScript(
        `setupParts(${JSON.stringify(await filterMusic())})`,
      );
      webViewRef.current.injectJavaScript('startPlayback()');
    } else {
      webViewRef.current.injectJavaScript('stopPlayback()');
    }
    setWebViewState({
      ...webViewState,
      actioned: !webViewState.actioned,
    });
  }

  /**
   * This component is used to display user image and name that are currently at that location.
   * @returns {JSX} UserAtLocation Component
   */
  function UserAtLocation() {
    return (
      <View style={styles.userAtLocationView}>
        <Text style={styles.userAtLocationHeader}>
          Currently At This Location:
        </Text>
        <View style={styles.imageTextView}>
          <Image
            source={
              hasPhoto
                ? {
                    uri: photoState.uri,
                    width: 80,
                    height: 80,
                  }
                : colorScheme === 'light'
                ? icons.iconSmileyDarkPurple
                : icons.iconSmileyLightPurple
            }
            resizeMode="contain"
            style={styles.userImage}
          />
          <View style={styles.userAtLocationTextView}>
            <Text style={styles.base}>{hasName ? text : defaultName}</Text>
          </View>
        </View>
        <View style={styles.imageTextView}>
          <Image
            source={
              colorScheme === 'light'
                ? icons.iconSmileyDarkPurple
                : icons.iconSmileyLightPurple
            }
            resizeMode="contain"
            style={styles.userImage}
          />
          <View style={styles.userAtLocationTextView}>
            <Text style={styles.base}>And Others...</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{backgroundColor: colors[colorScheme].bgColor, flex: 1}}>
      {/* View if there is no music nearby*/}
      {mapState.nearbyLocation.distance.nearby !== true ? (
        <View style={styles.container}>
          <Text style={styles.header}>No Music Nearby</Text>
          <Text style={styles.base}>It's Oh So Quiet...</Text>
        </View>
      ) : (
        // View when music nearby
        <View style={styles.container}>
          <View style={styles.row}>
            <Image
              source={
                colorScheme === 'light'
                  ? icons.iconPinDarkPurple
                  : icons.iconPinLightPurple
              }
              resizeMode="contain"
              style={styles.icon}
            />
            <View style={styles.textView}>
              <Text style={styles.header}>
                {mapState.nearbyLocation.location}
              </Text>
              <Text style={styles.base}>
                {mapState.nearbyLocation.suburb},{' '}
                {mapState.nearbyLocation.state}
              </Text>
            </View>
          </View>
          <View style={styles.buttonView}>
            <WebView
              ref={ref => (webViewRef.current = ref)}
              originWhitelist={['*']}
              source={{
                uri: 'https://wmp.interaction.courses/playback-webview/',
              }}
              pullToRefreshEnabled={true}
              onLoad={webViewLoaded}
              style={styles.webView}
            />
            {webViewState && (
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleActionPress}>
                  <Text style={{color: colors[colorScheme].bgColor}}>
                    {!webViewState.actioned ? 'Play Music' : 'Stop Music'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          <UserAtLocation />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    color: colors[colorScheme].fgColor,
    fontSize: 32,
    fontWeight: 'bold',
  },
  base: {
    color: colors[colorScheme].fgColor,
  },
  row: {
    flexDirection: 'row',
  },
  icon: {
    flexDirection: 'column',
    width: 40,
    height: 40,
    marginTop: 30,
  },
  textView: {
    flexDirection: 'column',
    marginRight: 35,
  },
  buttonView: {
    justifyContent: 'center',
    margin: 20,
  },
  button: {
    borderRadius: 12,
    backgroundColor: colors[colorScheme].fgColor,
    width: '95%',
    padding: 15,
    alignItems: 'center',
  },
  userAtLocationHeader: {
    color: colors[colorScheme].fgColor,
    fontSize: 20,
    fontWeight: 'bold',
  },
  userAtLocationTextView: {
    flexDirection: 'column',
    margin: 20,
  },
  userImage: {
    flexDirection: 'column',
    borderWidth: 5,
    borderRadius: 100,
    borderColor: colors[colorScheme].fgColorLighter,
    width: 80,
    height: 80,
  },
  imageTextView: {
    flexDirection: 'row',
    margin: 10,
  },
  userAtLocationView: {
    marginTop: '40%',
  },
  webView: {},
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
