(function ($, pm)
{

	pm.partials.MinHeight = {

		adjust: function (style, height)
		{
			$( style ).html( $( pm.compileTemplate( 'style/styleMinHeight.html', {
				'height': height,
				'height-affix': height - 170
			} ) ).html() );
		}
	}

})( jQuery, PlentyFramework );