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

			var exporterContainerElement = $('<table class="exporterContainer"></table>');
			var fakeLinkElement = $('<a class="fakeLink" href="" download="" style="display: none;">FakeLink</a>');

			this.element.append(exporterContainerElement);
			this._exporterContainer = exporterContainerElement;

			/* Fake link */

			this.element.append(fakeLinkElement);
			this._fakeLink = fakeLinkElement;
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
						CSV += String(data[i][columns[j].key])
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

				if(this._file !== null)
				{
					window.URL.revokeObjectURL(this._file);
				}

				/* Create file */

				var file = new Blob([content], {type: 'text/plain'});

				this._file = window.URL.createObjectURL(file);

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
				'<tr>' +
					'<td class="name"></td>' +
					'<td class="action"></td>' +
				'</tr>';
			var exporterContainerElement;

			var buttonStructure = '<button type="button" #option#>#name#</button>';
			var buttonElement;

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
				/* Button */

				buttonElement = $(buttonStructure
					.replace(/#option#/, option)
					.replace(/#name#/, 'Export')
				);

				buttonElement.click(function(){
					self.setPendingState(true);
					self._saveContentAs('logs.json', self._getDataAsJSON());
					self.setPendingState(false);
				});

				/* Structure */

				exporterContainerElement = $(exporterContainerStructure);
				exporterContainerElement.find('.name').append('Export data as <i>JSON</i>');
				exporterContainerElement.find('.action').append(buttonElement);

				/* Append */

				this._exporterContainer.append(exporterContainerElement);
			}

			/** Export as CSV **/

			if(exportDataAsCSV)
			{
				/* Button */

				buttonElement = $(buttonStructure
					.replace(/#option#/, option)
					.replace(/#name#/, 'Export')
				);

				buttonElement.click(function(){
					self.setPendingState(true);
					self._saveContentAs('logs.csv', self._getDataAsCSV());
					self.setPendingState(false);
				});

				/* Structure */

				exporterContainerElement = $(exporterContainerStructure);
				exporterContainerElement.find('.name').append('Export data as <i>CSV</i>');
				exporterContainerElement.find('.action').append(buttonElement);

				/* Append */

				this._exporterContainer.append(exporterContainerElement);
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
				/* Button */

				buttonElement = $(buttonStructure
					.replace(/#option#/, option)
					.replace(/#name#/, 'Export')
				);

				buttonElement.click(function(){
					self.setPendingState(true);
					self._saveURLAs('plot.png', self._getPlotImageURL());
					self.setPendingState(false);
				});

				/* Structure */

				exporterContainerElement = $(exporterContainerStructure);
				exporterContainerElement.find('.name').append('Export plot as <i>PNG</i>');
				exporterContainerElement.find('.action').append(buttonElement);

				/* Append */

				this._exporterContainer.append(exporterContainerElement);
			}
		}
	});
});