/* Namespaces */

var logAnalyzer = logAnalyzer || {};
logAnalyzer.dashboard = logAnalyzer.dashboard || {};
logAnalyzer.dashboard.projectConfiguration = logAnalyzer.dashboard.projectConfiguration || {};

/* Function definition */

(function($){

	logAnalyzer.dashboard.projectConfiguration.manageProject = function()
	{
		/* Update navigation header */

		logAnalyzer.dashboard.loadNavigationHeader('Project configuration', 'Manage project');

		/* Create callback functions */

		var form = function(requestAnswer)
		{
			if(requestAnswer.resultCode === 1)
			{
				/* Process constants */

				var constants = {};

				for(var i = 0; i < requestAnswer.info.constants.length; i++)
					constants[requestAnswer.info.constants[i].name] = requestAnswer.info.constants[i].value;

				/* Create form */

				configureProjectForm = configureProjectFormModule.module('addPlugin', 'form', {
					confirmationRequired: true,
					fields: [
						{
							name: 'Debug Mode',
							id: 'debugMode',
							help: 'Set debug mode',
							activation: null,
							type: 'radio',
							choices: [
								{name: 'Yes', value: 'true', selected: (constants.debugMode === true) ? true : false},
								{name: 'No', value: 'false', selected: (constants.debugMode === false) ? true : false}
							]
						},
						{
							name: 'Max Log Return',
							id: 'maxLogReturn',
							help: 'Set log returning limit',
							activation: null,
							type: 'number',
							min: 1,
							value: constants.maxLogReturn
						},
						{
							name: 'Log Retention',
							id: 'retentionLog',
							help: 'Set Log retention (day)',
							activation: null,
							type: 'number',
							min: 1,
							value: constants.retentionLog
						},
						{
							name: 'LiveGraph Aggregation Time',
							id: 'aggregationTimeLiveGraph',
							help: 'Set LiveGraph aggregation time (min)',
							warning: 'Make sure to set the same value for your cron task',
							activation: null,
							type: 'number',
							min: 1,
							value: constants.aggregationTimeLiveGraph
						},
						{
							name: 'LiveGraph Offset Time',
							id: 'offsetTimeLiveGraph',
							help: 'Set LiveGraph offset time (min)',
							activation: null,
							type: 'number',
							min: 1,
							value: constants.offsetTimeLiveGraph
						},
						{
							name: 'LiveGraph Retention',
							id: 'retentionLiveGraph',
							help: 'Set LiveGraph retention (day)',
							activation: null,
							type: 'number',
							min: 1,
							value: constants.retentionLiveGraph
						},
						{
							name: 'Collector Connexion TimeOut',
							id: 'collectorConnexionTimeOut',
							help: 'Set Collector connexion timeout (sec)',
							activation: null,
							type: 'number',
							min: 1,
							value: constants.collectorConnexionTimeOut
						}
					],
				buttons: [
					{
						name: 'Configure',
						id: 'configureProject',
						callback: configureProjectAction
					}
				]
				});
			}
		};

		var addAnswerToRequestViewer = function(requestAnswer)
		{
			configureProjectForm.form('setPendingState', false);

			manageProjectRequestsViewer
				.requestViewer('addRequest', requestAnswer)
				.requestViewer('update')
				.requestViewer('setPendingState', false);
		};

		var addErrorNotificationToRequestViewer = function()
		{
			configureProjectForm.form('setPendingState', false);

			manageProjectRequestsViewer
				.requestViewer('addRequest', {resultCode: -1, message: 'An error occurred'})
				.requestViewer('update')
				.requestViewer('setPendingState', false);
		};

		var configureProjectAction = function(formValues)
		{
			configureProjectFormModule.module('setPendingState', true);
			manageProjectRequestsViewerModule.module('setPendingState', true);

			var postData = [];

			if(formValues.debugModeActivation) postData.push({name: 'debugMode', value: formValues.debugMode});
			if(formValues.maxLogReturnActivation) postData.push({name: 'maxLogReturn', value: formValues.maxLogReturn});
			if(formValues.retentionLogActivation) postData.push({name: 'retentionLog', value: formValues.retentionLog});
			if(formValues.aggregationTimeLiveGraphActivation) postData.push({name: 'aggregationTimeLiveGraph', value: formValues.aggregationTimeLiveGraph});
			if(formValues.offsetTimeLiveGraphActivation) postData.push({name: 'offsetTimeLiveGraph', value: formValues.offsetTimeLiveGraph});
			if(formValues.retentionLiveGraphActivation) postData.push({name: 'retentionLiveGraph', value: formValues.retentionLiveGraph});
			if(formValues.collectorConnexionTimeOutActivation) postData.push({name: 'collectorConnexionTimeOut', value: formValues.collectorConnexionTimeOut});

			logAnalyzer.toolbox.LogAnalyzerAPICaller.callAPI({
				baseURL: baseURL,
				controller: 'projectConfiguration',
				method: 'updateConstant',
				postData: postData,
				successCallback: addAnswerToRequestViewer,
				errorCallback: addErrorNotificationToRequestViewer
			});
		};

		/* Creates modules */

		var contentContainer = logAnalyzer.dashboard.getContentContainer();

		var configureProjectFormModule = contentContainer.addModule({id: 'configureProjectForm'});
		var manageProjectRequestsViewerModule = contentContainer.addModule({id: 'manageProjectRequestsViewer', class: 'noPadding'});

		/* Create plugins */

		var configureProjectForm;

		logAnalyzer.toolbox.LogAnalyzerAPICaller.callAPI({
			baseURL: baseURL,
			controller: 'projectConfiguration',
			method: 'getConstant',
			successCallback: form
		});

		var manageProjectRequestsViewer = manageProjectRequestsViewerModule.module('addPlugin', 'requestViewer', {});
	};

})(jQuery);