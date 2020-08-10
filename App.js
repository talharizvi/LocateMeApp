/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,Dimensions,PermissionsAndroid
} from 'react-native';
import MapView,{Marker,PROVIDER_GOOGLE} from 'react-native-maps';
//import Geolocation from 'react-native-geolocation-service';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const LATITUD_DELTA = 0.0922
const LONGITUDE_DELTA = LATITUD_DELTA * (windowWidth / windowHeight)
const radius = 4 * 1000;

class App extends React.Component {
  

  constructor(props) {
    super(props);  
    this.state = {
      latitude: 0,
      longitude: 0,
      coords:{latitude:0,longitude:0},
      address:"",
      places:[]
    };
  }


requestLocationPermission=async()=>{
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Permission",
          message:
            "LocateMeApp wants to access location Permission",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the location");
        this.fetchLocation()
      } else {
        alert("Location permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  fetchLocation=()=>{
    Geocoder.init("AIzaSyBp1LlJgcG2Xhf5Y7Vh5qQdbfPRyVf_zpI");

    Geolocation.getCurrentPosition(info => 
      {
        console.log(info)
        console.log(info.coords.latitude)
           this.setState({coords:info.coords, latitude:info.coords.latitude,longitude:info.coords.longitude},()=>
    Geocoder.from(this.state.latitude, this.state.longitude).then(json => {
      var add = json.results[0].formatted_address;
      console.log("address",add)
      this.setState({address:add})

      fetch('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' +
      this.state.latitude +
      ',' +
      this.state.longitude +
      '&radius=' +
      radius +
      '&key=' +
      "AIzaSyBp1LlJgcG2Xhf5Y7Vh5qQdbfPRyVf_zpI")
  .then(res => {
    return res.json();
  }).then(res=>
    {
      let arr=[]
      for(let i=0;i<res.results.length;i++){
       let googlePlace = res.results[i]
        if(i<=5){
        var place = {};
        var myLat = googlePlace.geometry.location.lat;
        var myLong = googlePlace.geometry.location.lng;
        var coordinate = {
          latitude: myLat,
          longitude: myLong,
        };
         place['coordinate'] = coordinate;
        place['placeName'] = googlePlace.name;
        arr.push(place);
      }
    }
    arr.shift()
    console.log("arr",arr)
    this.setState({places:arr},()=>console.log("places",this.state.places))
    }
  
  )
  .catch(error=>console.log(error))

  }, (error) => {
    console.log(error)
  })
           )
          },
    );
  }
  
  
  async componentDidMount() {
    await this.requestLocationPermission()
   
  }

  render(){
  return (
    console.log(this.state.places),
    <ScrollView>
    <View>
    <MapView
    style={{width:'100%',height:2*(windowHeight/3)}}
    region={{
      latitude: this.state.latitude,
      longitude: this.state.longitude,
      latitudeDelta: LATITUD_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    }}
    zoomEnabled={true}
    showsUserLocation={true}
    
  >
  <Marker
  draggable
  coordinate={this.state.coords}
  image={require('./src/image/map_pin.png')}
  onDragEnd={(e) => {
    console.log(e.nativeEvent.coordinate)
    this.setState({longitude:e.nativeEvent.coordinate.longitude,latitude:e.nativeEvent.coordinate.latitude},()=>
    Geocoder.from(this.state.latitude, this.state.longitude).then(json => {
      var add = json.results[0].formatted_address;
      console.log("address",add)
      this.setState({address:add})

      fetch('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' +
      this.state.latitude +
      ',' +
      this.state.longitude +
      '&radius=' +
      radius +
      '&key=' +
      "AIzaSyBp1LlJgcG2Xhf5Y7Vh5qQdbfPRyVf_zpI")
  .then(res => {
    return res.json();
  }).then(res=>
    {
      let arr=[]
      console.log(res)
      for(let i=0;i<res.results.length;i++){
       let googlePlace = res.results[i]
        if(i<=5){
        var place = {};
        var myLat = googlePlace.geometry.location.lat;
        var myLong = googlePlace.geometry.location.lng;
        var coordinate = {
          latitude: myLat,
          longitude: myLong,
        };
         place['coordinate'] = coordinate;
        place['placeName'] = googlePlace.name;
        arr.push(place);
      }
    }
    arr.shift()
    this.setState({places:arr},()=>console.log("places",this.state.places))
    }
  
  )
  .catch(error=>console.log(error))

  }, (error) => {
    console.log(error)
  })
    )
  }}
/>
{this.state.places.map((item)=><Marker
  draggable
  coordinate={item.coordinate}
  image={require('./src/image/marker_icon.png')}
  style={{width:40,height:40}}
/>)}
  </MapView>

  <View style={{marginHorizontal:8,marginVertical:8,paddingHorizontal:8,borderColor:'black',borderRadius:18,backgroundColor:'#97999c'}}>
  <Text>{this.state.address}</Text>
  </View>
  <Text style={{marginLeft:8,color:'#b4b5b8'}}>NEARBY LOCATIONS</Text>
  {this.state.places.map((item)=>
    <View style={{marginHorizontal:8,marginVertical:8,paddingHorizontal:8,paddingVertical:8,borderRadius:6,zIndex:2,borderColor:'#b4b5b8',borderWidth:1}} key={item.placeName}>
    <Text>{item.placeName}</Text>
    </View>
    )

}  
    </View>
    </ScrollView>
    )};
  }

export default App;
