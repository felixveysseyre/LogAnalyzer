$(function($){
	$.widget('wcd.module', {

		/* Variables */

		/** Private **/

		_titleContainer: null,
		_subTitleContainer: null,
		_contentContainer: null,
		_resizeContainer: null,
		_pendingContainer: null,

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

				titleContainerStructure = titleContainerStructure.replace(/#title#/, title);

				this.element.append(titleContainerStructure);
				this._titleContainer = this.element.find('.titleContainer');
			}

			/** SubTitle container **/

			var subTitle = this.getOption('subTitle');

			if(subTitle)
			{
				var subTitleContainerStructure = '<span class="subTitleContainer">#subTitle#</span>';

				subTitleContainerStructure = subTitleContainerStructure.replace(/#subTitle#/, subTitle);

				this.element.append(subTitleContainerStructure);
				this._subTitleContainer = this.element.find('.subTitleContainer');
			}

			/** Content container **/

			var contentContainerStructure = '<div class="contentContainer">#content#</div>';

			var content = (this.getOption('content')) ?  this.getOption('content') : '';

			contentContainerStructure = contentContainerStructure.replace(/#content#/, content);

			this.element.append(contentContainerStructure);
			this._contentContainer = this.element.find('.contentContainer');

			/** Resize container **/

			var toggle = this.getOption('toggle');

			if(toggle === true || toggle === false)
			{
				var resizeContainerStructure = '<div class="resizeContainer">#resizeIcon#</div>';

				resizeContainerStructure = resizeContainerStructure.replace(/#resizeIcon#/, '<i class="fa fa-angle-up"></i>');

				this.element.append(resizeContainerStructure);
				this._resizeContainer = this.element.find('.resizeContainer');

				this._resizeContainer.click(function(){
					self.toggle();
				});

				if(toggle === true)
				{
					this.toggle();
				}
			}

			/** Pending container **/

			var pendingMessageContainerStructure = '<div class="pendingMessageContainer">#pendingMessage#</div>';

			var pendingMessage = this.getOption('pendingMessage');

			pendingMessageContainerStructure = pendingMessageContainerStructure.replace(/#pendingMessage#/, pendingMessage);

			this.element.append(pendingMessageContainerStructure);
			this._pendingContainer = this.element.find('.pendingMessageContainer');
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

			/* Return */

			return contentContainer;
		},

		getContentContainer: function()
		{
			return this._contentContainer;
		},

		loadContent: function(content)
		{
			this._contentContainer.html(content);
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
			var moduleContainerStructure = '<div id="#id#"></div>'.replace(/#id#/, parameters.id);

			this.append(moduleContainerStructure);

			return $(this).find('#' + parameters.id).module(parameters);
		}
		else
		{
			console.error('Missing module ID');
		}
	};
});