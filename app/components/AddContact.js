import React, { Component } from 'react';
import { connect } from 'react-redux';

import { bindActionCreators } from 'redux'
import { ActionCreators } from '../actions'

var Contacts = require('react-native-contacts')

import {
	Button,
	Text,
	ScrollView,
	View,
	StyleSheet,
	TextInput,
	TouchableOpacity
} from 'react-native';


class AddContactScreen extends Component {

	constructor(props) {
		super(props);

		this.addContact = this.addContact.bind(this);
		this.addContact = this.addContact.bind(this);

		this.state = {
			contacts: [],
			id: this.props.navigation.state.params.id,
		}
	}

	static navigationOptions = {
		title: 'Add contact'
	};

	addContact(contact) {
			this.props.addContact({
			id: this.state.id,
			contact: contact
		});
	}

	componentDidMount() {
		Contacts.getAll((err, contacts) => {
			if(err && err.type === 'permissionDenied'){

			} else {
				this.setState({
					contacts: contacts
				});
			}
		})
	}

	render() {
		var self = this;
		
		var contactsList = this.state.contacts.map(function(contact, index) {
						return <TouchableOpacity key={index} onPress={() => self.addContact(contact)} style={styles.settingTouch}>
										<Text style={styles.settingTouchText}>{contact.givenName} {contact.familyName}</Text>
									</TouchableOpacity>
					});

		return (
			<ScrollView style={styles.container}>
				{contactsList}
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
		state: state
	};
}


export default connect(mapStateToProps, mapDispatchToProps)(AddContactScreen);