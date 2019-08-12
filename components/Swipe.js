import React, {Component} from 'react';
import {
  View, 
  StyleSheet, 
  Image
} from 'react-native';

import PanGestureRight from './SnappableRight.js';
import PanGestureLeft from './SnappableLeft.js';

export default class Swipeable extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      curDate: '',
      cycle: ''
    };
  }

  componentDidMount() {
    setInterval( () => {
      this.setState({
        curDate : new Date().toDateString()
      })
    }, 1000);

    var hours = new Date().getHours();

    if(hours >= 0 && hours <= 12)
      this.setState({cycle: 1})
    else if (hours > 12 && hours <= 17)
      this.setState({cycle: 2})
    else 
      this.setState({cycle: 3})
  }
  
  render() {
    return(
      <View style={styles.mainContainer}>

        <View style={{flex:1}}>
          <PanGestureRight 
            title = 'happy' 
            navigation = {this.props.navigation} 
            info={[this.state.curDate, this.state.cycle]} >
            <Image 
              source={require('../assets/images/pangesture/happy.png')} 
              style={styles.boxLeft} />
          </PanGestureRight>
        </View>

        <View style={{flex:1}}>
           <PanGestureLeft 
             title = 'good' 
             navigation = {this.props.navigation} 
             info={[this.state.curDate,this.state.cycle]}>
              <Image 
                source={require('../assets/images/pangesture/good.png')} 
                style={styles.boxRight} />
            </PanGestureLeft>
        </View>

        <View style={{flex:1}}>
            <PanGestureRight 
              title = 'meh' 
              navigation = {this.props.navigation} 
              info={[this.state.curDate,this.state.cycle]}>
              <Image 
                source={require('../assets/images/pangesture/meh.png')} 
                style={styles.boxLeft} />
            </PanGestureRight>
        </View>

        <View style={{flex: 1}}>
            <PanGestureLeft 
              title = 'sad' 
              navigation = {this.props.navigation} 
              info={[this.state.curDate,this.state.cycle]}>
              <Image 
                source={require('../assets/images/pangesture/sad.png')} 
                style={styles.boxRight} />
            </PanGestureLeft>  
        </View>

        <View style={{flex:1}}>
          <PanGestureRight 
            title = 'angry' 
            navigation = {this.props.navigation} 
            info={[this.state.curDate,this.state.cycle]}>
              <Image 
                source={require('../assets/images/pangesture/angry.png')} 
                style={styles.boxLeft} />
          </PanGestureRight>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex:1,
    justifyContent: 'space-around'
  },

  swipeButton: {
    alignSelf: 'flex-end',
    height: 60,
    width: 290,
    marginBottom: '5%'
  },

  boxRight: {
    resizeMode: 'contain',
    width: '80%',
    alignSelf: 'flex-end',
    marginRight: -3,
    shadowColor: "black",
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8
  },

  boxLeft: {
    resizeMode: 'contain',
    width: '80%',
    alignSelf: 'flex-start',
    marginLeft: -3,
    shadowColor: "black",
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8
  }
  
})