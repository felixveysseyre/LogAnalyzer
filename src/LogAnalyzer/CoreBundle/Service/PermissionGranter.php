<?php

namespace LogAnalyzer\CoreBundle\Service;

use Symfony\Component\HttpFoundation\Request;

class PermissionGranter
{
	private $permissions;

	/* Public */

	public function __construct()
	{
		$this -> permissions = array(
			/*'dataManipulation' => array(
				'cleanLiveGraphCountAPI' => false,
				'computeLiveGraphCountAPI' => false,
			),
			'projectLogs' => array(
				'getProjectLogAPI' => array(
					'Project Administrator'
				),
				'getAlertLogAPI' => array(
					'Project Administrator'
				),
			),*/
			'projectConfiguration' => array(
				'getInitializationProjectStatusAPI' => array(
					'Project Administrator'
				),
				'getConstantAPI' => array(
					'Project Administrator'
				),
				'updateConstantAPI' => array(
					'Project Administrator'
				)
			),
			'organizationAdministration' => array(
				'getRoleAPI' => array(
					'Project Administrator',
					'Platform Administrator'
				),
				'getUserAPI' => true,
				'createUserAPI' => array(
					'Project Administrator',
					'Platform Administrator'
				),
				'deleteUserAPI' => array(
					'Project Administrator',
					'Platform Administrator'
				)
			),
			'platformAdministration' => array(
				'getHostAPI' => array(
					'Project Administrator',
					'Platform Administrator',
					'Platform User'
				),
				'getServiceAPI' => array(
					'Project Administrator',
					'Platform Administrator',
					'Platform User'
				),
				'getCollectorAPI' => array(
					'Project Administrator',
					'Platform Administrator',
					'Platform User'
				),
				'createCollectorAPI' => array(
					'Project Administrator',
					'Platform Administrator'
				),
				'deleteCollectorAPI' => array(
					'Project Administrator',
					'Platform Administrator'
				)
			),
			'analysisAdministration' => array(
				'getLiveGraphAPI' => array(
					'Project Administrator',
					'Platform Administrator',
					'Platform User'
				),
				'createLiveGraphAPI' => array(
					'Project Administrator',
					'Platform Administrator',
					'Platform User'
				),
				'deleteLiveGraphAPI' => array(
					'Project Administrator',
					'Platform Administrator',
					'Platform User'
				),
				'getAlertAPI' => array(
					'Project Administrator',
					'Platform Administrator',
					'Platform User'
				),
				'createAlertAPI' => array(
					'Project Administrator',
					'Platform Administrator',
					'Platform User'
				),
				'deleteAlertAPI' => array(
					'Project Administrator',
					'Platform Administrator',
					'Platform User'
				),
				'getParserAPI' => array(
					'Project Administrator',
					'Platform Administrator',
					'Platform User'
				),
				'createParserAPI' => array(
					'Project Administrator',
					'Platform Administrator',
					'Platform User'
				),
				'deleteParserAPI' => array(
					'Project Administrator',
					'Platform Administrator',
					'Platform User'
				)
			),
			'dataAccess' => array(
				'getLogAPI' => array(
					'Project Administrator',
					'Platform Administrator',
					'Platform User'
				),
				/*'getLiveGraphCountAPI' => array(
					'Project Administrator',
					'Platform Administrator',
					'Platform User'
				),*/
			),
			'platformStatus' => array(
				'getAlertNotificationAPI' => array(
					'Project Administrator',
					'Platform Administrator',
					'Platform User'
				),
				'clearAlertNotificationAPI' => array(
					'Project Administrator',
					'Platform Administrator',
					'Platform User'
				),
			),
			'login' => array(
				'signInAPI' => true,
				'signOutAPI' => true,
			)
		);
	}

	public function isGranted($request)
	{
		$currentUser = $this -> getCurrentUser($request);
		$controllerAndAction = $this -> getControllerAndAction($request);

		$controller = $controllerAndAction['controller'];
		$action = $controllerAndAction['action'];

		if(isset($this -> permissions[$controller], $this -> permissions[$controller][$action]))
		{
			$rolesGranted = $this -> permissions[$controller][$action];

			if(is_array($rolesGranted))
			{
				if($currentUser)
				{
					return in_array($currentUser -> getRoleHuman(), $rolesGranted);
				}
				else
				{
					return false;
				}
			}
			else
			{
				return $rolesGranted;
			}
		}
		else
		{
			return null;
		}
	}

	/* Private */

	private function getControllerAndAction($request)
	{
		$fullPath = $request -> attributes -> get('_controller');

		$parts = explode('\\', $fullPath);

		$path = end($parts);

		$parts = explode('::', $path);

		return array(
			'controller' => lcfirst(substr($parts[0], 0, -10)),
			'action' => substr($parts[1], 0, -6)
		);
	}

	private function getCurrentUser($request)
	{
		return $request
			-> getSession()
			-> get('currentUser');
	}
}
