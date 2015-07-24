$(function($){
	$.widget('wcd.form', {

		/* Variables */

		/** Private **/

		_ids: null,

		_wait: null,

		_formContainer: null,
		_fieldsContainer: null,
		_buttonsContainer: null,

		/** Public **/

		options: {
			parentModule: null,
			id: 'formId',
			defaultActivation: false,
			usePicker: true,
			confirmationRequired: false,
			fields: [],
			buttons: []
		},

		/* Methods */

		/** Private **/

		_create: function()
		{
			/* Initialization */

			this._ids = [];

			/* Create form */

			this.updateData();

			if(! this._wait) this._createStructureAndLogic();
		},

		_createStructureAndLogic: function()
		{
			var self = this;

			/* Structure */

			this.element.empty();

			/** Form **/

			var formContainerStructure = '<form id="#id#" class="formContainer"></form>';

			formContainerStructure = formContainerStructure.replace(/#id#/, this.getOption('id'));

			this.element.append(formContainerStructure);
			this._formContainer = this.element.find('#' + this.getOption('id'));

			/** Fields **/

			var fields = this.getOption('fields');

			if(fields)
			{
				var fieldsContainerStructure = '<table class="fieldsContainer"></table>';

				this._formContainer.append(fieldsContainerStructure);
				this._fieldsContainer = this.element.find('.fieldsContainer');

				var fieldContainerStructure =
					'<tr id="#id#" class="#class#">' +
						'<td class="labelContainer">#label#</td>' +
						'<td class="informationContainer"></td>' +
						'<td class="activationContainer"></td>' +
						'<td class="fieldContainer"></td>' +
					'</tr>';

				var labelStructure = '<label for="#id#">#name#</label>';

				for(var i = 0; i < fields.length; i++)
				{
					var id = fields[i].id + 'Container';
					var labelContainer = labelStructure
						.replace(/#id#/, fields[i].id + 'Activation')
						.replace(/#name#/, fields[i].name);

					var fieldContainerStructureTemp = fieldContainerStructure
						.replace(/#id#/, id)
						.replace(/#title#/, fields[i].help || '')
						.replace(/#class#/, (fields[i].separator === true) ? 'separator' : '')
						.replace(/#label#/, labelContainer);

					this._fieldsContainer.append(fieldContainerStructureTemp);

					this.element
						.find('#' + id + ' .fieldContainer')
						.click(function(){
							$(this)
								.parent()
								.find('.activationContainer input')
								.prop('checked', true);
						});

					this._addInformationStructure(fields[i], id);
					this._addActivationStructure(fields[i], id);
					this._addFieldStructure(fields[i], id);
				}
			}

			/** Buttons **/

			var buttons = this.getOption('buttons');
			var confirmationRequired = this.getOption('confirmationRequired');

			if(buttons)
			{
				var buttonsContainerStructure = '<div class="buttonsContainer"></div>';

				this._formContainer.append(buttonsContainerStructure);
				this._buttonsContainer = this.element.find('.buttonsContainer');

				var buttonContainerStructure = '<button id="#id#" class="#class#" type="button" #options#>#name#</button>';

				var options = (confirmationRequired) ? 'disabled' : '';

				for(var i = 0; i < buttons.length; i++)
				{
					/* Structure */

					var buttonContainerStructureTemp = buttonContainerStructure
						.replace(/#id#/, buttons[i].id)
						.replace(/#class#/, '')
						.replace(/#options#/, options)
						.replace(/#name#/, buttons[i].name);

					this._buttonsContainer.append(buttonContainerStructureTemp);

					/* Logic */

					if(buttons[i].callback)
					{
						(function()
						{
							var callbackTemp = buttons[i].callback;

							if(confirmationRequired)
							{
								self.element
									.find('#' + buttons[i].id)
									.click(function(){
										self._buttonsContainer
											.find('button')
											.not('.confirmForm')
											.attr('disabled', true);
										callbackTemp(self.getValues());
									});
							}
							else
							{
								self.element
									.find('#' + buttons[i].id)
									.click(function(){
										callbackTemp(self.getValues());
									});
							}
						})();
					}
				}

				/** Confirmation **/

				if(confirmationRequired)
				{
					var buttonContainerStructureTemp = buttonContainerStructure
						.replace(/#id#/, '')
						.replace(/#class#/, 'confirmForm')
						.replace(/#options#/, '')
						.replace(/#name#/, 'Confirm');

					this._buttonsContainer.append(buttonContainerStructureTemp);

					this._buttonsContainer
						.find('.confirmForm')
						.click(function(){
							self._buttonsContainer.find('button:disabled').removeAttr('disabled');
						});
				}
			}
		},

		_addActivationStructure: function(field, fieldContainerId)
		{
			var defaultActivation = this.getOption('defaultActivation');
			var activation = field.activation;
			var activationElementId = field.id + 'Activation';

			var activationStructure = '<input type="checkbox" id="#id#" name="#id#" class="activation" value="#value#" #options#>';

			var options;

			activationStructure = activationStructure
				.replace(/#id#/g, activationElementId)
				.replace(/#value#/, activationElementId);

			if(activation === false) options = 'disabled';
			else if(activation === true) options = 'checked disabled';
			else options = (defaultActivation) ? 'checked' : '';

			activationStructure = activationStructure.replace(/#options#/, options);

			this._ids.push({
				id: activationElementId,
				type: 'checkbox'
			});

			this.element
				.find('#' + fieldContainerId +' .activationContainer')
				.append(activationStructure);
		},

		_addFieldStructure : function(field, fieldContainerId)
		{
			if(field.type === 'multiple')
				this._addMultipleFieldStructure(field, fieldContainerId);
			else if(field.type === 'text')
				this._addTextFieldStructure(field, fieldContainerId);
			else if(field.type === 'password')
				this._addPasswordFieldStructure(field, fieldContainerId);
			else if(field.type === 'radio')
				this._addRadioFieldStructure(field, fieldContainerId);
			else if(field.type === 'checkbox')
				this._addCheckboxFieldStructure(field, fieldContainerId);
			else if(field.type === 'number')
				this._addNumberFieldStructure(field, fieldContainerId);
			else if(field.type === 'date' || field.type === 'dateTime')
				this._addDateFieldStructure(field, fieldContainerId);
			else if(field.type === 'select')
				this._addSelectFieldStructure(field, fieldContainerId);
			else if(field.type === 'textarea')
				this._addTextareaFieldStructure(field, fieldContainerId);
			else
				console.warn('Field type not supported: ', field);
		},

		_addMultipleFieldStructure: function(field, fieldContainerId)
		{
			for(var i = 0; i < field.fields.length; i++)
			{
				this._addFieldStructure(field.fields[i], fieldContainerId);
			}
		},

		_addTextFieldStructure: function(field, fieldContainerId)
		{
			var fieldStructure = '<input type="text" id="#id#" name="#id#" value="#value#" #options#>';

			/* Create the structure */

			var options = '';

			if(field.activation === false) options += 'disabled';

			fieldStructure = fieldStructure
				.replace(/#id#/g, field.id)
				.replace(/#value#/, field.value || '')
				.replace(/#options#/, options);

			/* Add ids to the list of ids created */

			this._ids.push({
				id: field.id,
				type: 'text'
			});

			/* Append */

			this.element
				.find('#' + fieldContainerId + ' .fieldContainer')
				.append(fieldStructure);
		},

		_addPasswordFieldStructure: function(field, fieldContainerId)
		{
			var fieldStructure = '<input type="password" id="#id#" name="#id#" value="#value#" #options#>';

			/* Create the structure */

			var options = '';

			if(field.activation === false) options += 'disabled';

			fieldStructure = fieldStructure
				.replace(/#id#/g, field.id)
				.replace(/#value#/, field.value || '')
				.replace(/#options#/, options);

			/* Add ids to the list of ids created */

			this._ids.push({
				id: field.id,
				type: 'password'
			});

			/* Append */

			this.element
				.find('#' + fieldContainerId + ' .fieldContainer')
				.append(fieldStructure);
		},

		_addRadioFieldStructure: function(field, fieldContainerId)
		{
			var fieldStructure = '';

			var radioStructure =
				'<input type="radio" id="#id#" name="#name#" value="#value#" #options#>' +
				'<label for="#id#">#text#</label>';

			/* Create the structure */

			for(var i = 0; i < field.choices.length; i++)
			{
				var options = '';

				if(field.activation === false) options += ' disabled';
				if(field.choices[i].selected === true) options += ' checked';

				var radioStructureTemp = radioStructure
					.replace(/#id#/g, field.id + field.choices[i].value)
					.replace(/#name#/, field.id)
					.replace(/#value#/, field.choices[i].value)
					.replace(/#text#/, field.choices[i].name)
					.replace(/#options#/, options);

				fieldStructure += radioStructureTemp;
			}

			/* Add ids to the list of ids created */

			this._ids.push({
				id: field.id,
				type: 'radio'
			});

			/* Append */

			this.element
				.find('#' + fieldContainerId + ' .fieldContainer')
				.append(fieldStructure);
		},

		_addCheckboxFieldStructure: function(field, fieldContainerId)
		{
			var fieldStructure = '';

			var checkboxStructure =
				'<input type="checkbox" id="#id#" name="#name#" value="#value#" #options#>' +
				'<label for="#id#">#text#</label>';

			for(var i = 0; i < field.choices.length; i++)
			{
				/* Create the structure */

				var options = '';

				if(field.activation === false) options += ' disabled';
				if(field.choices[i].selected === true) options += ' checked';

				var checkboxStructureTemp = checkboxStructure
					.replace(/#id#/g, field.id + field.choices[i].value)
					.replace(/#name#/, field.id)
					.replace(/#value#/, field.choices[i].value)
					.replace(/#text#/, field.choices[i].name)
					.replace(/#options#/, options);

				fieldStructure += checkboxStructureTemp;

				/* Add ids to the list of ids created */

				this._ids.push({
					id: field.id + field.choices[i].value,
					type: 'checkbox'
				});
			}

			/* Append */

			this.element
				.find('#' + fieldContainerId + ' .fieldContainer')
				.append(fieldStructure);
		},

		_addNumberFieldStructure: function(field, fieldContainerId)
		{
			/* Options */

			var options = '';

			if(field.activation === false) options += ' disabled';

			/* Structure */

			var fieldStructure = '<input type="number" id="#id#" name="#id#" value="#value#" min="#min#" max="#max#" #options#>';

			/* Append the structure */

			this.element
				.find('#' + fieldContainerId + ' .fieldContainer')
				.append(fieldStructure
					.replace(/#id#/g, field.id)
					.replace(/#value#/g, field.value || '')
					.replace(/#min#/g, field.min || '')
					.replace(/#max#/g, field.max || '')
					.replace(/#options#/g, options)
			);

			/* Add ids to the list of ids created */

			this._ids.push({
				id: field.id,
				type: 'number'
			});
		},
		
		_addDateFieldStructure: function(field, fieldContainerId)
		{
			var usePicker = this.getOption('usePicker');

			/* Options */

			var options = '';

			if(field.activation === false) options += ' disabled';

			var datePickerOptions = {
				dateFormat: 'yy-mm-dd',
				firstDay: 1,
				showButtonPanel: false
			};

			var dateTimePickerOptions = {
				dateFormat: 'yy-mm-dd',
				timeFormat: 'HH:mm:ss',
				stepHour: 1,
				stepMinute: 1,
				stepSecond: 1,
				showButtonPanel: false
			};

			/* Structure */

			var fieldStructure = '<input type="text" id="#id#" name="#id#" value="#value#" #options#>';

			/* Append the structure */

			this.element
				.find('#' + fieldContainerId + ' .fieldContainer')
				.append(fieldStructure
					.replace(/#id#/g, field.id)
					.replace(/#value#/, field.value || '')
					.replace(/#options#/, options)
			);

			/* Add ids to the list of ids created */

			this._ids.push({
				id: field.id,
				type: 'text'
			});

			/* Add dateTime picker */

			if(usePicker)
			{
				if(field.type === 'dateTime')
				{
					$('#' + field.id).datetimepicker(dateTimePickerOptions);
				}
				else
				{
					$('#' + field.id).datepicker(datePickerOptions);
				}
			}
		},
		
		_addSelectFieldStructure: function(field, fieldContainerId)
		{
			var fieldStructure =
				'<select id="#id#" name="#id#" #options#>' +
					'#optionStructures#' +
				'</select>';

			var optionStructure = '<option value="#value#" #options#>#text#</option>';

			var optionStructures = '';

			/* Create the structure */

			if(field.choices)
			{
				var options;

				for(var i = 0; i < field.choices.length; i++)
				{
					var optionStructureTemp = optionStructure
						.replace(/#value#/, field.choices[i].value)
						.replace(/#text#/, field.choices[i].name)
						.replace(/#options#/, (field.choices[i].selected === true) ? 'selected' : '');

					optionStructures += optionStructureTemp;
				}
			}

			if(field.activation === false) options = 'disabled';

			fieldStructure = fieldStructure
				.replace(/#id#/g, field.id)
				.replace(/#optionStructures#/, optionStructures)
				.replace(/#options#/, options);

			/* Add ids to the list of ids created */

			this._ids.push({
				id: field.id,
				type: 'select'
			});

			/* Append */

			this.element
				.find('#' + fieldContainerId + ' .fieldContainer')
				.append(fieldStructure);
		},

		_addTextareaFieldStructure: function(field, fieldContainerId)
		{
			var fieldStructure = '<textarea id="#id#" name="#id#" #options#>#value#</textarea>';

			/* Create the structure */

			var options = '';

			if(field.activation === false) options += 'disabled';

			fieldStructure = fieldStructure
				.replace(/#id#/g, field.id)
				.replace(/#value#/, field.value || '')
				.replace(/#options#/, options);

			/* Add ids to the list of ids created */

			this._ids.push({
				id: field.id,
				type: 'textarea'
			});

			/* Append */

			this.element
				.find('#' + fieldContainerId + ' .fieldContainer')
				.append(fieldStructure);
		},

		_addInformationStructure : function(field, fieldContainerId)
		{
			var informationStructure = '';

			if(field.help)
			{
				var helpStructure = '<i title="#help#" class="help fa fa-question-circle"></i>';

				informationStructure += helpStructure.replace(/#help#/, field.help);
			}

			if(field.warning)
			{
				var warningStructure = '<i title="#warning#" class="warning fa fa-exclamation-triangle"></i>';

				informationStructure += warningStructure.replace(/#warning#/, field.warning);
			}

			/* Append */

			this.element
				.find('#' + fieldContainerId + ' .informationContainer')
				.append(informationStructure);
		},

		_updateFieldData : function(field)
		{
			var self = this;

			$.ajax({
				type: 'POST',
				url: field.choicesURL,
				data: field.postData || {},
				success: function(requestAnswer) {
					if(typeof(debugMode) !== 'undefined' && debugMode) console.debug(requestAnswer);

					var choicesRaw = (field.choicesTransformFunction) ? field.choicesTransformFunction(requestAnswer) : requestAnswer;

					var choices = [];

					for(var i = 0; i < choicesRaw.length; i++)
					{
						choices.push({
							name: choicesRaw[i][field.nameKey],
							value: (field.valueKey) ? choicesRaw[i][field.valueKey] : JSON.stringify(choicesRaw[i]).replace(/"/g, '\'')
						});
					}

					field.choices = choices;
					self.update();
				},
				error: function(xhr, status, error) {
					console.error(xhr.status + ' - ' + xhr.statusText);
				}
			});
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

			var fields = this.getOption('fields');

			var wait = false;

			var temp = function(field)
			{
				if(field.type === 'select' && field.choicesURL)
				{
					wait = true;

					self._updateFieldData(field);
				}
			};

			for(var i = 0; i < fields.length; i++)
			{
				if(fields[i].type === 'multiple')
				{
					for(var j = 0; j < fields[i].fields.length; j++)
					{
						temp(fields[i].fields[j]);
					}
				}

				temp(fields[i]);
			}

			this._wait = wait;
		},

		update: function()
		{
			this.setPendingState(true);
			this._createStructureAndLogic();
			this.setPendingState(false);
		},

		getValues: function()
		{
			var formValues = [];
	
			var ids = this._ids;
	
			/* Fields */
	
			for(var i = 0; i < ids.length; i++)
			{
				var name = ids[i].id;
	
				var value;
	
				if(ids[i].type === 'radio')
					value = this.element.find('*[name=' + name + ']:checked').val();
				else if(ids[i].type === 'checkbox')
					value = this.element.find('#' + name).prop('checked');
				else
					value = this.element.find('#' + name).val();
	
				formValues[name] = value;
			}
	
			return formValues;
		}
	});
});