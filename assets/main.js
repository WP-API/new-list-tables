import React from 'react';
import ReactDOM from 'react-dom';

import CommentsTable from './Tables/Comments';

const init = () => {
	let Component;
	switch ( window.nlkOptions.id ) {
		case 'comments':
			Component = CommentsTable;
			break;
	}

	ReactDOM.render(
		<Component {...window.nlkOptions} />,
		document.getElementById( 'comments-form' )
	);
};

document.addEventListener( 'DOMContentLoaded', init );

if ( module.hot ) {
	module.hot.accept(() => {
		console.log( 'reload app please' );
	});
}
