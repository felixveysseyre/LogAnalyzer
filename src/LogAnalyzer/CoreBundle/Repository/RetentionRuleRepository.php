<?php

namespace LogAnalyzer\CoreBundle\Repository;

use Doctrine\ODM\MongoDB\DocumentRepository;

class RetentionRuleRepository extends DocumentRepository
{
	/* Public */

	public function insertRetentionRule($service, $retention)
	{
		$data = array(
			'service' => $service,
			'retention' => $retention
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

	public function createRetentionRule($service, $retention)
	{
		$count1 = $this -> countRetentionRule(array('service' => $service));

		if($count1 === 0)
		{
			return $this -> insertRetentionRule($service, $retention);
		}
		else
		{
			return false;
		}
	}

	public function countRetentionRule($clauses = null)
	{
		/* Create query */

		$query = $this
			-> createQueryBuilder()
			-> count();

		/* Add clauses */

		if($clauses)
		{
			if(isset($clauses['retentionRuleId']))
				$query -> field('retentionRuleId') -> equals($clauses['retentionRuleId']);

			if(isset($clauses['service']))
				$query -> field('service') -> equals($clauses['service']);

			if(isset($clauses['retention']))
				$query -> field('retention') -> equals($clauses['retention']);
		}

		/* Return */

		return $query
			-> getQuery()
			-> execute();
	}

	public function getRetentionRule($clauses = null)
	{
		/* Create query */

		$query = $this -> createQueryBuilder();

		/* Add clauses */

		if($clauses)
		{
			if(isset($clauses['retentionRuleId']))
				$query -> field('retentionRuleId') -> equals($clauses['retentionRuleId']);

			if(isset($clauses['service']))
				$query -> field('service') -> equals($clauses['service']);

			if(isset($clauses['retention']))
				$query -> field('retention') -> equals($clauses['retention']);
		}

		/* Return */

		return $query
			-> getQuery()
			-> execute()
			-> toArray(false);
	}

	public function deleteRetentionRule($clauses = null)
	{
		/* Create query */

		$query = $this
			-> createQueryBuilder()
			-> remove();

		/* Add clauses */

		if($clauses)
		{
			if(isset($clauses['retentionRuleId']))
				$query -> field('retentionRuleId') -> equals($clauses['retentionRuleId']);

			if(isset($clauses['service']))
				$query -> field('service') -> equals($clauses['service']);

			if(isset($clauses['retention']))
				$query -> field('retention') -> equals($clauses['retention']);
		}

		/* Return */

		$query
			-> getQuery()
			-> execute();

		return true;
	}

	public function deleteRetentionRuleAndContext($clauses = null)
	{
		$retentionRuleDeleted = array();

		$retentionRules = $this -> getRetentionRule($clauses);

		foreach($retentionRules as $retentionRule)
		{
			if($this -> deleteRetentionRule(array('retentionRuleId' => $retentionRule -> getRetentionRuleId())))
			{
				array_push($retentionRuleDeleted, $retentionRule);
			}
		}

		return $retentionRuleDeleted;
	}

	public function updateRetentionRule($retentionRuleId, $fields)
	{
		/* Create query */

		$query = $this
			-> createQueryBuilder()
			-> update();

		/* Add clauses */

		$query -> field('retentionRuleId') -> equals($retentionRuleId);

		/* Update fields */

		if($fields)
		{
			if(isset($fields['retentionRuleId']))
				$query -> field('retentionRuleId') -> set($fields['retentionRuleId']);

			if(isset($fields['service']))
				$query -> field('service') -> set($fields['service']);

			if(isset($fields['retention']))
				$query -> field('retention') -> set($fields['retention']);
		}

		/* Return */

		$query
			-> getQuery()
			-> execute();

		return true;
	}

	/* Private */
}