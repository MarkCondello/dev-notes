## WP Transients
https://css-tricks.com/the-deal-with-wordpress-transients/

The transients API enables us to store temporary data in the word press options table. For example if our plug in does something like fetch RSS feeds, we can use transients to cache the data and refresh it, say every hour.
Transient are a way to cache information that takes place on the server, as opposed to browser caching. Think of a transient as an organism that has three components:
* A key. A short string of text. The name of the organism.
* A value. Any php variable. The body — the guts, if you will — of the organism.
* A lifespan. Often expressed as a time constant such as DAY_IN_SECONDS. The amount of time for which we want this organism to live.

By caching the data we improve plug in performance and conserve server resources. Here are the main functions that we'll be using while working with the transients API. 

set_transient(),  https://developer.wordpress.org/reference/functions/set_transient/
get_transient(), 
and delete_transient(). 

To verify that the transient is stored in the database we can either visit the database via PHP my admin or we can use a plugin such as this one. The transients manager plugin allows us to view and manage our sites transients. On the transient manager plugin page we can verify that our transient is stored in the database. 