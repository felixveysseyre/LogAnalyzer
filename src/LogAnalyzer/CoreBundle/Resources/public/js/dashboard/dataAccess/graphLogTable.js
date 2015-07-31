/* Namespaces */

var logAnalyzer = logAnalyzer || {};
logAnalyzer.dashboard = logAnalyzer.dashboard || {};
logAnalyzer.dashboard.dataAccess = logAnalyzer.dashboard.dataAccess || {};

/* Function definition */

(function($)
{
	logAnalyzer.dashboard.dataAccess.graphLogTable = function()
	{
		/* Update navigation header */

		logAnalyzer.dashboard.loadNavigationHeader('Data access', 'Graph');

		/* Create callback functions */

		var useRequest = function(requestAnswer)
		{
			dataPlotter
				.dataPlotter('setData', (requestAnswer.resultCode === 1) ? requestAnswer.info.logs : false)
				.dataPlotter('update');
		};

		var addAnswerToRequestViewer = function(requestAnswer, postData)
		{
			graphDataForm.form('setPendingState', false);

			var information = JSON
				.stringify(postData)
				.replace(/"/g, '');

			graphDataRequestsViewer
				.requestViewer('addRequest', requestAnswer, information)
				.requestViewer('update');

			dataPlotter
				.dataPlotter('setMinTick', (postData.reportedTimeActivation) ? postData.reportedTimeInf : null)
				.dataPlotter('setMaxTick', (postData.reportedTimeActivation) ? postData : null);

			useRequest(requestAnswer);
		};

		var addErrorNotificationToRequestViewer = function()
		{
			graphDataForm.form('setPendingState', false);

			graphDataRequestsViewer
				.requestViewer('addRequest', {resultCode: -1, message: 'An error occurred'})
				.requestViewer('update');
		};

		var graphAction = function(formValues)
		{
			graphDataForm.form('setPendingState', true);
			graphDataRequestsViewer.requestViewer('setPendingState', true);

			/* Clear previous data */

			dataPlotter
				.dataPlotter('setData', false)
				.dataPlotter('update');

			/* Create clauses */

			var postData = {};

			/** LogTable clauses **/

			if(formValues.hostActivation) postData.host = formValues.host;
			if(formValues.hostLikeActivation) postData.hostLike = formValues.hostLike;
			if(formValues.serviceActivation) postData.service = formValues.service;

			/** Log clauses **/

			if(formValues.reportedTimeActivation) postData.reportedTime = {inf: formValues.reportedTimeInf, sup: formValues.reportedTimeSup};

			if(formValues.syslogTagActivation) postData.syslogTag = formValues.syslogTag;
			if(formValues.messageActivation) postData.message = formValues.message;

			/** Options **/

			if(formValues.forceReturnActivation) postData.forceReturn = formValues.forceReturn;

			/* Request */

			var addAnswerToRequestViewerTemp = function(requestAnswer)
			{
				addAnswerToRequestViewer(requestAnswer, postData);
			};

			logAnalyzer.toolbox.LogAnalyzerAPICaller.callAPI({
				baseURL: baseURL,
				controller: 'dataAccess',
				method: 'getLog',
				postData: postData,
				successCallback: addAnswerToRequestViewerTemp,
				errorCallback: addErrorNotificationToRequestViewer
			});
		};

		var parseAction = function(formValues)
		{
			parseDataForm.form('setPendingState', true);

			var parsers = [];

			/** Get Parsers **/

			if(formValues.parser1Activation)
			{
				var parser1 = {
					parser: JSON.parse(formValues.parser1.replace(/'/g, '"'))
				};

				if(formValues.filter1Activation)
				{
					parser1.comparisonOperator = formValues.comparisonOperatorFilter1;
					parser1.value = formValues.valueFilter1;
				}

				parsers.push(parser1);
			}

			if(formValues.parser2Activation)
			{
				var parser2 = {
					parser: JSON.parse(formValues.parser2.replace(/'/g, '"'))
				};

				if(formValues.filter2Activation)
				{
					parser2.comparisonOperator = formValues.comparisonOperatorFilter2;
					parser2.value = formValues.valueFilter2;
				}

				parsers.push(parser2);
			}

			/* Get active request */

			var request = graphDataRequestsViewer.requestViewer('getActiveRequest');

			/* Updated logs displayed */

			if(request.resultCode === 1)
			{
				/* Get parsed logs */

				var logs = logAnalyzer.toolbox.log.parseLogs(request.info.logs, parsers);

				/* Update table viewer */

				dataPlotter
					.dataPlotter('setData', logs)
					.dataPlotter('update');
			}

			parseDataForm.form('setPendingState', false);
		};
		
		/* Create modules */

		var contentContainer = logAnalyzer.dashboard.getContentContainer();

		var graphDataFormModule = contentContainer.addModule({id: 'graphDataForm'});
		var graphDataRequestsViewerModule = contentContainer.addModule({id: 'graphDataRequestsViewer', class: 'noPadding'});
		var parseDataFormModule = contentContainer.addModule({id: 'parseDataForm', toggle: true});
		var dataPlotterModule = contentContainer.addModule({id: 'dataPlotter', class: 'noPadding'});
		var exporterModule = contentContainer.addModule({id: 'exporter'});

		/* Create plugins */

		var graphDataForm = graphDataFormModule.module('addPlugin', 'form', {
			fields: [
				{
					name: 'Host',
					id: 'host',
					help: 'Host which generated the logs',
					activation: null,
					type: 'select',
					choicesURL: logAnalyzer.toolbox.LogAnalyzerAPICaller.getAPIURL({
						baseURL: baseURL,
						controller: 'platformAdministration',
						method: 'getHost'
					}),
					choicesTransformFunction: function(requestAnswer){
						return (requestAnswer.resultCode === 1) ? requestAnswer.info.hosts : false;
					},
					nameKey: 'hostHuman',
					valueKey: 'hostHuman'
				},
				{
					name: 'Group Host',
					id: 'hostLike',
					help: 'Group of hosts which generated the logs',
					activation: null,
					type: 'text',
					value: 'group'
				},

				{
					name: 'Service',
					id: 'service',
					help: 'Service which generated the logs',
					activation: null,
					type: 'select',
					choicesURL: logAnalyzer.toolbox.LogAnalyzerAPICaller.getAPIURL({
						baseURL: baseURL,
						controller: 'platformAdministration',
						method: 'getService'
					}),
					choicesTransformFunction: function(requestAnswer){
						return (requestAnswer.resultCode === 1) ? requestAnswer.info.services : false;
					},
					nameKey: 'serviceHuman',
					valueKey: 'serviceHuman'
				},

				{
					name: 'Reported Time',
					id: 'reportedTime',
					help: 'Time range of the logs',
					activation: null,
					type: 'multiple',
					fields: [
						{
							name: 'Reported Time Inf',
							id: 'reportedTimeInf',
							type: 'dateTime',
							value: logAnalyzer.toolbox.date.getDateTimeNow()
						},
						{
							name: 'Reported Time Sup',
							id: 'reportedTimeSup',
							type: 'dateTime',
							value: logAnalyzer.toolbox.date.getDateTimeNow()
						}
					]
				},

				{
					name: 'Syslog Tag',
					id: 'syslogTag',
					help: 'Syslog tag of the logs',
					activation: null,
					type: 'text',
					value: 'tag'
				},
				{
					name: 'Message',
					id: 'message',
					help: 'Message pattern of the logs',
					activation: null,
					type: 'text',
					separator: true,
					value: 'message'
				},

				{
					name: 'Force Return',
					id: 'forceReturn',
					help: 'Force return if number of logs exceed the defined limit',
					warning: 'Forcing return may cause an overload on the server and on your computer',
					activation: null,
					type: 'radio',
					choices: [
						{name: 'Yes', value: 'true'},
						{name: 'No', value: 'false', selected: true}
					]
				}
			],
			buttons: [
				{
					name: 'Graph',
					id: 'graph',
					callback: graphAction
				}
			]
		});

		var graphDataRequestsViewer = graphDataRequestsViewerModule.module('addPlugin', 'requestViewer', {
			numberRequestsMax: 5,
			onActivation: useRequest
		});

		var parseDataForm = parseDataFormModule.module('addPlugin', 'form', {
			fields: [
				{
					name: 'Parser 1',
					id: 'parser1',
					help: 'Message parser condition to use',
					activation: null,
					type: 'select',
					choicesURL: logAnalyzer.toolbox.LogAnalyzerAPICaller.getAPIURL({
						baseURL: baseURL,
						controller: 'analysisAdministration',
						method: 'getParser'
					}),
					choicesTransformFunction: function(requestAnswer){
						return (requestAnswer.resultCode === 1) ? requestAnswer.info.parsers : false;
					},
					nameKey: 'parserHuman'
				},
				{
					name: 'Filter Parser 1',
					id: 'filter1',
					help: 'Filter to use with parser1',
					activation: null,
					type: 'multiple',
					fields: [
						{
							name: 'ComparisonOperatorFilter1',
							id: 'comparisonOperatorFilter1',
							type: 'select',
							choices: [
								{name: '<=', value: '<='},
								{name: '==', value: '==', selected: true},
								{name: '>=', value: '>='},
								{name: '!=', value: '!='}
							]
						},
						{
							name: 'valueFilter1',
							id: 'valueFilter1',
							type: 'text',
							value: 'value'
						}
					]
				},

				{
					name: 'Parser 2',
					id: 'parser2',
					help: 'Message parser condition to use',
					activation: null,
					type: 'select',
					choicesURL: logAnalyzer.toolbox.LogAnalyzerAPICaller.getAPIURL({
						baseURL: baseURL,
						controller: 'analysisAdministration',
						method: 'getParser'
					}),
					choicesTransformFunction: function(requestAnswer){
						return (requestAnswer.resultCode === 1) ? requestAnswer.info.parsers : false;
					},
					nameKey: 'parserHuman'
				},
				{
					name: 'Filter Parser 2',
					id: 'filter2',
					help: 'Filter to use with parser2',
					activation: null,
					type: 'multiple',
					fields: [
						{
							name: 'ComparisonOperatorFilter2',
							id: 'comparisonOperatorFilter2',
							type: 'select',
							choices: [
								{name: '<=', value: '<='},
								{name: '==', value: '==', selected: true},
								{name: '>=', value: '>='},
								{name: '!=', value: '!='}
							]
						},
						{
							name: 'valueFilter2',
							id: 'valueFilter2',
							type: 'text',
							value: 'value'
						}
					]
				}
			],
			buttons: [
				{
					name: 'Parse',
					id: 'parse',
					callback: parseAction
				}
			]
		});

		var dataPlotter = dataPlotterModule.module('addPlugin', 'dataPlotter', {
			chartType: 'areaChart',
			abscissaKey: 'reportedTime',
			showDistribution: true,
			options: true
		});

		/* Create exporter */

		var exporter = exporterModule.module('addPlugin', 'exporter', {
			exportDataAsJSON: true,
			exportDataAsCSV: true,
			dataGetter: function(){
				return dataPlotter.dataPlotter('getData');
			},

			exportPlotAsPNG: true,
			plotImageURLGetter: function(){
				return dataPlotter.dataPlotter('getPlotURL');
			}
		});
	};

})(jQuery);