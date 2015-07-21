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
				var ulStructure = '<ul id="#id#" class="#class#">#content#</ul>'; //class = menu || subMenu
				var liStructure = '<li id="#id#" class="#class#"><span class="container #spanClass#">#content#</span></li>'; //class = section || subSection
				var contentStructure = '#icon#<span class="name">#name#</span>';

				/* Create the main menu container */

				this.element
					.append(ulStructure
						.replace(/#id#/, '')
						.replace(/#class#/, 'menuContainer menu')
						.replace(/#content#/, '')
				);

				var menuContainer = this.element.find('.menuContainer');

				/* Create sections and subSections */

				var contentTemp;
				var spanClassTemp;

				for(var i = 0; i < sections.length; i++)
				{
					var sectionTemp = sections[i];

					/* Text */

					contentTemp = contentStructure
						.replace(/#icon#/, (sectionTemp.icon) ? '<i class="fa ' + sectionTemp.icon + '"></i>' : '')
						.replace(/#name#/, sectionTemp.name);

					/* Activation */

					spanClassTemp = (! sectionTemp.onActivation) ? 'disabled' : '';

					/* Section structure */

					menuContainer.append(liStructure
						.replace(/#id#/, sectionTemp.id)
						.replace(/#class#/, 'section')
						.replace(/#spanClass#/, spanClassTemp)
						.replace(/#content#/, contentTemp)
					);

					var sectionContainerTemp = this.element.find('#' + sectionTemp.id);

					/* Section logic */

					/* Logic */

					var self = this;

					if(sectionTemp.onActivation)
					{
						(function(){
							var callbackOnActivationMainTemp = self.getOption('onActivation') || function(){};
							var callbackOnDeactivationMainTemp = self.getOption('onDeactivation') || function(){};

							var callbackOnActivationTemp = sectionTemp.onActivation || function(){};
							var callbackOnDeactivationTemp = sectionTemp.onDeactivation || function(){};

							sectionContainerTemp.find('.container').click(function()
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
						})();
					}

					if(sectionTemp.subSections)
					{
						sectionContainerTemp
							.append(ulStructure
								.replace(/#id#/, sectionTemp.id + 'SubMenuContainer')
								.replace(/#class#/, 'subMenu')
								.replace(/#content#/, '')
						);

						var subMenuContainerTemp = this.element.find('#' + sectionTemp.id + 'SubMenuContainer');

						for(var j = 0; j < sectionTemp.subSections.length; j++)
						{
							var subSectionTemp = sectionTemp.subSections[j];

							/* Icon */

							contentTemp = contentStructure
								.replace(/#icon#/, (subSectionTemp.icon) ? '<i class="fa ' + subSectionTemp.icon + '"></i>' : '')
								.replace(/#name#/, subSectionTemp.name);

							/* Activation */

							spanClassTemp = (! subSectionTemp.onActivation) ? 'disabled' : '';

							/* SubSection structure */

							subMenuContainerTemp
								.append(liStructure
									.replace(/#id#/, subSectionTemp.id)
									.replace(/#class#/, 'subSection')
									.replace(/#spanClass#/, spanClassTemp)
									.replace(/#content#/, contentTemp)
							);

							var subSectionContainerTemp = this.element.find('#' + subSectionTemp.id);

							/* Logic */

							if(subSectionTemp.onActivation)
							{
								(function(){
									var callbackOnActivationMainTemp = self.getOption('onActivation') || function(){};
									var callbackOnDeactivationMainTemp = self.getOption('onDeactivation') || function(){};

									var callbackOnActivationTemp = subSectionTemp.onActivation || function(){};
									var callbackOnDeactivationTemp = subSectionTemp.onDeactivation || function(){};

									subSectionContainerTemp.find('.container').click(function(){
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
								})();
							}
						}
					}
				}
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