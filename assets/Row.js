import React from 'react';

import ColumnLegacy from './Columns/Legacy';

export default class Row extends React.Component {
	render() {
		const { columns, item, posts, onDelete, onUpdate } = this.props;

		const columnElements = Object.keys( columns ).map( key => {
			const props = Object.assign( {}, this.props, { key, columnKey: key, column: columns[ key ] } );
			return React.createElement( columns[ key ].component, props );
		});

		const classes = [ 'comment' ];
		switch ( item.status ) {
			case 'hold':
				classes.push( 'unapproved' );
				break
			default:
				classes.push( item.status );
				break;
		}

		return <tr className={ classes.join( ' ' ) } children={ columnElements } />;
	}
}
