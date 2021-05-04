<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use App\Tour;
use App\Role;
use App\Tourtask;
use App\Useravailability;
use App\Notification;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Database\QueryException;
use App\Permission;
use Yajra\Datatables\Datatables;
use JWTAuth;
use Illuminate\Support\Facades\Auth;
use Hash;
use Illuminate\Support\Facades\Config;
use Carbon\Carbon;
use JWTAuthException;

use App\Notifications\Userregister;

class UserController extends Controller
{

    /**
     * Display the datatables
     * @param Request $request
     * @return JSON 
     */
    public function showDataTable(Request $request) {
        $userAuth = JWTAuth::parseToken()->authenticate();

        // $listData = User::all()->where('id', '!=', '1');
//        $listData = User::where('id', '!=', '1')->get();
        $listData = User::where([['id', '!=', '1'],['company_id','=',auth()->user()->company_id]])->get();
        
        return Datatables::of($listData)
        ->addColumn('gender', function ($genderName) {
                if($genderName['gender'] == 'm') {
                    return 'Male';
                }
                else if($genderName['gender'] == 'f') {
                    return 'Female';
                }
                else {
                    return '-';
                }
            })
        ->addColumn('role', function ($companyUser) {
                foreach ($companyUser->getRoles() as $key => $role) {
                    $roles = Role::find($key);
                    return $roles['name'];
                }
            }) 
            ->make(true);
    }
    // 1 = User Role, 2 = Subscription Role, 3 = System Role

    /**
     * Get User by role
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function getUserByType($tourid, Request $request) {
        $role_typename = "";
       $role_typename = $request->route()->getAction()['tourid'];
            if($role_typename) {
            $activeData = Role::where('name', $role_typename)->first()->users()->get();
        } else {
            $activeData = User::where([['id', '!=', '1'],['company_id','=',auth()->user()->company_id]])->get();
        }
        return response()->json(['code' => Config::get('constants.SUCCESS'), 'data' => $activeData], 200);
    }
    public function volunteers($id) {
        
        $find = Tour::where("id", $id)->first();
        
        $timestamp = strtotime($find->start_date);
        $tourtime = date('H:i:s',$timestamp);
        
        $day = strtolower(date('l', $timestamp));
//        $activeData = User::where([['id', '!=', '1'],[$day.'_start','<=',$tourtime],[$day.'_stop','>=',$tourtime]])->get();
        $activeData = User::where([['id', '!=', '1'],['company_id','=',auth()->user()->company_id]])->orderBy('name','ASC')->get();
        foreach($activeData as $adata) {
            $d = $day.'_start';
            $dd = $day.'_stop';
            if($adata->$d <= $tourtime && $adata->$dd >= $tourtime) {                
                $adata['availableontourday'] = 1; 
            } else {
                $adata['name'] = $adata->name.' - (NA)'; 
                $adata['availableontourday'] = 0;
            }
        }
        
        return response()->json(['code' => Config::get('constants.SUCCESS'), 'data' => $activeData], 200);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function getAllData()
    {
        $activeData = User::withTrashed()->where('id', '!=', '1')->get();
        return response()->json(['code' => Config::get('constants.SUCCESS'), 'data' => $activeData], 200);
    }
    
    /**
     * Display a listing of the resource
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // $activeData = User::where('id', '!=', '1')->where(['status' => '1', 'availability' => '2'])->get();
        $activeData = User::where([['id', '!=', '1'],['company_id','=',auth()->user()->company_id]])->where(['status' => '1'])->get();
        return response()->json(['code' => Config::get('constants.SUCCESS'), 'data' => $activeData /*, 'all' => $allUserData*/], 200);
    }

    /**
     * Display a listing of the resource
     *
     * @return \Illuminate\Http\Response
     */
    public function showAvailableUser()
    {
        $activeData = User::where([['id', '!=', '1'],['company_id','=',auth()->user()->company_id]])->where(['status' => '1', 'availability' => '2'])->get();
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
        $userAuth = JWTAuth::parseToken()->authenticate();

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
            
            if($request->file('profile_pic')) {
                $path1 = public_path() . '/upload/temp/'. $dt->format('Y-m-d');
                $path = public_path() . '/upload/temp/'. $dt->format('Y-m-d');
                if (!File::exists($path1)) {
                    File::makeDirectory($path1, 0777);
                }

                $imageName = time() . '.' . $request->profile_pic->getClientOriginalExtension();
                $temp_path = $request->profile_pic->move($path, $imageName);
            }
            $password = $request->password;

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
            $add->phone_number = $request->phone_number;

            $add->address = $request->address;
            $add->address1 = $request->address1;
            $add->country_id = ($request->country_id != "null") ? $request->country_id : null;
            $add->state = $request->state;
            $add->city = $request->city;
            $add->zip_code = $request->zip_code;

            $add->gender = ($request->gender != "null") ? $request->gender : '';
            $add->image = isset($imageName) ? $imageName : '';
            $add->dob = $date;
            $add->status = $request->status;
            $add->company_id = auth()->user()->company_id;
            $add->save();
            $add->assignRole($request->user_type);

            if ($request->profile_pic != null && $request->profile_pic != 'null') {
                $path1 = public_path() . '/upload/profile/' . $add->id;
                if (!File::exists($path1)) {
                    File::makeDirectory($path1, 0777);
                }
                File::move($temp_path->getRealPath(), $path1 . '/' . $imageName);
            }
            
            if($request->sendMail){
            $roles = Role::where(['id' => $request->user_type])->first(['name']);
            
            $add->role = $roles;
            $add->password = $password;
                $add->mailSubject = $request->mailSubject;
                $add->mailContent = $request->mailContent;
            $add->notify(new Userregister());
            }
            return response()->json(['code' => Config::get('constants.SUCCESS'), 'success' => Lang::get('users.add')], 200);

        } catch (\Exception $ex) {
            if ($ex instanceof QueryException) {
                return response()->json(['code' => Config::get('constants.DUPLICATE'), 'error' => Lang::get('users.duplicateentry')], 422);
            } else {
                return response()->json(['code' => Config::get('constants.ERROR'), 'error' => Lang::get('users.someproblems')], 422);
            }
        }
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
        $find = User::where('id', $id)->with('country')->first();
