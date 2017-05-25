import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { ActionCreators } from '../actions'
import { NavigationActions } from 'react-navigation';
import moment from 'moment';
import PushNotification from 'react-native-push-notification';
import Spinner from 'react-native-loading-spinner-overlay';
import timer from 'react-native-timer';
import Contacts from 'react-native-contacts';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { onlyNumbers, getFirstItem, isEmpty, convertCurrency } from '../utils/utils';

import ContactInfo from './ContactInfo';

import {
	Button,
	Text,
	View,
	ScrollView,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	Linking,
	Picker,
} from 'react-native';


class MeetingScreen extends Component {

	constructor(props) {
		super(props);

		this.stopMeeting = this.stopMeeting.bind(this);
		this.saveMeeting = this.saveMeeting.bind(this);
		this.removeMeeting = this.removeMeeting.bind(this);
		this.runTimer = this.runTimer.bind(this);
		this.tick = this.tick.bind(this);

		const curId = this.props.navigation.state.params.id;
		const curMeeting = this.props.state.meetings[curId];
		const contactRecordID = curMeeting.contactRecordID;
		var contact = this.props.state.appState.contactsObj[contactRecordID];
		console.log('contact', contact);

		if( contact === undefined ){
			contact = {
				  recordID: '',
				  company: "",
				  emailAddresses: [],
				  familyName: "",
				  givenName: "",
				  jobTitle: "",
				  middleName: "",
				  phoneNumbers: [],
				  thumbnailPath: ''
				}
		}



		this.state = {
			type: 					curMeeting.type,
			contactIndex: 	curMeeting.contactIndex,
			id: 						curMeeting.id,
			type:  					curMeeting.type,
			name: 					curMeeting.name,
			subject: 				curMeeting.subject,
			rate: 					curMeeting.rate,
			isOver: 				curMeeting.isOver,
			isRunning: 			curMeeting.isRunning,
			startAt: 				curMeeting.startAt,
			endAt: 					curMeeting.endAt,
			cost:  					curMeeting.cost,

			contact: 				contact,
			partecipants: 	curMeeting.partecipants,
			calendarEvent: 	curMeeting.calendarEvent,
			currency: 			curMeeting.currency,
			isLoading: 			false,

			givenName: 			isEmpty(contact.givenName),
			familyName: 		isEmpty(contact.familyName),
			number: 				getFirstItem(contact.phoneNumbers, 'number'),
			email: 					getFirstItem(contact.emailAddresses, 'email'),
			company: 				isEmpty(contact.company),
			department: 		isEmpty(contact.department),
		}
	}

	static navigationOptions = ({ navigation, screenProps }) => ({
		title: navigation.state.params.name
	});


	// ACTIONS
	// -------------------------------------------------------------------------------------

	stopMeeting() {
		this.setState({isLoading: true});

		PushNotification.cancelAllLocalNotifications();
		timer.clearInterval(this, 'tick');
		this.props.stopMeeting({
			id: this.state.id,
			cost: this.state.cost,
			endAt: (new Date()).toJSON()
		});

		this.setState({isLoading: false});
	}

	removeMeeting() {
		this.setState({isLoading: true});

		this.props.removeMeeting({
			id: this.state.id
		});

		this.setState({isLoading: false});
	}

	saveMeeting() {
		this.setState({isLoading: true});
		//TO DO: Clean up state obj
		var updatedContact = Object.assign({}, this.state.contact);
		
		updatedContact.givenName = this.state.givenName;
		updatedContact.familyName = this.state.familyName;
		updatedContact.company = this.state.company;
		updatedContact.department = this.state.department;
		updatedContact.phoneNumbers.number = this.state.number;

		if( updatedContact.emailAddresses[0] === undefined ) {
			updatedContact.emailAddresses.push({
				label: "work",
    		email: this.state.email,
			}) 
		} else {
			updatedContact.emailAddresses[0].email = this.state.email;
		}
		
		console.log(updatedContact);
		// Update android contact list
		Contacts.updateContact(updatedContact, (err) => { console.log('updateContact callback', err) });

		// Save new internal contact list
		var newContactsList = this.props.state.appState.contacts.slice(0);
		newContactsList[this.state.contactIndex] = updatedContact;

		this.props.saveContactList({
			contacts: newContactsList
		});

		// Save meeting and contact details
		this.props.saveMeeting({
			id: this.state.id,
			name: this.state.name,
			subject: this.state.subject,
			rate: this.state.rate,
			contact: updatedContact
		});

		this.setState({isLoading: false});
	}

