import React from 'react';

import {  
  StyleSheet,
  View, 
  Image, 
  Text,
  AsyncStorage
} from 'react-native';

import Swipeable from '../components/Swipe';
import Preloader from '../components/Preloader';

export default class HomeScreen extends React.Component {

  static navigationOptions ={
    header: null
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

  async componentDidMount() {
    var hours = new Date().getHours();  
    setInterval( () => {
      var hours = new Date().getHours();

    }, 1000);

    if(hours >= 0 && hours <= 12)
      this.setState({cycle: 1})
    else if (hours > 12 && hours <= 17)
      this.setState({cycle: 2})
    else 
      this.setState({cycle: 3})
    
    this.setState({
      curDate : new Date().toDateString()
    })

    var cellDate = await AsyncStorage.getItem('date');
    var cellCycle= await AsyncStorage.getItem('cycle');
    console.log(cellDate+"cell date");
    console.log(this.state.curDate+"current date");
    console.log(cellDate==this.state.curDate);
    if(this.state.curDate==cellDate){
      console.log("here");
        if(this.state.cycle==cellCycle){
            console.log("here");
            this.setState({voted:true});
        }
    }

    
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
    marginTop: '25%',
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