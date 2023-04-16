## WP HTTP API

It's important to understand HTTP status codes, also referred to as response codes. Status codes are sent along with each server response. So when we make GET, POST, HEAD, or any other type of request, the response will include the status code. Here is a list of the most common status codes. 

1xx - custom status codes
2xx - request was successful
3xx - request was redirected to another URL
	301 moved permanently
	302 moved temporarily
4xx - request failed due to client error
	403 forbidden resource
	404 resource not found
5xx - request failed due to a server error

The http.php file in the includes has the following functions for making requests:

wp_safe_remote_get()
	retrieve the raw response from a HTTPrequest using GET method

wp_safe_remote_post()
	retrieve the raw response from a HTTP request using the POST method

wp_safe_remote_head()
	retrieve a raw response from a HTTP request using the HEAD method

wp_safe_remote_request()
	retrieve the raw response from a HTTP request using any valid method. This function enables us to make any type of request, including GET, POST, HEAD, or any other valid method. 

function http_get_request($url) {
	$url = esc_url_raw($url);
	$args = array('user-agent' => 'Plugin Demo: HTTP API; '. home_url());
	return wp_safe_remote_get($url, $args);
}

The following arguments can be passed to the $args array:
	$args = array(
		'method'      => 'GET',
		'timeout'     => 10,
		'redirection' => 5,
		'httpversion' => '1.1',
		'user-agent'  => 'Plugin Demo: HTTP API; '. home_url(),
		'blocking'    => true,
		'headers'     => array(),
		'cookies'     => array(),
		'body'        => null,
		'compress'    => false,
		'decompress'  => true,
		'sslverify'   => true,
		'stream'      => false,
		'filename'    => null
	);


https://developer.wordpress.org/plugins/http-api/

Making a bunch of HTTP requests can be expensive in terms of performance, so to help keep things speedy, here are a few things you can do. The key is knowing when the resource data has changed and needs updating. This is where HEAD requests come into play. If a HEAD request shows that the content has changed, then make a new GET or POST request, and cache the results using a transient. Otherwise, if the content has not changed, just use the stored transient, and skip the work of another request.