import React from 'react';

import columns from './columns';
import QuickEdit from './QuickEdit';
import Row from './Row';
import TopNav from './TopNav';

export default class ListTable extends React.Component {
	getHeaderCells() {
		return Object.keys( columns ).map( key =>
			<th
				key={ key }
				className={ columns[ key ].className }
				id={ key }
			>
				{ columns[ key ].label }
			</th>
		);
	}

	render() {
		const { items, page, posts, onUpdate } = this.props;

		const itemComponents = items.map( item => {
			return <Row
				key={ item.id }
				item={ item }
				posts={ posts }
				onEdit={ () => this.props.onEdit( item.id ) }
				onDelete={ () => this.props.onDelete( item.id ) }
				onReply={ () => this.props.onReply( item.id ) }
				onUpdate={ data => onUpdate( item.id, data ) }
			/>
		});

		if ( this.props.editing ) {
			// Editing, replace the row with an editor.
			const index = items.findIndex( item => item.id === this.props.editing );
			const item = items[ index ];
			itemComponents[ index ] = <QuickEdit
				key={ `edit-${this.props.editing}` }
				columns={ columns }
				item={ item }
				onCancel={ () => this.props.onEdit( null ) }
				onSubmit={ data => { onUpdate( item.id, data ); this.props.onEdit( null ); } }
			/>;
		} else if ( this.props.replying ) {
			// Replying, insert after the comment.
			const index = items.findIndex( item => item.id === this.props.replying );
			const replyer = <QuickEdit
				key={ `reply-${this.props.editing}` }
				columns= { columns }
				parent={ items[ index ] }
				onCancel={ () => this.props.onReply( null ) }
			/>;
			itemComponents.splice( index + 1, 0, replyer );
		}

		return <div className="nlk-table">
			<TopNav
				page={ page }
				total={ this.props.total }
				totalPages={ this.props.totalPages }
				onJump={ page => this.props.onJump( page ) }
			/>
			<table className="wp-list-table widefat fixed striped">
				<thead>
					<tr>
						{ this.getHeaderCells() }
					</tr>
				</thead>
				<tbody id="the-comment-list">
					{ ! this.props.loading ? itemComponents : (
						<tr>
							<td colSpan={ Object.keys( columns ).length }>
								Loading&hellip;
								<span className="spinner is-active" />
							</td>
						</tr>
					)}
				</tbody>
				<tfoot>
					<tr>
						{ this.getHeaderCells() }
					</tr>
				</tfoot>
			</table>
		</div>;
	}
}