
import React, { useState } from 'react';

import axios from 'axios';

import config from './../config';


/**
 * Page for on-demand routes
 */
const Travel = () => {

	/**
	 * Price the user can pay
	 */
	const [budget, setBudget] = useState('8');

	/**
	 * User's time constraint for his travel
	 */
	const [time, setTime] = useState('04:00');

	/**
	 * User departure
	 */
	const [fromCity, setFromCity] = useState('Lille');

	/**
	 * User arrival
	 */
	const [toCity, setToCity] = useState('Paris');

	/**
	 * User's available paths
	 */
	const [paths, setPaths] = useState([]);

	const [error, setError] = useState('');

	const api = config.api.url + ':' + config.api.port + '/api/my-travel';
	
	const handleBudgetChange = event => {
		event.preventDefault();

		if (event.key === 'ArrowUp') {
			setBudget(budget + 2);
		} else if (event.key === 'ArrowDown') {
			if (budget > 2) {
				setBudget(budget - 2);
			}
		} else {
			setBudget(parseInt(event.target.value));
		}
	}

	const handleTimeChange = event => setTime(event.target.value);

	const handleFromCityChange = event => setFromCity(event.target.value);

	const handleToCityChange = event => setToCity(event.target.value);

	const handleSubmit = event => {
		event.preventDefault();

		let [hours, minutes] = time.split(':').map(token => parseInt(token));
		let totalMinutes = hours * 60 + minutes;
		
		axios.post(api, {
			time: totalMinutes,
			budget: budget,
			from: fromCity,
			to: toCity,
		})
		.then(response => {
			if (response.data.success) {
				setPaths(response.data.routes);
				if (0 === response.data.routes.length) {
					setPaths([]);
					setError("We don't have any line linking those cities");
				} else if (null === response.data.routes[0]) {
					setPaths([]);
					setError('No route found for your budget');
				} else {
					setError('');
					setPaths(response.data.routes);
				}
			} 
		})
		.catch(error => console.log('AXIOS error:', error));
	};

	const renderPaths = () => {
		if (JSON.stringify(paths) === JSON.stringify([null])) { // nothing in constraints range 
			return <></>
		} else if (JSON.stringify(paths) === JSON.stringify([])) { // default state / line doesn't exist
			return <></>;
		} else {
			return (
				<table className='table mt-4'>
					<thead>
						<tr>
							<th scope='col'>Line</th>
							<th scope='col'>Path</th>
							<th scope='col'>Your route</th>
						</tr>
					</thead>
					<tbody>
						{
							paths.map((route, index) => (
								<tr key={ index }>
									<td>{ route.line }</td>
									<td>{ route.path.join(' - ' ) }</td>
									<td>
										<ul className='list-group'>
										{
											route.options.map((option, index) => (
												<li className='list-group-item' key={ index }>
													{ option.join(' - ') }
												</li>	
											))
										}
										</ul>
									</td>
								</tr>
							))
						}
					</tbody>
				</table>
			);
		}
	}


	const renderForm = () => (
		<form>
			
			<div className='form-group'>
				<label className='form-control-label' htmlFor='from'>Going from:</label>
				<input className='form-control' type='text' name='from' id='from' onChange={ handleFromCityChange } value={ fromCity } />
			</div>

			<div className='form-group'>
				<label className='form-group' htmlFor='to'>I want to go to:</label>
				<input className='form-control' type='text' name='to' id='to' onChange={ handleToCityChange } value={ toCity } />
			</div>


			<div className='form-group'>
				<label className='control-label' htmlFor='budget'>I can pay up to:</label>
				<div className='form-group'>
					<div className='input-group mb-3'>
						<div className='input-group-prepend'>
							<span className='input-group-text'>€</span>
						</div>
						<input type='number' step='1' name='budget' id='budget' onChange={ handleBudgetChange } value={ '' + budget } className='form-control' aria-label='Amount (to the nearest euro)' />
						<div className='input-group-append'>
							<span className='input-group-text'>.00</span>
						</div>
					</div>
				</div>
			</div>

			<div className='form-group'>
				<label className='form-group' htmlFor='time'>I want my travel to last at most: (hh:mm)</label>
				<input className='form-control' type='time' name='time' id='time' onChange={ handleTimeChange } value={ time } />
			</div>
			
			<button className='btn btn-info btn-block' onClick={ handleSubmit }>Find my options</button>
		</form>
	);
	
	const renderError = () => {
		if ('' !== error) {
			return (
				<div className='alert alert-warning mt-4 mb-4'>{ error }</div>
			);
		}
	};
	
	return (
		<>
		{ renderForm() }
		{ renderPaths() }
		{ renderError() }
		</>
	)
};

export default Travel;
