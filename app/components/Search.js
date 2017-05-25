import React, { Component } from 'react';
import { connect } from 'react-redux';

import { bindActionCreators } from 'redux'
import { ActionCreators } from '../actions'

import Dates from 'react-native-dates';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';

import {
	Button,
	Text,
	ScrollView,
	View,
	StyleSheet,
	TextInput,
	TouchableOpacity
} from 'react-native';


class SearchScreen extends Component {

	constructor(props) {
		super(props);

		this.setFilter = this.setFilter.bind(this);
		this.removeFilter = this.removeFilter.bind(this);

		this.state = {
			date: null,
			focus: 'startDate',
			startDate: this.props.startDate,
			endDate: this.props.endDate,
		}
	}

  static navigationOptions = {
		tabBarIcon: <Icon name="ios-calendar" size={28} color='#4F8EF7' />
  };

	setFilter() {
		this.props.setDates({
			startDate: this.state.startDate,
			endDate: this.state.endDate
		});
	}

	removeFilter() {
		this.props.setDates({
			startDate: false,
			endDate: false
		});
	}


	render() {
		const isDateBlocked = (date) => false;

		const onDatesChange = ({ startDate, endDate, focusedInput }) =>
			this.setState({ ...this.state, focus: focusedInput }, () =>
				this.setState({ ...this.state, startDate, endDate })
			);

		const onDateChange = ({ date }) =>
			this.setState({ ...this.state, date });


		return (
			<ScrollView style={styles.container}>
				<Text style={styles.screenTitle}>
					Search by date
				</Text>
				<Dates
					onDatesChange={onDatesChange}
					isDateBlocked={isDateBlocked}
					startDate={this.state.startDate}
					endDate={this.state.endDate}
					focusedInput={this.state.focus}
					range
				/>

				{ /* Set filter */ }
				<View style={styles.button}>
					<Button
						title='Set filter'
						onPress={this.setFilter}
					/>
				</View>

				{ /* Remove filter */ }
				<View style={styles.buttonLast}>
					<Button
						title='Remove filter'
						onPress={this.removeFilter}
					/>
				</View>
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		flexGrow: 1,
		backgroundColor: '#FFFFFF',
	},
	date: {
		fontFamily: 'Poppins-Regular',
		marginTop: 50
	},
	focused: {
		color: 'blue'
	},
	button: {
		marginBottom: 10,
	},
	buttonLast: {
		marginBottom: 60,
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
	return {
		startDate: state.appState.startDate,
		endDate: state.appState.endDate
	};
}


export default connect(mapStateToProps, mapDispatchToProps)(SearchScreen);