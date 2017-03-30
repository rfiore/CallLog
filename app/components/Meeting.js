import React, { Component } from 'react';
import { connect } from 'react-redux';

import { bindActionCreators } from 'redux'
import { ActionCreators } from '../actions'

import { NavigationActions } from 'react-navigation';

import moment from 'moment';

import { onlyNumbers } from '../utils/utils';


import {
	Button,
	Text,
	View,
	ScrollView,
	StyleSheet,
	TextInput,
	TouchableOpacity
} from 'react-native';


class MeetingScreen extends Component {

	constructor(props) {
		super(props);

		this.stopMeeting = this.stopMeeting.bind(this);
		this.saveMeeting = this.saveMeeting.bind(this);
		this.viewContact = this.viewContact.bind(this);

		const params = this.props.navigation.state.params;

		this.state = {
			type: 					params.type,
			id: 						params.id,
			name: 					params.name,
			subject: 				params.subject,
			rate: 100,
			isOver: 				params.isOver,
			startAt: 				params.startAt,
			endAt: 					params.endAt,
			contacts: []
		}
	}

	static navigationOptions = {
		title: (navigation, childRouter) => {
			return navigation.state.params.name;
		}
	};

	stopMeeting() {
		this.props.stopMeeting({
			id: this.state.id
		});
	}

	saveMeeting() {
		console.log('meetings', this.props.meetings)
		this.props.saveMeeting({
			id: this.state.id,
			name: this.state.name,
			subject: this.state.subject,
			rate: this.state.rate
		});
	}

	viewContact(contact) {
		this.props.navigation.dispatch(NavigationActions.navigate({ routeName: 'Contact', params: { contact: contact }}));
	}

	componentWillReceiveProps(nextProps) {
		console.log(this.props.meetings, nextProps.meetings)
		if (this.props.meetings !== nextProps.meetings.byHash) {
			this.setState({
				endAt: nextProps.meetings[this.state.id].endAt,
				isOver: nextProps.meetings[this.state.id].isOver,
				contacts: nextProps.meetings[this.state.id].contacts,
			})
		}
	}

	render() {

		const navigate = this.props.navigation;

		var date1 = new Date(this.state.startAt);
		var date2 = new Date(this.state.endAt);
		var timeDiff = Math.abs(date2.getTime() - date1.getTime());
		var minutes = Math.floor(timeDiff / 60000);
  	var seconds = ((timeDiff % 60000) / 1000).toFixed(0);
  	var cost = (moment.duration(timeDiff).asHours() * this.state.rate).toFixed(2)

  	var self = this;
		
		var contactsList = this.state.contacts.map(function(contact, index) {
						return <TouchableOpacity key={index} onPress={() => self.viewContact(contact)} style={styles.settingTouch}>
										<Text style={styles.settingTouchText}>{contact.givenName} {contact.familyName}</Text>
									</TouchableOpacity>
					});

		return (
			<ScrollView style={styles.container}>

				{ /* Name */ }
				<Text style={styles.settingLabel}>NAME</Text>
				<TextInput
					style={styles.settingInput}
					onChangeText={(text) => this.setState({name: text})}
					value={this.state.name}
				/>

				{ /* Subject */ }
				<Text style={styles.settingLabel}>SUBJECT</Text>
				<TextInput
					style={styles.settingInput}
					onChangeText={(text) => this.setState({subject: text})}
					value={this.state.subject}
				/>

				{ /* Rate */ }
				<Text style={styles.settingLabel}>RATE PER HOUR</Text>
				<TextInput
					style={styles.settingInput}
					keyboardType = 'numeric'
					onChangeText={(text) => onlyNumbers(this, 'rate', text)}
					value={(this.state.rate).toString()}
				/>

				{ /* Type */ }
				<Text style={styles.settingLabel}>TYPE</Text>
				<Text style={styles.settingText}>{this.state.type}</Text>

				{ /* Start at */ }
				<Text style={styles.settingLabel}>STARTED</Text>
				<Text style={styles.settingText}>{moment(date1).format('MMMM Do YYYY, h:mm:ss a')}</Text>
				

				{ /* End at */ }
				<Text style={styles.settingLabel}>ENDED</Text>
				<Text style={styles.settingText}>{moment(date2).format('MMMM Do YYYY, h:mm:ss a')}</Text>

				{ /* Duration */ }
				<Text style={styles.settingLabel}>DURATION</Text>
				<Text style={styles.settingText}>{minutes} min {seconds} sec</Text>

				{ /* Cost */ }
				<Text style={styles.settingLabel}>COST</Text>
				<Text style={styles.settingText}>{cost} €</Text>

				{ /* Contacts */ }
				<Text style={styles.settingLabel}>PARTICIPANTS</Text>
				{contactsList}

				{ /* Add contact */ }
				<View style={styles.button}>
					<Button
						title='Add contact'
						onPress={() => navigate.dispatch(NavigationActions.navigate({ routeName: 'AddContact', params: {id: this.state.id} }))}
					/>
				</View>

				{ /* Stop meeting */ }
				{this.state.isOver == false &&
					<View style={styles.button}>
						<Button
							color='#D91E18'
							title='Stop meeting'
							onPress={this.stopMeeting}
						/>
					</View>
				}

				{ /* Save meeting */ }
				<View style={styles.buttonLast}>
					<Button
						title='Save meeting'
						onPress={this.saveMeeting}
					/>
				</View>

			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: '#FFFFFF',
	},
	input: {
		height: 40,
		fontSize: 16
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
		color: '#777777'
	},
	settingText: {
		height: 40,
		fontSize: 15,
		fontFamily: 'Poppins-Regular',
		marginBottom: 4,
		marginLeft: 4
	},
	settingTouch: {
		flex: 1,
		padding: 12,
		borderBottomWidth: 1,
		borderBottomColor: '#EEEEEE',
	},
	settingTouchText: {
		fontSize: 15,
		fontFamily: 'Poppins-Regular',
		color: '#4F8EF7',
	},
});

function mapDispatchToProps(dispatch) {
	return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
	console.log('mapStateToProps', state.meetings)
	return {
		meetings: state.meetings,
		isRunning: state.appState.isRunning,
	};
}


export default connect(mapStateToProps, mapDispatchToProps)(MeetingScreen);