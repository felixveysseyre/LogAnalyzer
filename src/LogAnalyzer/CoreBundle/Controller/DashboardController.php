<?php

namespace LogAnalyzer\CoreBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class DashboardController extends Controller
{
	/* Public */

	public function indexAction(Request $request)
	{
		$currentUser = $request -> getSession() -> get('currentUser');

		if($currentUser)
		{
			return $this -> render('LogAnalyzerCoreBundle:Dashboard:index.html.twig', array(
				'title' => 'Dashboard',
				'cssFiles' => array(
					'internal' => array(
						'fontAwesome/css/font-awesome.min.css'
					)
				),
				'lessFiles' => array(
					'internal' => array(
						'dashboard/dashboard.less',

						'plugins/module.less',
						'plugins/form.less',
						'plugins/codeViewer.less',
						'plugins/tableViewer.less',
						'plugins/requestViewer.less',
						'plugins/exporter.less',
						'plugins/dataPlotter.less',
					)
				),
				'jsFiles' => array(
					'internal' => array(
						'jquery-2.1.3.min.js',
						'jquery-ui.min.js',
						'less-2.3.1.min.js',

						'jquery-ui-timepicker-addon.js',

						'plugins/menu.js',
						'plugins/module.js',
						'plugins/form.js',
						'plugins/codeViewer.js',
						'plugins/tableViewer.js',
						'plugins/dataPlotter.js',
						'plugins/requestViewer.js',
						'plugins/exporter.js',

						'toolboxes/LogAnalyzerAPICaller.js',
						'toolboxes/array.js',
						'toolboxes/date.js',
						'toolboxes/log.js',

						'dashboard/projectConfiguration/manageProject.js',
						'dashboard/organizationAdministration/manageUser.js',
						'dashboard/platformAdministration/manageHost.js',
						'dashboard/platformAdministration/manageService.js',
						'dashboard/platformAdministration/manageCollector.js',
						'dashboard/analysisAdministration/manageLiveGraph.js',
						'dashboard/analysisAdministration/manageParser.js',

						'dashboard/dataAccess/browseLogTable.js',
						'dashboard/dataAccess/graphLogTable.js',
						'dashboard/dataAccess/seeLiveGraph.js',

						'dashboard/dashboard.js',
						'dashboard/menuSections.js',
						'dashboard/menuTemp.js'
					),
					'external' => array(
						'https://www.gstatic.com/charts/loader.js'
					)
				),
				'jsVariables' => array(
					'debugMode' => $this -> getConstantRepository() -> getConstantValue('debugMode'),
					'baseURL' => $this
						-> get('router')
						-> getContext()
						-> getBaseUrl(),
					'userName' => $currentUser-> getFullName()
				)
			));
		}
		else
		{
			return $this -> redirect($this -> generateUrl('LogAnalyzer_Login_index'));
		}
	}

	/* Private */

	/* Special */

	private function getConstantRepository()
	{
		return $this
			-> get('doctrine_mongodb')
			-> getManager()
			-> getRepository('LogAnalyzerCoreBundle:Constant');
	}
}
