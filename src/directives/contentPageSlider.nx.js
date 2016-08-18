/**
 * Licensed under AGPL v3
 * =====================================================================================
 * @copyright   Copyright (c) 2016, net-xpress GmbH & Co KG
 * @author      Moritz Gericke <moritz@net-xpress.de>
 * =====================================================================================
 */
(function ($, pm) {
	'use strict';

	/*
	 * content page slider with parallax effect
	 *
	 * usage (functionality requires only attribute data-nx="contentpageSlider" and data-nx="parallax" data-nx-parallax-offset="XX%"):
	 * <div class="contentpageSlider" data-nx="contentpageSlider">
	 *     <div class="slide">
	 *         <div data-nx="parallax" data-nx-parallax-offset="40%">
	 *             ...
	 *         </div>
	 *         ...
	 *     </div>
	 *     <div class="slide">
	 *         ...
	 *     </div>
	 *     ...
	 * </div>
	 */

	pm.directive('[data-nx="contentpageSlider"]', function (i, elem) {
		$(elem).owlCarousel({
			navigation: true,
			navigationText: false,
			slideSpeed: 2000,
			paginationSpeed: 2000,
			singleItem: true,
			autoPlay: true,
			stopOnHover: true,
			parallaxDropIn: {
				items: [],
				doTranslateX: function (offsetX) {
					var m;
					if ((m = /([-]?\d+)(%|px)?/.exec(offsetX)) !== null) {
						if (typeof m[2] === 'undefined') {
							offsetX += 'px';
						}
						return {
							"-webkit-transform": "translate3d(" + offsetX + ", 0, 0)",
							"-moz-transform": "translate3d(" + offsetX + ", 0, 0)",
							"-o-transform": "translate3d(" + offsetX + ", 0, 0)",
							"-ms-transform": "translate3d(" + offsetX + ", 0, 0)",
							"transform": "translate3d(" + offsetX + ", 0,0)"
						};
					}
				}
			},
			afterInit: function () {
				var currentIndex = this.currentItem, speed = this.addCssSpeed(2000), pxDropIn = this.options.parallaxDropIn, center;

				// for all owl items ...
				this.$owlItems.each(function (i, owlItem) {
					var pxItems = [];
					// ... for all it's parallax items ...
					$('[data-nx="parallax"]', owlItem).each(function (j, pxItem) {
						var pxOffset, r, l, $pxItem;
						$pxItem = $(pxItem);

						// ... init center ...
						if (typeof center === 'undefined') {
							center = pxDropIn.doTranslateX(0);
						}

						// ... obtain parallax offset ...
						pxOffset = $pxItem.data('nx-parallax-offset');
						if (typeof pxOffset === 'undefined') {
							// ... or set default value ...
							pxOffset = '1000px';
						}

						// ... generate individual parallax right/left offsets ...
						r = pxDropIn.doTranslateX(pxOffset);
						l = pxDropIn.doTranslateX('-' + pxOffset);

						// ... apply initial offsets ...
						if (i != currentIndex) {
							$pxItem.css(i > currentIndex ? r : l);
						}

						// ... set animation speed
						$pxItem.css(speed);
						/*.css({"transition-delay":"0.3s"});*/

						// ... and store parallax items for faster lookup
						pxItems.push(
							{
								element: $pxItem,
								right: r,
								left: l,
								center: center
							}
						);
					});
					pxDropIn.items[i] = pxItems;
				});
			},
			afterMove: function (currentElement) {
				var currentIndex = this.currentItem;
				$.each(this.options.parallaxDropIn.items, function (i, pxItems) {
					$.each(pxItems, function (j, pxItem) {
						if (i != currentIndex) {
							pxItem.element.css(i > currentIndex ? pxItem.right : pxItem.left);
						} else {
							pxItem.element.css(pxItem.center);
						}
					});
				});
				$(currentElement).find('img[data-plenty-lazyload]').trigger('appear');
			}
		});
	});
}(jQuery, PlentyFramework));