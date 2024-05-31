/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState, useRef } from 'react';
import {
  Alert,
  Linking,
  StyleSheet,
  Text,
  View,
  PermissionsAndroid,
  ToastAndroid,
  Platform,
} from 'react-native';
import {
  Form,
  Item,
  Input,
  Icon as NativeBaseIcon,
  List,
  ListItem,
} from 'native-base';
// import styled from 'styled-components';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import MarkerImg from '../../assets/Images/map-marker.png';

export const GOOGLE_API_KEY = 'AIzaSyDPcCjGGjjHdFZj2ui5Ooolw5sKzj7yeBM';
export const GOOGLE_API_URL = 'https://maps.googleapis.com';

// const RootContainer = styled.SafeAreaView`
//   flex: 1;
//   width: 100%;
// `;
// const MainContainer = styled.View`
//   flex: 1;
//   width: 100%;
//   align-items: center;
//   justify-content: center;
//   padding: 20px;
// `;

export default function LoginScreen({ navigation }) {
  const [locationSelected, setLocationSelected] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [showPlacesDropdown, setShowPlacesDropdown] = useState(false);
  const [region, setRegion] = useState({
    latitude: 37.7749,
    longitude: 122.4194,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const mapRef = useRef();
  let searchTimer = null;

  const hasPermissionIOS = async () => {
    const openSetting = () => {
      Linking.openSettings().catch(() => {
        Alert.alert('Unable to open settings');
      });
    };
    const status = await Geolocation.requestAuthorization('whenInUse');

    if (status === 'granted') {
      return true;
    }

    if (status === 'denied') {
      Alert.alert('Location permission denied');
    }

    if (status === 'disabled') {
      Alert.alert(
        'Turn on Location Services to allow this app to determine your location.',
        '',
        [
          { text: 'Go to Settings', onPress: openSetting },
          { text: "Don't Use Location", onPress: () => {} },
        ],
      );
    }

    return false;
  };

  const hasLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const hasPermission = await hasPermissionIOS();
      return hasPermission;
    }

    if (Platform.OS === 'android' && Platform.Version < 23) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        'Location permission denied by user.',
        ToastAndroid.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Location permission revoked by user.',
        ToastAndroid.LONG,
      );
    }

    return false;
  };

  const getLocation = async () => {
    const hasPermission = await hasLocationPermission();

    if (!hasPermission) {
      return;
    }

    Geolocation.getCurrentPosition(
      resp => {
        setLatitude(resp.coords.latitude);
        setLongitude(resp.coords.longitude);
        setShowPlacesDropdown(false);
        setRegion({
          ...region,
          latitude: resp.coords.latitude,
          longitude: resp.coords.longitude,
        });
        getPlaceByCoords(resp.coords.latitude, resp.coords.longitude);
      },
      error => {
        console.log(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 10000,
      },
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  const getPlaceByCoords = (___latitude, ___longitude) => {
    axios
      .get(
        `${GOOGLE_API_URL}/maps/api/geocode/json?latlng=${___latitude},${___latitude}&key=${GOOGLE_API_KEY}`,
      )
      .then(res => {
        if (res.data.results) {
          setSearchQuery(res.data.results[0].formatted_address);
          setLocationSelected(true);
          mapRef.current.animateToRegion({
            ...region,
            latitude: ___latitude,
            longitude: ___latitude,
          });
        }
      })
      .catch(err => {
        console.log('err', err.response);
      });
  };

  const searchPlaces = query => {
    clearTimeout(searchTimer);
    setSearchQuery(query);
    searchTimer = setTimeout(() => {
      if (query.length >= 3) {
        axios
          .get(
            `${GOOGLE_API_URL}/maps/api/place/autocomplete/json?&input=${query}&key=${GOOGLE_API_KEY}`,
          )
          .then(res => {
            if (res.data.predictions) {
              setPredictions(res.data.predictions);
              setShowPlacesDropdown(true);
            } else {
              setPredictions([]);
              setShowPlacesDropdown(false);
            }
          })
          .catch(err => {
            console.log('err', err);
          });
      } else {
        setPredictions([]);
        setShowPlacesDropdown(false);
      }
    }, 300);
  };

  const getPlace = (placeId, name) => {
    setSearchQuery(name);
    axios
      .get(
        `${GOOGLE_API_URL}/maps/api/place/details/json?placeid=${placeId}&key=${GOOGLE_API_KEY}`,
      )
      .then(res => {
        if (
          res.data.result.geometry.location &&
          res.data.result.formatted_address
        ) {
          setLocationSelected(true);
          setShowPlacesDropdown(false);
          setLatitude(res.data.result.geometry.location.lat);
          setLongitude(res.data.result.geometry.location.lng);
          mapRef.current.animateToRegion({
            ...region,
            latitude: res.data.result.geometry.location.lat,
            longitude: res.data.result.geometry.location.lng,
          });
          setTimeout(() => {
            navigation.navigate('Tours', {
              viewport: res.data.result.geometry.viewport,
              latitude: res.data.result.geometry.location.lat,
              longitude: res.data.result.geometry.location.lng,
            });
          }, 3000);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const closePlacesSearch = () => {
    setSearchQuery('');
    setPredictions([]);
    setShowPlacesDropdown(false);
    setLocationSelected(false);
  };

  const onMapPress = evt => {
    getPlaceByCoords(
      evt.nativeEvent.coordinate.latitude,
      evt.nativeEvent.coordinate.longitude,
    );
  };

  const renderMapMarker = () => {
    let marker = null;
    if (locationSelected && latitude && longitude) {
      marker = (
        <Marker
          coordinate={{
            latitude: latitude,
            longitude: longitude,
          }}
          image={MarkerImg}
        />
      );
    }
    return marker;
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          left: 20,
          zIndex: 5,
        }}>
        <Form>
          <Item regular style={{ backgroundColor: '#ffffff', marginLeft: 0 }}>
            <NativeBaseIcon active name="search" type="MaterialIcons" />
            <Input
              placeholder="Search place"
              onChangeText={text => searchPlaces(text)}
              value={searchQuery}
              style={{ height: 40 }}
            />
            {searchQuery.length > 0 && (
              <NativeBaseIcon
                active
                name="close"
                type="MaterialIcons"
                onPress={closePlacesSearch}
              />
            )}
          </Item>
        </Form>
        {showPlacesDropdown && (
          <View style={{ maxHeight: 300, backgroundColor: '#ffffff' }}>
            <List>
              {predictions.map((item, index) => (
                <ListItem
                  key={index}
                  button
                  onPress={() => getPlace(item.place_id, item.description)}>
                  <Text>{item.description}</Text>
                </ListItem>
              ))}
            </List>
          </View>
        )}
      </View>
      {region.latitude && (
        <MapView
          provider={PROVIDER_GOOGLE}
          initialRegion={region}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            zIndex: 0,
          }}
          ref={mapRef}
          onPress={e => onMapPress(e)}>
          {renderMapMarker()}
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  baseInputSection: {
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currencyTextInput: {
    marginTop: 10,
    color: 'white',
    borderColor: 'white',
    height: 40,
    borderBottomWidth: 1,
    padding: 5,
  },
  fieldStyle: {
    fontSize: 16,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 5,
    overflow: 'hidden',
    borderStyle: 'solid',
    borderColor: 'white',
    borderWidth: 1,
    color: 'white',
  },
});
