<?php

namespace LogAnalyzer\CoreBundle\Document;

use JsonSerializable;
use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @MongoDB\Document(repositoryClass="LogAnalyzer\CoreBundle\Repository\LiveGraphCountRepository")
 */
class LiveGraphCount implements JsonSerializable
{
	/**
	 * @MongoDB\Id
	 */
	protected $liveGraphCountId;

	/**
	 * @MongoDB\String
	 */
	protected $liveGraphHuman;

	/**
	 * @MongoDB\Date
	 */
	protected $reportedTime;

	/**
	 * @MongoDB\Int
	 */
	protected $count;

	/**
	 * Get id
	 *
	 * @return id $liveGraphCountId
	 */
	public function getLiveGraphCountId()
	{
		return $this -> liveGraphCountId;
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
	 * Set count
	 *
	 * @param int $count
	 * @return self
	 */
	public function setCount($count)
	{
		$this -> count = $count;

		return $this;
	}

	/**
	 * Get count
	 *
	 * @return int $count
	 */
	public function getCount()
	{
		return $this -> count;
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
			'liveGraphCountId' => $this -> liveGraphCountId,
			'liveGraphHuman' => $this -> liveGraphHuman,
			'reportedTime' => $this -> getReportedTime(true),
			'count' => $this -> count,
		);
	}
}
