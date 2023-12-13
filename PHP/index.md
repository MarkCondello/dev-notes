## Namespacing
Namespacing can be set up for related code which is usually in the same directory. The namespaced name usually is the name of the directory.
When using namespacing, every class referenced in a namespaces class will assume to be loaded h=through its own namespace.
To include those classes, the `use CLASSNAME;` keywork is added.

More details about namespacing can be found (here)[https://www.daggerhartlab.com/autoloading-namespaces-in-php/].

## loading PHP files into a browser
`php -S localhost:8000`

## Autoloading with Composer
Leveraging Composers autoloader is a best practice for loading namespaces throughout an application. More details (here)[https://laracasts.com/series/php-for-beginners-2023-edition/episodes/47].

By including the following script in the root composer.json, we can references namespaced classes:
```
 "autoload": {
        "psr-4": {
            "Core": "Core/"
        }
    }
```

Running a composer dump-autoload will produce an error: A non-empty PSR-4 prefix must end with a namespace separator. Including following backslashes will fix the issue:
```
    "autoload": {
        "psr-4": {
            "Core\\": "Core/"
        }
    }
```

Then from the main entry point of the application, include the psr4 autoload.php file from vendor like so:require `BASE_PATH . 'vendor/autoload.php';`
If we dont have an entry point, we can add the autoload.php file using a relative path in the file where we want to `use` a namespaced file.
Remember to update the `psr-4` mapping so the namespace is registered with the composer `autoload_psr4.php` file.

Ensure that you reference the base path if the entry point file is not in the root.

### Composer search

Rather than going online to packagist and searching for packages, we can use the following command in the terminal to search for packages:

`composer search KEYWORK`