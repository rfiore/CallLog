import React, { Component } from 'react';
import { connect } from 'react-redux';

import { bindActionCreators } from 'redux'
import { ActionCreators } from '../actions'

import {
	Button,
	Text,
	View,
	StyleSheet,
	TextInput
} from 'react-native';


class CreateMeetingScreen extends Component {

	constructor(props) {
		super(props);

		this.addMeeting = this.addMeeting.bind(this);

		this.state = {
			id: this.props.id,
			name: '',
			subject: '',
			rate: 100,
		}
	}

	static navigationOptions = {
		title: 'Create Meeting'
	};

	addMeeting() {
		this.props.addMeeting({
			id: this.state.id,
			name: this.state.name,
			subject: this.state.subject,
			rate: this.state.rate,
			startAt: (new Date()).toJSON()
		});
	}

	render() {
		var now = (new Date()).toJSON();

		return (
			<View style={styles.container}>

				<View style={styles.label}>
					<Text style={styles.labelText}>Name</Text>
				</View>
				<TextInput
					style={styles.input}
					onChangeText={(text) => this.setState({name: text})}
					value={this.state.name}
				/>

				<View style={styles.label}>
					<Text style={styles.labelText}>Subject</Text>
				</View>
				<TextInput
					style={styles.input}
					onChangeText={(text) => this.setState({subject: text})}
					value={this.state.subject}
				/>

				<View style={styles.label}>
					<Text style={styles.labelText}>Rate</Text>
				</View>
				<TextInput
					style={styles.input}
					onChangeText={(text) => this.setState({rate: text})}
					value={(this.state.rate).toString()}
				/>

				<Button
					title='Start meeting'
					onPress={this.addMeeting}
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
		id: state.meetings.length
	};
}


export default connect(mapStateToProps, mapDispatchToProps)(CreateMeetingScreen);