<?php

namespace LogAnalyzer\CoreBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

class AnalysisAdministrationController extends Controller
{
	/* Public */

	public function getParserAPIAction(Request $request)
	{
		$startTime = microtime(true);

		/* Get return value */

		if($this -> get('PermissionGranter') -> isGranted($request))
		{
			$parameters = $this -> get('Helpers') -> getParameters($request, array(
				'parserId',
				'parserHuman',
				'separator',
				'part'
			));

			$returnValue = $this -> getParserAction($parameters);
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
				'message' => sizeof($returnValue) . ' parsers have been found.',
				'info' => array('parsers' => $returnValue)
			);
		}
		else
		{
			$data = array(
				'resultCode' => -1,
				'executionTime' => $executionTime,
				'message' => 'Failed to get parsers.'
			);
		}

		/* Return API response */

		return new JsonResponse($data);
	}

	public function createParserAPIAction(Request $request)
	{
		$startTime = microtime(true);

		/* Get return value */

		if($this -> get('PermissionGranter') -> isGranted($request))
		{
			$parameters = $this -> get('Helpers') -> getParameters($request, array(
				'parserHuman',
				'separator',
				'part'
			));

			$condition = isset($parameters['parserHuman'], $parameters['separator'], $parameters['part']);

			$returnValue = ($condition) ? $this -> createParserAction($parameters['parserHuman'], $parameters['separator'], $parameters['part']) : null;
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
				'message' => "Parser '{$parameters['parserHuman']}' has been created.",
			);
		}
		elseif($returnValue === null)
		{
			$data = array(
				'resultCode' => 0,
				'executionTime' => $executionTime,
				'message' => 'Failed to create parser. Not enough parameters.'
			);
		}
		else
		{
			$data = array(
				'resultCode' => -1,
				'executionTime' => $executionTime,
				'message' => 'Failed to create parser. Parser already exists.'
			);
		}

		/* Return API response */

		return new JsonResponse($data);
	}

	public function deleteParserAPIAction(Request $request)
	{
		$startTime = microtime(true);

		/* Get return value */

		if($this -> get('PermissionGranter') -> isGranted($request))
		{
			$parameters = $this -> get('Helpers') -> getParameters($request, array(
				'parserId',
				'parserHuman',
				'separator',
				'part'
			));

			$returnValue = $this -> deleteParserAction($parameters);
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
				'message' => sizeof($returnValue) . ' parsers have been deleted.',
				'info' => array('deletedParsers' => $returnValue)
			);
		}
		else
		{
			$data = array(
				'resultCode' => -1,
				'executionTime' => $executionTime,
				'message' => 'Parameters do not match any existing parser.',
			);
		}

		/* Return API response */

		return new JsonResponse($data);
	}

	public function getLiveGraphAPIAction(Request $request)
	{
		$startTime = microtime(true);

		/* Get return value */

		if($this -> get('PermissionGranter') -> isGranted($request))
		{
			$parameters = $this -> get('Helpers') -> getParameters($request, array(
				'liveGraphId',
				'liveGraphHuman',
				'filter'
			));

			$returnValue = $this -> getLiveGraphAction($parameters);
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
				'message' => sizeof($returnValue) . ' liveGraphs have been found.',
				'info' => array('liveGraphs' => $returnValue)
			);
		}
		else
		{
			$data = array(
				'resultCode' => -1,
				'executionTime' => $executionTime,
				'message' => 'Failed to get liveGraphs.'
			);
		}

		/* Return API response */

		return new JsonResponse($data);
	}

	public function createLiveGraphAPIAction(Request $request)
	{
		$startTime = microtime(true);

		/* Get return value */

		if($this -> get('PermissionGranter') -> isGranted($request))
		{
			$parameters = $this -> get('Helpers') -> getParameters($request, array(
				'liveGraphHuman',
				'filter'
			));

			$condition = isset($parameters['liveGraphHuman'], $parameters['filter']);

			$returnValue = ($condition) ? $this -> createLiveGraphAction($parameters['liveGraphHuman'], $parameters['filter']) : null;
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
				'message' => "LiveGraph '{$parameters['liveGraphHuman']}' has been created.",
			);
		}
		elseif($returnValue === null)
		{
			$data = array(
				'resultCode' => 0,
				'executionTime' => $executionTime,
				'message' => 'Failed to create liveGraph. Not enough parameters.'
			);
		}
		else
		{
			$data = array(
				'resultCode' => -1,
				'executionTime' => $executionTime,
				'message' => 'Failed to create liveGraph. LiveGraph already exists.'
			);
		}

		/* Return API response */

		return new JsonResponse($data);
	}

	public function deleteLiveGraphAPIAction(Request $request)
	{
		$startTime = microtime(true);

		/* Get return value */

		if($this -> get('PermissionGranter') -> isGranted($request))
		{
			$parameters = $this -> get('Helpers') -> getParameters($request, array(
				'liveGraphId',
				'liveGraphHuman',
				'filter'
			));

			$returnValue = $this -> deleteLiveGraphAction($parameters);
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
				'message' => sizeof($returnValue) . ' liveGraphs have been deleted.',
				'info' => array('deletedLiveGraphs' => $returnValue)
			);
		}
		else
		{
			$data = array(
				'resultCode' => -1,
				'executionTime' => $executionTime,
				'message' => 'Parameters do not match any existing liveGraph.',
			);
		}

		/* Return API response */

		return new JsonResponse($data);
	}

	/* Private */

	private function getParserAction($clauses = null)
	{
		return $this
			-> getParserRepository()
			-> getParser($clauses);
	}

	private function createParserAction($parserHuman, $separator, $part)
	{
		return $this
			-> getParserRepository()
			-> createParser($parserHuman, $separator, $part);
	}

	private function deleteParserAction($clauses = null)
	{
		return $this
			-> getParserRepository()
			-> deleteParserAndContext($clauses);
	}

	private function getLiveGraphAction($clauses = null)
	{
		return $this
			-> getLiveGraphRepository()
			-> getLiveGraph($clauses);
	}

	private function createLiveGraphAction($parserHuman, $filter)
	{
		return $this
			-> getLiveGraphRepository()
			-> createLiveGraph($parserHuman, $filter);
	}

	private function deleteLiveGraphAction($clauses = null)
	{
		return $this
			-> getLiveGraphRepository()
			-> deleteLiveGraphAndContext($clauses);
	}

	/* Special */

	private function getParserRepository()
	{
		return $this
			-> get('doctrine_mongodb')
			-> getManager()
			-> getRepository('LogAnalyzerCoreBundle:Parser');
	}

	private function getLiveGraphRepository()
	{
		return $this
			-> get('doctrine_mongodb')
			-> getManager()
			-> getRepository('LogAnalyzerCoreBundle:LiveGraph');
	}
}
