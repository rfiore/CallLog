import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { ActionCreators } from '../actions'
import Icon from 'react-native-vector-icons/Ionicons';

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
				<View style={styles.label}>
					<Text style={styles.labelText}>Rate</Text>
				</View>
				<TextInput
					style={styles.input}
					onChangeText={(text) => this.setState({rate: text})}
					value={(this.state.rate).toString()}
				/>
				<TextInput
					style={styles.input}
					onChangeText={(text) => this.setState({rate: text})}
					value={(this.state.rate).toString()}
				/>
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
		backgroundColor: '#F5FCFF',
	},
	label: {
		height: 40,
		flexDirection: 'row',
		alignItems: 'center',
	},
	labelText: {
		fontSize: 16,
		marginLeft: 10,
	},
	input: {
		height: 40,
		marginBottom: 10,
		fontSize: 16
	},
	welcome: {
		fontSize: 20,
		textAlign: 'center',
		margin: 10,
	},
	instructions: {
		textAlign: 'center',
		color: '#333333',
		marginBottom: 5,
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