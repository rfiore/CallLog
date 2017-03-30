import React, { Component } from 'react';
import { connect } from 'react-redux';

import { bindActionCreators } from 'redux'
import { ActionCreators } from '../actions'

import {
	Text,
	View,
	StyleSheet
} from 'react-native';

class ContactScreen extends Component {

	constructor(props) {
		super(props);
	}

	static navigationOptions = {
		title: (navigation, childRouter) => {
			return navigation.state.params.name;
		},
	};

	render() {
		console.log(this.props.navigation.state.params.contact);
		var contactData = this.props.navigation.state.params.contact

		var emailList = contactData.emailAddresses.map(function(item, index) {
						return <View key={index} style={styles.settingTouch}><Text style={styles.settingTouchText}>{item.email}{'\n'}</Text></View>
					});

		var phonelList = contactData.phoneNumbers.map(function(item, index) {
						return <View key={index} style={styles.settingTouch}><Text style={styles.settingTouchText}>{item.number}{'\n'}</Text></View>
					});

		var addresslList = contactData.postalAddresses.map(function(item, index) {
						return <View key={index} style={styles.settingTouch}><Text style={styles.settingTouchText}>{item.formattedAddress}{'\n'}</Text></View>
					});
		

		return (
			<View style={styles.container}>
				<Text style={styles.heading}>
					{contactData.givenName} {contactData.familyName}
				</Text>

				{ /* company */ }
				<Text style={styles.settingLabel}>COMPANY</Text>
				<Text style={styles.settingText}>{contactData.company}</Text>

				{ /* department */ }
				<Text style={styles.settingLabel}>DEPARTMENT</Text>
				<Text style={styles.settingText}>{contactData.department}</Text>

				{ /* emailAddresses */ }
				<Text style={styles.settingLabel}>EMAIL ADDRESSES</Text>
				{ emailList }

				{ /* phoneNumbers */ }
				<Text style={styles.settingLabel}>PHONE NUMBERS</Text>
				{ phonelList }

				{ /* postalAddresses */ }
				<Text style={styles.settingLabel}>POSTAL ADDRESSES</Text>
				{ addresslList }

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
	heading: {
		fontSize: 18,
		fontFamily: 'Poppins-Regular',
		marginLeft: 4,
		marginBottom: 16,
	},
	button: {
		marginBottom: 10,
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
		padding: 12,
		borderBottomWidth: 1,
		borderBottomColor: '#EEEEEE',
	},
	settingTouchText: {
		fontSize: 15,
		fontFamily: 'Poppins-Regular',
	},
});

function mapDispatchToProps(dispatch) {
	return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
	return {
		meetings: state.meetings,
		isRunning: state.appState.isRunning,
	};
}


export default connect(mapStateToProps, mapDispatchToProps)(ContactScreen);