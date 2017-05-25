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


class CreateActivityScreen extends Component {

	constructor(props) {
		super(props);

		this.addActivity = this.addActivity.bind(this);
		
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
		tabBarIcon: <Icon name="ios-person" size={28} color='#4F8EF7' />
  };

	// ACTIONS
	// -------------------------------------------------------------------------------------

	addActivity() {
		this.setState({ isLoading: true });

		var self = this;
		var meetingId = moment().format();

		// Start new activity
		self.props.addActivity({
			contactIndex: null,
			id: meetingId,
			name: self.state.name,
			subject: self.state.subject,
			rate: self.state.rate,
			startAt: (new Date()).toJSON(),
			number: self.state.number,
			currency: self.state.currency,
		});

		// Add contact to meeting
		self.props.addContact({
			id: meetingId,
			contact: {
				  company: "",
				  emailAddresses: [],
				  familyName: "",
				  givenName: "",
				  jobTitle: "",
				  middleName: "",
				  phoneNumbers: [],
				  thumbnailPath: '',
				  postalAddresses:[]
				}
		});

		// TO DO: Updade android contact if changed

		self.setState({ isLoading: false });
	}

	// RENDER
	// -------------------------------------------------------------------------------------

	render() {

		const navigate = this.props.navigation;

		return (
			<KeyboardAwareScrollView style={styles.container}>
				<Text style={styles.screenTitle}>
					Add Activity
				</Text>

				{!this.props.state.appState.isRunning && (
					<View>

						<Text style={styles.settingLabel}>ACTIVITY NAME</Text>
						<TextInput
							style={styles.settingInput}
							onChangeText={(text) => this.setState({name: text})}
							value={this.state.name}
						/>

						<Text style={styles.settingLabel}>ACTIVITY SUBJECT</Text>
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
								title='Start activity'
								onPress={this.addActivity}
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateActivityScreen);