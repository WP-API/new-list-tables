import React from 'react';

export default class Editor extends React.Component {
	render() {
		const { id, value, onChange } = this.props;

		return <div id="wp-replycontent-wrap" className="wp-core-ui wp-editor-wrap html-active">
			<div id="wp-replycontent-editor-container" className="wp-editor-container">
				<textarea
					className="wp-editor-area"
					id={ id }
					rows={ 20 }
					cols={ 40 }
					value={ value }
					onChange={ e => onChange( e.target.value ) }
				/>
			</div>
		</div>;
	}
}
Editor.defaultProps = {
	id: "replycontent",
};