	// TIMER
	// -------------------------------------------------------------------------------------
	runTimer() {
		timer.setInterval(this, 'tick', this.tick, 1000);
	}

	tick() {
		//console.log('meeting tick');
		var date1 = new Date(this.state.startAt);
		var date2 = new Date()
		var timeDiff = Math.abs(date2.getTime() - date1.getTime());
		var cost = (moment.duration(timeDiff).asHours() * this.state.rate).toFixed(2)

		this.setState({
			cost: cost,
			endAt: date2
		});
	}

	// LIFE CYCLE
	// -------------------------------------------------------------------------------------

	componentWillReceiveProps(nextProps) {
		if (this.props.state.meetings !== nextProps.state.meetings) {
			if(nextProps.state.meetings[this.state.id]){
				this.setState({
					isOver: nextProps.state.meetings[this.state.id].isOver,
					isRunning: nextProps.state.meetings[this.state.id].isRunning,
					contacts: nextProps.state.meetings[this.state.id].contacts,
					calendarEvent: nextProps.state.meetings[this.state.id].calendarEvent,
				}, function(){
					//console.log('meetings props:', 'isOver', nextProps.state.isOver, 'isRunning', nextProps.state.isRunning);
					if(this.state.isOver && !this.state.isRunning){
						timer.clearInterval(this, 'tick');
					}
				});
			}
		}
	}

	componentDidMount() {
		if(!this.state.isOver && this.state.isRunning){
			this.runTimer();
		}
	}

	componentWillUnmount() {
		//console.log('unmont meeting')
		timer.clearInterval(this, 'tick');
	}


	// RENDER
	// -------------------------------------------------------------------------------------

