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
      loading:true,
      todayData:null
    };
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
  async componentDidMount(){
    await this.doFirst();
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
    for (var i = 0; i < 7; i++) {
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
  setTodayDate=(day)=>{
    this.setState({todayData:null,loading:true});
    var date='day'+day;
    for (var i = 1; i < 4; ++i) {
      var cycle='cycle'+i;
      var check=this.state.data[date][cycle][0];
      if(check!='undefined'){
        this.setState({todayData:this.state.data[date]});
        break;
      }
    }
  }
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
            {
              this.state.todayData==null ? <NoToday/>:<BigView data={this.state.todayData}/>
            }
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
  console.log("no Today");
  return(
    <View style={styles.TodayView}>
      <Text>
        Sorry but you haven't voted today
      </Text>
    </View>
  );
}

BigView = (props) => {
  var a = Array();
  for (var i = 1; i <= 3; ++i) {
    var cycle='cycle'+i;
      if(props.data[cycle][0]!='undefined'){
        a[i]=true;
      }else{a[i]=false;}
  }
  return (
    <View style={styles.TodayView}>
      {
        a[0] ? <TodayView data={props.data['cycle1'][0]}/>:<BlankBig/>
      }
      {
        a[1] ? <TodayView data={props.data['cycle2'][0]}/>:<BlankBig/>
      }
      {
        a[2] ? <TodayView data={props.data['cycle3'][0]}/>:<BlankBig/>
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
        <Text style={styles.TodayViewText}>{props.data.comment}</Text>
        <View style={styles.TodayViewTimeView}>
          <Text style={styles.TodayViewTime}>
            {props.data.time}
          </Text>
        </View>
      </View>
    </View>
  );
};

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
BlankBig=()=>{
  console.log('blank big');
  return(
    <View style={BlankBig}>
    </View>
  );
}
BlankSmall=()=>{
  return(
    <View style={BlankSmall}>
    </View>
  );
}
const styles = StyleSheet.create({
  BlankBig:{height:'15%'},
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
    borderRadius:15,
  },
  TodayViewText:{

  },
  TodayViewTimeView:{
    marginBottom:'2%',
    marginRight:'5%'
  },
  TodayViewTime:{

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