<?php

namespace LogAnalyzer\CoreBundle\Document;

use JsonSerializable;
use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @MongoDB\Document(repositoryClass="LogAnalyzer\CoreBundle\Repository\AlertRepository")
 */
class Alert implements JsonSerializable
{
	/**
	 * @MongoDB\Id
	 */
	protected $alertId;

	/**
	 * @MongoDB\String
	 */
	protected $alertHuman;

	/**
	 * @MongoDB\String
	 */
	protected $liveGraphHuman;

	/**
	 * @MongoDB\Hash
	 */
	protected $trigger;

	/**
	 * @MongoDB\Hash
	 */
	protected $status;

	/**
	 * @MongoDB\Hash
	 */
	protected $notification;

	/**
	 * Get id
	 *
	 * @return id $alertId
	 */
	public function getAlertId()
	{
		return $this -> alertId;
	}

	/**
	 * Set alertHuman
	 *
	 * @param string $alertHuman
	 * @return self
	 */
	public function setAlertHuman($alertHuman)
	{
		$this -> alertHuman = $alertHuman;

		return $this;
	}

	/**
	 * Get alertHuman
	 *
	 * @return string $alertHuman
	 */
	public function getAlertHuman()
	{
		return $this -> alertHuman;
	}

	/**
	 * Set liveGraphHuman
	 *
	 * @param string $liveGraphHuman
	 * @return self
	 */
	public function setLiveGraphHuman($liveGraphHuman)
	{
		$this -> liveGraphHuman = $liveGraphHuman;

		return $this;
	}

	/**
	 * Get liveGraphHuman
	 *
	 * @return string $liveGraphHuman
	 */
	public function getLiveGraphHuman()
	{
		return $this -> liveGraphHuman;
	}

	/**
	 * Set trigger
	 *
	 * @param array $trigger
	 * @return self
	 */
	public function setTrigger($trigger)
	{
		$this -> trigger = $trigger;

		return $this;
	}

	/**
	 * Get trigger
	 *
	 * @return array $trigger
	 */
	public function getTrigger()
	{
		return $this -> trigger;
	}

	/**
	 * Set status
	 *
	 * @param array $status
	 * @return self
	 */
	public function setStatus($status)
	{
		$this -> status = $status;

		return $this;
	}

	/**
	 * Get status
	 *
	 * @return array $status
	 */
	public function getStatus()
	{
		return $this -> status;
	}

	/**
	 * Set notification
	 *
	 * @param array $notification
	 * @return self
	 */
	public function setNotification($notification)
	{
		$this -> notification = $notification;

		return $this;
	}

	/**
	 * Get notification
	 *
	 * @return array $notification
	 */
	public function getNotification()
	{
		return $this -> notification;
	}

	/* Special */

	public function jsonSerialize()
	{
		return array(
			'alertId' => $this -> alertId,
			'alertHuman' => $this -> alertHuman,
			'liveGraphHuman' => $this -> liveGraphHuman,
			'trigger' => $this -> trigger,
			//'status' => $this -> status,
			'notification' => $this -> notification
		);
	}
}
