<?php

namespace LogAnalyzer\CoreBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

class PlatformAdministrationController extends Controller
{
	/* Public */

	public function getHostAPIAction(Request $request)
	{
		$startTime = microtime(true);

		/* Get return value */

		if($this -> get('PermissionGranter') -> isGranted($request))
		{
			$parameters = $this -> get('Helpers') -> getParameters($request);

			$returnValue = $this -> getHostAction();
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
				'message' => sizeof($returnValue) . ' hosts have been found.',
				'info' => array('hosts' => $returnValue)
			);
		}
		else
		{
			$data = array(
				'resultCode' => -1,
				'executionTime' => $executionTime,
				'message' => 'Failed to get hosts.'
			);
		}

		/* Return API response */

		return new JsonResponse($data);
	}

	public function getServiceAPIAction(Request $request)
	{
		$startTime = microtime(true);

		/* Get return value */

		if($this -> get('PermissionGranter') -> isGranted($request))
		{
			$parameters = $this -> get('Helpers') -> getParameters($request);

			$returnValue = $this -> getServiceAction();
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
				'message' => sizeof($returnValue) . ' services have been found.',
				'info' => array('services' => $returnValue)
			);
		}
		else
		{
			$data = array(
				'resultCode' => -1,
				'executionTime' => $executionTime,
				'message' => 'Failed to get services.'
			);
		}

		/* Return API response */

		return new JsonResponse($data);
	}

	public function getCollectorAPIAction(Request $request)
	{
		$startTime = microtime(true);

		/* Get return value */

		if($this -> get('PermissionGranter') -> isGranted($request))
		{
			$parameters = $this -> get('Helpers') -> getParameters($request, array(
				'collectorId',
				'collectorHuman',
				'IP',
				'port'
			));

			$returnValue = $this -> getCollectorAction($parameters);
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
				'message' => sizeof($returnValue) . ' collectors have been found.',
				'info' => array('collectors' => $returnValue)
			);
		}
		else
		{
			$data = array(
				'resultCode' => -1,
				'executionTime' => $executionTime,
				'message' => 'Failed to get collectors.'
			);
		}

		/* Return API response */

		return new JsonResponse($data);
	}

	public function createCollectorAPIAction(Request $request)
	{
		$startTime = microtime(true);

		/* Get return value */

		if($this -> get('PermissionGranter') -> isGranted($request))
		{
			$parameters = $this -> get('Helpers') -> getParameters($request, array(
				'collectorHuman',
				'IP',
				'port'
			));

			$condition = isset($parameters['collectorHuman'], $parameters['IP'], $parameters['port']);

			$returnValue = ($condition) ? $this -> createCollectorAction($parameters['collectorHuman'], $parameters['IP'], $parameters['port']) : null;
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
				'message' => "Collector '{$parameters['collectorHuman']}' has been created.",
			);
		}
		elseif($returnValue === null)
		{
			$data = array(
				'resultCode' => 0,
				'executionTime' => $executionTime,
				'message' => 'Failed to create collector. Not enough parameters.'
			);
		}
		else
		{
			$data = array(
				'resultCode' => -1,
				'executionTime' => $executionTime,
				'message' => 'Failed to create collector. Collector already exists.'
			);
		}

		/* Return API response */

		return new JsonResponse($data);
	}

	public function deleteCollectorAPIAction(Request $request)
	{
		$startTime = microtime(true);

		/* Get return value */

		if($this -> get('PermissionGranter') -> isGranted($request))
		{
			$parameters = $this -> get('Helpers') -> getParameters($request, array(
				'collectorId',
				'collectorHuman',
				'IP',
				'port'
			));

			$returnValue = $this -> deleteCollectorAction($parameters);
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
		elseif(is_array($returnValue) && sizeof($returnValue) !== 0)
		{
			$data = array(
				'resultCode' => 1,
				'executionTime' => $executionTime,
				'message' => sizeof($returnValue) . ' collectors have been deleted.',
				'info' => array('deletedCollectors' => $returnValue)
			);
		}
		else
		{
			$data = array(
				'resultCode' => -1,
				'executionTime' => $executionTime,
				'message' => 'Parameters do not match any existing collector.',
			);
		}

		/* Return API response */

		return new JsonResponse($data);
	}

	/* Private */

	private function getHostAction()
	{
		$hosts = $this
			-> getLogRepository()
			-> getHost();

		foreach($hosts as $key => $value)
		{
			$hosts[$key] = array('hostHuman' => $value);
		}

		return $hosts;
	}

	private function getServiceAction()
	{
		$services =  $this
			-> getLogRepository()
			-> getService();

		foreach($services as $key => $value)
		{
			$services[$key] = array('serviceHuman' => $value);
		}

		return $services;
	}

	private function getCollectorAction($clauses = null)
	{
		return $this
			-> getCollectorRepository()
			-> getCollector($clauses);
	}

	private function createCollectorAction($collectorHuman, $IP, $port)
	{
		return $this
			-> getCollectorRepository()
			-> createCollector($collectorHuman, $IP, $port);
	}

	private function deleteCollectorAction($clauses = null)
	{
		return $this
			-> getCollectorRepository()
			-> deleteCollectorAndContext($clauses);
	}

	/* Special */

	private function getLogRepository()
	{
		return $this
			-> get('doctrine_mongodb')
			-> getManager()
			-> getRepository('LogAnalyzerCoreBundle:Log');
	}

	private function getCollectorRepository()
	{
		return $this
			-> get('doctrine_mongodb')
			-> getManager()
			-> getRepository('LogAnalyzerCoreBundle:Collector');
	}
}
