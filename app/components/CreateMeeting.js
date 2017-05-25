import React, { Component } from 'react';
import { connect } from 'react-redux';

import { bindActionCreators } from 'redux'
import { ActionCreators } from '../actions'

import { NavigationActions } from 'react-navigation';

import { phonecall } from 'react-native-communications';

import moment from 'moment';

import Icon from 'react-native-vector-icons/Ionicons';

import Contacts from 'react-native-contacts';

import {PhoneNumberFormat, PhoneNumberUtil} from 'google-libphonenumber';

import Spinner from 'react-native-loading-spinner-overlay';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { onlyNumbers, searchContact, isEmpty, getFirstItem } from '../utils/utils';

import {
	Button,
	Text,
	View,
	ScrollView,
	StyleSheet,
	TextInput
} from 'react-native';


class CreateMeetingScreen extends Component {

	constructor(props) {
		super(props);

		this.addMeeting = this.addMeeting.bind(this);
		
		this.state = {
			isLoading: false,
			name: '',
			subject: '',
			rate: this.props.state.settings.rate,
			currency: this.props.state.settings.currency,
			number: getFirstItem(this.props.state.appState.tempContact.phoneNumbers, 'number'),
			givenName: isEmpty(this.props.state.appState.tempContact.givenName),
			familyName: isEmpty(this.props.state.appState.tempContact.familyName),
			company: isEmpty(this.props.state.appState.tempContact.company),
			department: isEmpty(this.props.state.appState.tempContact.department),
			email: getFirstItem(this.props.state.appState.tempContact.emailAddresses, 'email'),
		}
	}

  static navigationOptions = {
		tabBarIcon: <Icon name="ios-people" size={28} color='#4F8EF7' />
  };

	// ACTIONS
	// -------------------------------------------------------------------------------------

	addMeeting() {
		this.setState({ isLoading: true });

		var self = this;
		var meetingId = moment().format();
		var contactList = this.props.state.appState.contacts.slice(0);

		// Check if contact exist
		var contact = searchContact(contactList, self.state.number);
		console.log('callback first addContact', contact);

		var contactName = '';

		if(contact.data){
			console.log('contact exist', 'index:', contact.index);

			if(this.state.givenName !== '') contactName += this.state.givenName + ' ';
			if(this.state.familyName !== '') contactName += this.state.familyName + ' ';

			// Start new meeting
			self.props.addMeeting({
				contactIndex: contact.index,
				contactRecordID: contact.recordID,
				id: meetingId,
				name: 'Meeting with ' + contactName,
				subject: "",
				rate: self.state.rate,
				startAt: (new Date()).toJSON(),
				number: self.state.number,
				currency: self.state.currency,
			});

			// TO DO: Updade android contact if changed

			// Add contact to meeting
			self.props.addContact({
				id: meetingId,
				contact: contact.data
			});

			self.setState({ isLoading: false });

		} else {
			if(this.state.givenName !== '') contactName += this.state.givenName + ' ';
			if(this.state.familyName !== '') contactName += this.state.familyName + ' ';

			if(contactName == '') contactName = self.state.number;
			console.log('Contact doesnt exist');
			// Create new contact
			var newContact = {
				givenName: contactName,
				familyName: self.state.familyName,
				company: self.state.company,
				department: self.state.department,
				phoneNumbers: [{
					label: "mobile",
					number: self.state.number,
				}],
				  emailAddresses: [{
			    label: "work",
			    email: self.state.email,
			  }],
			}

			// Add contact to android contact list
			Contacts.addContact(newContact, (err) => {
				console.log('New contact added', err);

				Contacts.getAll((err, contacts) => {
					
					console.log('callback addContact', err, contacts, self.state.number);
					var contact = searchContact(contacts, self.state.number);

					console.log(contact);
					self.props.addMeeting({
						contactIndex: contact.length,
						contactRecordID: contact.data.recordID,
						id: meetingId,
						name: 'Meeting with ' + contactName,
						subject: "",
						rate: self.state.rate,
						startAt: (new Date()).toJSON(),
						number: self.state.number,
						currency: self.state.currency,
					});

					this.props.saveContactList({
						contacts: contacts
					});

					// Add contact to meeting
					self.props.addContact({
						id: meetingId,
						contact: newContact
					});

					self.setState({ isLoading: false });
				});

/*				var contactName = "";
				contactName += this.state.givenName + ' ';
				contactName += this.state.familyName + ' ';

				// Start new meeting
				self.props.addMeeting({
					contactIndex: contact.length,
					id: meetingId,
					name: 'Meeting with ' + contactName,
					subject: "",
					rate: self.state.rate,
					startAt: (new Date()).toJSON(),
					number: self.state.number,
					currency: self.state.currency,
				});

				// Create new internal contact list with new contact
				// TO DO: sort array by name
				var newContactsList = contactList.slice(0);
				newContactsList.push(newContact);
				console.log('New contact list', newContactsList);

				// Save new internal contact list
				self.props.saveContactList({
					contacts: newContactsList
				});
				
				// Add contact to meeting
				self.props.addContact({
					id: meetingId,
					contact: newContact
				});
				console.log('addContact');*/

				
			})
		}
	}

