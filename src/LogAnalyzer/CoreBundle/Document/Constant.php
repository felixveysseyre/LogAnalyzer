<?php

namespace LogAnalyzer\CoreBundle\Document;

use JsonSerializable;
use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @MongoDB\Document(repositoryClass="LogAnalyzer\CoreBundle\Repository\ConstantRepository")
 */
class Constant implements JsonSerializable
{
	/**
	 * @MongoDB\Id
	 */
	protected $constantId;

	/**
	 * @MongoDB\String
	 */
	protected $name;

	/**
	 * @MongoDB\String
	 */
	protected $type;

	/**
	 * @MongoDB\String
	 */
	protected $value;

	/**
	 * Get id
	 *
	 * @return id $constantId
	 */
	public function getConstantId()
	{
		return $this -> constantId;
	}

	/**
	 * Set name
	 *
	 * @param string $name
	 * @return self
	 */
	public function setName($name)
	{
		$this -> name = $name;

		return $this;
	}

	/**
	 * Get name
	 *
	 * @return string $name
	 */
	public function getName()
	{
		return $this -> name;
	}

	/**
	 * Set type
	 *
	 * @param string $type
	 * @return self
	 */
	public function setType($type)
	{
		$this -> type = $type;

		return $this;
	}

	/**
	 * Get type
	 *
	 * @return string $type
	 */
	public function getType()
	{
		return $this -> type;
	}

	/**
	 * Set value
	 *
	 * @param mixed $value
	 * @return self
	 */
	public function setValue($value)
	{
		$this -> value = json_encode($value);

		$this -> setType($this -> getValueType($value));

		return $this;
	}

	/**
	 * Get value
	 *
	 * @return mixed $value
	 */
	public function getValue()
	{
		return $this -> getProcessedValue();
	}

	/* Special */

	public function jsonSerialize()
	{
		return array(
			'constantId' => $this -> constantId,
			'name' => $this -> name,
			'type' => $this -> type,
			'value' => $this -> getValue()
		);
	}

	private function getProcessedValue()
	{
		$type = $this -> type;
		$value = $this -> value;

		$processedValue = false;

		if($type === 'boolean' || $type === 'array' || $type === 'object')
		{
			$processedValue = json_decode($value, true);
		}
		elseif($type === 'string')
		{
			$processedValue = $value;
		}
		elseif($type === 'number')
		{
			$processedValue = floatval($value);
		}

		return $processedValue;
	}

	private function getValueType($value)
	{
		$phpType = gettype($value);

		if($phpType === 'boolean' || $phpType === 'NULL')
		{
			return 'boolean';
		}
		elseif($phpType === 'integer' || $phpType === 'double')
		{
			return 'number';
		}
		elseif($phpType === 'string')
		{
			return 'string';
		}
		elseif($phpType === 'array')
		{
			return 'array';
		}
		elseif($phpType === 'object')
		{
			return 'object';
		}
		else
		{
			return false;
		}
	}
}
