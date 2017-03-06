import React from 'react';

const canEdit = item => 'spam' !== item.status && 'trash' !== item.status;
const actions = {
	unapprove: ({ item, onUpdate }) => item.status === "approved" ?
		<a
			aria-label='Unapprove this comment'
			className='vim-u vim-destructive'
			href="#"
			onClick={ () => onUpdate( { status: 'hold' } ) }
		>Unapprove</a>
	: null,
	approve: ({ item, onUpdate }) => item.status === 'hold' ?
		<a
			aria-label='Approve this comment'
			className='vim-a vim-destructive'
			href="#"
			onClick={ () => onUpdate( { status: 'approved' } ) }
		>Approve</a>
	: null,
	unspam: ({ item, onUpdate }) => item.status === 'spam' ?
		<a
			aria-label='Restore this comment from the spam'
			className='vim-z vim-destructive'
			href="#"
			onClick={ () => onUpdate( { status: 'unspam' } ) }
		>Not Spam</a>
	: null,
	spam: ({ item, onUpdate }) => item.status !== 'spam' ?
		<a
			aria-label='Mark this comment as spam'
			href="#"
			onClick={ () => onUpdate( { status: 'spam' } ) }
		>Spam</a>
	: null,
	untrash: ({ item, onUpdate }) => item.status === 'trash' ?
		<a
			aria-label='Restore this comment from the Trash'
			className='vim-z vim-destructive'
			href="#"
			onClick={ () => onUpdate( { status: 'untrash' } ) }
		>Restore</a>
	: null,
	delete: ({ item, onDelete }) => ( item.status === 'spam' || item.status === 'trash' ) ?
		<a
			aria-label='Delete this comment permanently'
			href="#"
			onClick={ () => onDelete() }
		>Delete Permanently</a>
	: null,
	trash: ({ item, onDelete }) => ( item.status !== 'spam' && item.status !== 'trash' ) ?
		<a
			aria-label='Move this comment to the Trash'
			href="#"
			onClick={ () => onDelete() }
		>Trash</a>
	: null,
	/*edit: ({ item }) => canEdit( item ) ?
		<a aria-label='Edit this comment'>Edit</a>
	: null,*/
	quickedit: ({ item, onEdit }) => canEdit( item ) ?
		<a
			className="vim-q comment-inline"
			aria-label="Quick edit this comment inline"
			href="#"
			onClick={ () => onEdit() }
		>Quick&nbsp;Edit</a>
	: null,
	reply: ({ item, onReply }) => canEdit( item ) ?
		<a
			className="vim-r comment-inline"
			aria-label="Reply to this comment"
			href="#"
			onClick={ () => onReply() }
		>Reply</a>
	: null,
};

export default class RowActions extends React.Component {
	render() {
		const { item } = this.props;

		// Invoke the actions.
		const children = Object.keys( actions ).map( action => {
			const content = actions[ action ]( this.props );
			return content ? <span key={ action } className={ action }>{ content }</span> : null;
		});

		// Insert separators between each action.
		const withSeparators = children.filter( item => !! item ).reduce((carry, item) => {
			if ( ! carry.length ) {
				return [ item ];
			}

			const separator = <span key={`sep${carry.length}`}> | </span>;
			return [ ...carry, separator, item ];
		}, [] );

		return <div className="row-actions">
			{ withSeparators }
		</div>;
	}
}
