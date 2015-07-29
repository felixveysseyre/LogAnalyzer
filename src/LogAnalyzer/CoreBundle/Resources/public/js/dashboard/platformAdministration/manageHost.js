/* Namespaces */

var logAnalyzer = logAnalyzer || {};
logAnalyzer.dashboard = logAnalyzer.dashboard || {};
logAnalyzer.dashboard.platformAdministration = logAnalyzer.dashboard.platformAdministration || {};

/* Function definition */

(function($){

	logAnalyzer.dashboard.platformAdministration.manageHost = function()
	{
		/* Update navigation header */

		logAnalyzer.dashboard.loadNavigationHeader('Platform administration', 'Manage hosts');

		/* Create callback functions */

		var addAnswerToRequestViewer = function(requestAnswer)
		{
			manageHostRequestViewer
				.requestViewer('addRequest', requestAnswer)
				.requestViewer('update');

			hostTableViewer.tableViewer('updateData');
		};

		var addErrorNotificationToRequestViewer = function()
		{
			manageHostRequestViewer
				.requestViewer('addRequest', {resultCode: -1, message: 'An error occurred'})
				.requestViewer('update');
		};

		/* Create modules */

		var contentContainer = logAnalyzer.dashboard.getContentContainer();

		var hostTableViewerModule = contentContainer.addModule({id: 'hostTableViewer', class: 'noPadding'});
		var manageHostRequestViewerModule = contentContainer.addModule({id: 'manageHostRequestViewer', class: 'noPadding'});

		/* Create plugins */

		var hostTableViewer = hostTableViewerModule.module('addPlugin', 'tableViewer', {
			dataURL: logAnalyzer.toolbox.LogAnalyzerAPICaller.getAPIURL({
				baseURL: baseURL,
				controller: 'platformAdministration',
				method: 'getHost'
			}),
			dataTransformFunction: function(requestAnswer){
				return (requestAnswer.resultCode === 1) ? requestAnswer.info.hosts : false;
			},
			columns: [
				{name: 'Name', key: 'hostHuman'}
			],
			showHeader: true,
			showLineNumbers: false
		});

		var manageHostRequestViewer = manageHostRequestViewerModule.module('addPlugin', 'requestViewer', {});
	};

})(jQuery);