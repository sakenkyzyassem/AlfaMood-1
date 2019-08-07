import React from 'react';

import {  
  StyleSheet,
  View, 
  Image, 
  Text,
  AsyncStorage,
  ActivityIndicator
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
      voted: false,
      loading :true,
      until:null
    };
  }

  async componentDidMount() {
    var hours = new Date().getHours();  
    setInterval( () => {
      var hours = new Date().getHours();

    }, 1000);

    if(hours >= 0 && hours <= 12)
      this.setState({cycle: 1,until:'13:00'})
    else if (hours > 12 && hours <= 17)
      this.setState({cycle: 2,until:'18:00'})
    else 
      this.setState({cycle: 3,until:'00:00'})
    
    this.setState({
      curDate : new Date().toDateString()
    })

    await this.checkVoted();

    this.setState({loading:false});
    this.props.navigation.addListener('didFocus',async()=>{await this.checkVoted();this.render();})
  }
  checkVoted = async()=>{
    var cellDate = await AsyncStorage.getItem('date');
    var cellCycle= await AsyncStorage.getItem('cycle');
    if(this.state.curDate==cellDate){
        if(this.state.cycle==cellCycle){
            this.setState({voted:true});
        }
    }
  }

  render(){
    return (
      <View style={styles.container}>
        <View style={{ flex: 2 }}>
          <View style={{flex:4}}>
            <Text style={styles.text}>КАК ВАШИ ДЕЛА?</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center',alignItems:'baseline',flex:1}}>
            <Text style={styles.date}>
              <Image style={styles.icon} 
              source={require('../assets/images/other/calendar.png')} />
              {this.state.curDate}
            </Text>
            <View style={{width:'10%'}} />
            <View style={{flexDirection:'row'}}>
              <Image style={styles.icon} 
              source={require('../assets/images/other/time.png')} />
              <View style={{flexDirection:'column'}}>
              <Text style={{fontSize: 15, color: '#257DD9'}}>ЦИКЛ {this.state.cycle}</Text>
              <Text style={{fontSize: 15, color: '#257DD9'}}>ДО: {this.state.until}</Text>
              </View>
            </View>
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
  MainContainer:
  {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  ActivityIndicatorStyle:{ 
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center'
  },
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