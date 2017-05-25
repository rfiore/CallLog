import React, { Component } from 'react';
import { connect } from 'react-redux';

import { bindActionCreators } from 'redux'
import { ActionCreators } from '../actions'

var Contacts = require('react-native-contacts')

import Spinner from 'react-native-loading-spinner-overlay';

import {
	Button,
	Text,
	ScrollView,
	View,
	StyleSheet,
	TextInput,
	TouchableOpacity
} from 'react-native';


class WelcomeScreen extends Component {

	constructor(props) {
		super(props);

		this.state = {
			isLoading: true,
		}

		console.log('welcome');
	}

	navigationOptions = {
	  header: null
	};

	componentDidMount() {
		Contacts.getAll((err, contacts) => {
			if(err && err.type === 'permissionDenied'){

			} else {
				this.props.saveContactList({
					contacts: contacts
				});

				this.setState({isLoading: false})
			}
		})
	}


	render() {
		var self = this;

		return (
			<Spinner visible={this.state.isLoading} textContent={"Loading contacts"} textStyle={{color: '#FFF'}} overlayColor='rgba(0, 0, 0, 0.75)'/>
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


export default connect(null, mapDispatchToProps)(WelcomeScreen);