	render() {

		const navigate = this.props.navigation;


		var date1 = new Date(this.state.startAt);
		var date2 = new Date(this.state.endAt)
		var timeDiff = Math.abs(date2.getTime() - date1.getTime());
		var minutes = Math.floor(timeDiff / 60000);
		var seconds = ((timeDiff % 60000) / 1000).toFixed(0);

		var self = this;
		
		var partecipantsList = this.state.partecipants.map(function(partecipant, index) {
						let partecipantLink = 'content://com.android.contacts/contacts/' + partecipant.recordID; 

						return <TouchableOpacity key={index} onPress={() => Linking.openURL(partecipantLink)} style={styles.settingTouch}>
										<Text style={styles.settingTouchText}>{partecipant.givenName} {partecipant.familyName}</Text>
									</TouchableOpacity>
					});


		var calendarEvent;
		var calendarLink;

		var contactLink = 'content://com.android.contacts/contacts/' + this.state.contact.recordID; 
		var contactButton = <Button title='Edit contact' onPress={() => Linking.openURL(contactLink)}/>
		
		if(this.state.calendarEvent !== {}) {
			calendarLink = 'content://com.android.calendar/events/' + this.state.calendarEvent.id;

			calendarEvent = <TouchableOpacity onPress={() => Linking.openURL(calendarLink)} style={styles.settingTouch}>
												<Text style={styles.settingTouchText}>{self.state.calendarEvent.title}</Text>
											</TouchableOpacity>
		} else {
			calendarEvent = "";
		}

		var contactName = "";
		contactName += isEmpty(this.state.contact.givenName) + ' ';
		contactName += isEmpty(this.state.contact.familyName) + ' ';
		

		return (
			<KeyboardAwareScrollView style={styles.container}>
				{this.state.type != 'activity' && (
					<View>
						{ /* Contact heading */ }
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
					</View>
				)}

				{ /* Meeting heading */ }
				<Text style={styles.heading}>
					Meeting details
				</Text>

				{ /* Name */ }
				<Text style={styles.settingLabel}>MEETING NAME</Text>
				<TextInput
					style={styles.settingInput}
					onChangeText={(text) => this.setState({name: text})}
					value={this.state.name}
				/>

				{ /* Subject */ }
				<Text style={styles.settingLabel}>MEETING SUBJECT</Text>
				<TextInput
					style={styles.settingInput}
					onChangeText={(text) => this.setState({subject: text})}
					value={this.state.subject}
				/>

				{ /* Rate */ }
				<Text style={styles.settingLabel}>RATE PER HOUR</Text>
				<View style={{ flex: 1, flexDirection: 'row' }}>
					<TextInput
						style={styles.settingInput}
						keyboardType = 'numeric'
						onChangeText={(text) => onlyNumbers(this, 'rate', text)}
						value={(this.state.rate).toString()}
					/>
					<Text style={{ width: 38, textAlign: 'center', paddingTop: 8 }}>{this.state.currency}</Text>
				</View>

				{ /* Type */ }
				<Text style={styles.settingLabel}>TYPE</Text>
				<Text style={styles.settingText}>{this.state.type}</Text>

				{this.state.startAt != null && (
					<View>
						{ /* Start at */ }
						<Text style={styles.settingLabel}>STARTED</Text>
						<Text style={styles.settingText}>{moment(this.state.startAt).format('MMMM Do YYYY, h:mm:ss a')}</Text>
						

						{ /* End at */ }
						<Text style={styles.settingLabel}>ENDED</Text>
						<Text style={styles.settingText}>{moment(this.state.endAt).format('MMMM Do YYYY, h:mm:ss a')}</Text>

						{ /* Duration */ }
						<Text style={styles.settingLabel}>DURATION</Text>
						<Text style={styles.settingText}>{minutes} min {seconds} sec</Text>

						{ /* Cost */ }
						<Text style={styles.settingLabel}>COST</Text>
						<Text style={styles.settingText}>{this.state.cost} {this.state.currency}</Text>
					</View>
				)}

				{ /* Currency */ }
				<Text style={styles.settingLabel}>CURRENCY</Text>
				<Picker
					selectedValue={this.state.currency}
					onValueChange={(currency) => convertCurrency(self, currency)}>
					<Picker.Item label="EUR" value="EUR" />
					<Picker.Item label="GBP" value="GBP" />
					<Picker.Item label="USD" value="USD" />
					<Picker.Item label="AUD" value="AUD" />
					<Picker.Item label="CAD" value="CAD" />
					<Picker.Item label="JPY" value="JPY" />
					<Picker.Item label="TRY" value="TRY" />
					<Picker.Item label="RUB" value="RUB" />
				</Picker>


				{ /* Partecipant */ }
				<Text style={styles.settingLabel}>PARTICIPANTS</Text>
				{partecipantsList}

				{ /* Add partecipant */ }
				<View style={styles.button}>
					<Button
						title='Add partecipants'
						onPress={() => navigate.dispatch(NavigationActions.navigate({ routeName: 'AddPartecipant', params: {id: self.state.id, type:"partecipant"} }))}
					/>
				</View>

				{ /* Events */ }
				<Text style={styles.settingLabel}>EVENTS</Text>
				{calendarEvent}

				{ /* Add event */ }
				<View style={styles.button}>
					<Button
						title='Add event'
						onPress={() => navigate.dispatch(NavigationActions.navigate({ routeName: 'AddEvent', params: {id: self.state.id} }))}
					/>
				</View>

				{ /* Remove meeting */ }
				{!this.state.isRunning &&
					<View style={styles.button}>
						<Button
							color='#D91E18'
							title='Remove meeting'
							onPress={this.removeMeeting}
						/>
					</View>
				}

				{ /* Stop meeting */ }
				{this.state.isRunning == true &&
					<View style={styles.button}>
						<Button
							color='#D91E18'
							title='Stop meeting'
							onPress={this.stopMeeting}
						/>
					</View>
				}

				{ /* Save meeting */ }
				{this.state.startAt != null &&
					<View style={styles.buttonLast}>
						<Button
							title='Save meeting'
							onPress={this.saveMeeting}
						/>
					</View>
				}
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
	heading: {
		fontSize: 18,
		fontFamily: 'Poppins-Regular',
		marginLeft: 4,
		marginBottom: 16,
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
		flex: 1,
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
	return {
		state: state,
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(MeetingScreen);