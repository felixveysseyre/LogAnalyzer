/* Namespaces */

var logAnalyzer = logAnalyzer || {};
logAnalyzer.dashboard = logAnalyzer.dashboard || {};
logAnalyzer.dashboard.analysisAdministration = logAnalyzer.dashboard.analysisAdministration || {};

/* Function definition */

(function($){

	logAnalyzer.dashboard.analysisAdministration.manageLiveGraph = function()
	{
		/* Update navigation header */

		logAnalyzer.dashboard.loadNavigationHeader('Analysis administration', 'Manage liveGraphs');

		/* Create callback functions */

		var addAnswerToRequestViewer = function(requestAnswer)
		{
			createLiveGraphForm.form('setPendingState', false);

			manageLiveGraphRequestViewer
				.requestViewer('addRequest', requestAnswer)
				.requestViewer('update');

			liveGraphTableViewer.tableViewer('updateData');

			deleteLiveGraphForm.form('updateData');
		};

		var addErrorNotificationToRequestViewer = function()
		{
			createLiveGraphForm.form('setPendingState', false);
			deleteLiveGraphForm.form('setPendingState', false);

			manageLiveGraphRequestViewer
				.requestViewer('addRequest', {resultCode: -1, message: 'An error occurred'})
				.requestViewer('update');
		};

		var createLiveGraphAction = function(formValues)
		{
			createLiveGraphForm.form('setPendingState', true);
			manageLiveGraphRequestViewer.requestViewer('setPendingState', true);

			var postData = {
				filter: {}
			};

			/** Name **/

			if(formValues.liveGraphHumanActivation) postData.liveGraphHuman = formValues.liveGraphHuman;

			/** Filter **/

			if(formValues.hostActivation) postData.filter.host = formValues.host;
			if(formValues.hostLikeActivation) postData.filter.hostLike = formValues.hostLike;
			if(formValues.serviceActivation) postData.filter.service = formValues.service;
			if(formValues.syslogTagActivation) postData.filter.syslogTag = formValues.syslogTag;
			if(formValues.messageActivation) postData.filter.message = formValues.message;

			logAnalyzer.toolbox.LogAnalyzerAPICaller.callAPI({
				baseURL: baseURL,
				controller: 'analysisAdministration',
				method: 'createLiveGraph',
				postData: postData,
				successCallback: addAnswerToRequestViewer,
				errorCallback: addErrorNotificationToRequestViewer
			});
		};

		var deleteLiveGraphAction = function(formValues)
		{
			deleteLiveGraphFormModule.module('setPendingState', true);
			manageLiveGraphRequestViewerModule.module('setPendingState', true);

			var postData = {};

			if(formValues.liveGraphIdActivation) postData.liveGraphId = formValues.liveGraphId;
			
			logAnalyzer.toolbox.LogAnalyzerAPICaller.callAPI({
				baseURL: baseURL,
				controller: 'analysisAdministration',
				method: 'deleteLiveGraph',
				postData: postData,
				successCallback: addAnswerToRequestViewer,
				errorCallback: addErrorNotificationToRequestViewer
			});
		};

		/* Create modules */

		var contentContainer = logAnalyzer.dashboard.getContentContainer();

		var liveGraphTableViewerModule = contentContainer.addModule({id: 'liveGraphTableViewer', class: 'noPadding'});
		var createLiveGraphFormModule = contentContainer.addModule({id: 'createLiveGraphForm'});
		var deleteLiveGraphFormModule = contentContainer.addModule({id: 'deleteLiveGraphForm'});
		var manageLiveGraphRequestViewerModule = contentContainer.addModule({id: 'manageLiveGraphRequestViewer', class: 'noPadding'});

		/* Create plugins */

		var liveGraphTableViewer = liveGraphTableViewerModule.module('addPlugin', 'tableViewer', {
			dataURL: logAnalyzer.toolbox.LogAnalyzerAPICaller.getAPIURL({
				baseURL: baseURL,
				controller: 'analysisAdministration',
				method: 'getLiveGraph'
			}),
			dataTransformFunction: function(requestAnswer){
				return (requestAnswer.resultCode === 1) ? requestAnswer.info.liveGraphs : false;
			},
			columns: [
				//{name: 'LiveGraph ID', key: 'liveGraphId', width: '100px'},
				{name: 'Name', key: 'liveGraphHuman', width: '200px'},
				{name: 'Filter', key: 'filter'}
			],
			showHeader: true,
			showLineNumbers: false
		});

		var createLiveGraphForm = createLiveGraphFormModule.module('addPlugin', 'form', {
			confirmationRequired: true,
			fields: [
				{
					name: 'LiveGraph',
					id: 'liveGraphHuman',
					help: 'LiveGraph name',
					activation: true,
					separator: true,
					type: 'text',
					value: 'liveGraph'
				},

				{
					name: 'Host',
					id: 'host',
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
					valueKey: 'hostHuman'
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
					id: 'service',
					help: 'Service which generated the logs',
					activation: null,
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
				}
			],
			buttons: [
				{
					name: 'Create',
					id: 'createLiveGraph',
					callback: createLiveGraphAction
				}
			]
		});

		var deleteLiveGraphForm = deleteLiveGraphFormModule.module('addPlugin', 'form', {
			confirmationRequired: true,
			fields: [
				{
					name: 'LiveGraph',
					id: 'liveGraphId',
					help: 'LiveGraph to delete',
					activation: true,
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
				}
			],
			buttons: [
				{
					name: 'Delete',
					id: 'deleteLiveGraph',
					callback: deleteLiveGraphAction
				}
			]
		});

		var manageLiveGraphRequestViewer = manageLiveGraphRequestViewerModule.module('addPlugin', 'requestViewer', {});
	};

})(jQuery);