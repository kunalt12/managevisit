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
use Illuminate\Support\Facades\DB;
use App\Notifications\Tourconfirmation;
use App\Notifications\TourRemainder;
use App\Notifications\TourFeedback;
use App\Notifications\Tourstatus;

class ApiUserController extends Controller
{

    /**
     * Display a listing of the resource
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // $activeData = User::where('id', '!=', '1')->where(['status' => '1', 'availability' => '2'])->get();
        $activeData = User::where('id', '!=', '1')->where(['status' => '1'])->get();
        return response()->json(['code' => Config::get('constants.SUCCESS'), 'data' => $activeData /*, 'all' => $allUserData*/], 200);
    }

    /**
     * Display a listing of the resource
     *
     * @return \Illuminate\Http\Response
     */
    public function showAvailableUser()
    {
        $activeData = User::where('id', '!=', '1')->where(['status' => '1', 'availability' => '2'])->get();
        return response()->json(['code' => Config::get('constants.SUCCESS'), 'data' => $activeData], 200);
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

    public function checkUsername($userName, $userId = 0){
        $userCount = User::where("name", $userName)->where('id','!=',$userId)->count();
        
        if($userCount > 0){
            $extraAppends = array(); 
            $usersDetail = User::select('id','name')->where("name",'LIKE', "%{$userName}%")->get()->toArray();
            foreach($usersDetail as $detail){
                if($detail['id'] != $userId){
                $extraAppends[] =  (int) trim(str_replace($userName,'',$detail['name']));
            }
            }
            $extraAppends = array_filter($extraAppends);
            if(isset($extraAppends) && !empty($extraAppends)){
                $highestVal = (int) max($extraAppends) + 1;
                $userName = $userName .' '. (string) $highestVal;
            }else{
                $userName = $userName . ' 1';
            }
            return $userName;
        }
        return $userName;
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

        $checkUser = User::where("email", $request->email)->first();
        if(!empty($checkUser)) {
            return response()->json(['code' => Config::get('constants.DUPLICATE'), 'error' => Lang::get('users.duplicateentry')], 422);
        }
//print_r($request->user_type);die;

        try {
            $dt = Carbon::now();
            if($request->dob == null || $request->dob == 'null' || $request->dob == '') {
                $date = null;
            }
            else {
                $date = Carbon::createFromFormat('Y-m-d', $request->dob);
            }
            if($request->first_name && $request->last_name) {
                $username = $request->first_name . " " . $request->last_name;
            }
            else {
                $pieces = explode("@", $request->email);
                $username = $pieces[0];
            }

            $username = $this->checkUsername($username);
            
            $add = new User();
            $add->name = $username;
            $add->first_name = $request->first_name;
            $add->middle_name = $request->middle_name;
            $add->last_name = $request->last_name;
            $add->email = $request->email;
            $add->password = bcrypt($request->password);
            $add->mobile = $request->mobile;
            $add->company_id = $request->company_id;
//            $add->phone_number = $request->phone_number;
//
            $add->address = $request->address;
//            $add->address1 = $request->address1;
//            $add->country_id = ($request->country_id != "null") ? $request->country_id : null;
//            $add->state = $request->state;
//            $add->city = $request->city;
//            $add->zip_code = $request->zip_code;
//
//            $add->gender = ($request->gender != "null") ? $request->gender : '';
//            $add->image = isset($imageName) ? $imageName : '';
//            $add->dob = $date;
//            $add->status = $request->status;
            $add->save();
//            $add->assignRole($request->user_type);
//echo '<pre>';print_r($username); die;
            
//            if($request->sendMail){
//            $roles = Role::where(['id' => $request->user_type])->first(['name']);
//            
//            $add->role = $roles;
//            $add->password = $password;
//                $add->mailSubject = $request->mailSubject;
//                $add->mailContent = $request->mailContent;
//            $add->notify(new Userregister());
//            }
            return response()->json(['code' => Config::get('constants.SUCCESS'), 'success' => Lang::get('users.add')], 200);

        } catch (\Exception $ex) {
            if ($ex instanceof QueryException) {
                return response()->json(['code' => Config::get('constants.DUPLICATE'), 'error' => Lang::get('users.duplicateentry')], 422);
            } else {
                return response()->json(['code' => Config::get('constants.ERROR'), 'error' => Lang::get('users.someproblems')], 422);
            }
        }
    }

    public function sendWelcomeEmail(Request $request)
    {
        if($request->sendMail){
            $password = str_random(8);
            $find = User::find($request->id);
            $find->password = bcrypt($password);
            $find->save();

            foreach ($find->getRoles() as $key => $role) {
                $roles = Role::where(['id' => $key])->first(['name']);
                $find->role = $roles;
            }

            $find->password = $password;
            $find->mailSubject = $request->mailSubject;
            $find->mailContent = $request->mailContent;
            $find->notify(new Userregister());
            return response()->json(['code' => Config::get('constants.SUCCESS'), 'success' => Lang::get('users.email_sent')], 200);
        }
    }
}
