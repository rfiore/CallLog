import React from 'react';
import { View, Text, StyleSheet } from 'react-native';


const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 6,
		paddingLeft: 10,
		justifyContent: 'center',
		backgroundColor: '#EFEFEF',
	},
	text: {
		fontSize: 13,
		fontFamily: 'Poppins-Regular',
	},
});

const SectionHeader = (props) => (
	<View style={styles.container}>
		<Text style={styles.text}>{props.date}</Text>
	</View>
);

export default SectionHeader;