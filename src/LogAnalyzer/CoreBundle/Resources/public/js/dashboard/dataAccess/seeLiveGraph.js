/* Namespaces */

var logAnalyzer = logAnalyzer || {};
logAnalyzer.dashboard = logAnalyzer.dashboard || {};
logAnalyzer.dashboard.dataAccess = logAnalyzer.dashboard.dataAccess || {};

/* Function definition */

(function($)
{
	logAnalyzer.dashboard.dataAccess.seeLiveGraph = function()
	{
		/* Update navigation header */

		logAnalyzer.dashboard.loadNavigationHeader('Data access', 'See liveGraph');

		/* Create callback functions */

		var useRequest = function(requestAnswer)
		{
			dataPlotter
				.dataPlotter('setData', (requestAnswer.resultCode === 1) ? requestAnswer.info.liveGraphCounts : false)
				.dataPlotter('update');
		};

		var addAnswerToRequestViewer = function(requestAnswer, postData, parameters)
		{
			liveGraphForm.form('setPendingState', false);

			liveGraphRequestsViewer
				.requestViewer('addRequest', requestAnswer, postData)
				.requestViewer('update');

			dataPlotter
				.dataPlotter('setMinTick', parameters.reportedTimeInf || null)
				.dataPlotter('setMaxTick', parameters.reportedTimeSup || null);

			useRequest(requestAnswer);
		};

		var addErrorNotificationToRequestViewer = function()
		{
			liveGraphForm.form('setPendingState', false);

			liveGraphRequestsViewer
				.requestViewer('addRequest', {resultCode: -1, message: 'An error occurred'})
				.requestViewer('update');
		};

		var seeAction = function(formValues)
		{
			logAnalyzer.dashboard.clearPeriodicActions();

			liveGraphForm.form('setPendingState', true);
			liveGraphRequestsViewer.requestViewer('setPendingState', true);

			/* Clear previous data */

			dataPlotter
				.dataPlotter('setData', false)
				.dataPlotter('update');

			/* Create clauses */

			var postData = {};

			if(formValues.liveGraphHumanActivation) postData.liveGraphHuman = formValues.liveGraphHuman;

			if(formValues.reportedTimeActivation) postData.reportedTime = {inf: formValues.reportedTimeInf, sup: formValues.reportedTimeSup};

			/* Request */

			var addAnswerToRequestViewerTemp = function(requestAnswer)
			{
				var parameters = {};

				if(formValues.reportedTimeActivation)
				{
					parameters.reportedTimeInf = formValues.reportedTimeInf;
					parameters.reportedTimeSup = formValues.reportedTimeSup;
				}

				addAnswerToRequestViewer(requestAnswer, postData, parameters);
			};

			var seeLiveGraphTemp = function()
			{
				logAnalyzer.toolbox.LogAnalyzerAPICaller.callAPI({
					baseURL: baseURL,
					controller: 'dataAccess',
					method: 'getLiveGraphCount',
					postData: postData,
					successCallback: addAnswerToRequestViewerTemp,
					errorCallback: addErrorNotificationToRequestViewer
				});
			};

			seeLiveGraphTemp();

			if(formValues.autoUpdateActivation)
			{
				logAnalyzer.dashboard.addPeriodicAction(seeLiveGraphTemp, formValues.autoUpdate * 60 * 1000);
			}
		};
		
		/* Create modules */

		var contentContainer = logAnalyzer.dashboard.getContentContainer();

		var liveGraphFormModule = contentContainer.addModule({id: 'liveGraphForm'});
		var liveGraphRequestsViewerModule = contentContainer.addModule({id: 'liveGraphRequestsViewer', class: 'noPadding'});
		var dataPlotterModule = contentContainer.addModule({id: 'dataPlotter', class: 'noPadding'});
		var exporterModule = contentContainer.addModule({id: 'exporter'});

		/* Create plugins */

		var liveGraphForm = liveGraphFormModule.module('addPlugin', 'form', {
			fields: [
				{
					name: 'LiveGraph',
					id: 'liveGraphHuman',
					help: 'LiveGraph to use',
					activation: true,
					separator: true,
					type: 'select',
					choicesURL: logAnalyzer.toolbox.LogAnalyzerAPICaller.getAPIURL({
						baseURL: baseURL,
						controller: 'analysisAdministration',
						method: 'getLiveGraph'
					}),
					choicesTransformFunction: function(requestAnswer){
						return (requestAnswer.resultCode === 1) ? requestAnswer.info.liveGraphs : false;
					},
					nameKey: 'liveGraphHuman',
					valueKey: 'liveGraphHuman'
				},

				{
					name: 'Reported Time',
					id: 'reportedTime',
					help: 'Time range of the liveGraph counts',
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
					],
					separator: true
				},

				{
					name: 'Auto Update',
					id: 'autoUpdate',
					help: 'Auto regenerating time of the graph',
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
					name: 'See',
					id: 'see',
					callback: seeAction
				}
			]
		});

		var liveGraphRequestsViewer = liveGraphRequestsViewerModule.module('addPlugin', 'requestViewer', {
			numberRequestsMax: 5,
			onActivation: useRequest
		});

		var dataPlotter = dataPlotterModule.module('addPlugin', 'dataPlotter', {
			chartType: 'areaChart',
			abscissaKey: 'reportedTime',
			ordinateKey: 'count',
			options: true,
			timeAggregationPossibility: [5]
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