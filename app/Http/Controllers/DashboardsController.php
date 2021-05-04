<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Role;
use App\User;
use App\Permission;

use App\Tour;
use App\Tourtask;
use App\Tournote;
use App\Tourvisitor;
use App\Documentlink;
use App\Contactmanagement;
use App\Tourmealservice;
use App\Tourhistory;
use App\Tourfeedbacks;

use Yajra\Datatables\Datatables;
use JWTAuth;
use JWTAuthException;
use Carbon\Carbon;
use DB;

use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Config;
use Illuminate\Database\QueryException;

class DashboardsController extends Controller
{
    /**
     * Display the datatables
     * @param Request $request
     * @return JSON 
     */
    private $user;
    public function __construct()
    { 
         if (JWTAuth::getToken()) { 
            $this->user = \JWTAuth::parseToken()->toUser();
        }
        
    }
    public function showDataTableForDashboard(Request $request) {
        $userAuth = JWTAuth::parseToken()->authenticate();
        if (!empty($userAuth->roles)) {
        
            if ($userAuth->roles[0]->id == Config::get('constants.ADMIN_ID')) {
                $listData = Tour::where(["status" => 2,"company_id"=>$this->user['company_id']])->with('tourTransport','tourTapes','tourLocation','tourManager','tourVisitors','tourMomentos')->get();
            } else {
                $findUserByTour = array();
                $findTourByTask = Tourtask::whereIn('acknowledge', [0,1])->where('user_id',$userAuth->id)->get(['tour_id']);
                for ($k=0; $k < count($findTourByTask); $k++) { 
                    array_push($findUserByTour, $findTourByTask[$k]['tour_id']);
                }

                $findTourByService = Tourmealservice::where(['catering_manager' => $userAuth->id])->get(['tour_id']);
                for ($k=0; $k < count($findTourByService); $k++) { 
                    array_push($findUserByTour, $findTourByService[$k]['tour_id']);
                }

                $findTourByManager = Tour::where('manager', $userAuth->id)->get(['id']);
                for ($k=0; $k < count($findTourByManager); $k++) { 
                    array_push($findUserByTour, $findTourByManager[$k]['id']);
                }

                $listData = Tour::where(["status" => 2, "company_id"=>$this->user['company_id']])->whereIn('id', $findUserByTour)->with('tourTransport','tourTapes','tourLocation','tourManager','tourVisitors','tourMomentos')->get();
            }
            
            /*else if ($userAuth->roles[0]->id == Config::get('constants.VOLUNTEERS_ID')) {
                $findTourByTask = Tourtask::where(['user_id' => $userAuth->id, "acknowledge" => 1])->get(['tour_id']);
                $listData = Tour::where(["status" => 2])->whereIn('id', $findTourByTask)->with('tourTransport','tourTapes','tourLocation','tourManager','tourVisitors','tourMomentos')->get();
            } else if ($userAuth->roles[0]->id == Config::get('constants.TOUR_MANAGER_ID')) {
                $listData = Tour::where(['manager' => $userAuth->id, "status" => 2])->with('tourTransport','tourTapes','tourLocation','tourManager','tourVisitors','tourMomentos')->get();
            } else if ($userAuth->roles[0]->id == Config::get('constants.BAPS_STAFF_ID')) {
                $findTourByTask = Tourmealservice::where(['catering_manager' => $userAuth->id])->get(['tour_id']);
                $listData = Tour::where(["status" => 2])->whereIn('id', $findTourByTask)->with('tourTransport','tourTapes','tourLocation','tourManager','tourVisitors','tourMomentos')->get();
            }*/
        } else {
            $listData = Tour::where('company_id',$this->user['company_id'])->with('tourTransport','tourTapes','tourLocation','tourManager','tourVisitors','tourMomentos')->get();
        }
        
        for ($i=0; $i < sizeof($listData); $i++) { 
            $categoryData = array();
            $data = $listData[$i]['tourVisitors'];

            for ($k=0; $k < count($data); $k++) { 
                $getVisitor = Contactmanagement::where("id", $data[$k]['visitor_id'])->with('visitor')->withTrashed()->first();
                $name = $getVisitor['visitor']['name'];
                array_push($categoryData, $name);
            }
            $categoryData = array_unique($categoryData);
            $listData[$i]['category'] = implode(', ',$categoryData);
        }
        return Datatables::of($listData)->make(true);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $userAuth = JWTAuth::parseToken()->authenticate();

        /**
         * Tour filter count
         */
        $currentDay = Carbon::today()->toDateString();
        // $nextDay = $currentDay->addDays(1);
        $year = date('Y', strtotime($currentDay));
        $month = date('m', strtotime($currentDay));
        $nextDay = date("Y-m-d", strtotime("+1 days"));
        $weekEnd = date("Y-m-d", strtotime("+1 week"));
        $totalVolunteer = 0;
                
        if ($userAuth->roles[0]->id == Config::get('constants.ADMIN_ID')) {
            /* Get Total tours */
            $totalTour = Tour::count();

            /* Get tours count for dashboard panels */
            $tourFilterCount = DB::table('tours')->select(
                DB::raw('SUM(CASE WHEN date(start_date) = "'.$currentDay.'" AND status = 2 THEN 1 ELSE 0 END) as Today'),
                DB::raw('SUM(CASE WHEN date(start_date) >= "'.$nextDay.'" AND date(start_date) <= "'.$weekEnd.'" AND status = 2 THEN 1 ELSE 0 END) as Next_7_Days'),
                DB::raw('SUM(CASE WHEN YEAR(start_date) = '.$year.' AND MONTH(start_date) = '.$month.' AND status = 2 THEN 1 ELSE 0 END) as This_Month'),
                DB::raw('SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END) as Confirmed'),
                DB::raw('SUM(CASE WHEN status IN (0,1) THEN 1 ELSE 0 END) as Unconfirmed')
            )->whereNull('deleted_at')->first();            
            
            $totalUserId = array();
            $tourCount = Tour::where(['status' => 2])->whereDate('start_date', $currentDay)->get(['id', 'manager']);
            for($i = 0; $i < sizeof($tourCount); $i++) {
                if($tourCount[$i]->manager) {
                    array_push($totalUserId, $tourCount[$i]->manager);
                }

                $taskUser = Tourtask::where(['tour_id' => $tourCount[$i]->id, 'acknowledge' => 1])->get(['user_id']);
                for ($k=0; $k < sizeof($taskUser); $k++) {
                    array_push($totalUserId, $taskUser[$k]['user_id']);
                }

                $mealsUser = Tourmealservice::where(['tour_id' => $tourCount[$i]->id])->get(['catering_manager']);
                for ($p=0; $p < sizeof($mealsUser); $p++) {
                    array_push($totalUserId, $mealsUser[$p]['catering_manager']);
                }
            }
            $totalVolunteer = sizeof(array_unique($totalUserId));

            /*$tourCount = Tour::where(['status' => 2])->whereDate('start_date', $currentDay)->get(['id', 'manager']);
            for($i = 0; $i < sizeof($tourCount); $i++) {
                if($tourCount[$i]->manager != null ) {
                    $totalVolunteer = $totalVolunteer + 1;    
                }
                $taskUser = Tourtask::where(['tour_id' => $tourCount[$i]->id, 'acknowledge' => 1])->count();
                $mealsUser = Tourmealservice::where(['tour_id' => $tourCount[$i]->id])->count();
                $totalVolunteer = $totalVolunteer + $taskUser + $mealsUser;
            }*/
        } else {
            $findUserByTour = array();
            $findTourByTask = Tourtask::whereIn('acknowledge', [0,1])->where('user_id',$userAuth->id)->get(['tour_id']);
            for ($k=0; $k < count($findTourByTask); $k++) { 
                array_push($findUserByTour, $findTourByTask[$k]['tour_id']);
            }

            $findTourByService = Tourmealservice::where(['catering_manager' => $userAuth->id])->get(['tour_id']);
            for ($k=0; $k < count($findTourByService); $k++) { 
                array_push($findUserByTour, $findTourByService[$k]['tour_id']);
            }

            $findTourByManager = Tour::where('manager', $userAuth->id)->get(['id']);
            for ($k=0; $k < count($findTourByManager); $k++) { 
                array_push($findUserByTour, $findTourByManager[$k]['id']);
            }

            $findTourByCreatedUser = Tour::where('created_by', $userAuth->id)->get(['id']);
            for ($k=0; $k < count($findTourByCreatedUser); $k++) { 
                array_push($findUserByTour, $findTourByCreatedUser[$k]['id']);
            }

            $matches = implode(',', $findUserByTour);
            if($matches == "") {
                $matches = '0';
            }

            $totalTour = Tour::whereIn('id', $findUserByTour)->count();
            $tourFilterCount = DB::table('tours')->select(
                DB::raw('SUM(CASE WHEN date(start_date) = "'.$currentDay.'" AND status = 2 AND id IN ('.$matches.') THEN 1 ELSE 0 END) as Today'),
                DB::raw('SUM(CASE WHEN date(start_date) >= "'.$nextDay.'" AND date(start_date) <= "'.$weekEnd.'" AND status = 2 AND id IN ('.$matches.') THEN 1 ELSE 0 END) as Next_7_Days'),
                DB::raw('SUM(CASE WHEN YEAR(start_date) = '.$year.' AND MONTH(start_date) = '.$month.' AND status = 2 AND id IN ('.$matches.') THEN 1 ELSE 0 END) as This_Month'),
                DB::raw('SUM(CASE WHEN status = 2 AND id IN ('.$matches.') THEN 1 ELSE 0 END) as Confirmed'),
                DB::raw('SUM(CASE WHEN status IN (0,1) AND id IN ('.$matches.') THEN 1 ELSE 0 END) as Unconfirmed')
            )->whereNull('deleted_at')->first();
        }
        
        /*else if ($userAuth->roles[0]->id == Config::get('constants.VOLUNTEERS_ID')) {
            $findTourByTask = Tourtask::whereIn('acknowledge', [0,1])->where(['user_id' => $userAuth->id])->get(['tour_id']);
            
            
            $totalTour = Tour::whereIn('id', $findTourByTask)->count();
            
            
            $idArrays = [];
            for ($i=0; $i < sizeof($findTourByTask); $i++) {
                $idArrays[$i] = $findTourByTask[$i]['tour_id'];
            }
            $matches = implode(',', $idArrays);
            if($matches == "") {
                $matches = '0';
            }
            
            $tourFilterCount = DB::table('tours')->select(
                DB::raw('SUM(CASE WHEN date(start_date) = "'.$currentDay.'" AND status = 2 AND id IN ('.$matches.') THEN 1 ELSE 0 END) as Today'),
                DB::raw('SUM(CASE WHEN date(start_date) >= "'.$nextDay.'" AND date(start_date) <= "'.$weekEnd.'" AND status = 2 AND id IN ('.$matches.') THEN 1 ELSE 0 END) as Next_7_Days'),
                DB::raw('SUM(CASE WHEN YEAR(start_date) = '.$year.' AND MONTH(start_date) = '.$month.' AND status = 2 AND id IN ('.$matches.') THEN 1 ELSE 0 END) as This_Month'),
                DB::raw('SUM(CASE WHEN status = 2 AND id IN ('.$matches.') THEN 1 ELSE 0 END) as Confirmed'),
                DB::raw('SUM(CASE WHEN status IN (0,1) AND id IN ('.$matches.') THEN 1 ELSE 0 END) as Unconfirmed')
            )->whereNull('deleted_at')->first();
        } else if ($userAuth->roles[0]->id == Config::get('constants.TOUR_MANAGER_ID')) {
            
            $totalTour = Tour::where(['manager' => $userAuth->id])->count();

            
            $tourFilterCount = DB::table('tours')->select(
                DB::raw('SUM(CASE WHEN date(start_date) = "'.$currentDay.'" AND status = 2 AND manager = '.$userAuth->id.' THEN 1 ELSE 0 END) as Today'),
                DB::raw('SUM(CASE WHEN date(start_date) >= "'.$nextDay.'" AND date(start_date) <= "'.$weekEnd.'" AND status = 2 AND manager = '.$userAuth->id.' THEN 1 ELSE 0 END) as Next_7_Days'),
                DB::raw('SUM(CASE WHEN YEAR(start_date) = '.$year.' AND MONTH(start_date) = '.$month.' AND status = 2 AND manager = '.$userAuth->id.' THEN 1 ELSE 0 END) as This_Month'),
                DB::raw('SUM(CASE WHEN status = 2 AND manager = '.$userAuth->id.' THEN 1 ELSE 0 END) as Confirmed'),
                DB::raw('SUM(CASE WHEN status IN (0,1) AND manager = '.$userAuth->id.' THEN 1 ELSE 0 END) as Unconfirmed')
            )->whereNull('deleted_at')->first();
        } else if ($userAuth->roles[0]->id == Config::get('constants.BAPS_STAFF_ID')) {
            $findTourByTask = Tourmealservice::where(['catering_manager' => $userAuth->id])->get(['tour_id']);
            
            $totalTour = Tour::whereIn('id', $findTourByTask)->count();

            
            $idArrays = [];
            for ($i=0; $i < sizeof($findTourByTask); $i++) {
                $idArrays[$i] = $findTourByTask[$i]['tour_id'];
            }
            $matches = implode(',', $idArrays);
            if($matches == "") {
                $matches = '0';
            }

            $tourFilterCount = DB::table('tours')->select(
                DB::raw('SUM(CASE WHEN date(start_date) = "'.$currentDay.'" AND status = 2 AND id IN ('.$matches.') THEN 1 ELSE 0 END) as Today'),
                DB::raw('SUM(CASE WHEN date(start_date) >= "'.$nextDay.'" AND date(start_date) <= "'.$weekEnd.'" AND status = 2 AND id IN ('.$matches.') THEN 1 ELSE 0 END) as Next_7_Days'),
                DB::raw('SUM(CASE WHEN YEAR(start_date) = '.$year.' AND MONTH(start_date) = '.$month.' AND status = 2 AND id IN ('.$matches.') THEN 1 ELSE 0 END) as This_Month'),
                DB::raw('SUM(CASE WHEN status = 2 AND id IN ('.$matches.') THEN 1 ELSE 0 END) as Confirmed'),
                DB::raw('SUM(CASE WHEN status IN (0,1) AND id IN ('.$matches.') THEN 1 ELSE 0 END) as Unconfirmed')
            )->whereNull('deleted_at')->first();
        }*/

        /* Define default option */
        $rolesAndUserCount = [];
        if ($userAuth->roles->first()->id == Config::get('constants.ADMIN_ID')) {
            $objUser = Role::where(['role_type' => '3'])->get();
            for ($i=0; $i < sizeof($objUser); $i++) {
                $agentUsers = $objUser[$i]->users()->count();
                // echo $agentUsers.' - ';
                $rolesAndUserCount[$i] = [
                        'role_name' => $objUser[$i]->name,
                        'count' => $agentUsers
                    ];
            }
            $visitors = [
                'role_name' => 'Visitors',
                'count' => Contactmanagement::count()
            ];
            array_push($rolesAndUserCount, $visitors);
        }

        /* Send all results */
        $data = [
            'countData' => $rolesAndUserCount,
            'tourCountData' => $tourFilterCount,
            'totalTour' => $totalTour,
            'today_total_volunteer' => $totalVolunteer
        ];
        return response()->json(['code' => Config::get('constants.SUCCESS'), 'data' => $data], 200);
    }
    
