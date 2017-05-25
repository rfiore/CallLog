import React, { Component } from 'react';
import { connect } from 'react-redux';

import { bindActionCreators } from 'redux'
import { ActionCreators } from '../actions'

import { NavigationActions } from 'react-navigation';

import Icon from 'react-native-vector-icons/Ionicons';

import Row from './Row';
import SectionHeader from './SectionHeader';
import Navigation from './Navigation';

import Dates from 'react-native-dates';
import moment from 'moment';

var PushNotification = require('react-native-push-notification');

import Notification from 'things-notification';

var Contacts = require('react-native-contacts')

import Spinner from 'react-native-loading-spinner-overlay';

import { filterByString, filterByDate } from '../utils/utils';

import {PhoneNumberFormat, PhoneNumberUtil} from 'google-libphonenumber';

import {
	Button,
	Text,
	TextInput,
	View,
	ListView,
	StyleSheet,
	TouchableOpacity,
} from 'react-native';

class MainScreen extends Component {

	constructor(props) {
		super(props);

		var self = this;

		this.formatData = this.formatData.bind(this);
		this.searchMeeting = this.searchMeeting.bind(this);
		this.stopMeeting = this.stopMeeting.bind(this);
		this.searchContact = this.searchContact.bind(this);

		const getSectionData = (dataBlob, sectionId) => dataBlob[sectionId];
		const getRowData = (dataBlob, sectionId, rowId) => dataBlob[`${rowId}`];

		const ds = new ListView.DataSource({
			rowHasChanged: (r1, r2) => r1 !== r2,
			sectionHeaderHasChanged : (s1, s2) => s1 !== s2,
			getSectionData,
			getRowData,
		});

		const { dataBlob, sectionIds, rowIds } = this.formatData(this.props.meetings);

		this.state = {
			isLoading: false,
			timer: null,
			notificationId: 0,
			isSearchVisible: false,
			searchKey: '',
			meetings: [],
			dataSource: ds.cloneWithRowsAndSections(dataBlob, sectionIds, rowIds),
			number: null,
			notificationTimer: null,
		}

		var self = this;
		// SET UP NOTIFICATION
		PushNotification.configure({
				// (required) Called when a remote or local notification is opened or received
				onNotification: function(notification) {
						var meetingId;
						var contact;

						switch(notification.tag){
							case 'INCOMING_CALL':
							case 'OUTGOING_CALL':

								meetingId = moment().format();

								self.setState({
									isLoading: true
								});

								Contacts.getAll((err, contacts) => {
									if(err && err.type === 'permissionDenied'){

									} else {

										contact = self.searchContact(contacts, self.state.number);
										
										if(contact){
											self.props.addCall({
												id: meetingId,
												name: 'New call with ' + contact.givenName,
												subject: "",
												rate: self.props.rate,
												startAt: (new Date()).toJSON(),
												number: notification,
												currency: self.props.currency,
											});

											PushNotification.cancelAllLocalNotifications();

											self.props.addContact({
												id: meetingId,
												contact: contact
											});
										} else {

											self.props.addCall({
												id: meetingId,
												name: 'New call with ' + self.state.number,
												subject: "",
												rate: self.props.rate,
												startAt: (new Date()).toJSON(),
												number: notification,
												currency: self.props.currency,
											});

											var newPerson = {
												givenName: self.state.number,
												phoneNumbers: [{
											    label: "mobile",
											    number: self.state.number,
											  }],
											}

											Contacts.addContact(newPerson, () => {
												Contacts.getAll((err, contacts) => {
													contact = self.searchContact(contacts, self.state.number);
													console.log('callback addContact', contact, self.state.number);

													if(contact){
														console.log('addContact');
														self.props.addContact({
															id: meetingId,
															contact: contact
														});
													}
												})
											})

										}

										self.setState({
											isLoading: false
										});
									}
								})

								break;
						}
				},

				// Should the initial notification be popped automatically
				// default: true
				popInitialNotification: true,

		});
	}

