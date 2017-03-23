import * as MeetingActions from './meeting'
import * as SettingsActions from './settings'
import * as AddActions from './AddActions'

export const ActionCreators = Object.assign({},
  MeetingActions,
  SettingsActions,
  AddActions
);
