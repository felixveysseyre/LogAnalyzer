<?php

namespace LogAnalyzer\CoreBundle\Document;

use JsonSerializable;
use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @MongoDB\Document(repositoryClass="LogAnalyzer\CoreBundle\Repository\RoleRepository")
 */
class Role implements JsonSerializable
{
	/**
	 * @MongoDB\Id
	 */
	protected $roleId;

	/**
	 * @MongoDB\String
	 */
	protected $roleHuman;

	/**
	 * Get id
	 *
	 * @return id $roleId
	 */
	public function getRoleId()
	{
		return $this -> roleId;
	}

	/**
	 * Set roleHuman
	 *
	 * @param string $roleHuman
	 * @return self
	 */
	public function setRoleHuman($roleHuman)
	{
		$this -> roleHuman = $roleHuman;

		return $this;
	}

	/**
	 * Get roleHuman
	 *
	 * @return string $roleHuman
	 */
	public function getRoleHuman()
	{
		return $this -> roleHuman;
	}

	public function jsonSerialize()
	{
		return array(
			'roleId' => $this -> roleId,
			'roleHuman' => $this -> roleHuman,
		);
	}
}
