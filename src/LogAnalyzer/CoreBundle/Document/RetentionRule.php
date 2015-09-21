<?php

namespace LogAnalyzer\CoreBundle\Document;

use JsonSerializable;
use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @MongoDB\Document(repositoryClass="LogAnalyzer\CoreBundle\Repository\RetentionRuleRepository")
 */
class RetentionRule implements JsonSerializable
{
	/**
	 * @MongoDB\Id
	 */
	protected $retentionRuleId;

	/**
	 * @MongoDB\String
	 */
	protected $service;

	/**
	 * @MongoDB\Int
	 */
	protected $retention;

	/**
	 * Get id
	 *
	 * @return id $retentionRuleId
	 */
	public function getRetentionRuleId()
	{
		return $this -> retentionRuleId;
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
	 * Set retention
	 *
	 * @param int $retention
	 * @return self
	 */
	public function setRetention($retention)
	{
		$this -> retention = $retention;

		return $this;
	}

	/**
	 * Get retention
	 *
	 * @return int $retention
	 */
	public function getRetention()
	{
		return $this -> retention;
	}

	/* Special */

	public function jsonSerialize()
	{
		return array(
			'retentionRuleId' => $this -> retentionRuleId,
			'service' => $this -> service,
			'retention' => $this -> retention
		);
	}
}
