import React, {Component} from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class HistoryScreen extends React.Component {

	render() { 
	  return (
	    <View style={styles.container}>
	      <Text>History Page</Text>
	    </View>
	  );
	}
}

const styles = StyleSheet.create({
	container: {
		height:'100%',
		width: '100%'
	}
})