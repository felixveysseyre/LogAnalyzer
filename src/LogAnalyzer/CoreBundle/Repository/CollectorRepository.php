<?php

namespace LogAnalyzer\CoreBundle\Repository;

use Doctrine\ODM\MongoDB\DocumentRepository;

class CollectorRepository extends DocumentRepository
{
	/* Public */

	public function insertCollector($collectorHuman, $IP, $port)
	{
		$data = array(
			'collectorHuman' => $collectorHuman,
			'IP' => $IP,
			'port' => $port
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

	public function createCollector($collectorHuman, $IP, $port)
	{
		$count1 = $this -> countCollector(array('collectorHuman' => $collectorHuman));
		$count2 = $this -> countCollector(array('IP' => $IP));

		if($count1 === 0 && $count2 === 0)
		{
			return $this -> insertCollector($collectorHuman, $IP, $port);
		}
		else
		{
			return false;
		}
	}

	public function countCollector($clauses = null)
	{
		/* Create query */

		$query = $this
			-> createQueryBuilder()
			-> count();

		/* Add clauses */

		if($clauses)
		{
			if(isset($clauses['collectorId']))
				$query -> field('collectorId') -> equals($clauses['collectorId']);

			if(isset($clauses['collectorHuman']))
				$query -> field('collectorHuman') -> equals($clauses['collectorHuman']);

			if(isset($clauses['IP']))
				$query -> field('IP') -> equals($clauses['IP']);

			if(isset($clauses['port']))
				$query -> field('port') -> equals($clauses['port']);
		}

		/* Return */

		return $query
			-> getQuery()
			-> execute();
	}

	public function getCollector($clauses = null)
	{
		/* Create query */

		$query = $this -> createQueryBuilder();

		/* Add clauses */

		if($clauses)
		{
			if(isset($clauses['collectorId']))
				$query -> field('collectorId') -> equals($clauses['collectorId']);

			if(isset($clauses['collectorHuman']))
				$query -> field('collectorHuman') -> equals($clauses['collectorHuman']);

			if(isset($clauses['IP']))
				$query -> field('IP') -> equals($clauses['IP']);

			if(isset($clauses['port']))
				$query -> field('port') -> equals($clauses['port']);
		}

		/* Return */

		return $query
			-> getQuery()
			-> execute()
			-> toArray(false);
	}

	public function deleteCollector($clauses = null)
	{
		/* Create query */

		$query = $this
			-> createQueryBuilder()
			-> remove();

		/* Add clauses */

		if($clauses)
		{
			if(isset($clauses['collectorId']))
				$query -> field('collectorId') -> equals($clauses['collectorId']);

			if(isset($clauses['collectorHuman']))
				$query -> field('collectorHuman') -> equals($clauses['collectorHuman']);

			if(isset($clauses['IP']))
				$query -> field('IP') -> equals($clauses['IP']);

			if(isset($clauses['port']))
				$query -> field('port') -> equals($clauses['port']);
		}

		/* Return */

		$query
			-> getQuery()
			-> execute();

		return true;
	}

	public function deleteCollectorAndContext($clauses = null)
	{
		$collectorDeleted = array();

		$collectors = $this -> getCollector($clauses);

		foreach($collectors as $collector)
		{
			if($this -> deleteCollector(array('collectorId' => $collector -> getCollectorId())))
			{
				array_push($collectorDeleted, $collector);
			}
		}

		return $collectorDeleted;
	}

	public function updateCollector($collectorId, $fields)
	{
		/* Create query */

		$query = $this
			-> createQueryBuilder()
			-> update();

		/* Add clauses */

		$query -> field('collectorId') -> equals($collectorId);

		/* Update fields */

		if($fields)
		{
			if(isset($fields['collectorId']))
				$query -> field('collectorId') -> set($fields['collectorId']);

			if(isset($fields['collectorHuman']))
				$query -> field('collectorHuman') -> set($fields['collectorHuman']);

			if(isset($fields['IP']))
				$query -> field('IP') -> set($fields['IP']);

			if(isset($fields['port']))
				$query -> field('port') -> set($fields['port']);
		}

		/* Return */

		$query
			-> getQuery()
			-> execute();

		return true;
	}

	/* Private */
}