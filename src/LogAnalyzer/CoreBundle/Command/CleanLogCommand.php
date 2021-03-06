<?php

namespace LogAnalyzer\CoreBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

class CleanLogCommand extends ContainerAwareCommand
{
	/* Protected */

	protected function configure()
	{
		$this
			-> setName('logAnalyzer:dataManipulation:cleanLog')
			-> setDescription('Clean log older than the retention set')
			-> addArgument('cleaningDate', InputArgument::OPTIONAL, 'Date of cleaning');
	}

	protected function execute(InputInterface $input, OutputInterface $output)
	{
		$startTime = microtime(true);

		/* Get parameters  */

		$cleaningDate = $input -> getArgument('cleaningDate');

		/* Get return value */

		$returnValue = $this -> cleanLog($cleaningDate);

		$executionTime = $this -> getContainer() -> get('Helpers') -> getExecutionTime($startTime, microtime(true));

		/* Prepare return object */

		if($returnValue === true)
		{
			$data = array(
				'resultCode' => 1,
				'executionTime' => $executionTime,
				'message' => 'Log have bean cleaned.'
			);
		}
		else
		{
			$data = array(
				'resultCode' => -1,
				'executionTime' => $executionTime,
				'message' => 'Log cleaning has failed.'
			);
		}

		$output -> writeln(json_encode($data));
	}

	/* Private */

	private function cleanLog($cleaningDate = null)
	{
		if($cleaningDate)
		{
			$removeAfterDate = $this
				-> getContainer()
				-> get('Helpers')
				-> getDateString(0, date('Y-m-d', strtotime($cleaningDate))) . ' 23:59:59';

			$deletionClauses = array(
				'reportedTime' => array(
					'inf' => '0000-00-00 00:00:00',
					'sup' => $removeAfterDate
				)
			);

			return $this
				-> getLogRepository()
				-> deleteLog($deletionClauses);
		}
		else
		{
			$retentionLog = $this
				-> getConstantRepository()
				-> getConstantValue('retentionLog');

			/* Get services existing in database */

			$services = $this
				-> getLogRepository()
				-> getService();

			/* Clean logs by service */

			foreach($services as $service)
			{
				$retentionRules = $this
					-> getRetentionRuleRepository()
					-> getRetentionRule(array('service' => $service));

				/* Get retention to apply */

				if(sizeof($retentionRules) === 1)
				{
					$retention = $retentionRules[0] -> getRetention();
				}
				else
				{
					$retention = $retentionLog;
				}

				/* Create deletion clauses */

				$removeAfterDate = $this
					-> getContainer()
					-> get('Helpers')
					-> getDateString(- ($retention + 1)) . ' 23:59:59';

				$deletionClauses = array(
					'service' => $service,
					'reportedTime' => array(
						'inf' => '0000-00-00 00:00:00',
						'sup' => $removeAfterDate
					)
				);

				/* Delete logs */

				$this
					-> getLogRepository()
					-> deleteLog($deletionClauses);

			}

			return true;
		}
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

	private function getLogRepository()
	{
		return $this
			-> getContainer()
			-> get('doctrine_mongodb')
			-> getManager()
			-> getRepository('LogAnalyzerCoreBundle:Log');
	}

	private function getRetentionRuleRepository()
	{
		return $this
			-> getContainer()
			-> get('doctrine_mongodb')
			-> getManager()
			-> getRepository('LogAnalyzerCoreBundle:RetentionRule');
	}
}