import React from 'react';

export default class TopNav extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			page: null,
		};
	}

	render() {
		const { page, total, totalPages, onJump } = this.props;

		return <form
			className="tablenav top"
			onSubmit={ e => { e.preventDefault(); onJump( this.state.page ) } }
		>
			<h2 className="screen-reader-text">Comments list navigation</h2>
			{ totalPages > 1 ?
				<div className="tablenav-pages">
					<span className="displaying-num">{ total } items</span>
					<span className="pagination-links">
						<a
							className={ page == 1 ? 'tablenav-pages-navspan' : 'first-page' }
							onClick={ () => onJump( 1 ) }
						>
							<span className="screen-reader-text">First page</span>
							<span aria-hidden="true">«</span>
						</a>
						{ ' ' }
						<a
							className={ page == 1 ? 'tablenav-pages-navspan' : 'prev-page' }
							onClick={ () => onJump( page - 1 ) }
						>
							<span className="screen-reader-text">Previous page</span>
							<span aria-hidden="true">‹</span>
						</a>
						{ ' ' }
						<span className="paging-input">
							<label className="screen-reader-text">Current Page</label>
							<input
								aria-describedby="table-paging"
								className="current-page"
								id="current-page-selector"
								name="paged"
								size="2"
								type="text"
								value={ this.state.page === null ? page : this.state.page }
								onChange={ e => this.setState({ page: e.target.value }) }
							/>
							<span className="tablenav-paging-text">
								{ ' of ' }
								<span className="total-pages">{ totalPages }</span>
							</span>
						</span>
						{ ' ' }
						<a
							className={ page == totalPages ? 'tablenav-pages-navspan' : 'next-page' }
							onClick={ () => onJump( page + 1 ) }
						>
							<span className="screen-reader-text">Next page</span>
							<span aria-hidden="true">›</span>
						</a>
						{ ' ' }
						<a
							className={ page == totalPages ? 'tablenav-pages-navspan' : 'last-page' }
							onClick={ () => onJump( totalPages ) }
						>
							<span className="screen-reader-text">Last page</span>
							<span aria-hidden="true">»</span>
						</a>
					</span>
				</div>
			: null }
			<br className="clear" />
		</form>;
	}
}