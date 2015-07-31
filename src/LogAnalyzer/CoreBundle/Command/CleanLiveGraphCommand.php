<?php

namespace LogAnalyzer\CoreBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

class CleanLiveGraphCommand extends ContainerAwareCommand
{
	/* Protected */

	protected function configure()
	{
		$this
			-> setName('logAnalyzer:dataManipulation:cleanLiveGraph')
			-> setDescription('Clean liveGraphCount older than the retention set')
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
				'message' => 'LiveGraphs have bean cleaned.'
			);
		}
		else
		{
			$data = array(
				'resultCode' => -1,
				'executionTime' => $executionTime,
				'message' => 'LiveGraphs cleaning has failed.'
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
		}
		else
		{
			$retentionLiveGraph = $this
				-> getConstantRepository()
				-> getConstantValue('retentionLiveGraph');

			$removeAfterDate = $this
				-> getContainer()
				-> get('Helpers')
				-> getDateString(- ($retentionLiveGraph + 1)) . ' 23:59:59';
		}

		$deletionClauses = array(
			'reportedTime' => array(
				'inf' => '0000-00-00 00:00:00',
				'sup' => $removeAfterDate
			)
		);

		return $this
			-> getLiveGraphCountRepository()
			-> deleteLiveGraphCount($deletionClauses);
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

	private function getLiveGraphCountRepository()
	{
		return $this
			-> getContainer()
			-> get('doctrine_mongodb')
			-> getManager()
			-> getRepository('LogAnalyzerCoreBundle:LiveGraphCount');
	}
}