import React, {
	Component,
	PropTypes
} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { ActionCreators } from '../actions'

import {
	addNavigationHelpers,
	StackNavigator
} from 'react-navigation';


import test from '../components/Test'

const AppNavigator = StackNavigator({
	test1: { screen: test },
	test2: { screen: test },
});


export const navReducer = (state, action) => {
	const newState = AppNavigator.router.getStateForAction(action, state);
	return newState || state;
};


class AppContainer extends Component {

	render () {
		const { dispatch, navigationState} = this.props

		console.log(navigationState, this.props);

		return (
			<AppNavigator navigation={addNavigationHelpers({
				dispatch: dispatch,
				state: navigationState,
			})} />
		)
	}
}

function mapDispatchToProps(dispatch) {
	return Object.assign({dispatch: dispatch}, bindActionCreators(ActionCreators, dispatch));
}

function mapStateToProps(state) {
	return {
		navigationState: state.nav,
	};
}


export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);