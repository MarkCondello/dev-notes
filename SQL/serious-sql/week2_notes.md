# [Identofying Duplicate Data](https://www.datawithdanny.com/courses/take/serious-sql/multimedia/17679728-identifying-duplicate-records)

Before working on a data set, we should inspect it by running a few operations to see if there are anamolies or outliers that show issues.

## Get a percentage of the measure groups
```
SELECT 
measure,
COUNT(*) AS frequency,
ROUND(100 * (COUNT(*)::NUMERIC / SUM( COUNT(*) ) OVER ())) AS percent
FROM health.user_logs
GROUP BY measure
ORDER BY frequency
```

## Get a percentage of the customer id groups
```
SELECT
id,
ROUND(
  100 * (COUNT(*)::NUMERIC / SUM( COUNT(*) ) OVER ())
  , 2
  ) AS percent
FROM health.user_logs
GROUP BY id
ORDER BY percent DESC
LIMIT 10
```

## Get the amount of rows for each customer id groups
```
SELECT
id,
COUNT(*) AS count
FROM health.user_logs
GROUP BY id
ORDER BY count DESC
LIMIT 20
```

## Get the different blood type groups
```
SELECT
systolic,
COUNT(*) AS count
FROM health.user_logs
GROUP BY systolic
ORDER BY count DESC
LIMIT 20
```

## Inspect the data where the measure = 0
```
SELECT
*
 FROM health.user_logs
 WHERE measure_value = 0;
```
** Nearly all 0 measure_value items are blood_pressure **

## Use that as a starting point to further analyize the measure types used...
```
SELECT
 measure,
 count(*) AS "measure count"
 FROM health.user_logs
 WHERE measure_value = 0
  GROUP BY measure;
  ```
** 562 rows which are blood_pressure have a 0 value **

## Get a count of rows which have a measure_value of null or 0 value
```
SELECT
  COUNT(*)
  FROM health.user_logs
  WHERE measure_value = 0
  OR measure_value IS null;
```
** 572 rows have a 0 value **

** We can get a count of distinct rows using a sub query
```
SELECT
  COUNT(*)
  FROM
  (
    SELECT 
    DISTINCT *
    FROM health.user_logs
  ) as sub;
```

## What is a CTE?
CTE stands for Common Table Expression - and when we compare it to something simple like Excel, we can think of CTEs as transformations applied to raw data inside an existing Excel sheet.

A CTE is a SQL query that manipulates existing data and stores the data outputs as a new reference, very similar to storing data in a new temporary Excel sheet (following the Excel analogy!)

Subsequent CTEs can refer to existing datasets, as well as previously generated CTEs. This allows for quite complex nested queries and operations to be performed, whilst keeping the code nice and readable!

```
WITH deduped_logs AS (
  SELECT DISTINCT *
  FROM health.user_logs
)
SELECT COUNT(*)
FROM deduped_logs;
```

## Temporary Tables

Whilst we could use subqueries and CTEs to capture the output directly in a single query - we can also create a temporary table with only the unique values of our dataset after we run the DISTINCT query.

Temporary tables can also be used with indexes and partitions to speed up performance of our SQL queries - something which we will cover later!

In practice - we like to make sure all the temporary tables we create are “clean” and often we will clear out any tables with the same target name as our new temporary table, just in case or better safe than to be sorry!

```
DROP TABLE IF EXISTS deduplicated_user_logs;
CREATE TEMP TABLE deduplicated_user_logs AS
SELECT DISTINCT *
FROM health.user_logs;
```

Temporary tables are automagically deleted once a session is shut down i.e hitting control + c on the terminal instance running the docker-compose command.

So now you’re probably thinking - ok thanks for showing 3 ways to get a distinct count of records from a dataset but which one should I use?
I would suggest the following decision making process by asking yourself this question:

*Will I need to use the deduplicated data later?*
- If yes - opt for temporary tables.
- If no - CTEs are your friend.

# Show unique diplicate records
```
-- Don't forget to clean up any existing temp tables!
DROP TABLE IF EXISTS unique_duplicate_records;

CREATE TEMPORARY TABLE unique_duplicate_records AS
SELECT *
FROM health.user_logs
GROUP BY
  id,
  log_date,
  measure,
  measure_value,
  systolic,
  diastolic
HAVING COUNT(*) > 1;

-- Finally let's inspect the top 10 rows of our temp table
SELECT *
FROM unique_duplicate_records
LIMIT 10;
```

# CTE of duplicate Counts

This next example shows duplicates which have more one copy:
```
WITH groupby_counts AS (
  SELECT *, COUNT(*) AS frequency
  FROM health.user_logs
  GROUP BY
  id, log_date, measure, measure_value, systolic, diastolic
)
SELECT * 
FROM groupby_counts
WHERE frequency > 1
ORDER BY frequency DESC
LIMIT 100;
```

## Exercises

Which id value has the most number of duplicate records in the health.user_logs table?
*first attempt*
```
SELECT id,
COUNT(*) as frequency
FROM health.user_logs
GROUP BY id
ORDER BY frequency DESC;
```
*054250c692e07a9fa9e62e345231df4b54ff435d with a count of 22325*

