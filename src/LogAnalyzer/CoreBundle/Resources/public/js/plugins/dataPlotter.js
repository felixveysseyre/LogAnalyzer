$(function($){
	$.widget('wcd.dataPlotter', {

		/* Variables */

		/** Private **/

		_preparedData: null,
		_plotImageURL: null,

		_dataPlotterPlotContainer: null,
		_dataPlotterOptionsContainer: null,

		/** Public **/

		options: {
			parentModule: null,

			data: null,
			abscissaKey: null,
			ordinateKey: null,

			showDistribution: false,
			chartType: 'lineChart',

			format: 16/10,

			options: false,
			fontSize: 10,
			fontSizePossibility: [6, 7, 8, 9, 10, 11, 12, 13, 14],
			numberOfTick: 10,
			numberOfTickPossibility: [5, 10, 15, 20, 25],
			timeAggregation: 5,
			timeAggregationPossibility: [1, 5, 10, 15, 30, 60],

			minTick: null,
			maxTick: null,

			numberOfBeansMax: 24 * 60 / 5,

			plotOptions: {
				legend: {
					position: 'none'
				},
				chartArea: {
					width: '100%',
					height: '100%'
				},
				bar: {
					groupWidth: '90%'
				},
				hAxis: {
					textPosition: 'in',
					format: 'yyyy-MM-dd HH:mm:ss',
					viewWindowMode: 'maximized',
					gridlines: {
						count: 5,
						color: '#d2d2d2'
					},
					minorGridlines: {
						count: 5,
						color: '#dfdfdf'
					}
				},
				vAxis: {
					textPosition: 'in',
					gridlines: {
						color: '#d2d2d2'
					}
				},
				fontSize: 10,
				backgroundColor: {
					fill: 'transparent',
					stroke: 'transparent',
					strokeWidth: 2
				},
				enableInteractivity: true
			}
		},

		/* Methods */

		/** Private **/

		_create: function()
		{
			/* Initialization */

			this._createStructureAndLogic();

			/* Update content */

			this.update();
		},

		_createStructureAndLogic: function()
		{
			/* Clean */

			this.element.empty();

			/* Structure */
			var dataPlotterPlotElement = $('<div class="dataPlotterPlotContainer"></div>');

			this.element.append(dataPlotterPlotElement);
			this._dataPlotterPlotContainer = dataPlotterPlotElement;

			if(this.getOption('options'))
			{
				var dataPlotterOptionsElement = $('<table class="dataPlotterOptionsContainer"></table>');

				this.element.prepend(dataPlotterOptionsElement);
				this._dataPlotterOptionsContainer = dataPlotterOptionsElement;
			}
		},

		_addDataPlotterStructure: function()
		{
			var self = this;

			var options = this.getOption('options');
			var container = this._dataPlotterPlotContainer;

			/* Options */

			if(options)
			{
				var timeAggregation = this.getOption('timeAggregation');
				var numberOfTick = this.getOption('numberOfTick');
				var fontSize = this.getOption('fontSize');

				var optionsStructure =
					'<tr>' +
						'<td class="timeAggregation"></td>' +
						'<td class="numberOfTick"></td>' +
						'<td class="fontSize"></td>' +
					'</tr>';

				var selectStructure = '<select id="#id#" name="#id#"></select>';

				var optionStructure = '<option value="#value#" #options#>#text#</option>';
				var optionElement;

				/* Clear */

				this._dataPlotterOptionsContainer.empty();

				/* Time aggregation */

				var timeAggregationPossibility = this.getOption('timeAggregationPossibility');

				var timeAggregationField = $(selectStructure.replace(/#id#/g, 'timeAggregation'));

				timeAggregationField.change(function(){
					self.setOption('timeAggregation', $(this).val());
					self._preparedData = null;
					self.update();
				});

				for(var i = 0; i < timeAggregationPossibility.length; i++)
				{
					optionElement = $(optionStructure
						.replace(/#value#/, timeAggregationPossibility[i])
						.replace(/#options#/, (timeAggregationPossibility[i] == timeAggregation) ? 'selected' : '')
						.replace(/#text#/, timeAggregationPossibility[i] + ' m')
					);

					timeAggregationField.append(optionElement);
				}

				/* Number of ticks */

				var numberOfTickPossibility = this.getOption('numberOfTickPossibility');

				var numberOfTickField = $(selectStructure.replace(/#id#/g, 'numberOfTick'));

				numberOfTickField.change(function(){
					self.setOption('numberOfTick', $(this).val());
					self.update();
				});

				for(var i = 0; i < numberOfTickPossibility.length; i++)
				{
					optionElement = $(optionStructure
						.replace(/#value#/, numberOfTickPossibility[i])
						.replace(/#options#/, (numberOfTickPossibility[i] == numberOfTick) ? 'selected' : '')
						.replace(/#text#/, numberOfTickPossibility[i] + ' ticks')
					);

					numberOfTickField.append(optionElement);
				}

				/* FontSize selector */

				var fontSizePossibility = this.getOption('fontSizePossibility');

				var fontSizeField = $(selectStructure.replace(/#id#/g, 'fontSize'));

				fontSizeField.change(function(){
					self.setOption('fontSize', $(this).val());
					self.update();
				});

				for(var i = 0; i < fontSizePossibility.length; i++)
				{
					optionElement = $(optionStructure
						.replace(/#value#/, fontSizePossibility[i])
						.replace(/#options#/, (fontSizePossibility[i] == fontSize) ? 'selected' : '')
						.replace(/#text#/, fontSizePossibility[i] + ' px')
					);

					fontSizeField.append(optionElement)
				}

				/* Structure */

				var optionsElement = $(optionsStructure);
				optionsElement.find('.timeAggregation').append(timeAggregationField);
				optionsElement.find('.numberOfTick').append(numberOfTickField);
				optionsElement.find('.fontSize').append(fontSizeField);

				this._dataPlotterOptionsContainer.append(optionsElement);
			}

			/* Prepare data */

			this._prepareDataForPlot();

			var preparedData = this._preparedData;

			/* Graph */

			if(preparedData)
			{
				var chartType = this.getOption('chartType');
				var plotOptions = this.getOption('plotOptions');
				var fontSize = this.getOption('fontSize');
				var minTick = this.getOption('minTick');
				var maxTick = this.getOption('maxTick');
				var numberOfTick = this.getOption('numberOfTick');

				/* Style container */

				var height = Math.ceil(container.width() / this.getOption('format'));
				container.height(height);

				/* Custom plot options */

				/** FontSize **/

				plotOptions.fontSize = fontSize;

				/** Ticks **/

				var ticks = [];

				var min = (minTick) ? this._getDateObjectFromDateTime(minTick).getTime() : preparedData.getColumnRange(0).min.getTime();
				var max = (maxTick) ? this._getDateObjectFromDateTime(maxTick).getTime() : preparedData.getColumnRange(0).max.getTime();

				var interval = (max - min) / (numberOfTick - 1);

				for(var i = 0; i < numberOfTick; i++)
				{
					ticks.push(new Date(min + i * interval));
				}

				plotOptions.hAxis.ticks = ticks;

				/* Create graph */

				var chart;

				if(chartType === 'lineChart')
					chart = new google.visualization.LineChart(container[0]);
				else if(chartType === 'areaChart')
					chart = new google.visualization.AreaChart(container[0]);
				else if(chartType === 'columnChart')
					chart = new google.visualization.ColumnChart(container[0]);
				else
					return;

				chart.draw(preparedData, plotOptions);

				this._plotImageURL = chart.getImageURI();
			}
			else
			{
				container.height('auto');
				container.empty();
			}
		},

		_prepareDataForPlot: function()
		{
			var alreadyPreparedData = this._preparedData;

			if(alreadyPreparedData === null)
			{
				var showDistribution = this.getOption('showDistribution');
				var data = this.getOption('data');
				var abscissaKey = this.getOption('abscissaKey');
				var ordinateKey = this.getOption('ordinateKey');

				var preparedData;

				if(data && data.length)
				{
					preparedData = new google.visualization.DataTable();

					if(showDistribution && abscissaKey)
					{
						var timeAggregation = this.getOption('timeAggregation');

						/* Header */

						preparedData.addColumn('datetime', abscissaKey.charAt(0).toUpperCase() + abscissaKey.slice(1));
						preparedData.addColumn('number', 'Count');

						/* Create histogram */

						var dateTimeHistogram = this._createDateTimeHistogram(data, timeAggregation, abscissaKey);

						/* Data */

						for(var i = 0; i < dateTimeHistogram.length; i++)
						{
							preparedData.addRow([
								dateTimeHistogram[i].dateTime,
								dateTimeHistogram[i].count
							]);
						}
					}
					else if((!showDistribution) && abscissaKey && ordinateKey)
					{
						/* Header */

						preparedData.addColumn('date', abscissaKey.charAt(0).toUpperCase() + abscissaKey.slice(1));
						preparedData.addColumn('number', ordinateKey.charAt(0).toUpperCase() + ordinateKey.slice(1));

						/* Data */

						for(var i = 0; i < data.length; i++)
						{
							preparedData.addRow([
								this._getDateObjectFromDateTime(data[i][abscissaKey]),
								Number(data[i][ordinateKey])
							]);
						}
					}
					else
					{
						preparedData = false;
					}
				}
				else
				{
					preparedData = false;
				}

				this._preparedData = preparedData;
			}
		},

		_createDateTimeHistogram: function(data, timeAggregation, key)
		{
			var min = this.getOption('minTick');
			var max = this.getOption('maxTick');

			if(data && data.length)
			{
				var dateTimeHistogram = [];

				var minData = +Infinity;
				var maxData = -Infinity;

				/* Initialization */

				var dateTimes = [];

				for(var i = 0; i < data.length; i++)
				{
					if(data[i][key])
					{
						var value = this._getDateObjectFromDateTime(data[i][key]).getTime();

						dateTimes.push(value);

						minData = Math.min(minData, value);
						maxData = Math.max(maxData, value);
					}
				}

				min = (min) ? this._getDateObjectFromDateTime(min).getTime() : minData;
				max = (max) ? this._getDateObjectFromDateTime(max).getTime() : maxData;

				var interval = timeAggregation * 60 * 1000;

				var numberOfBeans = (max !== min) ? (1 + ((max - min) / interval)) : 100;

				/** Check **/

				numberOfBeans = Math.min(this.getOption('numberOfBeansMax'), numberOfBeans);

				interval = (max - min) / (numberOfBeans - 1);

				/* Create dateTimeHistogram array */

				for(var j = 0; j < numberOfBeans; j++)
				{
					dateTimeHistogram[j] = {
						dateTime: new Date(min + (j + 0.5) * interval),
						count: 0
					};
				}

				/* Count */

				for(var i = 0; i < data.length; i++)
				{
					var beanNumber = Math.floor((dateTimes[i] - min) / interval);

					dateTimeHistogram[beanNumber].count += 1;
				}

				/* Return */

				return dateTimeHistogram;
			}
			else
			{
				return false;
			}
		},

		_getDateObjectFromDateTime: function(dateTime)
		{
			if(dateTime)
			{
				var t = dateTime.split(/[- :]/);
				return new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
			}
			else
			{
				return false;
			}
		},

		_getDateTimeFromDateObject: function(dateObject)
		{
			if(dateObject)
			{
				var dateTime = dateObject.toISOString();

				return  dateTime
					.substring(0, dateTime.length - 5)
					.replace(/T/, ' ');
			}
			else
			{
				return false;
			}
		},

		/** Public **/

		getOption: function(optionName)
		{
			if(typeof(optionName) !== 'undefined')
				if(typeof(this.options[optionName]) !== 'undefined')
					return this.options[optionName];
				else
					return false;
			else
				return false;
		},

		setOption: function(optionName, option)
		{
			if(typeof(optionName) !== 'undefined' && typeof(option) !== 'undefined')
				if(typeof(this.options[optionName]) !== 'undefined')
					this.options[optionName] = option;
				else
					console.warn('Options ' + optionName + ' does not exist');
			else
				console.warn('optionName or option is undefined', optionName, option);
		},

		setPendingState: function(value)
		{
			var parentModule = this.getOption('parentModule');

			if(parentModule)
			{
				parentModule.module('setPendingState', value);
			}
		},

		update: function()
		{
			this.setPendingState(true);
			this._addDataPlotterStructure();
			this.setPendingState(false);
		},

		setData: function(data)
		{
			this.setOption('data', data);
			this._preparedData = null;
		},

		getData: function()
		{
			return this.getOption('data');
		},

		getPlotURL: function()
		{
			return this._plotImageURL;
		},

		setMinTick: function(minTick)
		{
			this.setOption('minTick', minTick);
		},

		setMaxTick: function(maxTick)
		{
			this.setOption('maxTick', maxTick);
		}
	});
});