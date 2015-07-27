<?php

namespace LogAnalyzer\CoreBundle\Document;

use JsonSerializable;
use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @MongoDB\Document(repositoryClass="LogAnalyzer\CoreBundle\Repository\UserRepository")
 */
class User implements JsonSerializable
{
	/**
	 * @MongoDB\Id
	 */
	protected $userId;

	/**
	 * @MongoDB\String
	 */
	protected $firstName;

	/**
	 * @MongoDB\String
	 */
	protected $lastName;

	/**
	 * @MongoDB\String
	 */
	protected $email;

	/**
	 * @MongoDB\String
	 */
	protected $password;

	/**
	 * @MongoDB\String
	 */
	protected $roleHuman;

	/**
	 * Get id
	 *
	 * @return id $userId
	 */
	public function getUserId()
	{
		return $this -> userId;
	}

	/**
	 * Set firstName
	 *
	 * @param string $firstName
	 * @return self
	 */
	public function setFirstName($firstName)
	{
		$this -> firstName = $firstName;

		return $this;
	}

	/**
	 * Get firstName
	 *
	 * @return string $firstName
	 */
	public function getFirstName()
	{
		return $this -> firstName;
	}

	/**
	 * Set lastName
	 *
	 * @param string $lastName
	 * @return self
	 */
	public function setLastName($lastName)
	{
		$this -> lastName = $lastName;

		return $this;
	}

	/**
	 * Get lastName
	 *
	 * @return string $lastName
	 */
	public function getLastName()
	{
		return $this -> lastName;
	}

	/**
	 * Set email
	 *
	 * @param string $email
	 * @return self
	 */
	public function setEmail($email)
	{
		$this -> email = $email;

		return $this;
	}

	/**
	 * Get email
	 *
	 * @return string $email
	 */
	public function getEmail()
	{
		return $this -> email;
	}

	/**
	 * Set password
	 *
	 * @param string $password
	 * @return self
	 */
	public function setPassword($password)
	{
		$this -> password = $password;

		return $this;
	}

	/**
	 * Get password
	 *
	 * @return string $password
	 */
	public function getPassword()
	{
		return $this -> password;
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

	/* Special */

	/**
	 * Get fullName
	 *
	 * @return string $fullName
	 */
	public function getFullName()
	{
		return $this -> firstName . ' ' . $this -> lastName;
	}

	public function jsonSerialize()
	{
		return array(
			'userId' => $this -> userId,
			'firstName' => $this -> firstName,
			'lastName' => $this -> lastName,
			'fullName' => $this -> getFullName(),
			'email' => $this -> email,
			'roleHuman' => $this -> roleHuman
		);
	}
}
