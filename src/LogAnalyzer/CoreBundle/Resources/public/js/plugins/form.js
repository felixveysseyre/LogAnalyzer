$(function($){
	$.widget('wcd.form', {

		/* Variables */

		/** Private **/

		_ids: null,

		_wait: null,

		/** Public **/

		options: {
			parentModule: null,
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

			/* Clear */

			this.element.empty();

			/** Form **/

			var formContainerStructure = '<form class="formContainer"></form>';

			var formContainerElement = $(formContainerStructure);
			formContainerElement.submit(function(){
				return false;
			});

			this.element.append(formContainerElement);

			/** Fields **/

			var fields = this.getOption('fields');

			if(fields)
			{
				var fieldsContainerElement = $('<table class="fieldsContainer"></table>');

				formContainerElement.append(fieldsContainerElement);

				var fieldContainerStructure =
					'<tr id="#id#" class="#class#">' +
						'<td class="labelContainer"></td>' +
						'<td class="informationContainer"></td>' +
						'<td class="activationContainer"></td>' +
						'<td class="fieldContainer"></td>' +
					'</tr>';

				var fieldContainerElement;

				for(var i = 0; i < fields.length; i++)
				{
					var id = fields[i].id + 'Container';

					/* Field container structure */

					fieldContainerElement = $(fieldContainerStructure
						.replace(/#id#/, id)
						.replace(/#class#/, (fields[i].separator === true) ? 'separator' : '')
					);

					/* Label */

					this._addLabelStructure(fields[i], fieldContainerElement);

					/* Information */

					this._addInformationStructure(fields[i], fieldContainerElement);

					/* Activation */

					this._addActivationStructure(fields[i], fieldContainerElement);

					/* Field */

					this._addFieldStructure(fields[i], fieldContainerElement);

					/* Other */

					fieldContainerElement
						.find('.fieldContainer')
						.click(function(){
							$(this)
								.parent()
								.find('.activationContainer input')
								.prop('checked', true);
						});

					/* Append */

					fieldsContainerElement.append(fieldContainerElement);
				}
			}

			/** Buttons **/

			var buttons = this.getOption('buttons');
			var confirmationRequired = this.getOption('confirmationRequired');

			if(buttons)
			{
				var buttonsContainerElement = $('<div class="buttonsContainer"></div>');

				var buttonContainerStructure = '<button id="#id#" class="#class#" type="button" #options#>#name#</button>';
				var buttonContainerElement;

				var options = (confirmationRequired) ? 'disabled' : '';

				for(var i = 0; i < buttons.length; i++)
				{
					/* Structure */

					buttonContainerElement = $(buttonContainerStructure
						.replace(/#id#/, buttons[i].id)
						.replace(/#class#/, '')
						.replace(/#options#/, options)
						.replace(/#name#/, buttons[i].name)
					);

					/* Logic */

					if(buttons[i].callback)
					{
						(function()
						{
							var callbackTemp = buttons[i].callback;

							if(confirmationRequired)
							{
								buttonContainerElement.click(function(){
									buttonsContainerElement
										.find('button')
										.not('.confirmForm')
										.attr('disabled', true);
									callbackTemp(self.getValues());
								});
							}
							else
							{
								buttonContainerElement.click(function(){
									callbackTemp(self.getValues());
								});
							}
						})();
					}

					buttonsContainerElement.append(buttonContainerElement);
				}

				/** Confirmation **/

				if(confirmationRequired)
				{
					buttonContainerElement = $(buttonContainerStructure
						.replace(/#id#/, '')
						.replace(/#class#/, 'confirmForm')
						.replace(/#options#/, '')
						.replace(/#name#/, 'Confirm')
					);

					buttonContainerElement.click(function(){
						buttonsContainerElement.find('button:disabled').removeAttr('disabled');
					});

					buttonsContainerElement.append(buttonContainerElement);
				}

				formContainerElement.append(buttonsContainerElement);
			}
		},

		_addLabelStructure: function(field, fieldContainerElement)
		{
			var labelStructure = '<label for="#id#">#name#</label>';

			var labelContainerElement = $(labelStructure
					.replace(/#id#/, field.id + 'Activation')
					.replace(/#name#/, field.name)
			);

			fieldContainerElement
				.find('.labelContainer')
				.append(labelContainerElement);
		},

		_addInformationStructure : function(field, fieldContainerElement)
		{
			var informationContainer = fieldContainerElement.find('.informationContainer');

			var informationStructure = '<i data-tip="#tip#" class="#type# fa #icon#"></i>';
			var informationElement;

			if(field.help)
			{
				informationElement = $(informationStructure
					.replace(/#tip#/, field.help)
					.replace(/#type#/, 'help')
					.replace(/#icon#/, 'fa-question-circle')
				);

				informationElement.tip();

				informationContainer.append(informationElement);
			}

			if(field.warning)
			{
				informationElement = $(informationStructure
					.replace(/#tip#/, field.help)
					.replace(/#type#/, 'warning')
					.replace(/#icon#/, 'fa-exclamation-triangle')
				);

				informationContainer.append(informationElement);

				informationElement.tip();
			}
		},

		_addActivationStructure: function(field, fieldContainerElement)
		{
			var defaultActivation = this.getOption('defaultActivation');
			var activation = field.activation;
			var activationElementId = field.id + 'Activation';

			var activationStructure = '<input type="checkbox" id="#id#" name="#id#" class="activation" value="#value#" #options#>';

			var options;

			if(activation === false) options = 'disabled';
			else if(activation === true) options = 'checked disabled';
			else options = (defaultActivation) ? 'checked' : '';

			activationStructure = activationStructure
				.replace(/#id#/g, activationElementId)
				.replace(/#value#/, activationElementId)
				.replace(/#options#/, options);

			this._ids.push({
				id: activationElementId,
				type: 'checkbox'
			});

			fieldContainerElement
				.find('.activationContainer')
				.append(activationStructure);
		},

		_addFieldStructure : function(field, fieldContainerElement)
		{
			if(field.type === 'multiple')
				this._addMultipleFieldStructure(field, fieldContainerElement);
			else if(field.type === 'text')
				this._addTextFieldStructure(field, fieldContainerElement);
			else if(field.type === 'password')
				this._addPasswordFieldStructure(field, fieldContainerElement);
			else if(field.type === 'radio')
				this._addRadioFieldStructure(field, fieldContainerElement);
			else if(field.type === 'checkbox')
				this._addCheckboxFieldStructure(field, fieldContainerElement);
			else if(field.type === 'number')
				this._addNumberFieldStructure(field, fieldContainerElement);
			else if(field.type === 'date' || field.type === 'dateTime')
				this._addDateFieldStructure(field, fieldContainerElement);
			else if(field.type === 'select')
				this._addSelectFieldStructure(field, fieldContainerElement);
			else if(field.type === 'textarea')
				this._addTextAreaFieldStructure(field, fieldContainerElement);
			else
				console.warn('Field type not supported: ', field);
		},

		_addMultipleFieldStructure: function(field, fieldContainerElement)
		{
			for(var i = 0; i < field.fields.length; i++)
			{
				this._addFieldStructure(field.fields[i], fieldContainerElement);
			}
		},

		_addTextFieldStructure: function(field, fieldContainerElement)
		{
			var fieldStructure = '<input type="text" id="#id#" name="#id#" value="#value#" #options#>';

			/* Create the structure */

			var fieldElement = $(fieldStructure
				.replace(/#id#/g, field.id)
				.replace(/#value#/, field.value || '')
				.replace(/#options#/, (field.activation === false) ? 'disabled' : '')
			);

			/* Add ids to the list of ids created */

			this._ids.push({
				id: field.id,
				type: 'text'
			});

			/* Append */

			fieldContainerElement
				.find('.fieldContainer')
				.append(fieldElement);
		},

		_addPasswordFieldStructure: function(field, fieldContainerElement)
		{
			var fieldStructure = '<input type="password" id="#id#" name="#id#" value="#value#" #options#>';

			/* Create the structure */

			var fieldElement = $(fieldStructure
				.replace(/#id#/g, field.id)
				.replace(/#value#/, field.value || '')
				.replace(/#options#/, (field.activation === false) ? 'disabled' : '')
			);

			/* Add ids to the list of ids created */

			this._ids.push({
				id: field.id,
				type: 'password'
			});

			/* Append */

			fieldContainerElement
				.find('.fieldContainer')
				.append(fieldElement);
		},

		_addRadioFieldStructure: function(field, fieldContainerElement)
		{
			var radioStructure =
				'<input type="radio" id="#id#" name="#name#" value="#value#" #options#>' +
				'<label for="#id#">#text#</label>';

			var radioElement;

			/* Create the structure */

			for(var i = 0; i < field.choices.length; i++)
			{
				var options = '';

				if(field.activation === false) options += ' disabled';
				if(field.choices[i].selected === true) options += ' checked';

				radioElement = $(radioStructure
					.replace(/#id#/g, field.id + field.choices[i].value)
					.replace(/#name#/, field.id)
					.replace(/#value#/, field.choices[i].value)
					.replace(/#text#/, field.choices[i].name)
					.replace(/#options#/, options)
				);

				/* Append */

				fieldContainerElement
					.find('.fieldContainer')
					.append(radioElement);
			}

			/* Add ids to the list of ids created */

			this._ids.push({
				id: field.id,
				type: 'radio'
			});
		},

		_addCheckboxFieldStructure: function(field, fieldContainerElement)
		{
			var checkboxStructure =
				'<input type="checkbox" id="#id#" name="#name#" value="#value#" #options#>' +
				'<label for="#id#">#text#</label>';

			var checkboxElement;

			for(var i = 0; i < field.choices.length; i++)
			{
				/* Create the structure */

				var options = '';

				if(field.activation === false) options += ' disabled';
				if(field.choices[i].selected === true) options += ' checked';

				checkboxElement = $(checkboxStructure
					.replace(/#id#/g, field.id + field.choices[i].value)
					.replace(/#name#/, field.id)
					.replace(/#value#/, field.choices[i].value)
					.replace(/#text#/, field.choices[i].name)
					.replace(/#options#/, options)
				);

				/* Add ids to the list of ids created */

				this._ids.push({
					id: field.id + field.choices[i].value,
					type: 'checkbox'
				});

				/* Append */

				fieldContainerElement
					.find('.fieldContainer')
					.append(checkboxElement);
			}
		},

		_addNumberFieldStructure: function(field, fieldContainerElement)
		{
			/* Structure */

			var fieldStructure = '<input type="number" id="#id#" name="#id#" value="#value#" min="#min#" max="#max#" #options#>';

			var fieldStructureElement = $(fieldStructure
				.replace(/#id#/g, field.id)
				.replace(/#value#/, field.value || '')
				.replace(/#min#/, field.min || '')
				.replace(/#max#/, field.max || '')
				.replace(/#options#/, (field.activation === false) ? 'disabled' : '')
			);

			/* Add ids to the list of ids created */

			this._ids.push({
				id: field.id,
				type: 'number'
			});

			/* Append the structure */

			fieldContainerElement
				.find('.fieldContainer')
				.append(fieldStructureElement);
		},
		
		_addDateFieldStructure: function(field, fieldContainerElement)
		{
			var usePicker = this.getOption('usePicker');

			/* Options */

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

			var fieldElement = $(fieldStructure
				.replace(/#id#/g, field.id)
				.replace(/#value#/, field.value || '')
				.replace(/#options#/, (field.activation === false) ? 'disabled' : '')
			);

			/* Add dateTime picker */

			if(usePicker)
			{
				if(field.type === 'dateTime')
				{
					fieldElement.datetimepicker(dateTimePickerOptions);
				}
				else
				{
					fieldElement.datepicker(datePickerOptions);
				}
			}

			/* Add ids to the list of ids created */

			this._ids.push({
				id: field.id,
				type: 'text'
			});

			/* Append the structure */

			fieldContainerElement
				.find('.fieldContainer')
				.append(fieldElement);
		},
		
		_addSelectFieldStructure: function(field, fieldContainerElement)
		{
			/* Create the structure */

			var fieldStructure = '<select id="#id#" name="#id#" #options#></select>';

			var fieldElement = $(fieldStructure
				.replace(/#id#/g, field.id)
				.replace(/#options#/, (field.activation === false) ? 'disabled' : '')
			);

			var optionStructure = '<option value="#value#" #options#>#text#</option>';
			var optionElement;

			if(field.choices)
			{
				for(var i = 0; i < field.choices.length; i++)
				{
					optionElement = $(optionStructure
						.replace(/#value#/, field.choices[i].value)
						.replace(/#text#/, field.choices[i].name)
						.replace(/#options#/, (field.choices[i].selected === true) ? 'selected' : '')
					);

					fieldElement.append(optionElement);
				}
			}

			/* Add ids to the list of ids created */

			this._ids.push({
				id: field.id,
				type: 'select'
			});

			/* Append */

			fieldContainerElement
				.find('.fieldContainer')
				.append(fieldElement);
		},

		_addTextAreaFieldStructure: function(field, fieldContainerElement)
		{
			var fieldStructure = '<textarea id="#id#" name="#id#" #options#>#value#</textarea>';

			/* Create the structure */

			var fieldElement = fieldStructure
				.replace(/#id#/g, field.id)
				.replace(/#value#/, field.value || '')
				.replace(/#options#/, (field.activation === false) ? 'disabled' : '');

			/* Add ids to the list of ids created */

			this._ids.push({
				id: field.id,
				type: 'textarea'
			});

			/* Append */

			fieldContainerElement
				.find('.fieldContainer')
				.append(fieldElement);
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

					if(typeof(field.nameKey) === 'undefined')
					{
						for(var i = 0; i < choicesRaw.length; i++)
						{
							choices.push({
								name: choicesRaw[i],
								value: choicesRaw[i]
							});
						}
					}
					else
					{
						for(var i = 0; i < choicesRaw.length; i++)
						{
							choices.push({
								name: choicesRaw[i][field.nameKey],
								value: (field.valueKey) ? choicesRaw[i][field.valueKey] : JSON.stringify(choicesRaw[i]).replace(/"/g, '\'')
							});
						}
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