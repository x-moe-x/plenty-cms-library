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
	// hide all unused filter options which doesn't help in further differentiate results e.g. if there's just one option...
	pm.directive( '.NavigationGroupFilter', function (i, filterGroup)
	{
		var filterElements = $( '.CharacterFilterElement', filterGroup );
		if (filterElements.length === 1 && $( 'input:checkbox:not(:checked)', filterElements ).length === 1) {
			$( filterGroup ).hide();
		}
	} );

	// ... and if no filters are left afterwards: hide filter section
	// (except first, sorting element)
	pm.directive( '.filterPanel > div > div:not(:first)', function (i, panel)
	{
		if ($( '.NavigationGroupFilter .CharacterFilterElement:visible' ).length === 0) {
			$( panel ).hide();
		}
	} );
}( jQuery, PlentyFramework ));