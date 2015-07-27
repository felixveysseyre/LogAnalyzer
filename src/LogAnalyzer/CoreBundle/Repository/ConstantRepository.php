<?php

namespace LogAnalyzer\CoreBundle\Repository;

use Doctrine\ODM\MongoDB\DocumentRepository;

class ConstantRepository extends DocumentRepository
{
	/* Public */

	public function insertConstant($name, $type, $value)
	{
		$data = array(
			'name' => $name,
			'type' => $type,
			'value' => $value
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

	public function createConstant($name, $value)
	{
		$count1 = $this -> countConstant(array('name' => $name));

		if($count1 === 0)
		{
			$type = $this -> getValueType($value);
			$value = json_encode($value);

			return $this -> insertConstant($name, $type, $value);
		}
		else
		{
			return false;
		}
	}

	public function countConstant($clauses = null)
	{
		/* Create query */

		$query = $this
			-> createQueryBuilder()
			-> count();

		/* Add clauses */

		if($clauses)
		{
			if(isset($clauses['constantId']))
				$query -> field('constantId') -> equals($clauses['constantId']);

			if(isset($clauses['name']))
				$query -> field('name') -> equals($clauses['name']);

			if(isset($clauses['type']))
				$query -> field('type') -> equals($clauses['type']);

			if(isset($clauses['value']))
				$query -> field('value') -> equals($clauses['value']);
		}

		/* Return */

		return $query
			-> getQuery()
			-> execute();
	}

	public function getConstant($clauses = null)
	{
		/* Create query */

		$query = $this -> createQueryBuilder();

		/* Add clauses */

		if($clauses)
		{
			if(isset($clauses['constantId']))
				$query -> field('constantId') -> equals($clauses['constantId']);

			if(isset($clauses['name']))
				$query -> field('name') -> equals($clauses['name']);

			if(isset($clauses['type']))
				$query -> field('type') -> equals($clauses['type']);

			if(isset($clauses['value']))
				$query -> field('value') -> equals($clauses['value']);
		}

		/* Return */

		return $query
			-> getQuery()
			-> execute()
			-> toArray(false);
	}

	public function deleteConstant($clauses = null)
	{
		/* Create query */

		$query = $this
			-> createQueryBuilder()
			-> remove();

		/* Add clauses */

		if($clauses)
		{
			if(isset($clauses['constantId']))
				$query -> field('constantId') -> equals($clauses['constantId']);

			if(isset($clauses['name']))
				$query -> field('name') -> equals($clauses['name']);

			if(isset($clauses['type']))
				$query -> field('type') -> equals($clauses['type']);

			if(isset($clauses['value']))
				$query -> field('value') -> equals($clauses['value']);
		}

		/* Return */

		$query
			-> getQuery()
			-> execute();

		return true;
	}

	public function deleteConstantAndContext($clauses = null)
	{
		$constantDeleted = array();

		$constants = $this -> getConstant($clauses);

		foreach($constants as $constant)
		{
			if($this -> deleteConstant(array('constantId' => $constant -> getConstantId())))
			{
				array_push($constantDeleted, $constant);
			}
		}

		return $constantDeleted;
	}

	public function updateConstant($constantId, $fields)
	{
		/* Create query */

		$query = $this
			-> createQueryBuilder()
			-> update();

		/* Add clauses */

		$query -> field('constantId') -> equals($constantId);

		/* Update fields */

		if($fields)
		{
			if(isset($fields['constantId']))
				$query -> field('constantId') -> set($fields['constantId']);

			if(isset($fields['name']))
				$query -> field('name') -> set($fields['name']);

			if(isset($fields['type']))
				$query -> field('type') -> set($fields['type']);

			if(isset($fields['value']))
				$query -> field('value') -> set($fields['value']);
		}

		/* Return */

		$query
			-> getQuery()
			-> execute();

		return true;
	}

	/* Special */

	public function getConstantValue($name)
	{
		$constants = $this -> getConstant(array('name' => $name));

		if(sizeof($constants) === 1)
		{
			return $constants[0] -> getValue();
		}
		else
		{
			return false;
		}
	}

	public function updateConstantValue($name, $value)
	{
		$constants = $this -> getConstant(array('name' => $name));

		if(sizeof($constants) === 1)
		{
			$constantId = $constants[0] -> getConstantId();

			$fields = array(
				'type' => $this -> getValueType($value),
				'value' => json_encode($value)
			);

			return $this -> updateConstant($constantId, $fields);
		}
		else
		{
			return false;
		}
	}

	/* Private */

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