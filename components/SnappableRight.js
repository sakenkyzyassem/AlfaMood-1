import React, { Component } from 'react';
import { Animated } from 'react-native';

import {
  PanGestureHandler,
  State,
} from 'react-native-gesture-handler';
import { USE_NATIVE_DRIVER } from '../config';

export default class SnappableRight extends Component {
  constructor(props) {
    super(props);
    this._dragX = new Animated.Value(0);
    this._transX = this._dragX.interpolate({
      inputRange: [-100, -50, 0, 50, 100],
      outputRange: [-30, -10, 0, 10, 30],
    });
    this._onGestureEvent = Animated.event(
      [{ nativeEvent: { translationX: this._dragX } }],
      { useNativeDriver: USE_NATIVE_DRIVER }
    );
  }
  handleSubmit = (title) => {
    if( title == 'happy'){
      this.props.navigation.navigate('Reason', {
        mood: require('../assets/images/emotions/happy.png'),
        buttonColor: '#2DF972',
        backgroundRoute: require('../assets/images/background/happy-background.png'),
        textFieldColor: '#2CB74C',
        title:title,
        backgroundColor: '#177A1B',
        info:this.props.info
      });
    }
    else if (title == 'meh'){
      this.props.navigation.navigate('Reason', {
        mood: require('../assets/images/emotions/meh.png'),
        buttonColor: '#B8BBAE',
        backgroundRoute: require('../assets/images/background/meh-background.png'),
        textFieldColor: '#94978D',
        title:title,
        backgroundColor: '#666861',
        info:this.props.info
      });
    }
    else {
      this.props.navigation.navigate('Reason', {
        mood: require('../assets/images/emotions/angry.png'),
        buttonColor: '#EE8D8D',
        backgroundRoute: require('../assets/images/background/angry-background.png'),
        textFieldColor: '#C65D5D',
        title:title,
        backgroundColor: '#AF2020',
        info:this.props.info
      });
    }
  };
  _onHandlerStateChange = event => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      Animated.spring(this._dragX, {
        velocity: event.nativeEvent.velocityX,
        tension: 10,
        friction: 2,
        toValue: 0,
        useNativeDriver: USE_NATIVE_DRIVER,
      }).start();
      this.handleSubmit(this.props.title)
    }
  };
  render() {
    const { children } = this.props;
    return (
      <PanGestureHandler
        {...this.props}
        maxPointers={1}
        minOffsetX={10}
        onGestureEvent={this._onGestureEvent}
        onHandlerStateChange={this._onHandlerStateChange}>
        <Animated.View style={{ transform: [{ translateX: this._transX }] }}>
          {children}
        </Animated.View>
      </PanGestureHandler>
    );
  }
}