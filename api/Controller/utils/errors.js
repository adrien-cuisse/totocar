
/**
 * Extracts mongoose validation errors
 * 
 * @param {object} validationErrors - errors object sent by catch block
 * 
 * @return {object} - object where keys are field names and values are associated errors 
 */
const extractValidationErrors = validationErrors => {

	const formatedErrors = {};

	for (let field in validationErrors.errors) {
		formatedErrors[field] = validationErrors.errors[field].message;
	}

	return formatedErrors;
};


module.exports = extractValidationErrors;
