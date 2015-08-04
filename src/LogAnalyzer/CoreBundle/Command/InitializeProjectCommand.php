<?php

namespace LogAnalyzer\CoreBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

class InitializeProjectCommand extends ContainerAwareCommand
{
	/* Protected */

	protected function configure()
	{
		$this
			-> setName('logAnalyzer:projectConfiguration:initializeProject')
			-> setDescription('Initialize project');
	}

	protected function execute(InputInterface $input, OutputInterface $output)
	{
		$startTime = microtime(true);

		/* Get return value */

		$returnValue = $this -> initializeProject();

		$executionTime = $this -> getContainer() -> get('Helpers') -> getExecutionTime($startTime, microtime(true));

		/* Prepare return object */

		if($returnValue === true)
		{
			$data = array(
				'resultCode' => 1,
				'executionTime' => $executionTime,
				'message' => 'Project initialized.'
			);
		}
		elseif($returnValue === null)
		{
			$data = array(
				'resultCode' => 0,
				'executionTime' => $executionTime,
				'message' => 'Project is already initialized.'
			);
		}
		else
		{
			$data = array(
				'resultCode' => -1,
				'executionTime' => $executionTime,
				'message' => 'Initialization of the project failed.'
			);
		}

		$output -> writeln(json_encode($data));
	}

	/* Private */

	private function initializeProject()
	{
		if($this -> getConstantRepository() -> getConstantValue('projectInitialized') === false)
		{
			/* Create constants */

			$this -> createConstantFromParameter('debugMode', 'debugMode');
			$this -> createConstantFromParameter('retentionLog', 'retentionLog');
			$this -> createConstantFromParameter('maxLogReturn', 'maxLogReturn');
			$this -> createConstantFromParameter('retentionLiveGraph', 'retentionLiveGraph');
			$this -> createConstantFromParameter('aggregationTimeLiveGraph', 'aggregationTimeLiveGraph');
			$this -> createConstantFromParameter('offsetTimeLiveGraph', 'offsetTimeLiveGraph');

			/* Create roles */

			$this -> getRoleRepository() -> createRole('Project Administrator');
			$this -> getRoleRepository() -> createRole('Platform Administrator');
			$this -> getRoleRepository() -> createRole('Platform User');

			/* Create users */

			$projectAdministratorRole = $this
				-> getRoleRepository()
				-> getRole(array(
					'roleHuman' => 'Project Administrator'
				));

			$roleId = $projectAdministratorRole[0] -> getRoleId();

			$this -> getUserRepository() -> createUser(
				$this -> getContainer() -> getParameter('projectAdministratorFirstName'),
				$this -> getContainer() -> getParameter('projectAdministratorLastName'),
				$this -> getContainer() -> getParameter('projectAdministratorEmail'),
				$this -> getContainer() -> getParameter('projectAdministratorPassword'),
				$this -> getContainer() -> getParameter('passwordSalt'),
				$roleId
			);

			/* Create initialization witness */

			$this -> getConstantRepository() -> createConstant('projectInitialized', true);

			return true;
		}
		else
		{
			return null;
		}
	}

	/* Special */

	private function createConstantFromParameter($constantName, $parameterName)
	{
		$this
			-> getConstantRepository()
			-> createConstant($constantName, $this
				-> getContainer()
				-> getParameter($parameterName)
			);
	}

	private function getConstantRepository()
	{
		return $this
			-> getContainer()
			-> get('doctrine_mongodb')
			-> getManager()
			-> getRepository('LogAnalyzerCoreBundle:Constant');
	}

	private function getRoleRepository()
	{
		return $this
			-> getContainer()
			-> get('doctrine_mongodb')
			-> getManager()
			-> getRepository('LogAnalyzerCoreBundle:Role');
	}

	private function getUserRepository()
	{
		return $this
			-> getContainer()
			-> get('doctrine_mongodb')
			-> getManager()
			-> getRepository('LogAnalyzerCoreBundle:User');
	}
}