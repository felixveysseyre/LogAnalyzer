$(function($){
	$.widget('wcd.menu', {

		/* Variables */

		/** Private **/

		/** Public **/

		options: {
			sections: null,
			onActivation: null,
			onDeactivation: null
		},

		/* Methods */

		/** Private **/

		_create: function()
		{
			/* Initialization */

			this._createStructureAndLogic();
		},

		_createStructureAndLogic: function()
		{
			/* Structure */

			this.element.empty();

			/** Menu container **/

			var sections = this.getOption('sections');

			if(sections)
			{
				var ulStructure = '<ul id="#id#" class="#class#"></ul>';
				var ulElement, subUlElement;

				var liStructure =
					'<li id="#id#" class="#class#">' +
						'<span class="container #spanClass#">' +
							'#content#' +
						'</span>' +
					'</li>';
				var liElement, subLiElement;

				var contentStructure = '#icon#<span class="name">#name#</span>';
				var contentTemp;

				/* Create the main menu container */

				ulElement = $(ulStructure
					.replace(/#id#/, '')
					.replace(/#class#/, 'menuContainer menu')
				);

				/* Create sections and subSections */

				for(var i = 0; i < sections.length; i++)
				{
					var sectionTemp = sections[i];

					/* Section structure */

					contentTemp = contentStructure
						.replace(/#icon#/, (sectionTemp.icon) ? '<i class="fa ' + sectionTemp.icon + '"></i>' : '')
						.replace(/#name#/, sectionTemp.name);

					liElement = $(liStructure
						.replace(/#id#/, sectionTemp.id)
						.replace(/#class#/, 'section')
						.replace(/#spanClass#/, (! sectionTemp.onActivation) ? 'disabled' : '')
						.replace(/#content#/, contentTemp)
					);

					this._addCallbackFunction(sectionTemp, liElement);

					if(sectionTemp.subSections)
					{
						subUlElement = $(ulStructure
							.replace(/#id#/, sectionTemp.id + 'SubMenuContainer')
							.replace(/#class#/, 'subMenu')
						);

						for(var j = 0; j < sectionTemp.subSections.length; j++)
						{
							var subSectionTemp = sectionTemp.subSections[j];

							/* SubSection structure */

							contentTemp = contentStructure
								.replace(/#icon#/, (subSectionTemp.icon) ? '<i class="fa ' + subSectionTemp.icon + '"></i>' : '')
								.replace(/#name#/, subSectionTemp.name);

							subLiElement = $(liStructure
								.replace(/#id#/, subSectionTemp.id)
								.replace(/#class#/, 'subSection')
								.replace(/#spanClass#/, (! subSectionTemp.onActivation) ? 'disabled' : '')
								.replace(/#content#/, contentTemp)
							);

							this._addCallbackFunction(subSectionTemp, subLiElement);

							/* Append */

							subUlElement.append(subLiElement);
						}

						/* Append */

						liElement.append(subUlElement);
					}

					/* Append */

					ulElement.append(liElement);
				}

				/* Append */

				this.element.append(ulElement);
			}
		},

		_addCallbackFunction: function(section, liElement)
		{
			if(section.onActivation)
			{
				var callbackOnActivationMainTemp = this.getOption('onActivation') || function(){};
				var callbackOnDeactivationMainTemp = this.getOption('onDeactivation') || function(){};

				var callbackOnActivationTemp = section.onActivation || function(){};
				var callbackOnDeactivationTemp = section.onDeactivation || function(){};

				liElement.find('.container').click(function()
				{
					if($(this).hasClass('active'))
					{
						$(this).activeMenu(false);
						callbackOnDeactivationTemp();
						callbackOnDeactivationMainTemp();
					}
					else
					{
						$(this).activeMenu(true);
						callbackOnActivationMainTemp();
						callbackOnActivationTemp();
					}
				});
			}
		},

		/** Public **/

		getOption: function(optionName)
		{
			if(typeof(optionName) !== 'undefined')
				if(typeof(this.options[optionName]) !== 'undefined')
					return this.options[optionName];
				else
					return false;
			else
				return false;
		},

		setOption: function(optionName, option)
		{
			if(typeof(optionName) !== 'undefined' && typeof(option) !== 'undefined')
				if(typeof(this.options[optionName]) !== 'undefined')
					this.options[optionName] = option;
				else
					console.warn('Options ' + optionName + ' does not exist');
			else
				console.warn('optionName or option is undefined', optionName, option);
		}
	});

	$.fn.activeMenu = function(bool)
	{
		if(bool)
		{
			this.closest('.menuContainer')
				.find('.section .container, .subSection .container')
				.removeClass('active');
			this.addClass('active');
		}
		else
		{
			this.removeClass('active');
		}
	};
});