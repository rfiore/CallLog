import { types } from '../actions/types'

// MEETINGS
const initialMeetingState = [];

export const meetings = (state = initialMeetingState, action) => {

	const meetings = state;

	switch (action.type) {
		case 'ADD_MEETING':
			return [
							...meetings,
							{
								isOver: false,
								id: action.id,
								type: 'meeting',
								name: action.name,
								subject: action.subject,
								rate: action.rate,
								startAt: action.startAt,
								endAt: action.startAt
							}
						]

		case 'UPDATE_MEETING':
			return meetings.map( (meeting, id) => {
					if(id !== action.id) {
							return meeting;
					}

					return {
							...meeting,
							endAt: action.endAt
					};
			});

		case 'STOP_MEETING':
			return meetings.map( (meeting, id) => {
					if(id !== action.id) {
							return meeting;
					}

					return {
							...meeting,
							isOver: true,
					};
			});

		case 'SAVE_MEETING':
			return meetings.map( (meeting, id) => {
					if(id !== action.id) {
							return meeting;
					}

					return {
							...meeting,
							name: action.name,
							subject: action.subject,
							rate: action.rate,
					};
			});


		default:
			return state
	}
}

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
	isRunning: false
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

		default:
			return state
	}
}