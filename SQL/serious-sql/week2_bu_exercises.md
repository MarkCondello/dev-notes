## Exercises

Which id value has the most number of duplicate records in the health.user_logs table?
`054250c692e07a9fa9e62e345231df4b54ff435d with 17279 duplicates`
*Using the script directly above, we tapped on the `SUM(frequency)`*

```
WITH groupby_counts AS (
  SELECT *, COUNT(*) AS frequency
  FROM health.user_logs
  GROUP BY
  id, log_date, measure, measure_value,systolic,diastolic
)
SELECT *
-- id, 
-- SUM(frequency) as total_duplicates
FROM groupby_counts
WHERE frequency > 1
-- GROUP BY id
-- ORDER BY total_duplicates DESC
ORDER BY frequency DESC
LIMIT 100;
```

Which log_date value had the most duplicate records after removing the max duplicate id value from question 1?
*very similar to the script above, My answer: 2019-12-11 55*
```
SELECT 
log_date,
SUM(frequency) as total_duplicates
FROM groupby_counts
WHERE frequency > 1
GROUP BY log_date
ORDER BY total_duplicates DESC
LIMIT 100;
```

Which measure_value had the most occurences in the health.user_logs value when measure = 'weight'?
*68.49244787 109*
```
SELECT measure_value, COUNT(*) AS frequency
FROM health.user_logs
WHERE measure = 'weight'
GROUP BY measure_value 
ORDER BY frequency DESC;
```
---
How many single duplicated rows exist when measure = 'blood_pressure' in the health.user_logs? 

How about the total number of duplicate records in the same table?

---
What percentage of records measure_value = 0 when measure = 'blood_pressure' in the health.user_logs table? 

```
SELECT 
  measure_value,
  ROUND(
      100 * (COUNT(*)::NUMERIC / SUM(COUNT(*)) OVER ()), 2 
    ) AS percent
  FROM health.user_logs
  WHERE measure = 'blood_pressure'
  GROUP BY measure_value
  ORDER BY percent DESC;
```
How many records are there also for this same condition?
```
 SELECT 
  measure_value,
  COUNT(*)
  FROM health.user_logs
  WHERE measure = 'blood_pressure'
  GROUP BY measure_value
  ORDER BY count DESC;
  ```

---
What percentage of records are duplicates in the health.user_logs table


HERE IS THE ANSWER FROM THE TUTE:
```
WITH deduped_logs AS (
  SELECT DISTINCT *
  FROM health.user_logs
)
SELECT
  ROUND(
    100 * (
      (SELECT COUNT(*) FROM health.user_logs) -
      (SELECT COUNT(*) FROM deduped_logs)
    )::NUMERIC /
    (SELECT COUNT(*) FROM health.user_logs),
    2
  ) AS duplicate_percentage;
  ```