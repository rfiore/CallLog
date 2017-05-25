import { types } from './types'


export function saveSettings(data) {
	return {
		type: types.SAVE_SETTINGS,
		payload: data
	}
}

export function setSearchKey(data) {
	return {
		type: types.SET_SEARCH_KEY,
		searchKey: data.searchKey
	}
}

export function addTempContact(data) {
	return {
		type: types.ADD_TEMP_CONTACT,
		tempContact: data.tempContact
	}
}

export function saveContactList(data) {
	return {
		type: types.SAVE_CONTACT_LIST,
		contacts: data.contacts
	}
}
