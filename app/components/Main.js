import React, { Component } from 'react';
import { connect } from 'react-redux';

import { bindActionCreators } from 'redux'
import { ActionCreators } from '../actions'

import { NavigationActions } from 'react-navigation';

import Icon from 'react-native-vector-icons/Ionicons';

import Row from './Row';
import SectionHeader from './SectionHeader';

import Dates from 'react-native-dates';
import moment from 'moment';

import TimerMixin from 'react-timer-mixin';

import { NativeModules } from 'react-native';

//import CallLogList from 'CallLogList'

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
				console.log('run');
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

		//NativeModules.PhonecallReceiver.testCall((uri) => { console.log(uri) });

		const navigate = this.props.navigation;
		
		return (
			<View style={styles.container}>
				<View style={styles.header}>
					<View style={styles.titleContainer}>
						<Text style={styles.welcome}>Call Log</Text>
					</View>
					<View style={styles.buttonContainer}>
						<TouchableOpacity disabled={ this.props.isRunning } onPress={() => navigate.dispatch(NavigationActions.navigate({ routeName: 'CreateMeeting' }))}>
							<Icon name="ios-add-circle-outline" size={28} color="#4F8EF7" />
						</TouchableOpacity>
						<TouchableOpacity onPress={() => navigate.dispatch(NavigationActions.navigate({ routeName: 'Search' }))}>
							<Icon name="ios-calendar-outline" size={28} color="#4F8EF7" />
						</TouchableOpacity>
						<TouchableOpacity onPress={() => navigate.dispatch(NavigationActions.navigate({ routeName: 'Export' }))}>
							<Icon name="ios-download-outline" size={28} color="#4F8EF7" />
						</TouchableOpacity>
						<TouchableOpacity onPress={() => navigate.dispatch(NavigationActions.navigate({ routeName: 'Settings' }))}>
							<Icon name="ios-settings-outline" size={28} color="#4F8EF7" />
						</TouchableOpacity>
					</View>
				</View>
				<View style={styles.searchContainer}>
					<Icon style={styles.searchIcon} name="ios-search-outline" size={28} />
					<TextInput
						style={styles.searchInput}
						onChangeText={(text) => this.searchMeeting(this.props.meetings, text)}
						placeholder='Search...'
					/>
				</View>

				{this.props.startDate &&
					<View style={styles.searchContainer}>
						<Icon style={styles.searchIcon} name="ios-calendar-outline" size={28} />
						<Text style={styles.searchText}>{moment(this.props.startDate).format('YYYY/MM/DD')}  ›  {moment(this.props.endDate).format('YYYY/MM/DD')}</Text>
					</View>
				}

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
		backgroundColor: '#FFFFFF',
	},
	header: {
		flexDirection: 'row',
		height: 50,
	},
	titleContainer: {
		flex: 1,
		height: 50,
	},
	buttonContainer: {
		flex: 1,
		height: 50,
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
	},
	searchContainer: {
		height: 50,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-around',
		marginLeft: 10,
		marginRight: 10,
	},
	searchIcon: {
		marginLeft: 4,
		marginTop: 12,
		height: 36,
		width: 36,
	},
	searchInput: {
		flex: 1,
		height: 50,
		fontSize: 16,
		fontFamily: 'Poppins-Regular',
	},
	searchText: {
		flex: 1,
		marginTop: 4,
		marginLeft: 4,
		fontSize: 14,
		fontFamily: 'Poppins-Regular',
	},
	listContainer: {
		flex: 1
	},
	welcome: {
		fontSize: 20,
		marginTop: 10,
		marginLeft: 10,
		fontFamily: 'Poppins-Light',
		color: '#4F8EF7'
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

	const meetingArr = state.meetingsById.map((item, index) => {
	   return state.meetings[item]
	});

	return {
		meetings: meetingArr,
		isRunning: state.appState.isRunning,
		id: state.appState.currentMeeting,
		startDate: state.appState.startDate,
		endDate: state.appState.endDate,
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);