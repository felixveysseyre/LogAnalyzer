<?php

namespace LogAnalyzer\CoreBundle\Repository;

use Doctrine\ODM\MongoDB\DocumentRepository;
use MongoRegex;

class LogRepository extends DocumentRepository
{
	/* Public */

	public function countLog($clauses = null)
	{
		/* Create query */

		$query = $this
			-> createQueryBuilder()
			-> count();

		/* Add clauses */

		if($clauses)
		{
			if(isset($clauses['logId']))
				$query -> field('logId') -> equals($clauses['logId']);

			if(isset($clauses['receptionTime']))
				if(is_array($clauses['receptionTime']))
					$query -> field('receptionTime') -> range($clauses['receptionTime']['inf'], $clauses['receptionTime']['sup']);
				else
					$query -> field('receptionTime') -> equals($clauses['receptionTime']);

			if(isset($clauses['reportedTime']))
				if(is_array($clauses['reportedTime']))
					$query -> field('reportedTime') -> range($clauses['reportedTime']['inf'], $clauses['reportedTime']['sup']);
				else
					$query -> field('reportedTime') -> equals($clauses['reportedTime']);

			if(isset($clauses['priority']))
				$query -> field('priority') -> equals($clauses['priority']);

			if(isset($clauses['host']))
				$query -> field('host') -> equals($clauses['host']);

			if(isset($clauses['hostLike']))
				$query -> field('host') -> equals(new MongoRegex('/.*' . $clauses['hostLike'] . '.*/i'));

			if(isset($clauses['service']))
				$query -> field('service') -> equals($clauses['service']);

			if(isset($clauses['message']))
				$query -> field('message') -> equals(new MongoRegex('/.*' . $clauses['message'] . '.*/i'));

			if(isset($clauses['syslogTag']))
				$query -> field('syslogTag') -> equals($clauses['syslogTag']);
		}

		/* Return */

		return $query
			-> getQuery()
			-> execute();
	}

	public function getLog($clauses = null)
	{
		/* Create query */

		$query = $this -> createQueryBuilder();

		/* Add clauses */

		if($clauses)
		{
			if(isset($clauses['logId']))
				$query -> field('logId') -> equals($clauses['logId']);

			if(isset($clauses['receptionTime']))
				if(is_array($clauses['receptionTime']))
					$query -> field('receptionTime') -> range($clauses['receptionTime']['inf'], $clauses['receptionTime']['sup']);
				else
					$query -> field('receptionTime') -> equals($clauses['receptionTime']);

			if(isset($clauses['reportedTime']))
				if(is_array($clauses['reportedTime']))
					$query -> field('reportedTime') -> range($clauses['reportedTime']['inf'], $clauses['reportedTime']['sup']);
				else
					$query -> field('reportedTime') -> equals($clauses['reportedTime']);

			if(isset($clauses['priority']))
				$query -> field('priority') -> equals($clauses['priority']);

			if(isset($clauses['host']))
				$query -> field('host') -> equals($clauses['host']);

			if(isset($clauses['hostLike']))
				$query -> field('host') -> equals(new MongoRegex('/.*' . $clauses['hostLike'] . '.*/i'));

			if(isset($clauses['service']))
				$query -> field('service') -> equals($clauses['service']);

			if(isset($clauses['message']))
				$query -> field('message') -> equals(new MongoRegex('/.*' . $clauses['message'] . '.*/i'));

			if(isset($clauses['syslogTag']))
				$query -> field('syslogTag') -> equals($clauses['syslogTag']);
		}

		/* Return */

		return $query
			-> getQuery()
			-> execute()
			-> toArray(false);
	}

	public function deleteLog($clauses = null)
	{
		/* Create query */

		$query = $this
			-> createQueryBuilder()
			-> remove();

		/* Add clauses */

		if($clauses)
		{
			if(isset($clauses['logId']))
				$query -> field('logId') -> equals($clauses['logId']);

			if(isset($clauses['receptionTime']))
				if(is_array($clauses['receptionTime']))
					$query -> field('receptionTime') -> range($clauses['receptionTime']['inf'], $clauses['receptionTime']['sup']);
				else
					$query -> field('receptionTime') -> equals($clauses['receptionTime']);

			if(isset($clauses['reportedTime']))
				if(is_array($clauses['reportedTime']))
					$query -> field('reportedTime') -> range($clauses['reportedTime']['inf'], $clauses['reportedTime']['sup']);
				else
					$query -> field('reportedTime') -> equals($clauses['reportedTime']);

			if(isset($clauses['priority']))
				$query -> field('priority') -> equals($clauses['priority']);

			if(isset($clauses['host']))
				$query -> field('host') -> equals($clauses['host']);

			if(isset($clauses['hostLike']))
				$query -> field('host') -> equals(new MongoRegex('/.*' . $clauses['hostLike'] . '.*/i'));

			if(isset($clauses['service']))
				$query -> field('service') -> equals($clauses['service']);

			if(isset($clauses['message']))
				$query -> field('message') -> equals(new MongoRegex('/.*' . $clauses['message'] . '.*/i'));

			if(isset($clauses['syslogTag']))
				$query -> field('syslogTag') -> equals($clauses['syslogTag']);
		}

		/* Return */

		$query
			-> getQuery()
			-> execute();

		return true;
	}

	public function getHost()
	{
		return $this
			-> createQueryBuilder()
			-> distinct('host')
			-> getQuery()
			-> execute()
			-> toArray(false);
	}

	public function getService()
	{
		return $this
			-> createQueryBuilder()
			-> distinct('service')
			-> getQuery()
			-> execute()
			-> toArray(false);
	}

	/* Private */

}