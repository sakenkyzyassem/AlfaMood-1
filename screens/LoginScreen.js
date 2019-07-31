import React, { Component } from 'react';
import { StyleSheet, View, TextInput, Text, ActivityIndicator, TouchableOpacity,Image} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

export default class LogInPage extends Component
{
    constructor()
    {
        super();
        this.state = {  
          user_id: '',
          department_code: '',
          department_id:'',
          loading: false, 
          data:null,
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
    signUp = async () =>
    {
        this.setState({loading:true,department_id:''});
        await this.postMethod('checkCode','192.168.1.15',{code:this.state.department_code});
        this.setState({loading:false})
        this.move();
    }
    checkDep=async()=>{
        try{
            this.setState({department_id:this.state.data[0]['department_id']});
            alert("Your code is okay, now checking if the user exists");
            await this.checkUser();
        }
        catch(e){
            alert("Wrong Code!")
        }
    }
    checkUser= async()=>{
        try{
            await AsyncStorage.getItem('user_id');
        }
        catch{
            alert("No user detected, creating");
            this.setState({loading:true});
            await this.postMethod('addUser','192.168.1.15',{department_id:this.state.department_id});
            this.setState({loading:false,user_id:data[0][0]['id']});
            alert(this.state.user_id);
            AsyncStorage.setItem('user_id',this.state.user_id);
        }
    }
    move = () => {
        this.checkDep();
        if(this.state.department_id!=''){
            this.props.navigation.navigate('Home');
        }
    }
    render()
    {
        return(
            <View style = { styles.MainContainer }>
                <Image source={require('../assets/images/image.png')}/>
                
                <View style={styles.Container}>
                    
                    <TextInput
                    style={{borderBottomColor:'gray',marginTop:15,marginLeft:10,textAlign:'center'}}
                    placeholder='Enter the department code'
                    onChangeText={(text) => this.setState({department_code:text})}/>
                    
                    <View style={{height:'50%'}}/>
                    
                    <TouchableOpacity style={styles.TouchableOpacityStyle} onPress={this.signUp}>
                        <Text>Sign up</Text>
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
    MainContainer:
    {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'red'

    },
    Container:
    {
        alignItems:'center',
        backgroundColor:'white',
        height:'40%',
        width:'80%',
        borderRadius: 30,
        marginLeft:'5%',
        marginRight:'5%',
    },
 
    TouchableOpacityStyle:
    {
        paddingTop:10,
        paddingBottom:10,
        backgroundColor:'#fcb604',
        marginBottom: 20,
        width: '80%',
        alignItems:'center',
        borderRadius:15,

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