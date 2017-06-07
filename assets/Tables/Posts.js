import React from 'react';

import CollectionTable from '../CollectionTable';
import ColumnCheckbox from '../Columns/Checkbox';
const columns = {
	cb: {
		label: '',
		className: 'column-cb check-column',
		component: ColumnCheckbox,
	},
};

export default class Posts extends React.Component {
	constructor(props) {
		super(props);

		this.collection = new wp.api.collections.Posts();
		this.collection.fetch({
			reset: true,
			data: {
				context: 'edit',
				_embed: 'true',
				per_page: 20,
				status: 'any',
			}
		});
	}

	render() {
		const PostRow = props => {
			const { children, item } = props;
			const classes = [ 'hentry', 'type-post' ];

			return <tr
				className={ classes.join( ' ' ) }
				children={ children }
			/>;
		};

		return <CollectionTable
			collection={ this.collection }
			columns={ this.props.columns }
			columnComponents={ columns }
			id="posts"
			row={ PostRow }
		/>
	}
}
