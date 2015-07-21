/* Namespaces */

var logAnalyzer = logAnalyzer || {};
logAnalyzer.dashboard = logAnalyzer.dashboard || {};

/* Functions declarations */

(function($){
	$(document).ready(function(){
		var navigationContainer = $('#navigationContainer');
		var navigationHeaderContainer = $('#navigationHeaderContainer');
		var menuContainer = $('#menuContainer');
		var signOutContainer = $('#signOutContainer');
		var contentContainer = $('#contentContainer');

		/* Load GoogleChart */

		google.charts.load('current', {packages: ['corechart']});

		/* Menu sliding */

		navigationContainer.addClass('small');
		contentContainer.addClass('large');
		navigationHeaderContainer.addClass('large');

		navigationContainer
			.mouseenter(function(){
				navigationContainer.data('timeOutEnter', setTimeout(function(){
					hideDatePicker();
					navigationContainer.removeClass('small');
				}, 500));

				contentContainer.data('timeOutEnter', setTimeout(function(){
					hideDatePicker();
					contentContainer.removeClass('large');
					navigationHeaderContainer.removeClass('large');
				}, 500));

				clearTimeout(navigationContainer.data('timeOutLeave'));
				clearTimeout(contentContainer.data('timeOutLeave'));
			})
			.mouseleave(function(){
				navigationContainer.data('timeOutLeave', setTimeout(function(){
					hideDatePicker();
					navigationContainer.addClass('small');
				}, 1000));

				contentContainer.data('timeOutLeave', setTimeout(function(){
					hideDatePicker();
					contentContainer.addClass('large');
					navigationHeaderContainer.addClass('large');
				}, 1000));

				clearTimeout(navigationContainer.data('timeOutEnter'));
				clearTimeout(contentContainer.data('timeOutEnter'));
			});

		/* Menu */

		menuContainer.menu(logAnalyzer.dashboard.menu);

		/* SignOut */

		signOutContainer.menu({
			sections: [
				{
					name: userName,
					id: 'signOutSection',
					icon: 'fa-user ',
					onActivation: function(){
						logAnalyzer.toolbox.LogAnalyzerAPICaller.callAPI({
							baseURL: baseURL,
							controller: 'login',
							method: 'signOut',
							successCallback: function(requestAnswer){
								if(requestAnswer.resultCode === 1)
								{
									window.location.replace(baseURL + requestAnswer.info.redirectTo);
								}
								else
								{
									console.error('Sign out failed.');
								}
							}
						});
					}
				}
			]
		});

		/* Specials */

		var hideDatePicker = function(){
			$('.ui-datepicker').hide();
		};

		contentContainer.scroll(function(){
			hideDatePicker();
		});

	});

	/* GUI functions */

	logAnalyzer.dashboard.clearNavigationHeader = function()
	{
		$('#navigationHeaderContainer').empty();
	};

	logAnalyzer.dashboard.loadNavigationHeader = function(section, subSection)
	{
		var spanStructure = '<span class="#class#">#text#</span>';

		var content = '';

		if(section)
		{
			content += spanStructure
				.replace(/#class#/, 'section')
				.replace(/#text#/, section);
		}

		if(subSection)
		{
			content += '<i class="fa fa-angle-right"></i>' +
				spanStructure
				.replace(/#class#/, 'subSection')
				.replace(/#text#/, subSection);
		}

		$('#navigationHeaderContainer').html(content);
	};

	logAnalyzer.dashboard.clearContent = function()
	{
		logAnalyzer.dashboard.clearNavigationHeader();
		logAnalyzer.dashboard.clearPeriodicActions();
		$('#content').empty();
	};

	logAnalyzer.dashboard.loadContent = function(content)
	{
		$('#content').html(content);
	};

	logAnalyzer.dashboard.getContentContainer = function()
	{
		return $('#content');
	};

	logAnalyzer.dashboard.periodicActionsId = [];

	logAnalyzer.dashboard.addPeriodicAction = function(action, interval)
	{
		logAnalyzer.dashboard.periodicActionsId.push(
			setInterval(action, interval)
		);
	};

	logAnalyzer.dashboard.clearPeriodicActions = function()
	{
		var periodicActionsId = logAnalyzer.dashboard.periodicActionsId;

		for(var i = 0; i < periodicActionsId.length; i++)
		{
			clearInterval(periodicActionsId[i]);
		}

		logAnalyzer.dashboard.periodicActionsId = [];
	};

})(jQuery);