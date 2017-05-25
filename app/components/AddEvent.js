import React, { Component } from 'react';
import { connect } from 'react-redux';

import { bindActionCreators } from 'redux'
import { ActionCreators } from '../actions'

import RNCalendarEvents from 'react-native-calendar-events';
import moment from 'moment';

import Spinner from 'react-native-loading-spinner-overlay';

import {
	Button,
	Text,
	ScrollView,
	View,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	Linking
} from 'react-native';


class AddEventScreen extends Component {

	constructor(props) {
		super(props);

		this.addEvent = this.addEvent.bind(this);

		this.state = {
			events: [],
			id: this.props.navigation.state.params.id,
			isLoading: false
		}
	}

	static navigationOptions = {
		title: 'Add event'
	};

	addEvent(calendarEvent) {
			this.props.addEvent({
			id: this.state.id,
			calendarEvent: calendarEvent
		});
	}

	componentDidMount() {

		var self = this;

		var today     = moment(this.state.startAt).subtract(7,'d').startOf('day').toDate();
		var tomorrow  = moment(this.state.startAt).add(7,'d').endOf('day').toDate();

		console.log('today:', today, 'tomorrow:', tomorrow);

		RNCalendarEvents.fetchAllEvents(today, tomorrow)
			.then(events => {
				// handle events
				console.log('Events: ', events)

				self.setState({
					isLoading: false,
					events: events
				});
			})
			.catch(error => {
				console.log('Events: ', error);
				self.setState({
					isLoading: false,
				});
			});
	}

	render() {
		var self = this;

		
		var eventsList = this.state.events.map(function(calendarEvent, index) {
						let calendarLink = 'content://com.android.calendar/events/' + calendarEvent.id;

						return <TouchableOpacity key={index} onPress={() => self.addEvent(calendarEvent)} style={styles.settingTouch}>
										<Text style={styles.settingTouchText}>{calendarEvent.title}</Text>
									</TouchableOpacity>
					});

		if(eventsList.length < 1) {
			eventsList = <Text>No event found for this date</Text>
		}

		return (
			<ScrollView style={styles.container}>
				{eventsList}
				<Spinner visible={this.state.isLoading} textContent={""} textStyle={{color: '#FFF'}} overlayColor='rgba(0, 0, 0, 0.75)'/>
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


export default connect(mapStateToProps, mapDispatchToProps)(AddEventScreen);