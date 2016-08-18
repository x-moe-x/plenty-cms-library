/**
 * Licensed under AGPL v3
 * (https://github.com/plentymarkets/plenty-cms-library/blob/master/LICENSE)
 * =====================================================================================
 * @copyright   Copyright (c) 2016, net-xpress GmbH & Co KG
 * @author      Moritz Gericke <moritz@net-xpress.de>
 * =====================================================================================
 */

/**
 * @module Factories
 */
(function ($, pm)
	{
		pm.factory( 'UploadFactory', function (API, UI)
		{
			// data received from ReST API
			var uploadData;

			// instance wrapped checkout object for global access
			var upload;

			// initialization data
			var _orderId, _articles;

			return {
				init      : init,
				loadUpload: loadUpload,
				getUpload : getUpload
			};

			function Upload()
			{
				return uploadData;
			}

			function init(orderId, articles)
			{
				_orderId  = orderId;
				_articles = articles;

				upload     = null;
				uploadData = null;
			}

			function loadUpload()
			{
				return API.get( '//net-xpress.com/uploadscript/check_order.php?callback=?', {
						"OrderId" : _orderId,
						"Articles": _articles.join()
					}, false, true, false )
					.done( function (response)
					{
						if (!!response)
						{
							uploadData = transformResponse( response );
							upload     = new Upload();
						}
						else
						{
							UI.throwError( 0, 'Could not receive upload data' );
						}
					} );
			}

			function getUpload()
			{
				if (!upload || !uploadData)
				{
					UI.throwError( 0, 'Upload not initialized' );
				}

				return upload;
			}

			function transformResponse(response)
			{
				var uploadData = {
					orderId        : response.OrderId,
					articles       : [],
					isUploadAllowed: isUploadAllowed
				};

				$.each( response.Articles, function (i, article)
				{
					uploadData.articles.push( {
						articleNo      : article.ArticleNr,
						isUploadAllowed: article.UploadAllowed
					} );
				} );

				function isUploadAllowed(articleNo)
				{
					var isAllowed = null;

					if (articleNo !== undefined)
					{
						$.each( uploadData.articles, function (i, article)
						{
							if (articleNo == article.articleNo)
							{
								isAllowed = article.isUploadAllowed;
								return false;
							}
						} );
						if (isAllowed === null)
						{
							UI.throwError( 0, 'Could not find article' );
							return false;
						}
					}
					else
					{
						isAllowed = false;
						$.each( uploadData.articles, function (i, article)
						{
							if (article.isUploadAllowed)
							{
								isAllowed = true;
								return false;
							}
						} );
					}

					return isAllowed;
				}

				return uploadData;
			}

		}, ['APIFactory', 'UIFactory'] );
	}
	( jQuery, PlentyFramework )
)
;