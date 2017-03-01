import ColumnCheckbox from './Columns/Checkbox';
import ColumnAuthor from './Columns/Author';
import ColumnContent from './Columns/Content';
import ColumnResponse from './Columns/Response';
import ColumnDate from './Columns/Date';

export const columnMap = {
	cb: ColumnCheckbox,
	author: ColumnAuthor,
	comment: ColumnContent,
	response: ColumnResponse,
	date: ColumnDate,
};
export default {
	cb: {
		label: '',
		className: 'column-cb check-column',
	},
	author: {
		label: 'Author',
		className: 'author column-author',
	},
	comment: {
		label: 'Comment',
		className: 'comment column-comment',
	},
	response: {
		label: 'In Response To',
		className: 'response column-response',
	},
	date: {
		label: 'Submitted On',
		className: 'date column-date',
	},
};
