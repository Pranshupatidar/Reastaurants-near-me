import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View,
  Dimensions,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps

const BufferScreen = () => {
  const [lat, setLat] = useState();
  const [long, setLong] = useState();
  const [dist, setDist] = useState();
  const [duration, setDuration] = useState();
  const [showMap, setShowMap] = useState(false);
  const [rest, setRest] = useState([]);

  const getLocation = () => {
    try {
      Geolocation.getCurrentPosition(data => {
        setLat(data.coords.latitude);
        setLong(data.coords.longitude);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleRestaurantSearch = () => {
    const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?';
    const location = `location=${lat},${long}`;
    const radius = '&radius=2000';
    const type = '&keyword=restaurant';
    const key = '&key=<API KEY>';
    const restaurantSearchUrl = url + location + radius + type + key;
    fetch(restaurantSearchUrl)
      .then(response => response.json())
      .then(result => handleSetRestaurant(result))
      .catch(e => console.log(e));
  };

  const handleSetRestaurant = res => {
    res.results.forEach(item => {
      setRest(prev => [
        ...prev,
        {
          title: item.name,
          pid: item.place_id,
          coordinate: {
            latitude: item.geometry.location.lat,
            longitude: item.geometry.location.lng,
          },
        },
      ]);
    });
    if (rest.length > 0) {
      console.log(rest);
    }
  };

  const handleMarkerPress = placeID => {
    // console.log(placeID);
    setDist();
    setDuration();
    const furl = 'https://maps.googleapis.com/maps/api/distancematrix/json?';
    const origins = `origins=${lat},${long}`;
    const destinations = `&destinations=place_id:${placeID}`;
    const key = '&key=<API KEY>';
    const restaurantSearchUrl = furl + origins + destinations + key;
    fetch(restaurantSearchUrl)
      .then(response => response.json())
      .then(result => handleSetDist(result))
      .catch(e => console.log(e));
  };

  const handleSetDist = r => {
    setDist(r.rows[0].elements[0].distance.text);
    setDuration(r.rows[0].elements[0].duration.text);
  };

  const handleShowMap = () => {
    setShowMap(true);
    handleRestaurantSearch();
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <View>
      {showMap ? (
        <View
          style={{
            height: Dimensions.get('window').height,
            width: Dimensions.get('window').width,
          }}>
          <MapView
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={styles.map}
            showsUserLocation={true}
            zoomEnabled
            zoomControlEnabled
            initialRegion={{
              latitude: lat,
              longitude: long,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,
            }}>
            {rest.length > 0 &&
              rest.map((marker, index) => (
                <Marker
                  key={index}
                  coordinate={marker.coordinate}
                  title={marker.title}
                  onPress={() => handleMarkerPress(marker.pid)}
                />
              ))}
          </MapView>
        </View>
      ) : (
        <TouchableNativeFeedback onPress={() => handleShowMap()}>
          <View style={styles.bconatiner}>
            <Text style={{fontSize: 20}}>Restaurants near me</Text>
          </View>
        </TouchableNativeFeedback>
      )}
      {showMap && (
        <View style={styles.distance}>
          {dist && <Text style={styles.text}>Distance:{dist}</Text>}
          {duration && <Text style={styles.text}>Duration:{duration}</Text>}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  bconatiner: {
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: '#f4f4f4',
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 5,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  distance: {
    backgroundColor: 'white',
    alignItems: 'center',
    height: '20%',
  },
  text: {
    fontSize: 16,
    marginVertical: 5,
  },
});

export default BufferScreen;
