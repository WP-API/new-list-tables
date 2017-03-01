import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

const init = () => {
	ReactDOM.render(
		<App />,
		document.getElementById( 'comments-form' )
	);
};

document.addEventListener( 'DOMContentLoaded', init );

if ( module.hot ) {
	module.hot.accept(() => {
		console.log( 'reload app please' );
	});
}
