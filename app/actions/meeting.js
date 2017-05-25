import { types } from './types'


export function setSearchedMeetings({ meetings }) {
	return {
		type: types.SET_SEARCHED_MEETINGS,
		meetings,
	}
}

export function goToMeeting(data) {
	return {
		type: types.GO_TO_MEETING,
		id: data.id,
	}
}

export function addMeeting(data) {
	return {
		type: types.ADD_MEETING,
		contactIndex: data.contactIndex,
		contactRecordID: data.contactRecordID,
		id: data.id,
		name: data.name,
		subject: data.subject,
		rate: data.rate,
		startAt: data.startAt,
		currency: data.currency
	}
}


export function addActivity(data) {
	return {
		type: types.ADD_ACTIVITY,
		contactIndex: null,
		id: data.id,
		name: data.name,
		subject: data.subject,
		rate: data.rate,
		startAt: data.startAt,
		currency: data.currency
	}
}

export function addCall(data) {
	return {
		type: types.ADD_CALL,
		contactIndex: data.contactIndex,
		id: data.id,
		name: data.name,
		subject: data.subject,
		rate: data.rate,
		startAt: data.startAt,
		currency: data.currency
	}
}

export function startMeeting(data) {
	return {
		type: types.START_MEETING,
		id: data.id,
		isRunning: true,
		name: data.name,
		subject: data.subject,
		rate: data.rate,
		startAt: data.startAt,
		endAt: data.startAt,
		cost: 0,
		contact: data.contact,
		partecipants: data.partecipants,
		calendarEvent: data.calendarEvent,
		number: null,
		currency: data.currency
	}
}

export function updateRate(data) {
	return {
		type: types.UPDATE_RATE,
		id: data.id,
		cost: data.cost,
		rate: data.rate,
		currency: data.currency
	}
}

export function stopMeeting(data) {
	return {
		type: types.STOP_MEETING,
		id: data.id,
		cost: data.cost,
		endAt: data.endAt
	}
}

export function removeMeeting(data) {
	return {
		type: types.REMOVE_MEETING,
		id: data.id,
	}
}

export function saveMeeting(data) {
	return {
		type: types.SAVE_MEETING,
		payload: { id: data.id, name: data.name, subject: data.subject, rate: data.rate },
		id: data.id,
		name: data.name,
		subject: data.subject,
		rate: data.rate,
		contact: data.contact,
	}
}

export function clearMeetings() {
	return {
		type: types.CLEAR_MEETINGS
	}
}

export function addContact(data) {
	return {
		type: types.ADD_CONTACT,
		id: data.id,
		contact: data.contact
	}
}

export function addPartecipant(data) {
	return {
		type: types.ADD_PARTECIPANT,
		id: data.id,
		partecipant: data.partecipant
	}
}

export function addEvent(data) {
	return {
		type: types.ADD_EVENT,
		id: data.id,
		calendarEvent: data.calendarEvent
	}
}

export function setDates(data) {
	return {
		type: types.SET_DATES,
		startDate: data.startDate,
		endDate: data.endDate
	}
}