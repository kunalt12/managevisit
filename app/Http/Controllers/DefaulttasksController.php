<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Defaulttask;
use Yajra\Datatables\Datatables;
use JWTAuth;
use JWTAuthException;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Config;

class DefaulttasksController extends Controller
{
    /**
     * Display the datatables
     * @param Request $request
     * @return JSON 
     */
    public function showDataTable(Request $request) {
        $listData = Defaulttask::all();
        return Datatables::of($listData)->make(true);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function getAllData()
    {
        $activeData = Defaulttask::withTrashed()->get();
        return response()->json(['code' => Config::get('constants.SUCCESS'), 'data' => $activeData], 200);
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

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try {
            // Save Meal
            $add = new Defaulttask();
            $add->task = $request->task;
            $add->status = $request->status;
            $add->tourtype_id = $request->tourtype_id;
            $add->save();
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
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $listData = Defaulttask::where('tourtype_id', $id)->get();
        return response()->json(['code' => Config::get('constants.SUCCESS'), 'data' => $listData], 200);
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
        $update = Defaulttask::find($id);
        if (empty($update)) {
            return response()->json(['code' => Config::get('constants.NO_DATA_FOUND'), 'error' => Lang::get('defaulttask.notfind')], 422);
        }
        
        try {
            $update->task = $request->task;
            $update->status = $request->status;
            $update->save();
            return response()->json(['code' => Config::get('constants.SUCCESS'), 'success' => Lang::get('defaulttask.update'), 'data' => $update], 200);
        } catch (Exception $ex) {
            return response()->json(['code' => Config::get('constants.ERROR'), 'error' => Lang::get('defaulttask.someproblems')], 422);
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
            Defaulttask::where('id', $id)->delete();
            return response()->json(['code' => Config::get('constants.SUCCESS'), 'success' => Lang::get('defaulttask.delete')], 200);
        }
        else {
            return response()->json(['code' => Config::get('constants.NO_DATA_FOUND'), 'error' => Lang::get('defaulttask.notfind')], 422);
        }
    }
}
