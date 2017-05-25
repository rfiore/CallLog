import React, { Component } from 'react';
import { connect } from 'react-redux';

import { bindActionCreators } from 'redux'
import { ActionCreators } from '../actions'

import {
	Text,
	TextInput,
	View,
	StyleSheet
} from 'react-native';

export default class Contact extends Component {

	constructor(props) {
		super(props);

		this.state = {
			givenName: "",
			familyName: "",
			company: "",
			department: "",
			emailAddresses: [],
			phoneNumbers: [],
			postalAddresses: []
		};
	}

	componentWillReceiveProps(nextProps) {
		if(this.props.contactData !== nextProps.contactData){
			this.setState({
				givenName: nextProps.contactData.givenName,
				familyName: nextProps.contactData.familyName,
			});
		}
	}

	render() {

		var self = this;

		var emailList = this.state.emailAddresses.map(function(item, index) {
						return <View key={index} style={styles.settingTouch}><Text style={styles.settingTouchText}>{item.email}{'\n'}</Text></View>
					});

		var phonelList = this.state.phoneNumbers.map(function(item, index) {
						return <View key={index} style={styles.settingTouch}><Text style={styles.settingTouchText}>{item.number}{'\n'}</Text></View>
					});

		var addresslList = this.state.postalAddresses.map(function(item, index) {
						return <View key={index} style={styles.settingTouch}><Text style={styles.settingTouchText}>{item.formattedAddress}{'\n'}</Text></View>
					});

		var contactName = "";
		contactName += this.state.givenName + ' ';
		contactName += this.state.familyName + ' ';
		

		return (
			<View style={styles.container}>
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
		paddingTop: 20,
		paddingBottom: 20,
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
