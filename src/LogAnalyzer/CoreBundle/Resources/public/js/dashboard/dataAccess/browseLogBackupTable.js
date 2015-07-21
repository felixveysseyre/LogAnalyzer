/* Namespaces */

var logAnalyzer = logAnalyzer || {};
logAnalyzer.dashboard = logAnalyzer.dashboard || {};
logAnalyzer.dashboard.dataAccess = logAnalyzer.dashboard.dataAccess || {};

/* Function definition */

(function($){

	logAnalyzer.dashboard.dataAccess.browseLogBackupTable = function()
	{
		/* Update navigation header */

		logAnalyzer.dashboard.loadNavigationHeader('Data access', 'Browse backup');

		/* Create callback functions */

		var useRequest = function(requestAnswer)
		{
			dataTableViewer
				.tableViewer('highlightColumn', 'Message', (requestAnswer.postData.logClauses.message) ? requestAnswer.postData.logClauses.message: false)
				.tableViewer('setData', (requestAnswer.resultCode === 1) ? requestAnswer.info.logs : false)
				.tableViewer('update');
		};

		var addAnswerToRequestViewer = function(requestAnswer, postData)
		{
			browseBackupDataForm.form('setPendingState', false);

			requestAnswer.postData = postData;

			if(requestAnswer.resultCode === 1)
				logAnalyzer.toolbox.array.sortArray(requestAnswer.info.logs, logAnalyzer.toolbox.array.compareLogsByReportedTime, 'asc');

			var information = JSON
				.stringify(postData)
				.replace(/"/g, '');

			browseBackupDataRequestsViewer
				.requestViewer('addRequest', requestAnswer, information)
				.requestViewer('update');

			useRequest(requestAnswer);
		};

		var addErrorNotificationToRequestViewer = function()
		{
			browseBackupDataFormModule.module('setPendingState', false);

			browseBackupDataRequestsViewer
				.requestViewer('addRequest', {resultCode: -1, message: 'An error occurred'})
				.requestViewer('update');
		};

		var browseBackupAction = function(formValues)
		{
			browseBackupDataFormModule.module('setPendingState', true);
			browseBackupDataRequestsViewerModule.module('setPendingState', true);

			/* Clear previous data */

			dataTableViewer
				.tableViewer('setData', false)
				.tableViewer('update');

			/* Create clauses */

			var postData = {
				logTableClauses: {},
				logBackupTableClauses: {},
				logClauses: {}
			};

			/** LogTable clauses **/

			if(formValues.hostIdActivation) postData.logTableClauses.hostId = formValues.hostId;
			if(formValues.hostLikeActivation) postData.logTableClauses.hostLike = formValues.hostLike;
			if(formValues.serviceIdActivation) postData.logTableClauses.serviceId = formValues.serviceId;

			/** LogBackupTable clauses **/

			if(formValues.dateActivation) postData.logBackupTableClauses.date = formValues.date;

			/** Log clauses **/

			if(formValues.reportedTimeActivation) postData.logClauses.reportedTime = {inf: formValues.reportedTimeInf, sup: formValues.reportedTimeSup};

			if(formValues.syslogTagActivation) postData.logClauses.syslogTag = formValues.syslogTag;
			if(formValues.messageActivation) postData.logClauses.message = formValues.message;

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
				method: 'getLogBackup',
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

			var request = browseBackupDataRequestsViewer.requestViewer('getActiveRequest');

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

		var browseBackupDataFormModule = contentContainer.addModule({id: 'browseBackupDataForm'});
		var browseBackupDataRequestsViewerModule = contentContainer.addModule({id: 'browseBackupDataRequestsViewer', class: 'noPadding'});
		var parseDataFormModule = contentContainer.addModule({id: 'parseDataForm', toggle: true});
		var dataTableViewerModule = contentContainer.addModule({id: 'dataTableViewer', class: 'noPadding'});
		var exporterModule = contentContainer.addModule({id: 'exporter'});

		/* Create plugins */

		var browseBackupDataForm = browseBackupDataFormModule.module('addPlugin', 'form', {
			fields: [
				{
					name: 'Host',
					id: 'hostId',
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
					valueKey: 'hostId'
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
					id: 'serviceId',
					help: 'Service which generated the logs',
					activation: null,
					type: 'select',
					separator: true,
					choicesURL: logAnalyzer.toolbox.LogAnalyzerAPICaller.getAPIURL({
						baseURL: baseURL,
						controller: 'platformAdministration',
						method: 'getService'
					}),
					choicesTransformFunction: function(requestAnswer){
						return (requestAnswer.resultCode === 1) ? requestAnswer.info.services : false;
					},
					nameKey: 'serviceHuman',
					valueKey: 'serviceId'
				},

				{
					name: 'Backup Date',
					id: 'date',
					help: 'Date of the backup table to search in',
					activation: null,
					type: 'date',
					value: '0000-00-00',
					separator: true
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
					name: 'Browse',
					id: 'browse',
					callback: browseBackupAction
				}
			]
		});

		var browseBackupDataRequestsViewer = browseBackupDataRequestsViewerModule.module('addPlugin', 'requestViewer', {
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
			{name: 'Reported Time', key: 'reportedTime'},
			{name: 'Host', key: 'host'},
			{name: 'Service', key: 'service'},
			{name: 'Syslog Tag', key: 'syslogTag'},
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