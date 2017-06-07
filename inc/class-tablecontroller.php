<?php

namespace NewListTables;

class TableController {
	protected $tables = array();
	protected $hooks = array();

	protected static $instance;

	public function __construct() {
		$this->tables = array();

		$this->register( 'posts', array(
			'page_title'   => 'New Posts',
			'menu_title'   => 'New Posts',
			'capability'   => 'edit_posts',
			'icon'         => 'dashicons-admin-post',
			'screen'       => 'edit',
			'table'        => 'WP_Posts_List_Table',
			'get_callback' => function ( $id ) {
				$post = get_post( $id );
				if ( $post ) {
					$GLOBALS['post'] = $post;
					setup_postdata( $post );
				}
				return $post;
			},
		) );
		$this->register( 'comments', array(
			'page_title'   => 'New Comments',
			'menu_title'   => 'New Comments',
			'capability'   => 'edit_posts',
			'icon'         => 'dashicons-admin-comments',
			'screen'       => 'edit-comments',
			'table'        => 'WP_Comments_List_Table',
			'get_callback' => function ( $id ) {
				$comment = get_comment( $id );
				if ( $comment ) {
					$GLOBALS['comment'] = $comment;
					if ( $comment->comment_post_ID > 0 ) {
						$GLOBALS['post'] = get_post( $comment->comment_post_ID );
					}
				}

				return $comment;
			},
		) );
	}

	public static function instance() {
		if ( empty( static::$instance ) ) {
			static::$instance = new static();
		}

		return static::$instance;
	}

	public function register( $id, $options ) {
		$default = array(
			'capability' => 'manage_options',
			'icon'       => '',
		);
		$this->tables[ $id ] = array_merge( $default, $options );
	}

	public function get_tables() {
		return $this->tables;
	}

	/**
	 * Get a specific table by ID.
	 *
	 * @param string $id Table ID.
	 * @return array|null Table options if registered, null if none match.
	 */
	public function get_table( $id ) {
		if ( empty( $this->tables[ $id ] ) ) {
			return null;
		}

		return $this->tables[ $id ];
	}

	/**
	 * Set the hook name for a table's page.
	 *
	 * @param string $id Table ID.
	 * @param string $hook Hook name to set.
	 */
	public function set_hook( $id, $hook ) {
		$this->hooks[ $hook ] = $id;
	}

	/**
	 * Get table data for a specific hook.
	 *
	 * @param string $hook Hook to get table for.
	 * @param string $prefix Prefix to strip from the hook name.
	 * @return string|null Table ID if available, null if none match.
	 */
	public function get_id_for_hook( $hook, $prefix = '' ) {
		if ( ! empty( $prefix ) ) {
			$prefix_len = strlen( $prefix );
			if ( substr( $hook, 0, $prefix_len ) === $prefix ) {
				$hook = substr( $hook, $prefix_len );
			}
		}

		if ( empty( $this->hooks[ $hook ] ) ) {
			return null;
		}

		return $this->hooks[ $hook ];
	}
}
