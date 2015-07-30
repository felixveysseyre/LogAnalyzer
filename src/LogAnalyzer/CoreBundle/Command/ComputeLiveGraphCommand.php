<?php

namespace LogAnalyzer\CoreBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

class ComputeLiveGraphCommand extends ContainerAwareCommand
{
	/* Protected */

	protected function configure()
	{
		$this
			-> setName('logAnalyzer:dataManipulation:computeLiveGraph')
			-> setDescription('Compute LiveGraph')
			-> addArgument('computingDate', InputArgument::OPTIONAL, 'Date of computing');
	}

	protected function execute(InputInterface $input, OutputInterface $output)
	{
		$startTime = microtime(true);

		/* Get parameters  */

		$computingDate = $input -> getArgument('computingDate');

		/* Get return value */

		$returnValue = $this -> computeLiveGraphCount($computingDate);

		$executionTime = $this -> getContainer() -> get('Helpers') -> getExecutionTime($startTime, microtime(true));

		/* Prepare return object */

		if($returnValue === true)
		{
			$data = array(
				'resultCode' => 1,
				'executionTime' => $executionTime,
				'message' => 'LiveGraph have been computed.'
			);
		}
		else
		{
			$data = array(
				'resultCode' => -1,
				'executionTime' => $executionTime,
				'message' => 'LiveGraph computing has failed.'
			);
		}

		$output -> writeln(json_encode($data));
	}

	/* Private */

	private function computeLiveGraphCount($computingDate = null)
	{
		/* Compute computingTime clauses */

		$aggregationTime = $this
			-> getConstantRepository()
			-> getConstantValue('aggregationTimeLiveGraph');

		$offsetTime = $this
			-> getConstantRepository()
			-> getConstantValue('offsetTimeLiveGraph');

		if($computingDate)
		{
			$computingDate = $this
				-> getContainer()
				-> get('Helpers')
				-> getDateTimeString(0, date('Y-m-d', strtotime($computingDate)));
		}
		else
		{
			$computingDate = $this
				-> getContainer()
				-> get('Helpers')
				-> getDateTimeString(- ($offsetTime / (24 * 60)));
		}

		/* Compute reportedTime clauses */

		$reportedTimeInf = $this
			-> getContainer()
			-> get('Helpers')
			-> getDateTimeString(- ($aggregationTime / (24 * 60)), $computingDate);

		$reportedTimeClauses = array(
			'inf' => $reportedTimeInf,
			'sup' => $computingDate
		);

		/* Compute LiveGraphCount */

		$liveGraphs = $this -> getLiveGraphRepository() -> getLiveGraph();

		foreach($liveGraphs as $liveGraph)
		{
			/* Get count */

			$filter = $liveGraph -> getFilter();

			$filter['reportedTime'] = $reportedTimeClauses;

			var_dump($filter);

			$count = $this
				-> getLogRepository()
				-> countLog($filter);

			/* Insert count */

			$this
				-> getLiveGraphCountRepository()
				-> createLiveGraphCount($liveGraph -> getLiveGraphHuman(), $reportedTimeInf, $count);

			/* Check alerts */

			$this -> checkAlert($liveGraph, $count, $reportedTimeInf);

			var_dump('Rch!');
		}

		return true;

	}

	/* Private */

	private function checkAlert($liveGraph, $count, $reportedTime)
	{

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
}