/* Namespaces */

var logAnalyzer = logAnalyzer || {};
logAnalyzer.dashboard = logAnalyzer.dashboard || {};
logAnalyzer.dashboard.analysisAdministration = logAnalyzer.dashboard.analysisAdministration || {};

/* Function definition */

(function($){

	logAnalyzer.dashboard.analysisAdministration.manageAlert = function()
	{
		/* Update navigation header */

		logAnalyzer.dashboard.loadNavigationHeader('Analysis administration', 'Manage alerts');

		/* Create callback functions */

		var addAnswerToRequestViewer = function(requestAnswer)
		{
			createAlertForm.form('setPendingState', false);

			manageAlertRequestViewer
				.requestViewer('addRequest', requestAnswer)
				.requestViewer('update');

			alertTableViewer.tableViewer('updateData');

			deleteAlertForm.form('updateData');
		};

		var addErrorNotificationToRequestViewer = function()
		{
			createAlertForm.form('setPendingState', false);
			deleteAlertForm.form('setPendingState', false);

			manageAlertRequestViewer
				.requestViewer('addRequest', {resultCode: -1, message: 'An error occurred'})
				.requestViewer('update');
		};

		var createAlertAction = function(formValues)
		{
			createAlertForm.form('setPendingState', true);
			manageAlertRequestViewer.requestViewer('setPendingState', true);

			var postData = {};

			if(formValues.alertHumanActivation) postData.alertHuman = formValues.alertHuman;

			if(formValues.liveGraphIdActivation) postData.liveGraphId = formValues.liveGraphId;

			if(formValues.comparisonOperatorActivation) postData.comparisonOperator = formValues.comparisonOperator;
			if(formValues.valueActivation) postData.value = formValues.value;
			if(formValues.cycleRaiseActivation) postData.cycleRaise = formValues.cycleRaise;
			if(formValues.cycleUnRaiseActivation) postData.cycleUnRaise = formValues.cycleUnRaise;

			if(formValues.emailActivation) postData.email = formValues.email;
			if(formValues.collectorHumanActivation) postData.collectorHuman = formValues.collectorHuman;
			if(formValues.messageRaiseActivation) postData.messageRaise = formValues.messageRaise;
			if(formValues.messageUnRaiseActivation) postData.messageUnRaise = formValues.messageUnRaise;

			logAnalyzer.toolbox.LogAnalyzerAPICaller.callAPI({
				baseURL: baseURL,
				controller: 'analysisAdministration',
				method: 'createAlert',
				postData: postData,
				successCallback: addAnswerToRequestViewer,
				errorCallback: addErrorNotificationToRequestViewer
			});
		};

		var deleteAlertAction = function(formValues)
		{
			deleteAlertFormModule.module('setPendingState', true);
			manageAlertRequestViewerModule.module('setPendingState', true);

			var postData = {};

			if(formValues.alertIdActivation) postData.alertId = formValues.alertId;
			
			logAnalyzer.toolbox.LogAnalyzerAPICaller.callAPI({
				baseURL: baseURL,
				controller: 'analysisAdministration',
				method: 'deleteAlert',
				postData: postData,
				successCallback: addAnswerToRequestViewer,
				errorCallback: addErrorNotificationToRequestViewer
			});
		};

		/* Create modules */

		var contentContainer = logAnalyzer.dashboard.getContentContainer();

		var alertTableViewerModule = contentContainer.addModule({id: 'alertTableViewer', class: 'noPadding'});
		var createAlertFormModule = contentContainer.addModule({id: 'createAlertForm'});
		var deleteAlertFormModule = contentContainer.addModule({id: 'deleteAlertForm'});
		var manageAlertRequestViewerModule = contentContainer.addModule({id: 'manageAlertRequestViewer', class: 'noPadding'});

		/* Create plugins */

		var alertTableViewer = alertTableViewerModule.module('addPlugin', 'tableViewer', {
			dataURL: logAnalyzer.toolbox.LogAnalyzerAPICaller.getAPIURL({
				baseURL: baseURL,
				controller: 'analysisAdministration',
				method: 'getAlert'
			}),
			dataTransformFunction: function(requestAnswer){
				return (requestAnswer.resultCode === 1) ? requestAnswer.info.alerts : false;
			},
			columns: [
				//{name: 'Alert ID', key: 'alertId', width: '100px'},
				{name: 'Name', key: 'alertHuman', width: '200px'},
				{name: 'LiveGraph', key: 'liveGraphHuman', width: '200px'},
				{name: 'Trigger', key: 'trigger'},
				{name: 'Notification', key: 'notification'}
			],
			showHeader: true,
			showLineNumbers: false
		});

		var createAlertForm = createAlertFormModule.module('addPlugin', 'form', {
			confirmationRequired: true,
			fields: [
				{
					name: 'Alert',
					id: 'alertHuman',
					help: 'Alert name',
					activation: true,
					separator: true,
					type: 'text',
					value: 'alert'
				},

				{
					name: 'LiveGraph',
					id: 'liveGraphId',
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
					valueKey: 'liveGraphId'
				},

				{
					name: 'Operator',
					id: 'comparisonOperator',
					help: 'Comparison operator to use in order to know if the alert is positive or negative',
					activation: true,
					type: 'select',
					choices: [
						{name: '<=', value: '<='},
						{name: '==', value: '=='},
						{name: '>=', value: '>=', selected: true},
						{name: '!=', value: '!='}
					]
				},

				{
					name: 'Value',
					id: 'value',
					help: 'Value to use in order to know if the alert is positive or negative',
					activation: true,
					type: 'number',
					value: 100,
					min: 0
				},

				{
					name: 'Cycle Raise',
					id: 'cycleRaise',
					help: 'Number of consecutive time cycles during which condition has to be true to know if the alert has to be raised or not',
					activation: true,
					type: 'number',
					value: 1,
					min: 1
				},
				{
					name: 'Cycle UnRaise',
					id: 'cycleUnRaise',
					help: 'Number of consecutive time cycles during which condition has to be false to know if the alert has to be un-raised or not',
					activation: true,
					separator: true,
					type: 'number',
					value: 1,
					min: 1
				},

				{
					name: 'Email',
					id: 'email',
					help: 'Email address to notify',
					activation: null,
					type: 'text',
					value: 'email'
				},

				{
					name: 'Collector',
					id: 'collectorHuman',
					help: 'Collector to notify',
					activation: null,
					type: 'select',
					choicesURL: logAnalyzer.toolbox.LogAnalyzerAPICaller.getAPIURL({
						baseURL: baseURL,
						controller: 'platformAdministration',
						method: 'getCollector'
					}),
					choicesTransformFunction: function(requestAnswer){
						return (requestAnswer.resultCode === 1) ? requestAnswer.info.collectors : false;
					},
					nameKey: 'collectorHuman',
					valueKey: 'collectorHuman'
				},

				{
					name: 'Message Raise',
					id: 'messageRaise',
					help: 'Message to use when raising the alert, you can use {dateTime}, {name}',
					activation: null,
					type: 'textarea',
					value: 'message'
				},
				{
					name: 'Message UnRaise',
					id: 'messageUnRaise',
					help: 'Message to use when un-raising the alert, you can use {dateTime}, {name}',
					activation: null,
					type: 'textarea',
					value: 'message'
				}

			],
			buttons: [
				{
					name: 'Create',
					id: 'createAlert',
					callback: createAlertAction
				}
			]
		});

		var deleteAlertForm = deleteAlertFormModule.module('addPlugin', 'form', {
			confirmationRequired: true,
			fields: [
				{
					name: 'Alert',
					id: 'alertId',
					help: 'Alert to delete',
					activation: true,
					type: 'select',
					separator: true,
					choicesURL: logAnalyzer.toolbox.LogAnalyzerAPICaller.getAPIURL({
						baseURL: baseURL,
						controller: 'analysisAdministration',
						method: 'getAlert'
					}),
					choicesTransformFunction: function(requestAnswer){
						return (requestAnswer.resultCode === 1) ? requestAnswer.info.alerts : false;
					},
					nameKey: 'alertHuman',
					valueKey: 'alertId'
				}
			],
			buttons: [
				{
					name: 'Delete',
					id: 'deleteAlert',
					callback: deleteAlertAction
				}
			]
		});

		var manageAlertRequestViewer = manageAlertRequestViewerModule.module('addPlugin', 'requestViewer', {});
	};

})(jQuery);