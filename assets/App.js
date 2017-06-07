import React from 'react';

import columns from './columns';
import ListTable from './ListTable';

import ColumnLegacy from './Columns/Legacy';
import loadColumnData from './lib/loadColumnData';

export default class App extends React.Component {
	constructor(props) {
		super(props);

		this.collection = new wp.api.collections.Comments();
		this.collection.fetch({
			data: {
				context: 'edit',
				_embed: 'true',
				per_page: 20,
				status: 'any',
			},
			// Also grab the posts.
			success: () => {
				this.collection.each( comment => {
					const post = comment.get( '_embedded' ).up[0];

					this.setState( state => ({
						posts: Object.assign( {}, state.posts, { [post.id]: post } )
					}));
				})

				loadColumnData( this.collection, this.getLegacyColumns() )
					.then( columnData => this.setState({ columnData }) );
			}
		});

		this.state ={
			comments: [],
			columnData: {},
			editing: null,
			loading: true,
			posts: {},
			page: 1,
			replying: null,
			total: 0,
			totalPages: 1,
		};

		// Attach hooks.
		const update = () => {
			this.setState({
				comments: this.collection.map( item => item.toJSON() ),
				loading: false,
				page: this.collection.state.currentPage,
				total: this.collection.state.totalObjects,
				totalPages: this.collection.state.totalPages,
			});
		};
		this.collection.on( 'add', update );
		this.collection.on( 'remove', update );
		this.collection.on( 'change', update );
	}

	onJump( page ) {
		console.log( 'jump', page );

		// Set to loading...
		this.setState({ loading: true, page });

		// ...and actually load
		this.collection.more({
			data: {
				page: page,
			}
		});
	}

	onDelete( id ) {
		console.log( 'delete', id );
	}

	onUpdate( id, data ) {
		const post = this.collection.get( id );
		const options = {
			patch: true,
		};
		post.save( data, options );
	}

	getColumns() {
		const componentable = columns;
		const specified = this.props.columns;

		const columnList = Object.entries( specified ).map( ( [ key, value ] ) => {
			const component = key in componentable ? componentable[ key ].component : ColumnLegacy;
			const data = {
				label: value.label,
				className: `column-${key}`,
				header: component.getHeader( value ),
				component,
			};

			// Hack:
			if ( data.label.startsWith( '<input' ) ) {
				data.label = '';
			}

			return { [key]: data };
		});

		// Reassemble into an object.
		return columnList.reduce( ( obj, item ) => Object.assign( {}, obj, item ), {} );
	}

	getLegacyColumns() {
		const componentable = columns;
		const specified = this.props.columns;

		return Object.keys( specified ).filter( key => ! ( key in componentable ) );
	}

	render() {
		const { comments, loading, page, posts, total, totalPages } = this.state;
		const columns = this.getColumns();

		const CommentRow = props => {
			const { children, item } = props;
			const classes = [ 'comment' ];
			switch ( item.status ) {
				case 'hold':
					classes.push( 'unapproved' );
					break
				default:
					classes.push( item.status );
					break;
			}

			const childrenWithPosts = React.Children.map( children, child => React.cloneElement( child, { posts } ) );
			return <tr
				className={ classes.join( ' ' ) }
				children={ childrenWithPosts }
			/>;
		};

		return <ListTable
			columns={ columns }
			columnData={ this.state.columnData }
			editing={ this.state.editing }
			items={ comments }
			loading={ loading }
			page={ page }
			replying={ this.state.replying }
			row={ CommentRow }
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
