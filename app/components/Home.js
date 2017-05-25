import React, { Component } from 'react';
import {
	Text,
	TextInput,
	View,
	ListView,
	StyleSheet
} from 'react-native';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import { ActionCreators } from '../actions'
import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';

import { formatData, filterByString, filterByDate } from '../utils/utils';


import Row from './Row';
import SectionHeader from './SectionHeader';
import Navigation from './Navigation';

import timer from 'react-native-timer';


class HomeScreen extends Component {

	constructor(props) {
		super(props);

		var self = this;

		//console.log('home');

		this.addMeeting = this.addMeeting.bind(this);
		this.searchMeeting = this.searchMeeting.bind(this);

		// Init meetings for listView
		const getSectionData = (dataBlob, sectionId) => dataBlob[sectionId];
		const getRowData = (dataBlob, sectionId, rowId) => dataBlob[`${rowId}`];

		const ds = new ListView.DataSource({
			rowHasChanged: (r1, r2) => r1 !== r2,
			sectionHeaderHasChanged : (s1, s2) => s1 !== s2,
			getSectionData,
			getRowData,
		});

		const meetingArr = this.props.state.meetingsById.map((item, index) => {
			 return this.props.state.meetings[item]
		});

		const { dataBlob, sectionIds, rowIds } = formatData(meetingArr);

		this.state = {
			isLoading: false,
			isRunning: this.props.state.appState.isRunning,
			notificationId: 0,
			isSearchVisible: false,
			searchKey: '',
			meetings: [],
			dataSource: ds.cloneWithRowsAndSections(dataBlob, sectionIds, rowIds),
			number: null,
			notificationTimer: null,
			endAt: null
		}
	}

  static navigationOptions = {
		tabBarIcon: <Icon name="ios-home" size={28} color='#4F8EF7' />
  };

 	// SEARCH MEETING
	searchMeeting(searchKey) {

		/*const meetingArr = this.props.screenProps.meetingsById.map((item, index) => {
			 return this.props.screenProps.meetings[item]
		});

		var filteredMeetingList = filterByString(meetingArr, searchKey);

		console.log(filteredMeetingList);

		const { dataBlob, sectionIds, rowIds } = formatData(filteredMeetingList);

		this.setState({
				searchKey: searchKey,
				dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlob, sectionIds, rowIds)
		}, () => this.props.setSearchKey({searchKey: searchKey}));*/
	}


  // RECEIVE PROPS
  // -------------------------------------------------------------------------------------
	componentWillReceiveProps(nextProps) {

		//console.log('home props');
/*		if(this.props.startDate !== nextProps.startDate) {
			console.log(filterByDate(nextProps.meetings, nextProps.startDate, nextProps.endDate));
		}
		*/

		//if (this.props.state.meetings !== nextProps.state.meetings) {

			if(this.state.searchKey == ''){
			
				this.setState({ isLoading: true });

				const meetingArr = nextProps.state.meetingsById.map((item, index) => {
					return nextProps.state.meetings[item]
				});

				const { dataBlob, sectionIds, rowIds } = formatData(meetingArr);

				this.setState({
						isLoading: false,
						dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlob, sectionIds, rowIds)
				});
			}


		//}
	}

	// ACTIONS
	// -------------------------------------------------------------------------------------

	addMeeting() {
		var meetingId = moment().format();

		this.props.addMeeting({
			id: meetingId,
			name: '',
			subject: '',
			rate: this.props.state.settings.rate,
			startAt: (new Date()).toJSON(),
			currency: this.props.state.settings.currency
		});
	}

  render() {
		const navigate = this.props.navigation;

		//console.log('home render');

		var self = this;

		//console.log('home render', this.state.endAt);

		return (
			<View style={styles.container}>
				<View style={styles.listContainer}>
					<ListView
						style={styles.container}
						dataSource={this.state.dataSource}
						renderRow={(data, sectionId, rowId) => <Row {...data} navigation={navigate}/>}
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
	}
});

function mapDispatchToProps(dispatch) {
	return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
	return {
		state: state,
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);