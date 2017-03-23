import React, { Component } from 'react';
import {
	View,
	Text,
	StyleSheet,
	Navigator,
	TouchableHighlight,
	TouchableOpacity
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

export default class Meeting extends Component {

	parseDate(){

	}

	render() {

		var meetingDate = new Date(this.props.data.startAt);
		var meetingDay = meetingDate.toDateString();

		return (
			<View style={styles.container}>
				<Icon.Button name="ios-arrow-back" size={20} color="#FFFFFF" onPress={this.props.navigator.pop}>
					<Text style={{color: '#FFFFFF', fontSize: 14}}>Go back to meetings</Text>
				</Icon.Button>
				<Text style={styles.heading}>
						{this.props.data.name}
					</Text>
				<Text style={styles.text}>
					{this.props.data.subject}
				</Text>
				<Text style={styles.text}>
					Rate: {this.props.data.rate}
				</Text>
				<Text style={styles.text}>
					{meetingDay}
				</Text>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: '#FFFFFF',
	},
	heading: {
		marginTop: 20,
		fontSize: 18,
		fontWeight: 'bold'
	},
	text: {
		fontSize: 16,
	}
});