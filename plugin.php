<?php
/**
 * Plugin Name: New List Tables
 */

namespace NewListTables;

add_action( 'plugins_loaded', __NAMESPACE__ . '\\bootstrap' );

function bootstrap() {
	defined( 'NLK_SCRIPT_DEBUG' ) or define( 'NLK_SCRIPT_DEBUG', true );

	require __DIR__ . '/inc/class-tablecontroller.php';

	add_action( 'admin_menu', __NAMESPACE__ . '\\register_admin_page' );
	add_action( 'rest_api_init', __NAMESPACE__ . '\\register_endpoints' );
}

function register_admin_page() {
	$tables = TableController::instance()->get_tables();
	foreach ( $tables as $id => $table ) {
		$hook = add_menu_page(
			$table['page_title'],
			$table['menu_title'],
			$table['capability'],
			sprintf( 'nlt_%s', $id ),
			__NAMESPACE__ . '\\render_page',
			$table['icon'],
			26
		);

		TableController::instance()->set_hook( $id, $hook );
		add_action( 'load-' . $hook, __NAMESPACE__ . '\\prepare_page' );
	}
}

function register_endpoints() {
	register_rest_route( 'nlt/v1', '/comments/batch', array(
		'callback' => __NAMESPACE__ . '\\get_columns',
		'methods' => 'GET',
		'args' => array(
			'id' => array(
				'required' => true,
				'type' => 'string',
			),
			'items' => array(
				'required' => true,
				'type' => 'array',
				'items' => array(
					'type' => 'integer',
				),
			),
			'columns' => array(
				'required' => true,
				'type' => 'array',
				'items' => array(
					'type' => 'string',
				),
			),
		),
	));
	register_rest_route( 'nlt/v1', '/comments/(?P<id>\d+)', array(
		'callback' => __NAMESPACE__ . '\\get_columns',
		'methods' => 'GET',
		'args' => array(
			'id' => array(
				'required' => true,
				'type'     => 'integer',
			),
			'columns' => array(
				'required' => true,
			),
		),
	) );
}

function prepare_page() {
	$controller = TableController::instance();
	$table_id = $controller->get_id_for_hook( current_action(), 'load-' );
	$options = $controller->get_table( $table_id );

	/*wp_enqueue_script(
		'nlk',
		plugins_url( 'assets/table.js', __FILE__ ),
		array(
			'backbone',
			'jquery',
			'wp-api',
			'wp-backbone',
			'wp-util',
		)
	);*/
	$url = NLK_SCRIPT_DEBUG ? 'http://localhost:8080/main.js' : plugins_url( 'build/main.js', __FILE__ );
	wp_enqueue_script(
		'nlk-react',
		$url,
		array(
			'wp-api',
		),
		'20170228',
		true
	);
	wp_enqueue_style( 'editor-buttons' );

	set_current_screen( $options['screen'] );
	$list_table = _get_list_table( $options['table'] );

	$columns = get_registered_columns( $list_table );
	wp_localize_script(
		'nlk-react',
		'nlkOptions',
		array(
			'id'            => $table_id,
			'columns'       => $columns->columns,
			'primaryColumn' => $columns->primary,
		)
	);
}

function render_page() {
	?>
	<div class="wrap">
		<h1 class="wp-heading-inline">Comments</h1>

		<div id="comments-form">
			<table id="nlk-table" class="wp-list-table widefat fixed striped"></table>
		</div>
	</div>
	<?php
}

function get_registered_columns( $list_table ) {
	list( $columns, $hidden, $sortable, $primary ) = $list_table->get_column_info();

	$data = (object) array(
		'primary' => $primary,
		'columns' => (object) array(),
	);
	foreach ( $columns as $id => $label ) {
		$item = (object) array(
			'id' => $id,
			'label' => $label,
		);
		if ( isset( $sortable[ $id ] ) ) {
			$item->sort = array(
				'field'      => $sortable[ $id ][0],
				'descending' => $sortable[ $id ][1]
			);
		} else {
			$item->sort = false;
		}

		$data->columns->$id = $item;
	}

	return $data;
}

function get_columns( $request ) {
	$GLOBALS['hook_suffix'] = '';
	require ABSPATH . 'wp-admin/includes/admin.php';

	$table_id = $request['id'];
	$options = TableController::instance()->get_table( $table_id );
	if ( empty( $options ) || ! current_user_can( $options['capability'] ) ) {
		var_dump( $options );
		return new \WP_Error( 'nlt.cannot_access', '', array( 'status' => \WP_HTTP::FORBIDDEN ) );
	}

	set_current_screen( $options['screen'] );
	$list_table = _get_list_table( $options['table'] );

	$get_data_for_columns = build_data_getter( $list_table );

	$items = $request['items'];
	$columns = $request['columns'];
	$data = array();
	foreach ( $items as $id ) {
		$comment = call_user_func( $options['get_callback'], $id );
		if ( empty( $comment ) ) {
			return new \WP_Error( 'nlt.cannot_access', '', array( 'status' => \WP_HTTP::FORBIDDEN ) );
		}
		$data[ $id ] = $get_data_for_columns( $comment, $columns );
	}
	return $data;
}

function build_data_getter( $list_table ) {
	$getter = function ( $item, $include ) {
		list( $columns, $hidden, $sortable, $primary ) = $this->get_column_info();

		$column_list = [];

		foreach ( $columns as $column_name => $column_display_name ) {
			if ( ! in_array( $column_name, $include ) ) {
				continue;
			}

			$classes = "$column_name column-$column_name";
			if ( $primary === $column_name ) {
				$classes .= ' has-row-actions column-primary';
			}

			if ( in_array( $column_name, $hidden ) ) {
				$classes .= ' hidden';
			}

			// Comments column uses HTML in the display name with screen reader text.
			// Instead of using esc_attr(), we strip tags to get closer to a user-friendly string.
			$data = 'data-colname="' . wp_strip_all_tags( $column_display_name ) . '"';

			$attributes = "class='$classes' $data";

			ob_start();
			if ( 'cb' === $column_name ) {
				echo '<th scope="row" class="check-column">';
				echo $this->column_cb( $item );
				echo '</th>';
			} elseif ( method_exists( $this, '_column_' . $column_name ) ) {
				echo call_user_func(
					array( $this, '_column_' . $column_name ),
					$item,
					$classes,
					$data,
					$primary
				);
			} elseif ( method_exists( $this, 'column_' . $column_name ) ) {
				echo "<td $attributes>";
				echo call_user_func( array( $this, 'column_' . $column_name ), $item );
				echo $this->handle_row_actions( $item, $column_name, $primary );
				echo "</td>";
			} else {
				echo "<td $attributes>";
				echo $this->column_default( $item, $column_name );
				echo $this->handle_row_actions( $item, $column_name, $primary );
				echo "</td>";
			}

			$column_list[ $column_name ] = ob_get_clean();
		}

		return $column_list;
	};

	return $getter->bindTo( $list_table, $list_table );
}
