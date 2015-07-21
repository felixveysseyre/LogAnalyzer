/* Namespaces */

var logAnalyzer = logAnalyzer || {};
logAnalyzer.toolbox = logAnalyzer.toolbox || {};
logAnalyzer.toolbox.LogAnalyzerAPICaller = logAnalyzer.toolbox.LogAnalyzerAPICaller || {};

/* Functions declarations */

(function($)
{
	logAnalyzer.toolbox.LogAnalyzerAPICaller.API =
	{
		projectLogs:
		{
			getProjectLog: 'projectLogs/getProjectLogAPI',
			getAlertLog: 'projectLogs/getAlertLogAPI'
		},
		projectConfiguration:
		{
			getInitializationProjectStatus: 'projectConfiguration/getInitializationProjectStatusAPI',
			initializeProject: 'projectConfiguration/initializeProjectAPI',
			resetProject: 'projectConfiguration/resetProjectAPI',
			getConstant: 'projectConfiguration/getConstantAPI',
			updateConstant: 'projectConfiguration/updateConstantAPI'
		},
		organizationAdministration:
		{
			getRole: 'organizationAdministration/getRoleAPI',
			createRole: 'organizationAdministration/createRoleAPI',
			deleteRole: 'organizationAdministration/deleteRoleAPI',
			getUser: 'organizationAdministration/getUserAPI',
			createUser: 'organizationAdministration/createUserAPI',
			deleteUser: 'organizationAdministration/deleteUserAPI'
		},
		platformAdministration:
		{
			getHost: 'platformAdministration/getHostAPI',
			createHost: 'platformAdministration/createHostAPI',
			deleteHost: 'platformAdministration/deleteHostAPI',
			getService: 'platformAdministration/getServiceAPI',
			createService: 'platformAdministration/createServiceAPI',
			deleteService: 'platformAdministration/deleteServiceAPI',
			getCollector: 'platformAdministration/getCollectorAPI',
			createCollector: 'platformAdministration/createCollectorAPI',
			deleteCollector: 'platformAdministration/deleteCollectorAPI'
		},
		databaseAdministration:
		{
			getLogAccessor: 'databaseAdministration/getLogAccessorAPI',
			createLogAccessor: 'databaseAdministration/createLogAccessorAPI',
			deleteLogAccessor: 'databaseAdministration/deleteLogAccessorAPI',
			getLogTable: 'databaseAdministration/getLogTableAPI',
			createLogTable: 'databaseAdministration/createLogTableAPI',
			deleteLogTable: 'databaseAdministration/deleteLogTableAPI'
		},
		analysisAdministration:
		{
			getLiveGraph: 'analysisAdministration/getLiveGraphAPI',
			createLiveGraph: 'analysisAdministration/createLiveGraphAPI',
			deleteLiveGraph: 'analysisAdministration/deleteLiveGraphAPI',
			getAlert: 'analysisAdministration/getAlertAPI',
			createAlert: 'analysisAdministration/createAlertAPI',
			deleteAlert: 'analysisAdministration/deleteAlertAPI',
			getParser: 'analysisAdministration/getParserAPI',
			createParser: 'analysisAdministration/createParserAPI',
			deleteParser: 'analysisAdministration/deleteParserAPI'
		},
		platformStatus:
		{
			getAlertNotification: 'platformStatus/getAlertNotificationAPI',
			deleteAlertNotification: 'platformStatus/deleteAlertNotificationAPI',
			clearAlertNotification: 'platformStatus/clearAlertNotificationAPI'
		},
		dataAccess:
		{
			getLog: 'dataAccess/getLogAPI',
			getLogBackup: 'dataAccess/getLogBackupAPI',
			getLiveGraphCount: 'dataAccess/getLiveGraphCountAPI'
		},

		login:
		{
			signIn: 'login/signInAPI',
			signOut: 'login/signOutAPI'
		}
	};

	logAnalyzer.toolbox.LogAnalyzerAPICaller.callAPI = function(parameters)
	{
		/* Parameters */

		var defaultParameters =
		{
			baseURL: null,
			controller: null,
			method: null,
			postData: null,
			convertToRequestAnswer: true,
			successCallback: null,
			errorCallback: function(xhr, status, error){console.error(xhr.status + ' - ' + xhr.statusText);}
		};

		parameters = $.extend(defaultParameters, parameters);

		/* Call API */

		var API = logAnalyzer.toolbox.LogAnalyzerAPICaller.API;

		if(parameters.baseURL !== null && parameters.controller !== null && parameters.method)
		{
			if(typeof(API[parameters.controller]) !== 'undefined' && typeof(API[parameters.controller][parameters.method]) !== 'undefined')
			{
				var URL = parameters.baseURL + API[parameters.controller][parameters.method];

				var dataFilter = function(contentURL)
				{
					if(typeof(debugMode) !== 'undefined' && debugMode)
						console.debug(contentURL);

					if(parameters.convertToRequestAnswer)
						return JSON.parse(contentURL);
					else
						return contentURL;
				};

				$.ajax({
					type: 'post',
					url: URL,
					data: parameters.postData,
					dataFilter: dataFilter,
					success: parameters.successCallback,
					error: parameters.errorCallback
				});
			}
			else
			{
				console.warn('Can not find requested controller or method.', parameters.controller, parameters.method);
			}
		}
		else
		{
			console.warn('Some parameters are missing.');
		}
	};

	logAnalyzer.toolbox.LogAnalyzerAPICaller.getAPIURL = function(parameters)
	{
		/* Parameters */

		var defaultParameters =
		{
			baseURL: null,
			controller: null,
			method: null
		};

		parameters = $.extend(defaultParameters, parameters);

		/* Call API */

		var API = logAnalyzer.toolbox.LogAnalyzerAPICaller.API;

		if(parameters.baseURL !== null && parameters.controller !== null && parameters.method)
		{
			if(typeof(API[parameters.controller]) !== 'undefined' && typeof(API[parameters.controller][parameters.method]) !== 'undefined')
			{
				return parameters.baseURL + API[parameters.controller][parameters.method];
			}
			else
			{
				console.warn('Can not find requested controller or method.');

				return false;
			}
		}
		else
		{
			console.warn('Some parameters are missing.');

			return false;
		}
	};

})(jQuery);