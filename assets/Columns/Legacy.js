import React from 'react';

export default class Legacy extends React.Component {
	render() {
		const { column } = this.props;

		return <td className={`column-${column.id}`}>
			<span className="spinner is-active" />
		</td>
	}
}
Legacy.getHeader = ({ id, label }) => <th className={`column-${id}`}>{ label }</th>;
