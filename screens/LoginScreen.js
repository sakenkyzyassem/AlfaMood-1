
import React, { Component } from 'react';
import { StyleSheet, View, TextInput, Text, ActivityIndicator, TouchableOpacity,Image,AsyncStorage,Dimensions } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import NavigationService from '../navigation/NavigationService';

let width = Dimensions.get('window').width;
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
        var server= await AsyncStorage.getItem('server');
        this.setState({server:server});
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
        this.setState({loading:true, department_id:''});
        await this.postMethod('checkCode',this.state.server,{code:this.state.department_code});
        this.setState({loading:false})
        this.move();
    }
    checkDep=async()=>{
        try{
            this.setState({department_id:this.state.data[0]['department_id']});
            await AsyncStorage.setItem('department_id',this.state.department_id);
            await this.addUser();
        }
        catch(e){
            alert("Wrong Code!")
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
        this.props.navigation.navigate('NavigatorStack');
    }
    render()
    {
        return(
            <View style = { styles.MainContainer }>
                
              <View style={styles.TopContainer}>
                <Image source={require('../assets/images/image.png')}/>
              </View>

              <View style={styles.Container}>
              
                <KeyboardAwareScrollView>  
                  <View>
                    <TextInput
                    style={styles.TextInput}
                    placeholder='Enter the department code'
                    onChangeText={(text) => this.setState({department_code:text})}
                    onSubmitEditing = {this.signUp}/>
                  </View>
                </KeyboardAwareScrollView>
                
                <View style={{paddingBottom: -5}}>
                  <TouchableOpacity style={styles.TouchableOpacityStyle} onPress={this.signUp}>
                      <Text style={{color: 'white'}}>Sign In</Text>
                  </TouchableOpacity>
                </View>

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
        alignItems: 'center',
        backgroundColor:'red',
        justifyContent: 'space-around'
    },

    TopContainer: 
    {
      height: '30%',
      paddingTop: '8%',
      paddingBottom: '8%'
    },

    TextInput: 
    {
      borderBottomColor:'gray', 
      marginTop:15, 
      marginLeft:10,
      textAlign:'center'
    },

    Container:
    {
        justifyContent: 'space-between',
        backgroundColor:'white',
        height:'53%',
        width:'80%',
        borderRadius: 30,
        margin:'5%',
        paddingTop: '8%',
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 5,
        },
        shadowOpacity: 0.5,
        shadowRadius: 8,

        elevation: 6,
    },
 
    TouchableOpacityStyle:
    {
        alignSelf: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor:'#fcb604',
        width: width*0.65,
        alignItems:'center',
        borderRadius: 20,
        shadowColor: "#B1B1B1",
        shadowOffset: {
          width: 3,
          height: 3,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,

        elevation: 4,
    }
});