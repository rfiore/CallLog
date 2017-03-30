import { types } from './types'


export function setSearchedMeetings({ meetings }) {
	return {
		type: types.SET_SEARCHED_MEETINGS,
		meetings,
	}
}

export function addMeeting(data) {
	return {
		type: types.ADD_MEETING,
		id: data.id,
		name: data.name,
		subject: data.subject,
		rate: data.rate,
		startAt: data.startAt
	}
}

export function addCall(data) {
	return {
		type: types.ADD_CALL,
		id: data.id,
		name: data.name,
		subject: data.subject,
		rate: data.rate,
		startAt: data.startAt
	}
}

export function updateMeeting(data) {
	return {
		type: types.UPDATE_MEETING,
		id: data.id,
		endAt: data.endAt
	}
}

export function stopMeeting(data) {
	return {
		type: types.STOP_MEETING,
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

export function setDates(data) {
	return {
		type: types.SET_DATES,
		startDate: data.startDate,
		endDate: data.endDate
	}
}