<?php

namespace LogAnalyzer\CoreBundle\Repository;

use Doctrine\ODM\MongoDB\DocumentRepository;

class ParserRepository extends DocumentRepository
{
	/* Public */

	public function insertParser($parserHuman, $separator, $part)
	{
		$data = array(
			'parserHuman' => $parserHuman,
			'separator' => $separator,
			'part' => $part
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

	public function createParser($parserHuman, $separator, $part)
	{
		$count1 = $this -> countParser(array('parserHuman' => $parserHuman));

		if($count1 === 0)
		{
			return $this -> insertParser($parserHuman, $separator, $part);
		}
		else
		{
			return false;
		}
	}

	public function countParser($clauses = null)
	{
		/* Create query */

		$query = $this
			-> createQueryBuilder()
			-> count();

		/* Add clauses */

		if($clauses)
		{
			if(isset($clauses['parserId']))
				$query -> field('parserId') -> equals($clauses['parserId']);

			if(isset($clauses['parserHuman']))
				$query -> field('parserHuman') -> equals($clauses['parserHuman']);

			if(isset($clauses['separator']))
				$query -> field('separator') -> equals($clauses['separator']);

			if(isset($clauses['part']))
				$query -> field('part') -> equals($clauses['part']);
		}

		/* Return */

		return $query
			-> getQuery()
			-> execute();
	}

	public function getParser($clauses = null)
	{
		/* Create query */

		$query = $this -> createQueryBuilder();

		/* Add clauses */

		if($clauses)
		{
			if(isset($clauses['parserId']))
				$query -> field('parserId') -> equals($clauses['parserId']);

			if(isset($clauses['parserHuman']))
				$query -> field('parserHuman') -> equals($clauses['parserHuman']);

			if(isset($clauses['separator']))
				$query -> field('separator') -> equals($clauses['separator']);

			if(isset($clauses['part']))
				$query -> field('part') -> equals($clauses['part']);
		}

		/* Return */

		return $query
			-> getQuery()
			-> execute()
			-> toArray(false);
	}

	public function deleteParser($clauses = null)
	{
		/* Create query */

		$query = $this
			-> createQueryBuilder()
			-> remove();

		/* Add clauses */

		if($clauses)
		{
			if(isset($clauses['parserId']))
				$query -> field('parserId') -> equals($clauses['parserId']);

			if(isset($clauses['parserHuman']))
				$query -> field('parserHuman') -> equals($clauses['parserHuman']);

			if(isset($clauses['separator']))
				$query -> field('separator') -> equals($clauses['separator']);

			if(isset($clauses['part']))
				$query -> field('part') -> equals($clauses['part']);
		}

		/* Return */

		$query
			-> getQuery()
			-> execute();

		return true;
	}

	public function deleteParserAndContext($clauses = null)
	{
		$parserDeleted = array();

		$parsers = $this -> getParser($clauses);

		foreach($parsers as $parser)
		{
			if($this -> deleteParser(array('parserId' => $parser -> getParserId())))
			{
				array_push($parserDeleted, $parser);
			}
		}

		return $parserDeleted;
	}

	public function updateParser($parserId, $fields)
	{
		/* Create query */

		$query = $this
			-> createQueryBuilder()
			-> update();

		/* Add clauses */

		$query -> field('parserId') -> equals($parserId);

		/* Update fields */

		if($fields)
		{
			if(isset($fields['parserId']))
				$query -> field('parserId') -> set($fields['parserId']);

			if(isset($fields['parserHuman']))
				$query -> field('parserHuman') -> set($fields['parserHuman']);

			if(isset($fields['separator']))
				$query -> field('separator') -> set($fields['separator']);

			if(isset($fields['part']))
				$query -> field('part') -> set($fields['part']);
		}

		/* Return */

		$query
			-> getQuery()
			-> execute();

		return true;
	}

	/* Private */
}