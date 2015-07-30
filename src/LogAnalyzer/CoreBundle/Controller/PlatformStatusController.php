<?php

namespace LogAnalyzer\CoreBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

class PlatformStatusController extends Controller
{
	/* Public */

	public function getAlertNotificationAPIAction(Request $request)
	{
		$startTime = microtime(true);

		/* Get return value */

		if($this -> get('PermissionGranter') -> isGranted($request))
		{
			$parameters = $this -> get('Helpers') -> getParameters($request, array(
				'alertNotificationId',
				'alertHuman',
				'active',
				'startTime',
				'endTime'
			));

			$returnValue = $this -> getAlertNotificationAction($parameters);
		}
		else
		{
			$returnValue = 'accessDenied';
		}

		$executionTime = $this -> get('Helpers') -> getExecutionTime($startTime, microtime(true));

		/* Prepare API response data */

		if($returnValue === 'accessDenied')
		{
			$data = array(
				'resultCode' => -1,
				'executionTime' => $executionTime,
				'message' => 'Access denied.'
			);
		}
		elseif(is_array($returnValue))
		{
			$data = array(
				'resultCode' => 1,
				'executionTime' => $executionTime,
				'message' => sizeof($returnValue) . ' alertNotifications have been found.',
				'info' => array('alertNotifications' => $returnValue)
			);
		}
		else
		{
			$data = array(
				'resultCode' => -1,
				'executionTime' => $executionTime,
				'message' => 'Failed to get alertNotifications.'
			);
		}

		/* Return API response */

		return new JsonResponse($data);
	}

	public function clearAlertNotificationAPIAction(Request $request)
	{
		$startTime = microtime(true);

		/* Get return value */

		if($this -> get('PermissionGranter') -> isGranted($request))
		{
			$parameters = $this -> get('Helpers') -> getParameters($request);

			$clearingDate = (isset($parameters['clearingDate'])) ? $parameters['clearingDate'] : null;

			$returnValue = ($clearingDate) ? $this -> clearAlertNotificationAction($clearingDate) : null;
		}
		else
		{
			$returnValue = 'accessDenied';
		}

		$executionTime = $this -> get('Helpers') -> getExecutionTime($startTime, microtime(true));

		/* Prepare API response data */

		if($returnValue === 'accessDenied')
		{
			$data = array(
				'resultCode' => -1,
				'executionTime' => $executionTime,
				'message' => 'Access denied.'
			);
		}
		elseif($returnValue === true)
		{
			$data = array(
				'resultCode' => 1,
				'executionTime' => $executionTime,
				'message' => 'AlertNotifications have been cleared.'
			);
		}
		elseif($returnValue === null)
		{
			$data = array(
				'resultCode' => 1,
				'executionTime' => $executionTime,
				'message' => 'AlertNotifications clearing failed. Not enough parameters.'
			);
		}
		else
		{
			$data = array(
				'resultCode' => -1,
				'executionTime' => $executionTime,
				'message' => 'AlertNotifications clearing failed.',
			);
		}

		/* Return API response */

		return new JsonResponse($data);
	}

	/* Private */

	private function getAlertNotificationAction($clauses = null)
	{
		return $this
			-> getAlertNotificationRepository()
			-> getAlertNotification($clauses);
	}

	private function clearAlertNotificationAction($clearingDate)
	{
		return $this
			-> getAlertNotificationRepository()
			-> clearAlertNotification($clearingDate);
	}

	/* Special */

	private function getAlertNotificationRepository()
	{
		return $this
			-> get('doctrine_mongodb')
			-> getManager()
			-> getRepository('LogAnalyzerCoreBundle:AlertNotification');
	}
}
