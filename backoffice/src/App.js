import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Navbar from './Component/common/Navbar';

import EntityRouter from './Component/Entity/EntityRouter';
import ErrorRouter from './/Component/Error/ErrorRouter';


const App = () => (

	<Router>
		<div className='container-fluid'>
			
			<Navbar />	
	
			<div className='container mt-4 mb-4'>				
				<Switch>	
					
					<Route exact path='/'>
						<h1>TotoCar back-office</h1>
					</Route>
					
					{/* 
						Valid entities are white-listed in this router
					*/}
					<Route path='/crud/:entity' component={ EntityRouter } />

					<Route exact path='/error/:code' component={ ErrorRouter} />

					{/* 
						Unmatched routes lead to 404
					*/}
					<Route component={ ErrorRouter } />

					

				</Switch>
			</div>
		
		</div>
	</Router>
);

export default App;
