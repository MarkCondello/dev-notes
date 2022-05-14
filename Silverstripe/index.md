## Setting up a new Page type
To create a new page type, we just need to create a Model and Controller in the same namespace.
**LandingPage.php (Page Model)**
``` 
namespace Markcond\Research; 
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

## Add Custom Fields
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


## Provide support for a Category (like) relationship
Steps to setup a relationship for the `LandingPage` Model to have a `Service` type selection include:
- adding a `ServiceType` DataObject which will create a new table with a `has_many` relationship to a `LandingPage`,
- creating a class for displaying a global menu for these `ServiceTypes` objects called `ServiceTypeAdmin`,
- and adding a `has_one` relationship from a `LandingPage` to a `ServiceType` with a select field which allows admins to choose a service type.

**ServiceType.php (Data Object)**
```
namespace Markcond\Research; 
use SilverStripe\ORM\DataObject;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\TextField;

class ServiceType extends DataObject
{
  private static $table_name = 'ServiceType';
  private static $db = [
    'Name' => 'Text'
  ];
  private static $has_many = [
    'LandingPages' => LandingPage::class
  ];
  public function getCMSFIelds()
  {
    return new FieldList(
      TextField::create('Name', 'Service type name.')
    );
  }
}
```
This is an individual ServiceType which can have many LandingPage objects. 

**ServiceTypeAdmin.php (ModelAdmin)**
```
namespace Markcond\Research;
use SilverStripe\Admin\ModelAdmin;
class ServiceTypeAdmin extends ModelAdmin
{
  private static $table_name = 'ServiceTypes'; // where is this table???
  private static $menu_title = 'Service Types';
  private static $url_segment = 'service-types';
  private static $managed_models = [
    ServiceType::class
  ];
}
```
The menu item displays the `ServiceType` dataObjects stored in the database.

**LandingPage.php (Page Model)**
```
 ...
  private static $has_one = [
    'ServiceType' => ServiceType::class
  ];
  
  public function getCMSFields()
  {
    $fields = parent::getCMSFields();
    $fields->addFieldsToTab('Root.Main', TextField::create('BannerTitle', 'Banner title text'));
    $fields->addFieldsToTab('Root.Main', DropdownField::create('ServiceTypeID', 'Select a service type', ServiceType::get() )->setEmptyString('(Select a service)'));
    return $fields;
  }

```
Here we are settings up the ORM relationship with a `ServiceType` and include a 
[dropdown list](https://api.silverstripe.org/4/SilverStripe/Forms/DropdownField.html)
 with all `ServiceType` options.
The dropdown list stores the `ServiceTypeID` to the `LandingPage` which is how SS sets the relationship with a `ServiceType`.