	addContact(contact) {
		console.log('contact exist', 'index:', contact.index);

		var contactName = "";
		contactName += this.state.givenName + ' ';
		contactName += this.state.familyName + ' ';

		// Start new meeting
		self.props.addMeeting({
			contactIndex: contact.index,
			contactRecordID: contact.recordID,
			id: meetingId,
			name: 'Meeting with ' + contactName,
			subject: "",
			rate: self.state.rate,
			startAt: (new Date()).toJSON(),
			number: self.state.number,
			currency: self.state.currency,
		});

		// TO DO: Updade android contact if changed

		// Add contact to meeting
		self.props.addContact({
			id: meetingId,
			contact: contact.data
		});
	}

	// RENDER
	// -------------------------------------------------------------------------------------

	render() {

		const navigate = this.props.navigation;

		var now = (new Date()).toJSON();

		var contactName = "";
		contactName += this.state.givenName + ' ';
		contactName += this.state.familyName + ' ';

		const phoneUtil = PhoneNumberUtil.getInstance();
		let isValid = false;

		try {
			isValid =  phoneUtil.isValidNumber(phoneUtil.parse(this.state.number, 'GB'));
		} catch(e) {
			isValid = false;
			//console.log(e)
		}

		//console.log('createmeeting render');

		return (
			<KeyboardAwareScrollView style={styles.container}>

				<Text style={styles.screenTitle}>
					Add Meeting
				</Text>

				{!this.props.state.appState.isRunning && (
					<View>

						<Text style={styles.heading}>
							Contact details
						</Text>

						{ /* Contact */ }
						<Text style={styles.settingLabel}>CONTACT</Text>
						<Text style={styles.heading}>
							{contactName} 
						</Text>

						{ /* Given name */ }
						<Text style={styles.settingLabel}>GIVEN NAME</Text>
						<TextInput
							style={styles.settingInput}
							onChangeText={(text) => this.setState({givenName: text})}
							value={this.state.givenName}
						/>

						{ /* Family name */ }
						<Text style={styles.settingLabel}>FAMILY NAME</Text>
						<TextInput
							style={styles.settingInput}
							onChangeText={(text) => this.setState({familyName: text})}
							value={this.state.familyName}
						/>

						<Text style={styles.settingLabel}>NUMBER (Required)</Text>
						<TextInput
							style={styles.settingInput}
							keyboardType = 'numeric'
							onChangeText={(text) => onlyNumbers(this, 'number', text)}
							value={(this.state.number).toString()}
						/>

						{ /* email */ }
						<Text style={styles.settingLabel}>EMAIL</Text>
						<TextInput
							style={styles.settingInput}
							onChangeText={(text) => this.setState({email: text})}
							value={this.state.email}
						/>

						{ /* company */ }
						<Text style={styles.settingLabel}>COMPANY</Text>
						<TextInput
							style={styles.settingInput}
							onChangeText={(text) => this.setState({company: text})}
							value={this.state.company}
						/>

						{ /* department */ }
						<Text style={styles.settingLabel}>DEPARTMENT</Text>
						<TextInput
							style={styles.settingInput}
							onChangeText={(text) => this.setState({department: text})}
							value={this.state.department}
						/>

						{ /* Add contact */ }
						<View style={styles.buttonLast}>
							<Button
								title='Add contact'
								onPress={() => navigate.dispatch(NavigationActions.navigate({ routeName: 'AddPartecipant', params: {id: null, type:"contact"} }))}
							/>
						</View>

						<Text style={styles.heading}>
							Meeting details
						</Text>

						<Text style={styles.settingLabel}>MEETING NAME</Text>
						<TextInput
							style={styles.settingInput}
							onChangeText={(text) => this.setState({name: text})}
							value={this.state.name}
						/>

						<Text style={styles.settingLabel}>MEETING SUBJECT</Text>
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

						<View style={styles.buttonLast}>
							<Button
								disabled={ !isValid }
								title='Start meeting'
								onPress={this.addMeeting}
							/>
						</View>
					</View>
				)}

				{this.props.state.appState.isRunning && (
					<View>
						<Text style={styles.settingLabel}>WARNING</Text>
						<Text style={styles.heading}>Another event is already running</Text>
					</View>
				)}
				<Spinner visible={this.state.isLoading} textContent={""} textStyle={{color: '#FFF'}} overlayColor='rgba(0, 0, 0, 0.75)'/>

			</KeyboardAwareScrollView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: '#FFFFFF',
	},
	screenTitle: {
		fontSize: 21,
		color: '#4F8EF7',
		fontFamily: 'Poppins-Regular',
		marginLeft: 4,
		marginBottom: 16,
	},
	heading: {
		fontSize: 18,
		fontFamily: 'Poppins-Regular',
		marginLeft: 4,
		marginBottom: 16,
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
	return {
		state: state,
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateMeetingScreen);