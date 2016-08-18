/**
 * Licensed under AGPL v3
 * =====================================================================================
 * @copyright   Copyright (c) 2016, net-xpress GmbH & Co KG
 * @author      Moritz Gericke <moritz@net-xpress.de>
 * =====================================================================================
 */
(function ($, pm)
{
	var style = null;

	'use strict';
	pm.directive( 'head', function (i, head, MediaHeight)
	{
		// create style-element if not exist
		if (!style || $( head ).has( head ).length <= 0) {
			style = $( '<style/>' );
			$( head ).append( style );
			pm.partials.MinHeight.adjust( style, MediaHeight.height() );
		}

		$( window ).on( 'heightChange', function (e, height)
		{
			pm.partials.MinHeight.adjust( style, height );
		} );
	}, ['MediaHeightService'] );
}( jQuery, PlentyFramework ));