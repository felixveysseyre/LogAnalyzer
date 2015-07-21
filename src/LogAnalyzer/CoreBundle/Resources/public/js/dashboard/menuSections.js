/* Namespaces */

var logAnalyzer = logAnalyzer || {};
logAnalyzer.dashboard = logAnalyzer.dashboard || {};
logAnalyzer.dashboard.menuSections = logAnalyzer.dashboard.menuSections || {};

/* Variables definitions */

logAnalyzer.dashboard.menuSections.platformStatus =
{
	name: 'Platform status',
	id: 'platformStatusSection',
	icon: 'fa-heartbeat',
	subSections: [
		{name: 'Alert notifications', id: 'alertNotificationSubSection', icon: 'fa-bullhorn', onActivation: logAnalyzer.dashboard.platformStatus.alertNotification}
	]
};

logAnalyzer.dashboard.menuSections.dataAccess =
{
	name: 'Data access',
	id: 'dataAccessSection',
	icon: 'fa-archive',
	subSections: [
		{name: 'Browse', id: 'browseSubSection', icon: 'fa-bars', onActivation: logAnalyzer.dashboard.dataAccess.browseLogTable},
		{name: 'Browse backup', id: 'browseBackupSubSection', icon: 'fa-bars', onActivation: logAnalyzer.dashboard.dataAccess.browseLogBackupTable},
		{name: 'Graph', id: 'graphSubSection', icon: 'fa-area-chart', onActivation: logAnalyzer.dashboard.dataAccess.graphLogTable},
		{name: 'See liveGraph', id: 'liveGraphSubSection', icon: 'fa-area-chart', onActivation: logAnalyzer.dashboard.dataAccess.seeLiveGraph}
	]
};

logAnalyzer.dashboard.menuSections.analysisAdministration =
{
	name: 'Analysis administration',
	id: 'analysisAdministrationSection',
	icon: 'fa-binoculars',
	subSections: [
		{name: 'Manage liveGraphs', id: 'manageLiveGraphSection', icon: 'fa-area-chart', onActivation: logAnalyzer.dashboard.analysisAdministration.manageLiveGraph},
		{name: 'Manage alerts', id: 'manageAlertSection', icon: 'fa-bell', onActivation: logAnalyzer.dashboard.analysisAdministration.manageAlert},
		{name: 'Manage parsers', id: 'manageParserSection', icon: 'fa-tag', onActivation: logAnalyzer.dashboard.analysisAdministration.manageParser}
	]
};

logAnalyzer.dashboard.menuSections.platformAdministration =
{
	name: 'Platform administration',
	id: 'platformAdministrationSection',
	icon: 'fa-sitemap',
	subSections: [
		{name: 'Manage hosts', id: 'manageHostSubSection', icon: 'fa-server', onActivation: logAnalyzer.dashboard.platformAdministration.manageHost},
		{name: 'Manage services', id: 'manageServiceSubSection', icon: 'fa-cubes', onActivation: logAnalyzer.dashboard.platformAdministration.manageService},
		{name: 'Manage collectors', id: 'manageCollectorSubSection', icon: 'fa-university', onActivation: logAnalyzer.dashboard.platformAdministration.manageCollector}
	]
};

logAnalyzer.dashboard.menuSections.databaseAdministration =
{
	name: 'Database administration',
	id: 'databaseAdministrationSection',
	icon: 'fa-database',
	subSections: [
		{name: 'Manage logAccessors', id: 'manageLogAccessorSubSection', icon: 'fa-archive', onActivation: logAnalyzer.dashboard.databaseAdministration.manageLogAccessor},
		{name: 'Manage logTables', id: 'manageLogTableSubSection', icon: 'fa-file', onActivation: logAnalyzer.dashboard.databaseAdministration.manageLogTable}
	]
};

logAnalyzer.dashboard.menuSections.organizationAdministration =
{
	name: 'Organization administration',
	id: 'organizationAdministrationSection',
	icon: 'fa-building',
	subSections: [
		{name: 'Manage users', id: 'manageUserSubSection', icon: 'fa-user', onActivation: logAnalyzer.dashboard.organizationAdministration.manageUser}
	]
};

logAnalyzer.dashboard.menuSections.projectConfiguration =
{
	name: 'Project configuration',
	id: 'projectConfigurationSection',
	icon: 'fa-cog',
	subSections: [
		{name: 'Manage project', id: 'manageProjectSubSection', icon: 'fa-wrench', onActivation: logAnalyzer.dashboard.projectConfiguration.manageProject}
	]
};

logAnalyzer.dashboard.menuSections.projectLogs =
{
	name: 'Project logs',
	id: 'projectLogsSection',
	icon: 'fa-book',
	subSections: [
		{name: 'Project logs', id: 'projectLogsSubSection', icon: 'fa-file-text', onActivation: logAnalyzer.dashboard.projectLogs.projectLogs},
		{name: 'Alert logs', id: 'alertLogsSubSection', icon: 'fa-file-text', onActivation: logAnalyzer.dashboard.projectLogs.alertLogs}
	]
};