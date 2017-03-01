import React from 'react';

import ListTable from './ListTable';

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
			success: () => this.collection.each( comment => {
				const post = comment.get( '_embedded' ).up[0];

				this.setState( state => ({
					posts: Object.assign( {}, state.posts, { [post.id]: post } )
				}));
			})
		});

		this.state ={
			comments: [],
			loading: true,
			posts: {},
			page: 1,
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

	render() {
		const { comments, loading, page, posts, total, totalPages } = this.state;
		return <ListTable
			items={ comments }
			loading={ loading }
			page={ page }
			posts={ posts }
			total={ total }
			totalPages={ totalPages }
			onDelete={ id => this.onDelete( id ) }
			onJump={ page => this.onJump( page ) }
			onUpdate={ (id, data) => this.onUpdate( id, data ) }
		/>
	}
}
