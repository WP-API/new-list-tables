<?php
/**
 * Plugin Name: New List Tables
 */

namespace NewListTables;

add_action( 'plugins_loaded', __NAMESPACE__ . '\\bootstrap' );

function bootstrap() {
	defined( 'NLK_SCRIPT_DEBUG' ) or define( 'NLK_SCRIPT_DEBUG', true );

	require __DIR__ . '/inc/class-tablecontroller.php';
	require __DIR__ . '/inc/class-tablehelper.php';

	add_action( 'admin_menu', __NAMESPACE__ . '\\register_admin_page' );
	add_action( 'rest_api_init', __NAMESPACE__ . '\\register_endpoints' );
}

function register_admin_page() {
	// Add separator before our pages.
	$GLOBALS['menu'][40] = array( '', 'read', 'nlk-separator', '', 'wp-menu-separator' );

	$tables = TableController::instance()->get_tables();
	foreach ( $tables as $id => $table ) {
		$hook = add_menu_page(
			$table['page_title'],
			$table['menu_title'],
			$table['capability'],
			sprintf( 'nlt_%s', $id ),
			__NAMESPACE__ . '\\render_page',
			$table['icon'],
			41
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
	$helper = new TableHelper( $list_table );

	$columns = $helper->get_registered_columns();
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
	$controller = TableController::instance();
	$table_id = $controller->get_id_for_hook( current_action() );
	$options = $controller->get_table( $table_id );
	?>
	<div class="wrap">
		<h1 class="wp-heading-inline"><?php echo esc_html( $options['page_title'] ) ?></h1>

		<div id="nlk-table-wrap">
			<table id="nlk-table" class="wp-list-table widefat fixed striped"></table>
		</div>
	</div>
	<?php
}

function get_columns( $request ) {
	$GLOBALS['hook_suffix'] = '';
	require ABSPATH . 'wp-admin/includes/admin.php';

	$table_id = $request['id'];
	$options = TableController::instance()->get_table( $table_id );
	if ( empty( $options ) || ! current_user_can( $options['capability'] ) ) {
		return new \WP_Error( 'nlt.cannot_access', '', array( 'status' => \WP_HTTP::FORBIDDEN ) );
	}

	set_current_screen( $options['screen'] );
	$list_table = _get_list_table( $options['table'] );
	$helper = new TableHelper( $list_table );

	$items = $request['items'];
	$columns = $request['columns'];
	$data = array();
	foreach ( $items as $id ) {
		$comment = call_user_func( $options['get_callback'], $id );
		if ( empty( $comment ) ) {
			return new \WP_Error( 'nlt.cannot_access', '', array( 'status' => \WP_HTTP::FORBIDDEN ) );
		}
		$data[ $id ] = $helper->get_data_for_columns( $comment, $columns );
	}
	return $data;
}
