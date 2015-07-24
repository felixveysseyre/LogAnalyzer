<?php

namespace LogAnalyzer\CoreBundle\Service;

use DateTime;

class Helpers
{
	/* Post Data */

	public function unProcessPostData($postDataArray)
	{
		foreach($postDataArray as $key => $postData)
		{
			if($postData === 'true')
			{
				$postDataArray[$key] = true;
			}
			elseif($postData === 'null')
			{
				$postDataArray[$key] = null;
			}
			elseif($postData === 'false')
			{
				$postDataArray[$key] = false;
			}
			elseif(is_numeric($postData))
			{
				$postDataArray[$key] = floatval($postData);
			}
		}

		return $postDataArray;
	}

	public function getPostData($request)
	{
		return $request -> request -> all();
	}

	public function getParameters($request, $keysToKeep = null)
	{
		$postData = $this -> getPostData($request);

		$parameters = ($keysToKeep) ? $this -> filterArray($postData, $keysToKeep) : $postData;

		return $this -> unProcessPostData($parameters);
	}

	/* Array */

	public function filterArray($baseArray, $keysToKeep)
	{
		if(is_array($baseArray))
		{
			return array_intersect_key($baseArray, array_flip($keysToKeep));
		}
		else
		{
			return array();
		}
	}

	public function mergeArrays($arrays)
	{
		if(sizeof($arrays) !== 0)
		{
			return call_user_func_array('array_merge', $arrays);
		}
		else
		{
			return array();
		}
	}

	/* Date */

	public function getDateString($days = null, $date = null)
	{
		$days = ($days) ? $days : 0;
		$date = ($date) ? strtotime($date) : time();

		return date('Y-m-d', $date + $days * 24 * 60 * 60);
	}

	public function getDateTimeString($days = null, $date = null)
	{
		$days = ($days) ? $days : 0;
		$date = ($date) ? strtotime($date) : time();

		return date('Y-m-d H:i:s', $date + $days * 24 * 60 * 60);
	}

	public function getHumanSecondsNumber($seconds)
	{
		if($seconds)
		{
			$seconds = round($seconds);

			$dtF = new DateTime("@0");
			$dtT = new DateTime("@$seconds");

			return $dtF
				-> diff($dtT)
				-> format('%H:%I:%S');
		}
		else
		{
			return false;
		}
	}

	/* Execution time */

	public function getExecutionTime($microTimeStart, $microTimeEnd)
	{
		return $this -> getHumanSecondsNumber($microTimeEnd - $microTimeStart);
	}
}
