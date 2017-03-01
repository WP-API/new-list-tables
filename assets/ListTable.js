import React from 'react';

import columns from './columns';
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
		const { items, loading, page, posts, total, totalPages, onDelete, onJump, onUpdate } = this.props;
		return <div className="nlk-table">
			<TopNav
				page={ page }
				total={ total }
				totalPages={ totalPages }
				onJump={ page => onJump( page ) }
			/>
			<table className="wp-list-table widefat fixed striped">
				<thead>
					<tr>
						{ this.getHeaderCells() }
					</tr>
				</thead>
				<tbody id="the-comment-list">
					{ ! loading ? items.map( item =>
						<Row
							key={ item.id }
							item={ item }
							posts={ posts }
							onDelete={ () => onDelete( item.id ) }
							onUpdate={ data => onUpdate( item.id, data ) }
						/>
					) : (
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