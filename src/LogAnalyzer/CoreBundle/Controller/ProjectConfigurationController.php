<?php

namespace LogAnalyzer\CoreBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

class ProjectConfigurationController extends Controller
{
	/* Public */

	public function getInitializationProjectStatusAPIAction(Request $request)
	{
		$startTime = microtime(true);

		/* Get parameters */

		$parameters = $this -> get('Helpers') -> getParameters($request);

		/* Get return value */

		$returnValue = $this -> getInitializationProjectStatusAction();

		$executionTime = $this -> get('Helpers') -> getExecutionTime($startTime, microtime(true));

		/* Prepare API response data */

		if($returnValue)
		{
			$data = array(
				'resultCode' => 1,
				'executionTime' => $executionTime,
				'message' => 'Project already initialized.'
			);
		}
		else
		{
			$data = array(
				'resultCode' => -1,
				'executionTime' => $executionTime,
				'message' => 'Project not initialized yet.'
			);
		}

		/* Return API response */

		return new JsonResponse($data);
	}

	public function getConstantAPIAction(Request $request)
	{
		$startTime = microtime(true);

		/* Get parameters */

		$parameters = $this -> get('Helpers') -> getParameters($request, array(
			'constantId',
			'name',
			'type',
			'value'
		));

		/* Get return value */

		$returnValue = $this -> getConstantAction($parameters);

		$executionTime = $this -> get('Helpers') -> getExecutionTime($startTime, microtime(true));

		/* Prepare API response data */

		if(is_array($returnValue) && sizeof($returnValue) !== 0)
		{
			$data = array(
				'resultCode' => 1,
				'executionTime' => $executionTime,
				'message' => sizeof($returnValue) . ' constants have been found.',
				'info' => array('constants' => $returnValue)
			);
		}
		else
		{
			$data = array(
				'resultCode' => 0,
				'executionTime' => $executionTime,
				'message' => 'Parameters do not match any existing constant.'
			);
		}

		/* Return API response */

		return new JsonResponse($data);
	}

	public function updateConstantAPIAction(Request $request)
	{
		$startTime = microtime(true);

		/* Get parameters */

		$parameters = $this -> get('Helpers') -> getParameters($request);

		/* Get return value */

		$returnValue = $this -> updateConstantAction($parameters);

		$executionTime = $this -> get('Helpers') -> getExecutionTime($startTime, microtime(true));

		/* Prepare API response data */

		if(is_numeric($returnValue))
		{
			$data = array(
				'resultCode' => 1,
				'executionTime' => $executionTime,
				'message' => $returnValue . ' constants have been updated.',
				'info' => array('numberConstantsUpdated' => $returnValue)
			);
		}
		else
		{
			$data = array(
				'resultCode' => 0,
				'executionTime' => $executionTime,
				'message' => 'Parameters do not match any existing constant.'
			);
		}

		/* Return API response */

		return new JsonResponse($data);
	}

	/* Private */

	private function getInitializationProjectStatusAction()
	{
		return $this
			-> getConstantRepository()
			-> getConstantValue('projectInitialized');
	}

	private function getConstantAction($clauses = null)
	{
		return $this
			-> getConstantRepository()
			-> getConstant($clauses);
	}

	private function updateConstantAction($constants)
	{
		$numberConstantsUpdated = 0;

		foreach($constants as $key => $value)
		{
			if($this -> getConstantRepository() -> updateConstantValue($key, $value))
			{
				$numberConstantsUpdated++;
			}
		}

		return $numberConstantsUpdated;
	}

	/* Special */

	private function getConstantRepository()
	{
		return $this
			-> get('doctrine_mongodb')
			-> getManager()
			-> getRepository('LogAnalyzerCoreBundle:Constant');
	}
}
