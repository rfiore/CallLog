import React, { Component } from 'react';
import { connect } from 'react-redux';

import { bindActionCreators } from 'redux'
import { ActionCreators } from '../actions'

import {
	Button,
	Text,
	View,
	ScrollView,
	StyleSheet,
	TextInput
} from 'react-native';


class MeetingScreen extends Component {

	constructor(props) {
		super(props);

		this.stopMeeting = this.stopMeeting.bind(this);
		this.saveMeeting = this.saveMeeting.bind(this);

		this.state = {
			id: this.props.navigation.state.params.id,
			name: this.props.navigation.state.params.name,
			subject: this.props.navigation.state.params.subject,
			rate: 100,
			isOver: this.props.navigation.state.params.isOver
		}
	}

	static navigationOptions = {
		title: (navigation, childRouter) => {
			return navigation.state.params.name;
		},
	};

	stopMeeting() {
		this.props.stopMeeting({
			id: this.state.id
		});
	}

	saveMeeting() {
		this.props.saveMeeting({
			id: this.state.id,
			name: this.state.name,
			subject: this.state.subject,
			rate: this.state.rate
		});
	}

	render() {

		var date1 = new Date(this.props.navigation.state.params.startAt);
		var date2 = new Date(this.props.navigation.state.params.endAt);
		var timeDiff = Math.abs(date2.getTime() - date1.getTime());
		var minutes = Math.floor(timeDiff / 60000);
  	var seconds = ((timeDiff % 60000) / 1000).toFixed(0);


		return (
			<ScrollView style={styles.container}>

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

				<View style={styles.label}>
					<Text style={styles.labelText}>Start at:{'\n'}{date1.toString()}</Text>
				</View>

				<View style={styles.label}>
					<Text style={styles.labelText}>End at:{'\n'}{date2.toString()}</Text>
				</View>

				<View style={styles.label}>
					<Text style={styles.labelText}>Duration:{'\n'}{minutes} min {seconds} sec</Text>
				</View>

				{this.state.isOver == false &&
					<View style={styles.button}>
						<Button
							color='#D91E18'
							title='Stop meeting'
							onPress={this.stopMeeting}
						/>
					</View>
				}
				<View style={styles.button}>
					<Button
						title='Save meeting'
						onPress={this.saveMeeting}
					/>
				</View>

			</ScrollView>
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
		marginBottom: 10,
	},
	labelText: {
		fontSize: 15,
	},
	input: {
		height: 40,
		fontSize: 16
	},
	button: {
		marginBottom: 10,
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
		state: state,
		isRunning: state.meetings.isRunning,
	};
}


export default connect(mapStateToProps, mapDispatchToProps)(MeetingScreen);