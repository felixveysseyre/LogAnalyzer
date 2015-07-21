/* Namespaces */

var logAnalyzer = logAnalyzer || {};
logAnalyzer.toolbox = logAnalyzer.toolbox || {};
logAnalyzer.toolbox.array = logAnalyzer.toolbox.array || {};

/* Functions declarations */

(function($)
{
	logAnalyzer.toolbox.array.sortArray = function(array, comparisonFunction, order)
	{
		if(order === 'asc')
		{
			array.sort(comparisonFunction);
		}
		else if(order === 'desc')
		{
			array.sort(
				function(log1, log2)
				{
					return -comparisonFunction(log1, log2);
				}
			);
		}
		else
		{
			console.error('Order does not match any recognised order.');
		}
	};

	logAnalyzer.toolbox.array.compareLogsByReportedTime = function(log1, log2)
	{
		return (log1.reportedTime > log2.reportedTime) ? 1 : -1;
	};

})(jQuery);