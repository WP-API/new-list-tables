import React from 'react';

export default class Legacy extends React.Component {
	render() {
		return <td><span className="spinner is-active" /></td>
	}
}
Legacy.getHeader = ({ id, label }) => <th className={`column-${id}`}>{ label }</th>;
