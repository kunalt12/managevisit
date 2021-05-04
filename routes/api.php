<?php
 
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Config;
use App\Http\Middleware\CheckSlug;
 
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Auth::routes();

/*
 * Route for API
 */
Route::group(['middleware' => ['check-slug'], 'prefix' => '/mobile/{slug}'], function () {
    Route::post('refresh-token', 'Auth\LoginController@reset_token')->middleware('cors');
    Route::get("check-for-login", "Auth\LoginController@check_login")->middleware('cors');

    Route::get('get-countries', function() {
        return App\Country::all();
    });

    Route::get('get-states/{country_id}', function($country_id) {
        return App\State::where('country_id', $country_id)->get();
    });

    Route::get('get-cities/{state_id}', function($state_id) {
        return App\City::where('state_id', $state_id)->get();
    });
    
    Route::group(['middleware' => ['jwt.auth','cors']], function () {
        /* Get City State and country */

        Route::get('tours/tour-crone', 'ToursController@tourCron');
        Route::get('tours/tour-notification-crone', 'ToursController@tourNotificationCron');
        Route::get('tours/tour-notification-beforehour', 'ToursController@tourNotificationBeforeHour');
        Route::get('tours/past-tour-soft-delete', 'ToursController@pastTourSoftDelete');
        

        Route::post('tours/tour-action', 'ToursController@touraction');
        Route::post('tours/add-feedback', 'ToursController@addFeedback');
        Route::get('tours/feedback/{id}', 'ToursController@feedback');
        Route::get('tours/getTask/{id}', 'ToursController@getTask');
        Route::post('tours/getTaskUpdate', 'ToursController@getTaskUpdate'); 
    
        /* List route */
        Route::post('momento/get-momento-list', 'MomentosController@showDataTable');
        
        Route::post('meals/get-meals-list', 'MealsController@showDataTable'); 
        Route::post('transports/get-transports-list', 'TransportsController@showDataTable');
        Route::post('visitors/get-visitors-list', 'VisitorsController@showDataTable');
        Route::post('organizations/get-organizations-list', 'OrganizationsController@showDataTable');
        Route::post('tourtypes/get-tourtypes-list', 'TourtypesController@showDataTable');
        Route::post('locations/get-locations-list', 'LocationsController@showDataTable');
        Route::post('roles/get-roles-list', 'RoleController@showDataTable');
        Route::post('get-role-permission', 'RoleController@getRolePermissions');
        Route::post('roles/role-list', 'RoleController@getRoleList');
        Route::post('contactmanagements/get-contactmanagements-list', 'ContactmanagementsController@showDataTable');
        Route::post('refferencemanagements/get-refferencemanagements-list', 'RefferencemanagementsController@showDataTable');
        Route::post('meetingmanagements/get-meetingmanagements-list', 'MeetingmanagementsController@showDataTable');
        Route::post('defaulttasks/get-defaulttasks-list', 'DefaulttasksController@showDataTable');
        Route::post('defaulttasks/get-defaulttasks', 'DefaulttasksController@getTaskByType');
        Route::post('tours/get-tours-list', 'ToursController@showDataTable');
        
        Route::post('tours/resendlink', 'ToursController@resendlink');

        Route::post('tours/add-task', 'ToursController@addtask');
        Route::post('tours/update-task', 'ToursController@updatetask');
        Route::post('tours/delete-task', 'ToursController@deletetask');
        
        
        Route::post('tours/tour-document', 'ToursController@tour_document');
        Route::post('tours/delete-document', 'ToursController@delete_document');
        Route::post('tours/tour-notes', 'ToursController@tour_notes');
        Route::post('tours/delete-notes', 'ToursController@notes_delete');

        Route::get('tours/organization-name', 'ToursController@organization');
        Route::post('tours/action-task', 'ToursController@actionTask');
        Route::post('tours/delete-visitor', 'ToursController@destroyVisitor');        
        
        Route::get('users/available-user', 'UserController@showAvailableUser');
        Route::put('users/change-password/{id}', 'UserController@changePassword');
        Route::put('users/admin-change-password/{id}', 'UserController@adminChangePassword');
        Route::post('users/resend-welcome-email', 'UserController@sendWelcomeEmail');
        Route::put('users/change-availability/{id}', 'UserController@changeAvailability');
        
        Route::post('tourtypes/get-all-tourtype', 'TourtypesController@getAllTourType');
        Route::post('contactmanagements/checkvitisitorphone', 'ContactmanagementsController@checkByPhone');
        Route::post('refferencemanagements/checkvitisitorphone', 'RefferencemanagementsController@checkByPhone');
        Route::post('meetingmanagements/checkvitisitorphone', 'MeetingmanagementsController@checkByPhone');
        Route::post('mealservicetypes/get-mealservicetypes-list', 'MealservicetypesController@showDataTable');
        Route::post('mealservicelocations/get-mealservicelocations-list', 'MealservicelocationsController@showDataTable');
        Route::post('mealcategories/get-mealcategories-list', 'MealcategoriesController@showDataTable');
        Route::post('tours/add-meeting', 'ToursController@addmeeting');
        Route::post('tours/delete-meeting', 'ToursController@deletemeeting');
        
        Route::post('users/get-users-list', 'UserController@showDataTable');
        Route::post('users/get-availabilities-list', 'UserController@getAvailabilityHistory');
//      Route::post('users/get-volunteers-user', 'UserController@getUserByType');
//        Route::post('users/get-volunteers-user/{id}', [
//            'uses' => 'UserController@getUserByType',
//            'tourid' => '{{id}}'
//        ]);
        Route::get('users/tour-manager', 'UserController@getTourManager');
        
        Route::post('emailtemplates/get-emailtemplates-list', 'EmailtemplatesController@showDataTable');
        Route::post('affiliations/get-affiliations-list', 'AffiliationsController@showDataTable');
        /*Route::post('users/get-volunteers-user', ['middleware' => ['check-slug'], 'uses' => 'UserController@getUserByType']);
        Route::get('users/tour-manager', 'UserController@getTourManager')->middleware('check-slug');*/
        /* End List route */

        /* Permission route */
        Route::post('check-permission', 'UserController@checkAndGetPermissions');
        /* End Permission route */

        Route::get('notifications/get-recent-notifications','NotificationsController@getRecentNotification');
        Route::post('notifications/mark-read-to-notification','NotificationsController@markReadToNotification');
        Route::post('notifications/get-notifications-list','NotificationsController@showDataTable');

        /**
        * Dashboard Route
        */
        Route::get('dashboard/calender-data', 'DashboardsController@calenderData');
        Route::post('dashboard/upcoming-tour', 'DashboardsController@showDataTableForDashboard');

        /* API Management */
        Route::post('apimanagements/get-apimanagements-list', 'ApiManagementsController@showDataTable');
        Route::post('apimanagements/check-slug', 'ApiManagementsController@checkSlug');

        Route::post('permission/get-permissions', 'PermissionController@getAllPermissions');

        /* Set route */
        Route::resource('permission', 'PermissionController');
        Route::resource('roles', 'RoleController');
        Route::resource('contactmanagements', 'ContactmanagementsController');
        Route::resource('refferencemanagements', 'RefferencemanagementsController');
        Route::resource('meetingmanagements', 'MeetingmanagementsController');
        
        Route::resource('defaulttasks', 'DefaulttasksController');
        Route::resource('settings', 'SettingsController');
        Route::resource('notifications', 'NotificationsController');
        Route::resource('dashboard', 'DashboardsController');
        Route::resource('apimanagements', 'ApiManagementsController');

        Route::resource('momento', 'MomentosController');
        Route::resource('emailtemplates', 'EmailtemplatesController');
        Route::resource('affiliations', 'AffiliationsController');
        Route::resource('locations', 'LocationsController');
        Route::resource('tours', 'ToursController');
        Route::resource('users', 'UserController');
        Route::resource('mealservicetypes', 'MealservicetypesController');
        Route::resource('mealservicelocations', 'MealservicelocationsController');
        Route::resource('mealcategories', 'MealcategoriesController');
        Route::resource('meals', 'MealsController');
        Route::resource('transports', 'TransportsController');
        Route::resource('visitors', 'VisitorsController');
        Route::resource('tourtypes', 'TourtypesController');
        Route::resource('organizations', 'OrganizationsController');
    });
});
/* End Route for API */


