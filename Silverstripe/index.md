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

## Including a form on the front end
For this feature we are adding `CustomerRating` form on a `LandingPage` for users to leave a name and a rating.
To set up this relationship we need:
- a `CustomerRating` table with a CustomerName and Rating column,
- a relationship between a `CustomerRating` and a `LandingPage`,
- to set up a form with mapped fields, create a form action function and display the results all in the `LandingPageController` class.

**CustomerRating.php (DataObject)**
```
class CustomerRating extends DataObject
{
  private static $table_name = 'CustomerRating';
  private static $db = [
    'CustomerName' => 'Text',
    'Rating' => 'Int'
  ];
  private static $has_one = [
    'LandingPage' => LandingPage::class
  ];
}
```
**LandingPage.php (Page Model)**
```
...
 private static $has_many = [
    'CustomerRatings' => CustomerRating::class,
  ];
...
```
**LandingPageController.php (Controller)**
```
...
  public function CustomerRatingForm()
  {
    //Form params: Which class handles the form, the name of the form, its fields, the form action.
    $form = Form::create(
      $this,
      'CustomerRatingForm',
      FieldList::create(
        TextField::create('CustomerName'),
        TextField::create('Rating')
          ->setAttribute('type', 'number')
          ->setAttribute('min', '1')
          ->setAttribute('max', '5')
      ),
      FieldList::create(
        FormAction::create('HandleSubmit', 'Add Rating')
      )
    );
    return $form;
  }
  public function HandleSubmit($data, $form)
  {
    $customerRating = CustomerRating::create();
    $customerRating->LandingPageID = $this->ID;
    $form->saveInto($customerRating);
    $customerRating->write();
    return $this->redirectBack();
  }
  public function GetCustomerRatings()
  {
    return CustomerRating::get()->where(['LandingPageID', $this->ID])->sort('Created', 'DESC');
  }
```
Apart from the relationship between the `CustomerRating` and the `LandingPage` items, most of the work and form processing is done in the controller. 
The `HandleSubmit()` method gathers all the data from the form (the form has field names which correspond to the table columns ie CustomerName and Rating) and stores those into the `CustomerRating` table.
We can then retrieve all the `CustomerRating` items for the `LandingPage` using the [ORM system](https://www.silverstripe.org/learn/lessons/v4/introduction-to-the-orm-1). See `GetCustomerRatings()` function above.

## Select ServiceID to display LandingPages with paginated results

- create a landing page index, may need to create a holder object which allows landing pages only,
- landing pages should only be children of the panding page holder ( the url structure should be /partners(landing page holder name)/landing_page)
- add paginated results for the Landing Page index
- include a form to select a service which displays the associated landing pages

### Paginated results
In order to display paginated results we need the PaginatedList and the HTTPRequest dependency as well as a list of models we wish to paginated.

**LandingPageHolderController.php**
```
use SilverStripe\Control\HTTPRequest;
use SilverStripe\ORM\PaginatedList;
class LandingPageHolderController extends PageController 
{
  ...
   public function index(HTTPRequest $request)
  {
    $landingPages = LandingPage::get();
    $paginatedLandingPages = PaginatedList::create(
      $landingPages,
      $request
    )
      ->setPageLength(1)
      ->setPaginationGetVar('s'); //WT??? pagination start variable
    $data = [
      'Results' => $paginatedLandingPages
    ];
    return $data;
  }
}
```
Then on our front end, we can query the Results in our $data array like so:
**LandingPageHolder.ss**
```
<% if $Results %>
<% loop $Results %>
  <div class="item col-md-12">
    <div class="info-blog">
      <ul class="top-info">
        <% if $ServiceType %>
        <li>$ServiceType.Name</li>
        <% end_if %>
      </ul>
      <h3>
        <a href="$Link">$Title</a>
      </h3>
      ...
```

### Including a form to select categories
To display a form on the front end we can create a method which uses the `Form` dependency amongst other to display the the fields and button action
**LandingPageHolderController.php**
```
use SilverStripe\Forms\Form;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\DropdownField;
use SilverStripe\Forms\FormAction;
...
  public function LandingPageCategoryFilter()
  {
    $form = Form::create(
      $this,
      'LandingPageCategoryFilter',
      FieldList::create(
        DropdownField::create('ServiceTypeID', 'Select a service type', ServiceType::get() )->setEmptyString('(All service types)')
      ),
      FieldList::create(
        FormAction::create('index', "Filter Partners")
      )
    );
    $form->setFormMethod('GET')
      ->setFormAction($this->link())
      ->disableSecurityToken()
      ->loadDataFrom($this->request->getVars()); // this loads the previous selection 
    return $form;
  }
```

Then on the front end we can display this using the variable `$LandingPageCategoryFilter`.
To process the selections a user makes, we need to add a check to the index method for what gets passed in through the request.

**LandingPageHolderController.php**
```
 public function index(HTTPRequest $request)
  {
    $landingPages = LandingPage::get();
    if ($serviceID = $request->getVar('ServiceTypeID')) {
      $landingPages = $landingPages->filter([
        'ServiceType.ID' => $serviceID
      ]);
    }
  ...
```
As you can see above, we are filtering our the LandingPage items by the ServiceTypeID they are associated to.
The ServiceType relationship is set in the LandingPage Model.

**Sending requests to backend**
In a Controller, we can allow requests to be made to specific methods using:
`private static $allowed_actions = ['leadCaptureSubscribe', 'joinLeadCapture'];`

These methods can then retrieve a request and process it however we want. See an example of this below:
```
public function joinLeadCapture($request)
{
  $response = new \stdClass();
  $response->message = '';
  $response->success = false;
  if (SecurityToken::inst()->checkRequest($request) && $request->postVar('email') && $request->postVar('name')) {
    $obj = new JoinLeadCaptureSubmission();
    $obj->EmailAddress = $request->postVar('email');
    $obj->FullName = $request->postVar('name');
    try {
      if ($obj->write() !== false) {
        $response->message = 'Success';
        $response->success = true;
      } else {
        $response->message = 'Database error: '.$response->message;
        return json_encode($response);
      }
    } catch (Exception $e) {
      $message = "Error saving Lead Capture.";
      $e->getMessage();
      $response->message = $message;
      user_error($message, E_USER_ERROR);
      return json_encode($response);
    }
  }
  echo json_encode($response);
}
```

Now, we simply need to send the request with JS to this endpoint with the required inputs.
```
 submitButton.prop('disabled', true)
    $.ajax({
        type: 'POST',
        url: 'leadCapture/joinLeadCapture',
        data,
        dataType: 'json'
    }).done(function(msg) {
      if (typeof(msg.success) != 'undefined' && msg.success == true) {
        ...
```

*Note to self:* What is $.ajax doing differently to what axios.post is doing? Axios is sending data only to the request body and trying to retrieve values from postVar('INPUT_NAME') does not work.

## has_many & has_one relationship
Silverstripe provides scaffoloding for various types ofr data relationships. A common one is the has_many & has_one.
In a scenario where we want to capture `CustomerRating` against a `LandingPage`, we could use this relationship and its straightforward to set up.
A `CustomerRating` has one `LandingPage`;
A `LandingPage` has many `CustomerRating` items.

 *LandingPage.php*
 ```
private static $has_many = [
  'CustomerRatings' => CustomerRating::class,
];
 ```
 *CustomerRating.php*
```
private static $has_one = [
  'LandingPage' => LandingPage::class
];
```
After running a `/dev/build` SS will generate the relationship on the `LandingPage` table like the screenshot below:
!['has_one_&_has_many']('./imgs/has_one_has_many.png')

## has_many_many relationships

<!-- `Write up notes on many_many ie info_modules data objects`
 - include sorting `many_many_extraFields` options
 - $belongs_many_many and the table column structure
 - check the difference between has_many and has_many_many and provide details -->