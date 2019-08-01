import React, { Component } from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity, Image, KeyboardAvoidingView, ActivityIndicator,AsyncStorage} from 'react-native';
import NavigationService from '../navigation/NavigationService';

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
            user_id:null
        };
    }
    vote=async () =>{
        const {navigation} =this.props;
        var date =navigation.getParam('info')[0];
        var cycle =navigation.getParam('info')[1];
        this.setState({date:date,cycle:cycle});
        try{
            var cellDate = await AsyncStorage.getItem('date');
            var cellCycle= await AsyncStorage.getItem('cycle');
            console.log(date);
            console.log(cellDate);
            if(date==cellDate){
                console.log(cycle);
                console.log(cellCycle);
                if(cycle==cellCycle){
                    this.setState({canVote:false});
                    await alert(this.state.canVote);
                }
            }
        }
        catch(e){
            console.log(e);
        }
    }
    async componentDidMount(){ /*no problem with this method*/
        await this.vote(); /*I doubt it*/
        try{
            var user = await AsyncStorage.getItem('user_id'); /*this is going ok*/
            this.setState({user_id:user});
        }catch(e){console.log(e)};
    }
    addMood = async() =>
    {
        if(this.state.canVote){
            const { navigation } = this.props;
            var mood=navigation.getParam('title');
            this.setState({loading:true});
            await this.postMethod('addMood','192.168.1.15',{
                comment:this.state.comment,
                rate:mood,
                cycle:this.state.cycle,
                user_id:this.state.user_id}); this /*one is also saving it all ok*/
            await AsyncStorage.setItem('date',this.state.date);
            await AsyncStorage.setItem('cycle',''+this.state.cycle);
            this.setState({loading:false});
        }
        else{
            alert('No more votes this cycle (But, maybe, in the future we would add some feature so that you could editthe vote)');
        }
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
    render()
    {
        const { navigation } = this.props;
        const emotionRoute = navigation.getParam('mood', require('../assets/images/emotions/happy.png'));
        const buttonColor = navigation.getParam('buttonColor', '#fefefe');
        const backgroundRoute = navigation.getParam('backgroundRoute', 
            require('../assets/images/background/happy-background.png'));
        const textFieldColor = navigation.getParam('textFieldColor', '#fefefe');
        return(
            <View style = { styles.MainContainer }>
                <Image source={backgroundRoute} style={styles.backgroundImage} resizeMode='stretch'/>
                <View style={{flex: 1}}>
                    <Image source={emotionRoute} style={styles.moodImage} resizeMode='stretch'/>
                </View>


                <View style={styles.Container}>
                    <Text style={styles.reasonText}>Would you like to share the reason?</Text>
                    <TextInput
                    style={[styles.ТextInput,{backgroundColor:buttonColor}]}
                    placeholder="It's optional"
                    onChangeText={(text) => this.setState({comment:text})}/>
                     <View style={{height:'40%'}}/>
                    
                    <TouchableOpacity style={[styles.TextInput,{backgroundColor:buttonColor}]} onPress={this.addMood}>
                        <View style={styles.shadow} >
                            <Text style = {styles.responseText}>Send my response</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={{height: '8%'}} />
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
    KeyboardAvoidingContainer:{
        width:'100%',
        height:'100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    TextInput:{
        paddingTop: 10,
        paddingBottom: 10,
        width:'100%',
        alignItems:'center',
        borderRadius: 25,
        shadowColor: "black",
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.30,
        shadowRadius: 3.84,
        elevation: 5              
    },
    MainContainer:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    Container:
    {
        flex: 1,
        alignItems:'center',
        width:'80%',
        borderRadius: 30,
        margin:'8%'
    },
    backgroundImage:{
        width:'100%',
        height:'100%',
        position:'absolute',
    },
    moodImage:{
        flex: 1,
        aspectRatio: 1,
        margin: 50,
        paddingTop: '10%'
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
    shadow:{
        margin: 5,
        shadowColor: "white",
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.20,
        shadowRadius: 3.84,
        elevation: 5,
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
 
