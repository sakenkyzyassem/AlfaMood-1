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
      todayData:null,
      timeZone:null
    };
  };
  postMethod= async(method,methodUrl,methodBody)=>{
        await fetch('https://'+methodUrl+'/alfa/'+method+'.php',
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
  async componentDidMount(){
    await this.doFirst();//get server info, get info about user , get the data
    this.setTodayDate(0);
    this.setState({loading:false});

  };
  doFirst= async ()=>{
    var server=await AsyncStorage.getItem('server');
    var timeZone=await AsyncStorage.getItem('timeZone');
    var user_id= await AsyncStorage.getItem('user_id');
    var date=new Date();
    this.setState({server:server,user_id:user_id,date:date,timeZone:timeZone});
    await this.getData();
  }
  getData=async()=>{
    try{await this.postMethod('getMood',this.state.server,{user_id:this.state.user_id,timeZone:this.state.timeZone});}
    catch(e){this.setState({loading:false});alert("Что то пошло не так. Данные не загрузились .Проверьте подключение к интернету");}
  }
  refresh=async()=>{
    this.setState({loading:true});
    await this.getData();
    this.setState({loading:false});
  }
  setTodayDate=(day)=>{
    console.log(this.state.data);
    console.log('data');
    console.log(day);
    var data=this.state.data.filter(filterByDay(day));
    console.log(data);
    this.setState({todayData:data});
  }
  move(){
    NavigationService.navigate('Home');
  };
  render() {
    return (
      <View style={[styles.MainContainer,{backgroundColor:'white'}]}>
        {
          this.state.loading ?  
          <View>
            <ActivityIndicator color='#009688' size='large' style={styles.ActivityIndicatorStyle} />
            <Text style={{alignItems:'center',justifyContent:'center',textAlign:'center',color:'#257DD9',fontStyle: 'italic',fontSize:20}}>
            Идет загрузка данных ...
            </Text>
          </View>
          
          :
          
          <View style={styles.MainContainer}>

            <Image
              source={require('../assets/images/background/stats-background.png')}
              style={styles.BackgroundImage}
            />
            {
              this.state.todayData==null ? 
              <View style={styles.TodayView}>
                <Text style={{alignItems:'center',justifyContent:'center',textAlign:'center',color:'#257DD9',fontStyle: 'italic',fontSize:20}}>
                Нет данных
                </Text>
                <Text style={{alignItems:'center',justifyContent:'center',textAlign:'center',color:'#257DD9',fontStyle: 'italic',fontSize:20}}>
                Нажмите на желтый контейнер
                </Text>
              </View>
              :
              <BigTodayView data={this.state.todayData}/>
            }

            <TouchableOpacity style={{height: '10%',justifyContent:'center',alignItems:'center'}} onPress={()=>this.refresh()}>
              <Image source={require('../assets/icons/refresh.png')} style={{width:30,height:30}}/>
            </TouchableOpacity>
            {
              this.state.data==null ?<NoData/>:<BigHistoryView data={this.state.data} handlePress={(day)=>this.setTodayDate(day)}/>
            }

          </View>
        }
      </View>
    );
  }
}
filterByDay=(day)=>{
  var desiredDay=new Date().getDate()-day;
  return (element)=>{
    var dayData=new Date(element.date).getDate();
    return dayData==desiredDay;
  }
}
filterByCycle=(cycle)=>{
  return (element)=>{
    return element.cycle==cycle;
  }
}
GetImage=(data)=>{
  console.log('getting image');
  var mood=data.mood;
  console.log(mood);
	switch (mood) {
		case "happy":
			return require('../assets/images/emotions/happy.png');
			break;
		case "good":
			return require('../assets/images/emotions/good.png');
			break;
		case "meh":
			return require('../assets/images/emotions/meh.png');
			break;
		case "sad":
			return require('../assets/images/emotions/sad.png');
			break;
		case "angry":
			return require('../assets/images/emotions/angry.png');
			break;
		default:
    return null;
			break;
  }
}

NoData=()=>{
  return(
    <View style={styles.TodayView}>
      <Text style={{alignItems:'center',justifyContent:'center',textAlign:'center',color:'#257DD9',fontStyle: 'italic',fontSize:20}}>
      Нет данных
      </Text>
    </View>
  );
}

BigTodayView = (props) => {
  var a=props.data;
  console.log(a);
  console.log("Big today data");
  var data=[];
  for(var i = 0;i<3;i++){
    var array=a.filter(filterByCycle(i+1))[0];
    console.log(array);
    console.log('big today data here');
    if (array !== undefined && array.length != 0) {
      data.push(<TodayView data={array} key={i}/>)
    }
    else{
      data.push(<BlankBig key={i}/>);
    }
  }
  return (
    <View style={styles.TodayView}>
      {data}
    </View>
  );
};
TodayView = (props) => {
  return (
    <View style={styles.TodayViewContainer}>
      <Image
        source={GetImage(props.data)}
        style={styles.TodayViewImage}
      />
      <View style={styles.TodayViewTextView}>
        <View style = {styles.TodayDateInfo}>
          <Text>ЦИКЛ {props.data.cycle}</Text>
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
  var a=props.data;
  var data=[];
  for(var i = 0;i<3;i++){
    console.log(i);
    var array=a.filter(filterByDay(i));
    if (array !== undefined && array.length != 0) {
      data.push(<HistoryView data={array} handlePress={(day)=>props.handlePress(day)} day={i} key={i}/>)
    }
    else{
      data.push(<BlankNorm key={i}/>);
    }
  }
  return (
    <View style={styles.HistoryView}>
      {data}
    </View>
  );
};
HistoryView = (props) => {
  var a=props.data;
  var data=[];
  for(var i = 0;i<3;i++){
    console.log(i);
    var element=a.filter(filterByCycle(i+1))[0];
    if (element !== undefined && element.length != 0) {
      data.push(<Image source={GetImage(element)} style={styles.HistoryViewImage} key={i}/>)
    }
    else{
      data.push(<BlankSmall key={i}/>);
    }
  }
  return (
    <View style={styles.HistoryViewContainer}>
      <View style={styles.HistoryViewText}>
        <Image source={require('../assets/images/other/calendar.png')} style={styles.HistoryViewCalendar}/>
        <Text>{a[0].date}</Text>
      </View>
      <TouchableOpacity style={styles.HistoryViewImageContainer} onPress={()=>props.handlePress(props.day)}>
        {data}
      </TouchableOpacity>
    </View>
  );
};

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