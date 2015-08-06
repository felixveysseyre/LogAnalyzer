$(function($){
	$.widget('wcd.tip', {

		/* Variables */

		/** Private **/

		_exporterContainer: null,

		/** Public **/

		options: {
		},

		/* Methods */

		/** Private **/

		_create: function()
		{
			this.element.mouseenter(function()
			{
				/* Cleaning */

				$('#tipContainer').remove();

				/* Get tip content */

				var tip = false;
				var tipClass = '';

				if($(this).attr('data-tip'))
				{
					tip = $(this).attr('data-tip');
				}
				else if($(this).data('tip'))
				{
					tip = $(this).data('tip');

					tip = JSON
						.stringify(tip, null, 4)
						.replace(/ /g, '&nbsp;')
						.replace(/(?:\r\n|\r|\n)/g, '<br/>');

					tipClass = 'code';
				}

				if(tip)
				{
					/* Content */

					var tipStructure =
						'<div id="tipContainer" class="#class#">' +
							'<div class="content">#content#</div>' +
							'<div class="arrow"></div>' +
						'</div>';

					$('body').append(tipStructure
						.replace(/#class#/, tipClass)
						.replace(/#content#/, tip)
					);

					var tipContainer = $('#tipContainer');

					/* Position */

					var offset = $(this).offset();
					var width = $(this).width();

					tipContainer.offset({
						top: offset.top - tipContainer.height() - 2,
						left: offset.left - (tipContainer.width() / 2) + (width / 2)
					});

					/* Display */

					tipContainer.delay(500).fadeIn(200);
				}
			});

			this.element.mouseleave(function()
			{
				$('#tipContainer').remove();
			});
		}

		/** Public **/

	});
});