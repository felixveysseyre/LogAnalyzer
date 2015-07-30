<?php

namespace LogAnalyzer\CoreBundle\Repository;

use Doctrine\ODM\MongoDB\DocumentRepository;

class AlertRepository extends DocumentRepository
{
	/* Public */

	public function insertAlert($alertHuman, $liveGraphHuman, $trigger, $status, $notification)
	{
		$data = array(
			'alertHuman' => $alertHuman,
			'liveGraphHuman' => $liveGraphHuman,
			'trigger' => $trigger,
			'status' => $status,
			'notification' => $notification
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

	public function createAlert($alertHuman, $liveGraphId, $trigger, $notification)
	{
		$count1 = $this -> countAlert(array('alertHuman' => $alertHuman));

		if($count1 === 0)
		{
			$liveGraphs = $this
				-> getDocumentManager()
				-> getRepository('LogAnalyzerCoreBundle:LiveGraph')
				-> getLiveGraph(array('liveGraphId' => $liveGraphId));

			$liveGraphHuman =  $liveGraphs[0] -> getLiveGraphHuman();

			$trigger = json_encode($trigger);

			$status = json_encode(array(
				'active' => false,
				'countRaise' => 0,
				'countUnRaise' => 0,
			));

			$notification = json_encode($notification);

			return $this -> insertAlert($alertHuman, $liveGraphHuman, $trigger, $status, $notification);
		}
		else
		{
			return false;
		}
	}

	public function countAlert($clauses = null)
	{
		/* Create query */

		$query = $this
			-> createQueryBuilder()
			-> count();

		/* Add clauses */

		if($clauses)
		{
			if(isset($clauses['alertId']))
				$query -> field('alertId') -> equals($clauses['alertId']);

			if(isset($clauses['alertHuman']))
				$query -> field('alertHuman') -> equals($clauses['alertHuman']);

			if(isset($clauses['liveGraphHuman']))
				$query -> field('liveGraphHuman') -> equals($clauses['liveGraphHuman']);

			if(isset($clauses['status']))
				$query -> field('status') -> equals($clauses['status']);

			if(isset($clauses['notification']))
				$query -> field('notification') -> equals($clauses['notification']);
		}

		/* Return */

		return $query
			-> getQuery()
			-> execute();
	}

	public function getAlert($clauses = null)
	{
		/* Create query */

		$query = $this -> createQueryBuilder();

		/* Add clauses */

		if($clauses)
		{
			if(isset($clauses['alertId']))
				$query -> field('alertId') -> equals($clauses['alertId']);

			if(isset($clauses['alertHuman']))
				$query -> field('alertHuman') -> equals($clauses['alertHuman']);

			if(isset($clauses['liveGraphHuman']))
				$query -> field('liveGraphHuman') -> equals($clauses['liveGraphHuman']);

			if(isset($clauses['status']))
				$query -> field('status') -> equals($clauses['status']);

			if(isset($clauses['notification']))
				$query -> field('notification') -> equals($clauses['notification']);
		}

		/* Return */

		return $query
			-> getQuery()
			-> execute()
			-> toArray(false);
	}

	public function deleteAlert($clauses = null)
	{
		/* Create query */

		$query = $this
			-> createQueryBuilder()
			-> remove();

		/* Add clauses */

		if($clauses)
		{
			if(isset($clauses['alertId']))
				$query -> field('alertId') -> equals($clauses['alertId']);

			if(isset($clauses['alertHuman']))
				$query -> field('alertHuman') -> equals($clauses['alertHuman']);

			if(isset($clauses['liveGraphHuman']))
				$query -> field('liveGraphHuman') -> equals($clauses['liveGraphHuman']);

			if(isset($clauses['status']))
				$query -> field('status') -> equals($clauses['status']);

			if(isset($clauses['notification']))
				$query -> field('notification') -> equals($clauses['notification']);
		}

		/* Return */

		$query
			-> getQuery()
			-> execute();

		return true;
	}

	public function deleteAlertAndContext($clauses = null)
	{
		$alertDeleted = array();

		$alerts = $this -> getAlert($clauses);

		foreach($alerts as $alert)
		{
			if($this -> deleteAlert(array('alertId' => $alert -> getAlertId())))
			{
				array_push($alertDeleted, $alert);
			}
		}

		return $alertDeleted;
	}

	public function updateAlert($alertId, $fields)
	{
		/* Create query */

		$query = $this
			-> createQueryBuilder()
			-> update();

		/* Add clauses */

		$query -> field('alertId') -> equals($alertId);

		/* Update fields */

		if($fields)
		{
			if(isset($fields['alertId']))
				$query -> field('alertId') -> set($fields['alertId']);

			if(isset($fields['alertHuman']))
				$query -> field('alertHuman') -> set($fields['alertHuman']);

			if(isset($fields['liveGraphHuman']))
				$query -> field('liveGraphHuman') -> set($fields['liveGraphHuman']);

			if(isset($clauses['status']))
				$query -> field('status') -> set($clauses['status']);

			if(isset($clauses['notification']))
				$query -> field('notification') -> set($clauses['notification']);
		}

		/* Return */

		$query
			-> getQuery()
			-> execute();

		return true;
	}

	/* Private */
}