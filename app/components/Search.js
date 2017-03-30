import React, { Component } from 'react';
import { connect } from 'react-redux';

import { bindActionCreators } from 'redux'
import { ActionCreators } from '../actions'

import Dates from 'react-native-dates';
import moment from 'moment';

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
		title: 'Filter by date'
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
		margin: 10,
	},
	buttonLast: {
		marginLeft: 10,
		marginRight: 10,
		marginBottom: 60,
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