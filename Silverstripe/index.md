## Setting up a new Page type
To create a new page type, we just need to create a Model and Controller in the same namespace.
** LandingPage.php (Model)
``` 
namespace Silverstripe\Lessons;
use Page;
class LandingPage extends Page {}
```
**LandingPageController.php (Controller)**
```
namespace Silverstripe\Lessons;
use PageController;
class LandingPageController extends PageController
{
  public function init()
  {
    parent::init();
  }
}
```

After performing a `dev/build` this new Page type will be available in the SS admin.

## Passing admin settings to View
SS associates a Controller with a View based on name and its Namespace. Using the above namespace as an example, our template will be rendered at `templates/Silverstripe/Lessons/Layout`.
Our template filename mus reflect the Controller name ie `LandingPage.ss`.

By extending the Page class, a newly created page will nherit all of its properties and functionality, such as $Title, $Content, $Menu, etc.

Any time we create a new template, we need to flush the cache, so append ?flush to the URL and reload.

**Anytime there is a namespace change, the templates break even after flushing. The content needs to be recreated in the CMS in order for the template to render properly.**

## Add Customer fields
In order to add custom fields to a CMS page, we need to create a table where we can store the updated settings.
We can also include various field types like TextFields, DateFields, Image / File uploaders and more like so: `use SilverStripe\Forms\TextField;` and use those in our Model classes.

**LandingPage.php**
```
  private static $table_name = 'LandingPage';
  private static $db = [
    'BannerTitle' => 'Text'
  ];

  public function getCMSFields()
  {
    $fields = parent::getCMSFields();
    $fields->addFieldsToTab('Root.Main', TextField::create('BannerTitle', 'Banner title text'));
    return $fields;
  }
```
The `getCMSFields()` function will add the custom field in the page edit sreen underneath the content area.
Then in the front end, we can retrieve the `$BannerTitle` content stored in the database.
