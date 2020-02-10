
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Pagination links
 * 
 * @param {int} current - the current page
 * @param {int} count - the number of pages
 * @param {string} url - the url to paginate for 
 */
const Pagination = ({ current, count, url }) => {

	const renderLinks = () => {
		
		const range = [...Array(count).keys()].map(key => (key + 1) + '');

		if (count === 1) {
			return <></>;
		}

		
		return (
			range.map(page => {
				return (
					<li className={ 'page-item' + (page === current ? ' active' : '')} key={ page }>
						<Link to={ url + '/page/' + page } className='page-link'>{ page }</Link>
					</li>
				);
			})
		);
	};

	return (
		<div className='container mt-4'>
			<ul className="pagination pagination-lg">
				{ renderLinks() }
			</ul>
		</div>
	);
};

export default Pagination;
