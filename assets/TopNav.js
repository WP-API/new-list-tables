import React from 'react';

const PageLink = props => {
	const { children, isActive } = props;

	if ( ! isActive ) {
		return <span className='tablenav-pages-navspan'>{ children }</span>;
	}

	// Remove the isActive prop.
	const otherProps = Object.assign( {}, props );
	delete otherProps.isActive;
	return <a { ...otherProps } />;
};
PageLink.propTypes = {
	isActive: React.PropTypes.bool.isRequired,
};

export default class TopNav extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			page: null,
		};
	}

	componentWillReceiveProps( nextProps ) {
		// If receiving page update, wipe input.
		if ( nextProps.page !== this.props.page ) {
			this.setState({ page: null });
		}
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
						<PageLink
							className="first-page"
							isActive={ page !== 1 }
							onClick={ () => onJump( 1 ) }
						>
							<span className="screen-reader-text">First page</span>
							<span aria-hidden="true">«</span>
						</PageLink>
						{ ' ' }
						<PageLink
							className="prev-page"
							isActive={ page !== 1 }
							onClick={ () => onJump( page - 1 ) }
						>
							<span className="screen-reader-text">Previous page</span>
							<span aria-hidden="true">‹</span>
						</PageLink>
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
						<PageLink
							className="next-page"
							isActive={ page !== totalPages }
							onClick={ () => onJump( page + 1 ) }
						>
							<span className="screen-reader-text">Next page</span>
							<span aria-hidden="true">›</span>
						</PageLink>
						{ ' ' }
						<PageLink
							className="last-page"
							isActive={ page !== totalPages }
							onClick={ () => onJump( totalPages ) }
						>
							<span className="screen-reader-text">Last page</span>
							<span aria-hidden="true">»</span>
						</PageLink>
					</span>
				</div>
			: null }
			<br className="clear" />
		</form>;
	}
}