*second attempt*
```
WITH groupby_ids AS (
  SELECT id, log_date, measure, measure_value, systolic, diastolic,
  COUNT(*) as frequency
  FROM health.user_logs
  GROUP BY id, log_date, measure, measure_value, systolic, diastolic
  ORDER BY frequency DESC
)

SELECT id, SUM(frequency) AS total_count
FROM groupby_ids
WHERE frequency > 1
GROUP BY id
ORDER BY total_count DESC;
```
*054250c692e07a9fa9e62e345231df4b54ff435d with a count of 17279*

Which log_date value had the most duplicate records after removing the max duplicate id value from question 1?
```
WITH groupby_ids AS (
  SELECT id, log_date, measure, measure_value, systolic, diastolic,
  COUNT(*) as frequency
  FROM health.user_logs
  WHERE id != '054250c692e07a9fa9e62e345231df4b54ff435d'
  GROUP BY id, log_date, measure, measure_value, systolic, diastolic
  ORDER BY frequency DESC
)

SELECT log_date, SUM(frequency) AS total_count
FROM groupby_ids
WHERE frequency > 1
GROUP BY log_date
ORDER BY total_count DESC;
```
*ee653a96022cc3878e76d196b1667d95beca2db6 with a count of 758*
---
Which measure_value had the most occurences in the health.user_logs value when measure = 'weight'?

```
SELECT 
  measure_value,
  COUNT(measure_value) as measure_value_frequency
  FROM health.user_logs
  WHERE measure = 'weight'
  GROUP BY measure_value
  ORDER BY measure_value_frequency DESC
```
*68.49244787 with a frequency of 109*

---
How many single duplicated rows exist when measure = 'blood_pressure' in the health.user_logs?

<!-- ```
WITH duplicate_blood_pressure AS (
  SELECT id, log_date, measure, measure_value, systolic, diastolic,
  COUNT(*) as frequency
  FROM health.user_logs
  WHERE measure = 'blood_pressure'
  GROUP BY id, log_date, measure, measure_value, systolic, diastolic
  ORDER BY frequency DESC
)

SELECT COUNT(frequency) AS single_duplicates
FROM duplicate_blood_pressure
WHERE frequency = 2
GROUP BY frequency;
```
*140 single duplicate rows exist where blood_pressure is the measure type* -->

How about the total number of duplicate records in the same table?
<!-- ```
WITH duplicate_blood_pressure AS (
  SELECT id, log_date, measure, measure_value, systolic, diastolic,
  COUNT(*) as frequency
  FROM health.user_logs
  GROUP BY id, log_date, measure, measure_value, systolic, diastolic
  ORDER BY frequency DESC
)

SELECT SUM(single_duplicates) AS "total duplicates"
FROM (
  SELECT COUNT(frequency) AS single_duplicates
  FROM duplicate_blood_pressure
  WHERE frequency > 1
  GROUP BY frequency
) AS duplicates;
```
*Total duplicates in the table is 6562* -->

I was confused by the wording on this question. The terms used are ambiguouse.
The answer provided is:
```
WITH duplicate_blood_pressure AS (
  SELECT id, log_date, measure, measure_value, systolic, diastolic,
  COUNT(*) as frequency
  FROM health.user_logs
  WHERE measure = 'blood_pressure'
  GROUP BY id, log_date, measure, measure_value, systolic, diastolic
  ORDER BY frequency DESC
)

SELECT COUNT(*) AS single_duplicates,
SUM(frequency) AS total_duplicates
FROM duplicate_blood_pressure
WHERE frequency > 1

```
---
What percentage of records measure_value = 0 when measure = 'blood_pressure' in the health.user_logs table? 
 
How many records are there also for this same condition?
562 zero measure on bp - SELECT * FROM total_bp_with_zero
43891 total rows

```
WITH total_bp_with_zero AS (
  SELECT
  measure_value,
  COUNT(*) as zero_count
  FROM health.user_logs
  WHERE measure = 'blood_pressure'
  AND measure_value = 0
  GROUP BY measure_value
)

SELECT ROUND(100 * ((SELECT * FROM total_bp_with_zero) / SUM(COUNT(*))  Over ()), 2) as zero_bp_percent
FROM health.user_logs
```
*1.28 percent*

INCORRECT
The correct answer is below:
```
WITH measure_count_totals AS (
  SELECT
  measure_value,
  COUNT(*) AS total_count,
  SUM(COUNT(*)) Over () AS total_count_sum
  FROM health.user_logs
  WHERE measure = 'blood_pressure'
  GROUP BY measure_value
)
  
SELECT *,
ROUND(100 * (total_count::NUMERIC / total_count_sum), 2) AS percent
FROM measure_count_totals
WHERE measure_value = 0;
```
---
What percentage of records are duplicates in the health.user_logs table
```SELECT COUNT(*) 
FROM duplicate_CTE
WHERE duplicates_by_row > 1;

duplicates_by_row  = 6562

SELECT SUM(COUNT(*)) OVER () AS total_dups
FROM duplicate_CTE
total_dups = 31004

WITH duped_cols AS (
SELECT DISTINCT *
  FROM health.user_logs
)```

INCORRECT

```SELECT
ROUND( 
  (100 * (
    (SELECT COUNT(*) FROM health.user_logs) - (SELECT COUNT(*) FROM duped_cols)
    )
  )::NUMERIC / (SELECT COUNT(*) FROM health.user_logs), 2)
AS percent_of_dups; ```

*29.36*