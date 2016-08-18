(function ($, pm)
{
	function initRow(parent, rowIndex, max)
	{
		var options = [], i, row, data = $( parent ).data();

		for (i = max; i > 0; --i)
		{
			options.push( '<option value="' + i + '">' + i + 'x</option>' );
		}

		row = $( pm.compileTemplate( 'upload/uploadRow.html', {
			'options': options.join( '' ),
			'row'    : rowIndex + 1,
			'max'    : max
		} ) );

		$( parent ).append( row );
		data.rowCount++;

		$( 'select', row ).change( function ()
		{
			var newMax;

			// 1. clear all possible rows afterwards
			$( '.uploadRow', parent ).each( function (i, currentRow)
			{
				if (i > rowIndex)
				{
					$( currentRow ).remove();
					data.rowCount--;
				}
			} );

			// 2. add a new one
			newMax = max - $( this ).val();
			if (newMax > 0)
			{
				initRow( parent, data.rowCount, newMax );
			}

			$( '.quantityinfo', row ).val( $( this, row ).val() );
		} );
		$( 'input', row ).change( function ()
		{
			$( '.fileinfo', row ).val( $( this ).val() );
			$( '.filename', row ).html( $( this ).val() );
		} );
	};

	pm.partials.Upload = {

		initButton: function (button)
		{
			return $.extend( button, {
				disable: function ()
				{
					$( button )
						.addClass( 'disabled' )
						.unbind( 'click' )
						.find( '.button-text' )
						.html( 'Upload abgeschlossen' );
				}
			} );
		},

		initRows: function (parent, max)
		{
			$( parent ).data( 'rowCount', 0 );
			initRow( parent, 0, max );
		}
	};

}( jQuery, PlentyFramework ));