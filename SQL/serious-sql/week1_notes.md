
  

  

## Page 17 SORT BY MULTIPLE COLUMNS

  

  

This script creates a table to run queries against.

  

I have not seen the `TEMP` keyword used before, neither the `AS WITH` combination.

  

```
DROP TABLE IF EXISTS sample_table;
CREATE TEMP TABLE sample_table AS
WITH raw_data (id, column_a, column_b)
AS (
VALUES
(1, 0 , 'A'),
(2, 0 , 'B'),
(3, 1 , 'C'),
(4, 1 , 'D'),
(5, 2 , 'E'),
(6, 3 , 'F')
)
SELECT * FROM raw_data;
SELECT * FROM sample_table
ORDER BY column_a, column_b;
```

  

##How many Records

`SELECT COUNT(*) AS row_count FROM dvd_rentals.film_list;`

  

## Unique columns

`SELECT DISTINCT rating FROM dvd_rentals.film_list;`

  

## Count unique vals

`SELECT COUNT(DISTINCT category) AS "Unique cats" FROM dvd_rentals.film_list;`

  

## Get the frequency of ratings

`SELECT rating, COUNT(*) as "Rating frequency" FROM dvd_rentals.film_list GROUP BY rating;`

  

What SQL does with GROUP BY is split out all the data by a table cell.
When performing a count(8) for a group by, only 1 row with the count value will be returned.

  

A integer divided by another integer will return a 0 or Intergal Floor value. One of the values needs to be cast as a ::NUMERIC type

See below for how a value can be cast:

```
    SELECT
    rating,
    COUNT(*) as frequency,
    COUNT(*)::NUMERIC / SUM(COUNT(*)) OVER () AS percentage
    FROM dvd_rentals.film_list
    GROUP BY rating
    ORDER BY percentage DESC;
```
To make the percentage result more readable we can use the ROUND function:
`CONCAT(ROUND(100 * (COUNT(*)::NUMERIC / SUM(COUNT(*)) OVER ()), 2), '%')  AS percentage`

## Group by multiple columns
This is a super important concept - true mastery of SQL requires a really strong understanding of this GROUP BY usage. If you don’t retain anything else from this section - please remember that only 1 row will ever be returned for each individual group from a GROUP BY !

Only the expression that is used in the GROUP BY grouping elements will be returned along with a single column value for each aggregate function used in the column expressions for the SELECT statement.

```
  SELECT
    rating,
    category,
    COUNT(*) AS frequency
    FROM dvd_rentals.film_list
    GROUP BY 1, 2
    # GROUP BY rating, category
    ORDER BY frequency;
```

## Ordering
Although this example dataset is quite simple - I can’t stress just how important this concept of ordering by multiple columns is. It becomes very very important when we start tackling window functions and other analytical techniques.
```
SELECT 
  r.rental_date, r.inventory_id, r.customer_id, CONCAT(c.first_name,' ', c.last_name) AS "Full Name"
FROM dvd_rentals.rental AS r
INNER JOIN dvd_rentals.customer AS c
ON r.customer_id = c.customer_id
ORDER BY r.rental_date, r.inventory_id DESC
LIMIT 5;
```

## Mocking as table with data
Below is a script which mocks up a new table and adds data to it:
```
WITH test_table (sample_values, some_column) AS (
VALUES
(null, 'something'),
('0123', 'barr'),
('_123', 'basz'),
(' 123', 'bang'),
('(abc', 'zing'),
('  abc', 'zong'),
('bca', 'zang')
)
SELECT * FROM test_table
ORDER BY 1 DESC NULLS FIRST;
```

#Exercises
Which actor_id has the most number of unique film_id records in the dvd_rentals.film_actor table?
```
SELECT
  actor_id AS "Actor Id",
  COUNT(DISTINCT film_id) AS "Total Unique Film Ids"
  FROM dvd_rentals.film_actor
  GROUP BY actor_id
  ORDER BY 2 DESC
  LIMIT 5;
  ```

How many distinct fid values are there for the 3rd most common price value in the dvd_rentals.nicer_but_slower_film_list table?

  SELECT 
    COUNT( DISTINCT fid) AS frequency,
    price
    FROM dvd_rentals.nicer_but_slower_film_list
  GROUP BY  price
  ORDER BY frequency DESC
-- 2.99 is the third common price, count 323

How many unique country_id values exist in the dvd_rentals.city table?

```
SELECT
 COUNT(DISTINCT country_id) AS "Unique Countries"
 FROM dvd_rentals.city
 ```

What percentage of overall total_sales does the Sports category make up in the dvd_rentals.sales_by_film_category table?
```
 SELECT * FROM
  (SELECT
  *,
  ROUND((total_sales * 100) / (SELECT SUM(total_sales) FROM dvd_rentals.sales_by_film_category))  AS percentage
  FROM dvd_rentals.sales_by_film_category
  GROUP BY category, total_sales) AS with_percentage
WHERE category = 'Sports';
```


What percentage of unique fid values are in the Children category in the dvd_rentals.film_list table?

```
SELECT * FROM
(
  SELECT *,
    ROUND(100 * cat_count::NUMERIC / SUM(cat_count) over (), 2) AS percentage
   FROM
   (SELECT
    COUNT(DISTINCT fid) AS cat_count,
    category
    FROM dvd_rentals.film_list
    GROUP BY category) AS cats
  GROUP BY cat_count, category
) AS percentage_groupings
WHERE category = 'Children';
```