
import React, { useState } from 'react';

import axios from 'axios';

import config from './../config';


const Travel = () => {

	const [budget, setBudget] = useState('2');

	const [time, setTime] = useState('00:30');

	const [fromCity, setFromCity] = useState('Lille');

	const [toCity, setToCity] = useState('Paris');

	const [paths, setPaths] = useState([]);

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
				setPaths(response.data.routes)
			}
		})
		.catch(error => console.log('AXIOS error:', error));
	};

	const renderPaths = () => {
		if (JSON.stringify(paths) === JSON.stringify([null])) {
			return (
				<div className='p-4'>
					<p>
						No path found for your budget :/
					</p>
				</div>
			)
		} else {
			return (
				paths.map((route, index) => {
					return (
						<ul key={ index }>
							<li>Line: { route.line }</li>
							<li>Path: { route.path.join(' - ') }</li>
							<li>
								<ul>
								{
									route.options.map((option, index) => {
										return (
											<li key={ index }>{ option.join(' - ') }</li>
										)
									})
								}
								</ul>
								
							</li>
						</ul>
					)
				})
			)
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

			{/* <div className='form-group'>
				<label className='form-group' htmlFor='budget'>I can pay up to: (in €)</label>
				<input className='form-control' type='number' step='1' name='budget' id='budget' onChange={ handleBudgetChange } value={ '' + budget } />
			</div> */}
			
			<div className='form-group'>
				<label className='form-group' htmlFor='time'>I want my travel to last at most: (hh:mm)</label>
				<input className='form-control' type='time' name='time' id='time' onChange={ handleTimeChange } value={ time } />
			</div>
			
			<button className='btn btn-info btn-block' onClick={ handleSubmit }>Find my options</button>
		</form>
	);
		
	
	return (
		<>
		{ renderForm() }
		{ renderPaths() }
		</>
	)
};

export default Travel;
