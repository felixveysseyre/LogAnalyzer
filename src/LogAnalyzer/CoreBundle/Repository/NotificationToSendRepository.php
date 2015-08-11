<?php

namespace LogAnalyzer\CoreBundle\Repository;

use Doctrine\ODM\MongoDB\DocumentRepository;

class NotificationToSendRepository extends DocumentRepository
{
	/* Public */

	public function insertNotificationToSend($type, $recipient, $content)
	{
		$data = array(
			'type' => $type,
			'recipient' => $recipient,
			'content' => $content,
		);

		/* Create query */

		$query = $this -> createQueryBuilder();

		/* Add Data */

		$query
			-> insert()
			-> setNewObj($data);

		/* Return */

		$query
			-> getQuery()
			-> execute();

		return true;
	}

	public function createNotificationToSend($type, $recipient, $content)
	{
		return $this -> insertNotificationToSend($type, $recipient, $content);
	}

	public function countNotificationToSend($clauses = null)
	{
		/* Create query */

		$query = $this
			-> createQueryBuilder()
			-> count();

		/* Add clauses */

		if($clauses)
		{
			if(isset($clauses['notificationToSendId']))
				$query -> field('notificationToSendId') -> equals($clauses['notificationToSendId']);
			
			if(isset($clauses['type']))
				$query -> field('type') -> equals($clauses['type']);
		}

		/* Return */

		return $query
			-> getQuery()
			-> execute();
	}

	public function getNotificationToSend($clauses = null)
	{
		/* Create query */

		$query = $this -> createQueryBuilder();

		/* Add clauses */

		if($clauses)
		{
			if(isset($clauses['notificationToSendId']))
				$query -> field('notificationToSendId') -> equals($clauses['notificationToSendId']);

			if(isset($clauses['type']))
				$query -> field('type') -> equals($clauses['type']);
		}

		/* Return */

		return $query
			-> getQuery()
			-> execute()
			-> toArray(false);
	}

	public function deleteNotificationToSend($clauses = null)
	{
		/* Create query */

		$query = $this
			-> createQueryBuilder()
			-> remove();

		/* Add clauses */

		if($clauses)
		{
			if(isset($clauses['notificationToSendId']))
				$query -> field('notificationToSendId') -> equals($clauses['notificationToSendId']);
			
			if(isset($clauses['type']))
				$query -> field('type') -> equals($clauses['type']);

			if(isset($clauses['recipient']))
				$query -> field('recipient') -> equals($clauses['recipient']);

			if(isset($clauses['content']))
				$query -> field('content') -> equals($clauses['content']);
		}

		/* Return */

		$query
			-> getQuery()
			-> execute();

		return true;
	}

	/* Private */

}