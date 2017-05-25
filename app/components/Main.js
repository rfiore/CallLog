import React, { Component } from 'react';
import { connect } from 'react-redux';

import { bindActionCreators } from 'redux'
import { ActionCreators } from '../actions'

import { addNavigationHelpers, StackNavigator, TabNavigator } from 'react-navigation';

import HomeScreen from './Home';
import CreateMeetingScreen from './CreateMeeting';
import SettingsScreen from './Settings';
import ExportScreen from './Export';
import SearchScreen from './Search';


import {
	Button,
	Text,
	ScrollView,
	View,
	StyleSheet,
	TextInput,
	TouchableOpacity
} from 'react-native';


export const MainNavigator = TabNavigator({
	Home: 					{ screen: HomeScreen },
	CreateMeeting: 	{ screen: CreateMeetingScreen },
	Search: 				{ screen: SearchScreen },
	Export: 				{ screen: ExportScreen },
	Settings: 			{ screen: SettingsScreen },
}, {
	tabBarOptions: {
		activeTintColor: '#4F8EF7',
		indicatorStyle: {
	    backgroundColor: '#4F8EF7',
	  },
	  labelStyle:{
	  	color: '#4F8EF7',
	  },
	  showLabel: false,
    showIcon: true,
		style: {
	    backgroundColor: '#FFFFFF',
	  },
	},
});

class MainScreen extends Component {

	constructor(props) {
		super(props);

		this.state = {
			isLoading: true,
		}
	}

	static MainNavigator.navigationOptions = {
		title: 'Welcome',
		header: {
			visible: false,
		},
	};

	render() {

		return (
			<MainNavigator/>
		)
	}

}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
	return {
		state: state
	};
}


export default connect(null, mapDispatchToProps)(MainScreen);