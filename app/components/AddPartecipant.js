import React, { Component } from 'react';
import { connect } from 'react-redux';

import { bindActionCreators } from 'redux'
import { ActionCreators } from '../actions'

var Contacts = require('react-native-contacts')

import Spinner from 'react-native-loading-spinner-overlay';

import {
	Button,
	Text,
	ScrollView,
	View,
	ListView,
	StyleSheet,
	TextInput,
	TouchableOpacity
} from 'react-native';


class AddPartecipantScreen extends Component {

	constructor(props) {
		super(props);

		this.addPartecipant = this.addPartecipant.bind(this);

		var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

		this.state = {
			contacts: this.props.state.appState.contacts,
			id: this.props.navigation.state.params.id,
			isLoading: false,
			type:  this.props.navigation.state.params.type,
			dataSource: ds.cloneWithRows(this.props.state.appState.contacts),
		}

		//console.log('AddPartecipantScreen');
	}

	static navigationOptions = {
		title: 'Add contact'
	};

	addPartecipant(partecipant) {
		//console.log(this.state.type, partecipant);
		this.setState({isLoading: true});

		if(this.state.type == 'partecipant') {
			this.props.addPartecipant({
				id: this.state.id,
				partecipant: partecipant
			});
		} else if(this.state.type == 'contact') {
			this.props.addTempContact({
				tempContact: partecipant
			});
		}

		this.setState({isLoading: false});
	}

	render() {
		var self = this;
		
		return (

			<View style={styles.container}>
				<ListView
					dataSource={this.state.dataSource}
					renderRow={(rowData) => <TouchableOpacity onPress={() => self.addPartecipant(rowData)} style={styles.settingTouch}>
																		<Text style={styles.settingTouchText}>{rowData.givenName} {rowData.familyName}</Text>
																	</TouchableOpacity> }
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
	settingTouch: {
		flex: 1,
		padding: 12,
		borderBottomWidth: 1,
		borderBottomColor: '#EEEEEE',
		backgroundColor: '#FFFFFF',
	},
	settingTouchText: {
		fontSize: 15,
		fontFamily: 'Poppins-Regular',
		color: '#4F8EF7',
	},
});

function mapDispatchToProps(dispatch) {
	return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
	return {
		state: state
	};
}


export default connect(mapStateToProps, mapDispatchToProps)(AddPartecipantScreen);