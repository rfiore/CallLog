import React, { Component } from 'react';
import {
	View,
	ListView,
	Text,
	Navigator,
	StyleSheet,
	TouchableHighlight,
	TouchableOpacity
} from 'react-native';

import Row from './Row';
import SectionHeader from './SectionHeader';

export default class Main extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View style={styles.container}>
				<ListView
					style={styles.container}
					dataSource={this.props.data}
					renderRow={(data, sectionId, rowId) => <Row {...data} goToMeeting={this.props.goToMeeting} index={rowId}/>}
					renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
					renderSectionHeader={(sectionData) => <SectionHeader {...sectionData} />}
				/>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: 20,
	},
	separator: {
		flex: 1,
		height: StyleSheet.hairlineWidth,
		backgroundColor: '#8E8E8E',
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