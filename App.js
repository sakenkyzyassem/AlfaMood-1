import React, { Component } from 'react';
import {AsyncStorage} from 'react-native';

import HomeScreen from './screens/HomeScreen.js';
import HistoryScreen from './screens/HistoryScreen.js';
import ReasonScreen from './screens/reasonScreen.js';
import LoginScreen from './screens/LoginScreen.js';
import { createAppContainer, createStackNavigator, createMaterialTopTabNavigator} from 'react-navigation';
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs"; 
import Icon from 'react-native-vector-icons/Ionicons';
import NavigationService from './components/NavigationService';

const RootStack = createStackNavigator(
  {
    Home:{
      screen:HomeScreen,
      navigationOptions:{
        gesturesEnabled: false
      }
    },
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

const NavigatorStack = createMaterialBottomTabNavigator ({
  Vote: {
    screen: HomeScreen,
    navigationOptions:{
      gesturesEnabled: false,
      tabBarIcon: ({tintColor}) => (
        <Icon name='ios-happy' color={tintColor} size={24} />
        )
    }
  },
  History: {
    screen: HistoryScreen,
    navigationOptions: {  
      header: null,
      tabBarIcon: ({tintColor}) => (
        <Icon name='ios-today' color={tintColor} size={24} />
        )
    }
  },
},
  {
    initialRouteName: 'Vote',
    defaultNavigationOptions:{
      headerTransparent:true,
    },
    activeTintColor: 'red',
    shifting: true
  }
)

const AppContainer = createAppContainer(NavigatorStack);

export default class App extends React.Component {
  async componentDidMount(){
    var server='192.168.1.15';
    await AsyncStorage.setItem('server',server);
    var s=await AsyncStorage.getItem('server');
  }
  render() {
    return <AppContainer 
            ref={navigatorRef => {
            NavigationService.setTopLevelNavigator(navigatorRef);
        }}/>;
  }
}

