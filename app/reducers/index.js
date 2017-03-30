import { types } from '../actions/types'

export const meetingsById = (state = [], action) => {
	
	switch (action.type) {

		case 'ADD_MEETING': 
				return [ ...state, action.id]


		default:
			return state

	}
}


// MEETINGS
const initialMeetingState = {};

export const meetings = (state = initialMeetingState, action) => {
	
	switch (action.type) {

		case 'ADD_MEETING': 
				return {
					...state,
					[action.id]: {
						isOver: false,
						id: action.id,
						type: 'meeting',
						name: action.name,
						subject: action.subject,
						rate: action.rate,
						startAt: action.startAt,
						endAt: action.startAt,
						contacts: [],
						number: false
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

		case 'UPDATE_MEETING': 
			return {
				...state,
				[action.id]: {
					...state[action.id],
					endAt: action.endAt,
				}
			}

		case 'STOP_MEETING': 
			return {
				...state,
				[action.id]: {
					...state[action.id],
					isOver: true,
				}
			}

		default:
			return state
	}
}
/*
		case 'UPDATE_MEETING': {
				meetings.byHash[action.id] = {
					...meetings.byHash[action.id],
					endAt: action.endAt
				}
				return {
					...meetings
				}
			}

		case 'STOP_MEETING': {
				meetings.byHash[action.id] = {
					...meetings.byHash[action.id],
					isOver: true,
				}
				return {
					...meetings
				}
			}

		case 'SAVE_MEETING': {
				console.log('reducer', meetings)

				meetings.byHash[action.id] = {
					...meetings.byHash[action.id],
					name: action.name,
					subject: action.subject,
					rate: action.rate,
				}

				return meetings

				return meetings.byId.map( (meeting, id) => {
						if(id !== action.id) {
								return meetings.byHash[action.id]
						}

						return {
								...meetings.byHash[action.id],
								name: action.name,
								subject: action.subject,
								rate: action.rate,
						};
				});
			}

		case 'ADD_CONTACT':
			return meetings.map( (meeting, id) => {
					if(id !== action.id) {
							return meeting;
					}

					return {
							...meeting,
							contacts: [
								...meeting.contacts,
								action.contact
							]
					};
			});

		case 'ADD_CALL':
			return [
							...meetings,
							{
								isOver: false,
								id: action.id,
								type: 'call',
								name: action.name,
								subject: action.subject,
								rate: action.rate,
								startAt: action.startAt,
								endAt: action.startAt,
								contacts: [],
								number: action.number
							}
						]*/




// SETTINGS
const initialSettingsState = {
	rate: 100, 
	alertDuration: 10
};

export const settings = (state = initialSettingsState, action) => {

	const {type, payload} = action;

	switch (type) {
		case 'SAVE_SETTINGS':
			return {
				...state,
				rate: payload
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

		default:
			return state
	}
}