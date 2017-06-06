import React from 'react';
import { gmdate } from 'phpdate-js';

export default class Date extends React.Component {
	render() {
		const { item } = this.props;
		return <td className="date column-date">
			<a href={ item.link }>{ gmdate( 'Y/m/d g:i a', item.date_gmt ) }</a>
		</td>;
	}
}
Date.getHeader = ({ label }) => <th className="date column-date" scope="col">{ label }</th>;
