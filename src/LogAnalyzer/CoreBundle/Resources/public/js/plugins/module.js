$(function($){
	$.widget('wcd.module', {

		/* Variables */

		/** Private **/

		/** Public **/

		options: {
			size: 'full',
			type: null,
			class: null,
			title: null,
			subTitle: null,
			content: null,
			pendingMessage: '<i class="fa fa-cog fa-spin"></i>',
			toggle: null
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
			var self = this;

			/* Structure */

			this.element.empty();

			this.element.addClass('moduleContainer');
			this.element.addClass(this.getOption('size'));
			this.element.addClass(this.getOption('type'));
			this.element.addClass(this.getOption('class'));

			/** Title container **/

			var title = this.getOption('title');

			if(title)
			{
				var titleContainerStructure = '<span class="titleContainer">#title#</span>';

				var titleContainerElement = $(titleContainerStructure.replace(/#title#/, title));

				this.element.append(titleContainerElement);
			}

			/** SubTitle container **/

			var subTitle = this.getOption('subTitle');

			if(subTitle)
			{
				var subTitleContainerStructure = '<span class="subTitleContainer">#subTitle#</span>';

				var subTitleContainerElement = $(subTitleContainerStructure.replace(/#subTitle#/, subTitle));

				this.element.append(subTitleContainerElement);
			}

			/** Content container **/

			var contentContainerStructure = '<div class="contentContainer">#content#</div>';

			var content = (this.getOption('content')) ?  this.getOption('content') : '';

			var contentContainerElement = $(contentContainerStructure.replace(/#content#/, content));

			this.element.append(contentContainerElement);

			/** Resize container **/

			var toggle = this.getOption('toggle');

			if(toggle === true || toggle === false)
			{
				var resizeContainerStructure = '<div class="resizeContainer">#resizeIcon#</div>';

				var resizeContainerElement = $(resizeContainerStructure.replace(/#resizeIcon#/, '<i class="fa fa-angle-up"></i>'));

				resizeContainerElement.click(function(){
					self.toggle();
				});

				this.element.append(resizeContainerElement);

				if(toggle === true)
				{
					this.toggle();
				}
			}

			/** Pending container **/

			var pendingMessageContainerStructure = '<div class="pendingMessageContainer">#pendingMessage#</div>';

			var pendingMessage = this.getOption('pendingMessage');

			var pendingMessageContainerElement = $(pendingMessageContainerStructure.replace(/#pendingMessage#/, pendingMessage));

			this.element.append(pendingMessageContainerElement);
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
		},

		addPlugin: function(type, parameters)
		{
			/* Get content container */

			var contentContainer = this.getContentContainer();

			/* Clean old content */

			contentContainer.empty();

			/* Process parameters */

			parameters = parameters || {};
			parameters.parentModule = this.element;

			/* Add plugin */

			if(type === 'codeViewer')
				contentContainer.codeViewer(parameters);
			else if(type === 'dataPlotter')
				contentContainer.dataPlotter(parameters);
			else if(type === 'exporter')
				contentContainer.exporter(parameters);
			else if(type === 'form')
				contentContainer.form(parameters);
			else if(type === 'requestViewer')
				contentContainer.requestViewer(parameters);
			else if(type === 'tableViewer')
				contentContainer.tableViewer(parameters);
			else
				console.warn('Plugin type not supported.');

			/* Return */

			return contentContainer;
		},

		getContentContainer: function()
		{
			return this.element.find('.contentContainer');
		},

		loadContent: function(content)
		{
			this.element
				.find('.contentContainer')
				.html(content);
		},

		setPendingState: function(value)
		{
			if(value)
			{
				this.element.addClass('pending');
			}
			else
			{
				this.element.removeClass('pending');
			}
		},

		toggle: function(state)
		{
			if(state === true)
			{
				this.element.addClass('toggled');
			}
			else if(state === false)
			{
				this.element.removeClass('toggled');
			}
			else
			{
				this.element.toggleClass('toggled');
			}
		}
	});

	$.fn.addModule = function(parameters)
	{
		if(typeof(parameters.id) !== 'undefined')
		{
			var moduleContainerElement = $('<div id="#id#"></div>'.replace(/#id#/, parameters.id));

			this.append(moduleContainerElement);

			return moduleContainerElement.module(parameters);
		}
		else
		{
			console.error('Missing module ID');
		}
	};
});