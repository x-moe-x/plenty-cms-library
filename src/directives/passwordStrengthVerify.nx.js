/**
 * Licensed under AGPL v3
 * =====================================================================================
 * @copyright   Copyright (c) 2016, net-xpress GmbH & Co KG
 * @author      Moritz Gericke <moritz@net-xpress.de>
 * =====================================================================================
 */
(function ($, pm)
{
	pm.directive( '[data-nx-password-strength-verify]', function (i, ruleList)
	{
		var validator = new (function ()
		{
			var rules = [];

			return {
				addRule : addRule,
				validate: validate
			};

			function addRule(rule)
			{
				rules.push( rule );
			}

			function validate(password)
			{
				$.each( rules, function (i, rule)
				{
					rule( password );
				} );
			}
		});

		$( '[data-password-rule]', ruleList ).each( function (i, rule)
		{
			$.extend( rule, {
				valid: function (valid)
				{
					if (valid)
					{
						$( rule ).removeClass( 'invalid' ).addClass( 'valid' );
					}
					else
					{
						$( rule ).removeClass( 'valid' ).addClass( 'invalid' );
					}
				}
			} );
			switch ($( rule ).data( 'passwordRule' ))
			{
				case 'length':
					validator.addRule( function (password)
					{
						eval( "var minMax = " + $( rule ).attr( 'data-password-validate' ) );
						var options = {
							min: !!minMax ? minMax.min : 0,
							max: !!minMax ? minMax.max : 999
						}

						rule.valid( password.length >= options.min && password.length <= options.max );
					} );
					break;
				case 'letter':
					validator.addRule( function (password)
					{
						rule.valid( password.match( /[A-z]/ ) );
					} );
					break;
				case 'number':
					validator.addRule( function (password)
					{
						rule.valid( password.match( /\d/ ) );
					} );
					break;
				default:
					console.log( 'unknown password rule' );
					break;

			}
		} );

		$( $( ruleList ).data( 'target' ) ).keyup( function ()
		{
			validator.validate( $( this ).val() )
		} );
	} );
}( jQuery, PlentyFramework ));