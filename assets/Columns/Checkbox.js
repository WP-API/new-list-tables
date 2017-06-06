import React from 'react';

const checkboxId = item => `cb-select-${item.id}`;

export default class Checkbox extends React.Component {
	render() {
		const { item } = this.props;
		const id = checkboxId( item );

		return <th className="check-column" scope="row">
			<label
				className="screen-reader-text"
				htmlFor={ id }
			>Select comment</label>
			<input
				id={ id }
				type="checkbox"
			/>
		</th>;
	}
}
Checkbox.getHeader = () => <td className="column-cb check-column"></td>;
