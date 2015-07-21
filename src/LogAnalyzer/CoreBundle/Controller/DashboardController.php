<?php

namespace LogAnalyzer\CoreBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DashboardController extends Controller
{
	public function indexAction()
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
					'toolboxes/log.js'
				),
				'external' => array(
					'https://www.gstatic.com/charts/loader.js'
				)
			),
			'jsVariables' => array(
				'debugMode' => true,
				'baseURL' => "test",
				'userName' => 8
			)
		));
	}
}
