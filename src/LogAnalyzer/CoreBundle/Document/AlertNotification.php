<?php

namespace LogAnalyzer\CoreBundle\Document;

use JsonSerializable;
use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @MongoDB\Document(repositoryClass="LogAnalyzer\CoreBundle\Repository\AlertNotificationRepository")
 */
class AlertNotification implements JsonSerializable
{
	/**
	 * @MongoDB\Id
	 */
	protected $alertNotificationId;

	/**
	 * @MongoDB\String
	 */
	protected $alertHuman;

	/**
	 * @MongoDB\String
	 */
	protected $active;

	/**
	 * @MongoDB\Date
	 */
	protected $startTime;

	/**
	 * @MongoDB\Date
	 */
	protected $endTime;

	/**
	 * Get id
	 *
	 * @return id $alertNotificationId
	 */
	public function getAlertNotificationId()
	{
		return $this -> alertNotificationId;
	}

	/**
	 * Set alertHuman
	 *
	 * @param string $alertHuman
	 * @return self
	 */
	public function setAlertNotificationHuman($alertHuman)
	{
		$this -> alertHuman = $alertHuman;

		return $this;
	}

	/**
	 * Get alertHuman
	 *
	 * @return string $alertHuman
	 */
	public function getAlertNotificationHuman()
	{
		return $this -> alertHuman;
	}

	/**
	 * Set active
	 *
	 * @param string $active
	 * @return self
	 */
	public function setActive($active)
	{
		$this -> active = $active;

		return $this;
	}

	/**
	 * Get active
	 *
	 * @return string $active
	 */
	public function getActive()
	{
		return $this -> active;
	}

	/**
	 * Set startTime
	 *
	 * @param date $startTime
	 * @return self
	 */
	public function setStartTime($startTime)
	{
		$this -> startTime = $startTime;

		return $this;
	}

	/**
	 * Get startTime
	 *
	 * @return date $startTime
	 */
	public function getStartTime()
	{
		return $this -> startTime;
	}

	/**
	 * Set endTime
	 *
	 * @param date $endTime
	 * @return self
	 */
	public function setEndTime($endTime)
	{
		$this -> endTime = $endTime;

		return $this;
	}

	/**
	 * Get endTime
	 *
	 * @return date $endTime
	 */
	public function getEndTime()
	{
		return $this -> endTime;
	}

	/* Special */

	public function jsonSerialize()
	{
		return array(
			'alertNotificationId' => $this -> alertNotificationId,
			'alertHuman' => $this -> alertHuman,
			'active' => $this -> active,
			'startTime' => $this -> startTime -> format('Y-m-d H:i:s'),
			'endTime' => $this -> endTime -> format('Y-m-d H:i:s'),
		);
	}
}