	searchContact(contacts, number) {
		const phoneUtil = PhoneNumberUtil.getInstance();

		var matchedContact;

		var parsedNumber = phoneUtil.parse(number, 'GB');

		var formattedNumber = phoneUtil.format(parsedNumber, PhoneNumberFormat.INTERNATIONAL);
		

		contacts.forEach(function(contact, index){
			let curContact = contact;

			contact.phoneNumbers.forEach(function(phoneNumber, index){
				let isValid = false;

				console.log(phoneNumber.number);

				try {
			    isValid =  phoneUtil.isValidNumber(phoneUtil.parse(phoneNumber.number, 'GB'));
			  } catch(e) {
			  	isValid = false;
			  	console.log(e)
			  }

				if(isValid){

					let contactParsedNumber = phoneUtil.parse(phoneNumber.number, 'GB');

					let contactFormattedNumber = phoneUtil.format(contactParsedNumber, PhoneNumberFormat.INTERNATIONAL);

					console.log('formattedNumber: ', formattedNumber, 'contactFormattedNumber: ', contactFormattedNumber);

					if(contactFormattedNumber == formattedNumber) {
						matchedContact = curContact;
					}
				}

			});
		});

		return matchedContact
	}

	// NAVIGATION OPTIONS
	static navigationOptions = {
		title: 'Home Screen',
		header: {
			visible: false,
		},
	};

	componentDidMount() {
		var self = this;

		// Listen for notifications
		var callStatus = '';
		var meetingId = '';

		Notification.on('notification', (data) => {

			callStatus = data.type;

			console.log("callStatus", data);

			var notificationId;

			switch (callStatus) {
				case 'INCOMING_CALL_STARTED':

					if(!this.props.isRunning) {
						this.setState({
							notificationId: notificationId,
							number: data.text
						}, function(){
							if(this.props.isAutoStart){
								meetingId = moment().format();

								self.props.addCall({
									id: moment().format(),
									name: "",
									subject: "",
									rate: this.props.rate,
									startAt: (new Date()).toJSON(),
									number: data.type
								});

							} else {
								//let notificationTimer = setInterval(function(){ console.log('timer'); }, 1000);
									
									PushNotification.localNotification({
										vibration: 1000, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
										autoCancel: true,
										title: "New incoming call", // (optional, for iOS this is only used in apple watch, the title will be the app name on other iOS devices)
										message: "Click here to start a meeting", // (required)
										tag: 'INCOMING_CALL',
										actions: '["Accept", "Reject"]'
									});
								//
								//this.setState({notificationTimer: timer});
							}
						});
					}

					break;

				case 'OUTGOING_CALL_STARTED':

					if(!this.props.isRunning) {

						this.setState({
							notificationId: notificationId,
							number: data.text
						}, function() {
							if(this.props.isAutoStart){
								self.props.addCall({
									id: moment().format(),
									name: "",
									subject: "",
									rate: this.props.rate,
									startAt: (new Date()).toJSON(),
									number: ''
								});
							} else {
								notificationId = this.state.notificationId + 1;
								console.log("Create notification Id", notificationId);

								PushNotification.localNotification({
									vibration: 1000, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
									autoCancel: true,
									title: "New outgoing call", // (optional, for iOS this is only used in apple watch, the title will be the app name on other iOS devices)
									message: "Click here to start a meeting", // (required)
									tag: 'OUTGOING_CALL',
									actions: '["Accept", "Reject"]'
								});
							}
						});
					}

					break;

				case 'INCOMING_CALL_ENDED':
				case 'OUTCOMING_CALL_ENDED':
					console.log("Destroy notification Id", (this.state.notificationId).toString());
					PushNotification.cancelAllLocalNotifications();
					
					if(this.props.isRunning) {
						this.stopMeeting();
					}

					break;

				default:
					console.log("DEFAULT", callStatus);
					break;
			 }
		});
	}

	// MEETING ACTIONS
	stopMeeting() {
		this.props.stopMeeting({
			id: this.props.id,
			endAt: (new Date()).toJSON()
		});
	}

