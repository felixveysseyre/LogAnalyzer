$(function($){
	$.widget('wcd.exporter', {

		/* Variables */

		/** Private **/

		_exporterContainer: null,
		_fakeLink: null,
		_file: null,

		/** Public **/

		options: {
			parentModule: null,

			data: null,
			dataGetter: function(){
				return this.getOption('data');
			},

			plotImageURL: null,
			plotImageURLGetter: function(){
				return this.getOption('plotImageURL');
			},

			exportDataAsCSV: false,
			exportDataAsJSON: false,
			exportPlotAsPNG: false
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
			/* Structure */

			this.element.empty();

			/* Data exporter container */

			var exporterContainerStructure = '<table class="exporterContainer"></table>';
			var fakeLinkStructure = '<a class="fakeLink" href="" download="" style="display: none;">FakeLink</a>';

			this.element.append(exporterContainerStructure);
			this._exporterContainer = this.element.find('.exporterContainer');

			/* Fake link */

			this.element.append(fakeLinkStructure);
			this._fakeLink = this.element.find('.fakeLink');
		},

		_getDataAsJSON: function()
		{
			var data = this.getOption('dataGetter')();

			if(data && data.length)
			{
				return JSON.stringify(data);
			}
			else
			{
				return false;
			}
		},

		_getDataAsCSV: function()
		{
			var data = this.getOption('dataGetter')();

			if(data && data.length)
			{
				/* Create columns object */

				var columns = [];

				var keys = Object.keys(data[0]);

				for(var i = 0; i < keys.length; i++)
				{
					columns.push({
						name: keys[i].charAt(0).toUpperCase() + keys[i].slice(1),
						key: keys[i]
					});
				}

				/* Generate CSV */

				/** Header **/

				var CSV = '';

				for(var i = 0; i < columns.length; i++)
				{
					CSV += columns[i].name + '; ';
				}

				CSV = CSV.substring(0, CSV.length - 2);
				CSV += '\r';

				/** Content **/

				for(var i = 0; i < data.length; i++)
				{
					for(var j = 0; j < columns.length; j++)
					{
						CSV += data[i][columns[j].key]
							.replace(/(\r\n|\n|\r)/gm, ' ')
							.replace(/;/, '') + '; ';
					}

					CSV = CSV.substring(0, CSV.length - 2);
					CSV += '\r';
				}

				/* Return */

				return CSV;
			}
			else
			{
				return false;
			}
		},

		_getPlotImageURL: function()
		{
			var plotImageURL = this.getOption('plotImageURLGetter')();

			if(plotImageURL)
			{
				return plotImageURL;
			}
			else
			{
				return false;
			}
		},

		_saveContentAs: function(fileName, content)
		{
			if(content)
			{
				/* Clean */

				if(this._file !== null) window.URL.revokeObjectURL(this._file);

				/* Create file */

				var file = new Blob([content], {type: 'text/plain'});

				this._file =  window.URL.createObjectURL(file);

				/* Set and click fake link */

				this._fakeLink.attr('download', fileName);
				this._fakeLink.attr('href', this._file);

				this._fakeLink[0].click(); //Hack to trigger click event on link
			}
		},

		_saveURLAs: function(fileName, URL)
		{
			if(URL)
			{
				/* Set and click fake link */

				this._fakeLink.attr('download', fileName);
				this._fakeLink.attr('href', URL);

				this._fakeLink[0].click(); //Hack to trigger click event on link
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
			var self = this;

			var exporterContainerStructure =
				'<tr class="#class#">' +
					'<td class="name">#name#</td>' +
					'<td class="action">#action#</td>' +
				'</tr>';

			var buttonStructure = '<button class="#class#" type="button" #option#>#name#</button>';

			var option;

			/* Data export */

			var data = this.getOption('data');
			var dataGetter = this.getOption('dataGetter');

			var exportDataAsJSON = this.getOption('exportDataAsJSON');
			var exportDataAsCSV = this.getOption('exportDataAsCSV');

			/** Options **/

			option = (data || dataGetter) ? '' : 'disabled';

			/** Export as JSON **/

			if(exportDataAsJSON)
			{
				/* Structure */

				var buttonStructureTemp = buttonStructure
					.replace(/#class#/, 'exportDataAsJSONAction')
					.replace(/#option#/, option)
					.replace(/#name#/, 'Export');

				this._exporterContainer.append(exporterContainerStructure
					.replace(/#class#/, 'exportDataAsJSON')
					.replace(/#name#/, 'Export data as <i>JSON</i>')
					.replace(/#action#/, buttonStructureTemp)
				);

				/* Logic */

				this.element.find('.exportDataAsJSONAction').click(function(){
					self._saveContentAs('logs.json', self._getDataAsJSON());
				});
			}

			/** Export as CSV **/

			if(exportDataAsCSV)
			{
				/* Structure */

				var buttonStructureTemp = buttonStructure
					.replace(/#class#/, 'exportDataAsCSVAction')
					.replace(/#option#/, option)
					.replace(/#name#/, 'Export');

				this._exporterContainer.append(
					exporterContainerStructure
						.replace(/#class#/, 'exportDataAsCSV')
						.replace(/#name#/, 'Export data as <i>CSV</i>')
						.replace(/#action#/, buttonStructureTemp)
				);

				/* Logic */

				this.element.find('.exportDataAsCSVAction').click(function(){
					self._saveContentAs('logs.csv', self._getDataAsCSV());
				});
			}

			/* Plot export */

			var plotImageURL = this.getOption('plotImageURL');
			var plotImageURLGetter = this.getOption('plotImageURLGetter');

			var exportPlotAsPNG = this.getOption('exportPlotAsPNG');

			/** Options **/

			option = (plotImageURL || plotImageURLGetter) ? '' : 'disabled';

			/** Export as PNG **/

			if(exportPlotAsPNG)
			{
				/* Structure */

				var buttonStructureTemp = buttonStructure
					.replace(/#class#/, 'exportPlotAsPNGAction')
					.replace(/#option#/, option)
					.replace(/#name#/, 'Export');

				this._exporterContainer.append(
					exporterContainerStructure
						.replace(/#class#/, 'exportPlotAsPNGAction')
						.replace(/#name#/, 'Export plot as <i>PNG</i>')
						.replace(/#action#/, buttonStructureTemp)
				);

				/* Logic */

				this.element.find('.exportPlotAsPNGAction').click(function(){
					self._saveURLAs('plot.png', self._getPlotImageURL());
				});
			}
		}
	});
});