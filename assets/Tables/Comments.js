import React from 'react';

import ListTable from '../ListTable';
import CollectionTable from '../CollectionTable';
import ColumnCheckbox from '../Columns/Checkbox';
import ColumnAuthor from '../Columns/Author';
import ColumnContent from '../Columns/Content';
import ColumnResponse from '../Columns/Response';
import ColumnDate from '../Columns/Date';

const columns = {
	cb: {
		label: '',
		className: 'column-cb check-column',
		component: ColumnCheckbox,
	},
	author: {
		label: 'Author',
		className: 'author column-author',
		component: ColumnAuthor,
	},
	comment: {
		label: 'Comment',
		className: 'comment column-comment',
		component: ColumnContent,
	},
	/*
	response: {
		label: 'In Response To',
		className: 'response column-response',
		component: ColumnResponse,
	},
	*/
	date: {
		label: 'Submitted On',
		className: 'date column-date',
		component: ColumnDate,
	},
};


export default class Comments extends React.Component {
	constructor( props ) {
		super( props );

		this.state = {
			posts: {},
		};

		this.collection = new wp.api.collections.Comments();
		this.collection.fetch({
			reset: true,
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

		return <div id="comments-form">
			<CollectionTable
				collection={ this.collection }
				columns={ this.props.columns }
				columnComponents={ columns }
				id="comments"
				row={ CommentRow }
			/>
		</div>;
	}
}
