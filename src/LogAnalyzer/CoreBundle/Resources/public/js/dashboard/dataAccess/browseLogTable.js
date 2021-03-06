/* Namespaces */

var logAnalyzer = logAnalyzer || {};
logAnalyzer.dashboard = logAnalyzer.dashboard || {};
logAnalyzer.dashboard.dataAccess = logAnalyzer.dashboard.dataAccess || {};

/* Function definition */

(function($){

	logAnalyzer.dashboard.dataAccess.browseLogTable = function()
	{
		/* Update navigation header */

		logAnalyzer.dashboard.loadNavigationHeader('Data access', 'Browse');

		/* Create callback functions */

		var useRequest = function(requestAnswer)
		{
			dataTableViewer
				.tableViewer('setOption', 'columns', defaultColumnsDataTableViewer)
				.tableViewer('highlightColumn', 'Message', (requestAnswer.postData.message) ? requestAnswer.postData.message: false)
				.tableViewer('setData', (requestAnswer.resultCode === 1) ? requestAnswer.info.logs : false)
				.tableViewer('update');
		};

		var addAnswerToRequestViewer = function(requestAnswer, postData)
		{
			browseDataForm.form('setPendingState', false);

			requestAnswer.postData = postData;

			if(requestAnswer.resultCode === 1)
				logAnalyzer.toolbox.array.sortArray(requestAnswer.info.logs, logAnalyzer.toolbox.array.compareLogsByReportedTime, 'asc');

			browseDataRequestsViewer
				.requestViewer('addRequest', requestAnswer, postData)
				.requestViewer('update');

			useRequest(requestAnswer);
		};

		var addErrorNotificationToRequestViewer = function()
		{
			browseDataForm.form('setPendingState', false);

			browseDataRequestsViewer
				.requestViewer('addRequest', {resultCode: -1, message: 'An error occurred'})
				.requestViewer('update');
		};

		var browseAction = function(formValues)
		{
			browseDataForm.form('setPendingState', true);
			browseDataRequestsViewer.requestViewer('setPendingState', true);

			/* Clear previous data */

			dataTableViewer
				.tableViewer('setData', false)
				.tableViewer('update');

			/* Create clauses */

			var postData = {};

			if(formValues.hostActivation) postData.host = formValues.host;
			if(formValues.hostLikeActivation) postData.hostLike = formValues.hostLike;
			if(formValues.serviceActivation) postData.service = formValues.service;

			if(formValues.reportedTimeActivation) postData.reportedTime = {inf: formValues.reportedTimeInf, sup: formValues.reportedTimeSup};

			if(formValues.priorityActivation) postData.priority = formValues.priority;
			if(formValues.facilityActivation) postData.facility = formValues.facility;

			if(formValues.messageActivation) postData.message = formValues.message;

			if(formValues.forceReturnActivation) postData.forceReturn = formValues.forceReturn;

			/* Request */

			var addAnswerToRequestViewerTemp = function(requestAnswer)
			{
				addAnswerToRequestViewer(requestAnswer, postData);
			};

			var seeLiveGraphTemp = function()
			{
				logAnalyzer.toolbox.LogAnalyzerAPICaller.callAPI({
					baseURL: baseURL,
					controller: 'dataAccess',
					method: 'getLog',
					postData: postData,
					successCallback: addAnswerToRequestViewerTemp,
					errorCallback: addErrorNotificationToRequestViewer
				});
			};

			seeLiveGraphTemp();

			/* Periodicity */

			if(formValues.autoUpdateActivation)
			{
				logAnalyzer.dashboard.addPeriodicAction(seeLiveGraphTemp, formValues.autoUpdate * 60 * 1000);
			}
			else
			{
				logAnalyzer.dashboard.clearPeriodicActions();
			}
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

			var request = browseDataRequestsViewer.requestViewer('getActiveRequest');

			/* Updated logs displayed */

			if(request.resultCode === 1)
			{
				/* Get parsed logs */

				var logs = logAnalyzer.toolbox.log.parseLogs(request.info.logs, parsers);

				/* Create columns object */

				var columnsDataTableViewer = defaultColumnsDataTableViewer.concat(logAnalyzer.toolbox.log.getColumnFromParser(parsers));

				/* Update table viewer */

				dataTableViewer
					.tableViewer('setOption', 'columns', columnsDataTableViewer)
					.tableViewer('setData', logs)
					.tableViewer('update');
			}

			parseDataForm.form('setPendingState', false);
		};

		/* Create modules */

		var contentContainer = logAnalyzer.dashboard.getContentContainer();

		var browseDataFormModule = contentContainer.addModule({id: 'browseDataForm'});
		var browseDataRequestsViewerModule = contentContainer.addModule({id: 'browseDataRequestsViewer', class: 'noPadding'});
		var parseDataFormModule = contentContainer.addModule({id: 'parseDataForm', toggle: true});
		var dataTableViewerModule = contentContainer.addModule({id: 'dataTableViewer', class: 'noPadding'});
		var exporterModule = contentContainer.addModule({id: 'exporter'});

		/* Create plugins */

		var browseDataForm = browseDataFormModule.module('addPlugin', 'form', {
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
					value: 'group'},

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
					name: 'Priority',
					id: 'priority',
					help: 'Priority of the logs',
					activation: null,
					type: 'number',
					min: '0',
					value: '0',
					max: '7'
				},
				{
					name: 'Facility',
					id: 'facility',
					help: 'Facility of the logs',
					activation: null,
					type: 'number',
					min: '0',
					value: '0',
					max: '23'
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
					],
					separator: true
				},

				{
					name: 'Auto Update',
					id: 'autoUpdate',
					help: 'Auto regenerating time of the request',
					activation: null,
					type: 'select',
					choices: [
						{name: '1m', value: 1},
						{name: '5m', value: 5, selected: true},
						{name: '15m', value: 15},
						{name: '30m', value: 30},
						{name: '60m', value: 60}
					]
				}
			],
			buttons: [
				{
					name: 'Browse',
					id: 'browse',
					callback: browseAction
				}
			]
		});

		var browseDataRequestsViewer = browseDataRequestsViewerModule.module('addPlugin', 'requestViewer', {
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

		var defaultColumnsDataTableViewer = [
			{name: 'Reported Time', key: 'reportedTime', width: '115px'},
			{name: 'Host', key: 'host', width: '115px'},
			{name: 'Service', key: 'service'},
			{name: 'Priority', key: 'priority'},
			{name: 'Facility', key: 'facility'},
			{name: 'Message', key: 'message'}
		];

		var dataTableViewer = dataTableViewerModule.module('addPlugin', 'tableViewer', {
			showHeader: true,
			showLineNumbers: true,
			pagination: true,
			numberOfLinesPerPage: 100,
			columns: defaultColumnsDataTableViewer
		});

		var exporter = exporterModule.module('addPlugin', 'exporter', {
			exportDataAsJSON: true,
			exportDataAsCSV: true,
			dataGetter: function(){
				return dataTableViewer.tableViewer('getData');
			}
		});
	};

})(jQuery);