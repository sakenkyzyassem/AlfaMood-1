
import React, { Component } from 'react';
import { StyleSheet, View, TextInput, Text, ActivityIndicator, TouchableOpacity,Image,AsyncStorage} from 'react-native';

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
          server:null,
          ready:false
        }
    }
    async componentDidMount(){
        await this.checkUser();
        var server= await AsyncStorage.getItem('server');
        this.setState({server:server});
        console.log(server);
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
        await this.postMethod('checkCode',this.state.server,{code:this.state.department_code});
        this.setState({loading:false})
        this.move();
    }
    checkDep=async()=>{
        try{
            this.setState({department_id:this.state.data[0]['department_id']});
            await AsyncStorage.setItem('department_id',this.state.department_id);
            await this.checkUser();
        }
        catch(e){
            alert("Wrong Code!")
        }
    }
    checkUser= async()=>{
        var user_id= await AsyncStorage.getItem('user_id');    
        if(user_id==null){
            this.setState({ready:true});
        }
        else{
            this.props.navigation.navigate('Home');
        }
    }
    addUser=async()=>{
        this.setState({loading:true});
        await this.postMethod('addUser',this.state.server,{department_id:this.state.department_id});
        this.setState({loading:false,user_id:this.state.data[0][0]});
        AsyncStorage.setItem('user_id',this.state.user_id);
    }
    move = () => {
        this.checkDep();
        this.props.navigation.navigate('Home');
    }
    render()
    {
        if(this.state.ready){
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
        else{
            return(
                <View style={[styles.MainContainer,{backgroundColor:'white'}]}>
                    <ActivityIndicator color='#009688' size='large'style={styles.ActivityIndicatorStyle} />
                </View>
            );
        }
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