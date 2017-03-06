import React from 'react';

import columns, { columnMap } from './columns';

export default class Row extends React.Component {
	render() {
		const { item, posts, onDelete, onUpdate } = this.props;

		const columnElements = Object.keys( columns ).map( key => {
			const column = key in columnMap ? columnMap[ key ] : ColumnLegacy;
			const props = Object.assign( {}, this.props, { key } );
			return React.createElement( column, props );
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
