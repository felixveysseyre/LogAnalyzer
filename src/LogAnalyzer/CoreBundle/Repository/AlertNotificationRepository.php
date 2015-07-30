<?php

namespace LogAnalyzer\CoreBundle\Repository;

use Doctrine\ODM\MongoDB\DocumentRepository;

class AlertNotificationRepository extends DocumentRepository
{
	/* Public */

	public function insertAlertNotification($alertHuman, $active, $startTime = null, $endTime = null)
	{
		$data = array(
			'alertHuman' => $alertHuman,
			'active' => $active
		);

		if($startTime) $data['startTime'] = $startTime;
		if($endTime) $data['endTime'] = $endTime;

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

	public function createAlertNotification($alertHuman, $active, $startTime = null, $endTime = null)
	{
		return $this -> insertAlertNotification($alertHuman, $active, $startTime, $endTime);
	}

	public function countAlertNotification($clauses = null)
	{
		/* Create query */

		$query = $this
			-> createQueryBuilder()
			-> count();

		/* Add clauses */

		if($clauses)
		{
			if(isset($clauses['alertNotificationId']))
				$query -> field('alertNotificationId') -> equals($clauses['alertNotificationId']);

			if(isset($clauses['alertHuman']))
				$query -> field('alertHuman') -> equals($clauses['alertHuman']);

			if(isset($clauses['active']))
				$query -> field('active') -> equals($clauses['active']);

			if(isset($clauses['startTime']))
				if(is_array($clauses['startTime']))
					$query -> field('startTime') -> range($clauses['startTime']['inf'], $clauses['startTime']['sup']);
				else
					$query -> field('startTime') -> equals($clauses['startTime']);

			if(isset($clauses['endTime']))
				if(is_array($clauses['endTime']))
					$query -> field('endTime') -> range($clauses['endTime']['inf'], $clauses['endTime']['sup']);
				else
					$query -> field('endTime') -> equals($clauses['endTime']);
		}

		/* Return */

		return $query
			-> getQuery()
			-> execute();
	}

	public function getAlertNotification($clauses = null)
	{
		/* Create query */

		$query = $this -> createQueryBuilder();

		/* Add clauses */

		if($clauses)
		{
			if(isset($clauses['alertNotificationId']))
				$query -> field('alertNotificationId') -> equals($clauses['alertNotificationId']);

			if(isset($clauses['alertHuman']))
				$query -> field('alertHuman') -> equals($clauses['alertHuman']);

			if(isset($clauses['active']))
				$query -> field('active') -> equals($clauses['active']);

			if(isset($clauses['startTime']))
				if(is_array($clauses['startTime']))
					$query -> field('startTime') -> range($clauses['startTime']['inf'], $clauses['startTime']['sup']);
				else
					$query -> field('startTime') -> equals($clauses['startTime']);

			if(isset($clauses['endTime']))
				if(is_array($clauses['endTime']))
					$query -> field('endTime') -> range($clauses['endTime']['inf'], $clauses['endTime']['sup']);
				else
					$query -> field('endTime') -> equals($clauses['endTime']);
		}

		/* Return */

		return $query
			-> getQuery()
			-> execute()
			-> toArray(false);
	}

	public function deleteAlertNotification($clauses = null)
	{
		/* Create query */

		$query = $this
			-> createQueryBuilder()
			-> remove();

		/* Add clauses */

		if($clauses)
		{
			if(isset($clauses['alertNotificationId']))
				$query -> field('alertNotificationId') -> equals($clauses['alertNotificationId']);

			if(isset($clauses['alertHuman']))
				$query -> field('alertHuman') -> equals($clauses['alertHuman']);

			if(isset($clauses['active']))
				$query -> field('active') -> equals($clauses['active']);

			if(isset($clauses['startTime']))
				if(is_array($clauses['startTime']))
					$query -> field('startTime') -> range($clauses['startTime']['inf'], $clauses['startTime']['sup']);
				else
					$query -> field('startTime') -> equals($clauses['startTime']);

			if(isset($clauses['endTime']))
				if(is_array($clauses['endTime']))
					$query -> field('endTime') -> range($clauses['endTime']['inf'], $clauses['endTime']['sup']);
				else
					$query -> field('endTime') -> equals($clauses['endTime']);
		}

		/* Return */

		$query
			-> getQuery()
			-> execute();

		return true;
	}

	public function deleteAlertNotificationAndContext($clauses = null)
	{
		$alertNotificationDeleted = array();

		$alertNotifications = $this -> getAlertNotification($clauses);

		foreach($alertNotifications as $alertNotification)
		{
			if($this -> deleteAlertNotification(array('alertNotificationId' => $alertNotification -> getAlertNotificationId())))
			{
				array_push($alertNotificationDeleted, $alertNotification);
			}
		}

		return $alertNotificationDeleted;
	}

	public function updateAlertNotification($alertNotificationId, $fields)
	{
		/* Create query */

		$query = $this
			-> createQueryBuilder()
			-> update();

		/* Add clauses */

		$query -> field('alertNotificationId') -> equals($alertNotificationId);

		/* Update fields */

		if($fields)
		{
			if(isset($fields['alertNotificationId']))
				$query -> field('alertNotificationId') -> set($fields['alertNotificationId']);

			if(isset($fields['alertHuman']))
				$query -> field('alertHuman') -> set($fields['alertHuman']);

			if(isset($fields['active']))
				$query -> field('active') -> set($fields['active']);

			if(isset($fields['startTime']))
				$query -> field('startTime') -> set($fields['startTime']);

			if(isset($fields['endTime']))
				$query -> field('endTime') -> set($fields['endTime']);
		}

		/* Return */

		$query
			-> getQuery()
			-> execute();

		return true;
	}

	public function endAlertNotification($alertNotificationId, $endTime)
	{
		return $this
			-> updateAlertNotification($alertNotificationId, array(
				'active' => 'false',
				'endTime' => $endTime
			));
	}

	public function clearAlertNotification($clearingDate)
	{
		/* Create query */

		$query = $this
			-> createQueryBuilder()
			-> update();

		/* Add clauses */

		$query -> field('active') -> equals('false');
		$query -> field('endTime') -> range('0000-00-00 00:00:00', $clearingDate);

		/* Update fields */

		$query -> field('active') -> set('cleared');

		/* Return */

		$query
			-> getQuery()
			-> execute();

		return true;
	}

	/* Private */
}