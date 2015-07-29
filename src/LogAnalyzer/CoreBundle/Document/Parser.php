<?php

namespace LogAnalyzer\CoreBundle\Document;

use JsonSerializable;
use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @MongoDB\Document(repositoryClass="LogAnalyzer\CoreBundle\Repository\ParserRepository")
 */
class Parser implements JsonSerializable
{
	/**
	 * @MongoDB\Id
	 */
	protected $parserId;

	/**
	 * @MongoDB\String
	 */
	protected $parserHuman;

	/**
	 * @MongoDB\String
	 */
	protected $separator;

	/**
	 * @MongoDB\Int
	 */
	protected $part;

	/**
	 * Get id
	 *
	 * @return id $parserId
	 */
	public function getParserId()
	{
		return $this -> parserId;
	}

	/**
	 * Set parserHuman
	 *
	 * @param string $parserHuman
	 * @return self
	 */
	public function setParserHuman($parserHuman)
	{
		$this -> parserHuman = $parserHuman;

		return $this;
	}

	/**
	 * Get parserHuman
	 *
	 * @return string $parserHuman
	 */
	public function getParserHuman()
	{
		return $this -> parserHuman;
	}

	/**
	 * Set separator
	 *
	 * @param string $separator
	 * @return self
	 */
	public function setSeparator($separator)
	{
		$this -> separator = $separator;

		return $this;
	}

	/**
	 * Get separator
	 *
	 * @return string $separator
	 */
	public function getSeparator()
	{
		return $this -> separator;
	}

	/**
	 * Set part
	 *
	 * @param int $part
	 * @return self
	 */
	public function setPart($part)
	{
		$this -> part = $part;

		return $this;
	}

	/**
	 * Get part
	 *
	 * @return int $part
	 */
	public function getPart()
	{
		return $this -> part;
	}

	/* Special */

	public function jsonSerialize()
	{
		return array(
			'parserId' => $this -> parserId,
			'parserHuman' => $this -> parserHuman,
			'separator' => $this -> separator,
			'part' => $this -> part
		);
	}
}
