/* Namespaces */

var logAnalyzer = logAnalyzer || {};
logAnalyzer.login = logAnalyzer.login || {};

/* Functions declarations */

(function($){
	$(document).ready(function(){

		logAnalyzer.login.signIn();

	});

	/* GUI functions */

	logAnalyzer.login.clearContent = function()
	{
		logAnalyzer.login.clearPeriodicActions();
		$('#content').empty();
	};

	logAnalyzer.login.loadContent = function(content)
	{
		$('#content').html(content);
	};

	logAnalyzer.login.getContentContainer = function()
	{
		return $('#content');
	};

})(jQuery);