import {PhoneNumberFormat, PhoneNumberUtil} from 'google-libphonenumber';
import moment from 'moment';

export const onlyNumbers = (context, stateKey, text) => {

		console.log(text);

		let newText = '';
		let numbers = '+0123456789';

		for (var i = 0; i < text.length; i++) {
				if ( numbers.indexOf(text[i]) > -1 ) {
						newText = newText + text[i];
				}
		}

		context.setState({[stateKey]: newText})
}

// FORMAT MEETINGS LIST
export const formatData = (data) => {
	var dates = {};
	var dateArr = [];

	data.forEach(function(item) {

		var rawDate = new Date(item.startAt)
		var formatterdDate = rawDate.toDateString();

		if (!dates[formatterdDate]) {
				dates[formatterdDate] = 0;
				dateArr.push(formatterdDate);
		}

		dates[formatterdDate]++;
	});

	dateArr.reverse();

	const dataBlob = {};
	const sectionIds = [];
	const rowIds = [];

	for (let sectionId = 0; sectionId < dateArr.length; sectionId++) {

		const meetings = data.filter((meeting) => new Date(meeting.startAt).toDateString() === dateArr[sectionId]);

		meetings.reverse();

		sectionIds.push(sectionId);
		dataBlob[sectionId] = { date: dateArr[sectionId] };
		rowIds.push([]);

		for (let i = 0; i < meetings.length; i++) {

			const rowId = `${sectionId}:${i}`;
			rowIds[rowIds.length - 1].push(rowId);
			dataBlob[rowId] = meetings[i];
		}
	}
	return { dataBlob, sectionIds, rowIds };
}

// FILTER BY STRING
export const filterByString = (arr, searchKey) => {
	console.log('filterByString', arr, searchKey);
	return arr.filter(obj => Object.keys(obj).some(key => obj[key].toString().toLowerCase().includes(searchKey.toLowerCase())));
}

// FILTER BY DATE
export const filterByDate = (arr, start, end) => {
		
	var date;
	var startDate;
	var endDate;

	var dateRange = arr.filter(function (item) {
			date = new Date(item.startAt);
			startDate = new Date(start);
			endDate = new Date(end);

			return date >= startDate && date <= endDate
	});

	return dateRange
} 

// SEARCH MEETING
/*export const searchMeeting = (context, arr, searchKey) => {
	var filteredMeetingList = this.filterByString(arr, searchKey);

	const { dataBlob, sectionIds, rowIds } = context.formatData(filteredMeetingList);

	context.setState({
			searchKey: searchKey,
			dataSource: context.state.dataSource.cloneWithRowsAndSections(dataBlob, sectionIds, rowIds)
	}, () => context.props.setSearchKey({searchKey: searchKey}));
}*/


// SEARCH CONTACT
export const searchContact = (contacts, number) => {
	const phoneUtil = PhoneNumberUtil.getInstance();

	var matchedContact = null;

	var parsedNumber = phoneUtil.parse(number, 'GB');

	var formattedNumber = phoneUtil.format(parsedNumber, PhoneNumberFormat.INTERNATIONAL);
	

	contacts.forEach(function(contact, index){
		let curContact = contact;

		contact.phoneNumbers.forEach(function(phoneNumber, phoneIndex){
			let isValid = false;

			//console.log(index);

			try {
		    isValid =  phoneUtil.isValidNumber(phoneUtil.parse(phoneNumber.number, 'GB'));
		  } catch(e) {
		  	isValid = false;
		  	console.log(e)
		  }

			if(isValid){

				let contactParsedNumber = phoneUtil.parse(phoneNumber.number, 'GB');

				let contactFormattedNumber = phoneUtil.format(contactParsedNumber, PhoneNumberFormat.INTERNATIONAL);

				//console.log('formattedNumber: ', formattedNumber, 'contactFormattedNumber: ', contactFormattedNumber);

				if(contactFormattedNumber == formattedNumber) {
					
					matchedContact = {
						index: index,
						length: contacts.length,
						data: curContact
					}
				}
			}

		});
	});

	if(matchedContact) {
		return matchedContact
	} else {
		return {
			index: null,
			length: contacts.length,
			data: null
		}
	}

	
}


export const isEmpty = (obj) =>  {
	if(obj){
		return obj
	} else {
		return ''
	}
}

export const getFirstItem = (obj, property) =>  {
	try {
  	return obj[0][property]
	}
	catch(err) {
	  return ''
	}
}

// CONVERT CURRENCY
export const convertCurrency = (context, currency) => {
/*	var self = context;
	
	var request = 'http://api.fixer.io/latest?base=' + self.state.currency + '&symbols=' + self.state.currency + ',' + currency

	console.log('request', request);

	self.setState({
		isLoading: true
	});

	return fetch(request)
		.then((response) => response.json())
		.then((responseJson) => {
			
			var responseRate = responseJson.rates[currency];
			var newRate = (self.state.rate * responseRate).toFixed(2);

			var date1 = new Date(self.state.startAt);
			var date2 = new Date()
			var timeDiff = Math.abs(date2.getTime() - date1.getTime());
			var cost = (moment.duration(timeDiff).asHours() * self.state.rate).toFixed(2)

			console.log(responseJson, self.state.currency, currency, responseRate, newRate);

			self.setState({
				rate: newRate,
				currency: currency,
				cost: cost
			}, function(){
				self.props.updateRate({
					id: self.state.id,
					cost: self.state.cost,
					rate: self.state.rate,
					currency: self.state.currency,
				});
			});

			self.setState({
				isLoading: false
			});
		})
		.catch((error) => {
			console.error(error);
		});
*/

	context.setState({
		currency: currency,
	}, function(){
		context.props.updateRate({
			id: context.state.id,
			cost: context.state.cost,
			rate: context.state.rate,
			currency: context.state.currency,
		});
	});
}

