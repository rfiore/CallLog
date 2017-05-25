import React, { Component } from 'react';
import { connect } from 'react-redux';

import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';

import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';

import { filterByString } from '../utils/utils';

var Mailer = require('NativeModules').RNMail;

import RNFetchBlob from 'react-native-fetch-blob'

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

		this.sendFile = this.sendFile.bind(this);
		this.viewFile = this.viewFile.bind(this);
		this.writeFile = this.writeFile.bind(this);
		this.JSONToCSVConvertor = this.JSONToCSVConvertor.bind(this);

		this.state = {
			isSaved: false,
			filePath: ''
		}
	}

  static navigationOptions = {
		tabBarIcon: <Icon name="ios-download" size={28} color='#4F8EF7' />
  };

	sendFile(){

		console.log('sendFile');
		Mailer.mail({
			subject: 'Excel file sent from Calllog App',
			recipients: ['me@riccardofiore.com'],
			body: 'Excel file sent from Calllog App',
			isHTML: true, // iOS only, exclude if false
			attachment: {
				path: this.state.filePath,  // The absolute path of the file from which to read data.
				type: 'csv',   // Mime Type: jpg, png, doc, ppt, html, pdf
				name: this.state.fileName,   // Optional: Custom filename for attachment
			}
		}, (error, event) => {
			console.log('error sendFile', error);
		});
	}

	viewFile(){
		const android = RNFetchBlob.android;
		android.actionViewIntent(this.state.filePath, 'text/csv')
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
		const fs = RNFetchBlob.fs;
		const base64 = RNFetchBlob.base64;
		const dirs = RNFetchBlob.fs.dirs;

		var fileName = moment().format('MMMMDoYYYYhmmss');
		// create a path you want to write to
		//var dirPath = RNFS.DocumentDirectoryPath;rr
		var dirPath = dirs.DownloadDir;
		var filePath = dirPath + '/' + fileName +'.csv';


		// write the file
		fs.createFile(filePath, this.JSONToCSVConvertor(this.props.meetings, 'Meetings', true), 'utf8')
			.then(()=>{ 
				console.log('FILE WRITTEN!');

				this.setState({
					isSaved: true,
					filePath: filePath,
					fileName: fileName
				})
			})
	}

	render() {
		const isSaved = this.state.isSaved;

    let button = null;

    if (isSaved) {
      button = <View>
      						<View style={styles.button}>
										<Button title='View file' onPress={this.viewFile} />
									</View>
									<View style={styles.button}>
										<Button title='Email file' onPress={this.sendFile} />
									</View>
      				</View>
    } else {
      button = <View><Button title='Save file' onPress={this.writeFile} /></View>
    }

		return (
			<View style={styles.container}>
				<Text style={styles.screenTitle}>
					Export list
				</Text>
				{ button }
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
	button: {
		marginBottom: 10,
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
	screenTitle: {
		fontSize: 21,
		color: '#4F8EF7',
		fontFamily: 'Poppins-Regular',
		marginLeft: 4,
		marginBottom: 16,
	},
});

function mapDispatchToProps(dispatch) {
	return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {

	const meetingArr = state.meetingsById.map((item, index) => {
		 return state.meetings[item]
	});

/*	var filteredMeetings = filterByString(meetingArr, state.appState.searchKey);

	console.log(filteredMeetings);*/

	return {
		meetings: meetingArr
	};
}


export default connect(mapStateToProps, mapDispatchToProps)(ExportScreen);