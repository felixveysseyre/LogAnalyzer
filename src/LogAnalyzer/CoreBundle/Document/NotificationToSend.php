<?php

namespace LogAnalyzer\CoreBundle\Document;

use JsonSerializable;
use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @MongoDB\Document(repositoryClass="LogAnalyzer\CoreBundle\Repository\NotificationToSendRepository")
 */
class NotificationToSend implements JsonSerializable
{
	/**
	 * @MongoDB\Id
	 */
	protected $notificationToSendId;
	
	/**
	 * @MongoDB\String
	 */
	protected $type;

	/**
	 * @MongoDB\Collection
	 */
	protected $recipient;

	/**
	 * @MongoDB\Hash
	 */
	protected $content;

	/**
	 * Get id
	 *
	 * @return id $notificationToSendId
	 */
	public function getNotificationToSendId()
	{
		return $this -> notificationToSendId;
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
	 * Set recipient
	 *
	 * @param string $recipient
	 * @return self
	 */
	public function setRecipient($recipient)
	{
		$this -> recipient = $recipient;

		return $this;
	}

	/**
	 * Get recipient
	 *
	 * @return string $recipient
	 */
	public function getRecipient()
	{
		return $this -> recipient;
	}

	/**
	 * Set content
	 *
	 * @param string $content
	 * @return self
	 */
	public function setContent($content)
	{
		$this -> content = $content;

		return $this;
	}

	/**
	 * Get content
	 *
	 * @return string $content
	 */
	public function getContent()
	{
		return $this -> content;
	}

	/* Private */

	/* Special */

	public function jsonSerialize()
	{
		return array(
			'notificationToSendId' => $this -> notificationToSendId,
			'type' => $this -> type,
			'recipient' => $this -> recipient,
			'content' => $this -> content
		);
	}
}
