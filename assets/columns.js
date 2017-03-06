import ColumnCheckbox from './Columns/Checkbox';
import ColumnAuthor from './Columns/Author';
import ColumnContent from './Columns/Content';
import ColumnResponse from './Columns/Response';
import ColumnDate from './Columns/Date';

export default {
	cb: {
		label: '',
		className: 'column-cb check-column',
		component: ColumnCheckbox,
	},
	author: {
		label: 'Author',
		className: 'author column-author',
		component: ColumnAuthor,
	},
	comment: {
		label: 'Comment',
		className: 'comment column-comment',
		component: ColumnContent,
	},
	response: {
		label: 'In Response To',
		className: 'response column-response',
		component: ColumnResponse,
	},
	date: {
		label: 'Submitted On',
		className: 'date column-date',
		component: ColumnDate,
	},
};
