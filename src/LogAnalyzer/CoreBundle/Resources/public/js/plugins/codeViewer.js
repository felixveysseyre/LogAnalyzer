$(function($){
	$.widget('wcd.codeViewer', {

		/* Variables */

		/** Private **/

		_codeViewerContainer: null,

		/** Public **/

		options: {
			parentModule: null,

			code: null,

			codeURL: null,
			postData: null,
			codeTransformFunction: null,

			numberOfLines: Infinity,
			displayFromEnd: false,
			order: 'asc',

			showLineNumbers: true
		},

		/* Methods */

		/** Private **/

		_create: function()
		{
			/* Initialization */

			this._createStructureAndLogic();

			/* Update content */

			if(this.getOption('codeURL'))
			{
				this.updateCode();
			}
			else
			{
				this.update();
			}
		},

		_createStructureAndLogic: function()
		{
			/* Structure */

			this.element.empty();

			/* Code viewer container */

			var codeViewerContainerStructure = '<table class="codeViewerContainer"></table>';

			this.element.append(codeViewerContainerStructure);
			this._codeViewerContainer = this.element.find('.codeViewerContainer');
		},

		_addStructure: function()
		{
			var code = this.getOption('code');

			var numberOfLines = this.getOption('numberOfLines');
			var displayFromEnd = this.getOption('displayFromEnd');
			var order = this.getOption('order');

			/* Clean old structure */

			this._codeViewerContainer.empty();

			/* Create new structure */

			if(code)
			{
				/* Pre-process */

				var codeLines = code.split('\n');

				if(codeLines[codeLines.length - 1] === '') codeLines.pop();

				/* Loop value */

				numberOfLines = Math.min(codeLines.length, numberOfLines);

				var iMin = (displayFromEnd === false) ? (0) : (codeLines.length - numberOfLines);
				var iMax = (displayFromEnd === false) ? (numberOfLines - 1) : (codeLines.length - 1);
				var increment = (order === 'asc') ? +1 : -1;

				if(order !== 'asc')
				{
					var temp = iMin;
					iMin = iMax;
					iMax = temp;
				}

				iMax = (order === 'asc') ? (iMax + 1) : (iMax - 1);

				/* Structure creation */

				if(this.getOption('showLineNumbers'))
				{
					var codeLineStructureWithLineNumber =
						'<tr>' +
							'<td class="lineNumber">#lineNumber#</td>' +
							'<td class="codeLine">#line#</td>' +
						'</tr>';

					for(var i = iMin; i !== iMax; i += increment)
					{
						this._codeViewerContainer.append(
							codeLineStructureWithLineNumber
								.replace(/#lineNumber#/, i + 1)
								.replace(/#line#/, codeLines[i])
						);
					}
				}
				else
				{
					var codeLineStructureWithoutLineNumber =
						'<tr>' +
							'<td>#line#</td>' +
						'</tr>';

					for(var i = iMin; i !== iMax; i += increment)
					{
						this._codeViewerContainer.append(
							codeLineStructureWithoutLineNumber
								.replace(/#line#/, codeLines[i])
						);
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
		},

		setPendingState: function(value)
		{
			var parentModule = this.getOption('parentModule');

			if(parentModule)
			{
				parentModule.module('setPendingState', value);
			}
		},

		setCode: function(code)
		{
			return this.setOption('code', code);
		},

		update: function()
		{
			this.setPendingState(true);
			this._addStructure();
			this.setPendingState(false);
		},

		updateCode: function()
		{
			var codeURL = this.getOption('codeURL');

			if(codeURL)
			{
				var self = this;

				var postData = this.getOption('postData');
				var codeTransformFunction = this.getOption('codeTransformFunction');

				$.ajax({
					type: 'POST',
					url: codeURL,
					data: postData,
					success: function(requestAnswer){
						if(typeof(debugMode) !== 'undefined' && debugMode) console.debug(requestAnswer);

						var code = (codeTransformFunction) ? codeTransformFunction(requestAnswer) : requestAnswer;

						self.setOption('code', code);
						self.update();
					},
					error: function(xhr, status, error){
						console.error(xhr.status + ' - ' + xhr.statusText);
					}
				});
			}
		}
	});
});