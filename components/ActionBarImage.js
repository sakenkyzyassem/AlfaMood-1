import React, { Component } from 'react';
 
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import NavigationService from './NavigationService';
 
export default class ActionBarImage extends Component {

  _navigateToHistory = () => {
    NavigationService.navigate('History');
  }

  render() {
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress = {() => this._navigateToHistory()} >
          <Image
            source={require('../assets/images/other/user.png')}

            style={{
              width: 35,
              height: 35,
              borderRadius: 10,
              margin: 10,
              marginRight: 15,
            }}
          />
        </TouchableOpacity>
      </View>
    );
  }
}