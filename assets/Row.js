import React from 'react';

import ColumnLegacy from './Columns/Legacy';

export default class Row extends React.Component {
	render() {
		const { columns, component, item } = this.props;

		const columnElements = Object.keys( columns ).map( key => {
			const props = Object.assign( {}, this.props, { key, columnKey: key, column: columns[ key ] } );
			return React.createElement( columns[ key ].component, props );
		});

		return React.createElement( component, { item }, columnElements );
	}
}
