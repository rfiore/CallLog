/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
	AppRegistry,
	StyleSheet,
	Text,
	NativeModules,
	AsyncStorage,
	View,
	ListView,
	Navigator
} from 'react-native';

import Row from './components/Row';
import demoData from './data';

//var callLogList  = NativeModules.CallLogList;
var STORAGE_KEY = 'callLogKey';

export default class CallLog extends Component {

	constructor(props) {
		super(props);

		const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

		const dataBlob = data.map(function(user, index){
			return user;
		}).reverse();

		this.state = {
			dataSource: ds.cloneWithRows(dataBlob),
		};
	}

	componentDidMount() {
		//this._loadInitialState().done();
	}

	_loadInitialState = async () => {
		try {
			var value = await AsyncStorage.getItem(STORAGE_KEY);
			if (value !== null){
				//this.setState({selectedValue: value});
				console.log('Recovered meetings from disk: ' + value);
			} else {
				console.log('No meetings on disk.');
			}
		} catch (error) {
			console.log('AsyncStorage error: ' + error.message);
		}
	};

	render() {

		return (
			<View style={styles.container}>
				<ListView
					style={styles.container}
					dataSource={this.state.dataSource}
					renderRow={(data) => <Row {...data} />}
					renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
    flex: 1,
    marginTop: 20,
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
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

AppRegistry.registerComponent('CallLog', () => CallLog);
