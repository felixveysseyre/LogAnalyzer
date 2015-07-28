<?php

namespace LogAnalyzer\CoreBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

class OrganizationAdministrationController extends Controller
{
	/* Public */

	public function getUserAPIAction(Request $request)
	{
		$startTime = microtime(true);

		/* Get return value */

		if($this -> get('PermissionGranter') -> isGranted($request))
		{
			$parameters = $this -> get('Helpers') -> getParameters($request, array(
				'userId',
				'firstName',
				'lastName',
				'email'
			));

			$returnValue = $this -> getUserAction($parameters);
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
				'message' => sizeof($returnValue) . ' users have been found.',
				'info' => array('users' => $returnValue)
			);
		}
		else
		{
			$data = array(
				'resultCode' => -1,
				'executionTime' => $executionTime,
				'message' => 'Failed to get users.'
			);
		}

		/* Return API response */

		return new JsonResponse($data);
	}

	public function createUserAPIAction(Request $request)
	{
		$startTime = microtime(true);

		/* Get return value */

		if($this -> get('PermissionGranter') -> isGranted($request))
		{
			$parameters = $this -> get('Helpers') -> getParameters($request, array(
				'firstName',
				'lastName',
				'email',
				'password',
				'roleId'
			));

			$condition = isset($parameters['firstName'], $parameters['lastName'], $parameters['email'], $parameters['password'], $parameters['roleId']);

			$returnValue = ($condition) ? $this -> createUserAction($parameters['firstName'], $parameters['lastName'], $parameters['email'], $parameters['password'], $parameters['roleId']) : null;
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
				'message' => "User '{$parameters['firstName']} {$parameters['lastName']}' has been created.",
			);
		}
		elseif($returnValue === null)
		{
			$data = array(
				'resultCode' => 0,
				'executionTime' => $executionTime,
				'message' => 'Failed to create user. Not enough parameters.'
			);
		}
		else
		{
			$data = array(
				'resultCode' => -1,
				'executionTime' => $executionTime,
				'message' => 'Failed to create user. User already exists.'
			);
		}

		/* Return API response */

		return new JsonResponse($data);
	}

	public function deleteUserAPIAction(Request $request)
	{
		$startTime = microtime(true);

		/* Get return value */

		if($this -> get('PermissionGranter') -> isGranted($request))
		{
			$parameters = $this -> get('Helpers') -> getParameters($request, array(
				'userId',
				'firstName',
				'lastName',
				'email'
			));

			$returnValue = $this -> deleteUserAction($parameters);
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
				'message' => sizeof($returnValue) . ' users have been deleted.',
				'info' => array('deletedUsers' => $returnValue)
			);
		}
		else
		{
			$data = array(
				'resultCode' => -1,
				'executionTime' => $executionTime,
				'message' => 'Parameters do not match any existing user.',
			);
		}

		/* Return API response */

		return new JsonResponse($data);
	}

	public function getRoleAPIAction(Request $request)
	{
		$startTime = microtime(true);

		/* Get return value */

		if($this -> get('PermissionGranter') -> isGranted($request))
		{
			$parameters = $this -> get('Helpers') -> getParameters($request, array(
				'roleId',
				'roleHuman',
			));

			$returnValue = $this -> getRoleAction($parameters);
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
				'message' => sizeof($returnValue) . ' roles have been found.',
				'info' => array('roles' => $returnValue)
			);
		}
		else
		{
			$data = array(
				'resultCode' => -1,
				'executionTime' => $executionTime,
				'message' => 'Failed to get roles.'
			);
		}

		/* Return API response */

		return new JsonResponse($data);
	}

	/* Private */

	private function getUserAction($clauses = null)
	{
		return $this
			-> getUserRepository()
			-> getUser($clauses);
	}

	private function createUserAction($firstName, $lastName, $email, $rawPassword, $roleId)
	{
		$salt = $this -> getParameter('passwordSalt');

		return $this
			-> getUserRepository()
			-> createUser($firstName, $lastName, $email, $rawPassword, $salt,  $roleId);
	}

	private function deleteUserAction($clauses = null)
	{
		return $this
			-> getUserRepository()
			-> deleteUserAndContext($clauses);
	}

	private function getRoleAction($clauses = null)
	{
		return $this
			-> getRoleRepository()
			-> getRole($clauses);
	}

	/* Special */

	private function getUserRepository()
	{
		return $this
			-> get('doctrine_mongodb')
			-> getManager()
			-> getRepository('LogAnalyzerCoreBundle:User');
	}

	private function getRoleRepository()
	{
		return $this
			-> get('doctrine_mongodb')
			-> getManager()
			-> getRepository('LogAnalyzerCoreBundle:Role');
	}
}
