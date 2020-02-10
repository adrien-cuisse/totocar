
import React from 'react';
import { Link } from 'react-router-dom';


const Navbar = () =>  (
	
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
					<li className='nav-item active'>
						<Link className='nav-link' to='/crud/city'>
							Cities
						</Link>
					</li>
					<li className='nav-item'>
						<Link className='nav-link' to='/crud/line'>
							Lines
						</Link>
					</li>
				</ul>
			</div>

		</nav>
	</div>
);


export default Navbar;
