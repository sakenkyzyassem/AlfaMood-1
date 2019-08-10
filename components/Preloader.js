import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions
} from "react-native";
import BouncingPreloader from "react-native-bouncing-preloader";

let heightD = Dimensions.get('window').height;

const icons1 = [
  require('../assets/images/emotions/angry.png'), null,
  require('../assets/images/emotions/good.png'), null, 
  require('../assets/images/emotions/happy.png'), null,  
  require('../assets/images/emotions/meh.png'), null, 
  require('../assets/images/emotions/sad.png'), null,  
];

const icons2 = [
  require('../assets/images/smiley/happy(1).png'), null,
  require('../assets/images/smiley/happy.png'), null,
  require('../assets/images/smiley/heart.png'), null, 
  require('../assets/images/smiley/love.png'), null, 
  require('../assets/images/smiley/smile.png'), null, 
];

const icons3 = [
  require('../assets/images/smiley/mobile.png'), 
  require('../assets/images/smiley/mobile(1).png'),
  require('../assets/images/smiley/mobile(2).png'),
  require('../assets/images/smiley/mobile(4).png'),
];

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      icon: '',
      heightLeft: '',
      heightRight: ''
    };
  }

  componentWillMount(){
    var hours = new Date().getHours();

    if(hours >= 0 && hours <= 12)
      this.icon = icons3
    else if (hours > 12 && hours <= 17)
      this.icon = icons2
    else 
      this.icon = icons1

    this.setState({heightLeft: heightD*0.28})
    this.setState({heightRight: -heightD*0.20})
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.info}>
        Вы уже голосовали. Пожалуйста, приходите к следующему циклу)
        </Text>
        <BouncingPreloader
          icons={this.icon}
          leftDistance={this.heightLeft}
          rightDistance={this.heightRight}
          speed={2000}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: '#F6F6F6'
  },
  info: {
    fontSize: 16, 
    paddingRight: 50, 
    paddingLeft: 50, 
    paddingTop: 20, 
    color: '#257DD9'
  }
});