/*
 * Route for Website
 */
Route::post('refresh-token', 'Auth\LoginController@reset_token');
Route::get("check-for-login", "Auth\LoginController@check_login")->middleware('cors');

/* Get City State and country */
Route::get('get-countries', function() {
    return App\Country::all();
});

Route::get('get-states/{country_id}', function($country_id) {
    return App\State::where('country_id', $country_id)->get();
});

Route::get('get-cities/{state_id}', function($state_id) {
    return App\City::where('state_id', $state_id)->get();
});

Route::get('tours/tour-crone', 'ToursController@tourCron');
Route::get('tours/tour-notification-crone', 'ToursController@tourNotificationCron');
Route::get('tours/tour-notification-crone-week', 'ToursController@tourNotificationCronweek');
Route::get('tours/tour-notification-crone-hour', 'ToursController@tourNotificationBeforeHour');
Route::get('tours/past-tour-soft-delete', 'ToursController@pastTourSoftDelete');

Route::post('tours/tour-action', 'ToursController@touraction');
Route::post('tours/add-feedback', 'ToursController@addFeedback');
Route::get('tours/feedback/{id}', 'ToursController@feedback');
Route::get('users/get-volunteers-user/{id}', 'UserController@volunteers');
Route::get('tours/getTask/{id}', 'ToursController@getTask');
Route::post('tours/getTaskUpdate', 'ToursController@getTaskUpdate');

 /* Get All Data */
