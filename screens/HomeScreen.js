import React from 'react';

import {  
  StyleSheet,
  View, 
  Image, 
  Text,
} from 'react-native';

import ActionBarImage from '../components/ActionBarImage.js';
import PanGestureRight from '../components/SnappableRight.js';
import PanGestureLeft from '../components/SnappableLeft.js';

export default class HomeScreen extends React.Component {

  static navigationOptions = {      
    headerRight: <ActionBarImage />,
    headerMode: 'screen',
    headerLeft: null,
    gesturesEnabled:false,
  }

  constructor(props) {
    super(props);
    this.state = {
      curTime: '',
      curDate: '',
      cycle: ''
    };
  }

  componentDidMount() {
    setInterval( () => {
      var hours = new Date().getHours();

      if(hours >= 0 && hours <= 12)
        this.setState({cycle: 1})
      else if (hours > 12 && hours <= 17)
        this.setState({cycle: 2})
      else 
        this.setState({cycle: 3})
      
      this.setState({
        curDate : new Date().toDateString()
      })
    }, 1000);

    
  }

  render(){
    return (
      <View style={styles.container} >
        <View style={{ flex: 2 }}>
          <Text style={styles.text}>HOW ARE YOU?</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
            <Text style={styles.date}>
              <Image style={styles.icon} 
              source={require('../assets/images/other/calendar.png')} />
              {this.state.curDate}
            </Text>

            <Text style={{fontSize: 15, color: '#257DD9'}}>
              <Image style={styles.icon} source={require('../assets/images/other/time.png')} />
              CYCLE {this.state.cycle}
            </Text>
          </View>
        </View>

        <View style={{padding: '6%', justifyContent: 'space-around'}} />

          <View style ={{flex: 4, justifyContent: 'space-around'}} >
            <PanGestureRight title = 'happy' navigation = {this.props.navigation} info={[this.state.curDate,this.state.cycle]} >
              <Image source={require('../assets/images/pangesture/happy.png')} style={styles.boxLeft} />
            </PanGestureRight>

            <PanGestureLeft title = 'good' navigation = {this.props.navigation} info={[this.state.curDate,this.state.cycle]}>
              <Image source={require('../assets/images/pangesture/good.png')} style={styles.boxRight} />
            </PanGestureLeft>

            <PanGestureRight title = 'meh' navigation = {this.props.navigation} info={[this.state.curDate,this.state.cycle]}>
              <Image source={require('../assets/images/pangesture/meh.png')} style={styles.boxLeft} />
            </PanGestureRight>

            <PanGestureLeft title = 'sad' navigation = {this.props.navigation} info={[this.state.curDate,this.state.cycle]}>
              <Image source={require('../assets/images/pangesture/sad.png')} style={styles.boxRight} />
            </PanGestureLeft>

            <PanGestureRight title = 'angry' navigation = {this.props.navigation} info={[this.state.curDate,this.state.cycle]}>
              <Image source={require('../assets/images/pangesture/angry.png')} style={styles.boxLeft} />
            </PanGestureRight>
          </View>
      </View>
      )
  };
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F6F6F6',
    flex: 1,
  },
  text:{
    flex: 1,
    alignSelf: 'center',
    marginTop: '30%',
    fontSize: 32,
    color: '#FCB604'
  },
  date: {
    fontSize: 15, 
    color: '#257DD9', 
    marginRight: 30
  },
  icon:{
    height: 20,
    width: 20,
    marginRight: 9
  },
  swipeButton: {
    alignSelf: 'flex-end',
    height: 60,
    width: 290,
    marginBottom: '5%'
  },
  boxRight: {
    resizeMode: 'contain',
    width: '85%',
    alignSelf: 'flex-end',
  },
  boxLeft: {
    resizeMode: 'contain',
    width: '85%',
    alignSelf: 'flex-start',
  },
});