    /**
     * Show the list of tour Schedule.
     *
     * @return \Illuminate\Http\Response
     */
    public function calenderData()
    {
        $userAuth = JWTAuth::parseToken()->authenticate();
        
        if (!empty($userAuth->roles)) {
            if ($userAuth->roles[0]->id == Config::get('constants.ADMIN_ID')) {
                $listData = Tour::where(["status" => 2])->get();
            } else {
                $findUserByTour = array();
                $findTourByTask = Tourtask::whereIn('acknowledge', [0,1])->where('user_id',$userAuth->id)->get(['tour_id']);
                for ($k=0; $k < count($findTourByTask); $k++) { 
                    array_push($findUserByTour, $findTourByTask[$k]['tour_id']);
                }

                $findTourByService = Tourmealservice::where(['catering_manager' => $userAuth->id])->get(['tour_id']);
                for ($k=0; $k < count($findTourByService); $k++) { 
                    array_push($findUserByTour, $findTourByService[$k]['tour_id']);
                }

                $findTourByManager = Tour::where('manager', $userAuth->id)->get(['id']);
                for ($k=0; $k < count($findTourByManager); $k++) { 
                    array_push($findUserByTour, $findTourByManager[$k]['id']);
                }

                $listData = Tour::where(["status" => 2])->whereIn('id', $findUserByTour)->with('tourTransport','tourTapes','tourLocation','tourManager','tourVisitors','tourMomentos')->get();
            }
            /*else if ($userAuth->roles[0]->id == Config::get('constants.VOLUNTEERS_ID')) {
                $findTourByTask = Tourtask::whereIn('acknowledge', [0,1])->where('user_id',$userAuth->id)->get(['tour_id']);
                $listData = Tour::where(["status" => 2])->whereIn('id', $findTourByTask)->get();
            } else if ($userAuth->roles[0]->id == Config::get('constants.TOUR_MANAGER_ID')) {
                $listData = Tour::where(['manager' => $userAuth->id, "status" => 2])->get();
            } else if ($userAuth->roles[0]->id == Config::get('constants.BAPS_STAFF_ID')) {
                $findTourByTask = Tourmealservice::where(['catering_manager' => $userAuth->id])->get(['tour_id']);
                $listData = Tour::where(["status" => 2])->whereIn('id', $findTourByTask)->get();
            }*/
        } else {
            $listData = Tour::where(["status" => 2])->get();
        }
        return response()->json(['code' => Config::get('constants.SUCCESS'), 'data' => $listData], 200);
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
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
