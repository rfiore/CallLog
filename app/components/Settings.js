import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { ActionCreators } from '../actions'
import Icon from 'react-native-vector-icons/Ionicons';

import { onlyNumbers } from '../utils/utils';

import {
	Button,
	Text,
	View,
	StyleSheet,
	TextInput
} from 'react-native';

class SettingsScreen extends Component {

	constructor(props) {
		super(props);

		this.saveSettings = this.saveSettings.bind(this);

		this.state = {
			rate: this.props.settings.rate
		}

	}

	static navigationOptions = {
		title: 'Settings',
	};

	saveSettings() {
		this.props.saveSettings({rate: this.state.rate});
	}

	render() {
		const navigate = this.props.navigation;
		
		return (
			<View style={styles.container}>

				{ /* Rate */ }
				<Text style={styles.settingLabel}>RATE PER HOUR</Text>
				<TextInput
					style={styles.settingInput}
					keyboardType = 'numeric'
					onChangeText={(text) => onlyNumbers(this, 'rate', text)}
					value={this.state.rate}
				/>

			{ /* Save setting */ }
				<Button
					title='save'
					onPress={this.saveSettings}
				/>
			</View>
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
		height: 40,
		fontSize: 15,
		fontFamily: 'Poppins-Regular',
		marginBottom: 16,
	},
});

function mapDispatchToProps(dispatch) {
	return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
	return {
		settings: state.settings
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);