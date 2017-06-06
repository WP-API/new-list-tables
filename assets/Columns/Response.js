import React from 'react';

export default class Response extends React.Component {
	render() {
		const { item, posts } = this.props;
		const post = item.post && item.post in posts ? posts[ item.post ] : null;

		return <td className="response column-response">
			{ post ?
				<div className="response-links">
					<a href={ 'post.php?post=' + post.id + '&action=edit' } className="comments-edit-item-link">
						{ post.title.rendered }
					</a>
					<a href={ post.link } className="comments-view-item-link">
						View Post
					</a>
					{/*
					<span className="post-com-count-wrapper">
						<a className="post-com-count post-com-count-approved" href="#">
							<span className="comment-count-approved" aria-hidden="true">¯\_(ツ)_/¯</span>
							<span className="screen-reader-text">Unknown number of comments</span>
						</a>
					</span>
					*/}
				</div>
			: null }
		</td>;
	}
}
Response.getHeader = ({ label }) => <th className="response column-response" scope="col">{ label }</th>;
