/* Namespaces */

var logAnalyzer = logAnalyzer || {};
logAnalyzer.toolbox = logAnalyzer.toolbox || {};
logAnalyzer.toolbox.log = logAnalyzer.toolbox.log || {};

/* Functions declarations */

(function($)
{
	logAnalyzer.toolbox.log.parseLogs = function(logs, parsers)
	{
		logs = JSON.parse(JSON.stringify(logs)); //Hack to get rid of reference object

		if(logs)
		{
			/* Compute parsed messages */

			var parsedMessageComputed = [];

			for(var i = 0; i < parsers.length; i++)
			{
				if(parsedMessageComputed.indexOf(parsers[i].parser.parserHuman))
				{
					for(var j = 0; j < logs.length; j++)
					{
						var parts = logs[j].message.split(parsers[i].parser.separator);

						var parsedMessage = (parsers[i].parser.part-1 < parts.length) ? parts[parsers[i].parser.part-1] : null;

						logs[j][parsers[i].parser.parserHuman] = parsedMessage;
					}

					parsedMessageComputed.push(parsers[i].parser.parserHuman);
				}
			}

			/* Filter logs */

			var filterUsed = false;

			for(var i = 0; i < parsers.length; i++)
			{
				if(typeof(parsers[i].comparisonOperator) !== 'undefined' && typeof(parsers[i].value) !== 'undefined')
				{
					filterUsed = true;

					parsers[i].value = (isNaN(parsers[i].value)) ? parsers[i].value : Number(parsers[i].value);

					/* Create condition testing function */

					var conditionTesting = function(parsedMessage, value){
						return true;
					};

					if(parsers[i].comparisonOperator === '<=')
						conditionTesting = function(parsedMessage, value){
							return (parsedMessage <= value);
						};

					if(parsers[i].comparisonOperator === '==')
						conditionTesting = function(parsedMessage, value){
							return (parsedMessage == value);
						};

					if(parsers[i].comparisonOperator === '>=')
						conditionTesting = function(parsedMessage, value){
							return (parsedMessage >= value);
						};

					if(parsers[i].comparisonOperator === '!=')
						conditionTesting = function(parsedMessage, value){
							return (parsedMessage != value);
						};

					/* Test logs */

					for(var j = 0; j < logs.length; j++)
					{
						if(! conditionTesting(logs[j][parsers[i].parser.parserHuman], parsers[i].value))
						{
							logs[j].toBeFiltered = true;
						}
					}
				}
			}

			/* Return */

			if(filterUsed)
			{
				var logsFiltered = [];

				/* Add logs */

				for(var j = 0; j < logs.length; j++)
				{
					if(logs[j].toBeFiltered !== true)
					{
						logsFiltered.push(logs[j]);
					}
				}

				return logsFiltered;
			}
			else
			{
				return logs;
			}
		}
	};

	logAnalyzer.toolbox.log.getNamesFromParsers = function(parsers)
	{
		var names = [];

		for(var i = 0; i < parsers.length; i++)
		{
			if(names.indexOf(parsers[i].parser.parserHuman))
			{
				names.push(parsers[i].parser.parserHuman);
			}
		}

		return names;
	};

	logAnalyzer.toolbox.log.getColumnFromParser = function(parsers)
	{
		var columns = [];

		var names = logAnalyzer.toolbox.log.getNamesFromParsers(parsers);

		for(var i = 0; i < names.length; i++)
		{
			columns.push({
				name: names[i],
				key: names[i]
			})
		}

		return columns;
	};

})(jQuery);