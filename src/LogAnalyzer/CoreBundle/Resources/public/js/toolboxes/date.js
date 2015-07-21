/* Namespaces */

var logAnalyzer = logAnalyzer || {};
logAnalyzer.toolbox = logAnalyzer.toolbox || {};
logAnalyzer.toolbox.date = logAnalyzer.toolbox.date || {};

/* Functions declarations */

(function($)
{
	logAnalyzer.toolbox.date.getDateTimeNow = function()
	{
		return new Date()
			.toISOString()
			.substring(0, 19)
			.replace(/T/, ' ');
	};

	logAnalyzer.toolbox.date.getDateNow = function()
	{
		return new Date()
			.toISOString()
			.substring(0, 10);
	};

})(jQuery);