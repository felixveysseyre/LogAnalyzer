<?php

namespace LogAnalyzer\CoreBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

class DatabaseAdministrationController extends Controller
{
	/* Public */

	public function getRetentionRuleAPIAction(Request $request)
	{
		$startTime = microtime(true);

		/* Get return value */

		if($this -> get('PermissionGranter') -> isGranted($request))
		{
			$parameters = $this -> get('Helpers') -> getParameters($request, array(
				'retentionRuleId',
				'service',
				'retention'
			));

			$returnValue = $this -> getRetentionRuleAction($parameters);
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
				'message' => sizeof($returnValue) . ' retentionRules have been found.',
				'info' => array('retentionRules' => $returnValue)
			);
		}
		else
		{
			$data = array(
				'resultCode' => -1,
				'executionTime' => $executionTime,
				'message' => 'Failed to get retentionRules.'
			);
		}

		/* Return API response */

		return new JsonResponse($data);
	}

	public function createRetentionRuleAPIAction(Request $request)
	{
		$startTime = microtime(true);

		/* Get return value */

		if($this -> get('PermissionGranter') -> isGranted($request))
		{
			$parameters = $this -> get('Helpers') -> getParameters($request, array(
				'service',
				'retention'
			));

			$condition = isset($parameters['service'], $parameters['retention']);

			$returnValue = ($condition) ? $this -> createRetentionRuleAction($parameters['service'], $parameters['retention']) : null;
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
				'message' => "RetentionRule '{$parameters['service']}' has been created.",
			);
		}
		elseif($returnValue === null)
		{
			$data = array(
				'resultCode' => 0,
				'executionTime' => $executionTime,
				'message' => 'Failed to create retentionRule. Not enough parameters.'
			);
		}
		else
		{
			$data = array(
				'resultCode' => -1,
				'executionTime' => $executionTime,
				'message' => 'Failed to create retentionRule. RetentionRule already exists.'
			);
		}

		/* Return API response */

		return new JsonResponse($data);
	}

	public function deleteRetentionRuleAPIAction(Request $request)
	{
		$startTime = microtime(true);

		/* Get return value */

		if($this -> get('PermissionGranter') -> isGranted($request))
		{
			$parameters = $this -> get('Helpers') -> getParameters($request, array(
				'retentionRuleId',
				'service',
				'retention'
			));

			$returnValue = $this -> deleteRetentionRuleAction($parameters);
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
				'message' => sizeof($returnValue) . ' retentionRules have been deleted.',
				'info' => array('deletedRetentionRules' => $returnValue)
			);
		}
		else
		{
			$data = array(
				'resultCode' => -1,
				'executionTime' => $executionTime,
				'message' => 'Parameters do not match any existing retentionRule.',
			);
		}

		/* Return API response */

		return new JsonResponse($data);
	}
	
	/* Private */

	private function getRetentionRuleAction($clauses = null)
	{
		return $this
			-> getRetentionRuleRepository()
			-> getRetentionRule($clauses);
	}

	private function createRetentionRuleAction($service, $retention)
	{
		return $this
			-> getRetentionRuleRepository()
			-> createRetentionRule($service, $retention);
	}

	private function deleteRetentionRuleAction($clauses = null)
	{
		return $this
			-> getRetentionRuleRepository()
			-> deleteRetentionRuleAndContext($clauses);
	}

	/* Special */

	private function getRetentionRuleRepository()
	{
		return $this
			-> get('doctrine_mongodb')
			-> getManager()
			-> getRepository('LogAnalyzerCoreBundle:RetentionRule');
	}
}
