import React from 'react';
import {
	AppRegistry,
	AsyncStorage,
} from 'react-native';
import {
	NavigationActions,
	addNavigationHelpers,
	StackNavigator,
} from 'react-navigation';
import {
	Provider,
	connect,
} from 'react-redux';
import {
	createStore,
	combineReducers,
	applyMiddleware,
	compose
} from 'redux';
import {
	persistStore,
	autoRehydrate,
} from 'redux-persist';

import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'

import { meetings, settings, appState} from './app/reducers/index'

import SettingsScreen from './app/components/Settings'
import MainScreen from './app/components/Main'
import MeetingScreen from './app/components/Meeting'
import CreateMeetingScreen from './app/components/CreateMeeting'
import ExportScreen from './app/components/Export'

const AppNavigator = StackNavigator({
	Settings: 			{ screen: SettingsScreen },
	Main: 					{ screen: MainScreen },
	Meeting: 				{ screen: MeetingScreen },
	CreateMeeting: 	{ screen: CreateMeetingScreen },
	Export: 				{ screen: ExportScreen },
});

// TO DO: Create container with this component
const AppWithNavigationState = connect(state => ({
	nav: state.nav,
}))(({ dispatch, nav }) => (
	<AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav })} />
));

const initialNavState = {
	index: 0,
	routes: [
		{ key: 'InitA', routeName: 'Main' }
	],
};

const nav = (state = initialNavState, action) => {
	var state = Object.assign({}, state);

	switch (action.type) {
		case 'ADD_MEETING':
			return AppNavigator.router.getStateForAction(NavigationActions.navigate({ routeName: 'Main' }), state);

		case 'SAVE_SETTINGS':
			return AppNavigator.router.getStateForAction(NavigationActions.navigate({ routeName: 'Main' }), state);

		case 'STOP_MEETING':
			return AppNavigator.router.getStateForAction(NavigationActions.navigate({ routeName: 'Main' }), state);

		case 'SAVE_MEETING':
			return AppNavigator.router.getStateForAction(NavigationActions.navigate({ routeName: 'Main' }), state);

		default:
			return AppNavigator.router.getStateForAction(action, state);
	}
}

const AppReducer = combineReducers({
	appState,
	meetings,
	settings,
	nav,
});

const loggerMiddleware = createLogger({ predicate: (getState, action) => __DEV__  });

function configureStore() {
	const enhancer = compose(
		applyMiddleware(
			thunkMiddleware,
			loggerMiddleware,
		),
		autoRehydrate()
	);
	return createStore(AppReducer, undefined, enhancer);
}

const store = configureStore();
persistStore(store, { storage: AsyncStorage }); //.purge();


class App extends React.Component {
	render() {
		return (
			<Provider store={store}>
				<AppWithNavigationState />
			</Provider>
		);
	}
}

AppRegistry.registerComponent('CallLog', () => App);

