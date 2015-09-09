<?php

namespace LogAnalyzer\CoreBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

class DataAccessController extends Controller
{
	/* Public */

	public function getLogAPIAction(Request $request)
	{
		$startTime = microtime(true);

		/* Get return value */

		if($this -> get('PermissionGranter') -> isGranted($request))
		{
			$parameters = $this -> get('Helpers') -> getParameters($request);

			$forceReturn = (isset($parameters['forceReturn']) && $parameters['forceReturn'] === true) ? true : false;

			$clauses = $this -> get('Helpers') -> filterArray($parameters, array(
				'logId',
				'receptionTime',
				'reportedTime',
				'priority',
				'facility',
				'host',
				'service',
				'message',

				'hostLike'
			));

			$returnValue = $this -> getLogAction($clauses, $forceReturn);
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
				'message' => sizeof($returnValue) . ' logs have been found.',
				'info' => array('logs' => $returnValue)
			);
		}
		elseif(is_numeric($returnValue))
		{
			$data = array(
				'resultCode' => -1,
				'executionTime' => $executionTime,
				'message' => 'Log number limit reached (' . $returnValue . '/' . $this -> getConstantRepository() -> getConstantValue('maxLogReturn') . ').'
			);
		}
		else
		{
			$data = array(
				'resultCode' => -1,
				'executionTime' => $executionTime,
				'message' => 'Failed to get logs.'
			);
		}

		/* Return API response */

		return new JsonResponse($data);
	}

	public function getLiveGraphCountAPIAction(Request $request)
	{
		$startTime = microtime(true);

		/* Get return value */

		if($this -> get('PermissionGranter') -> isGranted($request))
		{
			$parameters = $this -> get('Helpers') -> getParameters($request, array(
				'liveGraphCountId',
				'liveGraphHuman',
				'reportedTime',
				'count',
			));

			$returnValue = $this -> getLiveGraphCountAction($parameters);
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
				'message' => sizeof($returnValue) . ' liveGraphCounts have been found.',
				'info' => array('liveGraphCounts' => $returnValue)
			);
		}
		else
		{
			$data = array(
				'resultCode' => -1,
				'executionTime' => $executionTime,
				'message' => 'Failed to get liveGraphCounts.'
			);
		}

		/* Return API response */

		return new JsonResponse($data);
	}

	/* Private */

	private function getLogAction($clauses = null, $forceReturn = false)
	{
		if(! $forceReturn)
		{
			$maxLogReturn = $this
				-> getConstantRepository()
				-> getConstantValue('maxLogReturn');

			$count = $this
				-> getLogRepository()
				-> countLog($clauses);

			if($count > $maxLogReturn)
			{
				return $count;
			}
		}

		return $this
			-> getLogRepository()
			-> getLog($clauses);
	}

	private function getLiveGraphCountAction($clauses = null)
	{
		return $this
			-> getLiveGraphCountRepository()
			-> getLiveGraphCount($clauses);
	}

	/* Special */

	private function getConstantRepository()
	{
		return $this
			-> get('doctrine_mongodb')
			-> getManager()
			-> getRepository('LogAnalyzerCoreBundle:Constant');
	}

	private function getLogRepository()
	{
		return $this
			-> get('doctrine_mongodb')
			-> getManager()
			-> getRepository('LogAnalyzerCoreBundle:Log');
	}

	private function getLiveGraphCountRepository()
	{
		return $this
			-> get('doctrine_mongodb')
			-> getManager()
			-> getRepository('LogAnalyzerCoreBundle:LiveGraphCount');
	}
}
