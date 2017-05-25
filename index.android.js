import React from 'react';
import { AppRegistry, AsyncStorage } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { persistStore, autoRehydrate } from 'redux-persist';
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'

import AppReducer from './app/reducers';
import AppWithNavigationState from './app/containers/AppWithNavigationState';

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
persistStore(store, { storage: AsyncStorage }).purge();

class App extends React.Component {

	render() {
		console.log('app')
		return (
			<Provider store={store}>
				<AppWithNavigationState />
			</Provider>
		);
	}
}

AppRegistry.registerComponent('CallLog', () => App);

