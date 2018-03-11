const { logger } = require('../helpers');

exports.translatetoPigLatin = (text) => {
	let word = text;
	const wordArray = word.split('');
	const vowels = 'AaEeIiOoUu';
	let consonant;
	for (let i = 0; i < wordArray.length; i++) {
		if (vowels.includes(wordArray[0])) {
			word = wordArray.join('');
			if (i === 0) {
				word += 'way';
				return word;
			}
			word += 'ay';
			return word;
		} else if (i !== 0 && (vowels.includes(wordArray[0]) || 'Yy'.includes(wordArray[0]))) {
			word = wordArray.join('');
			word += 'ay';
			return word;
		}
		consonant = wordArray.shift();
		wordArray.push(consonant);
	}
	logger.log(`Succesfully translated ${word} into Pig Latin: ${word}`);
	return word;
};
