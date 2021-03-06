<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Tour;
use App\User;
use App\Role;
use App\Tourtask;
use App\Tournote;
use App\Tourvisitor;
use App\Tourrefference;
use App\Tourmeeting;
use App\Documentlink;
use App\Contactmanagement;
use App\Refferencemanagement;
use App\Meetingmanagement;
use App\Tourmealservice;
use App\Mealservicelocation;
use App\Mealservicetype;
use App\Meal;
use App\Tourhistory;
use App\Tourfeedbacks;
use App\Tourmomentos;
use App\Setting;
use Yajra\Datatables\Datatables;
use JWTAuth;
use JWTAuthException;
use Carbon\Carbon;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Config;
use App\Notifications\Tourconfirmation;
use App\Notifications\Taskconfirmation;
use App\Notifications\TourRemainder;
use App\Notifications\TourFeedback;
use App\Notifications\Tourstatus;
use App\Notifications\TourAcknowledge;
use DB;
use Mail;

class ToursController extends Controller {

    /**
     * Display the datatables
     * @param Request $request
     * @return JSON 
     */
    public function showDataTable(Request $request) {
        $userAuth = JWTAuth::parseToken()->authenticate();
        
        
            
        /** Create date for filter */
        $currentDay = Carbon::today()->toDateString();
        $year = date('Y', strtotime($currentDay));
        $month = date('m', strtotime($currentDay));
        $nextDay = date("Y-m-d", strtotime("+1 days"));
        $weekEnd = date("Y-m-d", strtotime("+1 week")); // scold

        if ($request->filerData == 0) {
            if ($userAuth->roles[0]->id == Config::get('constants.ADMIN_ID')) {
                $listData = Tour::where('company_id',auth()->user()->company_id)->with('tourTransport', 'tourTapes', 'tourLocation', 'tourManager', 'tourVisitors', 'tourMomentos', 'tourMomentos')->get();
            } else {
                $findUserByTour = array();
                $findTourByTask = Tourtask::whereIn('acknowledge', [0, 1])->where('user_id', $userAuth->id)->get(['tour_id']);
                for ($k = 0; $k < count($findTourByTask); $k++) {
                    array_push($findUserByTour, $findTourByTask[$k]['tour_id']);
                }

                $findTourByService = Tourmealservice::where(['catering_manager' => $userAuth->id])->get(['tour_id']);
                for ($k = 0; $k < count($findTourByService); $k++) {
                    array_push($findUserByTour, $findTourByService[$k]['tour_id']);
                }

                $findTourByManager = Tour::where('manager', $userAuth->id)->get(['id']);
                for ($k = 0; $k < count($findTourByManager); $k++) {
                    array_push($findUserByTour, $findTourByManager[$k]['id']);
                }

                $findTourByCreatedUser = Tour::where('created_by', $userAuth->id)->get(['id']);
                for ($k = 0; $k < count($findTourByCreatedUser); $k++) {
                    array_push($findUserByTour, $findTourByCreatedUser[$k]['id']);
                }

                $listData = Tour::whereIn('id', $findUserByTour)->with('tourTransport', 'tourTapes', 'tourLocation', 'tourManager', 'tourVisitors', 'tourMomentos')->get();
            }
        } else if ($request->filerData == 1) {
            if ($userAuth->roles[0]->id == Config::get('constants.ADMIN_ID')) {
                $listData = Tour::whereDate('start_date', $currentDay)->where(['status' => 2])->with('tourTransport', 'tourTapes', 'tourLocation', 'tourManager', 'tourVisitors', 'tourMomentos')->get();
            } else {
                $findUserByTour = array();
                $findTourByTask = Tourtask::whereIn('acknowledge', [0, 1])->where('user_id', $userAuth->id)->get(['tour_id']);
                for ($k = 0; $k < count($findTourByTask); $k++) {
                    array_push($findUserByTour, $findTourByTask[$k]['tour_id']);
                }

                $findTourByService = Tourmealservice::where(['catering_manager' => $userAuth->id])->get(['tour_id']);
                for ($k = 0; $k < count($findTourByService); $k++) {
                    array_push($findUserByTour, $findTourByService[$k]['tour_id']);
                }

                $findTourByManager = Tour::where('manager', $userAuth->id)->get(['id']);
                for ($k = 0; $k < count($findTourByManager); $k++) {
                    array_push($findUserByTour, $findTourByManager[$k]['id']);
                }

                $findTourByCreatedUser = Tour::where('created_by', $userAuth->id)->get(['id']);
                for ($k = 0; $k < count($findTourByCreatedUser); $k++) {
                    array_push($findUserByTour, $findTourByCreatedUser[$k]['id']);
                }

                $listData = Tour::whereDate('start_date', $currentDay)->whereIn(['status' => 2, 'id' => $findUserByTour])->with('tourTransport', 'tourTapes', 'tourLocation', 'tourManager', 'tourVisitors', 'tourMomentos')->get();
            }
        } else if ($request->filerData == 2) {
            if ($userAuth->roles[0]->id == Config::get('constants.ADMIN_ID')) {
                $listData = Tour::whereDate('start_date', '>=', $nextDay)->whereDate('start_date', '<=', $weekEnd)->where('status', 2)->with('tourTransport', 'tourTapes', 'tourLocation', 'tourManager', 'tourVisitors', 'tourMomentos')->get();
            } else {
                $findUserByTour = array();
                $findTourByTask = Tourtask::whereIn('acknowledge', [0, 1])->where('user_id', $userAuth->id)->get(['tour_id']);
                for ($k = 0; $k < count($findTourByTask); $k++) {
                    array_push($findUserByTour, $findTourByTask[$k]['tour_id']);
                }

                $findTourByService = Tourmealservice::where(['catering_manager' => $userAuth->id])->get(['tour_id']);
                for ($k = 0; $k < count($findTourByService); $k++) {
                    array_push($findUserByTour, $findTourByService[$k]['tour_id']);
                }

                $findTourByManager = Tour::where('manager', $userAuth->id)->get(['id']);
                for ($k = 0; $k < count($findTourByManager); $k++) {
                    array_push($findUserByTour, $findTourByManager[$k]['id']);
                }

                $findTourByCreatedUser = Tour::where('created_by', $userAuth->id)->get(['id']);
                for ($k = 0; $k < count($findTourByCreatedUser); $k++) {
                    array_push($findUserByTour, $findTourByCreatedUser[$k]['id']);
                }

                $listData = Tour::where('start_date', '>=', $nextDay)->where('start_date', '<=', $weekEnd)->where('status', 2)->whereIn('id', $findUserByTour)->with('tourTransport', 'tourTapes', 'tourLocation', 'tourManager', 'tourVisitors', 'tourMomentos')->get();
            }
        } else if ($request->filerData == 3) {
            if ($userAuth->roles[0]->id == Config::get('constants.ADMIN_ID')) {
                $listData = Tour::whereYear('start_date', $year)->whereMonth('start_date', $month)->where(['status' => 2])->with('tourTransport', 'tourTapes', 'tourLocation', 'tourManager', 'tourVisitors', 'tourMomentos')->get();
            } else {
                $findUserByTour = array();
                $findTourByTask = Tourtask::whereIn('acknowledge', [0, 1])->where('user_id', $userAuth->id)->get(['tour_id']);
                for ($k = 0; $k < count($findTourByTask); $k++) {
                    array_push($findUserByTour, $findTourByTask[$k]['tour_id']);
                }

                $findTourByService = Tourmealservice::where(['catering_manager' => $userAuth->id])->get(['tour_id']);
                for ($k = 0; $k < count($findTourByService); $k++) {
                    array_push($findUserByTour, $findTourByService[$k]['tour_id']);
                }

                $findTourByManager = Tour::where('manager', $userAuth->id)->get(['id']);
                for ($k = 0; $k < count($findTourByManager); $k++) {
                    array_push($findUserByTour, $findTourByManager[$k]['id']);
                }

                $findTourByCreatedUser = Tour::where('created_by', $userAuth->id)->get(['id']);
                for ($k = 0; $k < count($findTourByCreatedUser); $k++) {
                    array_push($findUserByTour, $findTourByCreatedUser[$k]['id']);
                }

                $listData = Tour::whereYear('start_date', $year)->whereMonth('start_date', $month)->where('status', 2)->whereIn('id', $findUserByTour)->with('tourTransport', 'tourTapes', 'tourLocation', 'tourManager', 'tourVisitors', 'tourMomentos')->get();
            }
        } else if ($request->filerData == 4) {
            if ($userAuth->roles[0]->id == Config::get('constants.ADMIN_ID')) {
                $listData = Tour::where('status', 2)->with('tourTransport', 'tourTapes', 'tourLocation', 'tourManager', 'tourVisitors', 'tourMomentos')->get();
            } else {
                $findUserByTour = array();
                $findTourByTask = Tourtask::whereIn('acknowledge', [0, 1])->where('user_id', $userAuth->id)->get(['tour_id']);
                for ($k = 0; $k < count($findTourByTask); $k++) {
                    array_push($findUserByTour, $findTourByTask[$k]['tour_id']);
                }

                $findTourByService = Tourmealservice::where(['catering_manager' => $userAuth->id])->get(['tour_id']);
                for ($k = 0; $k < count($findTourByService); $k++) {
                    array_push($findUserByTour, $findTourByService[$k]['tour_id']);
                }

                $findTourByManager = Tour::where('manager', $userAuth->id)->get(['id']);
                for ($k = 0; $k < count($findTourByManager); $k++) {
                    array_push($findUserByTour, $findTourByManager[$k]['id']);
                }

                $findTourByCreatedUser = Tour::where('created_by', $userAuth->id)->get(['id']);
                for ($k = 0; $k < count($findTourByCreatedUser); $k++) {
                    array_push($findUserByTour, $findTourByCreatedUser[$k]['id']);
                }

                $listData = Tour::where('status', 2)->whereIn('id', $findUserByTour)->with('tourTransport', 'tourTapes', 'tourLocation', 'tourManager', 'tourVisitors', 'tourMomentos')->get();
            }
        } else if ($request->filerData == 5) {
            if ($userAuth->roles[0]->id == Config::get('constants.ADMIN_ID')) {
                $listData = Tour::whereIn('status', [0, 1])->with('tourTransport', 'tourTapes', 'tourLocation', 'tourManager', 'tourVisitors', 'tourMomentos')->get();
            } else {
                $findUserByTour = array();
                $findTourByTask = Tourtask::whereIn('acknowledge', [0, 1])->where('user_id', $userAuth->id)->get(['tour_id']);
                for ($k = 0; $k < count($findTourByTask); $k++) {
                    array_push($findUserByTour, $findTourByTask[$k]['tour_id']);
                }

                $findTourByService = Tourmealservice::where(['catering_manager' => $userAuth->id])->get(['tour_id']);
                for ($k = 0; $k < count($findTourByService); $k++) {
                    array_push($findUserByTour, $findTourByService[$k]['tour_id']);
                }

                $findTourByManager = Tour::where('manager', $userAuth->id)->get(['id']);
                for ($k = 0; $k < count($findTourByManager); $k++) {
                    array_push($findUserByTour, $findTourByManager[$k]['id']);
                }

                $findTourByCreatedUser = Tour::where('created_by', $userAuth->id)->get(['id']);
                for ($k = 0; $k < count($findTourByCreatedUser); $k++) {
                    array_push($findUserByTour, $findTourByCreatedUser[$k]['id']);
                }

                $listData = Tour::whereIn('status', [0, 1])->whereIn('id', $findUserByTour)->with('tourTransport', 'tourTapes', 'tourLocation', 'tourManager', 'tourVisitors', 'tourMomentos')->get();
            }
        } else if ($request->filerData == 6) {
            if ($userAuth->roles[0]->id == Config::get('constants.ADMIN_ID')) {
                $listData = Tour::where('status', 4)->with('tourTransport', 'tourTapes', 'tourLocation', 'tourManager', 'tourVisitors', 'tourMomentos')->get();
            } else {
                $findUserByTour = array();
                $findTourByTask = Tourtask::whereIn('acknowledge', [0, 1])->where('user_id', $userAuth->id)->get(['tour_id']);
                for ($k = 0; $k < count($findTourByTask); $k++) {
                    array_push($findUserByTour, $findTourByTask[$k]['tour_id']);
                }

                $findTourByService = Tourmealservice::where(['catering_manager' => $userAuth->id])->get(['tour_id']);
                for ($k = 0; $k < count($findTourByService); $k++) {
                    array_push($findUserByTour, $findTourByService[$k]['tour_id']);
                }

                $findTourByManager = Tour::where('manager', $userAuth->id)->get(['id']);
                for ($k = 0; $k < count($findTourByManager); $k++) {
                    array_push($findUserByTour, $findTourByManager[$k]['id']);
                }

                $findTourByCreatedUser = Tour::where('created_by', $userAuth->id)->get(['id']);
                for ($k = 0; $k < count($findTourByCreatedUser); $k++) {
                    array_push($findUserByTour, $findTourByCreatedUser[$k]['id']);
                }

                $listData = Tour::where('status', 2)->whereIn('id', $findUserByTour)->with('tourTransport', 'tourTapes', 'tourLocation', 'tourManager', 'tourVisitors', 'tourMomentos')->get();
            }
        } else if ($request->filerData == 7) {
            if ($userAuth->roles[0]->id == Config::get('constants.ADMIN_ID')) {
                $listData = Tour::where('status', 3)->with('tourTransport', 'tourTapes', 'tourLocation', 'tourManager', 'tourVisitors', 'tourMomentos')->get();
            } else {
                $findUserByTour = array();
                $findTourByTask = Tourtask::whereIn('acknowledge', [0, 1])->where('user_id', $userAuth->id)->get(['tour_id']);
                for ($k = 0; $k < count($findTourByTask); $k++) {
                    array_push($findUserByTour, $findTourByTask[$k]['tour_id']);
                }

                $findTourByService = Tourmealservice::where(['catering_manager' => $userAuth->id])->get(['tour_id']);
                for ($k = 0; $k < count($findTourByService); $k++) {
                    array_push($findUserByTour, $findTourByService[$k]['tour_id']);
                }

                $findTourByManager = Tour::where('manager', $userAuth->id)->get(['id']);
                for ($k = 0; $k < count($findTourByManager); $k++) {
                    array_push($findUserByTour, $findTourByManager[$k]['id']);
                }

                $findTourByCreatedUser = Tour::where('created_by', $userAuth->id)->get(['id']);
                for ($k = 0; $k < count($findTourByCreatedUser); $k++) {
                    array_push($findUserByTour, $findTourByCreatedUser[$k]['id']);
                }

                $listData = Tour::where('status', 2)->whereIn('id', $findUserByTour)->with('tourTransport', 'tourTapes', 'tourLocation', 'tourManager', 'tourVisitors', 'tourMomentos')->get();
            }
        } else {
            if ($userAuth->roles[0]->id == Config::get('constants.ADMIN_ID')) {
                $listData = Tour::with('tourTransport', 'tourTapes', 'tourLocation', 'tourManager', 'tourVisitors', 'tourMomentos', 'tourMomentos')->get();
            } else {
                $findUserByTour = array();
                $findTourByTask = Tourtask::whereIn('acknowledge', [0, 1])->where('user_id', $userAuth->id)->get(['tour_id']);
                for ($k = 0; $k < count($findTourByTask); $k++) {
                    array_push($findUserByTour, $findTourByTask[$k]['tour_id']);
                }

                $findTourByService = Tourmealservice::where(['catering_manager' => $userAuth->id])->get(['tour_id']);
                for ($k = 0; $k < count($findTourByService); $k++) {
                    array_push($findUserByTour, $findTourByService[$k]['tour_id']);
                }

                $findTourByManager = Tour::where('manager', $userAuth->id)->get(['id']);
                for ($k = 0; $k < count($findTourByManager); $k++) {
                    array_push($findUserByTour, $findTourByManager[$k]['id']);
                }

                $findTourByCreatedUser = Tour::where('created_by', $userAuth->id)->get(['id']);
                for ($k = 0; $k < count($findTourByCreatedUser); $k++) {
                    array_push($findUserByTour, $findTourByCreatedUser[$k]['id']);
                }

                $listData = Tour::whereIn('id', $findUserByTour)->with('tourTransport', 'tourTapes', 'tourLocation', 'tourManager', 'tourVisitors', 'tourMomentos')->get();
            }
        }
        for ($i = 0; $i < sizeof($listData); $i++) {
            $categoryData = array();
            
            $data = $listData[$i]['tourVisitors'];
            $tourcreatordata = User::where("id", $listData[$i]['created_by'])->first();
            $tourcreator = isset($tourcreatordata->name)?$tourcreatordata->name:'Null';
            for ($k = 0; $k < count($data); $k++) {
                $getVisitor = Contactmanagement::where("id", $data[$k]['visitor_id'])->with('visitor')->withTrashed()->first();
                if ($getVisitor['visitor']) {
                    $name = $getVisitor['visitor']['name'];
                    array_push($categoryData, $name);
                }
            }
            $categoryData = array_unique($categoryData);
            $listData[$i]['category'] = implode(', ', $categoryData);

            if ($listData[$i]['tourTapes'] == null) {
                $listData[$i]['tapes'] = array('name' => '-');
            } else {
                $listData[$i]['tapes'] = $listData[$i]['tourTapes'];
            }
            $listData[$i]['creator'] = $tourcreator;
        }

        return Datatables::of($listData)->make(true);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index() {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create() {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request) {
        $userAuth = JWTAuth::parseToken()->authenticate();
        // dd($request->mealsType);
        try {
            if (!$request->contact_manager) {
                return response()->json(['error' => Lang::get('tours.contactmenagernotselect')], 422);
            }

            if ($request->children == "") {
                $request->children = null;
            }
            if ($request->language == "") {
                $request->language = null;
            }

            $add = new Tour();
            $add->location_id = $request->location_id;
            $add->tourtype_id = $request->tourtype_id;
            if (isset($request->transport_id)) {
                $add->transport_id = $request->transport_id;
            } else {
                $add->transport_id = null;
            } 
            $add->name = $request->name;
            // Tourmealservice::where('tour_id', $tourId)->delete();
            $add->children = $request->children;
            $add->language = $request->language;
            $add->momento_type = $request->momento_type;
            $add->momento_quantity = $request->momento_quantity;
            $add->senior = $request->senior;
            $add->adults = $request->adults;
//            $add->start_date = Carbon::createFromFormat('Y-m-d H:i:s', $request->start_date);
            $add->start_date = date('Y-m-d H:i:s',  strtotime($request->start_date));
            $add->organization = $request->organization;
            $add->meals = (sizeof($request->mealsType) > 0) ? 1 : 0;
            $add->special_request = $request->special_request;
            $add->status = $request->status;
            $add->manager = $request->manager;
            $add->company_id = auth()->user()->company_id;;
            
            $add->save();

            $tourId = $add->id;
            
            for ($i = 0; $i < sizeof($request->mealsType); $i++) {
                $addMealService = new Tourmealservice();
                $addMealService->tour_id = $tourId;
                $addMealService->catering_manager = $request->mealsType[$i]['catering_manager'];
                $addMealService->meal_id = $request->mealsType[$i]['meal_id'];
                $addMealService->meal_service_type_id = $request->mealsType[$i]['meal_service_type_id'];
                $addMealService->meal_service_location_id = $request->mealsType[$i]['meal_service_location_id'];
                $addMealService->people = $request->mealsType[$i]['people'];
                $addMealService->specific_item = isset($request->mealsType[$i]['specific_item']) ? $request->mealsType[$i]['specific_item'] : '';
                $addMealService->save();

                $dataValue = [
                    'user_id' => $userAuth->id,
                    'tour_id' => $tourId
                ];

                $replaceArray = [
                    'SenderName' => $userAuth->name,
                    'TourName' => $request->name,
                    'Meal' => $request->mealsType[$i]['meal_txt']
                ];

                $notificationMessage = trans('notification_template.assign_catering_manager_in_tour', $replaceArray);
                $notificationData = [
                    'message' => $notificationMessage,
                    'notification_type' => 'tour',
                    'user_id' => $userAuth->id,
                    'receiver_id' => [$request->mealsType[$i]['catering_manager']],
                    'data' => json_encode($dataValue),
                ];
                sendNotification($notificationData);
            }

            for ($i = 0; $i < sizeof($request->documents); $i++) {
                $addLink = new Documentlink();
                $addLink->tour_id = $tourId;
                $addLink->title = $request->documents[$i]['title'];
                $addLink->link = $request->documents[$i]['link'];
                $addLink->save();
            }

            for ($i = 0; $i < sizeof($request->notes); $i++) {
                $addNote = new Tournote();
                $addNote->tour_id = $tourId;
                $addNote->note = $request->notes[$i]['note'];
                $addNote->save();
            }

            for ($i = 0; $i < sizeof($request->tasks); $i++) {
                $addTask = new Tourtask();
                $addTask->tour_id = $tourId;
                $addTask->tourtype_id = $request->tourtype_id;
                $addTask->task = $request->tasks[$i]['task'];
                $addTask->save();
            }

            for ($i = 0; $i < sizeof($request->visitors); $i++) {
                if ($request->visitors[$i]['email'] == $request->contact_manager) {
                    $isTourAdmin = 1;
                } else {
                    $isTourAdmin = 0;
                }

                $addVisitorUser = $this->saveVisitor($request->visitors[$i], $request->organization);
                if ($isTourAdmin == 1) {
                    $tourAdmin = $addVisitorUser->id;
                }

                $addVisitor = new Tourvisitor();
                $addVisitor->tour_id = $tourId;
                $addVisitor->visitor_id = $addVisitorUser->id;
                $addVisitor->is_tour_admin = $isTourAdmin;
                $addVisitor->save();
            }
            //rohit refference start
            for ($i = 0; $i < sizeof($request->references); $i++) {
                if ($request->references[$i]['email'] == $request->reference) {
                    $isTourAdmin = 1;
                } else {
                    $isTourAdmin = 0;
                }

                $addRefferenceUser = $this->saveRefference($request->references[$i]);
                if ($isTourAdmin == 1) {
                    $tourAdmin = $addRefferenceUser->id;
                }

                $addRefference = new Tourrefference();
                $addRefference->tour_id = $tourId;
                $addRefference->refference_id = $addRefferenceUser->id;
                $addRefference->is_tour_admin = $isTourAdmin;
                $addRefference->save();
            }
            //refference end
            //rohit meetings start
            for ($i = 0; $i < sizeof($request->meetings); $i++) {
                if ($request->meetings[$i]['email'] == $request->meeting) {
                    $isTourAdmin = 1;
                } else {
                    $isTourAdmin = 0;
                }

                $addMeetingUser = $this->saveMeeting($request->meetings[$i]);
                if ($isTourAdmin == 1) {
                    $tourAdmin = $addMeetingUser->id;
                }

                $addMeeting = new Tourmeeting();
                $addMeeting->tour_id = $tourId;
                $addMeeting->meeting_id = $addMeetingUser->id;
                $addMeeting->is_tour_admin = $isTourAdmin;
                $addMeeting->save();
            }
            //meetings end

            if ($request->manager) {
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
            $touradmin = User::where("id", $request->manager)->first();
            $date = date('Ymd', strtotime($request->start_date));
            $actionURL = $tourId . '_' . $date . '_' . $tourAdmin;
            if ($request->sendMail) {
                $userAuth->email = $request->contact_manager;
                $userAuth->url = $actionURL;
                $userAuth->visitorname = $request->visitors[0]['name'];
                $userAuth->maillink = 'blank';
                $userAuth->tourmember = ($request->senior + $request->adults + $request->children);
                $userAuth->tourmanager = $touradmin->name;
                $userAuth->start_date = str_replace(' ', ' at ', $request->start_date);
                $userAuth->mailSubject = $request->mailSubject;
                $userAuth->mailContent = $request->mailContent;
                $userAuth->cc = 'umeshbadgujar136@gmail.com';
                $userAuth->reply_to = 'manirulshekh229@gmail.com';
                $userAuth->reply_toname = 'Manirul Shekh';
                $userAuth->notify(new Tourconfirmation());
//                //same email send to tour manager
//                $userAuth->email = $touradmin->email;
//                $userAuth->notify(new Tourconfirmation());
            }
            
            //send email notification to the assigned manager
                $userAuth->email = $touradmin->email;
                $userAuth->url = $actionURL;
                $userAuth->start_date = $request->start_date;
                $userAuth->mailSubject = '';
                $userAuth->mailContent = '';
                $userAuth->notify(new Tourconfirmation());
                
            return response()->json(['code' => Config::get('constants.SUCCESS'), 'success' => Lang::get('tours.add')], 200);
        } catch (\Exception $ex) {
            if ($ex instanceof QueryException) {
                return response()->json(['code' => Config::get('constants.DUPLICATE'), 'error' => Lang::get('tours.duplicateentry')], 422);
            } else {
                return response()->json(['code' => Config::get('constants.ERROR'), 'error' => Lang::get('tours.someproblems')], 422);
            }
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id) {
        $ids = explode("_", $id);
        $id = $ids[0];

        $find = Tour::where("id", $id)->with('tourTransport', 'tourTapes', 'tourLocation', 'tourTasks', 'tourMeals', 'tourVisitors')->first();
        if (empty($find)) {
            return response()->json(['code' => Config::get('constants.NO_DATE_FOUND'), 'error' => Lang::get('tours.notfind')], 422);
        }

        for ($i = 0; $i < sizeof($find['tourVisitors']); $i++) {
            $getVisitor = Contactmanagement::where("id", $find['tourVisitors'][$i]['visitor_id'])->with('organizationdata', 'visitor', 'country')->withTrashed()->first();
            $find['tourVisitors'][$i]['visitor'] = $getVisitor;

            $findMomentos = Tourmomentos::where(["tour_id" => $find['tourVisitors'][$i]['tour_id'], 'visitor_id' => $find['tourVisitors'][$i]['visitor_id']])->with('momentos')->first();
            $find['tourVisitors'][$i]['momentos'] = $findMomentos['momento_id'];
            // $find['tourVisitors'][$i]['visitor']['momentos_data'] = $findMomentos['momentos'];
            $find['tourVisitors'][$i]['visitor']['momentos_name'] = $findMomentos['momentos']['name'];
            $find['tourVisitors'][$i]['visitor']['momentos'] = $findMomentos['momento_id'];
        }

        $mytime = Carbon::now();
        $to = Carbon::createFromFormat('Y-m-d H:s:i', $find->created_at);
        $from = Carbon::createFromFormat('Y-m-d H:s:i', $mytime->toDateTimeString());
        $diff_in_days = $to->diffInHours($from);

        $getData = Setting::first();
        if ($diff_in_days >= $getData['confirm_link_expired']) {
            $find->link_expired = 1;
            $find->errorMessage = Lang::get('tours.tourconfirmtimenotvalid');
            return response()->json(['code' => Config::get('constants.ERROR'), 'error' => Lang::get('tours.tourconfirmtimenotvalid'), 'data' => $find], 200);
        }

        $find->link_expired = 2;
        return response()->json(['code' => Config::get('constants.SUCCESS'), 'data' => $find], 200);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $idorganization
     * @return \Illuminate\Http\Response
     */
    public function edit($id) {
        $find = Tour::where("id", $id)->with('tourTransport', 'tourTapes', 'tourLocation', 'tourTasks', 'tourMeals', 'tourVisitorsEdit', 'tourRefferenceEdit', 'tourMeetingEdit', 'tourNotes', 'tourDocuments', 'tourManager', 'tourHistory', 'tourFeedback', 'tourNotes.tourNotesCreated', 'tourDocuments.tourDocsCreated')->first();
        for ($i = 0; $i < sizeof($find['tourVisitorsEdit']); $i++) {
            $getVisitor = Contactmanagement::where("id", $find['tourVisitorsEdit'][$i]['visitor_id'])->with('organizationdata', 'visitor')->withTrashed()->first();
            $find['tourVisitorsEdit'][$i]['visitor'] = $getVisitor;



            $findMomentos = Tourmomentos::where(["tour_id" => $find['tourVisitorsEdit'][$i]['tour_id'], 'visitor_id' => $find['tourVisitorsEdit'][$i]['visitor_id']])->with('momentos')->first();
            $find['tourVisitorsEdit'][$i]['momentos'] = $findMomentos['momento_id'];
            // $find['tourVisitorsEdit'][$i]['visitor']['momentos_data'] = $findMomentos['momentos'];
            $find['tourVisitorsEdit'][$i]['visitor']['momentos_name'] = $findMomentos['momentos']['name'];
            $find['tourVisitorsEdit'][$i]['visitor']['momentos'] = $findMomentos['momento_id'];
        }

        //for edit refference rohit
        $matchRefference = ["tour_refference.tour_id" => $id];
        $getRefference = DB::table('tour_refference')
                ->select('tour_refference.*', 'refferencemanagement.*')
                ->where($matchRefference)
                ->join('refferencemanagement', 'tour_refference.refference_id', '=', 'refferencemanagement.id')
                ->get();
        for ($i = 0; $i < sizeof($find['tourRefferenceEdit']); $i++) {
            $find['tourRefferenceEdit'][$i]['refference'] = $getRefference[$i];
        }
        //end edit refference
        //for edit meetings rohit
        $matchMeeting = ["tour_meeting.tour_id" => $id];
        $getMeeting = DB::table('tour_meeting')
                ->select('tour_meeting.*', 'meetingmanagement.*')
                ->where($matchMeeting)
                ->join('meetingmanagement', 'tour_meeting.meeting_id', '=', 'meetingmanagement.id')
                ->get();
        for ($i = 0; $i < sizeof($find['tourMeetingEdit']); $i++) {

            $find['tourMeetingEdit'][$i]['meeting'] = $getMeeting[$i];
        }
        //end edit mettings
        if (empty($find)) {
            return response()->json(['code' => Config::get('constants.NO_DATA_FOUND'), 'error' => Lang::get('tours.notfind')], 422);
        }
        return response()->json(['code' => Config::get('constants.SUCCESS'), 'data' => $find], 200);
    }

    public function saveVisitor($data, $name) {
        if (isset($data['id'])) {
            $find = Contactmanagement::where("id", $data['id'])->first();
            $find->name = $data['first_name'] . " " . $data['last_name'];
            $find->first_name = $data['first_name'];
            $find->middle_name = isset($data['middle_name']) ? $data['middle_name'] : '';
            $find->last_name = $data['last_name'];
            $find->email = $data['email'];
            $find->gender = isset($data['gender']) ? $data['gender'] : '';
            $find->mobile = $data['mobile'];
            $find->organization_id = isset($data['organization_id']) ? $data['organization_id'] : null;
            $find->organization = isset($data['organization']) ? $data['organization'] : $name;
            $find->phone_number = isset($data['phone_number']) ? $data['phone_number'] : '';
            $find->visitor_type = isset($data['visitor_type']) ? $data['visitor_type'] : null;
            $find->visitor_notes = isset($data['visitor_notes']) ? $data['visitor_notes'] : null;
            $find->address = isset($data['address']) ? $data['address'] : '';
            $find->address1 = isset($data['address1']) ? $data['address1'] : '';
            $find->country_id = isset($data['country_id']) ? $data['country_id'] : null;
            $find->state = isset($data['state']) ? $data['state'] : '';
            $find->city = isset($data['city']) ? $data['city'] : '';
            $find->zip_code = isset($data['zip_code']) ? $data['zip_code'] : '';
            $find->status = 1;
            $find->save();
            return $find;
        } else {
            $find = Contactmanagement::where("mobile", $data['mobile'])->first();
            if (empty($find)) {
                $addVisitor = new Contactmanagement();
                $addVisitor->name = $data['first_name'] . " " . $data['last_name'];
                $addVisitor->first_name = $data['first_name'];
                $addVisitor->middle_name = isset($data['middle_name']) ? $data['middle_name'] : '';
                $addVisitor->last_name = $data['last_name'];
                $addVisitor->email = $data['email'];
                $addVisitor->gender = isset($data['gender']) ? $data['gender'] : '';
                $addVisitor->mobile = $data['mobile'];
                $addVisitor->organization_id = isset($data['organization_id']) ? $data['organization_id'] : null;
                $addVisitor->organization = isset($data['organization']) ? $data['organization'] : $name;
                $addVisitor->phone_number = isset($data['phone_number']) ? $data['phone_number'] : '';
                $addVisitor->visitor_type = isset($data['visitor_type']) ? $data['visitor_type'] : null;
                $addVisitor->visitor_notes = isset($data['visitor_notes']) ? $data['visitor_notes'] : null;
                $addVisitor->address = isset($data['address']) ? $data['address'] : '';
                $addVisitor->address1 = isset($data['address1']) ? $data['address1'] : '';
                $addVisitor->country_id = isset($data['country_id']) ? $data['country_id'] : null;
                $addVisitor->state = isset($data['state']) ? $data['state'] : '';
                $addVisitor->city = isset($data['city']) ? $data['city'] : '';
                $addVisitor->zip_code = isset($data['zip_code']) ? $data['zip_code'] : '';
                $addVisitor->affiliate = isset($data['affiliate']) ? $data['affiliate'] : null;
                $addVisitor->status = 1;
                $addVisitor->save();
                return $addVisitor;
            } else {
                $find->name = $data['first_name'] . " " . $data['last_name'];
                $find->first_name = $data['first_name'];
                $find->middle_name = isset($data['middle_name']) ? $data['middle_name'] : '';
                $find->last_name = $data['last_name'];
                $find->email = $data['email'];
                $find->gender = isset($data['gender']) ? $data['gender'] : '';
                $find->mobile = $data['mobile'];
                $find->organization_id = isset($data['organization_id']) ? $data['organization_id'] : null;
                $find->organization = isset($data['organization']) ? $data['organization'] : $name;
                $find->phone_number = isset($data['phone_number']) ? $data['phone_number'] : '';
                $find->visitor_type = isset($data['visitor_type']) ? $data['visitor_type'] : null;

                $find->address = isset($data['address']) ? $data['address'] : '';
                $find->address1 = isset($data['address1']) ? $data['address1'] : '';
                $find->country_id = isset($data['country_id']) ? $data['country_id'] : null;
                $find->state = isset($data['state']) ? $data['state'] : '';
                $find->city = isset($data['city']) ? $data['city'] : '';
                $find->zip_code = isset($data['zip_code']) ? $data['zip_code'] : '';
                $find->affiliate = isset($data['affiliate']) ? $data['affiliate'] : null;
                $find->status = 1;
                $find->save();
                return $find;
            }
        }
    }

    //save refference rohit
    public function saveRefference($data) {
        if (isset($data['id'])) {
            $find = Refferencemanagement::where("id", $data['id'])->first();
            $find->name = $data['name'];
            $find->first_name = $data['first_name'];
            $find->last_name = $data['last_name'];
            $find->email = $data['email'];
            $find->mobile = $data['mobile'];
            $find->comment = $data['comment'];
            $find->status = 1;
            $find->save();
            return $find;
        } else {

            $find = Refferencemanagement::where("mobile", $data['mobile'])->first();

            if (empty($find)) {
                $addRefference = new Refferencemanagement();
                $addRefference->name = $data['name'];
                $addRefference->first_name = $data['first_name'];
                $addRefference->last_name = $data['last_name'];
                $addRefference->email = $data['email'];
                $addRefference->mobile = $data['mobile'];
                $addRefference->comment = $data['comment'];
                $addRefference->status = 1;
                $addRefference->save();
                return $addRefference;
            } else {
                $find->name = $data['name'];
                $find->first_name = $data['first_name'];
                $find->last_name = $data['last_name'];
                $find->email = $data['email'];
                $find->mobile = $data['mobile'];
                $find->comment = $data['comment'];
                $find->status = 1;
                $find->save();
                return $find;
            }
        }
    }

    //end save refference rohit
    //save meeting rohit
    public function saveMeeting($data) {
        if (isset($data['id'])) {
            $find = Meetingmanagement::where("id", $data['id'])->first();
            $find->name = $data['name'];
            $find->first_name = $data['first_name'];
            $find->last_name = $data['last_name'];
            $find->email = $data['email'];
            $find->mobile = $data['mobile'];
            $find->comment = $data['comment'];
            $find->meetingtime_format = $data['meetingtime_format'];
            $find->meetingtime_hour = $data['meetingtime_hour'];
            $find->meetingtime_min = $data['meetingtime_min'];
            $find->status = 1;
            $find->save();
            return $find;
        } else {
            $find = Meetingmanagement::where("mobile", $data['mobile'])->first();
            if (empty($find)) {
                $addMeeting = new Meetingmanagement();
                $addMeeting->name = $data['name'];
                $addMeeting->first_name = $data['first_name'];
                $addMeeting->last_name = $data['last_name'];
                $addMeeting->email = $data['email'];
                $addMeeting->mobile = $data['mobile'];
                $addMeeting->comment = $data['comment'];
                $addMeeting->meetingtime_format = $data['meetingtime_format'];
                $addMeeting->meetingtime_hour = $data['meetingtime_hour'];
                $addMeeting->meetingtime_min = $data['meetingtime_min'];
                $addMeeting->status = 1;
                $addMeeting->save();
                return $addMeeting;
            } else {
                $find->name = $data['name'];
                $find->first_name = $data['first_name'];
                $find->last_name = $data['last_name'];
                $find->email = $data['email'];
                $find->mobile = $data['mobile'];
                $find->comment = $data['comment'];
                $find->meetingtime_format = $data['meetingtime_format'];
                $find->meetingtime_hour = $data['meetingtime_hour'];
                $find->meetingtime_min = $data['meetingtime_min'];
                $find->status = 1;
                $find->save();
                return $find;
            }
        }
    }

    //end save meeting rohit

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id) {
        $userAuth = JWTAuth::parseToken()->authenticate();

        $update = Tour::find($id);
        $mealSer = Tourmealservice::where('tour_id', $id)->get();
//	echo '<pre>'; 
//        print_r($mealSer);die;
//        print_r($request->mealsType);
//        print_r($mealSer);echo 'this is total mealsserve'.sizeof($mealSer);die; 
        $currentManager = $update->manager;
        if (empty($update)) {
            return response()->json(['code' => Config::get('constants.NO_DATA_FOUND'), 'error' => Lang::get('tours.notfind')], 422);
        }

        if ($request->children == "") {
            $request->children = null;
        }
        if ($request->language == "") {
            $request->language = null;
        }
        if ($request->momento_type == "") {
            $request->momento_type = null;
        }
        if ($request->momento_quantity == "") {
            $request->momento_quantity = null;
        }

        try {
            $update->location_id = $request->location_id;
            $update->tourtype_id = $request->tourtype_id;
            $update->transport_id = $request->transport_id;
            $update->name = $request->name;
            $update->children = $request->children;
            $update->language = $request->language;
            $update->momento_type = $request->momento_type;
            $update->momento_quantity = $request->momento_quantity;
            $update->senior = $request->senior;
            $update->adults = $request->adults;
            $update->start_date = date('Y-m-d H:i:s', strtotime($request->start_date));//Carbon::createFromFormat('Y-m-d H:i:s', $request->start_date);
            $update->organization = $request->organization;
            //$update->meals = ($request->meals == true) ? 1 : 0;
            $update->meals = (sizeof($request->mealsType) > 0) ? 1 : 0;
            $update->special_request = $request->special_request;
            $update->status = $request->status;

            /* $update->budget = $request->budget;
              $update->expense_field = $request->expense_field; */
            $update->manager = $request->manager;
            $update->save();
            $tourId = $update->id;

            if ($request->manager) {
                if ($currentManager != $request->manager) {
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
            }

            Tourmealservice::where('tour_id', $tourId)->delete();
            Tourvisitor::where('tour_id', $tourId)->delete();
            Tourrefference::where('tour_id', $tourId)->delete();
            Tourmeeting::where('tour_id', $tourId)->delete();
            //send email to catering manager when meal deleted in edit tour
            if(sizeof($mealSer) > 0 && sizeof($request->mealsType) <= 0){
                $catmanager = User::where("id", $mealSer[0]->catering_manager)->first();
                $tour_manager = User::where("id", $request->manager)->first();
                $userAuth->email = $catmanager->email;
                $userAuth->mailSubject = 'Catering Order Cancelled'; 
                $userAuth->mailContent = '<p>Dear '.$catmanager->name.':</p> 
                    <p>The '.$request->name.' on '.str_replace(' ', ' at ', $request->start_date).' is canceled.Your meal of '.$mealSer[0]->specific_item.' has been cancelled</p>
                    <p>You can contact '.$tour_manager->name.' at '.$tour_manager->mobile.' or through email at '.$tour_manager->email.' for more information.</p>
                    <p>Looking forward to your continued service and support. </p>';
                $userAuth->notify(new TourStatus());
            }
            for ($i = 0; $i < sizeof($request->mealsType); $i++) {
                $addMealService = new Tourmealservice();
                $addMealService->tour_id = $tourId;
                $addMealService->catering_manager = $request->mealsType[$i]['catering_manager'];
                $addMealService->meal_id = $request->mealsType[$i]['meal_id'];
                $addMealService->meal_service_type_id = $request->mealsType[$i]['meal_service_type_id'];
                $addMealService->meal_service_location_id = $request->mealsType[$i]['meal_service_location_id'];
                $addMealService->people = $request->mealsType[$i]['people'];
                /* $addMealService->specific_item = $request->mealsType[$i]['specific_item']; */
                $addMealService->specific_item = isset($request->mealsType[$i]['specific_item']) ? $request->mealsType[$i]['specific_item'] : '';
                $addMealService->save();
                if(sizeof($mealSer) ==0){
                    $mealserloc = Mealservicelocation::where('id', $request->mealsType[$i]['meal_service_location_id'])->first()->name;
                    $mealsertype = Mealservicetype::where('id', $request->mealsType[$i]['meal_service_type_id'])->first()->name;
                    $mealtype = Meal::where('id', $request->mealsType[$i]['meal_id'])->first()->name;
                    $cat_manager = User::where("id", $request->mealsType[$i]['catering_manager'])->first();
                    $userAuth->email = $cat_manager->email;
                    $userAuth->mailSubject = 'New Tour: ' . $request->name;
                    $userAuth->mailContent = '<p>Dear ' . $cat_manager->name . ':</p><p>Tour ' . $request->name . ' on ' . str_replace(' ', ' at ', $request->start_date) . ' is approved.</p><p> The visitors need the following meals: </p><p><b>Meal Type:</b> ' . $mealtype . '</p><p><b>Comments:</b> ' . $request->mealsType[$i]['specific_item'] . '</p><p><b>People:</b> ' . $request->mealsType[$i]['people'] . '</p><p><b>Meal Service:</b> ' . $mealsertype . '</p><p><b>Meal Location:</b> ' . $mealserloc . '</p>';

                    $userAuth->notify(new TourStatus());
                } else if(sizeof($mealSer) > 0 && $request->mealsType[$i]['catering_manager'] != $mealSer[0]->catering_manager){
                    //send to old cat manager
                    $catmanager = User::where("id", $mealSer[0]->catering_manager)->first();
                    $tour_manager = User::where("id", $request->manager)->first();
                    $userAuth->email = $catmanager->email;
                    $userAuth->mailSubject = 'Catering Order Cancelled'; 
                    $userAuth->mailContent = '<p>Dear '.$catmanager->name.':</p> 
                        <p>The '.$request->name.' on '.str_replace(' ', ' at ', $request->start_date).' is canceled.Your meal of '.$mealSer[0]->specific_item.' has been cancelled</p>
                        <p>You can contact '.$tour_manager->name.' at '.$tour_manager->mobile.' or through email at '.$tour_manager->email.' for more information.</p>
                        <p>Looking forward to your continued service and support. </p>';
                    $userAuth->notify(new TourStatus());
                    //send to new cat manager
                    $mealserloc = Mealservicelocation::where('id', $request->mealsType[$i]['meal_service_location_id'])->first()->name;
                    $mealsertype = Mealservicetype::where('id', $request->mealsType[$i]['meal_service_type_id'])->first()->name;
                    $mealtype = Meal::where('id', $request->mealsType[$i]['meal_id'])->first()->name;
                    $cat_manager_new = User::where("id", $request->mealsType[$i]['catering_manager'])->first();
                    $userAuth->email = $cat_manager_new->email;
                    $userAuth->mailSubject = 'New Tour: ' . $request->name;
                    $userAuth->mailContent = '<p>Dear ' . $cat_manager_new->name . ':</p><p>Tour ' . $request->name . ' on ' . str_replace(' ', ' at ', $request->start_date) . ' is approved.</p><p> The visitors need the following meals: </p><p><b>Meal Type:</b> ' . $mealtype . '</p><p><b>Comments:</b> ' . $request->mealsType[$i]['specific_item'] . '</p><p><b>People:</b> ' . $request->mealsType[$i]['people'] . '</p><p><b>Meal Service:</b> ' . $mealsertype . '</p><p><b>Meal Location:</b> ' . $mealserloc . '</p>';

                    $userAuth->notify(new TourStatus());
                }
                
            }

            for ($i = 0; $i < sizeof($request->visitors); $i++) {
                if ($request->visitors[$i]['email'] == $request->contact_manager) {
                    $isTourAdmin = 1;
                } else {
                    $isTourAdmin = 0;
                }

                // $request->visitors[$i]['organization'] = isset($request->visitors[$i]['organization']) ? $request->visitors[$i]['organization'] : $request->organization;
                $addVisitorUser = $this->saveVisitor($request->visitors[$i], $request->organization);
                if (isset($request->visitors[$i]['momentos'])) {
                    $findMomentos = Tourmomentos::where(["tour_id" => $tourId, 'visitor_id' => $addVisitorUser->id])->first();
                    if (empty($findMomentos)) {
                        $addMomentos = new Tourmomentos();
                        $addMomentos->tour_id = $tourId;
                        $addMomentos->visitor_id = $addVisitorUser->id;
                        $addMomentos->momento_id = $request->visitors[$i]['momentos'];
                        $addMomentos->save();
                    } else {
                        $findMomentos->momento_id = $request->visitors[$i]['momentos'];
                        $findMomentos->save();
                    }
                } else {
                    $findMomentos = Tourmomentos::where(["tour_id" => $tourId, 'visitor_id' => $addVisitorUser->id])->first();
                    if ($findMomentos) {
                        $findMomentos->momento_id = $request->visitors[$i]['momentos'];
                        $findMomentos->save();
                    }
                }

                $addVisitor = new Tourvisitor();
                $addVisitor->tour_id = $tourId;
                $addVisitor->visitor_id = $addVisitorUser->id;
                $addVisitor->is_tour_admin = $isTourAdmin;
                $addVisitor->save();
            }
            //rohit refference start
            for ($i = 0; $i < sizeof($request->references); $i++) {
                if ($request->references[$i]['email'] == $request->reference) {
                    $isTourAdmin = 1;
                } else {
                    $isTourAdmin = 0;
                }

                $addRefferenceUser = $this->saveRefference($request->references[$i]);
                if ($isTourAdmin == 1) {
                    $tourAdmin = $addRefferenceUser->id;
                }

                $addRefference = new Tourrefference();
                $addRefference->tour_id = $tourId;
                $addRefference->refference_id = $addRefferenceUser->id;
                $addRefference->is_tour_admin = $isTourAdmin;
                $addRefference->save();
            }
            //refference end
            //rohit meetings start
            for ($i = 0; $i < sizeof($request->meetings); $i++) {
                if ($request->meetings[$i]['email'] == $request->meeting) {
                    $isTourAdmin = 1;
                } else {
                    $isTourAdmin = 0;
                }

                $addMeetingUser = $this->saveMeeting($request->meetings[$i]);
                if ($isTourAdmin == 1) {
                    $tourAdmin = $addMeetingUser->id;
                }

                $addMeeting = new Tourmeeting();
                $addMeeting->tour_id = $tourId;
                $addMeeting->meeting_id = $addMeetingUser->id;
                $addMeeting->is_tour_admin = $isTourAdmin;
                $addMeeting->save();
            }
            //meetings end

            return response()->json(['code' => Config::get('constants.SUCCESS'), 'success' => Lang::get('tours.update')], 200);
        } catch (\Exception $ex) {
            dd($ex->getMessage());
            if ($ex instanceof QueryException) {
                return response()->json(['code' => Config::get('constants.DUPLICATE'), 'error' => Lang::get('tours.duplicateentry')], 422);
            } else {
                return response()->json(['code' => Config::get('constants.ERROR'), 'error' => Lang::get('tours.someproblems')], 422);
            }
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id) {
        $userAuth = JWTAuth::parseToken()->authenticate();
        if ($userAuth->roles[0]->id == Config::get('constants.ADMIN_ID')) {
            Tour::where('id', $id)->delete();
            return response()->json(['code' => Config::get('constants.SUCCESS'), 'success' => Lang::get('tours.delete')], 200);
        } else {
            return response()->json(['code' => Config::get('constants.NO_DATA_FOUND'), 'error' => Lang::get('tours.notfind')], 422);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroyVisitor(Request $request) {
        $deleteTask = Tourvisitor::where(['tour_id' => $request->tour_id, 'visitor_id' => $request->visitor_id]);
        $deleteTask->delete();
        return response()->json(['code' => Config::get('constants.SUCCESS'), 'success' => Lang::get('tours.update')], 200);
    }

    /**
     * Accept or reject acknowledge by tour contact person
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function touraction(Request $request) {
        if ($request->header('Authorization')) {
            $userAuth = JWTAuth::parseToken()->authenticate();
        } else {
            $userAuth = [];
        }

        if (isset($request->tour_id)) {
            $ids = explode("_", $request->tour_id);
            $id = $ids[0];
        } else {
            $id = $request->id;
        }

        $actionData = Tour::find($id);

        $senderArray = [1, $actionData->manager];
        $userName = ($request->name) ? $request->name : $userAuth->name;
        $contactPerson = Tourvisitor::where(['tour_id' => $id, 'is_tour_admin' => 1])->with('contactmanager')->first();
        $mealSer = Tourmealservice::where('tour_id', $id)->get();
        $meetingData = Tourmeeting::where('tour_id', $id)->get();
        $referenceData = Tourrefference::where('tour_id', $id)->get();
        //replace {cateringinfo} with catering indo
        $cateringinfo = '';
        for ($p = 0; $p < sizeof($mealSer); $p++) {
            $mealserloc = Mealservicelocation::where('id', $mealSer[$p]['meal_service_location_id'])->first()->name;
            $mealtype = Meal::where('id', $mealSer[$p]['meal_id'])->first()->name;
            $mealsertype = Mealservicetype::where('id', $mealSer[$p]['meal_service_type_id'])->first()->name;
            $cateringinfo .= '<p><b>Meal Type:</b> '.$mealtype.'</p><p><b>Specific Item:</b> ' . $mealSer[$p]['specific_item'] . '</p><p><b>People:</b> ' . $mealSer[$p]['people'] . '</p><p><b>Meal Service:</b> ' . $mealsertype . '</p><p><b>Meal Location:</b> ' . $mealserloc . '</p>';
        }
        $mailContent = $request->mailContent;
        $mailContent = str_replace('{cateringinfo}', $cateringinfo, $mailContent);
        //end {cateringinfo}
        for ($i = 0; $i < sizeof($mealSer); $i++) {
            array_push($senderArray, $mealSer[$i]['catering_manager']);
        }

        $senderArray = array_unique($senderArray);
        if ($userAuth) {
            $senderArray = array_diff($senderArray, [$userAuth->id]);
        }

        if (empty($actionData)) {
            return response()->json(['error' => Lang::get('tours.notfind')], 422);
        }

        try {
            $mytime = Carbon::now();
            if ($request->action == 1) {
                $actionData->status = $request->action;
                $actionData->acknowledge_comment = $request->comment;
                $actionData->acknowledge_date = Carbon::createFromFormat('Y-m-d H:s:i', $mytime->toDateTimeString());
            } else {
                $actionData->status = $request->action;
            }
            
            $actionData->save(); 
            /* Add in history table */
            
            $touradmin = User::where("id", $actionData->manager)->first();
            if ($request->action == 0) {
                $msg = Lang::get('tours.tourStatusPending');
                $action = 'pending';
                $message = 'Tour status has been changed as a ' . $action . ' by ' . $userName;
            } else if ($request->action == 1) {
                
                $msg = Lang::get('tours.tourStatusAcknowledged');
                $action = 'acknowledged';
                $message = $userName . ' has been ' . $action . ' a tour';
                if ($request->sendMail) {
                    // sedn email to the tour visitor
                    $userAuth->email = $contactPerson->contactmanager->email;
                    $userAuth->tourName = $actionData->name;
                    $userAuth->tourStatus = 'Acknowledged';
                    $userAuth->visitorname = $contactPerson->contactmanager->name;
                    $userAuth->tourmanager = $touradmin->name;
                    $userAuth->manageremail = $touradmin->email;
                    $userAuth->managerphone = $touradmin->mobile;
                    $userAuth->startdate = str_replace(' ', ' at ', $actionData->start_date);
                    $userAuth->tourmember = ($actionData->senior + $actionData->adults + $actionData->children);
                    $userAuth->mailSubject = $request->mailSubject;
                    $userAuth->mailContent = $mailContent;
                    $userAuth->greeting = 'no';
                    $userAuth->notify(new TourAcknowledge());
                    //same email send to tour manager
                    $userAuth->email = $touradmin->email;
                    $userAuth->notify(new TourAcknowledge());
                }
                
                //send email to catering manager
                for ($p = 0; $p < sizeof($mealSer); $p++) {
                    $mealserloc = Mealservicelocation::where('id', $mealSer[$p]['meal_service_location_id'])->first()->name;
                    $mealsertype = Mealservicetype::where('id', $mealSer[$p]['meal_service_type_id'])->first()->name;
                    $mealtype = Meal::where('id', $mealSer[$p]['meal_id'])->first()->name;
                    $cat_manager = User::where("id", $mealSer[$p]['catering_manager'])->first();
                    $userAuth->email = $cat_manager->email;
                    $userAuth->tourName = $actionData->name;
                    $userAuth->tourStatus = 'Approved';

                    $userAuth->mailSubject = 'New Tour: '.$actionData->name;
                    $userAuth->mailContent = '<p>Dear ' . $cat_manager->name . ':</p><p>Tour ' . $actionData->name . ' on ' . str_replace(' ', ' at ', $actionData->start_date) . ' is acknowledged.</p><p> The visitors need the following meals: </p><p><b>Meal Type:</b> '.$mealtype.'</p><p><b>Comments:</b> ' . $mealSer[$p]['specific_item'] . '</p><p><b>People:</b> ' . $mealSer[$p]['people'] . '</p><p><b>Meal Service:</b> ' . $mealsertype . '</p><p><b>Meal Location:</b> ' . $mealserloc . '</p>';

                    $userAuth->notify(new TourStatus());
                }
            } else if ($request->action == 2) {
                $msg = Lang::get('tours.tourStatusAccepted');
                $action = 'accepted';
                $message = $userName . ' has been ' . $action . ' a tour';


                if ($request->sendMail) {
                    // sedn email to the tour visitor
                    $userAuth->email = $contactPerson->contactmanager->email;
                    $userAuth->tourName = $actionData->name;
                    $userAuth->tourStatus = 'Approved';
                    $userAuth->visitorname = $contactPerson->contactmanager->name;
                    $userAuth->tourmanager = $touradmin->name;
                    $userAuth->manageremail = $touradmin->email;
                    $userAuth->managerphone = $touradmin->mobile;
                    $userAuth->startdate = $actionData->start_date;
                    $userAuth->tourmember = ($actionData->senior + $actionData->adults + $actionData->children);
                    $userAuth->mailSubject = $request->mailSubject;
                    $userAuth->mailContent = $mailContent;

                    $userAuth->notify(new TourStatus());
                    //same email send to tour manager
                    $userAuth->email = $touradmin->email;
                    $userAuth->notify(new TourStatus());
                }

                
                //send email to tour manager
                $userAuth->email = $touradmin->email;
                $userAuth->tourName = $actionData->name;
                $userAuth->tourStatus = 'Approved'; 

                $userAuth->mailSubject = 'Tour Confirmed: '.$actionData->name;
                $userAuth->mailContent = '<p>Dear ' . $touradmin->name . ':</p><p>Tour ' . $actionData->name . ' on ' . str_replace(' ', ' at ', $actionData->start_date) . ' has been confirmed. You are responsible for managing the tour.</p><p>The point of contact for this tour is ' . $contactPerson->contactmanager->name . ' and can be reached at ' . $contactPerson->contactmanager->mobile . ', or through email at ' . $contactPerson->contactmanager->email . '.</p>';

                $userAuth->notify(new TourStatus());

                //send email to all tour manager
                $adminlist = Role::where('name', 'admin')->first()->users()->get();
                foreach ($adminlist as $ta) {
                        $userAuth->email = $ta->email;
                        $userAuth->tourName = $actionData->name;
                        $userAuth->tourStatus = 'Approved';

                        $userAuth->mailSubject = 'Tour Confirmed: '.$actionData->name;
                        $userAuth->mailContent = '<p>Dear ' . $ta->name . ':</p><p>Tour ' . $actionData->name . ' on ' . str_replace(' ', ' at ', $actionData->start_date) . ' has been confirmed and ' . $touradmin->name . ' is the Tour Manager. Please reach out to ' . $touradmin->name . ' at ' . $touradmin->email . ' or ' . $touradmin->mobile . ' if you need details. ';//Their information is:</p> <p>Name: ' . $contactPerson->contactmanager->name . ',</p> <p>Phone: ' . $contactPerson->contactmanager->mobile . ',</p> <p>Email: ' . $contactPerson->contactmanager->email . '.</p>';

                        $userAuth->notify(new TourStatus());
                }
                //send email to catering manager
                for ($p = 0; $p < sizeof($mealSer); $p++) {
                    $cat_manager = User::where("id", $mealSer[$p]['catering_manager'])->first();
                    $mealserloc = Mealservicelocation::where('id', $mealSer[$p]['meal_service_location_id'])->first()->name;
                    $mealtype = Meal::where('id', $mealSer[$p]['meal_id'])->first()->name;
                    $mealsertype = Mealservicetype::where('id', $mealSer[$p]['meal_service_type_id'])->first()->name;
                    $userAuth->email = $cat_manager->email;
                    $userAuth->tourName = $actionData->name;
                    $userAuth->tourStatus = 'Approved';

                    $userAuth->mailSubject = 'Tour Confimed: '.$actionData->name;
                    $userAuth->mailContent = '<p>Dear ' . $cat_manager->name . ':</p><p>Tour ' . $actionData->name . ' on ' . str_replace(' ', ' at ', $actionData->start_date) . ' is confirmed.</p><p> The visitors need the following meals: </p><p><b>Meal Type:</b> '.$mealtype.'</p><p><b>Specific Item:</b> ' . $mealSer[$p]['specific_item'] . '</p><p><b>People:</b> ' . $mealSer[$p]['people'] . '</p><p><b>Meal Service:</b> ' . $mealsertype . '</p><p><b>Meal Location:</b> ' . $mealserloc . '</p>
                    <p>' . $touradmin->name . ' is handling this tour and if needed can be reached at ' . $touradmin->email . ' or ' . $touradmin->mobile . '</p>';
                    
                    $userAuth->notify(new TourStatus());
                    
                }
                //send email to meeting manager
                for ($m = 0; $m < sizeof($meetingData); $m++) {
                    $met_manager = Meetingmanagement::where("id", $meetingData[$m]['meeting_id'])->first();

                    $userAuth->email = $met_manager->email;
                    $userAuth->tourName = $actionData->name;
                    $userAuth->tourStatus = 'Approved';

                    $userAuth->mailSubject = 'Meeting with '.$actionData->name;
                    $userAuth->mailContent = '<p>Dear ' . $met_manager->name . ':</p>
                    <p>' . $actionData->name . ' is coming for a tour on ' . str_replace(' ', ' at ', $actionData->start_date) . ' and will be meeting you at ' . $met_manager->meetingtime_hour . ':' . $met_manager->meetingtime_min . ' '.$request->meetingtime_format.'
                    <p>' . $touradmin->name . ' is handling this tour and can be reach at ' . $touradmin->email . ' or ' . $touradmin->mobile . ' if you have any questions.</p>
                    <p>Please add this meeting to your calendar.</p>';

                    $userAuth->notify(new TourStatus());
                }

                //send email to Reference
                for ($r = 0; $r < sizeof($referenceData); $r++) {
                    $ref_manager = Refferencemanagement::where("id", $referenceData[$r]['refference_id'])->first();

                    $userAuth->email = $ref_manager->email;
                    $userAuth->tourName = $actionData->name;
                    $userAuth->tourStatus = 'Approved';

                    $userAuth->mailSubject = 'Tour Confirmed: '.$actionData->name;
                    $userAuth->mailContent = '<p>Dear ' . $ref_manager->name . ':</p><p>Tour ' . $actionData->name . ' on ' . str_replace(' ', ' at ', $actionData->start_date) . ' is confirmed for ' . $contactPerson->contactmanager->name . '.</p><p>Should you have any problems please contact <br>' . ucwords($touradmin->name) . '(' . $touradmin->mobile . ', ' . $touradmin->email . ')</p>';

                    $userAuth->notify(new TourStatus());
                }
                
            } else if ($request->action == 3) {
                $msg = Lang::get('tours.tourStatusRejected');
                $action = 'rejected';
                $message = $userName . ' has been ' . $action . ' a tour';
                if ($request->sendMail) {
                    // sedn email to the tour visitor
                    $userAuth->email = $contactPerson->contactmanager->email;
                    $userAuth->tourName = $actionData->name;
                    $userAuth->tourStatus = 'Cancelled';
                    $userAuth->visitorname = $contactPerson->contactmanager->name;
                    $userAuth->tourmanager = $touradmin->name;
                    $userAuth->manageremail = $touradmin->email;
                    $userAuth->managerphone = $touradmin->mobile;
                    $userAuth->startdate = $actionData->start_date;
                    $userAuth->mailSubject = $request->mailSubject;
                    $userAuth->mailContent = $mailContent;

                    $userAuth->notify(new TourStatus());
                    //same email send to tour manager
                    $userAuth->email = $touradmin->email;
                    $userAuth->notify(new TourStatus());
                }
                //send email to tour manager
                $userAuth->email = $touradmin->email;
                $userAuth->tourName = $actionData->name;
                $userAuth->tourStatus = 'Cancelled';
                $userAuth->mailSubject = 'Tour Cancelled: '.$actionData->name;
                $userAuth->mailContent = '<p>Dear ' . $touradmin->name . ':</p><p> Tour ' . $actionData->name . ' on ' . str_replace(' ', ' at ', $actionData->start_date) . ' has been cancelled.</p><p>The contact person for this tour was ' . $contactPerson->contactmanager->name . ' and can be reached at ' . $contactPerson->contactmanager->mobile . ' or via email at ' . $contactPerson->contactmanager->email . '.</p>';
                $userAuth->notify(new TourStatus());

                //send email to all tour manager
                $adminlist = Role::where('name', 'admin')->first()->users()->get();
                foreach ($adminlist as $ta) {
                        $userAuth->email = $ta->email;
                        $userAuth->tourName = $actionData->name;
                        $userAuth->tourStatus = 'Cancelled';

                        $userAuth->mailSubject = 'Tour Cancelled: '.$actionData->name;
                        $userAuth->mailContent = '<p>Dear ' . $ta->name . ':</p><p>Tour ' . $actionData->name . ' on ' . str_replace(' ', ' at ', $actionData->start_date) . ' has been cancelled.</p><p>If you have any questions, Please reach out to ' . $touradmin->name . ' at ' . $touradmin->mobile . ' or email ' . $touradmin->email . '.</p>';

                        $userAuth->notify(new TourStatus());
                }

                

                //send email to catering manager
                for ($p = 0; $p < sizeof($mealSer); $p++) {
                    $cat_manager = User::where("id", $mealSer[$p]['catering_manager'])->first();
                    $userAuth->email = $cat_manager->email;
                    $userAuth->tourName = $actionData->name;
                    $userAuth->tourStatus = 'Cancelled';

                    $userAuth->mailSubject = 'Tour Cancelled: '.$actionData->name;
                    $userAuth->mailContent = '<p>Dear ' . $cat_manager->name . ':</p><p> Tour ' . $actionData->name . ' on ' . str_replace(' ', ' at ', $actionData->start_date) . ' has been cancelled.</p>';

                    $userAuth->notify(new TourStatus());
                }
                //send email to meeting manager
                for ($m = 0; $m < sizeof($meetingData); $m++) {
                    $met_manager = Meetingmanagement::where("id", $meetingData[$m]['meeting_id'])->first();

                    $userAuth->email = $met_manager->email;
                    $userAuth->tourName = $actionData->name;
                    $userAuth->tourStatus = 'Cancelled';

                    $userAuth->mailSubject = 'Tour Cancelled: '.$actionData->name;
                    $userAuth->mailContent = '<p>Dear ' . $met_manager->name . ':</p><p> Tour ' . $actionData->name . ' on ' . str_replace(' ', ' at ', $actionData->start_date) . ' has been cancelled.</p>';

                    $userAuth->notify(new TourStatus());
                }

                //send email to Reference
                for ($r = 0; $r < sizeof($referenceData); $r++) {
                    $ref_manager = Refferencemanagement::where("id", $referenceData[$r]['refference_id'])->first();

                    $userAuth->email = $ref_manager->email;
                    $userAuth->tourName = $actionData->name;
                    $userAuth->tourStatus = 'Cancelled';

                    $userAuth->mailSubject = 'Tour Cancelled: '.$actionData->name;
                    $userAuth->mailContent = '<p>Dear ' . $ref_manager->name . ':</p><p> Tour ' . $actionData->name . ' on ' . str_replace(' ', ' at ', $actionData->start_date) . ' has been cancelled for ' . $contactPerson->contactmanager->name . '.</p><p>If you have any questions, please contact ' . ucwords($touradmin->name) . ' at ' . $touradmin->mobile . ' or ' . $touradmin->email . '</p>';

                    $userAuth->notify(new TourStatus());
                }
                
            } else if ($request->action == 4) {
                $msg = Lang::get('tours.tourStatusCompleted');
                $action = 'completed';
                $message = $userName . ' has been ' . $action . ' a tour';
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

            if ($request->action == 4 && $request->sendMail) {
                $dataFormats = ['Ymd', 'mdY', 'dmY', 'dYm', 'mYd'];

                $contactPerson = Tourvisitor::where(['tour_id' => $id, 'is_tour_admin' => 1])->with('contactmanager')->first();
                $userAuth->email = $contactPerson->contactmanager->email;
                
                $dateArray = array_rand($dataFormats);
                $randArray = $dataFormats[$dateArray];
                $date1 = date($randArray, strtotime($mytime));
                $actionURL = $id . $date1;
                $userAuth->url = $actionURL;

                $userAuth->mailSubject = $request->mailSubject;
                $userAuth->mailContent = $mailContent;

                $userAuth->notify(new TourFeedback());
                //same email send to tour manager
                $userAuth->email = $touradmin->email;
                $userAuth->notify(new TourFeedback());
                 
                //send email to tour manager
                $userAuth->email = $touradmin->email;
                $userAuth->tourName = $actionData->name;
                $userAuth->tourStatus = 'Completed';
                $userAuth->mailSubject = 'Tour Completed: '.$actionData->name;
                $userAuth->mailContent = '<p>Dear ' . $touradmin->name . ':</p><p> Tour ' . $actionData->name . ' on ' . str_replace(' ', ' at ', $actionData->start_date) . ' has been completed.</p><p>The contact for this tour is ' . $contactPerson->contactmanager->name . ' and can be reached at ' . $contactPerson->contactmanager->mobile . ' or ' . $contactPerson->contactmanager->email . '.</p>';
                $userAuth->notify(new TourStatus());

                //send email to all tour manager
                $adminlist = Role::where('name', 'admin')->first()->users()->get();
                foreach ($adminlist as $ta) {
                        $userAuth->email = $ta->email;
                        $userAuth->tourName = $actionData->name;
                        $userAuth->tourStatus = 'Completed';

                        $userAuth->mailSubject = 'Tour Completed: '.$actionData->name;
                        $userAuth->mailContent = '<p>Dear ' . $ta->name . ':</p><p> Tour ' . $actionData->name . ' on ' . str_replace(' ', ' at ', $actionData->start_date) . ' has been completed.</p><p>' . $touradmin->name . ' managed this tour and if you have questions, can be reached at ' . $touradmin->email . ' or ' . $touradmin->mobile . ' .</p>';

                        $userAuth->notify(new TourStatus());
                }
                //send email to catering manager
                for ($p = 0; $p < sizeof($mealSer); $p++) {
                    $cat_manager = User::where("id", $mealSer[$p]['catering_manager'])->first();
                    $userAuth->email = $cat_manager->email;
                    $userAuth->tourName = $actionData->name;
                    $userAuth->tourStatus = 'Completed';

                    $userAuth->mailSubject = 'Tour Completed: '.$actionData->name;
                    $userAuth->mailContent = '<p>Dear ' . $cat_manager->name . ':</p><p> Tour ' . $actionData->name . ' on ' . str_replace(' ', ' at ', $actionData->start_date) . ' has been completed.</p>';

                    $userAuth->notify(new TourStatus());
                }
                //send email to meeting manager
                for ($m = 0; $m < sizeof($meetingData); $m++) {
                    $met_manager = Meetingmanagement::where("id", $meetingData[$m]['meeting_id'])->first();

                    $userAuth->email = $met_manager->email;
                    $userAuth->tourName = $actionData->name;
                    $userAuth->tourStatus = 'Completed';

                    $userAuth->mailSubject = 'Tour Completed: '.$actionData->name;
                    $userAuth->mailContent = '<p>Dear ' . $met_manager->name . ':</p><p> Tour ' . $actionData->name . ' on ' . str_replace(' ', ' at ', $actionData->start_date) . ' has been completed.</p>';

                    $userAuth->notify(new TourStatus());
                }

                //send email to Reference
                for ($r = 0; $r < sizeof($referenceData); $r++) {
                    $ref_manager = Refferencemanagement::where("id", $referenceData[$r]['refference_id'])->first();

                    $userAuth->email = $ref_manager->email;
                    $userAuth->tourName = $actionData->name;
                    $userAuth->tourStatus = 'Completed';

                    $userAuth->mailSubject = 'Tour Completed: '.$actionData->name;
                    $userAuth->mailContent = '<p>Dear ' . $ref_manager->name . ':</p><p> Tour ' . $actionData->name . ' on ' . str_replace(' ', ' at ', $actionData->start_date) . ' has been completed for ' . $contactPerson->contactmanager->name . '.</p><p>If you have any questions, please contact ' . ucwords($touradmin->name) . ' at ' . $touradmin->mobile . ' or ' . $touradmin->email . '.</p>';

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
     * Resend acknowledge confirm link to tour contact person
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function resendlink(Request $request) {
//        if ($request->sendMail) {
            $userAuth = JWTAuth::parseToken()->authenticate();
            // $find = Tour::where("id", $id)->with('tourTransport','tourTapes','tourLocation','tourTasks','tourMeals','tourVisitors')->first();        
            $actionData = Tour::where("id", $request->id)->with('tourVisitors')->first();
            $mealSer = Tourmealservice::where('tour_id', $request->id)->get();
            $contactPerson = Tourvisitor::where(['tour_id' => $request->id, 'is_tour_admin' => 1])->with('contactmanager')->first();
            $meetingData = Tourmeeting::where('tour_id', $request->id)->get();
            $referenceData = Tourrefference::where('tour_id', $request->id)->get();
            $touradmin = User::where("id", $actionData->manager)->first();
            if (empty($actionData)) {
                return response()->json(['error' => Lang::get('tours.notfind')], 422);
            }
            for ($i = 0; $i < sizeof($actionData['tourVisitors']); $i++) {
                if ($actionData['tourVisitors'][$i]['is_tour_admin'] == 1) {
                    $getVisitor = Contactmanagement::where("id", $actionData['tourVisitors'][$i]['visitor_id'])->with('organizationdata', 'visitor')->first();
                    $actionData['contact_person'] = $getVisitor;
                }
            }
//            echo '<pre>';print_r($touradmin);die;
            try {
                if($request->action == 0) {
                    $date = date('Ymd', strtotime($actionData->start_date));
                    $actionURL = $actionData->id . '_' . $date . '_' . $actionData->contact_person['id'];
                    if ($request->sendMail) {                        
                        $userAuth->email = $actionData->contact_person['email'];
                        $userAuth->start_date = $actionData->start_date;
                        $userAuth->url = $actionURL;
                        $userAuth->mailSubject = $request->mailSubject;
                        $userAuth->mailContent = $request->mailContent;

                        $userAuth->visitorname = $actionData->contact_person['name'];
                        $userAuth->maillink = 'blank';
                        $userAuth->tourmember = ($actionData->senior + $actionData->adults + $actionData->children);
                        $userAuth->tourmanager = $touradmin->name;

                        $userAuth->notify(new Tourconfirmation());
                        //same email send to tour manager
                        $userAuth->email = $touradmin->email;
                        $userAuth->notify(new Tourconfirmation());
                    }
                    //send email notification to the assigned manager
                    $userAuth->email = $touradmin->email;
                    $userAuth->url = $actionURL;
                    $userAuth->start_date = $actionData->start_date;
                    $userAuth->mailSubject = '';
                    $userAuth->mailContent = '';
                    $userAuth->notify(new Tourconfirmation());

                    return response()->json(['code' => Config::get('constants.SUCCESS'), 'success' => Lang::get('tours.resendpending')], 200);
                } else if($request->action == 1) {
                    if ($request->sendMail==1) {
                        // sedn email to the tour visitor
                        $userAuth->email = $actionData->contact_person['email'];
                        $userAuth->tourName = $actionData->name;
                        $userAuth->tourStatus = 'Acknowledged';
                        $userAuth->visitorname = $actionData->contact_person['name'];
                        $userAuth->tourmanager = $touradmin->name;
                        $userAuth->manageremail = $touradmin->email;
                        $userAuth->managerphone = $touradmin->mobile;
                        $userAuth->startdate = str_replace(' ', ' at ', $actionData->start_date);
                        $userAuth->tourmember = ($actionData->senior + $actionData->adults + $actionData->children);
                        $userAuth->mailSubject = $request->mailSubject;
                        $userAuth->mailContent = $request->mailContent;

                        $userAuth->notify(new TourStatus());
                        //same email send to tour manager
                        $userAuth->email = $touradmin->email;
                        $userAuth->notify(new TourStatus());
                    }
                    
                        //send email to catering manager
                    for ($p = 0; $p < sizeof($mealSer); $p++) {
                        $mealserloc = Mealservicelocation::where('id', $mealSer[$p]['meal_service_location_id'])->first()->name;
                        $mealtype = Meal::where('id', $mealSer[$p]['meal_id'])->first()->name;
                        $mealsertype = Mealservicetype::where('id', $mealSer[$p]['meal_service_type_id'])->first()->name;
                        $cat_manager = User::where("id", $mealSer[$p]['catering_manager'])->first();
                        $userAuth->email = $cat_manager->email;
                        $userAuth->tourName = $actionData->name;
                        $userAuth->tourStatus = 'Approved';

                        $userAuth->mailSubject = 'New Tour: '.$actionData->name;
                        $userAuth->mailContent = '<p>Dear ' . $cat_manager->name . ':</p><p>Tour ' . $actionData->name . ' on ' . str_replace(' ', ' at ', $actionData->start_date) . ' is acknowledged.</p><p> The visitors need the following meals: </p><p><b>Meal Type:</b> '.$mealtype.'</p><p><b>Comments:</b> ' . $mealSer[$p]['specific_item'] . '</p><p><b>People:</b> ' . $mealSer[$p]['people'] . '</p><p><b>Meal Service:</b> ' . $mealsertype . '</p><p><b>Meal Location:</b> ' . $mealserloc . '</p>';
                        $userAuth->notify(new TourStatus());
                    }
                        
                    return response()->json(['code' => Config::get('constants.SUCCESS'), 'success' => Lang::get('tours.resendacknowledged')], 200);
                } else if($request->action == 2) {
                    if ($request->sendMail==1) {
                        // sedn email to the tour visitor
                        $userAuth->email = $actionData->contact_person['email'];
                        $userAuth->tourName = $actionData->name;
                        $userAuth->tourStatus = 'Approved';
                        $userAuth->visitorname = $actionData->contact_person['name'];
                        $userAuth->tourmanager = $touradmin->name;
                        $userAuth->manageremail = $touradmin->email;
                        $userAuth->managerphone = $touradmin->mobile;
                        $userAuth->startdate = str_replace(' ', ' at ', $actionData->start_date);
                        $userAuth->tourmember = ($actionData->senior + $actionData->adults + $actionData->children);
                        $userAuth->mailSubject = $request->mailSubject;
                        $userAuth->mailContent = $request->mailContent;

                        $userAuth->notify(new TourStatus());
                        //same email send to tour manager
                        $userAuth->email = $touradmin->email;
                        $userAuth->notify(new TourStatus());
                    }

                    //send email to tour manager
                    $userAuth->email = $touradmin->email;
                    $userAuth->tourName = $actionData->name;
                    $userAuth->tourStatus = 'Approved';

                    $userAuth->mailSubject = 'Tour Confirmed: '.$actionData->name;
                    $userAuth->mailContent = '<p>Dear ' . $touradmin->name . ':</p><p>Tour ' . $actionData->name . ' on ' . str_replace(' ', ' at ', $actionData->start_date) . ' has been confirmed. You are responsible for managing the tour.</p><p>The point of contact for this tour is ' . $actionData->contact_person['name'] . ' and can be reached at ' . $actionData->contact_person['mobile'] . ', or through email at ' . $actionData->contact_person['email'] . '.</p>';
                    
                    $userAuth->notify(new TourStatus());

                    //send email to all tour manager
                    $adminlist = Role::where('name', 'admin')->first()->users()->get();
                    foreach ($adminlist as $ta) {
                        $userAuth->email = $ta->email;
                        $userAuth->tourName = $actionData->name;
                        $userAuth->tourStatus = 'Approved';

                        $userAuth->mailSubject = 'Tour Confirmed: '.$actionData->name;
                        $userAuth->mailContent = '<p>Dear ' . $ta->name . ':</p><p>Tour ' . $actionData->name . ' on ' . str_replace(' ', ' at ', $actionData->start_date) . ' has been confirmed and ' . $touradmin->name . ' is the Tour Manager. Please reach out to ' . $touradmin->name . ' at ' . $touradmin->email . ' or ' . $touradmin->mobile . ' if you need details. ';//Their information is:</p> <p>Name: ' . $contactPerson->contactmanager->name . ',</p> <p>Phone: ' . $contactPerson->contactmanager->mobile . ',</p> <p>Email: ' . $contactPerson->contactmanager->email . '.</p>';
                        
                        $userAuth->notify(new TourStatus());
                    }
                    //send email to catering manager
                    for ($p = 0; $p < sizeof($mealSer); $p++) {
                        $mealserloc = Mealservicelocation::where('id', $mealSer[$p]['meal_service_location_id'])->first()->name;
                        $mealtype = Meal::where('id', $mealSer[$p]['meal_id'])->first()->name;
                        $mealsertype = Mealservicetype::where('id', $mealSer[$p]['meal_service_type_id'])->first()->name;
                        $cat_manager = User::where("id", $mealSer[$p]['catering_manager'])->first();
                        $userAuth->email = $cat_manager->email;
                        $userAuth->tourName = $actionData->name;
                        $userAuth->tourStatus = 'Approved';

                        $userAuth->mailSubject = 'Tour Confimed: '.$actionData->name;
                        $userAuth->mailContent = '<p>Dear ' . $cat_manager->name . ':</p><p>Tour ' . $actionData->name . ' on ' . str_replace(' ', ' at ', $actionData->start_date) . ' is confirmed.</p><p> The visitors need the following meals: </p><p><b>Meal Type:</b> '.$mealtype.'</p><p><b>Specific Item:</b> ' . $mealSer[$p]['specific_item'] . '</p><p><b>People:</b> ' . $mealSer[$p]['people'] . '</p><p><b>Meal Service:</b> ' . $mealsertype . '</p><p><b>Meal Location:</b> ' . $mealserloc . '</p>
                    <p>' . $touradmin->name . ' is handling this tour and if needed can be reached at ' . $touradmin->email . ' or ' . $touradmin->mobile . '</p>';
                        $userAuth->notify(new TourStatus());
                    }
                    //send email to meeting manager
                    for ($m = 0; $m < sizeof($meetingData); $m++) {
                        $met_manager = Meetingmanagement::where("id", $meetingData[$m]['meeting_id'])->first();

                        $userAuth->email = $met_manager->email;
                        $userAuth->tourName = $actionData->name;
                        $userAuth->tourStatus = 'Approved';

                        $userAuth->mailSubject = 'Meeting with '.$actionData->name;
                        $userAuth->mailContent = '<p>Dear ' . $met_manager->name . ':</p>
                    <p>' . $actionData->name . ' is coming for a tour on ' . str_replace(' ', ' at ', $actionData->start_date) . ' and will be meeting you at ' . $met_manager->meetingtime_hour . ':' . $met_manager->meetingtime_min . '
                    <p>' . $touradmin->name . ' is handling this tour and can be reach at ' . $touradmin->email . ' or ' . $touradmin->mobile . ' if you have any questions.</p>
                    <p>Please add this meeting to your calendar.</p>';
                        
                        $userAuth->notify(new TourStatus());
                    }

                    //send email to Reference
                    for ($r = 0; $r < sizeof($referenceData); $r++) {
                        $ref_manager = Refferencemanagement::where("id", $referenceData[$r]['refference_id'])->first();

                        $userAuth->email = $ref_manager->email;
                        $userAuth->tourName = $actionData->name;
                        $userAuth->tourStatus = 'Approved';

                        $userAuth->mailSubject = 'Tour Confirmed: '.$actionData->name;
                        $userAuth->mailContent = '<p>Dear ' . $ref_manager->name . ':</p><p>Tour ' . $actionData->name . ' on ' . str_replace(' ', ' at ', $actionData->start_date) . ' is confirmed for ' . $contactPerson->contactmanager->name . '.</p><p>Should you have any problems please contact <br>' . ucwords($touradmin->name) . '(' . $touradmin->mobile . ', ' . $touradmin->email . ')</p>';
    
                        $userAuth->notify(new TourStatus());
                    }
                    
                    return response()->json(['code' => Config::get('constants.SUCCESS'), 'success' => Lang::get('tours.resendconfirmed')], 200);
                } else if($request->action == 3) {
                    //send email to tour manager
                    $userAuth->email = $touradmin->email;
                    $userAuth->tourName = $actionData->name;
                    $userAuth->tourStatus = 'Cancelled';
                    $userAuth->mailSubject = 'Tour Cancelled: '.$actionData->name;
                    $userAuth->mailContent = '<p>Dear ' . $touradmin->name . ':</p><p> Tour ' . $actionData->name . ' on ' . str_replace(' ', ' at ', $actionData->start_date) . ' has been cancelled.</p><p>The contact person for this tour was ' . $contactPerson->contactmanager->name . ' and can be reached at ' . $contactPerson->contactmanager->mobile . ' or via email at ' . $contactPerson->contactmanager->email . '.</p>';
                    $userAuth->notify(new TourStatus());

                    //send email to all tour manager
                    $adminlist = Role::where('name', 'admin')->first()->users()->get();
                    foreach ($adminlist as $ta) {
                        $userAuth->email = $ta->email;
                        $userAuth->tourName = $actionData->name;
                        $userAuth->tourStatus = 'Cancelled';

                        $userAuth->mailSubject = 'Tour Cancelled: '.$actionData->name;
                        $userAuth->mailContent = '<p>Dear ' . $ta->name . ':</p><p>Tour ' . $actionData->name . ' on ' . str_replace(' ', ' at ', $actionData->start_date) . ' has been cancelled.</p><p>If you have any questions, Please reach out to ' . $touradmin->name . ' at ' . $touradmin->mobile . ' or email ' . $touradmin->email . '.</p>';

                        $userAuth->notify(new TourStatus());
                    }
                    if ($request->sendMail==1) {
                        // sedn email to the tour visitor
                        $userAuth->email = $actionData->contact_person['email'];
                        $userAuth->tourName = $actionData->name;
                        $userAuth->tourStatus = 'Cancelled';
                        $userAuth->visitorname = $actionData->contact_person['name'];
                        $userAuth->tourmanager = $touradmin->name;
                        $userAuth->manageremail = $touradmin->email;
                        $userAuth->managerphone = $touradmin->mobile;
                        $userAuth->startdate = $actionData->start_date;
                        $userAuth->mailSubject = $request->mailSubject;
                        $userAuth->mailContent = $request->mailContent;

                        $userAuth->notify(new TourStatus());
                        //same email send to tour manager
                        $userAuth->email = $touradmin->email;
                        $userAuth->notify(new TourStatus());
                    }

                    //send email to catering manager
                    for ($p = 0; $p < sizeof($mealSer); $p++) {
                        $cat_manager = User::where("id", $mealSer[$p]['catering_manager'])->first();
                        $userAuth->email = $cat_manager->email;
                        $userAuth->tourName = $actionData->name;
                        $userAuth->tourStatus = 'Cancelled';

                        $userAuth->mailSubject = 'Tour Cancelled: '.$actionData->name;
                        $userAuth->mailContent = '<p>Dear ' . $cat_manager->name . ':</p><p> Tour ' . $actionData->name . ' on ' . str_replace(' ', ' at ', $actionData->start_date) . ' has been cancelled.</p>';
                        
                        $userAuth->notify(new TourStatus());
                    }
                    //send email to meeting manager
                    for ($m = 0; $m < sizeof($meetingData); $m++) {
                        $met_manager = Meetingmanagement::where("id", $meetingData[$m]['meeting_id'])->first();

                        $userAuth->email = $met_manager->email;
                        $userAuth->tourName = $actionData->name;
                        $userAuth->tourStatus = 'Cancelled';

                        $userAuth->mailSubject = 'Tour Cancelled: '.$actionData->name;
                        $userAuth->mailContent = '<p>Dear ' . $met_manager->name . ':</p><p> Tour ' . $actionData->name . ' on ' . str_replace(' ', ' at ', $actionData->start_date) . ' has been cancelled.</p>';

                        $userAuth->notify(new TourStatus());
                    }

                    //send email to Reference
                    for ($r = 0; $r < sizeof($referenceData); $r++) {
                        $ref_manager = Refferencemanagement::where("id", $referenceData[$r]['refference_id'])->first();

                        $userAuth->email = $ref_manager->email;
                        $userAuth->tourName = $actionData->name;
                        $userAuth->tourStatus = 'Cancelled';

                        $userAuth->mailSubject = 'Tour Cancelled: '.$actionData->name;
                        $userAuth->mailContent = '<p>Dear ' . $ref_manager->name . ':</p><p> Tour ' . $actionData->name . ' on ' . str_replace(' ', ' at ', $actionData->start_date) . ' has been cancelled for ' . $actionData->contact_person['name'] . '.</p><p>Should you have any problems please contact <br>' . ucwords($touradmin->name) . '(' . $touradmin->mobile . ', ' . $touradmin->email . ')</p>';

                        $userAuth->notify(new TourStatus());
                    }
                    
                    return response()->json(['code' => Config::get('constants.SUCCESS'), 'success' => Lang::get('tours.resendcancel')], 200);
                } else if($request->action == 4) {
                    //send email to tour manager
                    $userAuth->email = $touradmin->email;
                    $userAuth->tourName = $actionData->name;
                    $userAuth->tourStatus = 'Completed';
                    $userAuth->mailSubject = 'Tour Completed: '.$actionData->name;
                    $userAuth->mailContent = '<p>Dear ' . $touradmin->name . ':</p><p> Tour ' . $actionData->name . ' on ' . str_replace(' ', ' at ', $actionData->start_date) . ' has been completed.</p><p>The contact for this tour is ' . $contactPerson->contactmanager->name . ' and can be reached at ' . $contactPerson->contactmanager->mobile . ' or ' . $contactPerson->contactmanager->email . '.</p>';
                    $userAuth->notify(new TourStatus());

                    //send email to all tour manager
                    $adminlist = Role::where('name', 'admin')->first()->users()->get();
                    foreach ($adminlist as $ta) {
                        $userAuth->email = $ta->email;
                        $userAuth->tourName = $actionData->name;
                        $userAuth->tourStatus = 'Completed';

                        $userAuth->mailSubject = 'Tour Completed: '.$actionData->name;
                        $userAuth->mailContent = '<p>Dear ' . $ta->name . ':</p><p> Tour ' . $actionData->name . ' on ' . str_replace(' ', ' at ', $actionData->start_date) . ' has been completed.</p><p>' . $touradmin->name . ' managed this tour and if you have questions, can be reached at ' . $touradmin->email . ' or ' . $touradmin->mobile . ' .</p>';
                        $userAuth->notify(new TourStatus());
                    }
                    //send email to catering manager
                    for ($p = 0; $p < sizeof($mealSer); $p++) {
                        $cat_manager = User::where("id", $mealSer[$p]['catering_manager'])->first();
                        $userAuth->email = $cat_manager->email;
                        $userAuth->tourName = $actionData->name;
                        $userAuth->tourStatus = 'Completed';

                        $userAuth->mailSubject = 'Tour Completed: '.$actionData->name;
                        $userAuth->mailContent = '<p>Dear ' . $cat_manager->name . ':</p><p> Tour ' . $actionData->name . ' on ' . str_replace(' ', ' at ', $actionData->start_date) . ' has been completed.</p>';

                        $userAuth->notify(new TourStatus());
                    }
                    //send email to meeting manager
                    for ($m = 0; $m < sizeof($meetingData); $m++) {
                        $met_manager = Meetingmanagement::where("id", $meetingData[$m]['meeting_id'])->first();

                        $userAuth->email = $met_manager->email;
                        $userAuth->tourName = $actionData->name;
                        $userAuth->tourStatus = 'Completed';

                        $userAuth->mailSubject = 'Tour Completed: '.$actionData->name;
                        $userAuth->mailContent = '<p>Dear ' . $met_manager->name . ':</p><p> Tour ' . $actionData->name . ' on ' . str_replace(' ', ' at ', $actionData->start_date) . ' has been completed.</p>';

                        $userAuth->notify(new TourStatus());
                    }

                    //send email to Reference
                    for ($r = 0; $r < sizeof($referenceData); $r++) {
                        $ref_manager = Refferencemanagement::where("id", $referenceData[$r]['refference_id'])->first();

                        $userAuth->email = $ref_manager->email;
                        $userAuth->tourName = $actionData->name;
                        $userAuth->tourStatus = 'Completed';

                        $userAuth->mailSubject = 'Tour Completed: '.$actionData->name;
                        $userAuth->mailContent = '<p>Dear ' . $ref_manager->name . ':</p><p> Tour ' . $actionData->name . ' on ' . str_replace(' ', ' at ', $actionData->start_date) . ' has been completed for ' . $contactPerson->contactmanager->name . '.</p><p>If you have any questions, please contact ' . ucwords($touradmin->name) . ' at ' . $touradmin->mobile . ' or ' . $touradmin->email . '.</p>';
                        $userAuth->notify(new TourStatus());
                    }
                    return response()->json(['code' => Config::get('constants.SUCCESS'), 'success' => Lang::get('tours.resendcomplete')], 200);
                }
                //end tour status condition
            } catch (\Exception $ex) {
                if ($ex instanceof QueryException) {
                    return response()->json(['code' => Config::get('constants.DUPLICATE'), 'error' => Lang::get('tours.duplicateentry')], 422);
                } else {
                    return response()->json(['code' => Config::get('constants.ERROR'), 'error' => Lang::get('tours.someproblems')], 422);
                }
            }
//        }
    } 

    /**
     * Store a tour task.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function addtask(Request $request) {
        $userAuth = JWTAuth::parseToken()->authenticate();
        try {
            $add = new Tourtask();
            $add->task = $request->task;
            $add->user_id = $request->user_id;
            $add->tourtype_id = $request->tourtype_id;
            $add->tour_id = $request->tour_id;
            $add->save();
            /* Send task notification */
            if ($request->user_id) {
                $dataValue = [
                    'user_id' => $userAuth->id,
                    'tour_id' => $request->tour_id,
                    'tourtask_id' => $add->id
                ];

                $replaceArray = [
                    'SenderName' => $userAuth->name,
                    'TourName' => $request->tour_name,
                ];

                $notificationMessage = trans('notification_template.assign_user_in_task', $replaceArray);
                $notificationData = [
                    'message' => $notificationMessage,
                    'notification_type' => 'tour',
                    'user_id' => $userAuth->id,
                    'receiver_id' => [$request->user_id],
                    'data' => json_encode($dataValue),
                ];
                sendNotification($notificationData);
		//snd email new tast
                $actionData = Tour::where("id", $request->tour_id)->with('tourVisitors')->first();
                    for ($i = 0; $i < sizeof($actionData['tourVisitors']); $i++) {
                        $getVisitor = Contactmanagement::where("id", $actionData['tourVisitors'][$i]['visitor_id'])->with('visitor')->withTrashed()->first();
                    }
//                    $visitor = User::where("id", $actionData->manager)->first();
                    $tour_manager = User::where("id", $actionData->manager)->first();
                    $taskuser = User::where("id", $request->user_id)->first();
                    $userAuth->email = $taskuser->email;
                    if($request->acknowledge > 0){
                        $userAuth->url = '';
                    } else {
                        $userAuth->url = $add->id;
                    }
                    $userAuth->start_date = $actionData->start_date;
                    $userAuth->tourname = $actionData->name;
                    $userAuth->username = $taskuser->name;
                    $userAuth->task = $request->task;
                    $userAuth->tourmanager = $tour_manager->name;
                    $userAuth->manageremail = $tour_manager->email;
                    $userAuth->managerphone = $tour_manager->mobile;
                    $userAuth->visitorname = $getVisitor->name;
                    $userAuth->mailSubject = 'New Task Assignement: ' . $actionData->name;
                    $userAuth->mailContent = '<p>Dear {username}:</p>
                        <p>You have been assigned task of  {taskname} for {tourname} on {startdate}.</p>
                        <p>Please review this tour on TMS.  If you are not available please reject the task in TMS.</p><br>
                        <p>If you have any question you can reach out to {tourmanager} who is managing this tour via email, {manageremail}, or  {managerphone}.</p>
                        <p>We look forward to your services.</p>
                        <p>Thank you.</p>';
//                    echo '<pre>';print_r($userAuth);die; 
                    $userAuth->notify(new Taskconfirmation());
            }

            /* Add in history table */
            if ($request->user_id != null || $request->user_id != '') {
                $message = $userAuth->name . ' has assigned task(' . $request->task . ') to ' . $request->user_name;
            } else {
                $message = $userAuth->name . ' has added ' . $request->task;
            }

            $addHistory = new Tourhistory();
            $addHistory->tour_id = $request->tour_id;
            $addHistory->activity = $message;
            $addHistory->save();

            return response()->json(['code' => Config::get('constants.SUCCESS'), 'success' => Lang::get('defaulttask.add'), 'data' => $add], 200);
        } catch (\Exception $ex) {
            if ($ex instanceof QueryException) {
                return response()->json(['code' => Config::get('constants.DUPLICATE'), 'error' => Lang::get('defaulttask.duplicateentry')], 422);
            } else {
                return response()->json(['code' => Config::get('constants.ERROR'), 'error' => Lang::get('defaulttask.someproblems')], 422);
            }
        }
    }

    /**
     * Update the tour task.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function updatetask(Request $request) {
        $userAuth = JWTAuth::parseToken()->authenticate();
        $update = $old_details = Tourtask::find($request->id);
//        print_r($request->task);
//        print_r($old_details->task);
//        die;
        if(null !== $old_details->user_id) { 
            $flag = true;
            $oldtaskuser = User::where("id", $old_details->user_id)->first();
            $olduseremail = $oldtaskuser->email; 
            $oldusername  = $oldtaskuser->name;
            $oldtask  = $oldtaskuser->task;
        } else { $flag = false;}
        
        $ack_status = $update->acknowledge;
        $userId = $update->user_id;
        if (empty($update)) {
            return response()->json(['code' => Config::get('constants.NO_DATA_FOUND'), 'error' => Lang::get('defaulttask.notfind')], 422);
        }

        try {
            if ($userId != $request->user_id) {
                $update->acknowledge = 0;
            }
            if($request->acknowledge) {
                $update->acknowledge = $request->acknowledge;
            }

            $update->user_id = $request->user_id;
            $update->task = $request->task;
//            echo '<pre>';print_r($update);die;
            $update->save();

            // Send task notification
            if ($request->user_id) {
                
                if ($userId != $request->user_id) {
                    $dataValue = [
                        'user_id' => $userAuth->id,
                        'tour_id' => $update->tour_id,
                        'tourtask_id' => $update->id
                    ];

                    $replaceArray = [
                        'SenderName' => $userAuth->name,
                        'TourName' => $request->tour_name,
                    ];

                    $notificationMessage = trans('notification_template.assign_user_in_task', $replaceArray);
                    $notificationData = [
                        'message' => $notificationMessage,
                        'notification_type' => 'tour',
                        'user_id' => $userAuth->id,
                        'receiver_id' => [$request->user_id],
                        'data' => json_encode($dataValue),
                    ];
                    sendNotification($notificationData);
                   //send email notification to the assigned task user
                    $actionData = Tour::where("id", $update->tour_id)->with('tourVisitors')->first();
                    for ($i = 0; $i < sizeof($actionData['tourVisitors']); $i++) {
                        $getVisitor = Contactmanagement::where("id", $actionData['tourVisitors'][$i]['visitor_id'])->with('visitor')->withTrashed()->first();
                    }
//                    $visitor = User::where("id", $actionData->manager)->first();
                    $tour_manager = User::where("id", $actionData->manager)->first();
                    $taskuser = User::where("id", $request->user_id)->first();
                    $userAuth->email = $taskuser->email;
                    if($request->acknowledge > 0){
                        $userAuth->url = '';
                    } else {
                        $userAuth->url = $update->id;
                    }
                    $userAuth->start_date = $actionData->start_date;
                    $userAuth->tourname = $actionData->name;
                    $userAuth->username = $taskuser->name;
                    $userAuth->task = $update->task;
                    $userAuth->tourmanager = $tour_manager->name;
                    $userAuth->manageremail = $tour_manager->email;
                    $userAuth->managerphone = $tour_manager->mobile;
                    $userAuth->visitorname = $getVisitor->name;
                    $userAuth->mailSubject = 'New Task Assignement: ' . $actionData->name;
                    $userAuth->mailContent = '<p>Dear {username}:</p>
                        <p>You have been assigned task of  {taskname} for {tourname} on {startdate}.</p>
                        <p>Please review this tour on TMS.  If you are not available please reject the task in TMS.</p><br>
                        <p>If you have any question you can reach out to {tourmanager} who is managing this tour via email, {manageremail}, or  {managerphone}.</p>
                        <p>We look forward to your services.</p>
                        <p>Thank you.</p>';
                    $userAuth->notify(new Taskconfirmation());
                    if($flag ==TRUE) {                        
                        //send email to task cancelled user
                        $userAuth->email = $olduseremail;
                        
                        $userAuth->url = '';
                        $userAuth->start_date = $actionData->start_date;
                        $userAuth->tourname = $actionData->name;
                        $userAuth->username = $oldusername;
                        $userAuth->task = $update->task; 
                        $userAuth->tourmanager = $tour_manager->name;
                        $userAuth->manageremail = $tour_manager->email;
                        $userAuth->managerphone = $tour_manager->mobile;
                        $userAuth->visitorname = $getVisitor->name;
                        $userAuth->mailSubject = 'Task Cancelled';
                        $userAuth->mailContent = '<p>Dear {username}:</p> 
                            <p>The {tourname} on {startdate} is cancelled.Your task of {taskname} has been cancelled</p>
                            <p>You can contact {tourmanager} at {managerphone} or through email at {manageremail} for more information.</p>
                            <p>Looking forward to your continued service and support. </p>';

                        $userAuth->notify(new Taskconfirmation());
                        $flag = false;
                    }
                }
                if($flag == TRUE && $request->task != $oldtask){
                    //send email notification to the assigned task user
                    $actionData = Tour::where("id", $update->tour_id)->with('tourVisitors')->first();
                    for ($i = 0; $i < sizeof($actionData['tourVisitors']); $i++) {
                        $getVisitor = Contactmanagement::where("id", $actionData['tourVisitors'][$i]['visitor_id'])->with('visitor')->withTrashed()->first();
                    }
//                    $visitor = User::where("id", $actionData->manager)->first();
                    $tour_manager = User::where("id", $actionData->manager)->first();
                    $taskuser = User::where("id", $request->user_id)->first();
                    $userAuth->email = $taskuser->email;
                    if($request->acknowledge > 0){
                        $userAuth->url = '';
                    } else {
                        $userAuth->url = $update->id;
                    }
                    $userAuth->start_date = $actionData->start_date;
                    $userAuth->tourname = $actionData->name;
                    $userAuth->username = $taskuser->name;
                    $userAuth->task = $update->task;
                    $userAuth->tourmanager = $tour_manager->name;
                    $userAuth->manageremail = $tour_manager->email;
                    $userAuth->managerphone = $tour_manager->mobile;
                    $userAuth->visitorname = $getVisitor->name;
                    $userAuth->mailSubject = 'New Task Assignment' . $actionData->name;
                    $userAuth->mailContent ='<p>Dear {username}:</p>
                        <p>You have been assigned task of  {taskname} for {tourname} on {startdate}.</p>
                        <p>Please review this tour on TMS.  If you are not available please reject the task in TMS.</p><br>
                        <p>If you have any question you can reach out to {tourmanager} who is managing this tour via email, {manageremail}, or  {managerphone}.</p>
                        <p>We look forward to your services.</p>
                        <p>Thank you.</p>';
 
//                    echo '<pre>';print_r($userAuth);die; 
                    $userAuth->notify(new Taskconfirmation());
                }
            }
            // Sent email to manager if the task is accept/reject
            if($request->acknowledge){
                if ($ack_status != $request->acknowledge) {
                    $actionData = Tour::where("id", $update->tour_id)->with('tourVisitors')->first();
                    if($request->acknowledge == 1) { $t_status = 'Confirmed';} else if($request->acknowledge == 2) { $t_status = 'Rejected';} else { $t_status = '';}
                    $tour_manager = User::where("id", $actionData->manager)->first();
                    $taskuser = User::where("id", $request->user_id)->first();
                    $userAuth->email = $tour_manager->email;
                    
                    $userAuth->start_date = $actionData->start_date;
                    $userAuth->tourname = $actionData->name;
                    $userAuth->username = $tour_manager->name;
                    $userAuth->task = $update->task;
                    $userAuth->mailSubject = 'Tour Task '.$t_status;
                    $userAuth->mailContent = '<p>Dear {username}:</p>
                        <p>'.$taskuser->name.' has '.$t_status.'  {taskname} task for  {tourname} on {startdate} due to a conflict. If needed please login into TMS view changes.</p>
                        <p>If you need to reach out to '.$taskuser->name.' here is the contact information :</p><p>Phone: '.$taskuser->mobile.', Email: '.$taskuser->email.'</p>';
                    $userAuth->notify(new Taskconfirmation());
                }
            }
            /* Add in history table */
            if ($request->user_id != null || $request->user_id != '') {
                $message = $userAuth->name . ' has assigned task(' . $request->task . ') to ' . $request->user_name;
            } else {
                $message = $userAuth->name . ' has updated ' . $request->task;
            }

            $addHistory = new Tourhistory();
            $addHistory->tour_id = $update->tour_id;
            $addHistory->activity = $message;
            $addHistory->save();

            return response()->json(['code' => Config::get('constants.SUCCESS'), 'success' => Lang::get('defaulttask.update')], 200);
        } catch (\Exception $ex) {
            if ($ex instanceof QueryException) {
                return response()->json(['code' => Config::get('constants.DUPLICATE'), 'error' => Lang::get('defaulttask.duplicateentry')], 422);
            } else {
                return response()->json(['code' => Config::get('constants.ERROR'), 'error' => Lang::get('defaulttask.someproblems')], 422);
            }
        }
    }

    /**
     * Remove the specified task in tour.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function deletetask(Request $request) {
        $userAuth = JWTAuth::parseToken()->authenticate();

        $deleteTask = Tourtask::find($request->id);
//        $tour = Tour::find($deleteTask->tour_id);
        $actionData = Tour::where("id", $deleteTask->tour_id)->with('tourVisitors')->first();
        $tour_manager = User::where("id", $actionData->manager)->first();
        //send email to task assinged user
        if(null !== $deleteTask->user_id) { 
            $flag = true;
            $oldtaskuser = User::where("id", $deleteTask->user_id)->first();
            $olduseremail = $oldtaskuser->email; 
            $oldusername  = $oldtaskuser->name;
        } else { $flag = false;}
        if($flag ==TRUE) {                        
            
            $userAuth->email = $olduseremail;

            $userAuth->start_date = $actionData->start_date;
            $userAuth->tourname = $actionData->name;
            $userAuth->username = $oldusername;
            $userAuth->task = $deleteTask->task;
            $userAuth->tourmanager = $tour_manager->name;
            $userAuth->manageremail = $tour_manager->email;
            $userAuth->managerphone = $tour_manager->mobile;
            $userAuth->mailSubject = 'Task Deleted';
            $userAuth->mailContent = '<p>Dear {username}:</p>
                <p>The {tourname} tour on {startdate} is {tourstatus}.Your {taskname} has been cancelled.</p>
                <p>You can contact {tourmanager} at {managerphone} or at {manageremail} for more information.</p>
                <p>Looking forward to your continued service and support.</p>';

            $userAuth->notify(new Taskconfirmation());
        }
        //send email to manager
            $userAuth->email = $tour_manager->email;

            $userAuth->start_date = $actionData->start_date;
            $userAuth->tourname = $actionData->name;
            $userAuth->username = $tour_manager->name;
            $userAuth->task = $deleteTask->task;
            $userAuth->tourmanager = $tour_manager->name;
            $userAuth->manageremail = $tour_manager->email;
            $userAuth->managerphone = $tour_manager->mobile;
            $userAuth->mailSubject = 'Task Deleted';
            $userAuth->mailContent = '<p>Dear {username},</p>
                <p>The Tour {tourname} on {startdate} is confirmed. But task: {taskname} is cancelled.</p>
                <p>Your contact for this tour is : {tourmanager}, {managerphone}, {manageremail} </p>
                <p>Thanks.</p>';

            $userAuth->notify(new Taskconfirmation());
        
        /* Add in history table */
        $message = $userAuth->name . ' has deleted task(' . $deleteTask->task . ')';
        $addHistory = new Tourhistory();
        $addHistory->tour_id = $deleteTask->tour_id;
        $addHistory->activity = $message;
        $addHistory->save();

        $deleteTask->delete();
        return response()->json(['code' => Config::get('constants.SUCCESS'), 'success' => Lang::get('defaulttask.delete')], 200);
    }

    /**
     * Get all organization when already used for add tour auto succession .
     *
     * @return \Illuminate\Http\Response
     */
    public function affiliate() {
        $affiliateData = Contactmanagement::groupBy('contactmanagements.affiliate')->get(['affiliate']);
        return response()->json(['data' => $affiliateData], 200);
    }
    public function organization() {
        $organizationData = Tour::groupBy('tours.organization')->get(['organization']);
        return response()->json(['data' => $organizationData], 200);
    }

    public function actionTask(Request $request) {
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

            if ($request->status == 1) {
                $notificationMessage = trans('notification_template.accept_task_request', $replaceArray);
                $message = 'tours.accept_task';
                $action = 'accepted';
            } else {
                $notificationMessage = trans('notification_template.reject_task_request', $replaceArray);
                $message = 'tours.reject_task';
                $action = 'rejected';
            }

            $notificationData = [
                'message' => $notificationMessage,
                'notification_type' => 'tour',
                'user_id' => $userAuth->id,
                'receiver_id' => [$tourData->created_by, $tourData->manager],
                'data' => json_encode($dataValue),
            ];
            sendNotification($notificationData);

            /* Add in history table */
            $message = $request->task_name . ' has been ' . $action . ' by ' . $userAuth->name;
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

    /**
     * Feedback form data 
     *
     * @return \Illuminate\Http\Response
     */
    public function feedback($id) {
        $fId = substr($id, 0, -8);

        $actionData = Tourfeedbacks::where("tour_id", $fId)->first();
        return response()->json(['code' => Config::get('constants.SUCCESS'), 'data' => $actionData], 200);
    }

    /**
     * Feedback form data 
     *
     * @return \Illuminate\Http\Response
     */
    public function addFeedback(Request $request) {
        $fId = substr($request->id, 0, -8);
        $actionData = Tourfeedbacks::where("tour_id", $fId)->first();
        if ($actionData) {
            return response()->json(['code' => Config::get('constants.DUPLICATE'), 'error' => Lang::get('tours.duplicatefeedback')], 422);
        }

        try {
            $addFeedback = new Tourfeedbacks();
            $addFeedback->tour_id = $fId;
            $addFeedback->rating = $request->rating;
            $addFeedback->comment = $request->comment;
            $addFeedback->save();

            return response()->json(['code' => Config::get('constants.SUCCESS'), 'success' => Lang::get('tours.feedback')], 200);
        } catch (\Exception $ex) {
            if ($ex instanceof QueryException) {
                return response()->json(['code' => Config::get('constants.DUPLICATE'), 'error' => Lang::get('tours.duplicateentry')], 422);
            } else {
                return response()->json(['code' => Config::get('constants.ERROR'), 'error' => Lang::get('tours.someproblems')], 422);
            }
        }
    }

    /**
     * Edit Document in tour
     *
     * @return \Illuminate\Http\Response
     */
    public function tour_document(Request $request) {
        $userAuth = JWTAuth::parseToken()->authenticate();
        if (isset($request->id)) {
            $addLink = Documentlink::where('id', $request->id)->first();
            if (empty($addLink)) {
                return response()->json(['code' => Config::get('constants.NO_DATA_FOUND'), 'error' => Lang::get('tours.notfind_doc')], 422);
            }

            try {
                $addLink->tour_id = $request->tour_id;
                $addLink->title = $request->title;
                $addLink->link = $request->link;
                $addLink->save();

                return response()->json(['code' => Config::get('constants.SUCCESS'), 'success' => Lang::get('tours.update_doc'), 'data' => $addLink], 200);
            } catch (\Exception $ex) {
                if ($ex instanceof QueryException) {
                    return response()->json(['code' => Config::get('constants.DUPLICATE'), 'error' => Lang::get('tours.duplicateentry')], 422);
                } else {
                    return response()->json(['code' => Config::get('constants.ERROR'), 'error' => Lang::get('tours.someproblems')], 422);
                }
            }
        } else {
            try {
                $addLink = new Documentlink();
                $addLink->tour_id = $request->tour_id;
                $addLink->title = $request->title;
                $addLink->link = $request->link;
                $addLink->save();

                return response()->json(['code' => Config::get('constants.SUCCESS'), 'success' => Lang::get('tours.add_doc'), 'data' => $addLink], 200);
            } catch (\Exception $ex) {
                if ($ex instanceof QueryException) {
                    return response()->json(['code' => Config::get('constants.DUPLICATE'), 'error' => Lang::get('tours.duplicateentry')], 422);
                } else {
                    return response()->json(['code' => Config::get('constants.ERROR'), 'error' => Lang::get('tours.someproblems')], 422);
                }
            }
        }
    }

    /**
     * Edit Notes in tour
     *
     * @return \Illuminate\Http\Response
     */
    public function tour_notes(Request $request) {
        $userAuth = JWTAuth::parseToken()->authenticate();
        if (isset($request->id)) {
            $addNote = Tournote::where('id', $request->id)->first();
            if (empty($addNote)) {
                return response()->json(['code' => Config::get('constants.NO_DATA_FOUND'), 'error' => Lang::get('tours.notfind_note')], 422);
            }

            try {
                $addNote->tour_id = $request->tour_id;
                $addNote->note = $request->note;
                $addNote->save();

                return response()->json(['code' => Config::get('constants.SUCCESS'), 'success' => Lang::get('tours.update_note'), 'data' => $addNote], 200);
            } catch (\Exception $ex) {
                if ($ex instanceof QueryException) {
                    return response()->json(['code' => Config::get('constants.DUPLICATE'), 'error' => Lang::get('tours.duplicateentry')], 422);
                } else {
                    return response()->json(['code' => Config::get('constants.ERROR'), 'error' => Lang::get('tours.someproblems')], 422);
                }
            }
        } else {
            try {
                $addNote = new Tournote();
                $addNote->tour_id = $request->tour_id;
                $addNote->note = $request->note;
                $addNote->save();

                return response()->json(['code' => Config::get('constants.SUCCESS'), 'success' => Lang::get('tours.add_note'), 'data' => $addNote], 200);
            } catch (\Exception $ex) {
                if ($ex instanceof QueryException) {
                    return response()->json(['code' => Config::get('constants.DUPLICATE'), 'error' => Lang::get('tours.duplicateentry')], 422);
                } else {
                    return response()->json(['code' => Config::get('constants.ERROR'), 'error' => Lang::get('tours.someproblems')], 422);
                }
            }
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function delete_document(Request $request) {
        $deleteDoc = Documentlink::where(['id' => $request->id]);
        $deleteDoc->delete();
        return response()->json(['code' => Config::get('constants.SUCCESS'), 'success' => Lang::get('tours.delete_doc')], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function notes_delete(Request $request) {
        $deleteDoc = Tournote::where(['id' => $request->id]);
        $deleteDoc->delete();
        return response()->json(['code' => Config::get('constants.SUCCESS'), 'success' => Lang::get('tours.delete_note')], 200);
    }

    /**
     * Tour Cron:
     * If past date tour will change status completed or rejected
     * if tour is pending then status is rejected.
     * if tour is acknowledge and approved then status is completed
     * Everyday run at 12:05 AM
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function tourCron(Request $request) {
        /** Current date */
        $currentDay = Carbon::today()->toDateString();
        $yesterDay = date("Y-m-d", strtotime("-1 days"));
        $status = [0, 1, 2];
        $listData = Tour::whereDate('start_date', '<=', $yesterDay)->whereIn('status', $status)->get();
        /* 0 = pending, 1 = Acknowledge, 2 = Approved, 3 = Rejected, 4 = Completed */
        for ($i = 0; $i < sizeof($listData); $i++) {
            if ($listData[$i]['status'] == 0) {
                $update = Tour::find($listData[$i]['id']);
                $update->status = 3;
                $update->save();
            } else {
                $update = Tour::find($listData[$i]['id']);
                $update->status = 4;
                $update->save();
            }
        }
        echo "<script type='text/javascript'>window.setTimeout(CloseMe, 45000);function CloseMe() {window.open('','_self','');window.close();}</script>";
        /* return response()->json(['data' => $listData], 200); */
    }

    /**
     * Tour Notification Cron:
     * Send notification/remainder for upcoming tour
     * Send 1 day ago notification/remainder
     * Send 1 week ago notification/remainder
     * Everyday run  at 12:15 AM
     */
    public function tourNotificationCron() {
        //$userAuth = JWTAuth::parseToken()->authenticate();
        $userAuth =new User();  
        /** Current date */
        $currentDay = Carbon::today()->toDateString();
        $tomorrow = date("Y-m-d", strtotime("+1 days"));
        $week = date("Y-m-d", strtotime("+7 days"));
        /* Send mail to contact manager and send notification to all related user */
        $tomorrowData = Tour::whereDate('start_date', '=', $tomorrow)->where('status', 2)->with('tourVisitors')->get();
        for ($i = 0; $i < sizeof($tomorrowData); $i++) {
            /* Send email to contact manager */
            for ($t = 0; $t < sizeof($tomorrowData[$i]['tourVisitors']); $t++) {
                if ($tomorrowData[$i]['tourVisitors'][$t]['is_tour_admin'] == 1) {
                    $getVisitor = Contactmanagement::where("id", $tomorrowData[$i]['tourVisitors'][$t]['visitor_id'])->first();
                    $tomorrowData['contact_person'] = $getVisitor;
                }
            }
            $mealSer = Tourmealservice::where('tour_id', $tomorrowData[$i]['id'])->get();
            $meetingData = Tourmeeting::where('tour_id', $tomorrowData[$i]['id'])->get();
            $referenceData = Tourrefference::where('tour_id', $tomorrowData[$i]['id'])->get();
            $touradmin = User::where("id", $tomorrowData[$i]['manager'])->first();
            
            $userAuth->tourName =  $tomorrowData[$i]['name'];
            $userAuth->email = $tomorrowData['contact_person']->email;
            $userAuth->name = $tomorrowData['contact_person']->name;
            $userAuth->start_date = $tomorrow;
            $userAuth->remainder_for = 'tomorrow';
            
            $userAuth->notify(new TourRemainder());
            //send email to tour manager
                $userAuth->email = $touradmin->email;
                $userAuth->name = $touradmin->name;
                $userAuth->start_date = $tomorrow;
                $userAuth->remainder_for = 'tomorrow';
                $userAuth->notify(new TourRemainder());

                //send email to all tour manager
                $adminlist = Role::where('name', 'admin')->first()->users()->get();
                foreach ($adminlist as $ta) {
                        $userAuth->email = $ta->email;
                        $userAuth->name = $ta->name;
                        $userAuth->start_date = $tomorrow;
                        $userAuth->remainder_for = 'tomorrow';
                        $userAuth->notify(new TourRemainder());
                }
                //send email to catering manager
                for ($p = 0; $p < sizeof($mealSer); $p++) {
                    $cat_manager = User::where("id", $mealSer[$p]['catering_manager'])->first();
                    $userAuth->email = $cat_manager->email;
                    $userAuth->name = $cat_manager->name;
                    $userAuth->start_date = $tomorrow;
                    $userAuth->remainder_for = 'tomorrow';
                    $userAuth->notify(new TourRemainder());
                }
                //send email to meeting manager
                for ($m = 0; $m < sizeof($meetingData); $m++) {
                    $met_manager = Meetingmanagement::where("id", $meetingData[$m]['meeting_id'])->first();

                    $userAuth->email = $met_manager->email;
                        $userAuth->name = $met_manager->name;
                        $userAuth->start_date = $tomorrow;
                        $userAuth->remainder_for = 'tomorrow';
                        $userAuth->notify(new TourRemainder());
                }

                //send email to Reference
                for ($r = 0; $r < sizeof($referenceData); $r++) {
                    $ref_manager = Refferencemanagement::where("id", $referenceData[$r]['refference_id'])->first();

                    $userAuth->email = $ref_manager->email;
                        $userAuth->name = $ref_manager->name;
                        $userAuth->start_date = $tomorrow;
                        $userAuth->remainder_for = 'tomorrow';
                        $userAuth->notify(new TourRemainder());
                }
            echo 'Successfully send email for next week tours';
            die;
        }
        //end 1 day prior email notification
    }
    //send email notification before a week
    public function tourNotificationCronweek() {
        $userAuth =new User();  
        /** Current date */
        $week = date("Y-m-d", strtotime("+7 days"));
        //start 1 week prior email notification
        $weekData = Tour::whereDate('start_date', '=', $week)->where('status', 2)->with('tourVisitors')->get();
        for ($i = 0; $i < sizeof($weekData); $i++) {
            /* Send email to contact manager */
            for ($t = 0; $t < sizeof($weekData[$i]['tourVisitors']); $t++) {
                if ($weekData[$i]['tourVisitors'][$t]['is_tour_admin'] == 1) {
                    $getVisitor = Contactmanagement::where("id", $weekData[$i]['tourVisitors'][$t]['visitor_id'])->first();
                    $weekData['contact_person'] = $getVisitor; 
                }
            }
            $mealSer = Tourmealservice::where('tour_id', $weekData[$i]['id'])->get();
            $meetingData = Tourmeeting::where('tour_id', $weekData[$i]['id'])->get();
            $referenceData = Tourrefference::where('tour_id', $weekData[$i]['id'])->get();
            $touradmin = User::where("id", $weekData[$i]['manager'])->first();
            
            $userAuth->tourName =  $weekData[$i]['name'];
            $userAuth->name = $weekData['contact_person']->name;            
            $userAuth->email = $weekData['contact_person']->email;
            $userAuth->start_date = $week;
            $userAuth->remainder_for = 'week';
            $userAuth->notify(new TourRemainder());
            
            //send email to tour manager
                $userAuth->email = $touradmin->email;
                $userAuth->name = $touradmin->name;
                $userAuth->start_date = $week;
                $userAuth->remainder_for = 'week';
                $userAuth->notify(new TourRemainder());

                //send email to all tour manager
                $adminlist = Role::where('name', 'admin')->first()->users()->get();
                foreach ($adminlist as $ta) {
                        $userAuth->email = $ta->email;
                        $userAuth->name = $ta->name;
                        $userAuth->start_date = $week;
                        $userAuth->remainder_for = 'week';
                        $userAuth->notify(new TourRemainder());
                }
                //send email to catering manager
                for ($p = 0; $p < sizeof($mealSer); $p++) {
                    $cat_manager = User::where("id", $mealSer[$p]['catering_manager'])->first();
                    $userAuth->email = $cat_manager->email;
                    $userAuth->name = $cat_manager->name;
                    $userAuth->start_date = $week;
                    $userAuth->remainder_for = 'week';
                    $userAuth->notify(new TourRemainder());
                }
                //send email to meeting manager
                for ($m = 0; $m < sizeof($meetingData); $m++) {
                    $met_manager = Meetingmanagement::where("id", $meetingData[$m]['meeting_id'])->first();

                    $userAuth->email = $met_manager->email;
                        $userAuth->name = $met_manager->name;
                        $userAuth->start_date = $week;
                        $userAuth->remainder_for = 'week';
                        $userAuth->notify(new TourRemainder());
                }

                //send email to Reference
                for ($r = 0; $r < sizeof($referenceData); $r++) {
                    $ref_manager = Refferencemanagement::where("id", $referenceData[$r]['refference_id'])->first();

                    $userAuth->email = $ref_manager->email;
                        $userAuth->name = $ref_manager->name;
                        $userAuth->start_date = $week;
                        $userAuth->remainder_for = 'week';
                        $userAuth->notify(new TourRemainder());
                }
            echo 'Successfully send email for next week tours';
            die;
        }
        
    }

    //notification before 1 hour
    public function tourNotificationBeforeHour() {
        $userAuth =new User();  
        $curtime = date('Y-m-d H:i:s', strtotime('60 minute'));
        $beforehour = date('Y-m-d H:i:s', strtotime('70 minute'));
        $beforehourData = Tour::whereDate('start_date', 'BETWEEN', $curtime . ' AND ' . $beforehour)->where('status', 2)->with('tourVisitors')->get();

        for ($i = 0; $i < sizeof($beforehourData); $i++) {
            /* Send email to contact manager */
            for ($t = 0; $t < sizeof($beforehourData[$i]['tourVisitors']); $t++) {
                if ($beforehourData[$i]['tourVisitors'][$t]['is_tour_admin'] == 1) {
                    $getVisitor = Contactmanagement::where("id", $beforehourData[$i]['tourVisitors'][$t]['visitor_id'])->first();
                    $beforehourData['contact_person'] = $getVisitor;
                }
            }
            $mealSer = Tourmealservice::where('tour_id', $beforehourData[$i]['id'])->get();
            $meetingData = Tourmeeting::where('tour_id', $beforehourData[$i]['id'])->get();
            $referenceData = Tourrefference::where('tour_id', $beforehourData[$i]['id'])->get();
            $touradmin = User::where("id", $beforehourData[$i]['manager'])->first();
            
            $userAuth->tourName =  $beforehourData[$i]['name'];
            $userAuth->name = $beforehourData['contact_person']->name;
            $userAuth->email = $beforehourData['contact_person']->email;
            $userAuth->start_date = $curtime;
            $userAuth->remainder_for = 'beforehour'; 
            $userAuth->notify(new TourRemainder());
            
            //send email to tour manager
                $userAuth->email = $touradmin->email;
                $userAuth->name = $touradmin->name;
                $userAuth->start_date = $tomorrow;
                $userAuth->remainder_for = 'beforehour';
                $userAuth->notify(new TourRemainder());

                //send email to all tour manager
                $adminlist = Role::where('name', 'admin')->first()->users()->get();
                foreach ($adminlist as $ta) {
                        $userAuth->email = $ta->email;
                        $userAuth->name = $ta->name;
                        $userAuth->start_date = $curtime;
                        $userAuth->remainder_for = 'beforehour';
                        $userAuth->notify(new TourRemainder());
                }
                //send email to catering manager
                for ($p = 0; $p < sizeof($mealSer); $p++) {
                    $cat_manager = User::where("id", $mealSer[$p]['catering_manager'])->first();
                    $userAuth->email = $cat_manager->email;
                    $userAuth->name = $cat_manager->name;
                    $userAuth->start_date = $curtime;
                    $userAuth->remainder_for = 'beforehour';
                    $userAuth->notify(new TourRemainder());
                }
                //send email to meeting manager
                for ($m = 0; $m < sizeof($meetingData); $m++) {
                    $met_manager = Meetingmanagement::where("id", $meetingData[$m]['meeting_id'])->first();

                    $userAuth->email = $met_manager->email;
                        $userAuth->name = $met_manager->name;
                        $userAuth->start_date = $curtime;
                        $userAuth->remainder_for = 'beforehour';
                        $userAuth->notify(new TourRemainder());
                }

                //send email to Reference
                for ($r = 0; $r < sizeof($referenceData); $r++) {
                    $ref_manager = Refferencemanagement::where("id", $referenceData[$r]['refference_id'])->first();

                    $userAuth->email = $ref_manager->email;
                        $userAuth->name = $ref_manager->name;
                        $userAuth->start_date = $curtime;
                        $userAuth->remainder_for = 'beforehour';
                        $userAuth->notify(new TourRemainder());
                }
            echo 'Successfully send email for next hour tours';
            die;
        }
        
    }

    /**
     * Delete past date tour cron
     * Everyday run at 12:30 AM
     */
    public function pastTourSoftDelete(Request $request) {
        /** Current date */
        $currentDay = Carbon::today()->toDateString();
        $dayBeforeYesterday = date("Y-m-d", strtotime("-2 days"));
        $listData = Tour::whereDate('start_date', '<=', $dayBeforeYesterday)->get();

        $tourIds = array();
        for ($i = 0; $i < sizeof($listData); $i++) {
            array_push($tourIds, $listData[$i]['id']);
        }

        if ($tourIds) {
            Tour::whereIn('id', $tourIds)->delete();
        }
        echo "<script type='text/javascript'>window.setTimeout(CloseMe, 45000);function CloseMe() {window.open('','_self','');window.close();}</script>";
    }
    
    public function getTask($id) {
        $taskData = Tourtask::find($id);
        $tourData = Tour::where("id", $taskData->tour_id)->with('tourManager')->first(); 
//        echo '<pre>';print_r($taskData);die;
        return response()->json(['data' => $taskData,'tourdata'=>$tourData], 200);
    }
    //updatetask as approved or reject
    public function getTaskUpdate(Request $request) {
        $update = Tourtask::find($request->id);
        if (empty($update)) {
            return response()->json(['code' => Config::get('constants.NO_DATA_FOUND'), 'error' => Lang::get('defaulttask.notfind')], 422);
        }
        try {
            $update->acknowledge = $request->approved_status; 
            $update->save();
            // Send task notification
            // Sent email to manager if the task is accept/reject 
            if($request->approved_status){
                    $actionData = Tour::where("id", $update->tour_id)->with('tourVisitors')->first();
                    
                    if($request->approved_status == 1) { $t_status = 'Confirmed';} else if($request->approved_status == 2) { $t_status = 'Rejected';} else { $t_status = '';}
                    $tour_manager = User::where("id", $actionData->manager)->first();
                    
                    $taskuser = User::where("id", $update->user_id)->first();
                    $userAuth =new User();
                    $userAuth->email = $tour_manager->email;
                    
                    $userAuth->start_date = $actionData->start_date;
                    $userAuth->tourname = $actionData->name;
                    $userAuth->username = $tour_manager->name;
                    $userAuth->task = $update->task;
                    $userAuth->mailSubject = 'Tour Task '.$t_status;
                    $userAuth->mailContent = '<p>Dear {username}:</p>
                        <p>'.$taskuser->name.' has '.$t_status.'  {taskname} task for  {tourname} on {startdate} due to a conflict. If needed please login into TMS view changes.</p>
                        <p>If you need to reach out to '.$taskuser->name.' here is the contact information :</p><p>Phone: '.$taskuser->mobile.', Email: '.$taskuser->email.'</p>';
                    $userAuth->notify(new Taskconfirmation());
            }
            /* Add in history table */
            $message = $taskuser->name . ' has updated ' . $update->task;

            $addHistory = new Tourhistory();
            $addHistory->tour_id = $update->tour_id;
            $addHistory->activity = $message;
            $addHistory->save();

            return response()->json(['code' => Config::get('constants.SUCCESS'), 'success' => Lang::get('defaulttask.update')], 200);
        } catch (\Exception $ex) {
            if ($ex instanceof QueryException) {
                return response()->json(['code' => Config::get('constants.DUPLICATE'), 'error' => Lang::get('defaulttask.duplicateentry')], 422);
            } else {
                return response()->json(['code' => Config::get('constants.ERROR'), 'error' => Lang::get('defaulttask.someproblems')], 422);
            }
        }
    }
    
    /**
     * Store a tour meeting.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function addmeeting(Request $request) {
        $userAuth = JWTAuth::parseToken()->authenticate();
        $actionData = Tour::where("id", $request->tour_id)->with('tourVisitors')->first();
        $tour_manager = User::where("id", $actionData->manager)->first();
        try {
            if ($request->email == $userAuth->email) {
                $isTourAdmin = 1;
            } else {
                $isTourAdmin = 0;
            } 
            $addMeetingUser = $this->saveMeeting($request);
            $addMeeting = new Tourmeeting();
            $addMeeting->tour_id = $request->tour_id;
            $addMeeting->meeting_id = $addMeetingUser->id;
            $addMeeting->is_tour_admin = $isTourAdmin;
            $addMeeting->save();
            //send email to meeting user
            $userAuth->email = $request->email;
            $userAuth->tourName = $actionData->name;
            $userAuth->tourStatus = 'Approved';

            $userAuth->mailSubject = 'Meeting with '.$actionData->name;
            $userAuth->mailContent = '<p>Dear ' . $request->name . ':</p>
            <p>' . $actionData->name . ' is coming for a tour on ' . str_replace(' ', ' at ', $actionData->start_date) . ' and will be meeting you at ' . $request->meetingtime_hour . ':' . $request->meetingtime_min . ' '.$request->meetingtime_format.'
            <p>' . $tour_manager->name . ' is handling this tour and can be reach at ' . $tour_manager->email . ' or ' . $tour_manager->mobile . ' if you have any questions.</p>
            <p>Please add this meeting to your calendar.</p>';

            $userAuth->notify(new TourStatus());
                    
            return response()->json(['code' => Config::get('constants.SUCCESS'), 'success' => Lang::get('meeting.add'), 'data' => $addMeeting], 200);
        } catch (\Exception $ex) {
            if ($ex instanceof QueryException) {
                return response()->json(['code' => Config::get('constants.DUPLICATE'), 'error' => Lang::get('meeting.duplicateentry')], 422);
            } else {
                return response()->json(['code' => Config::get('constants.ERROR'), 'error' => Lang::get('meeting.someproblems')], 422);
            }
        }
    }
    /**
     * Remove the specified meeting in tour.
     *
     * @param  int  $meetingid
     * @return \Illuminate\Http\Response
     */
    public function deletemeeting(Request $request) {
        $userAuth = JWTAuth::parseToken()->authenticate();
        $find = Meetingmanagement::where("id", $request->id)->first();
        $meetingData = Tourmeeting::where("meeting_id", $request->id)->first();
        
        $actionData = Tour::where("id", $meetingData->tour_id)->with('tourVisitors')->first();
        $tour_manager = User::where("id", $actionData->manager)->first();
        //send email to user
            $userAuth->email = $find->email;
            $userAuth->mailSubject = 'Meeting Deleted';
            $userAuth->mailContent = '<p>Dear '.$find->name.',</p>
                <p>The Tour '.$actionData->name.' on '.str_replace(' ', ' at ', $actionData->start_date).' is confirmed. But your meeting is cancelled.</p>
                <p>Your contact for this tour is : '.$tour_manager->name.', '.$tour_manager->mobile.', '.$tour_manager->email.' </p> 
                <p>Thanks.</p>';

            $userAuth->notify(new Taskconfirmation());
        
        /* Add in history table */
        $message = $userAuth->name . ' has deleted meeting';
        $addHistory = new Tourhistory();
        $addHistory->tour_id = $meetingData->tour_id;
        $addHistory->activity = $message;
        $addHistory->save();

        Tourmeeting::where('meeting_id', $request->id)->delete(); 
        return response()->json(['code' => Config::get('constants.SUCCESS'), 'success' => Lang::get('meeting.delete')], 200);
    }

}


