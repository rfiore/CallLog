import React, { Component } from 'react';
import { connect } from 'react-redux';

import { bindActionCreators } from 'redux'
import { ActionCreators } from '../actions'

import { NavigationActions } from 'react-navigation';

import { phonecall } from 'react-native-communications';

import moment from 'moment';

import { onlyNumbers } from '../utils/utils';

import {
	Button,
	Text,
	View,
	StyleSheet,
	TextInput
} from 'react-native';


class CreateMeetingScreen extends Component {

	constructor(props) {
		super(props);

		this.addMeeting = this.addMeeting.bind(this);
		this.addCall = this.addCall.bind(this);


		this.state = {
			name: '',
			subject: '',
			rate: this.props.settings.rate,
			number: false
		}
	}

	static navigationOptions = {
		title: 'Create Meeting'
	};

	addMeeting() {

		//var meetingId = this.props.meetings.length;

		var meetingId = moment().format();

		this.props.addMeeting({
			id: meetingId,
			name: this.state.name,
			subject: this.state.subject,
			rate: this.state.rate,
			startAt: (new Date()).toJSON()
		});

/*		this.props.navigation.dispatch(NavigationActions.navigate({ routeName: 'Meeting', params: {
			id: meetingId,
			name: this.state.name,
			subject: this.state.subject,
			rate: this.state.rate,
			startAt: (new Date()).toJSON(),
			endAt: (new Date()).toJSON()
		}}));*/
	}

	addCall() {

		var meetingId = this.props.meetings.length;

		if(this.state.number) {
			this.props.addCall({
				id: meetingId,
				name: this.state.name,
				subject: this.state.subject,
				rate: this.state.rate,
				startAt: (new Date()).toJSON(),
				number: false
			});

			phonecall(this.state.number, true)

/*			this.props.navigation.dispatch(NavigationActions.navigate({ routeName: 'Meeting', params: {
				id: meetingId,
				name: this.state.name,
				subject: this.state.subject,
				rate: this.state.rate,
				startAt: (new Date()).toJSON(),
				endAt: (new Date()).toJSON()
			}}));*/
		}
	}

	render() {

		const navigate = this.props.navigation;

		var now = (new Date()).toJSON();

		return (
			<View style={styles.container}>

				<Text style={styles.settingLabel}>NAME</Text>
				<TextInput
					style={styles.settingInput}
					onChangeText={(text) => this.setState({name: text})}
					value={this.state.name}
				/>

				<Text style={styles.settingLabel}>SUBJECT</Text>
				<TextInput
					style={styles.settingInput}
					onChangeText={(text) => this.setState({subject: text})}
					value={this.state.subject}
				/>

				<Text style={styles.settingLabel}>RATE PER HOUR</Text>
				<TextInput
					style={styles.settingInput}
					keyboardType = 'numeric'
					onChangeText={(text) => onlyNumbers(this, 'rate', text)}
					value={(this.state.rate).toString()}
				/>

				<Text style={styles.settingLabel}>PHONE NUMBER</Text>
				<TextInput
					style={styles.settingInput}
					keyboardType = 'numeric'
					onChangeText={(text) => onlyNumbers(this, 'number', text)}
					value = {(this.state.number).toString()}
				/>

				<View style={styles.button}>
					<Button
						title='Start meeting'
						onPress={this.addMeeting}
					/>
				</View>

				<View style={styles.buttonLast}>
					<Button
						disabled={ this.state.number ? false : true }
						title='Start call'
						onPress={this.addCall}
					/>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: '#FFFFFF',
	},
	button: {
		marginBottom: 10,
	},
	buttonLast: {
		marginBottom: 60,
	},
	settingLabel: {
		fontSize: 12,
		fontFamily: 'Poppins-Medium',
		color: '#4F8EF7',
		height: 20,
		marginLeft: 4
	},
	settingInput: {
		height: 40,
		fontSize: 15,
		fontFamily: 'Poppins-Regular',
		marginBottom: 16,
	},
});

function mapDispatchToProps(dispatch) {
	return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {

	const meetingArr = state.meetingsById.map((item, index) => {
	   return state.meetings[item]
	});

	return {
		meetings: meetingArr,
		settings: state.settings
	};
}


export default connect(mapStateToProps, mapDispatchToProps)(CreateMeetingScreen);