$(function($){
	$.widget('wcd.requestViewer', {

		/* Variables */

		/** Private **/

		_numberRequests: null,
		_requests: null,

		_requestViewerContainer: null,

		/** Public **/

		options: {
			parentModule: null,
			numberRequestsMax: null,
			onActivation: null
		},

		/* Methods */

		/** Private **/

		_create: function()
		{
			/* Initialization */

			this._numberRequests = 0;
			this._requests = [];

			this._createStructureAndLogic();

			/* Update content */

			this.update();
		},

		_createStructureAndLogic: function()
		{
			/* Structure */

			this.element.empty();

			/* Code viewer container */

			var requestViewerContainerStructure = '<table class="requestViewerContainer"></table>';

			this.element.append(requestViewerContainerStructure);
			this._requestViewerContainer = this.element.find('.requestViewerContainer');
		},
		
		_addStructure: function()
		{
			var requests = this._requests;
			var requestViewerContainer = this._requestViewerContainer;

			var onActivation = this.getOption('onActivation');

			var color;

			var requestLineStructureWithLineNumber =
				'<tr id="#id#" class="#color# #options#">' +
					'<td class="requestNumber">#requestNumber#</td>' +
					'<td class="requestDateTime">#requestDateTime#</td>' +
					'<td class="requestExecutionTime">#requestExecutionTime#</td>' +
					'<td class="requestResultCode">#requestResultCode#</td>' +
					'<td class="requestMessage">#requestMessage#</td>' +
				'</tr>';

			/* Clean old structure*/

			requestViewerContainer.empty();

			/* Create new structure */

			if(requests && requests.length !== 0)
			{
				if(onActivation)
				{
					requestViewerContainer.addClass('activationEnabled');
				}

				var realThis = this;

				for(var i = 0; i < requests.length; i++)
				{
					var id = 'request' + requests[i].id;

					if(requests[i].request.resultCode === 1) color = 'green';
					else if(requests[i].request.resultCode === 0) color = 'orange';
					else if(requests[i].request.resultCode === -1) color = 'red';
					else color = '';

					var options = (i === requests.length - 1) ? 'active' : '';

					var self = this.element;

					requestViewerContainer.append(
						requestLineStructureWithLineNumber
							.replace(/#id#/, id)
							.replace(/#color#/, color)
							.replace(/#options#/, options)
							.replace(/#requestNumber#/, requests[i].id)
							.replace(/#requestDateTime#/, requests[i].dateTime)
							.replace(/#requestExecutionTime#/, requests[i].request.executionTime || '')
							.replace(/#requestResultCode#/, requests[i].request.resultCode)
							.replace(/#requestMessage#/, requests[i].request.message || '')
					);

					if(requests[i].information)
					{
						requestViewerContainer
							.find('#' + id)
							.addClass('tip')
							.data('tip', requests[i].information);
					}


					if(onActivation)
					{
						(function(){
							var requestTemp = requests[i];
							var idTemp = id;
							var selfTemp = self;
							var thisTemp = realThis;

							selfTemp.find('#' + idTemp).click(function(){
								selfTemp.find('tr').removeClass('active');
								thisTemp.setActiveRequest(requestTemp.id);
								$(this).addClass('active');
								onActivation(requestTemp.request);
							});

						})();
					}
				}

				this.element.find('.tip').tip();
			}
			else
			{
				var dateTimeNow = new Date()
					.toISOString()
					.substring(0, 19)
					.replace(/T/, ' ');

				requestViewerContainer.append(
					requestLineStructureWithLineNumber
						.replace(/#id#/, '')
						.replace(/#color#/, '')
						.replace(/#options#/, '')
						.replace(/#requestNumber#/, 0)
						.replace(/#requestDateTime#/, dateTimeNow)
						.replace(/#requestExecutionTime#/, '')
						.replace(/#requestResultCode#/, '')
						.replace(/#requestMessage#/, 'No request to display.')
						.replace(/#requestInformation#/, '')
				);
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

		update: function()
		{
			this.setPendingState(true);
			this._addStructure();
			this.setPendingState(false);
		},

		addRequest: function(request, information)
		{
			var numberRequestsMax = this.getOption('numberRequestsMax');

			/* Create request object */

			var dateTime = new Date()
				.toISOString()
				.substring(0, 19)
				.replace(/T/, ' ');

			var id = this._numberRequests + 1;

			var requestObject = {
				id: id,
				dateTime: dateTime,
				information: information || '',
				request: request
			};

			/* Add request object */
	
			this._requests.push(requestObject);
			this._numberRequests++;

			/* Active new request */

			this.setActiveRequest(id);

			/* Remove old request */

			if(numberRequestsMax)
			{
				if(this._requests.length === numberRequestsMax + 1)
					this._requests.shift();
			}
		},

		setActiveRequest: function(id)
		{
			var requests = this._requests;

			if(requests)
			{
				for(var i = 0; i < requests.length; i++)
				{
					requests[i].active = (requests[i].id === id) ? true: false;
				}
			}
		},

		getActiveRequest: function()
		{
			var requests = this._requests;

			if(requests)
			{
				for(var i = 0; i < requests.length; i++)
				{
					if(requests[i].active === true)
					{
						return requests[i].request;
					}
				}
			}

			return false;
		}
	});
});