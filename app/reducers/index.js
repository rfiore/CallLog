import { combineReducers } from 'redux';
import { NavigationActions } from 'react-navigation';

import { AppNavigator } from '../containers/AppWithNavigationState';

import moment from 'moment';


// NAVIGATION
const initialNavState = {
  index: 0,
  routes: [
  	{ key: 'Welcome', routeName: 'Welcome' },
  ],
};


const nav = (state = initialNavState, action) => {
  switch (action.type) {

  	case 'ADD_MEETING':
  	case 'ADD_ACTIVITY':
  	case 'SAVE_SETTINGS':
		case 'START_MEETING':
		case 'REMOVE_MEETING':
		case 'SAVE_MEETING':
		case 'STOP_MEETING':
		case 'SET_DATES':
		case 'ADD_CALL':
		case 'SAVE_CONTACT_LIST':
			return AppNavigator.router.getStateForAction(NavigationActions.navigate({ routeName: 'Home' }), state);

		case 'ADD_TEMP_CONTACT':
			return AppNavigator.router.getStateForAction(NavigationActions.navigate({ routeName: 'CreateMeeting' }), state);

		case 'ADD_PARTECIPANT':
		case 'ADD_EVENT':
			return AppNavigator.router.getStateForAction(NavigationActions.back(), state);

    default:
      return AppNavigator.router.getStateForAction(action, state);
  }
}

// MEETING BY ID
const meetingsById = (state = [], action) => {
	
	switch (action.type) {

		case 'ADD_MEETING':
		case 'ADD_ACTIVITY':
		case 'ADD_CALL': 
				return [ ...state, action.id]

		case 'REMOVE_MEETING': 
				const prunedIds = state.filter(item => {
		    	return item !== action.id // return all the items not matching the action.id
		  	})

    		return prunedIds

		default:
				return state

	}
}

// MEETINGS
const initialMeetingState = {};

const meetings = (state = initialMeetingState, action) => {
	
	var meetingName = '';
	var meetingSubject = '';

	if(action.subject == ''){
		meetingSubject = 'Started at ' + moment(action.startAt).format('h:mm:ss a');
	} else {
		meetingSubject = action.subject;
	}

	switch (action.type) {

		case 'ADD_MEETING': 

				if(action.name == ''){
					meetingName = 'New meeting'
				} else {
					meetingName = action.name;
				}

				return {
					...state,
					[action.id]: {
						isOver: false,
						isRunning: true,
						contactIndex: action.contactIndex,
						contactRecordID: action.contactRecordID,
						id: action.id,
						type: 'meeting',
						name: meetingName,
						subject: meetingSubject,
						rate: action.rate,
						startAt: action.startAt,
						endAt: action.startAt,
						cost: 0,
						contact: null,
						partecipants: [],
						calendarEvent: {},
						number: null,
						currency: action.currency
					}
				}
			case 'ADD_ACTIVITY': 

				if(action.name == ''){
					meetingName = 'New activity'
				} else {
					meetingName = action.name;
				}

				return {
					...state,
					[action.id]: {
						isOver: false,
						isRunning: true,
						contactIndex: action.contactIndex,
						contactRecordID: action.contactRecordID,
						id: action.id,
						type: 'activity',
						name: meetingName,
						subject: meetingSubject,
						rate: action.rate,
						startAt: action.startAt,
						endAt: action.startAt,
						cost: 0,
						contact: null,
						partecipants: [],
						calendarEvent: {},
						number: null,
						currency: action.currency
					}
				}

			case 'ADD_CALL': 

				if(action.name == ''){
					meetingName = 'New call';
				} else {
					meetingName = action.name;
				}

				return {
					...state,
					[action.id]: {
						isOver: false,
						isRunning: true,
						contactIndex: action.contactIndex,
						id: action.id,
						type: 'call',
						name: meetingName,
						subject: meetingSubject,
						rate: action.rate,
						startAt: action.startAt,
						endAt: action.startAt,
						cost: 0,
						contact: null,
						partecipants: [],
						calendarEvent: {},
						number: null,
						currency: action.currency
					}
				}

		case 'SAVE_MEETING': 
			return {
				...state,
				[action.id]: {
					...state[action.id],
					name: action.name,
					subject: action.subject,
					rate: action.rate,
					contact: action.contact
				}
			}

		case 'ADD_PARTECIPANT': 

			var isDouble = false
			var partecipants = state[action.id].partecipants;

			partecipants.forEach(function(element) {
				console.log(element.recordID, action.partecipant.recordID)
		    if(element.recordID == action.partecipant.recordID) {
		    	isDouble = true;
		    }
			});

			if(isDouble) {
				return state
			} else {
				partecipants.push(action.partecipant);
					return {
					...state,
					[action.id]: {
						...state[action.id],
						partecipants: partecipants
					}
				}
			}

		case 'ADD_CONTACT': 
			return {
				...state,
				[action.id]: {
					...state[action.id],
					contact: action.contact,
				}
			}

		case 'ADD_EVENT': 
			return {
				...state,
				[action.id]: {
					...state[action.id],
					calendarEvent: action.calendarEvent,
				}
			}
			
		case 'UPDATE_RATE': 
			return {
				...state,
				[action.id]: {
					...state[action.id],
					cost: action.cost,
					rate: action.rate,
					currency: action.currency
				}
			}

		case 'START_MEETING': 
			return {
				...state,
				[action.id]: {
					...state[action.id],
						isRunning: true,
						name: action.name,
						subject: action.subject,
						rate: action.rate,
						startAt: action.startAt,
						endAt: action.startAt,
						cost: 0,
						contact: action.contact,
						partecipants: action.partecipants,
						calendarEvent: action.calendarEvent,
						number: null,
						currency: action.currency
				}
			}

		case 'STOP_MEETING': 
			return {
				...state,
				[action.id]: {
					...state[action.id],
					isOver: true,
					isRunning: false,
					cost: action.cost,
					endAt: action.endAt
				}
			}

		case 'REMOVE_MEETING': 
      delete state[action.id] // delete the hash associated with the action.id
      
      return { 
      	...state 
      }

		default:
			return state
	}
}

