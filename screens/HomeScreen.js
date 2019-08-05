import React from 'react';

import {  
  StyleSheet,
  View, 
  Image, 
  Text,
} from 'react-native';

import ActionBarImage from '../components/ActionBarImage.js';
import Swipeable from '../components/Swipe';
import Preloader from '../components/Preloader';

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
      cycle: '',
      voted: false
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
          <View style={{ flexDirection: 'row', justifyContent: 'center'}}>
            <Text style={styles.date}>
              <Image style={styles.icon} 
              source={require('../assets/images/other/calendar.png')} />
              {this.state.curDate}
            </Text>
            <View style={{width:'10%'}} />
            <Text style={{fontSize: 15, color: '#257DD9'}}>
              <Image style={styles.icon} 
              source={require('../assets/images/other/time.png')} />
              CYCLE {this.state.cycle}
            </Text>
          </View>
        </View> 
        
        <View style={{padding: '6%'}} />

        <View style ={{flex: 4}}>
          {
            this.state.voted ? <Preloader />:<Swipeable navigation = {this.props.navigation} />
          }
        </View>
      </View>
     )
  };
}

const styles = StyleSheet.create({
  container: 
  {
    backgroundColor: '#F6F6F6',
    flex: 1,
  },
  text:
  {
    flex: 1,
    alignSelf: 'center',
    marginTop: '30%',
    fontSize: 32,
    color: '#FCB604'
  },
  date: 
  {
    fontSize: 15, 
    color: '#257DD9'
  },
  icon:
  {
    height: 20,
    width: 20
  }

})