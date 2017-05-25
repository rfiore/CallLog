import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator, TabNavigator } from 'react-navigation';
import Notification from 'things-notification';
import PushNotification from 'react-native-push-notification';
import moment from 'moment';
import Contacts from 'react-native-contacts';
import Spinner from 'react-native-loading-spinner-overlay';
import { bindActionCreators } from 'redux'
import { ActionCreators } from '../actions'

import TestScreen from '../components/Test';
import CreateMeetingScreen from '../components/CreateMeeting';
import MeetingScreen from '../components/Meeting';
import SettingsScreen from '../components/Settings';

import { searchContact } from '../utils/utils';


class AppContainer extends React.Component {

	constructor(props) {
		super(props);
	}
	
	render() {
		return (
			<AppNavigator screenProps={this.props.state} navigation={addNavigationHelpers({
				dispatch: this.props.dispatch,
				state: this.props.nav,
			})} />
		);
	}
}

AppWithNavigationState.propTypes = {
	dispatch: PropTypes.func.isRequired,
	nav: PropTypes.object.isRequired,
};

/*function mapDispatchToProps(dispatch) {
	return bindActionCreators(ActionCreators, dispatch);
}*/

function mapStateToProps(state) {
	return {
		state: state,
		nav: state.nav,
	};
}

export default connect(mapStateToProps)(AppContainer);