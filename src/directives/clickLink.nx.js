/**
 * Licensed under AGPL v3
 * =====================================================================================
 * @copyright   Copyright (c) 2016, net-xpress GmbH & Co KG
 * @author      Moritz Gericke <moritz@net-xpress.de>
 * =====================================================================================
 */

(function ($, pm)
{

	// click link on clicking non-anchor elements
	pm.directive( 'a[data-nx-href]', function (i, elem, MediaSizeService)
	{
		$( elem ).each( function ()
		{
			var href       = $( this ).attr( 'href' );
			var identifier = $( this ).attr( 'data-nx-href' );

			$( '[data-nx-link="' + identifier + '"]' ).click( function ()
			{
				if (MediaSizeService.interval() != 'xs')
				{
					window.open( href );
				}
			} );
		} );
	}, ['MediaSizeService'] );

}( jQuery, PlentyFramework ));