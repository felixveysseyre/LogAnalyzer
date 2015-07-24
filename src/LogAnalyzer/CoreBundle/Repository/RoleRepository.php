<?php

namespace LogAnalyzer\CoreBundle\Repository;

use Doctrine\ODM\MongoDB\DocumentRepository;

class RoleRepository extends DocumentRepository
{
	public function insertRole($roleHuman)
	{
		$data = array(
			'roleHuman' => $roleHuman
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

	public function createRole($roleHuman)
	{
		$roleHuman = ucwords(strtolower($roleHuman));

		$count1 = $this -> countRole(array('roleHuman' => $roleHuman));

		if($count1 === 0)
		{
			return $this -> insertRole($roleHuman);
		}
		else
		{
			return false;
		}
	}

	public function countRole($clauses = null)
	{
		/* Create query */

		$query = $this
			-> createQueryBuilder()
			-> count();

		/* Add clauses */

		if($clauses)
		{
			if(isset($clauses['roleId']))
				$query -> field('roleId') -> equals($clauses['roleId']);

			if(isset($clauses['roleHuman']))
				$query -> field('roleHuman') -> equals($clauses['roleHuman']);
		}

		/* Return */

		return $query
			-> getQuery()
			-> execute();
	}

	public function getRole($clauses = null)
	{
		/* Create query */

		$query = $this -> createQueryBuilder();

		/* Add clauses */

		if($clauses)
		{
			if(isset($clauses['roleId']))
				$query -> field('roleId') -> equals($clauses['roleId']);

			if(isset($clauses['roleHuman']))
				$query -> field('roleHuman') -> equals($clauses['roleHuman']);
		}

		/* Return */

		return $query
			-> getQuery()
			-> execute()
			-> toArray(false);
	}

	public function deleteRole($clauses = null)
	{
		/* Create query */

		$query = $this
			-> createQueryBuilder()
			-> remove();

		/* Add clauses */

		if($clauses)
		{
			if(isset($clauses['roleId']))
				$query -> field('roleId') -> equals($clauses['roleId']);

			if(isset($clauses['roleHuman']))
				$query -> field('roleHuman') -> equals($clauses['roleHuman']);
		}

		/* Return */

		$query
			-> getQuery()
			-> execute();

		return true;
	}

	public function deleteRoleAndContext($clauses = null)
	{
		$roleDeleted = array();

		$roles = $this -> getRole($clauses);

		foreach($roles as $role)
		{
			if($this -> deleteRole(array('roleId' => $role -> getRoleId())))
			{
				array_push($roleDeleted, $role);
			}
		}

		return $roleDeleted;
	}

	public function updateRole($roleId, $fields)
	{
		/* Create query */

		$query = $this
			-> createQueryBuilder()
			-> update();

		/* Add clauses */

		$query -> field('roleId') -> equals($roleId);

		/* Update fields */

		if($fields)
		{
			if(isset($fields['roleId']))
				$query -> field('roleId') -> set($fields['roleId']);

			if(isset($fields['roleHuman']))
				$query -> field('roleHuman') -> set($fields['roleHuman']);
		}

		/* Return */

		return $query
			-> getQuery()
			-> execute();
	}
}