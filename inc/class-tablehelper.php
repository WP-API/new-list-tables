<?php

namespace NewListTables;

use WP_List_Table;

class TableHelper {
	protected $table;

	/**
	 * Constructor.
	 *
	 * @param WP_List_Table $table
	 */
	public function __construct( WP_List_Table $table ) {
		$this->table = $table;
	}

	public function get_registered_columns() {
		list( $columns, $hidden, $sortable, $primary ) = $this->table->get_column_info();

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

	public function get_data_for_columns( $item, $include ) {
		$getter = $this->build_data_getter();
		return $getter( $item, $include );
	}

	protected function build_data_getter() {
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

		return $getter->bindTo( $this->table, $this->table );
	}
}
