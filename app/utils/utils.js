export const onlyNumbers = (context, stateKey, text) => {

		console.log(text);

		let newText = '';
		let numbers = '0123456789';

		for (var i = 0; i < text.length; i++) {
				if ( numbers.indexOf(text[i]) > -1 ) {
						newText = newText + text[i];
				}
		}

		context.setState({[stateKey]: newText})
}