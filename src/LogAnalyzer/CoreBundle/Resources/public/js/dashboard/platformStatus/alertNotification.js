/* Namespaces */

var logAnalyzer = logAnalyzer || {};
logAnalyzer.dashboard = logAnalyzer.dashboard || {};
logAnalyzer.dashboard.platformStatus = logAnalyzer.dashboard.platformStatus || {};

/* Function definition */

(function($){

	logAnalyzer.dashboard.platformStatus.alertNotification = function()
	{
		/* Update navigation header */

		logAnalyzer.dashboard.loadNavigationHeader('Platform status', 'Alert notification');

		/* Create callback functions */

		var addAnswerToRequestViewer = function(requestAnswer)
		{
			activeAlertNotificationTableViewer.tableViewer('setPendingState', false);
			unActiveAlertNotificationTableViewer.tableViewer('setPendingState', false);

			manageAlertNotificationRequestViewer
				.requestViewer('addRequest', requestAnswer)
				.requestViewer('update');

			updateAlertNotificationTableViewers();
		};

		var addErrorNotificationToRequestViewer = function()
		{
			activeAlertNotificationTableViewer.tableViewer('setPendingState', false);
			unActiveAlertNotificationTableViewer.tableViewer('setPendingState', false);

			manageAlertNotificationRequestViewer
				.requestViewer('addRequest', {resultCode: -1, message: 'An error occurred'})
				.requestViewer('update');
		};

		var updateAlertNotificationTableViewers = function()
		{
			activeAlertNotificationTableViewer.tableViewer('updateData');
			unActiveAlertNotificationTableViewer.tableViewer('updateData');
		};

		var clearAlertNotificationAction = function(formValues)
		{
			activeAlertNotificationTableViewer.tableViewer('setPendingState', true);
			unActiveAlertNotificationTableViewer.tableViewer('setPendingState', true);
			manageAlertNotificationRequestViewer.requestViewer('setPendingState', true);

			var postData = {};

			if(formValues.clearDateActivation) postData.clearDate = formValues.clearDate;

			/* Request */

			logAnalyzer.toolbox.LogAnalyzerAPICaller.callAPI({
				baseURL: baseURL,
				controller: 'platformStatus',
				method: 'clearAlertNotification',
				postData: postData,
				successCallback: addAnswerToRequestViewer,
				errorCallback: addErrorNotificationToRequestViewer
			});
		};

		/* Create module */

		var contentContainer = logAnalyzer.dashboard.getContentContainer();

		var activeAlertNotificationTableViewerModule = contentContainer.addModule({id: 'activeAlertNotificationTableViewer', class: 'noPadding'});
		var unActiveAlertNotificationTableViewerModule = contentContainer.addModule({id: 'unActiveAlertNotificationTableViewer', class: 'noPadding'});
		var clearAlertNotificationFormModule = contentContainer.addModule({id: 'clearAlertNotificationForm'});
		var manageAlertNotificationRequestViewerModule = contentContainer.addModule({id: 'manageAlertNotificationRequestViewer', class: 'noPadding'});

		/* Create plugins */

		var activeAlertNotificationTableViewer = activeAlertNotificationTableViewerModule.module('addPlugin', 'tableViewer', {
			dataURL: logAnalyzer.toolbox.LogAnalyzerAPICaller.getAPIURL({
				baseURL: baseURL,
				controller: 'platformStatus',
				method: 'getAlertNotification'
			}),
			postData: {
				active: true
			},
			dataTransformFunction: function(requestAnswer){
				return (requestAnswer.resultCode === 1) ? requestAnswer.info.alertNotifications : false;
			},
			columns: [
				//{name: 'AlertNotification ID', key: 'alertNotificationId', width: '100px'},
				{name: 'Alert', key: 'alertHuman', width: '200px'},
				{name: 'StartTime', key: 'startTime', width: '200px'},
				{name: 'EndTime', key: 'endTime', width: '200px'}
			],
			showHeader: true,
			showLineNumbers: false,
			lineClassDeterminationFunction: function(line){
				return (line.active === 'true') ? 'red' : '';
			}
		});

		var unActiveAlertNotificationTableViewer = unActiveAlertNotificationTableViewerModule.module('addPlugin', 'tableViewer', {
			dataURL: logAnalyzer.toolbox.LogAnalyzerAPICaller.getAPIURL({
				baseURL: baseURL,
				controller: 'platformStatus',
				method: 'getAlertNotification'
			}),
			postData: {
				active: false
			},dataTransformFunction: function(requestAnswer){
				return (requestAnswer.resultCode === 1) ? requestAnswer.info.alertNotifications : false;
			},
			columns: [
				//{name: 'AlertNotification ID', key: 'alertNotificationId', width: '100px'},
				{name: 'Alert', key: 'alertHuman', width: '200px'},
				{name: 'StartTime', key: 'startTime', width: '200px'},
				{name: 'EndTime', key: 'endTime', width: '200px'}
			],
			showHeader: true,
			showLineNumbers: false,
			lineClassDeterminationFunction: function(line){
				return (line.active === 'false') ? 'orange' : '';
			}
		});

		var clearAlertNotificationForm = clearAlertNotificationFormModule.module('addPlugin', 'form', {
			confirmationRequired: true,
			fields: [
				{
					name: 'Clear Date',
					id: 'clearDate',
					help: 'Date for which alert notification will be cleared',
					activation: true,
					type: 'date',
					value: logAnalyzer.toolbox.date.getDateNow()
				}
			],
			buttons: [
				{
					name: 'Clear',
					id: 'clearAlertNotification',
					callback: clearAlertNotificationAction
				}
			]
		});

		var manageAlertNotificationRequestViewer = manageAlertNotificationRequestViewerModule.module('addPlugin', 'requestViewer', {});

		/* Auto update */

		logAnalyzer.dashboard.addPeriodicAction(updateAlertNotificationTableViewers, 60 * 1000);
	};

})(jQuery);