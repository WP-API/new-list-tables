import React from 'react';

export default class Author extends React.Component {
	render() {
		const { item } = this.props;
		return <td className="author column-author">
			<strong>
				<img className="avatar avatar-32 photo" alt="" src={ item.author_avatar_urls[48] } style={{ width: "32px" }} />
				{ item.author_name || 'Anonymous' }
			</strong>
			<br />
			{ item.author_email ?
				<span><a href={ 'mailto:' + item.author_email }>{ item.author_email }</a><br /></span>
			: null }
			<a href="#">{ item.author_ip }</a>
		</td>;
	}
}
Author.getHeader = ({ label }) => <th className="author column-author" scope="col">{ label }</th>;
