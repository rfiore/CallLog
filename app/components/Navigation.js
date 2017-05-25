import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { NavigationActions } from 'react-navigation';



const styles = StyleSheet.create({
	buttonContainer: {
		flex: 1,
		height: 50,
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
	}
});

const Navigation = (props) => (
	<View style={styles.buttonContainer}>
		<TouchableOpacity  onPress={() => props.navigate.dispatch(NavigationActions.navigate({ routeName: 'CreateMeeting' }))}>
			<Icon name="ios-add-circle-outline" size={28} color={ props.isRunning ? "#777777" : "#4F8EF7" } />
		</TouchableOpacity>
		<TouchableOpacity  onPress={() => props.navigate.dispatch(NavigationActions.navigate({ routeName: 'CreateActivity' }))}>
			<Icon name="ios-person" size={28} color={ props.isRunning ? "#777777" : "#4F8EF7" } />
		</TouchableOpacity>
		<TouchableOpacity onPress={() => props.navigate.dispatch(NavigationActions.navigate({ routeName: 'Search' }))}>
			<Icon name="ios-calendar-outline" size={28} color="#4F8EF7" />
		</TouchableOpacity>
		<TouchableOpacity onPress={() => props.navigate.dispatch(NavigationActions.navigate({ routeName: 'Export' }))}>
			<Icon name="ios-download-outline" size={28} color="#4F8EF7" />
		</TouchableOpacity>
		<TouchableOpacity onPress={() => props.navigate.dispatch(NavigationActions.navigate({ routeName: 'Settings' }))}>
			<Icon name="ios-settings-outline" size={28} color="#4F8EF7" />
		</TouchableOpacity>
	</View>
);

export default Navigation;


