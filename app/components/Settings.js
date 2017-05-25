import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { ActionCreators } from '../actions'
import Icon from 'react-native-vector-icons/Ionicons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { onlyNumbers, convertCurrency } from '../utils/utils';

import {
	Button,
	Text,
	View,
	StyleSheet,
	TextInput,
	Switch,
	Picker,
	Image
} from 'react-native';

class SettingsScreen extends Component {

	constructor(props) {
		super(props);

		this.saveSettings = this.saveSettings.bind(this);

		this.state = {
			rate: this.props.state.settings.rate,
			interval: this.props.state.settings.alertInterval,
			isAutoStart: this.props.state.settings.isAutoStart,
			currency: this.props.state.settings.currency,
		}
	}

	static navigationOptions = {
		tabBarIcon: <Icon name="ios-settings" size={28} color='#4F8EF7' />
  };

	saveSettings() {
		this.props.saveSettings({
			rate: this.state.rate,
			interval: this.state.interval,
			isAutoStart: this.state.isAutoStart,
			currency: this.state.currency,
		});
	}

	render() {
		const navigate = this.props.navigation;

		var self = this;
		
		return (
			<KeyboardAwareScrollView style={styles.container}>
				<Text style={styles.screenTitle}>
					Settings
				</Text>

				{ /* Rate */ }
				<Text style={styles.settingLabel}>RATE PER HOUR</Text>
				<View style={{ flex: 1, flexDirection: 'row' }}>
					<TextInput
						style={styles.settingInput}
						keyboardType = 'numeric'
						onChangeText={(text) => onlyNumbers(this, 'rate', text)}
						value={(this.state.rate).toString()}
					/>
					<Text style={{ width: 38, textAlign: 'center', paddingTop: 8 }}>{this.state.currency}</Text>
				</View>

				{ /* Alert */ }
				<Text style={styles.settingLabel}>ALERT INTERVAL (IN MINUTES)</Text>
				<TextInput
					style={styles.settingInput}
					keyboardType = 'numeric'
					onChangeText={(text) => onlyNumbers(this, 'interval', text)}
					value={(this.state.interval).toString()}
				/>

				{ /* Auto start */ }
				<Text style={styles.settingLabel}>START MEETING AUTOMATICALLY</Text>
				<Switch
					onValueChange={(value) => this.setState({isAutoStart: value})}
					style={{marginBottom: 10}}
					onTintColor='#4F8EF7'
					value={this.state.isAutoStart} />

				{ /* Currency */ }
				<Text style={styles.settingLabel}>CURRENCY</Text>
				<Picker
					selectedValue={this.state.currency}
					onValueChange={(currency) => convertCurrency(self, currency)}>
					<Picker.Item label="EUR" value="EUR" />
					<Picker.Item label="GBP" value="GBP" />
					<Picker.Item label="USD" value="USD" />
					<Picker.Item label="AUD" value="AUD" />
					<Picker.Item label="CAD" value="CAD" />
					<Picker.Item label="JPY" value="JPY" />
					<Picker.Item label="TRY" value="TRY" />
					<Picker.Item label="RUB" value="RUB" />
				</Picker>

			{ /* Save setting */ }
				<Button
					title='save'
					onPress={this.saveSettings}
				/>
			</KeyboardAwareScrollView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: '#FFFFFF',
	},
	settingLabel: {
		fontSize: 12,
		fontFamily: 'Poppins-Medium',
		color: '#4F8EF7',
		height: 20,
		marginLeft: 4
	},
	settingInput: {
		flex: 1,
		height: 40,
		fontSize: 15,
		fontFamily: 'Poppins-Regular',
		marginBottom: 16,
	},
	screenTitle: {
		fontSize: 21,
		color: '#4F8EF7',
		fontFamily: 'Poppins-Regular',
		marginLeft: 4,
		marginBottom: 16,
	},
});

function mapDispatchToProps(dispatch) {
	return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
	return {
		state: state,
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);