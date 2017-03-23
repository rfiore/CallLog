import React, { Component } from 'react';
import { connect } from 'react-redux';

import { bindActionCreators } from 'redux'
import { ActionCreators } from '../actions'

var Mailer = require('NativeModules').RNMail;
var RNFS = require('react-native-fs');
var json2csv = require('json2csv');

import {
	Button,
	Text,
	View,
	StyleSheet,
	TextInput
} from 'react-native';


class ExportScreen extends Component {

	constructor(props) {
		super(props);

		this.sendMail = this.sendMail.bind(this);

		this.state = {
			id: this.props.id,
			name: '',
			subject: '',
			rate: 100,
		}
	}

	static navigationOptions = {
		title: 'Export file'
	};

	sendMail(){

		console.log('sendMail');

		Mailer.mail({
			subject: 'Excel file sent from Calllog App',
			recipients: ['me@riccardofiore.com'],
			body: 'Excel file sent from Calllog App',
			isHTML: true, // iOS only, exclude if false
			attachment: {
				path: '',  // The absolute path of the file from which to read data.
				type: 'xls',   // Mime Type: jpg, png, doc, ppt, html, pdf
				name: 'data',   // Optional: Custom filename for attachment
			}
		}, (error, event) => {

		});
	}

	render() {

		return (
			<View style={styles.container}>
				<Button title='Export file' onPress={this.sendMail} />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: '#F5FCFF',
	},
	label: {
		height: 40,
		flexDirection: 'row',
		alignItems: 'center',
	},
	labelText: {
		fontSize: 16,
		marginLeft: 10,
	},
	input: {
		height: 40,
		marginBottom: 10,
		fontSize: 16
	},
	welcome: {
		fontSize: 20,
		textAlign: 'center',
		margin: 10,
	},
	instructions: {
		textAlign: 'center',
		color: '#333333',
		marginBottom: 5,
	},
});

function mapDispatchToProps(dispatch) {
	return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
	return {
		meetings: state.meetings
	};
}


export default connect(mapStateToProps, mapDispatchToProps)(ExportScreen);