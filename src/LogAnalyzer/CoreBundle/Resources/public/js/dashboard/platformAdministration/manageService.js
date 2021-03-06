/* Namespaces */

var logAnalyzer = logAnalyzer || {};
logAnalyzer.dashboard = logAnalyzer.dashboard || {};
logAnalyzer.dashboard.platformAdministration = logAnalyzer.dashboard.platformAdministration || {};

/* Function definition */

(function($){

	logAnalyzer.dashboard.platformAdministration.manageService = function()
	{
		/* Update navigation header */

		logAnalyzer.dashboard.loadNavigationHeader('Platform administration', 'Manage services');

		/* Create callback functions */

		var addAnswerToRequestViewer = function(requestAnswer)
		{
			manageServiceRequestViewer
				.requestViewer('addRequest', requestAnswer)
				.requestViewer('update');

			serviceTableViewer.tableViewer('updateData');
		};

		var addErrorNotificationToRequestViewer = function()
		{
			manageServiceRequestViewer
				.requestViewer('addRequest', {resultCode: -1, message: 'An error occurred'})
				.requestViewer('update');
		};

		/* Create modules */

		var contentContainer = logAnalyzer.dashboard.getContentContainer();

		var serviceTableViewerModule = contentContainer.addModule({id: 'serviceTableViewer', class: 'noPadding'});
		var manageServiceRequestViewerModule = contentContainer.addModule({id: 'manageServiceRequestViewer', class: 'noPadding'});

		/* Create plugins */

		var serviceTableViewer = serviceTableViewerModule.module('addPlugin', 'tableViewer', {
			dataURL: logAnalyzer.toolbox.LogAnalyzerAPICaller.getAPIURL({
				baseURL: baseURL,
				controller: 'platformAdministration',
				method: 'getService'
			}),
			dataTransformFunction: function(requestAnswer){
				return (requestAnswer.resultCode === 1) ? requestAnswer.info.services : false;
			},
			columns: [
				{name: 'Name', key: 'serviceHuman'}
			],
			showHeader: true,
			showLineNumbers: false
		});

		var manageServiceRequestViewer = manageServiceRequestViewerModule.module('addPlugin', 'requestViewer', {});
	};

})(jQuery);