Route::get('meals/getalldata', 'MealsController@getAllData');
Route::get('momento/getalldata', 'MomentosController@getAllData');
Route::get('email/getalldata', 'EmailController@getAllData');
Route::get('transports/getalldata', 'TransportsController@getAllData');
Route::get('visitors/getalldata', 'VisitorsController@getAllData');
Route::get('organizations/getalldata', 'OrganizationsController@getAllData');
Route::get('tourtypes/getalldata', 'TourtypesController@getAllData');
Route::get('mealservicetypes/getalldata', 'MealservicetypesController@getAllData');
Route::get('mealservicelocations/getalldata', 'MealservicelocationsController@getAllData');
Route::get('mealcategories/getalldata', 'MealcategoriesController@getAllData');
Route::get('defaulttasks/getalldata', 'DefaulttasksController@getAllData');
Route::get('users/getalldata', 'UserController@getAllData');
Route::get('contactmanagements/getalldata', 'ContactmanagementsController@getAllData');
Route::get('refferencemanagements/getalldata', 'RefferencemanagementsController@getAllData');
Route::get('meetingmanagements/getalldata', 'MeetingmanagementsController@getAllData');
Route::get('notificationcron/getalldata', 'NotificationcronController@getAllData');

Route::post('tourtypes/get-all-tourtype', 'TourtypesController@getAllTourType');

