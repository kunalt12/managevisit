<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Tour;
use App\User;
use App\Role;
use App\Tourtask;
use App\Tournote;
use App\Tourvisitor;
use App\Documentlink;
use App\Contactmanagement;
use App\Tourmealservice;
use App\Tourhistory;
use App\Tourfeedbacks;
use App\Tourmomentos;

use App\Setting;

use App\ApiManagements;

use Yajra\Datatables\Datatables;
use JWTAuth;
use JWTAuthException;
use Carbon\Carbon;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Config;

use App\Notifications\Tourconfirmation;
use App\Notifications\TourRemainder;
use App\Notifications\TourFeedback;
use App\Notifications\Tourstatus;

class ApiToursController extends Controller
{

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //$userAuth = JWTAuth::parseToken()->authenticate();
        // dd($request->mealsType);
	//set tour manager
//$tour_manager = ApiManagements::where('slug', $pieces['4'])->first()->tour_manager;
	$request->manager=160;
	//
	//Visitor Contact
	$request->contact_manager=$request->contact_manager ;//"darshanp@gmail.com";
	//return response()->json(['code' => 422, 'error'=>'Tour Test']);

        try {            
//            if(!$request->contact_manager) {
//                return response()->json(['error' => Lang::get('tours.contactmenagernotselect')], 422); 
//            }

            if($request->children == "") {
                $request->children = null;
            }
            $URL = $request->server->get("REQUEST_URI");
            $pieces = explode("/", $URL);
            $checkSlug = ApiManagements::where('slug', $pieces['4'])->first();
//            echo '<pre>';print_r($checkSlug->tour_manager);die;
            $add = new Tour();
//            $add->location_id = $request->location_id;

            $add->tourtype_id = $request->tourtype_id; //14 general
            $add->transport_id = $request->transport_id;
            $add->name = $request->name;
                // Tourmealservice::where('tour_id', $tourId)->delete();
            $add->children = $request->children;
            $add->senior = $request->senior;
            $add->adults = $request->adults;
            $add->start_date = Carbon::createFromFormat('Y-m-d H:i:s', $request->start_date);//YYYY-MM-DD HH:mm:ss 
            $add->organization = $request->organization;
            $add->meals =  0;
            $add->special_request = $request->special_request;
//            $add->status = $request->status; //status  should be pending default is 0
//$tour_manager = ApiManagements::where('slug', $pieces['4'])->first()->tour_manager;
            $add->manager = $checkSlug->tour_manager;//$tour_manager;
            $add->save();

            $tourId = $add->id;

   $find = Contactmanagement::where('email',$request->contact_manager)->first();
            if (empty($find)) {
           $addVisitor = new Contactmanagement();
                $addVisitor->name = $request->first_name ." ".$request->last_name;
                $addVisitor->first_name = $request->first_name;
                $addVisitor->middle_name = isset($request->middle_name) ? $request->middle_name : '';
                $addVisitor->last_name = $request->last_name;
                $addVisitor->email = $request->contact_manager;
//                $addVisitor->gender = isset($data['gender']) ? $data['gender'] : '';
                $addVisitor->mobile = $request->mobile;
//                $addVisitor->organization_id = isset($data['organization_id']) ? $data['organization_id'] : null;
//                $addVisitor->organization = isset($data['organization']) ? $data['organization'] : $name;
                $addVisitor->phone_number = isset($request->phone_number) ? $request->phone_number : '';

//          $addVisitor->visitor_type = isset($data['visitor_type']) ? $data['visitor_type'] : null;
$addVisitor->visitor_type = 2;//general
                $addVisitor->address = isset($request->address) ? $request->address : '';
                $addVisitor->address1 = isset($request->address1) ? $request->address1 : '';
                $addVisitor->country_id = isset($request->country_id) ? $request->country_id : null; //231 us
                $addVisitor->state = isset($request->state) ? $request->state : '';
                $addVisitor->city = isset($request->city) ? $request->city : '';
                $addVisitor->zip_code = isset($request->zip_code) ? $request->zip_code : '';
                $addVisitor->status = 1;
                $addVisitor->save();
$vis_id = $addVisitor->id;
}
else
{
$vis_id = $find['id'];
}                
//visitor tour association table
                $addVisitor = new Tourvisitor();
                $addVisitor->tour_id = $tourId;
                $addVisitor->visitor_id = $vis_id;
                $addVisitor->is_tour_admin = 1;
                $addVisitor->save();
            
/*
            if($request->manager) {
                $dataValue = [
                    'user_id' => $userAuth->id,
                    'tour_id' => $tourId
                ];

                $replaceArray = [
                    'SenderName' => $userAuth->name,
                    'TourName' => $request->name,
                ];
                
                $notificationMessage = trans('notification_template.assign_manager_in_tour', $replaceArray);
                $notificationData = [
                    'message' => $notificationMessage,
                    'notification_type' => 'tour',
                    'user_id' => $userAuth->id,
                    'receiver_id' => [$request->manager],
                    'data' => json_encode($dataValue),
                ];
                sendNotification($notificationData);
            }
            if($request->sendMail){
                $date = date('Ymd', strtotime($request->start_date));
                $actionURL = $tourId.'_'.$date.'_'.$tourAdmin;
                $userAuth->email = $request->contact_manager;
                $userAuth->url = $actionURL;
                $userAuth->start_date = $request->start_date;
                $userAuth->mailSubject = $request->mailSubject;
                $userAuth->mailContent = $request->mailContent;
                $userAuth->notify(new Tourconfirmation());
            }
*/              
          
                //send email notification to the assigned manager
                $userAuth =new User();  
                $touradmin = User::where("id", $checkSlug->tour_manager)->first();
                $userAuth->email = $touradmin->email;
                $userAuth->start_date = $request->start_date;
                $userAuth->mailSubject = '';
                $userAuth->mailContent = '';
                $userAuth->notify(new Tourconfirmation());
                //send email to all tour manager
                $adminlist = Role::where('name', 'admin')->first()->users()->get();
                
                foreach ($adminlist as $ta) {
                        $userAuth->email = $ta->email;
                        $userAuth->tourName = $request->name;
                        $userAuth->tourStatus = 'Pending';

                        $userAuth->mailSubject = 'Tour Pending';
                        $userAuth->mailContent = '<p>Dear ' . $ta->name . ',</p><p>Tour ' . $request->name . ' on ' . str_replace(' ', ' at ', $request->start_date) . ' is pending.</p><p>' . $touradmin->name . ' will be handling the tour of ' . $request->first_name . ' '.$request->last_name.'. Their information is:</p> <p>Name: ' . $request->first_name . ' '.$request->last_name . ',</p> <p>Phone: ' . $addVisitor->mobile . ',</p> <p>Email: ' . $request->contact_manager . '.</p>';

                        $userAuth->notify(new TourStatus());
                }
            return response()->json(['code' => Config::get('constants.SUCCESS'), 'success' => Lang::get('tours.add')], 200);
        } catch (\Exception $ex) {
            if ($ex instanceof QueryException) {
                return response()->json(['code' => Config::get('constants.DUPLICATE'), 'error' => Lang::get('tours.duplicateentry')], 422);
            } else {
                return response()->json(['code' => Config::get('constants.ERROR'), 'error' => Lang::get('tours.someproblems'). "  " . $ex->getMessage()], 422);
            }
        }
    }

    public function touraction(Request $request)
    {
        if($request->header('Authorization')) {
            $userAuth = JWTAuth::parseToken()->authenticate();
        }
        else {
            $userAuth = [];
        }

        if(isset($request->tour_id)) {
            $ids = explode("_", $request->tour_id);
            $id = $ids[0];
        }
        else {
            $id = $request->id;
        }
        
        $actionData = Tour::find($id);
        $senderArray = [1, $actionData->manager];
        $mealSer = Tourmealservice::where('tour_id', $id)->get();

        for ($i=0; $i < sizeof($mealSer); $i++) { 
            array_push($senderArray, $mealSer[$i]['catering_manager']);
        }

        $senderArray = array_unique($senderArray);
        if($userAuth) {
            $senderArray = array_diff( $senderArray, [$userAuth->id] );
        }

        if (empty($actionData)) {
            return response()->json(['error' => Lang::get('tours.notfind')], 422);
        }

        try {
            $mytime = Carbon::now();
            if($request->action == 1) {
                $actionData->status = $request->action;
                $actionData->acknowledge_comment = $request->comment;
                $actionData->acknowledge_date = Carbon::createFromFormat('Y-m-d H:s:i', $mytime->toDateTimeString());    
            }
            else {
                $actionData->status = $request->action;
            }            
            $actionData->save();
            
            /* Add in history table */
            $userName = ($request->name) ? $request->name : $userAuth->name;
            if($request->action == 0) {
                $msg = Lang::get('tours.tourStatusPending');
                $action = 'pending';
                $message = 'Tour status has been changed as a '.$action.' by '.$userName;
            }
            else if($request->action == 1) {
                $msg = Lang::get('tours.tourStatusAcknowledged');
                $action = 'acknowledged';
                $message = $userName.' has been '.$action.' a tour';
            }
            else if($request->action == 2) {
                $msg = Lang::get('tours.tourStatusAccepted');
                $action = 'accepted';
                $message = $userName.' has been '.$action.' a tour';
            }
            else if($request->action == 3) {
                $msg = Lang::get('tours.tourStatusRejected');
                $action = 'rejected';
                $message = $userName.' has been '.$action.' a tour';
            }
            else if($request->action == 4) {
                $msg = Lang::get('tours.tourStatusCompleted');
                $action = 'completed';
                $message = $userName.' has been '.$action.' a tour';
            }
            
            $addHistory = new Tourhistory();
            $addHistory->tour_id = $id;
            $addHistory->activity = $message;
            $addHistory->comment = $request->comment;
            $addHistory->save();

            /* Send notification to user */
            $dataValue = [
                'user_id' => $userAuth->id,
                'tour_id' => $actionData->id
            ];

            $replaceArray = [
                'SenderName' => $userName,
                'Status' => $action,
                'TourName' => $actionData->name
            ];
            
            $notificationMessage = trans('notification_template.change_tour_status', $replaceArray);
            $notificationData = [
                'message' => $notificationMessage,
                'notification_type' => 'tour',
                'user_id' => $userAuth->id,
                'receiver_id' => $senderArray,
                'data' => json_encode($dataValue),
            ];
            sendNotification($notificationData);
            /* End send notification to user */

            if($request->action == 4 && $request->sendMail) {
                $dataFormats = ['Ymd', 'mdY', 'dmY', 'dYm', 'mYd'];
                
                $contactPerson = Tourvisitor::where(['tour_id' => $id, 'is_tour_admin' => 1])->with('contactmanager')->first();
                $userAuth->email = $contactPerson->contactmanager->email;
                
                $dateArray = array_rand($dataFormats);
                $randArray = $dataFormats[$dateArray];
                $date1 = date($randArray, strtotime($mytime));
                $actionURL = $id.$date1;
                $userAuth->url = $actionURL;
                
                $userAuth->mailSubject = $request->mailSubject;
                $userAuth->mailContent = $request->mailContent;
                
                $userAuth->notify(new TourFeedback());
            }
            
            if(($request->action == 1 || $request->action == 2 || $request->action == 3) && $request->sendMail) {
                if($request->mailContent != ''){
                    $contactPerson = Tourvisitor::where(['tour_id' => $id, 'is_tour_admin' => 1])->with('contactmanager')->first();
                    $userAuth->email = $contactPerson->contactmanager->email;
                    $userAuth->tourName = $actionData->name;
                    if($request->action == 3){
                        $userAuth->tourStatus = 'Rejected';
                    } else if($request->action == 2) {
                        $userAuth->tourStatus = 'Approved';
                    } else {
                        $userAuth->tourStatus = 'Acknowledged';
                    }
                    
                    $userAuth->mailSubject = $request->mailSubject;
                    $userAuth->mailContent = $request->mailContent;

                    $userAuth->notify(new TourStatus());
                }
            }

            return response()->json(['code' => Config::get('constants.SUCCESS'), 'success' => $msg], 200);
        } catch (\Exception $ex) {
            if ($ex instanceof QueryException) {
                return response()->json(['code' => Config::get('constants.DUPLICATE'), 'error' => Lang::get('tours.duplicateentry')], 422);
            } else {
                return response()->json(['code' => Config::get('constants.ERROR'), 'error' => Lang::get('tours.someproblems')], 422);
            }
        }
    }

    /**
     * Get all organization when already used for add tour auto succession .
     *
     * @return \Illuminate\Http\Response
     */
    public function organization()
    {
        $organizationData = Tour::groupBy('tours.organization')->get(['organization']);
        return response()->json(['data' => $organizationData], 200);
    }

    public function actionTask(Request $request)
    {
        $userAuth = JWTAuth::parseToken()->authenticate();
        $updateTask = Tourtask::find($request->id);

        try {
            $updateTask->acknowledge = $request->status;
            $updateTask->save();

            $tourData = Tour::where("id", $updateTask->tour_id)->first();
            $dataValue = [
                'user_id' => $userAuth->id,
                'tour_id' => $tourData->id,
                'tourtask_id' => $updateTask->id
            ];

            $replaceArray = [
                'SenderName' => $userAuth->name,
                'TourName' => $tourData->name,
            ];

            if($request->status == 1) {
                $notificationMessage = trans('notification_template.accept_task_request', $replaceArray);
                $message = 'tours.accept_task';
                $action = 'accepted';
            }
            else {
                $notificationMessage = trans('notification_template.reject_task_request', $replaceArray);
                $message = 'tours.reject_task';
                $action = 'rejected';
            }
                        
            $notificationData = [
                'message' => $notificationMessage,
                'notification_type' => 'tour',
                'user_id' => $userAuth->id,
                'receiver_id' => [$tourData->created_by,$tourData->manager],
                'data' => json_encode($dataValue),
            ];
            sendNotification($notificationData);

            /* Add in history table */
            $message = $request->task_name.' has been '.$action.' by '.$userAuth->name;
            $addHistory = new Tourhistory();
            $addHistory->tour_id = $tourData->id;
            $addHistory->activity = $message;
            $addHistory->save();
            
            return response()->json(['code' => Config::get('constants.SUCCESS'), 'success' => Lang::get($message)], 200);
        } catch (\Exception $ex) {
            if ($ex instanceof QueryException) {
                return response()->json(['code' => Config::get('constants.DUPLICATE'), 'error' => Lang::get('tours.duplicateentry')], 422);
            } else {
                return response()->json(['code' => Config::get('constants.ERROR'), 'error' => Lang::get('tours.someproblems')], 422);
            }
        }
    }

}