// SETTINGS
const initialSettingsState = {
	rate: 100, 
	alertInterval: 1,
	isAutoStart: false,
	currency: 'EUR'
};

const settings = (state = initialSettingsState, action) => {

	const {type, payload} = action;

	switch (type) {
		case 'SAVE_SETTINGS':
			return {
				...state,
				rate: payload.rate,
				alertInterval: payload.interval,
				isAutoStart: payload.isAutoStart,
				currency: payload.currency
			}

		default:
			return state
	}
}

// APP STATE
const initialAppState = {
	isRunning: false,
	currentMeeting: null,
	navMeeting: null,
	startDate: null,
	endDate: null,
	searchKey: '',
	tempContact: {},
	tempStartAt: null,
	contacts: [],
	contactsObj: {}
}

const appState = (state = initialAppState, action) => {

	switch (action.type) {
		case 'GO_TO_MEETING':
			return {
				...state,
				navMeeting: action.id
			}

		case 'ADD_MEETING':
			return {
				...state,
				isRunning: true,
				currentMeeting: action.id
			}

		case 'ADD_ACTIVITY':
			return {
				...state,
				isRunning: true,
				currentMeeting: action.id
			}

		case 'START_MEETING':
			return {
				...state,
				isRunning: true,
			}

		case 'STOP_MEETING':
			return {
				...state,
				isRunning: false,
				currentMeeting: null,
				tempContact: {}
			}

		case 'ADD_CALL':
			return {
				...state,
				isRunning: true,
				currentMeeting: action.id
			}

		case 'SET_DATES':
			return {
				...state,
				startDate: action.startDate,
				endDate: action.endDate
			}

		case 'SET_SEARCH_KEY':
			return {
				...state,
				searchKey: action.searchKey
			}

		case 'ADD_TEMP_CONTACT': 
			return {
				...state,
				tempContact: action.tempContact,
			}

		case 'SAVE_CONTACT_LIST': 

			var contactsObj = action.contacts.reduce(function(acc, cur, i) {
			  acc[cur.recordID] = cur;
			  return acc
			}, {});

			return {
				...state,
				contacts: action.contacts,
				contactsObj: contactsObj
			}

		default:
			return state
	}
}

const AppReducer = combineReducers({
  nav,
  meetingsById,
  meetings,
  settings,
  appState
});

export default AppReducer;