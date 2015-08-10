<?php

namespace LogAnalyzer\CoreBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

class NotificationAdministrationController extends Controller
{
	/* Public */

	public function getNotificationToSendAPIAction(Request $request)
	{
		$startTime = microtime(true);

		/* Get return value */

		if($this -> get('PermissionGranter') -> isGranted($request))
		{
			$parameters = $this -> get('Helpers') -> getParameters($request, array(
				'notificationToSendId',
				'type'
			));

			$returnValue = $this -> getNotificationToSendAction($parameters);
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
				'message' => sizeof($returnValue) . ' notificationToSends have been found.',
				'info' => array('notificationToSends' => $returnValue)
			);
		}
		else
		{
			$data = array(
				'resultCode' => -1,
				'executionTime' => $executionTime,
				'message' => 'Failed to get notificationToSends.'
			);
		}

		/* Return API response */

		return new JsonResponse($data);
	}

	/* Private */

	private function getNotificationToSendAction($clauses = null)
	{
		return $this
			-> getNotificationToSendRepository()
			-> getNotificationToSend($clauses);
	}
	/* Special */

	private function getNotificationToSendRepository()
	{
		return $this
			-> get('doctrine_mongodb')
			-> getManager()
			-> getRepository('LogAnalyzerCoreBundle:NotificationToSend');
	}
}
