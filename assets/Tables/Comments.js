import React from 'react';

import columns from '../columns';
import ListTable from '../ListTable';
import CollectionTable from '../CollectionTable';

export default class Comments extends React.Component {
	constructor( props ) {
		super( props );

		this.state = {
			posts: {},
		};

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
				});
			}
		});
	}

	render() {
		const { posts } = this.state;

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

		return <CollectionTable
			id={ this.props.id }
			collection={ this.collection }
			columns={ this.props.columns }
			columnComponents={ columns }
			row={ CommentRow }
		/>;
	}
}
