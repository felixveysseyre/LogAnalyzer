/* Namespaces */

var logAnalyzer = logAnalyzer || {};
logAnalyzer.dashboard = logAnalyzer.dashboard || {};
logAnalyzer.dashboard.organizationAdministration = logAnalyzer.dashboard.organizationAdministration || {};

/* Function definition */

(function($){

	logAnalyzer.dashboard.organizationAdministration.manageUser = function()
	{
		/* Update navigation header */

		logAnalyzer.dashboard.loadNavigationHeader('Organization administration', 'Manage users');

		/* Create callback functions */

		var addAnswerToRequestViewer = function(requestAnswer)
		{
			createUserForm.form('setPendingState', false);

			manageUserRequestViewer
				.requestViewer('addRequest', requestAnswer)
				.requestViewer('update');

			userTableViewer.tableViewer('updateData');

			deleteUserForm.form('updateData');
		};

		var addErrorNotificationToRequestViewer = function()
		{
			createUserForm.form('setPendingState', false);
			deleteUserForm.form('setPendingState', false);

			manageUserRequestViewer
				.requestViewer('addRequest', {resultCode: -1, message: 'An error occurred'})
				.requestViewer('update');
		};

		var createUserAction = function(formValues)
		{
			createUserForm.form('setPendingState', true);
			manageUserRequestViewer.requestViewer('setPendingState', true);

			var postData = {};

			if(formValues.firstNameActivation) postData.firstName = formValues.firstName;
			if(formValues.lastNameActivation) postData.lastName = formValues.lastName;
			if(formValues.emailActivation) postData.email = formValues.email;
			if(formValues.roleIdActivation) postData.roleId = formValues.roleId;
			if(formValues.passwordActivation) postData.password = formValues.password;

			logAnalyzer.toolbox.LogAnalyzerAPICaller.callAPI({
				baseURL: baseURL,
				controller: 'organizationAdministration',
				method: 'createUser',
				postData: postData,
				successCallback: addAnswerToRequestViewer,
				errorCallback: addErrorNotificationToRequestViewer
			});
		};

		var deleteUserAction = function(formValues)
		{
			deleteUserFormModule.module('setPendingState', true);
			manageUserRequestViewerModule.module('setPendingState', true);

			var postData = {};

			if(formValues.userIdActivation) postData.userId = formValues.userId;

			logAnalyzer.toolbox.LogAnalyzerAPICaller.callAPI({
				baseURL: baseURL,
				controller: 'organizationAdministration',
				method: 'deleteUser',
				postData: postData,
				successCallback: addAnswerToRequestViewer,
				errorCallback: addErrorNotificationToRequestViewer
			});
		};

		/* Create modules */

		var contentContainer = logAnalyzer.dashboard.getContentContainer();

		var userTableViewerModule = contentContainer.addModule({id: 'userTableViewer', class: 'noPadding'});
		var createUserFormModule = contentContainer.addModule({id: 'createUserForm'});
		var deleteUserFormModule = contentContainer.addModule({id: 'deleteUserForm'});
		var manageUserRequestViewerModule = contentContainer.addModule({id: 'manageUserRequestViewer', class: 'noPadding'});

		/* Create plugins */

		var userTableViewer = userTableViewerModule.module('addPlugin', 'tableViewer', {
			dataURL: logAnalyzer.toolbox.LogAnalyzerAPICaller.getAPIURL({
				baseURL: baseURL,
				controller: 'organizationAdministration',
				method: 'getUser'
			}),
			postData: {
				joined: true
			},
			dataTransformFunction: function(requestAnswer){
				return (requestAnswer.resultCode === 1) ? requestAnswer.info.users : false;
			},
			columns: [
				//{name: 'User ID', key: 'userId', width: '100px'},
				{name: 'First Name', key: 'firstName', width: '200px'},
				{name: 'Last Name', key: 'lastName', width: '200px'},
				{name: 'Role', key: 'roleHuman'}
			],
			showHeader: true,
			showLineNumbers: false
		});

		var createUserForm = createUserFormModule.module('addPlugin', 'form', {
			confirmationRequired: true,
			fields: [
				{
					name: 'First Name',
					id: 'firstName',
					help: 'First name of the user',
					activation: true,
					type: 'text',
					value: 'John'
				},
				{
					name: 'Last Name',
					id: 'lastName',
					help: 'Last name of the user',
					activation: true,
					type: 'text',
					value: 'DOE'
				},
				{
					name: 'Email',
					id: 'email',
					help: 'Email address of the user',
					activation: true,
					type: 'text',
					value: 'john.doe@orange.com'
				},
				{
					name: 'Role',
					id: 'roleId',
					help: 'Role of the user',
					activation: true,
					type: 'select',
					separator: true,
					choicesURL: logAnalyzer.toolbox.LogAnalyzerAPICaller.getAPIURL({
						baseURL: baseURL,
						controller: 'organizationAdministration',
						method: 'getRole'
					}),
					choicesTransformFunction: function(requestAnswer){
						return (requestAnswer.resultCode === 1) ? requestAnswer.info.roles : false;
					},
					nameKey: 'roleHuman',
					valueKey: 'roleId'
				},
				{
					name: 'Password',
					id: 'password',
					help: 'Password of the user to sign in with',
					activation: true,
					type: 'password',
					value: 'password'
				}
			],
			buttons: [
				{
					name: 'Create',
					id: 'createUser',
					callback: createUserAction
				}
			]
		});

		var deleteUserForm = deleteUserFormModule.module('addPlugin', 'form', {
			confirmationRequired: true,
			fields: [
				{
					name: 'User',
					id: 'userId',
					help: 'User to delete',
					activation: true,
					type: 'select',
					separator: true,
					choicesURL: logAnalyzer.toolbox.LogAnalyzerAPICaller.getAPIURL({
						baseURL: baseURL,
						controller: 'organizationAdministration',
						method: 'getUser'
					}),
					postData: {
						fullNamed: true
					},
					choicesTransformFunction: function(requestAnswer){
						return (requestAnswer.resultCode === 1) ? requestAnswer.info.users : false;
					},
					nameKey: 'fullName',
					valueKey: 'userId'
				}
			],
			buttons: [
				{
					name: 'Delete',
					id: 'deleteUser',
					callback: deleteUserAction
				}
			]
		});

		var manageUserRequestViewer = manageUserRequestViewerModule.module('addPlugin', 'requestViewer', {});
	};

})(jQuery);