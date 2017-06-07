import React from 'react';

import ColumnLegacy from './Columns/Legacy';
import ListTable from './ListTable';
import loadColumnData from './lib/loadColumnData';

export default class CollectionTable extends React.Component {
	constructor( props ) {
		super( props );

		this.state ={
			items: [],
			columnData: {},
			editing: null,
			loading: true,
			page: 1,
			replying: null,
			total: 0,
			totalPages: 1,
		};
		// Attach hooks.
		this.onCollectionUpdate = () => this._onCollectionUpdate();

		this.connectCollection( this.props.collection );
	}

	connectCollection( collection ) {
		collection.on( 'add', this.onCollectionUpdate );
		collection.on( 'remove', this.onCollectionUpdate );
		collection.on( 'change', this.onCollectionUpdate );
		collection.on( 'reset', this.onCollectionUpdate );
	}

	disconnectCollection( collection ) {
		collection.off( 'add', this.onCollectionUpdate );
		collection.off( 'remove', this.onCollectionUpdate );
		collection.off( 'change', this.onCollectionUpdate );
		collection.off( 'reset', this.onCollectionUpdate );
	}

	componentWillReceiveProps( nextProps ) {
		if ( nextProps.collection !== this.props.collection ) {
			this.disconnectCollection( this.props.collection );
			this.connectCollection( this.props.collection );
		}
	}

	_onCollectionUpdate() {
		this.setState({
			items: this.props.collection.map( item => item.toJSON() ),
			loading: false,
			page: this.props.collection.state.currentPage,
			total: this.props.collection.state.totalObjects,
			totalPages: this.props.collection.state.totalPages,
		});

		loadColumnData( this.props.id, this.props.collection, this.getLegacyColumns() )
			.then( columnData => this.setState({ columnData }) );
	}

	onJump( page ) {
		console.log( 'jump', page );

		// Set to loading...
		this.setState({ loading: true, page });

		// ...and actually load
		this.props.collection.more({
			reset: true,
			data: {
				page: page,
			},
		});
	}

	onDelete( id ) {
		console.log( 'delete', id );
	}

	onUpdate( id, data ) {
		const obj = this.props.collection.get( id );
		const options = {
			patch: true,
		};
		obj.save( data, options );
	}

	getColumns() {
		const componentable = this.props.columnComponents;
		const specified = this.props.columns;

		const columnList = Object.entries( specified ).map( ( [ key, value ] ) => {
			const component = key in componentable ? componentable[ key ].component : ColumnLegacy;
			const data = {
				label: value.label,
				className: `column-${key}`,
				header: component.getHeader( value ),
				component,
			};

			return { [key]: data };
		});

		// Reassemble into an object.
		return columnList.reduce( ( obj, item ) => Object.assign( {}, obj, item ), {} );
	}

	getLegacyColumns() {
		const componentable = this.props.columnComponents;
		const specified = this.props.columns;

		return Object.keys( specified ).filter( key => ! ( key in componentable ) );
	}

	render() {
		const { row } = this.props;

		const { items, loading, page, posts, total, totalPages } = this.state;

		const columns = this.getColumns();

		return <ListTable
			columns={ columns }
			columnData={ this.state.columnData }
			editing={ this.state.editing }
			items={ items }
			loading={ loading }
			page={ page }
			replying={ this.state.replying }
			row={ this.props.row }
			total={ total }
			totalPages={ totalPages }
			onEdit={ id => this.setState({ editing: id }) }
			onDelete={ id => this.onDelete( id ) }
			onJump={ page => this.onJump( page ) }
			onReply={ id => this.setState({ replying: id }) }
			onUpdate={ (id, data) => this.onUpdate( id, data ) }
		/>
	}
}

CollectionTable.propTypes = {
	collection: React.PropTypes.object.isRequired,
	columns: React.PropTypes.object.isRequired,
	columnComponents: React.PropTypes.object,
	id: React.PropTypes.string.isRequired,
	row: React.PropTypes.func,
};

CollectionTable.defaultProps = {
	columnComponents: {},
	row: props => <tr children={ props.children } />,
};
