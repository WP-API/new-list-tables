import React from 'react';
import ReactDOM from 'react-dom';

import CommentsTable from './Tables/Comments';
import PostsTable from './Tables/Posts';

const init = () => {
	let Component;
	switch ( window.nlkOptions.id ) {
		case 'comments':
			Component = CommentsTable;
			break;

		case 'posts':
			Component = PostsTable;
			break;
	}

	ReactDOM.render(
		<Component {...window.nlkOptions} />,
		document.getElementById( 'nlk-table-wrap' )
	);
};

document.addEventListener( 'DOMContentLoaded', init );

if ( module.hot ) {
	module.hot.accept(() => {
		console.log( 'reload app please' );
	});
}
