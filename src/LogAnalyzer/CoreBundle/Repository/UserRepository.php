<?php

namespace LogAnalyzer\CoreBundle\Repository;

use Doctrine\ODM\MongoDB\DocumentRepository;

class UserRepository extends DocumentRepository
{
	/* Public */

	public function insertUser($firstName, $lastName, $email, $password, $roleHuman)
	{
		$data = array(
			'firstName' => $firstName,
			'lastName' => $lastName,
			'email' => $email,
			'password' => $password,
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

	public function createUser($firstName, $lastName, $email, $rawPassword, $salt,  $roleId)
	{
		$firstName = ucwords(strtolower($firstName));
		$lastName = strtoupper($lastName);
		$password = $this -> encryptPassword($rawPassword, $salt);

		$count1 = $this -> countUser(array('firstName' => $firstName, 'lastName' => $lastName));
		$count2 = $this -> countUser(array('email' => $email));

		if($count1 === 0 && $count2 === 0)
		{
			$roles = $this
				-> getDocumentManager()
				-> getRepository('LogAnalyzerCoreBundle:Role')
				-> getRole(array('roleId' => $roleId));

			$roleHuman =  $roles[0] -> getRoleHuman();

			return $this -> insertUser($firstName, $lastName, $email, $password, $roleHuman);
		}
		else
		{
			return false;
		}
	}

	public function countUser($clauses = null)
	{
		/* Create query */

		$query = $this
			-> createQueryBuilder()
			-> count();

		/* Add clauses */

		if($clauses)
		{
			if(isset($clauses['userId']))
				$query -> field('userId') -> equals($clauses['userId']);

			if(isset($clauses['firstName']))
				$query -> field('firstName') -> equals($clauses['firstName']);

			if(isset($clauses['lastName']))
				$query -> field('lastName') -> equals($clauses['lastName']);

			if(isset($clauses['email']))
				$query -> field('email') -> equals($clauses['email']);

			if(isset($clauses['password']))
				$query -> field('password') -> equals($clauses['password']);
		}

		/* Return */

		return $query
			-> getQuery()
			-> execute();
	}

	public function getUser($clauses = null)
	{
		/* Create query */

		$query = $this -> createQueryBuilder();

		/* Add clauses */

		if($clauses)
		{
			if(isset($clauses['userId']))
				$query -> field('userId') -> equals($clauses['userId']);

			if(isset($clauses['firstName']))
				$query -> field('firstName') -> equals($clauses['firstName']);

			if(isset($clauses['lastName']))
				$query -> field('lastName') -> equals($clauses['lastName']);

			if(isset($clauses['email']))
				$query -> field('email') -> equals($clauses['email']);

			if(isset($clauses['password']))
				$query -> field('password') -> equals($clauses['password']);
		}

		/* Return */

		return $query
			-> getQuery()
			-> execute()
			-> toArray(false);
	}

	public function deleteUser($clauses = null)
	{
		/* Create query */

		$query = $this
			-> createQueryBuilder()
			-> remove();

		/* Add clauses */

		if($clauses)
		{
			if(isset($clauses['userId']))
				$query -> field('userId') -> equals($clauses['userId']);

			if(isset($clauses['firstName']))
				$query -> field('firstName') -> equals($clauses['firstName']);

			if(isset($clauses['lastName']))
				$query -> field('lastName') -> equals($clauses['lastName']);

			if(isset($clauses['email']))
				$query -> field('email') -> equals($clauses['email']);

			if(isset($clauses['password']))
				$query -> field('password') -> equals($clauses['password']);
		}

		/* Return */

		$query
			-> getQuery()
			-> execute();

		return true;
	}

	public function deleteUserAndContext($clauses = null)
	{
		$userDeleted = array();

		$users = $this -> getUser($clauses);

		foreach($users as $user)
		{
			if($this -> deleteUser(array('userId' => $user -> getUserId())))
			{
				array_push($userDeleted, $user);
			}
		}

		return $userDeleted;
	}

	public function updateUser($userId, $fields)
	{
		/* Create query */

		$query = $this
			-> createQueryBuilder()
			-> update();

		/* Add clauses */

		$query -> field('userId') -> equals($userId);

		/* Update fields */

		if($fields)
		{
			if(isset($fields['userId']))
				$query -> field('userId') -> set($fields['userId']);

			if(isset($fields['firstName']))
				$query -> field('firstName') -> set($fields['firstName']);

			if(isset($fields['lastName']))
				$query -> field('lastName') -> set($fields['lastName']);

			if(isset($fields['email']))
				$query -> field('email') -> set($fields['email']);

			if(isset($fields['password']))
				$query -> field('password') -> set($fields['password']);
		}

		/* Return */

		return $query
			-> getQuery()
			-> execute();
	}

	public function checkUser($userId, $rawPassword, $salt)
	{
		$password = $this -> encryptPassword($rawPassword, $salt);

		$users = $this -> getUser(array(
			'userId' => $userId,
			'password' => $password
		));

		if(is_array($users) && sizeof($users) === 1)
		{
			return $users[0];
		}
		else
		{
			return false;
		}
	}

	/* Private */

	private function encryptPassword($rawPassword, $salt)
	{
		return hash('sha256', $salt . $rawPassword);
	}
}