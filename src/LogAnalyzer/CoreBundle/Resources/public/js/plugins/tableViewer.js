$(function($){
	$.widget('wcd.tableViewer', {

		/* Variables */

		/** Private **/

		_tableViewerContainer: null,
		_tableViewerTableContainer: null,
		_tableViewerNavigationContainerPrevious: null,
		_tableViewerNavigationContainerNext: null,

		/** Public **/

		options: {
			parentModule: null,

			data: null,

			dataURL: null,
			postData: null,
			dataTransformFunction: null,

			columns: null,
			showHeader: true,
			showLineNumbers: true,

			lineClassDeterminationFunction: null,

			pagination: false,
			currentPage: 1,
			numberOfLinesPerPage: 1000,
			numberOfLinesPerPagePossibility: [10, 100, 1000, 10000],
			previousText: '<i class="fa fa-chevron-up"></i>',
			nextText: '<i class="fa fa-chevron-down"></i>'
		},

		/* Methods */

		/** Private **/

		_create: function()
		{
			/* Initialization */

			this._createStructureAndLogic();

			/* Update content */

			if(this.getOption('dataURL'))
			{
				this.updateData();
			}
			else
			{
				this.update();
			}
		},

		_createStructureAndLogic: function()
		{
			/* Structure */

			this.element.empty();

			/* Table viewer container */

			var tableViewerContainerStructure = '<div class="tableViewerContainer"></div>';
			var tableViewerTableContainerStructure = '<table class="tableViewerTableContainer"></table>';
			var tableViewerNavigationContainerStructure = '<table class="tableViewerNavigationContainer #class#"></table>';

			var tableViewerContainerElement = $(tableViewerContainerStructure);
			this.element.append(tableViewerContainerElement);
			this._tableViewerContainer = tableViewerContainerElement;

			var tableViewerTableContainerElement = $(tableViewerTableContainerStructure);
			this._tableViewerContainer.append(tableViewerTableContainerElement);
			this._tableViewerTableContainer = tableViewerTableContainerElement;

			if(this.getOption('pagination'))
			{
				var tableViewerNavigationContainerPrevious = $(tableViewerNavigationContainerStructure.replace(/#class#/, 'previous'));
				var tableViewerNavigationContainerNext = $(tableViewerNavigationContainerStructure.replace(/#class#/, 'next'));

				this._tableViewerContainer.prepend(tableViewerNavigationContainerPrevious);
				this._tableViewerContainer.append(tableViewerNavigationContainerNext);

				this._tableViewerNavigationContainerPrevious = tableViewerNavigationContainerPrevious;
				this._tableViewerNavigationContainerNext = tableViewerNavigationContainerNext;
			}
		},
		
		_addTableViewerStructure: function()
		{
			var self = this;

			var data = this.getOption('data');
			var pagination = this.getOption('pagination');

			var currentPage = this.getOption('currentPage');
			var numberOfLinesPerPage = this.getOption('numberOfLinesPerPage');

			/* Navigation */

			if(pagination)
			{
				var numberOfLinesPerPagePossibility = this.getOption('numberOfLinesPerPagePossibility');

				var navigationStructure =
					'<tr>' +
						'<td class="numberOfLinesPerPage"></td>' +
						'<td class="navigation"></td>' +
						'<td class="currentPage"></td>' +
					'</tr>';

				var selectStructure = '<select id="#id#" name="#id#"></select>';

				var optionStructure = '<option value="#value#" #options#>#text#</option>';
				var optionElement;

				/* Clear */

				this._tableViewerNavigationContainerPrevious.empty();
				this._tableViewerNavigationContainerNext.empty();

				/* Structure */

				var navigationElement = $(navigationStructure);

				/* Number of line per page selector */

				var numberOfLinesPerPageField = $(selectStructure.replace(/#id#/g, 'numberOfLinesPerPage'));

				for(var i = 0; i < numberOfLinesPerPagePossibility.length; i++)
				{
					optionElement = $(optionStructure
						.replace(/#value#/, numberOfLinesPerPagePossibility[i])
						.replace(/#options#/, (numberOfLinesPerPagePossibility[i] == numberOfLinesPerPage) ? 'selected' : '')
						.replace(/#text#/, numberOfLinesPerPagePossibility[i])
					);

					numberOfLinesPerPageField.append(optionElement);
				}

				numberOfLinesPerPageField.change(function(){
					self.setOption('numberOfLinesPerPage', $(this).val());
					self.setCurrentPage(1);
					self.update();
				});

				navigationElement
					.find('.numberOfLinesPerPage')
					.append(numberOfLinesPerPageField);

				/* Current page selector */

				var currentPageStructureField = $(selectStructure.replace(/#id#/g, 'currentPage'));

				var numberOfPage = (data) ? Math.ceil(data.length / numberOfLinesPerPage) : 0;

				for(var i = 1; i <= numberOfPage; i++)
				{
					optionElement = $(optionStructure
						.replace(/#value#/, i)
						.replace(/#options#/, (i == currentPage) ? 'selected' : '')
						.replace(/#text#/, i + '/' + numberOfPage)
					);

					currentPageStructureField.append(optionElement);
				}

				currentPageStructureField.change(function(){
					self.setCurrentPage($(this).val());
					self.update();
				});

				navigationElement
					.find('.currentPage')
					.append(currentPageStructureField);

				/* Navigation previous */

				var navigationPreviousElement = navigationElement.clone(true, true);

				navigationPreviousElement
					.find('.navigation')
					.append(this.getOption('previousText'))
					.click(function(){
						self.changeCurrentPage(-1);
						self.update();
					});

				/* Navigation next */

				var navigationNextElement = navigationElement.clone(true, true);

				navigationNextElement
					.find('.navigation')
					.append(this.getOption('nextText'))
					.click(function(){
						self.changeCurrentPage(+1);
						self.update();
					});

				/* Append */

				this._tableViewerNavigationContainerPrevious.append(navigationPreviousElement);
				this._tableViewerNavigationContainerNext.append(navigationNextElement);
			}

			/* Data */

			this._tableViewerTableContainer.empty();

			if(data)
			{
				var columns = this.getOption('columns');
				var lineClassDeterminationFunction = this.getOption('lineClassDeterminationFunction');
				var showHeader = this.getOption('showHeader');
				var showLineNumbers = this.getOption('showLineNumbers');

				var lineStructure = '<tr class="#class#"></tr>';
				var lineElement;

				var cellStructure = '<td class="#class#">#cellContent#</td>\n';
				var headerCellStructure = '<th class="#class#" style="width: #width#;">#headerCellContent#</th>';
				var cellElement;

				/* Columns object */

				if(! columns)
				{
					columns = [];

					var keys = Object.keys(data[0]);

					for(var i = 0; i < keys.length; i++)
					{
						columns.push({
							name: keys[i].charAt(0).toUpperCase() + keys[i].slice(1),
							key: keys[i]
						});
					}
				}

				/* Header */

				if(showHeader)
				{
					lineElement = $(lineStructure.replace(/#class#/, ''));

					if(showLineNumbers)
					{
						cellElement = $(headerCellStructure
							.replace(/#class#/, 'lineNumber')
							.replace(/#width#/, '')
							.replace(/#headerCellContent#/, '#')
						);

						lineElement.append(cellElement);
					}

					for(var i = 0; i < columns.length; i++)
					{
						cellElement = $(headerCellStructure
							.replace(/#class#/, '')
							.replace(/#width#/, columns[i].width || '')
							.replace(/#headerCellContent#/, columns[i].name || '')
						);

						lineElement.append(cellElement);
					}

					this._tableViewerTableContainer.append(lineElement);
				}

				/* Select lines */

				var iMin = (pagination === false) ? (0) : (Math.max(0, (currentPage - 1) * numberOfLinesPerPage));
				var iMax = (pagination === false) ? (data.length - 1) : (Math.min(data.length - 1, currentPage * numberOfLinesPerPage - 1));

				/* Loop on lines */

				for(var i = iMin; i <= iMax; i++)
				{
					var color = (lineClassDeterminationFunction) ? lineClassDeterminationFunction(data[i]) : '';

					lineElement = $(lineStructure.replace(/#class#/, color));

					if(showLineNumbers)
					{
						cellElement = $(cellStructure
							.replace(/#class#/, 'lineNumber')
							.replace(/#cellContent#/, i + 1)
						);

						lineElement.append(cellElement);
					}

					for(var j = 0; j < columns.length; j++)
					{
						var cellContent = data[i][columns[j].key];
						var cellClass = '';

						if(typeof(cellContent) === 'object')
						{
							cellContent = '<i class="fa fa-cube"></i>';
							cellClass = 'object';
						}
						else
						{
							cellContent = (columns[j].highlight) ? cellContent.replace(new RegExp(columns[j].highlight, 'gi'), '<span class="highlighted">' + columns[j].highlight +'</span>') : cellContent;
						}

						cellElement = $(cellStructure
							.replace(/#class#/, cellClass)
							.replace(/#cellContent#/, cellContent)
						);

						cellElement.find('i').data('tip', data[i][columns[j].key]);
						cellElement.find('i').tip();

						lineElement.append(cellElement);
					}

					this._tableViewerTableContainer.append(lineElement);
				}
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

		updateData: function()
		{
			var self = this;
		
			var dataURL = this.getOption('dataURL');
			var postData = this.getOption('postData');
			var dataTransformFunction = this.getOption('dataTransformFunction');
		
			if(dataURL)
			{
				$.ajax({
					type: 'post',
					url: dataURL,
					data: postData,
					success: function(requestAnswer){
						if(typeof(debugMode) !== 'undefined' && debugMode)
							console.debug(requestAnswer);

						var data = (dataTransformFunction) ? dataTransformFunction(requestAnswer) : requestAnswer;

						self.setOption('data', data);
						self.update();
					},
					error: function(xhr, status, error){
						console.error(xhr.status + ' - ' + xhr.statusText);
					}
				});
			}
		},

		setCurrentPage: function(currentPage)
		{
			var data = this.getOption('data');

			if(data)
			{
				var numberOfPage = Math.ceil(data.length / this.getOption('numberOfLinesPerPage'));
				var newCurrentPage = Math.max(1, Math.min(numberOfPage, currentPage));

				this.setOption('currentPage', newCurrentPage);
			}
		},
	
		changeCurrentPage: function(order)
		{
			var currentPage = this.getOption('currentPage') + order;
	
			this.setCurrentPage(currentPage);
		},
	
		update: function()
		{
			this.setPendingState(true);
			this._addTableViewerStructure();
			this.setPendingState(false);
		},
	
		setData: function(data)
		{
			this.setOption('data', data);
			this.setCurrentPage(1);
		},
	
		getData: function()
		{
			return this.getOption('data');
		},

		highlightColumn: function(columnName, word)
		{
			var columns = this.getOption('columns');

			for(var i = 0; i < columns.length; i++)
			{
				if(columns[i].name === columnName)
					columns[i].highlight = word;
			}
		}
	});
});