<?php

namespace LogAnalyzer\CoreBundle\Document;

use JsonSerializable;
use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @MongoDB\Document(repositoryClass="LogAnalyzer\CoreBundle\Repository\LogRepository")
 */
class Log implements JsonSerializable
{
	/**
	 * @MongoDB\Id
	 */
	protected $logId;

	/**
	 * @MongoDB\Date
	 */
	protected $receptionTime;

	/**
	 * @MongoDB\Date
	 */
	protected $reportedTime;

	/**
	 * @MongoDB\Int
	 */
	protected $priority;

	/**
	 * @MongoDB\Int
	 */
	protected $facility;

	/**
	 * @MongoDB\String
	 */
	protected $host;

	/**
	 * @MongoDB\String
	 */
	protected $service;

	/**
	 * @MongoDB\String
	 */
	protected $message;

	/**
	 * Get id
	 *
	 * @return id $logId
	 */
	public function getLogId()
	{
		return $this -> logId;
	}

	/**
	 * Set receptionTime
	 *
	 * @param date $receptionTime
	 * @return self
	 */
	public function setReceptionTime($receptionTime)
	{
		$this -> receptionTime = $receptionTime;

		return $this;
	}

	/**
	 * Get receptionTime
	 *
	 * @return date $receptionTime
	 */
	public function getReceptionTime($asString = false)
	{
		if($asString === true)
		{
			return $this -> formatDateTime($this -> receptionTime);
		}
		else
		{
			return $this -> receptionTime;
		}
	}

	/**
	 * Set reportedTime
	 *
	 * @param date $reportedTime
	 * @return self
	 */
	public function setReportedTime($reportedTime)
	{
		$this -> reportedTime = $reportedTime;

		return $this;
	}

	/**
	 * Get reportedTime
	 *
	 * @return date $reportedTime
	 */
	public function getReportedTime($asString = false)
	{
		if($asString === true)
		{
			return $this -> formatDateTime($this -> reportedTime);
		}
		else
		{
			return $this -> reportedTime;
		}
	}

	/**
	 * Set priority
	 *
	 * @param int $priority
	 * @return self
	 */
	public function setPriority($priority)
	{
		$this -> priority = $priority;

		return $this;
	}

	/**
	 * Get priority
	 *
	 * @return int $priority
	 */
	public function getPriority()
	{
		return $this -> priority;
	}

	/**
	 * Set facility
	 *
	 * @param int $facility
	 * @return self
	 */
	public function setFacility($facility)
	{
		$this -> facility = $facility;

		return $this;
	}

	/**
	 * Get facility
	 *
	 * @return int $facility
	 */
	public function getFacility()
	{
		return $this -> facility;
	}

	/**
	 * Set host
	 *
	 * @param string $host
	 * @return self
	 */
	public function setHost($host)
	{
		$this -> host = $host;

		return $this;
	}

	/**
	 * Get host
	 *
	 * @return string $host
	 */
	public function getHost()
	{
		return $this -> host;
	}

	/**
	 * Set service
	 *
	 * @param string $service
	 * @return self
	 */
	public function setService($service)
	{
		$this -> service = $service;

		return $this;
	}

	/**
	 * Get service
	 *
	 * @return string $service
	 */
	public function getService()
	{
		return $this -> service;
	}

	/**
	 * Set message
	 *
	 * @param string $message
	 * @return self
	 */
	public function setMessage($message)
	{
		$this -> message = $message;

		return $this;
	}

	/**
	 * Get message
	 *
	 * @return string $message
	 */
	public function getMessage()
	{
		return $this -> message;
	}

	/* Private */

	private function formatDateTime($dateTime)
	{
		return ($dateTime) ? $dateTime -> format('Y-m-d H:i:s') : '';
	}

	/* Special */

	public function jsonSerialize()
	{
		return array(
			'logId' => $this -> logId,
			'receptionTime' => $this -> getReceptionTime(true),
			'reportedTime' => $this -> getReportedTime(true),
			'priority' => $this -> priority,
			'facility' => $this -> facility,
			'host' => $this -> host,
			'service' => $this -> service,
			'message' => $this -> message
		);
	}
}
