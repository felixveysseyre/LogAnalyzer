/* Namespaces */

var logAnalyzer = logAnalyzer || {};
logAnalyzer.dashboard = logAnalyzer.dashboard || {};
logAnalyzer.dashboard.platformAdministration = logAnalyzer.dashboard.platformAdministration || {};

/* Function definition */

(function($){

	logAnalyzer.dashboard.platformAdministration.manageCollector = function()
	{
		/* Update navigation header */

		logAnalyzer.dashboard.loadNavigationHeader('Platform administration', 'Manage collectors');

		/* Create callback functions */

		var addAnswerToRequestViewer = function(requestAnswer)
		{
			createCollectorForm.form('setPendingState', false);

			manageCollectorRequestViewer
				.requestViewer('addRequest', requestAnswer)
				.requestViewer('update');

			collectorTableViewer.tableViewer('updateData');

			deleteCollectorForm.form('updateData');
		};

		var addErrorNotificationToRequestViewer = function()
		{
			createCollectorForm.form('setPendingState', false);
			deleteCollectorForm.form('setPendingState', false);

			manageCollectorRequestViewer
				.requestViewer('addRequest', {resultCode: -1, message: 'An error occurred'})
				.requestViewer('update');
		};

		var createCollectorAction = function(formValues)
		{
			createCollectorForm.form('setPendingState', true);
			manageCollectorRequestViewer.requestViewer('setPendingState', true);

			var postData = {};

			if(formValues.collectorHumanActivation) postData.collectorHuman = formValues.collectorHuman;
			if(formValues.IPActivation) postData.IP = formValues.IP;
			if(formValues.portActivation) postData.port = formValues.port;

			logAnalyzer.toolbox.LogAnalyzerAPICaller.callAPI({
				baseURL: baseURL,
				controller: 'platformAdministration',
				method: 'createCollector',
				postData: postData,
				successCallback: addAnswerToRequestViewer,
				errorCallback: addErrorNotificationToRequestViewer
			});
		};

		var deleteCollectorAction = function(formValues)
		{
			deleteCollectorFormModule.module('setPendingState', true);
			manageCollectorRequestViewerModule.module('setPendingState', true);

			var postData = {};

			if(formValues.collectorIdActivation) postData.collectorId = formValues.collectorId;

			logAnalyzer.toolbox.LogAnalyzerAPICaller.callAPI({
				baseURL: baseURL,
				controller: 'platformAdministration',
				method: 'deleteCollector',
				postData: postData,
				successCallback: addAnswerToRequestViewer,
				errorCallback: addErrorNotificationToRequestViewer
			});
		};

		/* Create modules */

		var contentContainer = logAnalyzer.dashboard.getContentContainer();

		var collectorTableViewerModule = contentContainer.addModule({id: 'collectorTableViewer', class: 'noPadding'});
		var createCollectorFormModule = contentContainer.addModule({id: 'createCollectorForm'});
		var deleteCollectorFormModule = contentContainer.addModule({id: 'deleteCollectorForm'});
		var manageCollectorRequestViewerModule = contentContainer.addModule({id: 'manageCollectorRequestViewer', class: 'noPadding'});

		/* Create plugins */

		var collectorTableViewer = collectorTableViewerModule.module('addPlugin', 'tableViewer', {
			dataURL: logAnalyzer.toolbox.LogAnalyzerAPICaller.getAPIURL({
				baseURL: baseURL,
				controller: 'platformAdministration',
				method: 'getCollector'
			}),
			dataTransformFunction: function(requestAnswer){
				return (requestAnswer.resultCode === 1) ? requestAnswer.info.collectors : false;
			},
			columns: [
				//{name: 'Collector ID', key: 'collectorId', width: '100px'},
				{name: 'Name', key: 'collectorHuman', width: '200px'},
				{name: 'IP', key: 'IP'},
				{name: 'Port', key: 'port'}
			],
			showHeader: true,
			showLineNumbers: false
		});

		var createCollectorForm = createCollectorFormModule.module('addPlugin', 'form', {
			confirmationRequired: true,
			fields: [
				{
					name: 'Collector',
					id: 'collectorHuman',
					help: 'Collector name',
					activation: true, type:
					'text', value: 'collector'
				},
				{
					name: 'IP',
					id: 'IP',
					help: 'IP of the collector',
					activation: true,
					type: 'text',
					value: '0.0.0.0'},
				{
					name: 'Port',
					id: 'port',
					help: 'Port to use to communicate with the collector',
					activation: true,
					type: 'number',
					value: 80,
					min: 0
				}
			],
			buttons: [
				{
					name: 'Create',
					id: 'createCollector',
					callback: createCollectorAction
				}
			]
		});

		var deleteCollectorForm = deleteCollectorFormModule.module('addPlugin', 'form', {
			confirmationRequired: true,
			fields: [
				{
					name: 'Collector',
					id: 'collectorId',
					help: 'Collector to delete',
					activation: true,
					type: 'select',
					separator: true,
					choicesURL: logAnalyzer.toolbox.LogAnalyzerAPICaller.getAPIURL({
						baseURL: baseURL,
						controller: 'platformAdministration',
						method: 'getCollector'
					}),
					choicesTransformFunction: function(requestAnswer){
						return (requestAnswer.resultCode === 1) ? requestAnswer.info.collectors : false;
					},
					nameKey: 'collectorHuman',
					valueKey: 'collectorId'
				}
			],
			buttons: [
				{
					name: 'Delete',
					id: 'deleteCollector',
					callback: deleteCollectorAction
				}
			]
		});

		var manageCollectorRequestViewer = manageCollectorRequestViewerModule.module('addPlugin', 'requestViewer', {});
	};

})(jQuery);