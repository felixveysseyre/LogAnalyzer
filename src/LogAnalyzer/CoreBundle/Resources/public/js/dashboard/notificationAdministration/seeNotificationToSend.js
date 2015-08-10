/* Namespaces */

var logAnalyzer = logAnalyzer || {};
logAnalyzer.dashboard = logAnalyzer.dashboard || {};
logAnalyzer.dashboard.notificationAdministration = logAnalyzer.dashboard.notificationAdministration || {};

/* Function definition */

(function($){

	logAnalyzer.dashboard.notificationAdministration.seeNotificationToSend = function()
	{
		/* Update navigation header */

		logAnalyzer.dashboard.loadNavigationHeader('Notification administration', 'See notificationToSend');

		/* Create callback functions */

		var addAnswerToRequestViewer = function(requestAnswer)
		{
			manageNotificationToSendRequestViewer
				.requestViewer('addRequest', requestAnswer)
				.requestViewer('update');

			notificationToSendTableViewer.tableViewer('updateData');
		};

		var addErrorNotificationToRequestViewer = function()
		{
			manageNotificationToSendRequestViewer
				.requestViewer('addRequest', {resultCode: -1, message: 'An error occurred'})
				.requestViewer('update');
		};
		
		/* Create modules */

		var contentContainer = logAnalyzer.dashboard.getContentContainer();

		var notificationToSendTableViewerModule = contentContainer.addModule({id: 'notificationToSendTableViewer', class: 'noPadding'});
		var manageNotificationToSendRequestViewerModule = contentContainer.addModule({id: 'manageNotificationToSendRequestViewer', class: 'noPadding'});

		/* Create plugins */

		var notificationToSendTableViewer = notificationToSendTableViewerModule.module('addPlugin', 'tableViewer', {
			dataURL: logAnalyzer.toolbox.LogAnalyzerAPICaller.getAPIURL({
				baseURL: baseURL,
				controller: 'notificationAdministration',
				method: 'getNotificationToSend'
			}),
			dataTransformFunction: function(requestAnswer){
				return (requestAnswer.resultCode === 1) ? requestAnswer.info.notificationToSends : false;
			},
			columns: [
				//{name: 'NotificationToSend ID', key: 'notificationToSendId', width: '100px'},
				{name: 'Type', key: 'type', width: '200px'},
				{name: 'Recipient', key: 'recipient'},
				{name: 'Content', key: 'content'}
			],
			showHeader: true,
			showLineNumbers: false
		});

		var manageNotificationToSendRequestViewer = manageNotificationToSendRequestViewerModule.module('addPlugin', 'requestViewer', {});
	};

})(jQuery);