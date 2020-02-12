
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * A link on the navbar, to use inside a list
 * 
 * @param {string} href - target url
 * @param {string} label - text to display on the link 
 */
const NavLink = ({ href, label }) => {

	const location = useLocation();

	/**
	 * Defines whether or not targeted url is the current one
	 * 
	 * @return {bool}
	 */
	const isCurrentLocation = () => 0 === location.pathname.indexOf(href);

	return (
		<li className={ 'nav-item' + (isCurrentLocation() ? ' active' : '') }>
			<Link className={ 'nav-link' + (isCurrentLocation() ? ' active' : '') } to={ href }>
				{ label }
			</Link>
		</li>
	)
};

export default NavLink;
