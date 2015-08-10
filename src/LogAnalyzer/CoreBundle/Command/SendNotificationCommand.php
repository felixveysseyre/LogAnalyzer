<?php

namespace LogAnalyzer\CoreBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

class SendNotificationCommand extends ContainerAwareCommand
{
	/* Protected */

	protected function configure()
	{
		$this
			-> setName('logAnalyzer:notificationAdministration:sendNotification')
			-> setDescription('Send notification');
	}

	protected function execute(InputInterface $input, OutputInterface $output)
	{
		$startTime = microtime(true);

		/* Get return value */

		$returnValue = $this -> sendNotification();

		$executionTime = $this -> getContainer() -> get('Helpers') -> getExecutionTime($startTime, microtime(true));

		/* Prepare return object */

		if($returnValue === true)
		{
			$data = array(
				'resultCode' => 1,
				'executionTime' => $executionTime,
				'message' => 'Notifications have been sent.'
			);
		}
		else
		{
			$data = array(
				'resultCode' => -1,
				'executionTime' => $executionTime,
				'message' => 'Notification sending has failed.'
			);
		}

		$output -> writeln(json_encode($data));
	}

	/* Private */

	private function sendNotification()
	{
		/* Get notifications to send */

		$notificationsToSend = $this
			-> getNotificationToSendRepository()
			-> getNotificationToSend();

		/* Send notifications */

		foreach($notificationsToSend as $notificationToSend)
		{
			if($notificationToSend -> getType() === 'email')
			{
				foreach($notificationToSend -> getRecipient() as $email)
				{
					$content = $notificationToSend -> getContent();

					$return = $this -> sendEmail($email, $content['subject'], $content['message']);
				}
			}
			elseif($notificationToSend -> getType() === 'collector')
			{
				foreach($notificationToSend -> getRecipient() as $collectorHuman)
				{
					$collectors = $this
						-> getCollectorRepository()
						-> getCollector(array('collectorHuman' => $collectorHuman));

					if(is_array($collectors) && sizeof($collectors) === 1)
					{
						$IP = $collectors[0] -> getIP();
						$port = $collectors[0] -> getPort();

						$content = $notificationToSend -> getContent();

						$return = $this -> sendMessageToCollector($IP, $port, $content['message']);
					}
				}
			}
			else
			{
				$return = false;
			}

			/* Clean notification */

			if($return)
			{
				$this
					-> getNotificationToSendRepository()
					-> deleteNotificationToSend(array('notificationToSendId' => $notificationToSend -> getNotificationToSendId()));
			}
		}

		/* Return */

		return true;
	}

	/* Private */

	private function sendEmail($email, $subject, $message)
	{
		$emailNotifier = $this
			-> getContainer()
			-> get('EmailNotifier');

		return $emailNotifier -> sendMessage($email, $subject, $message);
	}

	private function sendMessageToCollector($IP, $port, $message)
	{
		$collectorNotifier = $this
			-> getContainer()
			-> get('CollectorNotifier');

		return $collectorNotifier -> sendMessage($IP, $port, $message);
	}

	/* Special */

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
}