	// RECEIVE PROPS
	componentWillReceiveProps(nextProps) {

		if(this.props.startDate !== nextProps.startDate) {
			console.log(filterByDate(nextProps.meetings, nextProps.startDate, nextProps.endDate));
		}
		
		console.log('keys', nextProps.searchKey, this.state.searchKey)
		if (this.props.meetings !== nextProps.meetings) {

			if(this.state.searchKey == ''){
			
				this.setState({ isLoading: true });

				const { dataBlob, sectionIds, rowIds } = this.formatData(nextProps.meetings);

				this.setState({
						isLoading: false,
						dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlob, sectionIds, rowIds)
				});
			}
		}
	}

	// SEARCH MEETING
	searchMeeting(arr, searchKey) {
		var filteredMeetingList = filterByString(arr, searchKey);

		const { dataBlob, sectionIds, rowIds } = this.formatData(filteredMeetingList);

		this.setState({
				searchKey: searchKey,
				dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlob, sectionIds, rowIds)
		}, () => this.props.setSearchKey({searchKey: searchKey}));
	}

	// FORMAT MEETINGS LIST
	formatData(data) {
		var dates = {};
		var dateArr = [];

		data.forEach(function(item) {

			var rawDate = new Date(item.startAt)
			var formatterdDate = rawDate.toDateString();

			if (!dates[formatterdDate]) {
					dates[formatterdDate] = 0;
					dateArr.push(formatterdDate);
			}

			dates[formatterdDate]++;
		});

		dateArr.reverse();

		const dataBlob = {};
		const sectionIds = [];
		const rowIds = [];

		for (let sectionId = 0; sectionId < dateArr.length; sectionId++) {

			const meetings = data.filter((meeting) => new Date(meeting.startAt).toDateString() === dateArr[sectionId]);

			meetings.reverse();

			sectionIds.push(sectionId);
			dataBlob[sectionId] = { date: dateArr[sectionId] };
			rowIds.push([]);

			for (let i = 0; i < meetings.length; i++) {

				const rowId = `${sectionId}:${i}`;
				rowIds[rowIds.length - 1].push(rowId);
				dataBlob[rowId] = meetings[i];
			}
		}
		return { dataBlob, sectionIds, rowIds };
	}

	render() {

		const navigate = this.props.navigation;
		
		return (
			<View style={styles.container}>
				<View style={styles.header}>
					<View style={styles.titleContainer}>
						<Text style={styles.welcome}>Call Log</Text>
					</View>
					<Navigation isRunning={this.props.isRunning} navigate={navigate} />
				</View>
				{ !this.props.isRunning &&
					<View style={styles.searchContainer}>
						<Icon style={styles.searchIcon} name="ios-search-outline" size={28} />
						<TextInput
							style={styles.searchInput}
							onChangeText={(text) => this.searchMeeting(this.props.meetings, text)}
							placeholder='Search...'
						/>
					</View>
				}


				{ this.props.startDate &&
					<View style={styles.searchContainer}>
						<Icon style={styles.searchIcon} name="ios-calendar-outline" size={28} />
						<Text style={styles.searchText}>{moment(this.props.startDate).format('YYYY/MM/DD')}  ›  {moment(this.props.endDate).format('YYYY/MM/DD')}</Text>
					</View>
				}

				<View style={styles.listContainer}>
					<ListView
						style={styles.container}
						dataSource={this.state.dataSource}
						renderRow={(data, sectionId, rowId) => <Row {...data} navigation={navigate} index={rowId}/>}
						renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
						renderSectionHeader={(sectionData) => <SectionHeader {...sectionData} />}
					/>
				</View>

				<Spinner visible={this.state.isLoading} textContent={"Loading..."} textStyle={{color: '#FFF'}} overlayColor='rgba(0, 0, 0, 0.75)'/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FFFFFF',
	},
	header: {
		flexDirection: 'row',
		height: 50,
	},
	titleContainer: {
		flex: 1,
		height: 50,
	},
	searchContainer: {
		height: 50,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-around',
		marginLeft: 10,
		marginRight: 10,
	},
	searchIcon: {
		marginLeft: 4,
		marginTop: 12,
		height: 36,
		width: 36,
	},
	searchInput: {
		flex: 1,
		height: 50,
		fontSize: 16,
		fontFamily: 'Poppins-Regular',
	},
	searchText: {
		flex: 1,
		marginTop: 4,
		marginLeft: 4,
		fontSize: 14,
		fontFamily: 'Poppins-Regular',
	},
	listContainer: {
		flex: 1
	},
	welcome: {
		fontSize: 20,
		marginTop: 10,
		marginLeft: 10,
		fontFamily: 'Poppins-Light',
		color: '#4F8EF7'
	}
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
		isRunning: state.appState.isRunning,
		id: state.appState.currentMeeting,
		startDate: state.appState.startDate,
		endDate: state.appState.endDate,
		searchKey: state.appState.searchKey,
		interval: state.settings.alertInterval,
		isAutoStart: state.settings.isAutoStart,
		rate: state.settings.rate,
		currency: state.settings.currency,
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);