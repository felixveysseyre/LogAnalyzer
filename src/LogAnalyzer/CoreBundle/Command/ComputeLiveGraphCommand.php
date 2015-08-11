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

			$count = $this
				-> getLogRepository()
				-> countLog($filter);

			/* Insert count */

			$this
				-> getLiveGraphCountRepository()
				-> createLiveGraphCount($liveGraph -> getLiveGraphHuman(), $computingDate, $count);

			/* Check alerts */

			$this -> checkAlert($liveGraph, $count, $computingDate);
		}

		return true;
	}

	/* Private */

	private function checkAlert($liveGraph, $count, $timeOfNotification)
	{
		$alerts = $this
			-> getAlertRepository()
			-> getAlert(array('liveGraphHuman' => $liveGraph -> getLiveGraphHuman()));

		foreach($alerts as $alert)
		{
			$result = false;

			$trigger = $alert -> getTrigger();

			if($trigger['comparisonOperator'] === '<=')
			{
				if($count <= $trigger['value'])
				{
					$result = true;
				}
			}
			elseif($trigger['comparisonOperator'] === '==')
			{
				if($count == $trigger['value'])
				{
					$result = true;
				}
			}
			elseif($trigger['comparisonOperator'] === '>=')
			{
				if($count >= $trigger['value'])
				{
					$result = true;
				}
			}
			elseif($trigger['comparisonOperator'] === '!=')
			{
				if($count != $trigger['value'])
				{
					$result = true;
				}
			}

			$this -> updateAlertStatus($alert, $result, $timeOfNotification);
		}
	}

	private function updateAlertStatus($alert, $result, $timeOfNotification)
	{
		$trigger = $alert -> getTrigger();
		$status = $alert -> getStatus();

		$active = $status['active'];
		$countRaise = $status['countRaise'];
		$countUnRaise = $status['countUnRaise'];

		$cycleRaise = $trigger['cycleRaise'];
		$cycleUnRaise = $trigger['cycleUnRaise'];

		/* Compute new status */

		if($result)
		{
			$countUnRaise = 0;

			if($active === true)
			{
				// Alert is already raised.
			}
			else
			{
				$countRaise++;

				if($countRaise === $cycleRaise)
				{
					$active = true;
					$countRaise = 0;

					$this -> createAlertNotification($alert, true, $timeOfNotification);
				}
			}
		}
		else
		{
			$countRaise = 0;

			if($active === false)
			{
				// Alert is not raised.
			}
			else
			{
				$countUnRaise++;

				if($countUnRaise === $cycleUnRaise)
				{
					$active = false;
					$countUnRaise = 0;

					$this -> createAlertNotification($alert, false, $timeOfNotification);
				}
			}
		}

		/* Update alert status */

		$status = array(
			'active' => $active,
			'countRaise' => $countRaise,
			'countUnRaise' => $countUnRaise
		);

		$this
			-> getAlertRepository()
			-> updateAlert($alert -> getAlertId(), array('status' => $status));
	}

	private function createAlertNotification($alert, $type, $timeOfNotification)
	{
		/* Internal notifications */

		$this -> createInternalNotification($alert, $type, $timeOfNotification);

		/* External notifications */

		$this -> createExternalNotification($alert, $type, $timeOfNotification);
	}

	private function createInternalNotification($alert, $type, $timeOfNotification)
	{
		if($type)
		{
			$this
				-> getAlertNotificationRepository()
				-> createAlertNotification($alert -> getAlertHuman(), 'yes', $timeOfNotification, null);
		}
		else
		{
			$clause = array(
				'alertHuman' => $alert -> getAlertHuman(),
				'active' => 'yes'
			);

			$alertNotifications = $this
				-> getAlertNotificationRepository()
				-> getAlertNotification($clause);

			foreach($alertNotifications as $alertNotification)
			{
				$this
					-> getAlertNotificationRepository()
					-> endAlertNotification($alertNotification -> getAlertNotificationId(), $timeOfNotification);
			}
		}
	}

	private function createExternalNotification($alert, $type, $timeOfNotification)
	{
		$notification = $alert -> getNotification();

		if($notification)
		{
			$condition1 = isset($notification['emails']) && sizeof($notification['emails']) != 0;
			$condition2 = isset($notification['collectorsHuman']) && sizeof($notification['collectorsHuman']) != 0;

			if($condition1 || $condition2)
			{
				/* Create message and subject */

				if($type)
				{
					/* Start notification */

					$subject = 'Alert \'' . $alert -> getAlertHuman() . '\' raised at ' . $timeOfNotification . '.';
					$message = (isset($notification['messageRaise'])) ? $notification['messageRaise'] : $subject;
				}
				else
				{
					/* End notification */

					$subject = 'Alert \'' . $alert -> getAlertHuman() . '\' un-raised at ' . $timeOfNotification . '.';
					$message = (isset($notification['messageUnRaise'])) ? $notification['messageUnRaise'] : $subject;
				}

				$message = str_replace('{dateTime}', $timeOfNotification, $message);
				$message = str_replace('{name}', $alert -> getAlertHuman(), $message);

				/* Create notificationToSend objects */

				if($condition1)
				{
					/* Emails */

					$this
						-> getNotificationToSendRepository()
						-> createNotificationToSend('email', $notification['emails'], array(
							'subject' => $subject,
							'message' => $message
						));
				}

				if($condition2)
				{
					/* Collector */

					$this
						-> getNotificationToSendRepository()
						-> createNotificationToSend('collector', $notification['collectorsHuman'], array(
							'subject' => $subject,
							'message' => $message
						));
				}
			}
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
}