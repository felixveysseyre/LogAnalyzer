/* Namespaces */

var logAnalyzer = logAnalyzer || {};
logAnalyzer.dashboard = logAnalyzer.dashboard || {};
logAnalyzer.dashboard.databaseAdministration = logAnalyzer.dashboard.databaseAdministration || {};

/* Function definition */

(function($){

	logAnalyzer.dashboard.databaseAdministration.manageRetentionRule = function()
	{
		/* Update navigation header */

		logAnalyzer.dashboard.loadNavigationHeader('Database administration', 'Manage retention rules');

		/* Create callback functions */

		var addAnswerToRequestViewer = function(requestAnswer)
		{
			createRetentionRuleForm.form('setPendingState', false);

			manageRetentionRuleRequestViewer
				.requestViewer('addRequest', requestAnswer)
				.requestViewer('update');

			userTableViewer.tableViewer('updateData');

			deleteRetentionRuleForm.form('updateData');
		};

		var addErrorNotificationToRequestViewer = function()
		{
			createRetentionRuleForm.form('setPendingState', false);
			deleteRetentionRuleForm.form('setPendingState', false);

			manageRetentionRuleRequestViewer
				.requestViewer('addRequest', {resultCode: -1, message: 'An error occurred'})
				.requestViewer('update');
		};

		var createRetentionRuleAction = function(formValues)
		{
			createRetentionRuleForm.form('setPendingState', true);
			manageRetentionRuleRequestViewer.requestViewer('setPendingState', true);

			var postData = {};

			if(formValues.serviceActivation) postData.service = formValues.service;
			if(formValues.retentionActivation) postData.retention = formValues.retention;

			logAnalyzer.toolbox.LogAnalyzerAPICaller.callAPI({
				baseURL: baseURL,
				controller: 'databaseAdministration',
				method: 'createRetentionRule',
				postData: postData,
				successCallback: addAnswerToRequestViewer,
				errorCallback: addErrorNotificationToRequestViewer
			});
		};

		var deleteRetentionRuleAction = function(formValues)
		{
			deleteRetentionRuleFormModule.module('setPendingState', true);
			manageRetentionRuleRequestViewerModule.module('setPendingState', true);

			var postData = {};

			if(formValues.retentionRuleIdActivation) postData.retentionRuleId = formValues.retentionRuleId;

			logAnalyzer.toolbox.LogAnalyzerAPICaller.callAPI({
				baseURL: baseURL,
				controller: 'databaseAdministration',
				method: 'deleteRetentionRule',
				postData: postData,
				successCallback: addAnswerToRequestViewer,
				errorCallback: addErrorNotificationToRequestViewer
			});
		};

		/* Create modules */

		var contentContainer = logAnalyzer.dashboard.getContentContainer();

		var userTableViewerModule = contentContainer.addModule({id: 'userTableViewer', class: 'noPadding'});
		var createRetentionRuleFormModule = contentContainer.addModule({id: 'createRetentionRuleForm'});
		var deleteRetentionRuleFormModule = contentContainer.addModule({id: 'deleteRetentionRuleForm'});
		var manageRetentionRuleRequestViewerModule = contentContainer.addModule({id: 'manageRetentionRuleRequestViewer', class: 'noPadding'});

		/* Create plugins */

		var userTableViewer = userTableViewerModule.module('addPlugin', 'tableViewer', {
			dataURL: logAnalyzer.toolbox.LogAnalyzerAPICaller.getAPIURL({
				baseURL: baseURL,
				controller: 'databaseAdministration',
				method: 'getRetentionRule'
			}),
			dataTransformFunction: function(requestAnswer){
				return (requestAnswer.resultCode === 1) ? requestAnswer.info.retentionRules : false;
			},
			columns: [
				//{name: 'RetentionRule ID', key: 'retentionRuleId', width: '100px'},
				{name: 'Service', key: 'service', width: '200px'},
				{name: 'Retention', key: 'retention', width: '200px'}
			],
			showHeader: true,
			showLineNumbers: false
		});

		var createRetentionRuleForm = createRetentionRuleFormModule.module('addPlugin', 'form', {
			confirmationRequired: true,
			fields: [
				{
					name: 'Service',
					id: 'service',
					help: 'Service for retention rule',
					activation: true,
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
					name: 'Retention',
					id: 'retention',
					help: 'Retention (in days) for retention rule',
					activation: true,
					type: 'number',
					min: '1',
					value: '7'
				}
			],
			buttons: [
				{
					name: 'Create',
					id: 'createRetentionRule',
					callback: createRetentionRuleAction
				}
			]
		});

		var deleteRetentionRuleForm = deleteRetentionRuleFormModule.module('addPlugin', 'form', {
			confirmationRequired: true,
			fields: [
				{
					name: 'Retention rule',
					id: 'retentionRuleId',
					help: 'Retention rule to delete',
					activation: true,
					type: 'select',
					separator: true,
					choicesURL: logAnalyzer.toolbox.LogAnalyzerAPICaller.getAPIURL({
						baseURL: baseURL,
						controller: 'databaseAdministration',
						method: 'getRetentionRule'
					}),
					postData: {
						fullNamed: true
					},
					choicesTransformFunction: function(requestAnswer){
						return (requestAnswer.resultCode === 1) ? requestAnswer.info.retentionRules : false;
					},
					nameKey: 'service',
					valueKey: 'retentionRuleId'
				}
			],
			buttons: [
				{
					name: 'Delete',
					id: 'deleteRetentionRule',
					callback: deleteRetentionRuleAction
				}
			]
		});

		var manageRetentionRuleRequestViewer = manageRetentionRuleRequestViewerModule.module('addPlugin', 'requestViewer', {});
	};

})(jQuery);