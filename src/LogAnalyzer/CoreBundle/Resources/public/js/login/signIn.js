/* Namespaces */

var logAnalyzer = logAnalyzer || {};
logAnalyzer.login = logAnalyzer.login || {};

/* Function definition */

(function($){

	logAnalyzer.login.signIn = function()
	{
		/* Create callback functions */

		var successAction = function(requestAnswer)
		{
			signInForm.form('setPendingState', false);

			if(requestAnswer.resultCode === 1)
			{
				$('body').addClass('green');

				window.location.replace(baseURL + requestAnswer.info.redirectTo);
			}
			else
			{
				$('body').addClass('red');

				setTimeout(function(){
						$('body').removeClass('red');
					},
					1000
				);
			}
		};

		var errorAction = function()
		{
			signInForm.form('setPendingState', false);

			console.error('An error occurred.');
		};

		var signInAction = function(formValues)
		{
			signInForm.form('setPendingState', true);

			var postData = {};

			if(formValues.userIdActivation) postData.userId = formValues.userId;
			if(formValues.passwordActivation) postData.password = formValues.password;

			logAnalyzer.toolbox.LogAnalyzerAPICaller.callAPI({
				baseURL: baseURL,
				controller: 'login',
				method: 'signIn',
				postData: postData,
				successCallback: successAction,
				errorCallback: errorAction
			});
		};

		/* Create modules */

		var contentContainer = logAnalyzer.login.getContentContainer();

		var signInFormModule = contentContainer.addModule({id: 'signInFormForm'});

		/* Create plugins */

		var signInForm = signInFormModule.module('addPlugin', 'form', {
			fields: [
				{
					name: 'User',
					id: 'userId',
					help: 'User to sign in with',
					activation: true,
					type: 'select',
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
					name: 'Sign in',
					id: 'signIn',
					callback: signInAction
				}
			]
		});
	};

})(jQuery);