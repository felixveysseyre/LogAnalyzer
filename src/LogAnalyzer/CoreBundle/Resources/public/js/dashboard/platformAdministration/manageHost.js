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
			createHostForm.form('setPendingState', false);

			manageHostRequestViewer
				.requestViewer('addRequest', requestAnswer)
				.requestViewer('update');

			hostTableViewer.tableViewer('updateData');

			deleteHostForm.form('updateData');
		};

		var addErrorNotificationToRequestViewer = function()
		{
			createHostForm.form('setPendingState', false);

			manageHostRequestViewer
				.requestViewer('addRequest', {resultCode: -1, message: 'An error occurred'})
				.requestViewer('update');
		};

		var createHostAction = function(formValues)
		{
			createHostForm.form('setPendingState', true);
			manageHostRequestViewer.requestViewer('setPendingState', true);

			var postData = {};

			if(formValues.hostHumanActivation) postData.hostHuman = formValues.hostHuman;

			logAnalyzer.toolbox.LogAnalyzerAPICaller.callAPI({
				baseURL: baseURL,
				controller: 'platformAdministration',
				method: 'createHost',
				postData: postData,
				successCallback: addAnswerToRequestViewer,
				errorCallback: addErrorNotificationToRequestViewer
			});
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