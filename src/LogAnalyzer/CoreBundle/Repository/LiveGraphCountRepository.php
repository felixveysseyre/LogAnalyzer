<?php

namespace LogAnalyzer\CoreBundle\Repository;

use Doctrine\ODM\MongoDB\DocumentRepository;

class LiveGraphCountRepository extends DocumentRepository
{
	/* Public */

	public function insertLiveGraphCount($liveGraphHuman, $reportedTime, $count)
	{
		$data = array(
			'liveGraphHuman' => $liveGraphHuman,
			'reportedTime' => $reportedTime,
			'count' => $count
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

	public function createLiveGraphCount($liveGraphHuman, $reportedTime, $count)
	{
		return $this -> insertLiveGraphCount($liveGraphHuman, $reportedTime, $count);
	}

	public function countLiveGraphCount($clauses = null)
	{
		/* Create query */

		$query = $this
			-> createQueryBuilder()
			-> count();

		/* Add clauses */

		if($clauses)
		{
			if(isset($clauses['liveGraphCountId']))
				$query -> field('liveGraphCountId') -> equals($clauses['liveGraphCountId']);

			if(isset($clauses['liveGraphHuman']))
				$query -> field('liveGraphHuman') -> equals($clauses['liveGraphHuman']);

			if(isset($clauses['reportedTime']))
				if(is_array($clauses['reportedTime']))
					$query -> field('reportedTime') -> range($clauses['reportedTime']['inf'], $clauses['reportedTime']['sup']);
				else
					$query -> field('reportedTime') -> equals($clauses['reportedTime']);

			if(isset($clauses['count']))
				$query -> field('count') -> equals($clauses['count']);
		}

		/* Return */

		return $query
			-> getQuery()
			-> execute();
	}

	public function getLiveGraphCount($clauses = null)
	{
		/* Create query */

		$query = $this -> createQueryBuilder();

		/* Add clauses */

		if($clauses)
		{
			if(isset($clauses['liveGraphCountId']))
				$query -> field('liveGraphCountId') -> equals($clauses['liveGraphCountId']);

			if(isset($clauses['liveGraphHuman']))
				$query -> field('liveGraphHuman') -> equals($clauses['liveGraphHuman']);

			if(isset($clauses['reportedTime']))
				if(is_array($clauses['reportedTime']))
					$query -> field('reportedTime') -> range($clauses['reportedTime']['inf'], $clauses['reportedTime']['sup']);
				else
					$query -> field('reportedTime') -> equals($clauses['reportedTime']);

			if(isset($clauses['count']))
				$query -> field('count') -> equals($clauses['count']);
		}

		/* Return */

		return $query
			-> getQuery()
			-> execute()
			-> toArray(false);
	}

	public function deleteLiveGraphCount($clauses = null)
	{
		/* Create query */

		$query = $this
			-> createQueryBuilder()
			-> remove();

		/* Add clauses */

		if($clauses)
		{
			if(isset($clauses['liveGraphCountId']))
				$query -> field('liveGraphCountId') -> equals($clauses['liveGraphCountId']);

			if(isset($clauses['liveGraphHuman']))
				$query -> field('liveGraphHuman') -> equals($clauses['liveGraphHuman']);

			if(isset($clauses['reportedTime']))
				if(is_array($clauses['reportedTime']))
					$query -> field('reportedTime') -> range($clauses['reportedTime']['inf'], $clauses['reportedTime']['sup']);
				else
					$query -> field('reportedTime') -> equals($clauses['reportedTime']);

			if(isset($clauses['count']))
				$query -> field('count') -> equals($clauses['count']);
		}

		/* Return */

		$query
			-> getQuery()
			-> execute();

		return true;
	}

	public function deleteLiveGraphCountAndContext($clauses = null)
	{
		$liveGraphCountDeleted = array();

		$liveGraphCounts = $this -> getLiveGraphCount($clauses);

		foreach($liveGraphCounts as $liveGraphCount)
		{
			if($this -> deleteLiveGraphCount(array('liveGraphCountId' => $liveGraphCount -> getLiveGraphCountId())))
			{
				array_push($liveGraphCountDeleted, $liveGraphCount);
			}
		}

		return $liveGraphCountDeleted;
	}

	public function updateLiveGraphCount($liveGraphCountId, $fields)
	{
		/* Create query */

		$query = $this
			-> createQueryBuilder()
			-> update();

		/* Add clauses */

		$query -> field('liveGraphCountId') -> equals($liveGraphCountId);

		/* Update fields */

		if($fields)
		{
			if(isset($fields['liveGraphCountId']))
				$query -> field('liveGraphCountId') -> set($fields['liveGraphCountId']);

			if(isset($fields['liveGraphHuman']))
				$query -> field('liveGraphHuman') -> set($fields['liveGraphHuman']);

			if(isset($fields['active']))
				$query -> field('active') -> set($fields['active']);

			if(isset($fields['reportedTime']))
				$query -> field('reportedTime') -> set($fields['reportedTime']);

			if(isset($fields['count']))
				$query -> field('count') -> set($fields['count']);
		}

		/* Return */

		$query
			-> getQuery()
			-> execute();

		return true;
	}

	/* Private */
}