/**
 * Licensed under AGPL v3
 * =====================================================================================
 * @copyright   Copyright (c) 2016, net-xpress GmbH & Co KG
 * @author      Moritz Gericke <moritz@net-xpress.de>
 * =====================================================================================
 */

/**
 * @module Services
 */
(function ($, pm)
{
	/**
	 * Listens to window's height and trigger 'heightChange' event
	 * @class MediaHeightService
	 * @static
	 * @example
	 *      $(window).on('heightChange', function(height, oldHeight) {
     *          console.log('The height changed from ' + height + ' to ' + oldHeight.');
     *      });
	 */
	pm.service( 'MediaHeightService', function ()
	{
		var mediaHeight, timeoutId;

		// recalculation of the current height on window resize
		$( window ).resize( function ()
		{
			clearTimeout( timeoutId );
			timeoutId = setTimeout( calculateMediaHeight, 50 );
		} );

		// initially calculation of height
		$( document ).ready( calculateMediaHeight );

		return {
			height: getHeight
		};

		/**
		 * Get the currently used height in px
		 * @function getHeight
		 * @return integer
		 */
		function getHeight()
		{
			if (!!mediaHeight) {
				calculateMediaHeight();
			}

			return mediaHeight;
		}

		/**
		 * Calculate the currently used height
		 * @function calculateMediaHeight
		 * @private
		 */
		function calculateMediaHeight()
		{
			var height = parseInt( $( window ).height() );

			if (height != mediaHeight) {
				var oldValue = mediaHeight;
				mediaHeight = height;
				$( window ).trigger( 'heightChange', [mediaHeight, oldValue] );
			}
		}
	} );

}( jQuery, PlentyFramework ));