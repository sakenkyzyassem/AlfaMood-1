import React, { Component } from 'react';
import {AsyncStorage} from 'react-native';

import HomeScreen from './screens/HomeScreen.js';
import HistoryScreen from './screens/HistoryScreen.js';
import ReasonScreen from './screens/reasonScreen.js';
import LoginScreen from './screens/LoginScreen.js';
import { createAppContainer, createStackNavigator, createMaterialTopTabNavigator} from 'react-navigation'; 
import NavigationService from './components/NavigationService';

const RootStack = createStackNavigator(
  {
    Home: HomeScreen,
    History: {
      screen: HistoryScreen,
      navigationOptions: {  
        header: null
      }
    },
    Reason: ReasonScreen,
    Login: LoginScreen,
  },
  {
    initialRouteName: 'Login',
    defaultNavigationOptions:{
      headerTransparent:true,
    }
  }
);

const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
  async componentDidMount(){
    await this.setDateData();
    await this.setCycleData();
  }
  setDateData=async()=>{
    try{
      await AsyncStorage.getItem('date');
    }
    catch{
      await AsyncStorage.setItem('date',null);
    }
  }
  setCycleData=async()=>{
    try{
      await AsyncStorage.getItem('cycle');
    }
    catch{
      await AsyncStorage.setItem('cycle',null);
    }
  }
  render() {
    return <AppContainer 
            ref={navigatorRef => {
            NavigationService.setTopLevelNavigator(navigatorRef);
        }}/>;
  }
}

