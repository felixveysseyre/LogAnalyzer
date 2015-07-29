/* Namespaces */

var logAnalyzer = logAnalyzer || {};
logAnalyzer.dashboard = logAnalyzer.dashboard || {};
logAnalyzer.dashboard.analysisAdministration = logAnalyzer.dashboard.analysisAdministration || {};

/* Function definition */

(function($){

	logAnalyzer.dashboard.analysisAdministration.manageParser = function()
	{
		/* Update navigation header */

		logAnalyzer.dashboard.loadNavigationHeader('Platform administration', 'Manage parsers');

		/* Create callback functions */

		var addAnswerToRequestViewer = function(requestAnswer)
		{
			createParserForm.form('setPendingState', false);

			manageParserRequestViewer
				.requestViewer('addRequest', requestAnswer)
				.requestViewer('update');

			parserTableViewer.tableViewer('updateData');

			deleteParserForm.form('updateData');
		};

		var addErrorNotificationToRequestViewer = function()
		{
			createParserForm.form('setPendingState', false);
			deleteParserForm.form('setPendingState', false);

			manageParserRequestViewer
				.requestViewer('addRequest', {resultCode: -1, message: 'An error occurred'})
				.requestViewer('update');
		};

		var createParserAction = function(formValues)
		{
			createParserForm.form('setPendingState', true);
			manageParserRequestViewer.requestViewer('setPendingState', true);

			var postData = {};

			if(formValues.parserHumanActivation) postData.parserHuman = formValues.parserHuman;
			if(formValues.separatorActivation) postData.separator = formValues.separator;
			if(formValues.partActivation) postData.part = formValues.part;

			logAnalyzer.toolbox.LogAnalyzerAPICaller.callAPI({
				baseURL: baseURL,
				controller: 'analysisAdministration',
				method: 'createParser',
				postData: postData,
				successCallback: addAnswerToRequestViewer,
				errorCallback: addErrorNotificationToRequestViewer
			});
		};

		var deleteParserAction = function(formValues)
		{
			deleteParserFormModule.module('setPendingState', true);
			manageParserRequestViewerModule.module('setPendingState', true);

			var postData = {};

			if(formValues.parserIdActivation) postData.parserId = formValues.parserId;

			logAnalyzer.toolbox.LogAnalyzerAPICaller.callAPI({
				baseURL: baseURL,
				controller: 'analysisAdministration',
				method: 'deleteParser',
				postData: postData,
				successCallback: addAnswerToRequestViewer,
				errorCallback: addErrorNotificationToRequestViewer
			});
		};

		/* Create modules */

		var contentContainer = logAnalyzer.dashboard.getContentContainer();

		var parserTableViewerModule = contentContainer.addModule({id: 'parserTableViewer', class: 'noPadding'});
		var createParserFormModule = contentContainer.addModule({id: 'createParserForm'});
		var deleteParserFormModule = contentContainer.addModule({id: 'deleteParserForm'});
		var manageParserRequestViewerModule = contentContainer.addModule({id: 'manageParserRequestViewer', class: 'noPadding'});

		/* Create plugins */

		var parserTableViewer = parserTableViewerModule.module('addPlugin', 'tableViewer', {
			dataURL: logAnalyzer.toolbox.LogAnalyzerAPICaller.getAPIURL({
				baseURL: baseURL,
				controller: 'analysisAdministration',
				method: 'getParser'
			}),
			dataTransformFunction: function(requestAnswer){
				return (requestAnswer.resultCode === 1) ? requestAnswer.info.parsers : false;
			},
			columns: [
				//{name: 'Parser ID', key: 'parserId', width: '100px'},
				{name: 'Name', key: 'parserHuman', width: '200px'},
				{name: 'Separator', key: 'separator'},
				{name: 'Part', key: 'part'}
			],
			showHeader: true,
			showLineNumbers: false
		});

		var createParserForm = createParserFormModule.module('addPlugin', 'form', {
			confirmationRequired: true,
			fields: [
				{
					name: 'Parser',
					id: 'parserHuman',
					help: 'Parser name',
					activation: true, type:
					'text', value: 'parser'
				},
				{
					name: 'Separator',
					id: 'separator',
					help: 'Separator of the parser',
					activation: true,
					type: 'text',
					value: ' '
				},
				{
					name: 'Part',
					id: 'part',
					help: 'Part to use',
					activation: true,
					type: 'number',
					value: 0,
					min: 0
				}
			],
			buttons: [
				{
					name: 'Create',
					id: 'createParser',
					callback: createParserAction
				}
			]
		});

		var deleteParserForm = deleteParserFormModule.module('addPlugin', 'form', {
			confirmationRequired: true,
			fields: [
				{
					name: 'Parser',
					id: 'parserId',
					help: 'Parser to delete',
					activation: true,
					type: 'select',
					separator: true,
					choicesURL: logAnalyzer.toolbox.LogAnalyzerAPICaller.getAPIURL({
						baseURL: baseURL,
						controller: 'analysisAdministration',
						method: 'getParser'
					}),
					choicesTransformFunction: function(requestAnswer){
						return (requestAnswer.resultCode === 1) ? requestAnswer.info.parsers : false;
					},
					nameKey: 'parserHuman',
					valueKey: 'parserId'
				}
			],
			buttons: [
				{
					name: 'Delete',
					id: 'deleteParser',
					callback: deleteParserAction
				}
			]
		});

		var manageParserRequestViewer = manageParserRequestViewerModule.module('addPlugin', 'requestViewer', {});
	};

})(jQuery);