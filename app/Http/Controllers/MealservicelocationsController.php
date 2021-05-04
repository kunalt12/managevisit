<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Mealservicelocation;
use App\Tourmealservice;
use Yajra\Datatables\Datatables;
use JWTAuth;
use JWTAuthException;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Config;


class MealservicelocationsController extends Controller
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
    public function showDataTable(Request $request) {
        $listData = Mealservicelocation::where('company_id',$this->user['company_id']);
        return Datatables::of($listData)->make(true);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function getAllData()
    {
        $activeData = Mealservicelocation::withTrashed()->get();
        return response()->json(['code' => Config::get('constants.SUCCESS'), 'data' => $activeData], 200);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $activeData = Mealservicelocation::where([['status', '=', '1'],['company_id','=',$this->user['company_id']]])->get();
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

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $checkDuplicate = Mealservicelocation::where(strtolower('name'), strtolower($request->name))->first();
        if($checkDuplicate != null) {
            return response()->json(['code' => Config::get('constants.DUPLICATE'), 'error' => Lang::get('mealservicelocation.duplicateentry')], 422);
        }
        
        try {
            // Save Meal
            $add = new Mealservicelocation();
            $add->name = $request->name;
            $add->description = $request->description;
            $add->status = $request->status;
            $add->company_id = $this->user['company_id']; 
            $add->save();
            return response()->json(['code' => Config::get('constants.SUCCESS'), 'success' => Lang::get('mealservicelocation.add')], 200);
        } catch (\Exception $ex) {
            if ($ex instanceof QueryException) {
                return response()->json(['code' => Config::get('constants.DUPLICATE'), 'error' => Lang::get('mealservicelocation.duplicateentry')], 422);
            } else {
                return response()->json(['code' => Config::get('constants.ERROR'), 'error' => Lang::get('mealservicelocation.someproblems')], 422);
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
        $find = Mealservicelocation::find($id);
        if (empty($find)) {
            return response()->json(['code' => Config::get('constants.NO_DATA_FOUND'), 'error' => Lang::get('mealservicelocation.notfind')], 422);
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
        $checkDuplicate = Mealservicelocation::where('id', '!=', $id )->where([strtolower('name') => strtolower($request->name)])->first();
        if($checkDuplicate != null) {
            return response()->json(['code' => Config::get('constants.DUPLICATE'), 'error' => Lang::get('mealservicelocation.duplicateentry')], 422);
        }

        $update = Mealservicelocation::find($id);
        if (empty($update)) {
            return response()->json(['code' => Config::get('constants.NO_DATA_FOUND'), 'error' => Lang::get('mealservicelocation.notfind')], 422);
        }
        
        try {
            $update->name = $request->name;
            $update->description = $request->description;
            $update->status = $request->status;
            $update->save();
            return response()->json(['code' => Config::get('constants.SUCCESS'), 'success' => Lang::get('mealservicelocation.update')], 200);
        } catch (Exception $ex) {
            return response()->json(['code' => Config::get('constants.ERROR'), 'error' => Lang::get('mealservicelocation.someproblems')], 422);
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
            // Tourmealservice::where('meal_service_location_id', $id)->delete();
            Mealservicelocation::where('id', $id)->delete();
            return response()->json(['code' => Config::get('constants.SUCCESS'), 'success' => Lang::get('mealservicelocation.delete')], 200);
        }
        else {
            return response()->json(['code' => Config::get('constants.NO_DATA_FOUND'), 'error' => Lang::get('mealservicelocation.notfind')], 422);
        }
    }
}