Route::group(['middleware' => ['jwt.auth']], function () {
        /* List route */        
        Route::post('momento/get-momento-list', 'MomentosController@showDataTable');
        Route::post('affiliations/get-affiliations-list', 'AffiliationsController@showDataTable');
        Route::post('emailtemplates/get-emailtemplates-list', 'EmailtemplatesController@showDataTable');
        Route::post('meals/get-meals-list', 'MealsController@showDataTable');
        Route::post('transports/get-transports-list', 'TransportsController@showDataTable');
        Route::post('visitors/get-visitors-list', 'VisitorsController@showDataTable');
        Route::post('organizations/get-organizations-list', 'OrganizationsController@showDataTable');
        Route::post('tourtypes/get-tourtypes-list', 'TourtypesController@showDataTable');
        Route::post('locations/get-locations-list', 'LocationsController@showDataTable');
        Route::post('roles/get-roles-list', 'RoleController@showDataTable');
        Route::post('get-role-permission', 'RoleController@getRolePermissions');
        Route::post('roles/role-list', 'RoleController@getRoleList');
        Route::post('contactmanagements/get-contactmanagements-list', 'ContactmanagementsController@showDataTable');
        Route::post('refferencemanagements/get-refferencemanagements-list', 'RefferencemanagementsController@showDataTable');
        Route::post('meetingmanagements/get-meetingmanagements-list', 'MeetingmanagementsController@showDataTable');
        Route::post('defaulttasks/get-defaulttasks-list', 'DefaulttasksController@showDataTable');
        Route::post('defaulttasks/get-defaulttasks', 'DefaulttasksController@getTaskByType');
        Route::post('tours/get-tours-list', 'ToursController@showDataTable');
        
        Route::post('tours/resendlink', 'ToursController@resendlink');

        Route::post('tours/add-task', 'ToursController@addtask');
        Route::post('tours/update-task', 'ToursController@updatetask');
        Route::post('tours/delete-task', 'ToursController@deletetask');
        

        Route::post('tours/tour-document', 'ToursController@tour_document');
        Route::post('tours/delete-document', 'ToursController@delete_document');
        Route::post('tours/tour-notes', 'ToursController@tour_notes');
        Route::post('tours/delete-notes', 'ToursController@notes_delete');

        Route::get('tours/organization-name', 'ToursController@organization');
        Route::post('tours/action-task', 'ToursController@actionTask');
        Route::post('tours/delete-visitor', 'ToursController@destroyVisitor');        
        
        Route::get('users/available-user', 'UserController@showAvailableUser');
        Route::put('users/change-password/{id}', 'UserController@changePassword');
        Route::put('users/admin-change-password/{id}', 'UserController@adminChangePassword');
        Route::post('users/resend-welcome-email', 'UserController@sendWelcomeEmail');        
        Route::put('users/change-availability/{id}', 'UserController@changeAvailability');
        
        
        Route::post('contactmanagements/checkvitisitorphone', 'ContactmanagementsController@checkByPhone');
        Route::post('refferencemanagements/checkvitisitorphone', 'RefferencemanagementsController@checkByPhone');
        Route::post('meetingmanagements/checkvitisitorphone', 'MeetingmanagementsController@checkByPhone');
        Route::post('mealservicetypes/get-mealservicetypes-list', 'MealservicetypesController@showDataTable');
        Route::post('mealservicelocations/get-mealservicelocations-list', 'MealservicelocationsController@showDataTable');
        Route::post('mealcategories/get-mealcategories-list', 'MealcategoriesController@showDataTable');
        Route::post('tours/add-meeting', 'ToursController@addmeeting');
        Route::post('tours/delete-meeting', 'ToursController@deletemeeting');
        
        Route::post('users/get-users-list', 'UserController@showDataTable');
        Route::post('users/get-availabilities-list', 'UserController@getAvailabilityHistory');
//      Route::post('users/get-volunteers-user', 'UserController@getUserByType');
//        Route::post('users/get-volunteers-user/{id}', [
//            'uses'=> 'UserController@getUserByType',
//            'tourid' => '{{id}}'
//        ]);
        Route::get('users/tour-manager', 'UserController@getTourManager');
        /* End List route */

        /* Permission route */
        Route::post('check-permission', 'UserController@checkAndGetPermissions');
        /* End Permission route */

        Route::get('notifications/get-recent-notifications','NotificationsController@getRecentNotification');
        Route::post('notifications/mark-read-to-notification','NotificationsController@markReadToNotification');
        Route::post('notifications/get-notifications-list','NotificationsController@showDataTable');

        /**
         * Dashboard Route
         */
        Route::get('dashboard/calender-data', 'DashboardsController@calenderData');
        Route::post('dashboard/upcoming-tour', 'DashboardsController@showDataTableForDashboard');

        /* API Management */
        Route::post('apimanagements/get-apimanagements-list', 'ApiManagementsController@showDataTable');
        Route::post('apimanagements/check-slug', 'ApiManagementsController@checkSlug');

        Route::post('permission/get-permissions', 'PermissionController@getAllPermissions');

        

       

        /* Set route */
        Route::resource('permission', 'PermissionController');
        Route::resource('roles', 'RoleController');
        Route::resource('contactmanagements', 'ContactmanagementsController');
        Route::resource('refferencemanagements', 'RefferencemanagementsController');
        Route::resource('meetingmanagements', 'MeetingmanagementsController');
        Route::resource('defaulttasks', 'DefaulttasksController');
        Route::resource('settings', 'SettingsController');
        Route::resource('notifications', 'NotificationsController');
        Route::resource('dashboard', 'DashboardsController');
        Route::resource('apimanagements', 'ApiManagementsController');
});

Route::resource('momento', 'MomentosController');
Route::resource('locations', 'LocationsController');
Route::resource('tours', 'ToursController');
Route::resource('users', 'UserController');
Route::resource('mealservicetypes', 'MealservicetypesController');
Route::resource('mealservicelocations', 'MealservicelocationsController');
Route::resource('mealcategories', 'MealcategoriesController');
Route::resource('meals', 'MealsController');
Route::resource('transports', 'TransportsController');
Route::resource('visitors', 'VisitorsController');
Route::resource('tourtypes', 'TourtypesController');
Route::resource('organizations', 'OrganizationsController');

Route::resource('emailtemplates', 'EmailtemplatesController');
Route::resource('affiliations', 'AffiliationsController');
Route::resource('notificationcron', 'NotificationcronController');

//added by rohit
Route::group(['middleware' => ['check-slug2'], 'prefix' => '/other/{slug}'], function () {

Route::resource('organizations', 'ApiOrganizationsController');

Route::resource('add-tour', 'ApiToursController@store');

Route::resource('add-user', 'ApiUserController@store');

    Route::get('get-countries', function() {

        return App\Country::all();

    });

});
