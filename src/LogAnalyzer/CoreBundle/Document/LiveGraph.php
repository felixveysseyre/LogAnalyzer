<?php

namespace LogAnalyzer\CoreBundle\Document;

use JsonSerializable;
use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @MongoDB\Document(repositoryClass="LogAnalyzer\CoreBundle\Repository\LiveGraphRepository")
 */
class LiveGraph implements JsonSerializable
{
	/**
	 * @MongoDB\Id
	 */
	protected $liveGraphId;

	/**
	 * @MongoDB\String
	 */
	protected $liveGraphHuman;

	/**
	 * @MongoDB\String
	 */
	protected $filter;

	/**
	 * Get id
	 *
	 * @return id $liveGraphId
	 */
	public function getLiveGraphId()
	{
		return $this -> liveGraphId;
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
	 * Set filter
	 *
	 * @param array $filter
	 * @return self
	 */
	public function setFilter($filter)
	{
		$this -> filter = json_encode($filter);

		return $this;
	}

	/**
	 * Get filter
	 *
	 * @return array $filter
	 */
	public function getFilter()
	{
		return json_decode($this -> filter, true);
	}

	/* Special */

	public function jsonSerialize()
	{
		return array(
			'liveGraphId' => $this -> liveGraphId,
			'liveGraphHuman' => $this -> liveGraphHuman,
			'filter' => $this -> getFilter()
		);
	}
}
