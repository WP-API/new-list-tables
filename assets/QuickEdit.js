import React from 'react';

import Editor from './Editor';

const inputId = id => `quickedit-${id}`;

export default class QuickEdit extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			content: null,
			author_email: null,
			author_name: null,
			author_url: null,
		};
	}

	onSubmit(e) {
		e.preventDefault();

		const changedKeys = Object.keys( this.state ).filter( key => this.state[ key ] !== null );
		const data = {};
		changedKeys.forEach( key => data[ key ] = this.state[ key ] );

		if ( ! data ) {
			this.props.onCancel();
			return;
		}

		// Manually correct content.
		if ( 'content' in data ) {
			data.content = { raw: data.content };
		}

		this.props.onSubmit( data );
	}

	render() {
		const { columns, item, parent, onCancel } = this.props;
		const span = Object.keys( columns ).length;
		let button, heading;

		const type = item ? 'update' : 'reply';

		switch ( type ) {
			case 'add':
				heading = <span id="addhead">Add new Comment</span>;
				button = <span id="addbtn">Add Comment</span>;
				break;

			case 'update':
				heading = <span id="editlegend">Edit Comment</span>;
				button = <span id="savebtn">Update Comment</span>;
				break;

			case 'reply':
				heading = <span id="replyhead">Reply to Comment</span>;
				button = <span id="replybtn">Submit Reply</span>;
				break;
		}

		const data = {
			content: this.state.content === null ? item.content.raw : this.state.content,
			author_email: this.state.author_email === null ? item.author_email : this.state.authpr_email,
			author_name: this.state.author_name === null ? item.author_name : this.state.author_name,
			author_url: this.state.author_url === null ? item.author_url : this.state.author_url,
		};

		return <tr id="replyrow" className="inline-edit-row">
			<td className="colspanchange" colSpan={ span }>
				<form
					action=""
					method="POST"
					onSubmit={ e => this.onSubmit( e ) }
				>
					<fieldset className="comment-reply">
					<legend>{ heading }</legend>

					<div id="replycontainer">
						<label className="screen-reader-text" htmlFor="replycontent">Comment</label>
						<Editor
							id="replycontent"
							value={ data.content }
							onChange={ content => this.setState({ content }) }
						/>
					</div>

					<div id="edithead">
						<div className="inside">
							<label htmlFor={ inputId( 'name' ) }>Name</label>
							{' '}
							<input
								id={ inputId( 'name' ) }
								name="newcomment_author"
								size="50"
								type="text"
								value={ data.author_name }
								onChange={ e => this.setState({ author_name: e.target.value }) }
							/>
						</div>

						<div className="inside">
							<label htmlFor={ inputId( 'email' ) }>Email</label>
							{' '}
							<input
								id={ inputId( 'email' ) }
								name="newcomment_author_email"
								size="50"
								type="text"
								value={ data.author_email }
								onChange={ e => this.setState({ author_email: e.target.value }) }
							/>
						</div>

						<div className="inside">
							<label htmlFor={ inputId( 'url' ) }>URL</label>
							{' '}
							<input
								id={ inputId( 'url' ) }
								className="code"
								name="newcomment_author_url"
								size="103"
								type="url"
								value={ data.author_url }
								onChange={ e => this.setState({ author_url: e.target.value }) }
							/>
						</div>
					</div>

					<p id="replysubmit" className="submit">
						<button
							className="save button-primary alignright"
							type="submit"
						>
							{ button }
						</button>
						<button
							className="cancel button alignleft"
							onClick={() => onCancel()}
							type="button"
						>Cancel</button>
						<span className="waiting spinner"></span>
						<span className="error"></span>
					</p>

					<input type="hidden" name="action" id="action" value="" />
					<input type="hidden" name="comment_ID" id="comment_ID" value="" />
					<input type="hidden" name="comment_post_ID" id="comment_post_ID" value="" />
					<input type="hidden" name="status" id="status" value="" />
					{/*<input type="hidden" name="position" id="position" value="<?php echo $position; ?>" />*/}
					</fieldset>
				</form>
			</td>
		</tr>;
	}
}
