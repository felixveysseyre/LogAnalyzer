<?php

namespace LogAnalyzer\CoreBundle\Document;

use JsonSerializable;
use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @MongoDB\Document(repositoryClass="LogAnalyzer\CoreBundle\Repository\CollectorRepository")
 */
class Collector implements JsonSerializable
{
	/**
	 * @MongoDB\Id
	 */
	protected $collectorId;

	/**
	 * @MongoDB\String
	 */
	protected $collectorHuman;

	/**
	 * @MongoDB\String
	 */
	protected $IP;

	/**
	 * @MongoDB\String
	 */
	protected $port;

	/**
	 * Get id
	 *
	 * @return id $collectorId
	 */
	public function getCollectorId()
	{
		return $this -> collectorId;
	}

	/**
	 * Set collectorHuman
	 *
	 * @param string $collectorHuman
	 * @return self
	 */
	public function setCollectorHuman($collectorHuman)
	{
		$this -> collectorHuman = $collectorHuman;

		return $this;
	}

	/**
	 * Get collectorHuman
	 *
	 * @return string $collectorHuman
	 */
	public function getCollectorHuman()
	{
		return $this -> collectorHuman;
	}

	/**
	 * Set IP
	 *
	 * @param string $IP
	 * @return self
	 */
	public function setIP($IP)
	{
		$this -> IP = $IP;

		return $this;
	}

	/**
	 * Get IP
	 *
	 * @return string $IP
	 */
	public function getIP()
	{
		return $this -> IP;
	}

	/**
	 * Set port
	 *
	 * @param string $port
	 * @return self
	 */
	public function setPort($port)
	{
		$this -> port = $port;

		return $this;
	}

	/**
	 * Get port
	 *
	 * @return string $port
	 */
	public function getPort()
	{
		return $this -> port;
	}

	/* Special */

	public function jsonSerialize()
	{
		return array(
			'collectorId' => $this -> collectorId,
			'collectorHuman' => $this -> collectorHuman,
			'IP' => $this -> IP,
			'port' => $this -> port
		);
	}
}
