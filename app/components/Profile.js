import React, { Component } from 'react';
import {
	Text,
	View,
	StyleSheet
} from 'react-native';

export default class ProfileScreen extends Component {

  static navigationOptions = {
		title: 'Profile',
  };

  render() {
		const navigate = this.props.navigation;
		
		return (
			<View style={styles.container}>
				<Text style={styles.welcome}>
					Profile Screen
				</Text>
			</View>
		);
  }
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#F5FCFF',
	},
	welcome: {
		fontSize: 20,
		textAlign: 'center',
		margin: 10,
	},
	instructions: {
		textAlign: 'center',
		color: '#333333',
		marginBottom: 5,
	},
});