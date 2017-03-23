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
	View,
	ListView,
	Navigator,
	TouchableOpacity,
} from 'react-native';

import demoData from './data';

import Main from './components/Main';
import Meeting from './components/Meeting';

export default class CallLog extends Component {

	constructor(props) {
		super(props);

		this.formatData = this.formatData.bind(this);

		const getSectionData = (dataBlob, sectionId) => dataBlob[sectionId];
    const getRowData = (dataBlob, sectionId, rowId) => dataBlob[`${rowId}`];

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged : (s1, s2) => s1 !== s2,
      getSectionData,
      getRowData,
    });

    const { dataBlob, sectionIds, rowIds } = this.formatData(demoData);

    this.state = {
      dataSource: ds.cloneWithRowsAndSections(dataBlob, sectionIds, rowIds)
    }
	}

	render() {
		return (
			<Navigator
				initialRoute={{id: 'Main', title: 'Main', name: 'Index'}}
				renderScene={this.renderScene.bind(this)}
				configureScene={(route) => {
					if (route.sceneConfig) {
						return route.sceneConfig;
					}
					return Navigator.SceneConfigs.PushFromRight;
				}} />
		);
	}

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

    // Each section is going to represent a letter in the alphabet so we loop over the alphabet
    for (let sectionId = 0; sectionId < dateArr.length; sectionId++) {


    		const meetings = data.filter((meeting) => new Date(meeting.startAt).toDateString() === dateArr[sectionId]);


        // Add a section id to our array so the listview knows that we've got a new section
        sectionIds.push(sectionId);

        // Store any data we would want to display in the section header. In our case we want to show
        // the current character
        dataBlob[sectionId] = { date: dateArr[sectionId] };

        // Setup a new array that we can store the row ids for this section
        rowIds.push([]);

        // Loop over the valid users for this section
        for (let i = 0; i < meetings.length; i++) {
          // Create a unique row id for the data blob that the listview can use for reference
          const rowId = `${sectionId}:${i}`;

          // Push the row id to the row ids array. This is what listview will reference to pull
          // data from our data blob
          rowIds[rowIds.length - 1].push(rowId);

          // Store the data we care about for this row
          dataBlob[rowId] = meetings[i];
        }
    }

    return { dataBlob, sectionIds, rowIds };
	}

	renderScene(route, navigator) {
		var routeId = route.id;
		if (routeId === 'Main') {
			return (
				<Main
					navigator={navigator} 

					title={route.title}

					data={this.state.dataSource}

					goToMain={() => {
							navigator.pop();
						}}

					goToMeeting={(data) => {

							navigator.push({
								id: 'Meeting', 
								title: 'Meeting',
								name: 'Index',
								data: data

							}
							);
						}}
				/>
			);
		}
		if (routeId === 'Meeting') {
			var routeId = route.id;

			return (
				<Meeting
					navigator={navigator} 
					title={route.title}
					data={route.data}
				/>
			);
		}
		return this.noRoute(navigator);
	}

	noRoute(navigator) {
		return (
			<View style={{flex: 1, alignItems: 'stretch', justifyContent: 'center'}}>
				<TouchableOpacity style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
						onPress={() => navigator.pop()}>
					<Text style={{color: 'red', fontWeight: 'bold'}}>No routes</Text>
				</TouchableOpacity>
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
