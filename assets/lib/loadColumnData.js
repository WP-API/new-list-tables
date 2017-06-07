import { stringify } from 'query-string';

export default function ( id, collection, columns ) {
	// Fetch custom columns.
	const params = {
		id,
		items: collection.pluck( 'id' ).join( ',' ),
		columns: columns.join( ',' ),
		_wpnonce: wpApiSettings.nonce,
	};
	const queryString = stringify( params );
	const url = `${wpApiSettings.root}nlt/v1/comments/batch?${queryString}`;
	const opts = {
		credentials: 'same-origin',
	};

	return fetch( url, opts ).then( req => req.json() );
};
