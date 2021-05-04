<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Tourtype;
use App\Defaulttask;
use App\Tourtask;
use App\Tour;
use Yajra\Datatables\Datatables;
use JWTAuth;
use JWTAuthException;

use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Config;

class TourtypesController extends Controller
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
        $listData = Tourtype::where('company_id',$this->user['company_id'])->orderBy('name', 'ASC')->with('defaulttask')->get();
        return Datatables::of($listData)->make(true);
    }

    /**
     * Display a listing of the resource.
     * Get all type for default task
     * @return \Illuminate\Http\Response
     */
    public function getAllTourType()
    {
        $listData = Tourtype::where('company_id',$this->user['company_id'])->orderBy('name', 'ASC')->with('defaulttask')->get();
        return response()->json(['code' => Config::get('constants.SUCCESS'), 'data' => $listData], 200);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function getAllData()
    {
        $activeData = Tourtype::where('company_id',$this->user['company_id'])->orderBy('name', 'ASC')->withTrashed()->get();
        return response()->json(['code' => Config::get('constants.SUCCESS'), 'data' => $activeData], 200);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $activeData = Tourtype::where([['status', '=', '1'],['company_id','=',$this->user['company_id']]])->orderBy('name', 'ASC')->get();
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
        $checkDuplicate = Tourtype::where(strtolower('name'), strtolower($request->name))->first();
        if($checkDuplicate != null) {
            return response()->json(['code' => Config::get('constants.DUPLICATE'), 'error' => Lang::get('tourtypes.duplicateentry')], 422);
        }
        try {
            // Save Meal
            $add = new Tourtype();
            $add->name = $request->name;
            $add->status = $request->status;
            $add->company_id = $this->user['company_id']; 
            $add->save();
            return response()->json(['code' => Config::get('constants.SUCCESS'), 'success' => Lang::get('tourtypes.add')], 200);
        } catch (\Exception $ex) {
            if ($ex instanceof QueryException) {
                return response()->json(['code' => Config::get('constants.DUPLICATE'), 'error' => Lang::get('tourtypes.duplicateentry')], 422);
            } else {
                return response()->json(['code' => Config::get('constants.ERROR'), 'error' => Lang::get('tourtypes.someproblems')], 422);
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
        $viewData = Tourtype::where('id', $id)->with('defaulttask')->first();
        return response()->json(['code' => Config::get('constants.SUCCESS'), 'data' => $viewData], 200);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $find = Tourtype::find($id);
        if (empty($find)) {
            return response()->json(['code' => Config::get('constants.NO_DATA_FOUND'), 'error' => Lang::get('tourtypes.notfind')], 422);
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
        $checkDuplicate = Tourtype::where('id', '!=', $id )->where([strtolower('name') => strtolower($request->name)])->first();
        if($checkDuplicate != null) {
            return response()->json(['code' => Config::get('constants.DUPLICATE'), 'error' => Lang::get('tourtypes.duplicateentry')], 422);
        }
        
        $update = Tourtype::find($id);
        if (empty($update)) {
            return response()->json(['code' => Config::get('constants.NO_DATA_FOUND'), 'error' => Lang::get('tourtypes.notfind')], 422);
        }
        
        try {
            $update->name = $request->name;
            $update->status = $request->status;
            $update->save();
            return response()->json(['code' => Config::get('constants.SUCCESS'), 'success' => Lang::get('tourtypes.update')], 200);
        } catch (Exception $ex) {
            return response()->json(['code' => Config::get('constants.ERROR'), 'error' => Lang::get('tourtypes.someproblems')], 422);
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
            /*$taskData = Tourtask::where('tourtype_id', $id)->get();
            for($i = 0; $i< sizeof($taskData); $i++) {
                Tourtask::where('id', $taskData[$i]['id'])->delete();
            }

            $activeData = Defaulttask::where('tourtype_id', $id)->get();
            for($i = 0; $i< sizeof($activeData); $i++) {
                Defaulttask::where('id', $activeData[$i]['id'])->delete();
            }

            $activeData = Tour::where('tourtype_id', $id)->withTrashed()->get();
            for($i = 0; $i< sizeof($activeData); $i++) {
                $update = $activeData[$i];
                $update->tourtype_id = null;
                $update->save();
            }*/
            
            Tourtype::where('id', $id)->delete();
            return response()->json(['code' => Config::get('constants.SUCCESS'), 'success' => Lang::get('tourtypes.delete')], 200);
        }
        else {
            return response()->json(['code' => Config::get('constants.NO_DATA_FOUND'), 'error' => Lang::get('tourtypes.notfind')], 422);
        }
    }
}