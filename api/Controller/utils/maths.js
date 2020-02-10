
require('array-flat-polyfill');

/**
 * Returns all k-combinations in a set, with k from [min] to [max]
 * 
 * @param {array} ensemble - the set of values to generate combinations from 
 * @param {int} min - the lower bound of the range
 * @param {int} max - the upper bound of the range, if not set, only min-sized combinations will be generated
 * 
 * @return {Array} - every unique combinations of items from the ensemble which size are in the range
 */
const combinationsRange = (ensemble, min, max = undefined) => {

	max = max || min;
	
	/**
	 * Returns all k-sized combinations in a set
	 * 
	 * @param {Array} ensemble - the set of values to generate combinations from 
	 * @param {int} size - the size of the combinations to generate
	 * @param {int} combination - the current combination being generated, must be left as is
	 */
	const sizedCombinations = (ensemble, size, combination = []) => {

		if (combination.length === size) {
			return combination;
		} 

		return ensemble.map((item, index) => {
			if (! combination.includes(item)) {
				return sizedCombinations(
						ensemble.slice(index),
						size,
						combination.concat(item),
					)
					.filter(comb => undefined !== comb)
			}
		});
	};

	const combinations = [];
	const range = [... Array(max + 1).keys()].slice(min);
	
	if (min === 0) {
		return [[]];
	}

	range.map(size => {
		combinations.push(
			...sizedCombinations(ensemble, size)
				.flat(size - 1));
	});

	return combinations;
};


module.exports = {

	combinations: combinationsRange,
};
