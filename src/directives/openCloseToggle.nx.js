/**
 * Licensed under AGPL v3
 * =====================================================================================
 * @copyright   Copyright (c) 2016, net-xpress GmbH & Co KG
 * @author      Moritz Gericke <moritz@net-xpress.de>
 * =====================================================================================
 */
(function ($, pm) {
	"use strict";
	/* hacked open close toggle for mobile and touch enabled menus */
	/*
	 * Mobile dropdowns
	 * Toggles dropdowns using css class 'open' instead of pseudo class :hover
	 */
	pm.directive('.dropdown > a[data-nx-enable]', function (i, elem, MediaSizeService) {
		if ($(elem).attr('data-nx-enable') === "nx-touch-openCloseToggle") {
			var isBigMenu2 = $(elem).parents('.bigmenu2').length > 0;
			$(elem).click(function (e) {
				if (MediaSizeService.interval() === 'xs' || MediaSizeService.interval() === 'sm' || ( MediaSizeService.interval() !== 'xs' && MediaSizeService.interval() !== 'sm' && Modernizr.touch )) {
					$('.dropdown.open').not($(this).parents()).removeClass('open');
					$(this).parent().toggleClass('open');
					//return false;
					// nx: hacked to perform actual click on md and lg screens
					return !isBigMenu2 && (MediaSizeService.interval() === 'md' || MediaSizeService.interval() === 'lg');
				}
			});
		}
	}, ['MediaSizeService']);

	pm.directive('*', function (i, elem, MediaSizeService) {
		$(elem).click(function (e) {
			if (MediaSizeService.interval() === 'xs' || MediaSizeService.interval() === 'sm' || ( MediaSizeService.interval() !== 'xs' && MediaSizeService.interval() !== 'sm' && Modernizr.touch )) {
				var dropdown = $('.dropdown.open > a[data-nx-enable="nx-touch-openCloseToggle"]').parent();
				if (dropdown.length > 0 && !dropdown.is(e.target) && dropdown.has(e.target).length <= 0) {
					dropdown.removeClass('open');
				}
			}
		});
	}, ['MediaSizeService']);


	pm.directive(window, function (i, elem, MediaSizeService) {
		$(window).on('orientationchange', function () {
			if (MediaSizeService.interval() == 'xs' || MediaSizeService.interval() == 'sm' || ( MediaSizeService.interval() != 'xs' && MediaSizeService.interval() != 'sm' && Modernizr.touch )) {
				$('.dropdown.open > a[data-nx-enable="nx-touch-openCloseToggle"]').parent().removeClass('open');
			}
		});
		$(window).on('sizeChange', function (newValue) {
			if (newValue != 'xs' && newValue != 'sm' && !Modernizr.touch) {
				$('.dropdown.open > a[data-nx-enable="nx-touch-openCloseToggle"]').parent().removeClass('open');
			}
		});
	}, ['MediaSizeService']);

	$(document).ready(function () {
		if (pm.getInstance().MediaSizeService.interval() != 'xs' && pm.getInstance().MediaSizeService.interval() != 'sm' && Modernizr.touch) {
			$('.dropdown.open > a[data-nx-enable="nx-touch-openCloseToggle"]').parent().removeClass('open');
		}
	});

}(jQuery, PlentyFramework));