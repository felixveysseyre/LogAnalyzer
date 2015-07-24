$(function($){
	$.widget('wcd.tableViewer', {

		/* Variables */

		/** Private **/

		_tableViewerContainer: null,
		_tableViewerTableContainer: null,
		_tableViewerNavigationContainer: null,
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


			this.element.append(tableViewerContainerStructure);
			this._tableViewerContainer = this.element.find('.tableViewerContainer');

			this._tableViewerContainer.append(tableViewerTableContainerStructure);
			this._tableViewerTableContainer = this.element.find('.tableViewerTableContainer');

			if(this.getOption('pagination'))
			{
				this._tableViewerContainer.prepend(tableViewerNavigationContainerStructure.replace(/#class#/, 'previous'));
				this._tableViewerContainer.append(tableViewerNavigationContainerStructure.replace(/#class#/, 'next'));

				this._tableViewerNavigationContainer = this.element.find('.tableViewerNavigationContainer');

				this._tableViewerNavigationContainerPrevious = this.element.find('.tableViewerNavigationContainer.previous');
				this._tableViewerNavigationContainerNext = this.element.find('.tableViewerNavigationContainer.next');
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
				var selectStructure =
					'<select id="#id#" name="#id#">' +
						'#optionStructures#' +
					'</select>';

				var optionStructure = '<option value="#value#" #options#>#text#</option>';

				var optionStructures;

				/* Clear */

				this._tableViewerNavigationContainer.empty();

				/* Number of line per page selector */

				optionStructures = '';

				var numberOfLinesPerPagePossibility = this.getOption('numberOfLinesPerPagePossibility');

				for(var i = 0; i < numberOfLinesPerPagePossibility.length; i++)
				{
					optionStructures += optionStructure
						.replace(/#value#/, numberOfLinesPerPagePossibility[i])
						.replace(/#options#/, (numberOfLinesPerPagePossibility[i] == numberOfLinesPerPage) ? 'selected' : '')
						.replace(/#text#/, numberOfLinesPerPagePossibility[i]);
				}

				var numberOfLinesPerPageField = selectStructure
					.replace(/#id#/g, 'numberOfLinesPerPage')
					.replace(/#optionStructures#/, optionStructures);

				/* Current page selector */

				optionStructures = '';

				var numberOfPage = (data) ? Math.ceil(data.length / numberOfLinesPerPage) : 0;

				for(var i = 1; i <= numberOfPage; i++)
				{
					optionStructures += optionStructure
						.replace(/#value#/, i)
						.replace(/#options#/, (i == currentPage) ? 'selected' : '')
						.replace(/#text#/, i + '/' + numberOfPage);
				}

				var currentPageStructureField = selectStructure
					.replace(/#id#/g, 'currentPage')
					.replace(/#optionStructures#/, optionStructures);

				/* Structure */

				var navigationStructure =
					'<tr>' +
						'<td class="numberOfLinesPerPage">#numberOfLinesPerPage#</td>' +
						'<td class="navigation">#navigationText#</td>' +
						'<td class="currentPage">#currentPage#</td>' +
					'</tr>';

				this._tableViewerNavigationContainerPrevious
					.append(navigationStructure
						.replace(/#numberOfLinesPerPage#/, numberOfLinesPerPageField)
						.replace(/#navigationText#/, this.getOption('previousText'))
						.replace(/#currentPage#/, currentPageStructureField)
				);

				this._tableViewerNavigationContainerNext
					.append(navigationStructure
						.replace(/#numberOfLinesPerPage#/, numberOfLinesPerPageField)
						.replace(/#navigationText#/, this.getOption('nextText'))
						.replace(/#currentPage#/, currentPageStructureField)
				);

				/* Logic */

				this._tableViewerNavigationContainerPrevious
					.find('.navigation')
					.click(function(){
						self.changeCurrentPage(-1);
						self.update();
					});

				this._tableViewerNavigationContainerNext
					.find('.navigation')
					.click(function(){
						self.changeCurrentPage(+1);
						self.update();
					});

				this._tableViewerNavigationContainer
					.find('.numberOfLinesPerPage #numberOfLinesPerPage')
					.change(function(){
						self.setOption('numberOfLinesPerPage', $(this).val());
						self.setCurrentPage(1);
						self.update();
					});

				this._tableViewerNavigationContainer
					.find('.currentPage #currentPage')
					.change(function(){
						self.setCurrentPage($(this).val());
						self.update();
					});
			}

			/* Data */

			this._tableViewerTableContainer.empty();

			if(data)
			{
				var columns = this.getOption('columns');
				var lineClassDeterminationFunction = this.getOption('lineClassDeterminationFunction');
				var showHeader = this.getOption('showHeader');
				var showLineNumbers = this.getOption('showLineNumbers');

				var tableViewerTableStructure = '';
				var lineContentTemp = '';

				var lineStructure = '<tr class="#class#">#lineContent#</tr>';
				var cellStructure = '<td class="#class#">#cellContent#</td>\n';
				var headerCellStructure = '<th class="#class#" style="width: #width#;">#headerCellContent#</th>';

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
					if(showLineNumbers)
					{
						lineContentTemp += headerCellStructure
							.replace(/#class#/, 'lineNumber')
							.replace(/#width#/, '')
							.replace(/#headerCellContent#/, '#');
					}

					for(var i = 0; i < columns.length; i++)
					{
						lineContentTemp += headerCellStructure
							.replace(/#class#/, '')
							.replace(/#width#/, columns[i].width || '')
							.replace(/#headerCellContent#/, columns[i].name || '');
					}

					tableViewerTableStructure += lineStructure
						.replace(/#class#/, '')
						.replace(/#lineContent#/, lineContentTemp);
				}

				/* Select lines */

				var iMin = (pagination === false) ? (0) : (Math.max(0, (currentPage - 1) * numberOfLinesPerPage));
				var iMax = (pagination === false) ? (data.length - 1) : (Math.min(data.length - 1, currentPage * numberOfLinesPerPage - 1));

				/* Loop on lines */

				for(var i = iMin; i <= iMax; i++)
				{
					lineContentTemp = '';

					if(showLineNumbers)
					{
						lineContentTemp += cellStructure
							.replace(/#class#/, 'lineNumber')
							.replace(/#cellContent#/, i + 1);
					}

					for(var j = 0; j < columns.length; j++)
					{
						var cellContent = data[i][columns[j].key];

						cellContent = (columns[j].highlight) ? cellContent.replace(new RegExp(columns[j].highlight, 'gi'), '<span class="highlighted">' + columns[j].highlight +'</span>') : cellContent;

						lineContentTemp += cellStructure
							.replace(/#class#/, '')
							.replace(/#cellContent#/, cellContent);
					}

					var color = (lineClassDeterminationFunction) ? lineClassDeterminationFunction(data[i]) : '';

					tableViewerTableStructure += lineStructure
						.replace(/#class#/, color)
						.replace(/#lineContent#/, lineContentTemp);
				}

				this._tableViewerTableContainer.append(tableViewerTableStructure);
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
					type: 'POST',
					url: dataURL,
					data: postData,
					success: function(requestAnswer){
						if(typeof(debugMode) !== 'undefined' && debugMode) console.debug(requestAnswer);

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