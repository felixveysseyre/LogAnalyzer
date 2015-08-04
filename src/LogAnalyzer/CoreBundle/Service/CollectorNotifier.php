<?php

namespace LogAnalyzer\CoreBundle\Service;

class CollectorNotifier
{
	private $timeOut;

	/* Public */

	public function __construct($collectorConnexionTimeOut)
	{
		$this -> timeOut = $collectorConnexionTimeOut;
	}

	public function sendMessage($IP, $port, $message)
	{
		if($IP && $port)
		{
			/* Create socket */

			$socket = @socket_create(AF_INET, SOCK_STREAM, SOL_TCP);

			socket_set_option($socket, SOL_SOCKET, SO_SNDTIMEO, array(
				'sec' => $this -> timeOut,
				'usec' => 0
			));

			if($socket)
			{
				/* Open socket */

				if(@socket_connect($socket, $IP, $port))
				{
					/* Send message */

					$result = socket_send($socket, $message, strlen($message), 0x100);

					/* Close socket */

					socket_close($socket);

					/* Return */

					return ($result !== false) ? true : false;
				}
				else
				{
					return false;
				}
			}
			else
			{
				return false;
			}
		}
		else
		{
			return null;
		}
	}
}
