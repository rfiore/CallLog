import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { DeviceEventEmitter } from 'react-native';

import { addNavigationHelpers, StackNavigator, TabNavigator } from 'react-navigation';
import Notification from 'things-notification';
import PushNotification from 'react-native-push-notification';
//import PushNotificationAndroid from 'react-native-push-notification'
import moment from 'moment';
import Contacts from 'react-native-contacts';
import timer from 'react-native-timer';
import BackgroundTimer from 'react-native-background-timer';

import { addCall, addContact, stopMeeting } from '../actions/meeting';
import { saveContactList } from '../actions/settings';

import WelcomeScreen from '../components/Welcome';
import MainScreen from '../components/Main';
import CreateMeetingScreen from '../components/CreateMeeting';
import MeetingScreen from '../components/Meeting';
import SettingsScreen from '../components/Settings';
import ExportScreen from '../components/Export';
import AddPartecipantScreen from '../components/AddPartecipant';
//import ContactScreen from '../components/Contact'
import SearchScreen from '../components/Search';
import AddEventScreen from '../components/AddEvent';

import { searchContact, isEmpty } from '../utils/utils';

export const AppNavigator = StackNavigator({
	Welcome: 				{ screen: WelcomeScreen },
	Main: 					{ screen: MainScreen },
	CreateMeeting: 	{ screen: CreateMeetingScreen },
	Meeting: 				{ screen: MeetingScreen },
	AddPartecipant: { screen: AddPartecipantScreen },
	Settings: 			{ screen: SettingsScreen },
	Export: 				{ screen: ExportScreen },
	//Search: 				{ screen: SearchScreen },
	AddEvent: 			{ screen: AddEventScreen },
});

/*export const AppNavigator = TabNavigator({
	Test: 		{ screen: TestScreen },
	Settings: { screen: SettingsScreen },
}, {
	tabBarOptions: {
		activeTintColor: '#e91e63',
	},
});*/
PushNotification.registerNotificationActions(['Accept','Reject','Yes','No']);

class AppWithNavigationState extends React.Component {

	constructor(props) {
		super(props);

		this.stopMeeting = this.stopMeeting.bind(this);
		this.notificationReminder = this.notificationReminder.bind(this);
		this.onNotificationAccept = this.onNotificationAccept.bind(this);
		this.onNotificationReject = this.onNotificationReject.bind(this);

		this.state = {
			isLoading: false,
			number: null,
			rate: this.props.state.settings.rate,
			currency: this.props.state.settings.currency,
			isAutoStart: this.props.state.settings.isAutoStart,
			isRunning: this.props.state.appState.isRunning,
			timer: null
		};
	}

	componentDidMount() {

		var self = this;

		// ON NOTIFICATION CLICK
		// -------------------------------------------------------------------------------------

		PushNotification.configure({
			// (required) Called when a remote or local notification is opened or received
			onNotification: function(notification) {
				self.onNotificationAccept(notification.tag);
			},

			// Should the initial notification be popped automatically
			// default: true
			popInitialNotification: true,

	});


		// ON CALL EVENTS
		// -------------------------------------------------------------------------------------
		var callStatus = '';
		var meetingId = '';

		Notification.on('notification', (data) => {

			callStatus = data.type;

			switch (callStatus) {
				case 'INCOMING_CALL_STARTED':
				case 'OUTGOING_CALL_STARTED':

					console.log("callStatus", data);

/*					if(timer) {
						timer.clearInterval();
					}
*/
					if(!this.state.isRunning) {
						this.setState({
							number: data.text
						}, function(){
							if(this.props.isAutoStart){
								meetingId = moment().format();

								self.props.dispatch(addCall({
									id: moment().format(),
									name: "",
									subject: "",
									rate: this.props.rate,
									startAt: (new Date()).toJSON(),
									number: data.text
								}));

							} else {
								this.notificationReminder(callStatus);

								let timer = BackgroundTimer.setInterval(() => {
									this.notificationReminder(callStatus);
								}, 10000);

								this.setState({timer});
							}
						});
					}

					break;

				case 'INCOMING_CALL_ENDED':
				case 'OUTCOMING_CALL_ENDED':
					this.onNotificationReject();
					break;

				default:
					console.log("DEFAULT", callStatus);
					break;
			 }
		});
	}

	// FUNCTIONS
	// -------------------------------------------------------------------------------------

