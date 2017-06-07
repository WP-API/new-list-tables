import React from 'react';
import parser from 'react-html-parser';

export default class Legacy extends React.Component {
	render() {
		const { column, columnData, columnKey } = this.props;

		if ( columnKey in columnData ) {
			// Custom column available!
			return parser( columnData[ columnKey ] )[0];
		}

		return <td className={`column-${column.id}`}>
			<span className="spinner is-active" />
		</td>
	}
}
Legacy.getHeader = ({ id, label }) => {
	return <th className={`column-${id}`} scope="col">{ parser( label )[0] }</th>;
};
