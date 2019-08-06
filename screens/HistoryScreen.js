import React, { Component } from 'react';
import { StyleSheet, AsyncStorage, View, Image, Text, TouchableOpacity,ActivityIndicator } from 'react-native';
import NavigationService from '../components/NavigationService';

export default class HistoryPage extends Component {
  constructor() {
    super();
    this.setTodayDate=this.setTodayDate.bind(this);
    this.state = {
    	data:null,
      server:null,
      user_id:null,
      date:null,
      loading:true,
      todayData:null
    };
  };
  async componentDidMount(){
    await this.doFirst();//get server info, get info about user , get the data
    this.setTodayDate(1);
    this.setState({loading:false});
  };
  doFirst= async ()=>{
    var server=await AsyncStorage.getItem('server');
    var user_id= await AsyncStorage.getItem('user_id');
    var date=new Date();
    this.setState({server:server,user_id:user_id,date:date});
    await this.getData();
  }
  getData=async()=>{
    var data={};
    for (var i = 0; i < 3; i++) {
      var dateName='day'+(i+1);
      var array={};
      for (var j = 1; j <= 3; j++) {
        this.setState({data:null});
        var cycleName ='cycle'+j;
        await this.postMethod('getMood',this.state.server,{user_id:this.state.user_id,cycle:j,day:i});
        try{
          array[cycleName]=this.state.data;
          var d=array[cycleName][0];
          GetImage(d);
        }catch(e){

        }
      }
      data[dateName]=array;
    }
    this.setState({data:data});
  };

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
  move(){
    NavigationService.navigate('Home');
  };
  setTodayDate=(day)=>{
    var date='day'+day;
    for (var i = 1; i < 4; ++i) {
      var cycle='cycle'+i;
      try{
        var check=this.state.data[date][cycle][0];
        if(typeof check!='undefined'){
          this.setState({todayData:this.state.data[date]});
          break;
        }
      }catch
      {}
    }
  }
  render() {
    return (
      <View style={[styles.MainContainer,{backgroundColor:'white'}]}>
        {
          this.state.loading ? <ActivityIndicator color='#009688' size='large' style={styles.ActivityIndicatorStyle} /> : 
          
          <View style={styles.MainContainer}>

            <Image
              source={require('../assets/images/background/stats-background.png')}
              style={styles.BackgroundImage}
            />
            {
              this.state.todayData==null ? <NoToday/>:<BigTodayView data={this.state.todayData}/>
            }

            <View style={{height: '10%'}} />
            
            <BigHistoryView data={this.state.data} handlePress={(day)=>this.setTodayDate(day)}/>

          </View>
        }
      </View>
    );
  }
}
GetImage=(data)=>{
  var mood=data.mood;
	switch (mood) {
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

NoToday=()=>{
  return(
    <View style={styles.TodayView}>
      <Text>
        Sorry but you haven't voted today
      </Text>
    </View>
  );
}

BigTodayView = (props) => {
  var a = Array();
  for (var i = 1; i <= 3; ++i) {
    var cycle='cycle'+i;
      if(typeof props.data[cycle][0]!='undefined'){
        a[cycle]=true;
      }else{a[cycle]=false;}
  }
  return (
    <View style={styles.TodayView}>
      {
        a['cycle1'] ? <TodayView data={props.data['cycle1'][0]} cycle={1}/>:<BlankBig/>
      }
      {
        a['cycle2'] ? <TodayView data={props.data['cycle2'][0]} cycle={2}/>:<BlankBig/>
      }
      {
        a['cycle3'] ? <TodayView data={props.data['cycle3'][0]} cycle={3}/>:<BlankBig/>
      }
    </View>
  );
};
TodayView = (props) => {
  return (
    <View style={styles.TodayViewContainer}>
      <Image
        source={props.data.image}
        style={styles.TodayViewImage}
      />
      <View style={styles.TodayViewTextView}>
        <View style = {styles.TodayDateInfo}>
          <Text>CYCLE {props.cycle}</Text>
          <Text>{props.data.time}</Text>
        </View>
        <View style={{height:60,width:1,backgroundColor:'black'}}/>
        <View style={styles.TodayCommentContainer}>
          <Text>{props.data.comment}</Text>
        </View>
      </View>
    </View>
  );
};

BigHistoryView = (props) => {
  var dates=Array();
  for (var day = 1; day < 4; ++day) {
    var date='day'+day;
    for (var i = 1; i < 4; ++i) {
      var cycle='cycle'+i;
      try{
        var check=props.data[date][cycle][0];
        if(typeof check !='undefined'){
          dates[day]=true;
          props.data[date].day=check.date;
        }
      }catch{}
    }
  }
  return (
    <View style={styles.HistoryView}>
      {
        dates[1] ? <HistoryView data={props.data['day1']} handlePress={()=>props.handlePress(1)}/>:<BlankNorm/>
      }
      {
        dates[2] ? <HistoryView data={props.data['day2']} handlePress={()=>props.handlePress(2)}/>:<BlankNorm/>
      }
      {
        dates[3] ? <HistoryView data={props.data['day3']} handlePress={()=>props.handlePress(3)}/>:<BlankNorm/>
      }
    </View>
  );
};
HistoryView = (props) => {
  var a = Array();
  for (var i = 1; i <= 3; ++i) {
    var cycle='cycle'+i;
    if(typeof props.data[cycle][0]!='undefined'){
      GetImage(props.data[cycle][0]);
      a[cycle]=true;
    }else{a[cycle]=false;}
  }
  return (
    <View style={styles.HistoryViewContainer}>
      <View style={styles.HistoryViewText}>
        <Image source={require('../assets/images/other/calendar.png')} style={styles.HistoryViewCalendar}/>
        <Text>{props.data.day}</Text>
      </View>
      <TouchableOpacity style={styles.HistoryViewImageContainer} onPress={props.handlePress}>
        {
          a['cycle1'] ? <Image source={props.data.cycle1[0].image} style={styles.HistoryViewImage}/>:<BlankSmall/>
        }

        {
          a['cycle2'] ? <Image source={props.data.cycle2[0].image} style={styles.HistoryViewImage}/>:<BlankSmall/>
        }
        {
          a['cycle3'] ? <Image source={props.data.cycle3[0].image} style={styles.HistoryViewImage}/>:<BlankSmall/>
        }
      </TouchableOpacity>
    </View>
  );
};

PopUp=(data)=>{
  return(
    <View style={styles.PopupContainer}>
      <View>
      </View>
    </View>
  );
}
BlankBig=()=>{
  return(
    <View style={styles.BlankBig}/>
  );
}
BlankNorm=()=>{
  return (
    <View style={styles.BlankNorm}/>
  );
}
BlankSmall=()=>{return(
    <View style={BlankSmall}>
    </View>
  );
}
const styles = StyleSheet.create({
  BlankBig:{height:'15%'},
  BlankNorm:{width: '30%',height: '100%',},
  BlankSmall:{height:30},
  MainContainer: {
    flex:1,
    flexDirection: 'column',
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
    flexDirection:'row',
    borderRadius:15,
  },
  TodayDateInfo:{
    width:'40%',
    alignItems:'center',
    justifyContent:'center'
  },
  TodayCommentContainer:{
    width:'60%',
    alignItems:'center',
    justifyContent:'center'
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
  ActivityIndicatorStyle:{
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
});