//        echo '<pre>';print_r($find);die;
        if($find->monday_start == '00:00:01' && $find->monday_stop == '23:59:00') {
            $find->monday_full_day=1;
        } 
            //monday start
            $m_st = date('h i a',strtotime($find->monday_start));
            $mon_st = explode(' ', $m_st);
            $monday_start['hour'] = $mon_st[0];$monday_start['min'] = $mon_st[1];$monday_start['am_pm'] = $mon_st[2];
            $find->monday_start = $monday_start;
            //monday stop
            $m_stop = date('h i a',strtotime($find->monday_stop));
            $mon_stop = explode(' ', $m_stop);
            $monday_stop['hour'] = $mon_stop[0];$monday_stop['min'] = $mon_stop[1];$monday_stop['am_pm'] = $mon_stop[2];
            $find->monday_stop = $monday_stop;
        
        if($find->tuesday_start == '00:00:01' && $find->tuesday_stop == '23:59:00') {
            $find->tuesday_full_day=1;
        }
            //tuesday start
            $m_st = date('h i a',strtotime($find->tuesday_start));
            $tues_st = explode(' ', $m_st);
            $tuesday_start['hour'] = $tues_st[0];$tuesday_start['min'] = $tues_st[1];$tuesday_start['am_pm'] = $tues_st[2];
            $find->tuesday_start = $tuesday_start;
            //tuesday stop
            $m_stop = date('h i a',strtotime($find->tuesday_stop));
            $tues_stop = explode(' ', $m_stop);
            $tuesday_stop['hour'] = $tues_stop[0];$tuesday_stop['min'] = $tues_stop[1];$tuesday_stop['am_pm'] = $tues_stop[2];
            $find->tuesday_stop = $tuesday_stop;
        
        if($find->wednesday_start == '00:00:01' && $find->wednesday_stop == '23:59:00') {
            $find->wednesday_full_day=1;
        } 
            //wednesday start
            $m_st = date('h i a',strtotime($find->wednesday_start));
            $wednes_st = explode(' ', $m_st);
            $wednesday_start['hour'] = $wednes_st[0];$wednesday_start['min'] = $wednes_st[1];$wednesday_start['am_pm'] = $wednes_st[2];
            $find->wednesday_start = $wednesday_start;
            //wednesday stop
            $m_stop = date('h i a',strtotime($find->wednesday_stop));
            $wednes_stop = explode(' ', $m_stop);
            $wednesday_stop['hour'] = $wednes_stop[0];$wednesday_stop['min'] = $wednes_stop[1];$wednesday_stop['am_pm'] = $wednes_stop[2];
            $find->wednesday_stop = $wednesday_stop;
        
        if($find->thursday_start == '00:00:01' && $find->thursday_stop == '23:59:00') {
            $find->thursday_full_day=1;
        } 
            //thursday start
            $m_st = date('h i a',strtotime($find->thursday_start));
            $thurs_st = explode(' ', $m_st);
            $thursday_start['hour'] = $thurs_st[0];$thursday_start['min'] = $thurs_st[1];$thursday_start['am_pm'] = $thurs_st[2];
            $find->thursday_start = $thursday_start;
            //thursday stop
            $m_stop = date('h i a',strtotime($find->thursday_stop));
            $thurs_stop = explode(' ', $m_stop);
            $thursday_stop['hour'] = $thurs_stop[0];$thursday_stop['min'] = $thurs_stop[1];$thursday_stop['am_pm'] = $thurs_stop[2];
            $find->thursday_stop = $thursday_stop;
        
        if($find->friday_start == '00:00:01' && $find->friday_stop == '23:59:00') {
            $find->friday_full_day=1;
        }
            //friday start
            $m_st = date('h i a',strtotime($find->friday_start));
            $fri_st = explode(' ', $m_st);
            $friday_start['hour'] = $fri_st[0];$friday_start['min'] = $fri_st[1];$friday_start['am_pm'] = $fri_st[2];
            $find->friday_start = $friday_start;
            //friday stop
            $m_stop = date('h i a',strtotime($find->friday_stop));
            $fri_stop = explode(' ', $m_stop);
            $friday_stop['hour'] = $fri_stop[0];$friday_stop['min'] = $fri_stop[1];$friday_stop['am_pm'] = $fri_stop[2];
            $find->friday_stop = $friday_stop;
        
        if($find->saturday_start == '00:00:01' && $find->saturday_stop == '23:59:00') {
            $find->saturday_full_day=1;
        }
            //saturday start
            $m_st = date('h i a',strtotime($find->saturday_start));
            $satur_st = explode(' ', $m_st);
            $saturday_start['hour'] = $satur_st[0];$saturday_start['min'] = $satur_st[1];$saturday_start['am_pm'] = $satur_st[2];
            $find->saturday_start = $saturday_start;
            //saturday stop
            $m_stop = date('h i a',strtotime($find->saturday_stop));
            $satur_stop = explode(' ', $m_stop);
            $saturday_stop['hour'] = $satur_stop[0];$saturday_stop['min'] = $satur_stop[1];$saturday_stop['am_pm'] = $satur_stop[2];
            $find->saturday_stop = $saturday_stop;
        
        if($find->sunday_start == '00:00:01' && $find->sunday_stop == '23:59:00') {
            $find->sunday_full_day=1;
        } 
            //sunday start
            $m_st = date('h i a',strtotime($find->sunday_start));
            $sun_st = explode(' ', $m_st);
            $sunday_start['hour'] = $sun_st[0];$sunday_start['min'] = $sun_st[1];$sunday_start['am_pm'] = $sun_st[2];
            $find->sunday_start = $sunday_start;
            //sunday stop
            $m_stop = date('h i a',strtotime($find->sunday_stop));
            $sun_stop = explode(' ', $m_stop);
            $sunday_stop['hour'] = $sun_stop[0];$sunday_stop['min'] = $sun_stop[1];$sunday_stop['am_pm'] = $sun_stop[2];
            $find->sunday_stop = $sunday_stop;
        
        
        $role = $find->getRoles();
        $find['user_type'] = key($role);

        $find['roles'] = Role::where('id',$find['user_type'])->first();
        if($find['roles']){
            $find['role_name'] = $find['roles']->name;
        }
        else {
            $find['roles'] = [];
            $find['role_name'] = '';
        }
        
        if (empty($find)) {
            return response()->json(['code' => Config::get('constants.NO_DATA_FOUND'), 'error' => Lang::get('users.notfind')], 422);
        }
        return response()->json(['code' => Config::get('constants.SUCCESS'), 'data' => $find], 200);
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
        $userAuth = JWTAuth::parseToken()->authenticate();
        $dt = Carbon::now();
        $update = User::find($id);
        
        $role = $update->getRoles();
        $currantRole = key($role);
        
        if (empty($update)) {
            return response()->json(['code' => Config::get('constants.NO_DATA_FOUND'), 'error' => Lang::get('users.notfind')], 422);
        }
        
        try {
            if($request->dob == null || $request->dob == 'null' || $request->dob == '') {
                $date = null;
            }
            else {
                $date = Carbon::createFromFormat('Y-m-d', $request->dob);
            }
            
            if ($request->file('profile_pic')) {
                $pathFolder = public_path() . '/upload/temp/'. $dt->format('Y-m-d');
                $pathTemp = public_path() . '/upload/temp/'. $dt->format('Y-m-d');
                if (!File::exists($pathFolder)) {
                    File::makeDirectory($pathFolder, 0777);
                }

                $imageName = time() . '.' . $request->profile_pic->getClientOriginalExtension();
                $temp_path = $request->profile_pic->move($pathTemp, $imageName);

                $path1 = public_path() . '/upload/profile/' . $update->id;
                if (!File::exists($path1)) {
                    File::makeDirectory($path1, 0777);
                }
                
                File::move($temp_path->getRealPath(), $path1 . '/' . $imageName);
            }

            if($request->first_name != null && $request->last_name != null) {
                $username = $request->first_name . " " . $request->last_name;
            }
            else {
                $pieces = explode("@", $request->email);
                $username = $pieces[0];
            }
                        
//            $username = $this->checkUsername($update->name, $update->id);
//            $username = $this->checkUsername($username);
            
            $update->name = $username;
            $update->first_name = $request->first_name;
            $update->middle_name = $request->middle_name;
            $update->last_name = $request->last_name;
            $update->mobile = $request->mobile;
            $update->phone_number = $request->phone_number;
            
            $update->address = $request->address;
            $update->address1 = $request->address1;
            $update->country_id = ($request->country_id != "null") ? $request->country_id : null;
            $update->state = $request->state;
            $update->city = $request->city;
            $update->zip_code = $request->zip_code;

            $update->gender = ($request->gender != "null") ? $request->gender : '';
            $update->image = isset($imageName) ? $imageName : $request->image;
            $update->dob = $date;
            $update->status = $request->status;
            $update->save();
            
            if($request->user_type) {
                if($currantRole != $request->user_type) {
                    $user = User::find($id);
                    $user->roles()->detach($currantRole);
                    $user->roles()->attach($request->user_type);
                    
                    $role1 = Role::find($request->user_type);
                    
                    $dataValue = [
                        'user_id' => $userAuth->id
                    ];

                    $replaceArray = [
                        'SenderName' => $userAuth->name,
                        'RoleName' => $role1['name'],
                    ];
                    
                    $notificationMessage = trans('notification_template.change_user_role', $replaceArray);
                    $notificationData = [
                        'message' => $notificationMessage,
                        'notification_type' => 'tour',
                        'user_id' => $userAuth->id,
                        'receiver_id' => [$id],
                        'data' => json_encode($dataValue),
                    ];
                    sendNotification($notificationData);
                }
            }
            return response()->json(['code' => Config::get('constants.SUCCESS'), 'success' => Lang::get('users.update'),'data'=> $update], 200);
        } catch (Exception $ex) {
            if ($ex instanceof QueryException) {
                return response()->json(['code' => Config::get('constants.DUPLICATE'), 'error' => Lang::get('users.duplicateentry')], 422);
            } else {
                return response()->json(['code' => Config::get('constants.ERROR'), 'error' => Lang::get('users.someproblems')], 422);
            }
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $userAuth = JWTAuth::parseToken()->authenticate();
        if ($userAuth->roles[0]->id == Config::get('constants.ADMIN_ID')) {
            Notification::where('user_id', $id)->delete();
            Notification::where('receiver_id', $id)->delete();
            Tourtask::where('user_id', $id)->delete();
            User::where('id', $id)->delete();
            return response()->json(['code' => Config::get('constants.SUCCESS'), 'success' => Lang::get('users.delete')], 200);
        }
        else {
            return response()->json(['code' => Config::get('constants.NO_DATA_FOUND'), 'error' => Lang::get('users.notfind')], 422);
        }
    }

    /**
    * Change password
    * User id and new password
    */
    public function changePassword(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();

        if (Hash::check($request->password, $user->password)) {
            if(!Hash::check($request->new_password, $user->password)) {
                try {
                    $user->password = bcrypt($request->new_password);
                    // $user->password_changed_at = Carbon::now()->toDateTimeString();
                    $user->save();
                    return response()->json(['code' => Config::get('constants.SUCCESS'), 'success' => Lang::get('users.change_password')], 200);
                } catch (Exception $ex) {
                    return response()->json(['code' => Config::get('constants.ERROR'), 'error' => Lang::get('users.someproblems')], 422);
                }
            }
            return response()->json(['code' => Config::get('constants.SUCCESS'), 'error' => Lang::get('users.compare_password')], 422);
        }
        return response()->json(['code' => Config::get('constants.WRONG_PASSWORD'), 'error' => Lang::get('users.wrong_password')], 422);
    }

    public function checkAndGetPermissions(Request $request) {
        $userAuth = JWTAuth::parseToken()->authenticate();
        
        if (!$userAuth) {
            return response()->json(['error' => Lang::get('message.nothavepermission')], 401);
        }
        
        $role = $userAuth->getRoles();
        if(empty($role)) {
            return response()->json(['code' => Config::get('constants.NO_DATA_FOUND'), 'error' => Lang::get('message.nothavepermissionlogin')], 422);
        }
        else {
            $permissions = $userAuth->getPermissions();
            $hasPermission = $userAuth->can($request->permission);
            return response()->json(['has_permission' => $hasPermission, 'permissions' => $permissions, 'role' => $role, 'message' => Lang::get('message.nothavepermission')], 200);
        }
    }

    public function getTourManager()
    {
        $userAuth = JWTAuth::parseToken()->authenticate();
        
        //$userAuth->id=84;
        $role = $userAuth->getRoles();      
        $role = array_keys($role);

        $objUser = Role::find('4');
        $activeData = $objUser->users()->get()->toArray();
        if($role[0]==1){
            $objUser2 = Role::find('1');
            $activeData2 = $objUser2->users()->groupBy('id')->get()->toArray();
            $result = array_merge( $activeData2, $activeData );
             //duplicate objects will be removed
            $activeData = array_map("unserialize", array_unique(array_map("serialize", $result)));
        }
        

        // $activeData = $objUser->users()->where(['status' => '1', 'availability' => '2'])->get();
        // $allUserData = $objUser->users()->where(['status' => '1'])->get();
        
        

        
        return response()->json(['code' => Config::get('constants.SUCCESS'), 'data' => $activeData/*, 'all' => $allUserData*/], 200);
    }

    /**
     * Change Availability status and add in history
     * User id and new Availability status
     */
    public function changeAvailability(Request $request, $id)
    {
        $userAuth = JWTAuth::parseToken()->authenticate();
        $update = User::find($id);
        $days = $request->monday_start;//$days->monday_full_day 
//        echo $request->tuesday_full_day;die;
        try {
            $update->availability = $request->status;
            //start monday to sunday availibility hours
            if($request->monday_full_day==1) {
                $update->monday_start = '00:00:00';
                $update->monday_stop = '23:59:00';
            } else {
                $update->monday_start = date("H:i:s", strtotime($request->monday_start['hour'].":".$request->monday_start['min']." ".$request->monday_start['am_pm']));
                $update->monday_stop = date("H:i:s", strtotime($request->monday_stop['hour'].":".$request->monday_stop['min']." ".$request->monday_stop['am_pm']));
            }
            if($request->tuesday_full_day==1) {
                $update->tuesday_start = '00:00:01';
                $update->tuesday_stop = '23:59:00';
            } else {
                $update->tuesday_start = date("H:i:s", strtotime($request->tuesday_start['hour'].":".$request->tuesday_start['min']." ".$request->tuesday_start['am_pm']));
                $update->tuesday_stop = date("H:i:s", strtotime($request->tuesday_stop['hour'].":".$request->tuesday_stop['min']." ".$request->tuesday_stop['am_pm']));
            }
            if($request->wednesday_full_day==1) {
                $update->wednesday_start = '00:00:01';
                $update->wednesday_stop = '23:59:00';
            } else {
                $update->wednesday_start = date("H:i:s", strtotime($request->wednesday_start['hour'].":".$request->wednesday_start['min']." ".$request->wednesday_start['am_pm']));
                $update->wednesday_stop = date("H:i:s", strtotime($request->wednesday_stop['hour'].":".$request->wednesday_stop['min']." ".$request->wednesday_stop['am_pm']));
            }
            if($request->thursday_full_day==1) {
                $update->thursday_start = '00:00:01';
                $update->thursday_stop = '23:59:00';
            } else {
                $update->thursday_start = date("H:i:s", strtotime($request->thursday_start['hour'].":".$request->thursday_start['min']." ".$request->thursday_start['am_pm']));
                $update->thursday_stop = date("H:i:s", strtotime($request->thursday_stop['hour'].":".$request->thursday_stop['min']." ".$request->thursday_stop['am_pm']));
            }
            if($request->friday_full_day==1) {
                $update->friday_start = '00:00:01';
                $update->friday_stop = '23:59:00';
            } else {
                $update->friday_start = date("H:i:s", strtotime($request->friday_start['hour'].":".$request->friday_start['min']." ".$request->friday_start['am_pm']));
                $update->friday_stop = date("H:i:s", strtotime($request->friday_stop['hour'].":".$request->friday_stop['min']." ".$request->friday_stop['am_pm']));
            }
            if($request->saturday_full_day==1) {
                $update->saturday_start = '00:00:01';
                $update->saturday_stop = '23:59:00';
            } else {
                $update->saturday_start = date("H:i:s", strtotime($request->saturday_start['hour'].":".$request->saturday_start['min']." ".$request->saturday_start['am_pm']));
                $update->saturday_stop = date("H:i:s", strtotime($request->saturday_stop['hour'].":".$request->saturday_stop['min']." ".$request->saturday_stop['am_pm']));
            }
            if($request->sunday_full_day==1) {
                $update->sunday_start = '00:00:01';
                $update->sunday_stop = '23:59:00';
            } else {
                $update->sunday_start = date("H:i:s", strtotime($request->sunday_start['hour'].":".$request->sunday_start['min']." ".$request->sunday_start['am_pm']));
                $update->sunday_stop = date("H:i:s", strtotime($request->sunday_stop['hour'].":".$request->sunday_stop['min']." ".$request->sunday_stop['am_pm']));
            }
            
            
//            echo '<pre>';print_r($add);die;
            $update->save();

            $add = new Useravailability();
            $add->user_id = $id;
            $add->status = $request->status;
            
            $add->comment = $request->comment;
            $add->save();
            
            

            if ($userAuth->roles[0]->id != Config::get('constants.ADMIN_ID')) {
                if($request->status == 2) {
                    $statusName = 'Available';
                }
                else {
                    $statusName = 'Unavailable';
                }

                $dataValue = [
                    'user_id' => $update->id
                ];

                $replaceArray = [
                    'SenderName' => $update->name,
                    'Status' => $statusName
                ];
                
                $notificationMessage = trans('notification_template.user_change_availability', $replaceArray);
                $notificationData = [
                    'message' => $notificationMessage,
                    'notification_type' => 'tour',
                    'user_id' => $update->id,
                    'receiver_id' => [1],
                    'data' => json_encode($dataValue),
                ];
                sendNotification($notificationData);
            }

            return response()->json(['code' => Config::get('constants.SUCCESS'), 'success' => Lang::get('users.updatestatus')], 200);
        } catch (Exception $ex) {
            if ($ex instanceof QueryException) {
                return response()->json(['code' => Config::get('constants.DUPLICATE'), 'error' => Lang::get('users.duplicateentry')], 422);
            } else {
                return response()->json(['code' => Config::get('constants.ERROR'), 'error' => Lang::get('users.someproblems')], 422);
            }
        }
    }

    /**
     * Display the datatables
     * @param Request $request
     * @return JSON 
     * 
     * Get Availability status history
     * All users data and search by user data
     */
    public function getAvailabilityHistory(Request $request)
    {
        $listData = Useravailability::groupBy('user_id')->with('user')->whereHas('user', function($q){
            $q->where('deleted_at',NULL);
        })->get();
        return Datatables::of($listData)->make(true);
    }

    public function adminChangePassword(Request $request, $id)
    {
        $update = User::find($id);
        try {
            $update->password = bcrypt($request->new_password);
            $update->save();
            return response()->json(['code' => Config::get('constants.SUCCESS'), 'success' => Lang::get('users.user_change_password')], 200);
        } catch (Exception $ex) {
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
