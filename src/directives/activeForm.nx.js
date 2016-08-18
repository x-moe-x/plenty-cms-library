/**
 * Licensed under AGPL v3
 * =====================================================================================
 * @copyright   Copyright (c) 2016, net-xpress GmbH & Co KG
 * @author      Moritz Gericke <moritz@net-xpress.de>
 * =====================================================================================
 */
(function ($, pm)
{
	'use strict';
	pm.directive( 'form[data-nx="nxActiveForm"]', function (i, form)
	{
		var ui = pm.factories.UIFactory, $form = $( form ), $formParents = $( form ).parents();

		// bypassing form.submit() ...
		$form.submit( function ()
		{
			// use plenty mechanism to validate form before submitting
			if ($form.validateForm())
			{
				ui.showWaitScreen();

				// ... through a manual request
				$.ajax( {
					data   : $form.serialize(),
					type   : $form.attr( 'method' ),
					success: function (submitResponse)
					{
						var error = $( '.plentyErrorBox', submitResponse );
						ui.hideWaitScreen();

						// scroll to top of page
						$('html,body').animate({ scrollTop: 0 }, 'slow');

						// on success display success message
						if (error.length === 0)
						{
							$formParents.find( '.hideAfterSubmit' ).hide();
							$formParents.find( '.showAfterSubmit' ).show();
						}
						// on error display error content
						else
						{
							$form.find( '.nxFormMessageBox' ).html( error.find( '.plentyErrorBoxContent' ).html() ).addClass( 'bg-danger' ).removeClass( 'bg-success' ).show();
						}
					}
				} );
			}
			return false; // cancel original event to prevent form submitting
		} );
	} );
}( jQuery, PlentyFramework ));