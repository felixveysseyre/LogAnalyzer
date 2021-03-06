/* Namespaces */

var logAnalyzer = logAnalyzer || {};
logAnalyzer.dashboard = logAnalyzer.dashboard || {};

/* Variables definitions */

logAnalyzer.dashboard.menu =
{
	onActivation: logAnalyzer.dashboard.clearContent,
	onDeactivation: logAnalyzer.dashboard.clearContent,
	sections: [
		logAnalyzer.dashboard.menuSections.platformStatus,
		logAnalyzer.dashboard.menuSections.dataAccess,
		logAnalyzer.dashboard.menuSections.analysisAdministration,
		logAnalyzer.dashboard.menuSections.platformAdministration,
		logAnalyzer.dashboard.menuSections.organizationAdministration,
		logAnalyzer.dashboard.menuSections.databaseAdministration
	]
};