import React from 'react';

import RowActions from '../RowActions';

export default class Content extends React.Component {
	render() {
		const { item, onDelete, onUpdate } = this.props;

		return <td className="comment column-comment">
			<div dangerouslySetInnerHTML={{ __html: item.content.rendered }} />

			<RowActions { ...this.props } />
		</td>;
	}
}
Content.getHeader = ({ label }) => <th className="comment column-comment" scope="col">{ label }</th>;
