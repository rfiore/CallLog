import React, { Component } from 'react';
import { connect } from 'react-redux';

import { bindActionCreators } from 'redux'
import { ActionCreators } from '../actions'

import { NavigationActions } from 'react-navigation';

import Icon from 'react-native-vector-icons/Ionicons';

import Row from './Row';
import SectionHeader from './SectionHeader';

import {
	Button,
	Text,
	TextInput,
	View,
	ListView,
	StyleSheet,
	TouchableOpacity,
} from 'react-native';

class MainScreen extends Component {

	constructor(props) {
		super(props);

		this.formatData = this.formatData.bind(this);
		this.runTimer = this.runTimer.bind(this);
		this.tick = this.tick.bind(this);
		this.searchMeeting = this.searchMeeting.bind(this);
		this.filterObj = this.filterObj.bind(this);

		const getSectionData = (dataBlob, sectionId) => dataBlob[sectionId];
		const getRowData = (dataBlob, sectionId, rowId) => dataBlob[`${rowId}`];

		const ds = new ListView.DataSource({
			rowHasChanged: (r1, r2) => r1 !== r2,
			sectionHeaderHasChanged : (s1, s2) => s1 !== s2,
			getSectionData,
			getRowData,
		});


		const { dataBlob, sectionIds, rowIds } = this.formatData(this.props.meetings);

		this.state = {
			timer: null,
			isSearchVisible: false,
			searchKey: '',
			meetings: [],
			dataSource: ds.cloneWithRowsAndSections(dataBlob, sectionIds, rowIds)
		}
	}

	static navigationOptions = {
		title: 'Home Screen',
		header: {
			visible: false,
		},
	};

	componentWillReceiveProps(nextProps) {

		if (this.props.meetings !== nextProps.meetings) {
			const { dataBlob, sectionIds, rowIds } = this.formatData(nextProps.meetings);

			this.setState({
				searchKey: '',
				dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlob, sectionIds, rowIds)
			})
		}

		if (this.props.isRunning !== nextProps.isRunning) {
			if (nextProps.isRunning == true) {
				this.runTimer();
			} else {
				clearInterval(this.state.timer);
			}
		}
	}

	runTimer() {
		let timer = setInterval(this.tick, 1000);
  	this.setState({timer});
	}

	tick() {
		this.props.updateMeeting({
			isRunning: true,
			id: this.props.id,
			endAt: (new Date()).toJSON()
		});
	}

	filterObj(arr, searchKey) {
	  return arr.filter(obj => Object.keys(obj).some(key => obj[key].toString().includes(searchKey)));
	}

	searchMeeting(arr, searchKey) {
		var newMeetingList = this.filterObj(arr, searchKey);

		const { dataBlob, sectionIds, rowIds } = this.formatData(newMeetingList);

		this.setState({
				searchKey: searchKey,
				dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlob, sectionIds, rowIds)
		})
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

		for (let sectionId = 0; sectionId < dateArr.length; sectionId++) {

			const meetings = data.filter((meeting) => new Date(meeting.startAt).toDateString() === dateArr[sectionId]);

			sectionIds.push(sectionId);
			dataBlob[sectionId] = { date: dateArr[sectionId] };
			rowIds.push([]);

			for (let i = 0; i < meetings.length; i++) {

				const rowId = `${sectionId}:${i}`;
				rowIds[rowIds.length - 1].push(rowId);
				dataBlob[rowId] = meetings[i];
			}
		}
		return { dataBlob, sectionIds, rowIds };
	}

	render() {

		const navigate = this.props.navigation;
		
		return (
			<View style={styles.container}>
				<View style={styles.buttonContainer}>
					<TouchableOpacity disabled={ this.props.isRunning } onPress={() => navigate.dispatch(NavigationActions.navigate({ routeName: 'CreateMeeting' }))}>
						<Icon name="ios-add-circle" size={30} color="#4F8EF7" />
					</TouchableOpacity>
					<TouchableOpacity onPress={() => navigate.dispatch(NavigationActions.navigate({ routeName: 'Export' }))}>
						<Icon name="ios-download" size={30} color="#4F8EF7" />
					</TouchableOpacity>
					<TouchableOpacity onPress={() => navigate.dispatch(NavigationActions.navigate({ routeName: 'Settings' }))}>
						<Icon name="ios-settings" size={30} color="#4F8EF7" />
					</TouchableOpacity>
				</View>
				<View style={styles.searchContainer}>
					<TextInput
						style={styles.input}
						onChangeText={(text) => console.log( this.searchMeeting(this.props.meetings, text) )}
					/>
				</View>
				<View style={styles.listContainer}>
					<ListView
						style={styles.container}
						dataSource={this.state.dataSource}
						renderRow={(data, sectionId, rowId) => <Row {...data} navigation={navigate} index={rowId}/>}
						renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
						renderSectionHeader={(sectionData) => <SectionHeader {...sectionData} />}
					/>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F5FCFF',
	},
	buttonContainer: {
		height: 50,
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
	},
	searchContainer: {
		height: 50,
	},
	listContainer: {
		flex: 1
	},
	input: {
		height: 40,
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
		meetings: state.meetings,
		isRunning: state.appState.isRunning,
		id: state.appState.currentMeeting
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);