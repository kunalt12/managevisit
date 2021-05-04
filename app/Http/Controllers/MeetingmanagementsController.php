<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Meetingmanagement;
use Yajra\Datatables\Datatables;
use JWTAuth;
use JWTAuthException;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Config;

class MeetingmanagementsController extends Controller
{
    /**
     * Display the datatables
     * @param Request $request
     * @return JSON 
     */
    public function showDataTable(Request $request) {
        $listData = Meetingmanagement::with('meetingmanagement')->get();
       
       for ($i=0; $i < sizeof($listData); $i++) { 
                $listData[$i]['meetingdata'] = $listData[$i]['visitor'];
        }

        return Datatables::of($listData)->make(true);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function checkByPhone(Request $request)
    {
        $find = Meetingmanagement::where('first_name', 'LIKE', "%".$request->search_value."%")
                                    ->orWhere('last_name', 'LIKE', "%".$request->search_value."%")
                                   ->orWhere('email', 'LIKE', "%".$request->search_value."%"    )
                                   ->orWhere('mobile', 'LIKE', "%".$request->search_value."%")->get();
        return response()->json(['code' => Config::get('constants.SUCCESS'), 'data' => $find], 200);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function getAllData()
    {
        $activeData = Meetingmanagement::withTrashed()->get();
        return response()->json(['code' => Config::get('constants.SUCCESS'), 'data' => $activeData], 200);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $find = Meetingmanagement::get();
        return response()->json(['code' => Config::get('constants.SUCCESS'), 'data' => $find], 200);
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
        $userAuth = JWTAuth::parseToken()->authenticate();

        $checkExist = Meetingmanagement::where(['email' => $request->email])->count();
        if($checkExist != 0) {
            return response()->json(['code' => Config::get('constants.DUPLICATE'), 'error' => Lang::get('meetingmanagement.duplicateentry')], 422);
        }

        try {
            // Save Refference
            $add = new Meetingmanagement();
            $add->name = $request->name;
            $add->first_name = $request->first_name;
            $add->last_name = $request->last_name;
            $add->email = $request->email;
            $add->mobile = $request->mobile;
            $add->meetingtime_hour = $request->meetingtime_hour;
            $add->meetingtime_min = $request->meetingtime_min;
            $add->meetingtime_format = $request->meetingtime_format;
            
            $add->save();
            return response()->json(['code' => Config::get('constants.SUCCESS'), 'success' => Lang::get('meetingmanagement.add')], 200);
        } catch (\Exception $ex) {
            if ($ex instanceof QueryException) {
                return response()->json(['code' => Config::get('constants.DUPLICATE'), 'error' => Lang::get('meetingmanagement.duplicateentry')], 422);
            } else {
                return response()->json(['code' => Config::get('constants.ERROR'), 'error' => Lang::get('meetingmanagement.someproblems')], 422);
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
        $find = Meetingmanagement::where("id", $id)->first();
        if (empty($find)) {
            return response()->json(['code' => Config::get('constants.NO_DATE_FOUND'), 'error' => Lang::get('meetingmanagement.notfind')], 422);
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
        $update = Meetingmanagement::find($id);

        if (empty($update)) {
            return response()->json(['code' => Config::get('constants.NO_DATA_FOUND'), 'error' => Lang::get('meetingmanagement.notfind')], 422);
        }

        $checkExist = Meetingmanagement::where(['email'=> $request->email])->whereNotIn('id',[$id])->count();
        if($checkExist != 0) {
            return response()->json(['code' => Config::get('constants.DUPLICATE'), 'error' => Lang::get('meetingmanagement.duplicateemailentry')], 422);
        }

        $checkExist = Meetingmanagement::where('mobile',  $request->mobile)->whereNotIn('id',[$id])->count();
        if($checkExist != 0) {
            return response()->json(['code' => Config::get('constants.DUPLICATE'), 'error' => Lang::get('meetingmanagement.duplicateentry')], 422);
        }
        
        try {
            $update->name = $request->name;
            $update->first_name = $request->first_name;
            $update->last_name = $request->last_name;
            $update->email = $request->email;
            $update->mobile = $request->mobile;
            $update->meetingtime_hour = $request->meetingtime_hour;
            $update->meetingtime_min = $request->meetingtime_min;
            $update->meetingtime_format = $request->meetingtime_format;
            $update->save();
            return response()->json(['code' => Config::get('constants.SUCCESS'), 'success' => Lang::get('meetingmanagement.update')], 200);
        } catch (Exception $ex) {
            dd($ex->getMessage());
            return response()->json(['code' => Config::get('constants.ERROR'), 'error' => Lang::get('meetingmanagement.someproblems')], 422);
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
            Meetingmanagement::where('id', $id)->delete();
            return response()->json(['code' => Config::get('constants.SUCCESS'), 'success' => Lang::get('meetingmanagement.delete')], 200);
        }
        else {
            return response()->json(['code' => Config::get('constants.NO_DATA_FOUND'), 'error' => Lang::get('meetingmanagement.notfind')], 422);
        }
    }
}
