import React, { Component } from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity, Image, KeyboardAvoidingView, ActivityIndicator,AsyncStorage} from 'react-native';

export default class ReasonScreen extends Component
{
    constructor()
    {
        super();
        this.state = { 
            comment:'', 
            mood:'',
            data:null,
            loading: false, 
            canVote:true,
            date:null,
            cycle:null,
            user_id:null,
            department_id:null,
            server:null
        };
    }
    vote=async () =>{
        try{
            var cellDate = await AsyncStorage.getItem('date');
            var cellCycle= await AsyncStorage.getItem('cycle');
            if(this.state.date==cellDate){
                if(this.state.cycle==cellCycle){
                    this.setState({canVote:false});
                }
            }
        }
        catch(e){
            console.log(e);
        }
    }
    async componentDidMount(){ 
        const {navigation} = this.props;
        var server=await AsyncStorage.getItem('server');
        var date =navigation.getParam('info')[0];
        var cycle =navigation.getParam('info')[1];
        this.setState({date:date,cycle:cycle,server:server});
        try{
            var user = await AsyncStorage.getItem('user_id');
            var department=await AsyncStorage.getItem('department_id');
            this.setState({user_id:user,department_id:department});
        }catch(e){console.log(e)};
    }
    addMood = async() =>
    {
        await this.vote();
        if(this.state.canVote){
            const { navigation } = this.props;
            var mood=navigation.getParam('title');
            this.setState({loading:true});
            await this.postMethod('addMood',this.state.server,{
                comment:this.state.comment,
                rate:mood,
                cycle:this.state.cycle,
                user_id:this.state.user_id,
                department_id:this.state.department_id}); 
            await AsyncStorage.setItem('date',this.state.date);
            await AsyncStorage.setItem('cycle',''+this.state.cycle);
            this.setState({loading:false});
            alert(this.state.data.data);
            this.props.navigation.navigate('History');
        }
        else{
            alert('No more votes this cycle (But, maybe, in the future we would add some feature so that you could editthe vote)');
            this.props.navigation.navigate('History');
        }
    }



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
    render()
    {
        const { navigation } = this.props;
            const emotionRoute = navigation.getParam('mood', require('../assets/images/emotions/happy.png'));
            const buttonColor = navigation.getParam('buttonColor', '#fefefe');
            const backgroundRoute = navigation.getParam('backgroundRoute', 
                require('../assets/images/background/happy-background.png'));
            const textFieldColor = navigation.getParam('textFieldColor', '#fefefe');
            return(
                <View style = { styles.mainContainer }>
                    <Image source={backgroundRoute} style={styles.backgroundImage} resizeMode='stretch'/>
                    <View style={{flex: 1}}>
                        <Image source={emotionRoute} style={styles.moodImage} resizeMode='contain'/>
                    </View>

                    <View style={styles.container}>
                        <Text style={styles.reasonText}>
                          Would you like to share the reason?
                        </Text>

                        <TextInput
                        style={{
                          backgroundColor: textFieldColor,
                          margin: 10,
                          padding: 10,
                          paddingLeft: 15,
                          width:'100%',
                          alignItems:'center',
                          borderRadius: 25,      
                        }}
                        onSubmitEditing = {this.addMood}
                        placeholder="It's optional"
                        onChangeText={(text) => this.setState({comment:text})}/>

                      <View style={{height: '30%'}}/>

                        <TouchableOpacity style={{
                          paddingTop: 10,
                          paddingBottom: 10,
                          backgroundColor: buttonColor,
                          width:'100%',
                          alignItems:'center',
                          borderRadius: 25,
                          shadowColor: "#ffffff",
                          shadowOffset: {
                            width: 0,
                            height: 2,
                          },
                          shadowOpacity: 0.30,
                          shadowRadius: 3.84,
                          elevation: 5,
                          }} onPress={this.addMood}>
                            <Text style = {styles.responseText}>Send my response</Text>
                        </TouchableOpacity>
                    </View>
                    {
                    this.state.loading ? <ActivityIndicator color='#009688' size='large'style={styles.ActivityIndicatorStyle} /> : null          
                    }
                </View>
        );
    }    
}
 
    const styles = StyleSheet.create(
    {
        mainContainer:
        {
            flex: 1,
            alignItems: 'center'
        },
        container:
        {
            flex: 1,
            alignItems:'center',
            justifyContent: 'space-between',
            width:'80%',
            borderRadius: 30,
            margin:'8%'
        },
        backgroundImage:
        {
            width:'100%',
            height:'100%',
            position:'absolute',
        },
        moodImage:{
            flex: 1,
            aspectRatio: 1,
            margin: 50,
            marginTop: '15%'
        },
        reasonText:{
          color: 'white', 
          fontSize: 18, 
          alignSelf: 'flex-start',
          marginTop: '15%'
        },
        responseText:{
          color: 'white', 
          fontSize: 18
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
    })