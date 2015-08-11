<?php

namespace LogAnalyzer\CoreBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

class ResetProjectCommand extends ContainerAwareCommand
{
	/* Protected */

	protected function configure()
	{
		$this
			-> setName('logAnalyzer:projectConfiguration:resetProject')
			-> setDescription('Reset project');
	}

	protected function execute(InputInterface $input, OutputInterface $output)
	{
		$startTime = microtime(true);

		/* Get return value */

		$returnValue = $this -> resetProject();

		$executionTime = $this -> getContainer() -> get('Helpers') -> getExecutionTime($startTime, microtime(true));

		/* Prepare return object */

		if($returnValue === true)
		{
			$data = array(
				'resultCode' => 1,
				'executionTime' => $executionTime,
				'message' => 'Project has been reset.'
			);
		}
		else
		{
			$data = array(
				'resultCode' => -1,
				'executionTime' => $executionTime,
				'message' => 'Project reset failed.'
			);
		}

		$output -> writeln(json_encode($data));
	}

	/* Private */

	private function resetProject()
	{
		$this -> getConstantRepository() -> deleteConstant();
		$this -> getRoleRepository() -> deleteRole();
		$this -> getUserRepository() -> deleteUser();
		$this -> getLiveGraphRepository() -> deleteLiveGraph();
		$this -> getLiveGraphCountRepository() -> deleteLiveGraphCount();
		$this -> getAlertRepository() -> deleteAlert();
		$this -> getAlertNotificationRepository() -> deleteAlertNotification();
		$this -> getNotificationToSendRepository() -> deleteNotificationToSend();
		$this -> getCollectorRepository() -> deleteCollector();
		$this -> getParserRepository() -> deleteParser();
		//$this -> getLogRepository() -> deleteLog();

		return true;
	}

	/* Special */

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

	private function getLiveGraphRepository()
	{
		return $this
			-> getContainer()
			-> get('doctrine_mongodb')
			-> getManager()
			-> getRepository('LogAnalyzerCoreBundle:LiveGraph');
	}

	private function getLiveGraphCountRepository()
	{
		return $this
			-> getContainer()
			-> get('doctrine_mongodb')
			-> getManager()
			-> getRepository('LogAnalyzerCoreBundle:LiveGraphCount');
	}

	private function getAlertRepository()
	{
		return $this
			-> getContainer()
			-> get('doctrine_mongodb')
			-> getManager()
			-> getRepository('LogAnalyzerCoreBundle:Alert');
	}

	private function getAlertNotificationRepository()
	{
		return $this
			-> getContainer()
			-> get('doctrine_mongodb')
			-> getManager()
			-> getRepository('LogAnalyzerCoreBundle:AlertNotification');
	}

	private function getNotificationToSendRepository()
	{
		return $this
			-> getContainer()
			-> get('doctrine_mongodb')
			-> getManager()
			-> getRepository('LogAnalyzerCoreBundle:NotificationToSend');
	}

	private function getCollectorRepository()
	{
		return $this
			-> getContainer()
			-> get('doctrine_mongodb')
			-> getManager()
			-> getRepository('LogAnalyzerCoreBundle:Collector');
	}

	private function getParserRepository()
	{
		return $this
			-> getContainer()
			-> get('doctrine_mongodb')
			-> getManager()
			-> getRepository('LogAnalyzerCoreBundle:Parser');
	}

	private function getLogRepository()
	{
		return $this
			-> getContainer()
			-> get('doctrine_mongodb')
			-> getManager()
			-> getRepository('LogAnalyzerCoreBundle:Log');
	}
}