	onNotificationAccept(tag) {
		console.log('On Notification Accept');

		var self = this;

		var meetingId;
		var contact;

		switch(tag){
			case 'INCOMING_CALL':
			case 'OUTGOING_CALL':

				PushNotification.cancelAllLocalNotifications();
				BackgroundTimer.clearInterval(self.state.timer);

				meetingId = moment().format();
				var contactList = this.props.state.appState.contacts.slice(0);

				// Check if contact exist
				var contact = searchContact(contactList, self.state.number);
				console.log('callback addContact', contact);

				if(contact.data){
					console.log('contact exist', 'index:', contact.index);

					var contactName = "";
					contactName += isEmpty(this.state.givenName) + ' ';
					contactName += isEmpty(this.state.familyName) + ' ';

					// Start new meeting
					self.props.dispatch(addCall({
						contactIndex: contact.index,
						id: meetingId,
						name: 'Call with ' + contactName,
						subject: "",
						rate: self.state.rate,
						startAt: (new Date()).toJSON(),
						number: self.state.number,
						currency: self.state.currency,
					}));

					// TO DO: Updade android contact if changed

					// Add contact to meeting
					self.props.dispatch(addContact({
						id: meetingId,
						contact: contact.data
					}));

					self.setState({ isLoading: false });

				} else {
					console.log('contact doesnt exist', 'length:', contact.length);
					// Create new contact
					var newContact = {
						givenName: '',
						familyName: '',
						company: '',
						department: '',
						phoneNumbers: [{
							label: "mobile",
							number: self.state.number,
						}]
					}

					// Add contact to android contact list
					Contacts.addContact(newContact, (err) => {
						console.log('New contact added', err);

						// Start new meeting
						self.props.dispatch(addCall({
							contactIndex: contact.length,
							id: meetingId,
							name: 'Call with ' + self.state.number,
							subject: "",
							rate: self.state.rate,
							startAt: (new Date()).toJSON(),
							number: self.state.number,
							currency: self.state.currency,
						}));

						// Create new internal contact list with new contact
						// TO DO: sort array by name
						var newContactsList = contactList.slice(0);
						newContactsList.push(newContact);
						console.log('New contact list', newContactsList);

						// Save new internal contact list
						self.props.dispatch(saveContactList({
							contacts: newContactsList
						}));
						
						// Add contact to meeting
						self.props.dispatch(addContact({
							id: meetingId,
							contact: newContact
						}));
						console.log('addContact');

						self.setState({ isLoading: false });
					});
				}

				break;
		}
	}

	onNotificationReject() {
		console.log('On Notification Reject');

		BackgroundTimer.clearInterval(this.state.timer);
		PushNotification.cancelAllLocalNotifications();

		if(this.state.isRunning) {
			this.stopMeeting();
		}
	}

	notificationReminder(callType){
		PushNotification.cancelAllLocalNotifications();

		var notificationText;
		var notificationTag;
		if(callType == 'INCOMING_CALL_STARTED') {
			notificationText = 'New incoming call';
			notificationTag = 'INCOMING_CALL';
		} else if(callType == 'OUTGOING_CALL_STARTED') {
			notificationText = 'New outgoing call';
			notificationTag = 'OUTGOING_CALL';
		}

		PushNotification.localNotification({
			id: 1,
			vibration: 1000, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
			autoCancel: true,
			title: notificationText, // (optional, for iOS this is only used in apple watch, the title will be the app name on other iOS devices)
			message: "Click here to start a meeting", // (required)
			tag: notificationTag,
			actions: '["Accept", "Reject"]'
		});
	}

	stopMeeting() {
		this.props.dispatch(stopMeeting({
			id: this.props.state.appState.currentMeeting,
			endAt: (new Date()).toJSON()
		}));
	}

	// LIFE CYCLE
	// -------------------------------------------------------------------------------------

	componentWillReceiveProps(nextProps) {
		if (this.props.state.appState.isRunning !== nextProps.state.appState.isRunning) {
			this.setState({ isRunning: nextProps.state.appState.isRunning })
		}
	}

	componentWillMount(){
		var self = this;

		DeviceEventEmitter.addListener('notificationActionReceived', function(action){
			console.log ('Notification action received: ' + action);
			const info = JSON.parse(action.dataJSON);
			if (info.action == 'Accept') {
				self.onNotificationAccept('INCOMING_CALL');
			} else if (info.action == 'Reject') {
				self.onNotificationReject();
			}
			// Add all the required actions handlers
		});
	}

	// RENDER
	// -------------------------------------------------------------------------------------

	render() {
		return (
			<AppNavigator navigation={addNavigationHelpers({
				dispatch: this.props.dispatch,
				state: this.props.nav,
			})} />
		);
	}
}

AppWithNavigationState.propTypes = {
	dispatch: PropTypes.func.isRequired,
	nav: PropTypes.object.isRequired,
};


function mapStateToProps(state) {
	return {
		state: state,
		nav: state.nav,
	};
}

export default connect(mapStateToProps)(AppWithNavigationState);


(function() {
	// Register all the valid actions for notifications here and add the action handler for each action
	

	console.log('register actions');

})();