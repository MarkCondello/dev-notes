*Connent to mysql locally on terminal*
`mysql -u root -p`

# [Finding Percentage values](https://www.sqlshack.com/sql-percentage-calculation-examples-in-sql-server/)

There are various methods to get percentage values for a column.
The first is to use a `Sub Query` with the `agregate SUM` function:
```
SELECT
	`val`,
  ROUND(`val` * 100/(SELECT SUM(`val`) FROM `Scores` WHERE `val` < 40), 2) AS 'percent'
WHERE `val` < 40
FROM `Scores`;
```
---
The examples below use the `dvd_rentals.payment` table from data with danny.

```
SELECT customer_id, 
SUM(amount) AS "total spent",
100 * SUM(amount) / (SELECT SUM(amount) FROM dvd_rentals.payment WHERE customer_id < 10)  AS "customer spend percent"
FROM dvd_rentals.payment
WHERE customer_id < 10
GROUP BY customer_id
ORDER BY customer_id
```

** Using the OVER () clause
With the Over clause, you can avoid the use of subqueries for calculating percentages.

```
SELECT customer_id,
  SUM(amount) AS "total spent",
  (100 * SUM(amount)) / SUM(SUM(amount)) Over() AS "customer spend percent"
FROM dvd_rentals.payment
WHERE customer_id < 10
GROUP BY customer_id
ORDER BY customer_id
```

** Using Common Table Expression
First we create the table with the aggregated data we need for processing:
```
WITH PaymentCTE(customer_id, total_spent)
AS (
  SELECT customer_id, 
  SUM(amount) AS "total_spent"
  FROM dvd_rentals.payment
  WHERE customer_id < 10
  GROUP BY customer_id
  ORDER BY customer_id
)
```

Then we can run extra operations against the data which is already agregated for us:
```
SELECT 
customer_id, 
total_spent,
ROUND(total_spent / (SELECT 
  SUM(total_spent)
  FROM PaymentCTE
 ) * 100, 2) AS "total_percent"
FROM PaymentCTE
GROUP BY customer_id, total_spent
```

