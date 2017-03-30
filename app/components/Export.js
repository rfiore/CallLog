import React, { Component } from 'react';
import { connect } from 'react-redux';

import { bindActionCreators } from 'redux'
import { ActionCreators } from '../actions'

var Mailer = require('NativeModules').RNMail;
var RNFS = require('react-native-fs');
//var json2csv = require('json2csv');

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
		this.writeFile = this.writeFile.bind(this);
		this.JSONToCSVConvertor = this.JSONToCSVConvertor.bind(this);

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

	sendMail(path, name){

		console.log(path, name);

		Mailer.mail({
			subject: 'Excel file sent from Calllog App',
			recipients: ['me@riccardofiore.com'],
			body: 'Excel file sent from Calllog App',
			isHTML: true, // iOS only, exclude if false
			attachment: {
				path: path,  // The absolute path of the file from which to read data.
				type: 'csv',   // Mime Type: jpg, png, doc, ppt, html, pdf
				name: name,   // Optional: Custom filename for attachment
			}
		}, (error, event) => {

		});
	}

	JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
		//If JSONData is not an object then JSON.parse will parse the JSON string in an Object
		var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
		
		var CSV = '';    
		//Set Report title in first row or line
		
		//CSV += ReportTitle + '\r\n\n';

		//This condition will generate the Label/Header
		if (ShowLabel) {
				var row = "";
				
				//This loop will extract the label from 1st index of on array
				for (var index in arrData[0]) {
						
						//Now convert each value to string and comma-seprated
						row += index + ',';
				}

				row = row.slice(0, -1);
				
				//append Label row with line break
				CSV += row + '\r\n';
		}
		
		//1st loop is to extract each row
		for (var i = 0; i < arrData.length; i++) {
				var row = "";
				
				//2nd loop will extract each column and convert it in string comma-seprated
				for (var index in arrData[i]) {
						row += '"' + arrData[i][index] + '",';
				}

				row.slice(0, row.length - 1);
				
				//add a line break after each row
				CSV += row + '\r\n';
		}

		if (CSV == '') {        
				alert("Invalid data");
				return;
		}   
		
		//Generate a file name
		var fileName = "MyReport_";
		//this will remove the blank-spaces from the title and replace it with an underscore
		fileName += ReportTitle.replace(/ /g,"_");   
		
		//Initialize file format you want csv or xls
		var uri = CSV;
		
		return uri
	}

	writeFile(){
		var name = (new Date()).toJSON();
		// create a path you want to write to
		var dirPath = '/storage/emulated/0/Download';
		var filePath = dirPath + '/' + name +'.csv';

		// write the file
		RNFS.writeFile(filePath, this.JSONToCSVConvertor(this.props.meetings, 'Meetings', true), 'utf8')
			.then((success) => {
				console.log('FILE WRITTEN!');

				this.sendMail(filePath, name);
			})
			.catch((err) => {
				console.log(err.message);
			});
	}

	render() {

		return (
			<View style={styles.container}>
				<Button title='Export file' onPress={this.writeFile} />
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