<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\ApiManagements;
use Yajra\Datatables\Datatables;
use JWTAuth;
use JWTAuthException;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Config;

class ApiManagementsController extends Controller
{

    /**
     * Display the datatables
     * @param Request $request
     * @return JSON 
     */
    public function showDataTable(Request $request) {
        $listData = ApiManagements::all();
        return Datatables::of($listData)->make(true);
    }

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

    /*
     * Check company slug if already exist or not
     * If slug is exist then give new slug.
     */
    function checkSlug($data) {
        $checkDuplicate = ApiManagements::where([strtolower('slug') => strtolower($data)])->first();
        if($checkDuplicate != null) {
            $data = $checkDuplicate->slug."1";
            return $this->checkSlug($data);
        } else {
            return $data;
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $str = strtolower($request->name);
        $request->slug = preg_replace('/\s+/', '-', $str);
        $request->slug = substr($request->slug, 0, 15);
        $slug = $this->checkSlug($request->slug);
        
        $checkName = ApiManagements::where([strtolower('name') => strtolower($request->name)])->first();
        if($checkName != null) {
            return response()->json(['code' => Config::get('constants.DUPLICATE'), 'error' => Lang::get('apiManagement.duplicatename')], 422);
        }

        $checkDuplicate = ApiManagements::where('api_key', $request->api_key)->first();
        if($checkDuplicate != null) {
            return response()->json(['code' => Config::get('constants.DUPLICATE'), 'error' => Lang::get('apiManagement.duplicateentry')], 422);
        }

        try {
            // Save Api Management
            $add = new ApiManagements();
            $add->name = $request->name;
            $add->api_key = $request->api_key;
            $add->ipaddress = $request->ipaddress;
            $add->slug = $slug;
            $add->status = $request->status;
            $add->tour_manager = $request->tour_manager;
            $add->save();
            return response()->json(['success' => Lang::get('apiManagement.add')], 200);
        } catch (\Exception $ex) {
            if ($ex instanceof QueryException) {
                return response()->json(['code' => Config::get('constants.DUPLICATE'), 'error' => Lang::get('apiManagement.duplicateentry')], 422);
            } else {
                return response()->json(['code' => Config::get('constants.ERROR'), 'error' => Lang::get('apiManagement.someproblems')], 422);
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
        $find = ApiManagements::find($id);
        if (empty($find)) {
            return response()->json(['code' => Config::get('constants.NO_DATA_FOUND'), 'error' => Lang::get('apiManagement.notfind')], 422);
        }
        return response()->json(['data' => $find], 200);
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
        $update = ApiManagements::find($id);
        if (empty($update)) {
            return response()->json(['code' => Config::get('constants.NO_DATA_FOUND'), 'error' => Lang::get('apiManagement.notfind')], 422);
        }

        $checkName = ApiManagements::where('id', '!=', $id )->where([strtolower('name') => strtolower($request->name)])->first();
        if($checkName != null) {
            return response()->json(['code' => Config::get('constants.DUPLICATE'), 'error' => Lang::get('apiManagement.duplicatename')], 422);
        }

        $checkDuplicate = ApiManagements::where('id', '!=', $id )->where('api_key', $request->api_key)->first();
        if($checkDuplicate != null) {
            return response()->json(['code' => Config::get('constants.DUPLICATE'), 'error' => Lang::get('apiManagement.duplicateentry')], 422);
        }
        
        try {
            $update->name = $request->name;
            $update->api_key = $request->api_key;
            $update->ipaddress = $request->ipaddress;
            $update->status = $request->status;
            $update->tour_manager = $request->tour_manager;
            $update->save();
            return response()->json(['code' => Config::get('constants.SUCCESS'), 'success' => Lang::get('apiManagement.update')], 200);
        } catch (Exception $ex) {
            return response()->json(['code' => Config::get('constants.ERROR'), 'error' => Lang::get('apiManagement.someproblems')], 422);
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
            ApiManagements::where('id', $id)->delete();
            return response()->json(['code' => Config::get('constants.SUCCESS'), 'success' => Lang::get('apiManagement.delete')], 200);
        }
        else {
            return response()->json(['code' => Config::get('constants.NO_DATA_FOUND'), 'error' => Lang::get('apiManagement.notfind')], 422);
        }
    }
}
