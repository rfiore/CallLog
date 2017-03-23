import React, { Component } from 'react';
import {
	View,
	Text, 
	StyleSheet,
	Image,
	TouchableOpacity
} from 'react-native';

import { NavigationActions } from 'react-navigation';

import Icon from 'react-native-vector-icons/Ionicons';

export default class Row extends Component {

	constructor(props) {
		super(props);

		this.goToMeeting = this.goToMeeting.bind(this);

	}

	goToMeeting(){
		this.props.navigation.dispatch(NavigationActions.navigate({ routeName: 'Meeting', params: this.props }));
	}

	render() {

		var meetingIcon;

		if(this.props.type === 'call') {
			meetingIcon = (<Icon name="ios-call" size={30} color="#4F8EF7" />);
		} else {
			meetingIcon = (<Icon name="ios-people" size={30} color="#4F8EF7" />);
		}

		var date1 = new Date(this.props.startAt);
		var date2 = new Date(this.props.endAt);
		var timeDiff = Math.abs(date2.getTime() - date1.getTime());
		var minutes = Math.floor(timeDiff / 60000);
  	var seconds = ((timeDiff % 60000) / 1000).toFixed(0);

  	//return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;

		return (
			<View style={ this.props.isOver ? styles.container : styles.containerRunning }>
				<TouchableOpacity onPress={this.goToMeeting} style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
					<View style={{ width: 38 }}>
						{meetingIcon}
					</View>
					<View>
						<Text style={styles.heading}>
							{this.props.name}
						</Text>
						<Text style={styles.text}>
							{this.props.subject}
						</Text>
						<Text style={styles.info}>
							<Text style={styles.label}>DURATION:</Text> {minutes} min {seconds} sec<Text style={styles.label}>   |   RATE:</Text> {this.props.rate} €
						</Text>
					</View>
				</TouchableOpacity>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 12
	},
	containerRunning: {
		flex: 1,
		padding: 12,
		backgroundColor: '#9ec0fa'
	},
	heading: {
		fontSize: 18,
		fontWeight: 'bold'
	},
	text: {
		fontSize: 16,
	},
	info: {
		marginTop: 6,
		fontWeight: 'bold',
		fontSize: 13
	},
	label: {
		fontWeight: 'normal',
		color: '#4F8EF7'
	}
});