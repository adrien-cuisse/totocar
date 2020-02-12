
import React from 'react';
import { Link } from 'react-router-dom';

import NavLink from './NavLink';

const Navbar = () =>  {

	return (	
		<div className='container'>
			<nav className='navbar navbar-expand-lg navbar-dark bg-dark'>
		
				<Link className='navbar-brand' to='/'>
					TotoCar
				</Link>

				<button className='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbar'>
					<span className='navbar-toggler-icon'></span>
				</button>

				<div className='collapse navbar-collapse' id='navbar'>
					<ul className='navbar-nav mr-auto'>
						<NavLink href='/crud/city' label='Cities' />
						<NavLink href='/crud/line' label='Lines' />
					</ul>
				</div>

			</nav>
		</div>
	);
};


export default Navbar;
