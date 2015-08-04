<?php

namespace LogAnalyzer\CoreBundle\Service;

use Swift_Message;

class EmailNotifier
{
	private $mailer;
	private $sendingAddress;

	/* Public */

	public function __construct($mailer, $logAnalyzerEmailAddress)
	{
		$this -> mailer = $mailer;
		$this -> sendingAddress = $logAnalyzerEmailAddress;
	}

	public function sendMessage($email, $subject, $message)
	{
		$swiftMailerMessage = new Swift_Message();

		$swiftMailerMessage
			-> setSubject($subject)
			-> setFrom($this -> sendingAddress)
			-> setTo($email)
			-> setBody($message);

		$sentReturn = $this
			-> mailer
			-> send($swiftMailerMessage);

		return ($sentReturn === 1) ? true : false;
	}
}
