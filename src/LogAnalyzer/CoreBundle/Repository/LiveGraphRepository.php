<?php

namespace LogAnalyzer\CoreBundle\Repository;

use Doctrine\ODM\MongoDB\DocumentRepository;

class LiveGraphRepository extends DocumentRepository
{
	/* Public */

	public function insertLiveGraph($liveGraphHuman, $filter)
	{
		$data = array(
			'liveGraphHuman' => $liveGraphHuman,
			'filter' => $filter
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

	public function createLiveGraph($liveGraphHuman, $filter)
	{
		$count1 = $this -> countLiveGraph(array('liveGraphHuman' => $liveGraphHuman));

		if($count1 === 0)
		{
			$filter = json_encode($filter);

			return $this -> insertLiveGraph($liveGraphHuman, $filter);
		}
		else
		{
			return false;
		}
	}

	public function countLiveGraph($clauses = null)
	{
		/* Create query */

		$query = $this
			-> createQueryBuilder()
			-> count();

		/* Add clauses */

		if($clauses)
		{
			if(isset($clauses['liveGraphId']))
				$query -> field('liveGraphId') -> equals($clauses['liveGraphId']);

			if(isset($clauses['liveGraphHuman']))
				$query -> field('liveGraphHuman') -> equals($clauses['liveGraphHuman']);

			if(isset($clauses['filter']))
				$query -> field('filter') -> equals($clauses['filter']);
		}

		/* Return */

		return $query
			-> getQuery()
			-> execute();
	}

	public function getLiveGraph($clauses = null)
	{
		/* Create query */

		$query = $this -> createQueryBuilder();

		/* Add clauses */

		if($clauses)
		{
			if(isset($clauses['liveGraphId']))
				$query -> field('liveGraphId') -> equals($clauses['liveGraphId']);

			if(isset($clauses['liveGraphHuman']))
				$query -> field('liveGraphHuman') -> equals($clauses['liveGraphHuman']);

			if(isset($clauses['filter']))
				$query -> field('filter') -> equals($clauses['filter']);
		}

		/* Return */

		return $query
			-> getQuery()
			-> execute()
			-> toArray(false);
	}

	public function deleteLiveGraph($clauses = null)
	{
		/* Create query */

		$query = $this
			-> createQueryBuilder()
			-> remove();

		/* Add clauses */

		if($clauses)
		{
			if(isset($clauses['liveGraphId']))
				$query -> field('liveGraphId') -> equals($clauses['liveGraphId']);

			if(isset($clauses['liveGraphHuman']))
				$query -> field('liveGraphHuman') -> equals($clauses['liveGraphHuman']);

			if(isset($clauses['filter']))
				$query -> field('filter') -> equals($clauses['filter']);
		}

		/* Return */

		$query
			-> getQuery()
			-> execute();

		return true;
	}

	public function deleteLiveGraphAndContext($clauses = null)
	{
		$liveGraphDeleted = array();

		$liveGraphs = $this -> getLiveGraph($clauses);

		foreach($liveGraphs as $liveGraph)
		{
			if($this -> deleteLiveGraph(array('liveGraphId' => $liveGraph -> getLiveGraphId())))
			{
				array_push($liveGraphDeleted, $liveGraph);
			}
		}

		return $liveGraphDeleted;
	}

	public function updateLiveGraph($liveGraphId, $fields)
	{
		/* Create query */

		$query = $this
			-> createQueryBuilder()
			-> update();

		/* Add clauses */

		$query -> field('liveGraphId') -> equals($liveGraphId);

		/* Update fields */

		if($fields)
		{
			if(isset($fields['liveGraphId']))
				$query -> field('liveGraphId') -> set($fields['liveGraphId']);

			if(isset($fields['liveGraphHuman']))
				$query -> field('liveGraphHuman') -> set($fields['liveGraphHuman']);

			if(isset($fields['filter']))
				$query -> field('filter') -> set($fields['filter']);
		}

		/* Return */

		$query
			-> getQuery()
			-> execute();

		return true;
	}

	/* Private */
}