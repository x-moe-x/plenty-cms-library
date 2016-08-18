/**
 * Licensed under AGPL v3
 * (https://github.com/plentymarkets/plenty-cms-library/blob/master/LICENSE)
 * =====================================================================================
 * @copyright   Copyright (c) 2016, net-xpress GmbH & Co KG (https://www.net-xpress.de)
 * @author      Moritz Gericke <moritz@net-xpress.de>
 * =====================================================================================
 */

/**
 * @module Services
 */
(function ($, pm)
{
	/**
	 * Handling upload during/after checkout
	 * @class UploadService
	 * @static
	 *
	 */
	pm.service( 'UploadService', function (Upload, Modal)
		{
			return {
				init          : init,
				parseMyAccount: parseMyAccount
			};

			/**
			 * Initialize upload explicitly.
			 * @param {number} orderId Order id to initialize upload for
			 * @param {Array} articles Array of article numbers to be checked for print products
			 * @function init
			 */
			function init(orderId, articles)
			{
				Upload.init( orderId, articles );
				Upload.loadUpload()
					.done( function ()
					{
						$( 'button[data-order-id]' ).each( function ()
						{
							var button = pm.partials.Upload.initButton( $( this ) );

							// enable/disable button
							if (!Upload.getUpload().isUploadAllowed( button.data( 'articleNo' ) ))
							{
								button.disable();
							}
							else
							{
								// connect modal
								appendModal( button );
							}

						} );

						if (Upload.getUpload().isUploadAllowed())
						{
							$( '.PlentyWebMyAccountOrderOverviewUploadNoticeContainer' ).show();
						}
					} );
			}

			/**
			 * append modal-callback for a given upload button.
			 * The button needs data-upload-order,
			 * data-upload-article, data-upload-quantity
			 * attributes to be set.
			 * @function appendModal
			 * @private
			 */
			function appendModal(button)
			{
				button.click( function ()
				{
					var form,
						modalElement,
						modalContainer = button.parent();

					Modal.prepare()
						.setContent( pm.compileTemplate( 'upload/uploadSection.html', button.data() ) )
						.setTitle( "Druckdatenupload" )
						.setLabelConfirm( "Upload starten" )
						.setContainer( modalContainer )
						.onConfirm( function ()
						{
							modalConfirm( button, form, modalElement );
							return false;
						} ).show();

					// obtain element references
					modalElement = pm.partials.Modal.getModal( modalContainer );
					form         = $( 'form', modalElement );

					// prevent closing on confirm
					$( '[data-dismiss="modal"][data-plenty-modal="confirm"]', modalElement ).attr( 'data-dismiss', '' );

					// init rows
					pm.partials.Upload.initRows( form, button.data( 'quantity' ) );
				} );
			}

			/**
			 * Initialize upload via parsing data from an order's tab pane
			 * @function parseMyAccount
			 */
			function parseMyAccount()
			{
				var orderId = parseOrderId();

				if (orderId !== null)
				{

					// process it's order tab pane once ajaxStop event occurred
					$( '#OrderTabPaneID' + orderId ).one( 'ajaxStop', function ()
					{
						var articleNumbers, orderStatus;

						try
						{
							orderStatus = parseOrderStatus( this );
						} catch (e)
						{
							console.log( e );
							return; // exit
						}

						if (orderStatus >= 6)
						{
							return; // exit
						}

						articleNumbers = parsePrintProducts( this );

						if (articleNumbers.length === 0)
						{
							return; // exit;
						}

						$( '.printProduct', this ).each( function ()
						{
							injectUploadButton( orderId, this );
						} );

						injectUploadNotice( this );

						init( orderId, articleNumbers );
					} );
				}
			}

			/**
			 * @param {object} button
			 * @param {object} form
			 * @param {object} modalElement
			 * @function modalConfirm
			 * @private
			 */
			function modalConfirm(button, form, modalElement)
			{
				if (!$( form ).validateForm())
				{
					return; // exit;
				}

				$( form ).addClass( 'uploading' ).submit();

				// disable button
				$( '[data-plenty-modal="confirm"]', modalElement )
					.addClass( 'disabled' );

				// after submitting ...
				$( 'iframe', modalElement ).load( function ()
				{
					var error = $( '.uploadError', $( this ).contents() );
					// change buttons on modal
					$( '.modal-footer button', modalElement ).remove();
					$( '.modal-footer', modalElement ).append( '<button type="button" class="btn btn-default" data-dismiss="modal"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span>Schliessen</button>' );

					if (error.length > 0)
					{
						// error
						$( '.modal-body', modalElement ).html( pm.compileTemplate( 'upload/uploadError.html', {'error': error.text()} ) );
					}
					else
					{
						// success
						$( '.modal-body', modalElement ).html( 'Upload erfolgreich abgeschlossen' );
					}

					// update upload button
					Upload.loadUpload().done( function ()
					{
						if (!Upload.getUpload().isUploadAllowed( button.data( 'articleNo' ) ))
						{
							button.disable();
						}

						if (!Upload.getUpload().isUploadAllowed())
						{
							$( '.PlentyWebMyAccountOrderOverviewUploadNoticeContainer' ).hide();
						}
					} );
				} );
			}

			/**
			 * Inject an upload notice into a given order tab pane
			 * @param orderTabPane
			 * @function injectUploadNotice
			 * @private
			 */
			function injectUploadNotice(orderTabPane)
			{
				$( '.PlentyWebMyAccountOrderOverview > .PlentyWebMyAccountOrderOverviewOverviewContainer', orderTabPane ).after(
					pm.compileTemplate( 'upload/uploadNotice.html' )
				);
			}

			/**
			 * Inject upload button into article's row for current order
			 * @param {number} orderId
			 * @param {object} articleRow
			 * @function parseMyAccount
			 * @private
			 */
			function injectUploadButton(orderId, articleRow)
			{
				var uploadButtonSection = $( pm.compileTemplate( 'upload/uploadButton.html', {
					'orderId'  : orderId,
					'articleNo': $( articleRow ).data( 'articleNo' ),
					'quantity' : parseFloat( $( '.ItemsDescriptionQuantityDetail', articleRow )[0].firstChild.nodeValue.trim() )
				} ) );
				$( '.ItemsDescriptionDetails', articleRow ).append( uploadButtonSection );
			}

			/**
			 * Parse print product's article numbers from given tab pane.
			 * Adds class '.printProduct' to print product's .ItemRow
			 * and data-article="XXX".
			 * @function parsePrintProducts
			 * @private
			 * @return {Array} printProducts
			 */
			function parsePrintProducts(orderTabPane)
			{
				var printProducts = [];

				$( '.ItemsRow', orderTabPane ).each(
					function ()
					{
						var articleNo = $( '.ItemsDescriptionNoDetail', this ).text().trim();
						if (/^20.*/.test( articleNo ))
						{
							printProducts.push( parseFloat( articleNo ) );
							$( this ).data( 'articleNo', articleNo )
								.addClass( 'printProduct' );
						}
					}
				);

				return printProducts;
			}

			/**
			 * Parse my account's current tab for order id
			 * @function parseOrderId
			 * @private
			 * @returns {Number} orderId
			 */
			function parseOrderId()
			{
				var matches;

				// if there's no order id ...
				if ((matches = /.*_(\d+)/.exec( $( '#PlentyWebMyAccountDisplayOrdersTabs' ).find( '.current' ).attr( 'id' ) )) === null)
				{
					return null;
				}

				// ... otherwise return order id
				return parseFloat( matches[1] );
			}

			/**
			 * Parse current order status from given tab pane.
			 * @param orderTabPane
			 * @private
			 * @function parseOrderStatus
			 * @returns {number} orderStatus
			 * @throws Will throw an exception if order status is not obtainable
			 */
			function parseOrderStatus(orderTabPane)
			{
				var matches;

				if ((matches = $( '.PlentyWebMyAccountOrderOverviewStatusHistoryState', orderTabPane ).first().text().match( /^\[(\d+|\d+\.\d+)].*$/ )) === null)
				{
					throw 'Could not obtain status';
				}

				return parseFloat( matches[1] );
			}
		}
		,
		['UploadFactory', 'ModalFactory']
	);
}( jQuery, PlentyFramework ));
