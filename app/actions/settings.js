import { types } from './types'


export function saveSettings(data) {
	return {
		type: types.SAVE_SETTINGS,
		payload: data.rate
	}
}
