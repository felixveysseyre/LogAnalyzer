<?php

namespace LogAnalyzer\CoreBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Session\Session;

class LoginController extends Controller
{
	/* Public */

	public function indexAction(Request $request)
	{
		$currentUser = $request -> getSession() -> get('currentUser');

		if($currentUser)
		{
			return $this -> redirect($this -> generateUrl('LogAnalyzer_Dashboard_index'));
		}
		else
		{
			return $this -> render('LogAnalyzerCoreBundle:Login:index.html.twig', array(
				'title' => 'Dashboard',
				'cssFiles' => array(
					'internal' => array(
						'fontAwesome/css/font-awesome.min.css'
					)
				),
				'lessFiles' => array(
					'internal' => array(
						'login/login.less',

						'plugins/module.less',
						'plugins/form.less'
					)
				),
				'jsFiles' => array(
					'internal' => array(
						'jquery-2.1.3.min.js',
						'jquery-ui.min.js',
						'less-2.3.1.min.js',

						'plugins/module.js',
						'plugins/form.js',

						'toolboxes/LogAnalyzerAPICaller.js',
						'toolboxes/array.js',
						'toolboxes/date.js',

						'login/login.js',
						'login/signIn.js',
					)
				),
				'jsVariables' => array(
					'debugMode' => true,
					'baseURL' => $this -> get('router') -> getContext() -> getBaseUrl()
				)
			));
		}
	}

	public function signInAPIAction(Request $request)
	{
		$startTime = microtime(true);

		/* Get parameters */

		$parameters = $this -> get('Helpers') -> getParameters($request, array(
			'userId',
			'password',
		));

		/* Test conditions */

		$condition = isset($parameters['userId'], $parameters['password']);

		/* Get return value */

		$returnValue = ($condition) ? $this -> signIn($request, $parameters['userId'], $parameters['password']) : null;

		$executionTime = $this -> get('Helpers') -> getExecutionTime($startTime, microtime(true));

		/* Prepare API response data */

		if($returnValue)
		{
			$data = array(
				'resultCode' => 1,
				'executionTime' => $executionTime,
				'message' => 'SignIn succeeded.',
				'info' => array('redirectTo' => '/dashboard/')
			);
		}
		elseif($returnValue === null)
		{
			$data = array(
				'resultCode' => 0,
				'executionTime' => $executionTime,
				'message' => 'SignIn failed. Not enough parameters.'
			);
		}
		else
		{
			$data = array(
				'resultCode' => -1,
				'executionTime' => $executionTime,
				'message' => 'SignIn failed.'
			);
		}

		/* Return API response */

		return new JsonResponse($data);
	}

	public function signOutAPIAction(Request $request)
	{
		$startTime = microtime(true);

		/* Get parameters */

		$parameters = $this -> get('Helpers') -> getParameters($request, array());

		/* Get return value */

		$returnValue = $this -> signOut($request);

		$executionTime = $this -> get('Helpers') -> getExecutionTime($startTime, microtime(true));

		/* Prepare API response data */

		if($returnValue)
		{
			$data = array(
				'resultCode' => 1,
				'executionTime' => $executionTime,
				'message' => 'SignOut succeeded.',
				'info' => array('redirectTo' => '/')
			);
		}
		elseif($returnValue === null)
		{
			$data = array(
				'resultCode' => 0,
				'executionTime' => $executionTime,
				'message' => 'SignOut failed. Not enough parameters.'
			);
		}
		else
		{
			$data = array(
				'resultCode' => -1,
				'executionTime' => $executionTime,
				'message' => 'SignOut failed.'
			);
		}

		/* Return API response */

		return new JsonResponse($data);
	}

	/* Private */

	private function signIn(Request $request, $userId, $rawPassword)
	{
		$salt = $this -> getParameter('passwordSalt');

		$user = $this
			-> getUserRepository()
			-> checkUser($userId, $rawPassword, $salt);

		if($user)
		{
			$request -> getSession() -> set('currentUser', $user);

			return true;
		}
		else
		{
			return false;
		}
	}

	private function signOut(Request $request)
	{
		$request -> getSession() -> invalidate();

		return true;
	}

	/* Special */

	private function getUserRepository()
	{
		return $this
			-> get('doctrine_mongodb')
			-> getManager()
			-> getRepository('LogAnalyzerCoreBundle:User');
	}
}
