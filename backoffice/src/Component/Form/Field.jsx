
import React from 'react';


/**
 * A field inside a Form component, sending its value to the form it belongs to
 * 
 * @param {string} name - the name / id of the HTML tag
 * @param {object} properties - format of data the field will be used for 
 * @param {function} handleChange - callback from the Form to store this field's value in its state
 * @param {string} value - default value for this field
 * @param {string} error - error message for this field, if any
 */
const Field = ({ name, properties, handleChange, value, error }) => {

	/**
	 * Renders the field as a text input
	 * 
	 * @param {string} className - HTML class to add to the field 
	 * 
	 * @return {HTMLInputElement} - the field as a text input
	 */
	const renderTextTag = className => (

		<div className={ 'form-group' + (error ? ' has-danger' : '') }>
			<label htmlFor={ name } className='form-control-label'>
				{ name[0].toUpperCase() + name.substring(1) }
			</label>

			<input type='text' name={ name } id={ name } value={ value } onChange={ handleChange } className={ className} />
			{ renderError() }
		</div>
	);

	/**
	 * Renders the field as a numeric input
	 * 
	 * @param {string} className - HTML class to add to the field
	 * 
	 * @return {HTMLInputElement} - the field as a numeric input
	 */
	const renderNumberTag = className => (
		<div className={ 'form-group' + (error ? ' has-danger' : '') }>
			<label htmlFor={ name } className='form-control-label'>
				{ name[0].toUpperCase() + name.substring(1) }
			</label>

			<input type='number' name={ name } id={ name } value={ value } onChange={ handleChange } className={ className } />
			{ renderError() }
		</div>
	);

	/**
	 * Renders a field where you can select several options
	 * They will be stored in an array
	 */
	const renderManyChoicesTag = () => {
		// By default, the form sends an empty string, but we need an array here
		if (typeof value === 'string') {
			value = [];
		}
		
		/**
		 * Callback for options selection
		 * Toggles the selection from the array of selected values 
		 * 
		 * @param {mixed} selection - the value to toggle
		 */
		const toggleSelection = selection => {
			if (value.includes(selection)) {
				value = value.filter(current => current !== selection);
			} else {
				value.push(selection);
			}

			// Form expects an event
			handleChange({
				target: {
					name: name,
					value: value,
				},
			});
		};

		/**
		 * Display error message on a many-choices field
		 * Since the whole field is made of many inputs, it needs its own display
		 */
		const renderChoicesError = () => {
			if (error) {
				return(
					<div className='text-danger'> { error }</div>
				)
			}
		};

		return ( 
			<div className={ 'form-group' }>
				<label htmlFor={ name } className='form-control-label'>
					{ name[0].toUpperCase() + name.substring(1) }
				</label>

				<div>
					{
						properties.options.map(option => (
							<div className='custom-control custom-switch' key={ option._id }>
								<input 
									type="checkbox" 
									name={ option.name } 
									id={ option.name } 
									onChange={() => toggleSelection(option._id) } 
									className='custom-control-input' 
									checked={ value.includes(option._id) ? 'checked' : '' } 
								/>
								<label className='custom-control-label' htmlFor={ option.name }>{ option.name }</label>
							</div>
						))
					}
				</div>
				{ renderChoicesError() }
			</div>
		);
	};

	
	const renderTimeTag = className => {

		return (
			<div className={ 'form-group' + (error ? ' has-danger' : '') }>
				<label htmlFor={ name } className='form-control-label'>
					{ name[0].toUpperCase() + name.substring(1) }
				</label>
				<input type='time' name={ name } id={ name } value={ value } onChange={ handleChange } className={ className } />
			</div>
		);
	};

	/**
	 * Choose the appropriate HTML tag for the field, from its format
	 * 
	 * @return {HTMLElement} - the appropriate HTML tag for this field 
	 */
	const renderTag = () => {
		const className = 'form-control' + (error ? ' is-invalid' : '');

		switch (properties.type) {
			case 'Number':
				return renderNumberTag(className);
			case 'String':
				return renderTextTag(className);
			case 'ManyChoices':
				return renderManyChoicesTag();
			case 'Time':
				return renderTimeTag(className);
			default:
				return <></>;
		}
	};

	/**
	 * Renders the error message for this field, if any
	 * 
	 * @return {HTMLDivElement | undefined} - the error message, or nothing if none was provided
	 */
	const renderError = () => {
		if (error) {
			return <div className='invalid-feedback'>{ error }</div>
		}
	};

	
	return renderTag();
};


export default Field;
