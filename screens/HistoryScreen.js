import React, { Component } from 'react';
import { StyleSheet, AsyncStorage, View, Image, Text, TouchableOpacity,ActivityIndicator } from 'react-native';
import NavigationService from '../components/NavigationService';

export default class HistoryPage extends Component {
  constructor() {
    super();
    this.state = {
    	data:null,
      server:null,
      user_id:null,
      date:null,
      loading:true
    };
  };
  async componentDidMount(){
    await this.doFirst();
  };
  doFirst= async ()=>{
    var server=await AsyncStorage.getItem('server');
    var user_id= await AsyncStorage.getItem('user_id');
    var date=new Date();
    this.setState({server:server,user_id:user_id,date:date});
    await this.getData();
    console.log(this.state.data);
    this.setState({loading:false});
  }
  postMethod= async(method,methodUrl,methodBody)=>{
  	await fetch('http://'+methodUrl+'/alfa/'+method+'.php',
  	{
  	    method: 'POST',
  	    headers: 
  	    {
  	        'Accept': 'application/json',
  	        'Content-Type': 'application/json',
  	    },
  	    body: JSON.stringify(methodBody)

  	}).then((response) => response.json()).then((responseJsonFromServer) =>
  	{
  	    this.setState({data:responseJsonFromServer});
  	});
  };
  getData=async()=>{
    var data={};
    for (var i = 0; i < 7; i++) {
      var dateName='day'+(i+1);
      var array={};
      for (var j = 1; j < 4; j++) {
        this.setState({data:null});
        var cycleName ='cycle'+j;
        await this.postMethod('getMood',this.state.server,{user_id:this.state.user_id,cycle:j,day:i});
        if(typeof this.state.data !=='undefined'){array[cycleName]=this.state.data;}
      }
      data[dateName]=array;
    }
    this.setState({data:data});
    console.log(this.state.data.day1.cycle1[0].mood);
  };

  move(){
    NavigationService.navigate('Home');
  };
  render() {
    return (
      <View style={[styles.MainContainer,{backgroundColor:'white'}]}>
        {
          this.state.loading ? <ActivityIndicator color='#009688' size='large'style={styles.ActivityIndicatorStyle} /> : 
          <View style={styles.MainContainer}>
            <Image
              source={require('../assets/images/background/stats-background.png')}
              style={styles.BackgroundImage}
            />
            <View style={styles.TodayView}>
              <TodayView data={this.state.data} />
              <TodayView data={this.state.data} />
              <TodayView data={this.state.data} />
            </View>
            <View style={styles.ButtomView}>
              <TouchableOpacity onPress={this.move}>
                <ButtomView />
              </TouchableOpacity>
            </View>
            <View style={styles.HistoryView}>
              <HistoryView data={this.state.data} />
              <HistoryView data={this.state.data} />
              <HistoryView data={this.state.data} />
            </View>
          </View>
        }
      </View>
    );
  }
}
GetImage=(data)=>{
	switch (data.mood) {
		case "happy":
			data.image=require('../assets/images/emotions/happy.png');
			break;
		case "good":
			data.image=require('../assets/images/emotions/good.png');
			break;
		case "meh":
			data.image=require('../assets/images/emotions/meh.png');
			break;
		case "sad":
			data.image=require('../assets/images/emotions/sad.png');
			break;
		case "angry":
			data.image=require('../assets/images/emotions/angry.png');
			break;
		default:
			break;
	}
}

TodayView = (props) => {
  return (
    <View style={styles.TodayViewContainer}>
      <Image
        source={require('../assets/images/emotions/angry.png')}
        style={styles.TodayViewImage}
      />
      <View style={styles.TodayViewTextView}>
        <Text style={styles.TodayViewText}>let me write something</Text>
      </View>
    </View>
  );
};
BigView =(props)=>
{
	return
	(
		<View/>
	);
}
ButtomView = (props) => {
  return (
    <Image
      source={require('../assets/images/other/add.png')}
      style={styles.ButtonViewImage}
    />
  );
};
HistoryView = (props) => {
  return (
    <View style={styles.HistoryViewContainer}>
      <View style={styles.HistoryViewText}>
        <Image source={require('../assets/images/other/calendar.png')} style={styles.HistoryViewCalendar}/>
        <Text> date is here</Text>
      </View>
      <View style={styles.HistoryViewImageContainer}>
        <Image
          source={require('../assets/images/emotions/good.png')}
          style={styles.HistoryViewImage}
        />
        <Image
          source={require('../assets/images/emotions/happy.png')}
          style={styles.HistoryViewImage}
        />
        <Image
          source={require('../assets/images/emotions/good.png')}
          style={styles.HistoryViewImage}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  MainContainer: {
    flex:1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent:'center'
  },
  BackgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  TodayView: {
    width: '100%',
    height: '45%',
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  ButtomView: {
    width: '100%',
    height: '15%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  HistoryView: {
    width: '100%',
    height: '40%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  TodayViewContainer: {
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  TodayViewImage: {
    width: 60,
    height: 60,
  },
  TodayViewTextView: {
    width: '59%',
    backgroundColor: 'white',
    justifyContent:'center',
    alignItems:'center',
    borderRadius:15,
  },
  TodayViewText:{

  },
  ButtonViewImage: {
    width: 60,
    height: 60,
  },
  HistoryViewContainer: {
    width: '30%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:20,
  },
  HistoryViewText: {
    marginBottom:'2%',
    height:'10%',
    color:'blue',
    flexDirection:'row'
  },
  HistoryViewCalendar:{
    width:20,
    height:20
  },
  HistoryViewImageContainer: {
    width: '80%',
    height: '75%',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'gold',
    borderRadius:20,
  },
  HistoryViewImage: {
    width: 30,
    height: 30,
  },
});
