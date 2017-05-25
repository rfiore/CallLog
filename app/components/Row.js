import React, { Component } from 'react';
import {
	View,
	Text, 
	StyleSheet,
	Image,
	TouchableOpacity
} from 'react-native';

import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
//import timer from 'react-native-timer';

export default class Row extends Component {

	constructor(props) {
		super(props);

		this.goToMeeting = this.goToMeeting.bind(this);
		this.tick = this.tick.bind(this);

		this.state = {
			id: this.props.id,
			isOver: this.props.isOver,
			startAt: this.props.startAt,
			endAt: this.props.endAt,
			currency: this.props.currency,
			name: this.props.name,
			subject: this.props.subject,
			isRunning: false,
			timer: 0
		}

		//console.log('row');
		//console.log(this.props.subject, 'constructor');
		//timer.setInterval(this, 'tick', () => this.setState({ endAt: (new Date()).toJSON() }), 1000);
	}

	goToMeeting(){
		this.props.navigation.dispatch(NavigationActions.navigate({ routeName: 'Meeting', params: {id: this.props.id} }));
	}

	// LIFE CYCLE
	// -------------------------------------------------------------------------------------

	componentWillReceiveProps(nextProps) {
	
		var self = this;
		//console.log(this.props.subject, 'receive', nextProps.isRunning);

		this.setState({
			isOver: nextProps.isOver,
			startAt: nextProps.startAt,
			endAt: nextProps.endAt,
			name: nextProps.name,
			subject: nextProps.subject
		});

		if( nextProps.isRunning === true && this.state.isRunning === false ) {


			console.log('Prop isRunning is true, State isRunning is false')

			this.setState({
				timer: this.state.timer++,
				isRunning: true
			}, function(){
				console.log(this.state.timer, this.state.id);
				if(this.state.timer === 1){
					console.log(this.state.timer, 'receive start', this.props.isRunning, this.state.id);
					var timer = setInterval(self.tick, 1000);
	    		this.setState({timer: timer});
				}
			})
			
		} /*else if( nextProps.isRunning === false &&  this.state.timer !== null ){
			console.log(this.state.timer, 'receive stop', nextProps.isRunning);
			clearInterval(this.state.timer);
			this.setState({
				timer: null,
				isRunning: false
			});
		}*/

		//console.log('row props:', nextProps.id, 'isOver', nextProps.isOver, 'isRunning', this.state.isRunning);
	}

/*	componentDidMount() {
		if(this.props.isRunning === true) {
			let timer = setInterval(this.tick, 1000);
	    this.setState({timer});
			console.log(this.state.timer, 'did', this.props.isRunning);
		}
	}*/

	componentWillUnmount() {
		console.log(this.state.timer, 'will', this.props.isRunning);
		clearInterval(this.state.timer);
		this.setState({timer: null});
	}

	// TIMER
	// -------------------------------------------------------------------------------------

	tick() {
		if(this.state.isRunning === false){
			clearInterval(this.state.timer);
			this.setState({timer: null});
		} else {
			console.log(this.state.id, 'row tick');
			this.setState({
				endAt: (new Date()).toJSON()
			});
		}

	}


	render() {

		var meetingIcon;

		if(this.props.type === 'call') {
			meetingIcon = (<Icon name="ios-call" size={30} color="#4F8EF7" />);
		} else if(this.props.type === 'meeting') {
			meetingIcon = (<Icon name="ios-people" size={30} color="#4F8EF7" />);
		} else if(this.props.type === 'activity') {
			meetingIcon = (<Icon name="ios-person" size={30} color="#4F8EF7" />);
		}

		var date1 = new Date(this.state.startAt);
		var date2 = new Date(this.state.endAt);
		var timeDiff = Math.abs(date2.getTime() - date1.getTime());
		var minutes = Math.floor(timeDiff / 60000);
  	var seconds = ((timeDiff % 60000) / 1000).toFixed(0);
  	var cost = (moment.duration(timeDiff).asHours() * this.props.rate).toFixed(2);

  	//console.log(moment(this.state.startAt).format('HH-mm-ss'), this.props);

  	//console.log(this.state.subject, 'render');

		return (
			<View style={ !this.props.isRunning ? styles.container : styles.containerRunning }>
				<TouchableOpacity onPress={this.goToMeeting} style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
					<View style={{ width: 38 }}>
						{meetingIcon}
					</View>
					<View>
						<Text style={styles.heading}>
							{this.state.name}
						</Text>
						<Text style={styles.text}>
							{this.state.subject}
						</Text>
						<Text style={styles.info}>
							<Text style={styles.label}>DURATION:</Text> {minutes} min {seconds} sec<Text style={styles.label}>   |   COST:</Text> {cost} {this.state.currency}
						</Text>
					</View>
				</TouchableOpacity>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 12,
		borderBottomWidth: 1,
		borderBottomColor: '#EEEEEE',
	},
	containerRunning: {
		flex: 1,
		padding: 12,
		backgroundColor: '#9ec0fa'
	},
	heading: {
		fontSize: 18,
		fontFamily: 'Poppins-Regular',
		color: '#4F8EF7'
	},
	text: {
		fontSize: 15,
		fontFamily: 'Poppins-Regular'
	},
	info: {
		marginTop: 6,
		fontSize: 12,
		fontFamily: 'Poppins-Medium'
	},
	label: {
		color: '#4F8EF7'
	}
});