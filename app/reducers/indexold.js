
import { types } from '../actions/types';
import moment from 'moment';


export const meetingsById = (state = [], action) => {
	
	switch (action.type) {

		case 'ADD_MEETING':
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

export const meetings = (state = initialMeetingState, action) => {
	
	var meetingName = '';
	var meetingSubject = '';

	if(action.subject == ''){
		meetingSubject = 'Started at ' + moment().format('h:mm:ss a');
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
						id: action.id,
						type: 'meeting',
						name: meetingName,
						subject: meetingSubject,
						rate: action.rate,
						startAt: action.startAt,
						endAt: action.startAt,
						cost: 0,
						contacts: [],
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
						id: action.id,
						type: 'call',
						name: meetingName,
						subject: meetingSubject,
						rate: action.rate,
						startAt: action.startAt,
						endAt: action.startAt,
						cost: 0,
						contacts: [],
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
				}
			}

		case 'ADD_CONTACT': 

			var isDouble = false
			var contacts = state[action.id].contacts;

			contacts.forEach(function(element) {
				console.log(element.recordID, action.contact.recordID)
		    if(element.recordID == action.contact.recordID) {
		    	isDouble = true;
		    }
			});

			if(isDouble) {
				return state
			} else {
				contacts.push(action.contact);
					return {
					...state,
					[action.id]: {
						...state[action.id],
						contacts: contacts
					}
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

		case 'STOP_MEETING': 
			return {
				...state,
				[action.id]: {
					...state[action.id],
					isOver: true,
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

export const settings = (state = initialSettingsState, action) => {

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
	startDate: null,
	endDate: null,
	searchKey: ''
}

export const appState = (state = initialAppState, action) => {

	switch (action.type) {
		case 'ADD_MEETING':
			return {
				...state,
				isRunning: true,
				currentMeeting: action.id
			}

		case 'STOP_MEETING':
			return {
				...state,
				isRunning: false,
				currentMeeting: null
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

		default:
			return state
	}
}