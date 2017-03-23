import { types } from './types'

export function add(item) {
	return {
		type: types.ADD,
		payload: item
	}
}