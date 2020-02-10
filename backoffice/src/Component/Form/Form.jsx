
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

// API request handler (polyfill)
import axios from 'axios';

import Field from './Field';


/**
 * A form based on a model from the API
 * Forms are made Field sub-components
 * 
 * @param {string} verb - the verb to submit de form with (put, patch, delete)
 * @param {string} url - targeted api url, where the form format can be downloaded from 
 */
const Form = ({ verb, url }) => {

	/// Navigation history
	const navigation = useHistory();

	// Fields format, describing how each field should be constructed
	const [format, setFormat] = useState({});

	// Values of each field
	const [values, setValues] = useState({});
	
	// Error message for each field
	const [errors, setErrors] = useState({});
	
	// Download entity if target url changed
	useEffect(() => {
		axios
			.get(url)
			.then(response => {
				if (response.data.entity) {
					setValues(response.data.entity);
				}
				setFormat(response.data.format);
			})
			.catch(error => console.log('API error: ', error));
	}, [url]);

	/**
	 * Callback for fields changes, updating the state
	 * 
	 * @param {Event} event - the event raised by the HTML element
	 */
	const handleFieldChange = event => setValues(Object.assign(
		{},
		values,
		Object.fromEntries([[event.target.name, event.target.value]])
	));

	/**
	 * Callback for submit
	 * If the form was valid, will redirect back
	 * If the the wasn't valid, errors state will be updated and propagated to Field sub-components
	 *  
	 * @param {Event} event - the event raised by the submit-button click 
	 */
	const handleSubmit = event => {
		event.preventDefault();

		verb = verb.toLowerCase();

		if (axios[verb]) {
			axios[verb](url, values)
				.then(response => {
					if (response.data.success) {
						navigation.goBack();
					} else {
						setErrors(response.data.errors);
					}
				})
				.catch(error => console.log('Error: ', error));
		} else {
			console.log('Axios error: verb', verb, 'is not supported');
		}
	};


	return (
		<div>
			<form>
				{
					Object.entries(format).map(([name, properties], index) => (
						<Field 
							name={ name }  
							properties={ properties } 
							handleChange={ handleFieldChange } 
							value={ values[name] || '' }
							error={ errors[name] }
							key={ index }
						/>
					))
				}

				<button type='submit' className='btn btn-success btn-block' onClick={ handleSubmit }>
					Submit
				</button>
			</form>
		
		
			<button onClick={ () => navigation.goBack() } className='btn btn-info btn-block'>
				Go back
			</button>
		</div>
	);
};


export default Form;
