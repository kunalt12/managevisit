<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Contactmanagement;
use Yajra\Datatables\Datatables;
use JWTAuth;
use JWTAuthException;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Config;

class ContactmanagementsController extends Controller
{
    /**
     * Display the datatables
     * @param Request $request
     * @return JSON 
     */
    public function showDataTable(Request $request) {
        $listData = Contactmanagement::where('company_id',auth()->user()->company_id)->with('organizationdata','visitor')->get();
       
       for ($i=0; $i < sizeof($listData); $i++) { 
            if($listData[$i]['visitor'] == null) {
                $listData[$i]['visitordata'] = array('name' => '-');
            }
            else {
                $listData[$i]['visitordata'] = $listData[$i]['visitor'];
            }
        }

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
        ->make(true);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function checkByPhone(Request $request)
    {
        // $find = Contactmanagement::where($request->search_key, $request->search_value)->first();
        $find = Contactmanagement::where('first_name', 'LIKE', "%".$request->search_value."%")
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
        $activeData = Contactmanagement::withTrashed()->get();
        return response()->json(['code' => Config::get('constants.SUCCESS'), 'data' => $activeData], 200);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $find = Contactmanagement::get();
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
//        echo '<pre>';print_r($request);die;
        $userAuth = JWTAuth::parseToken()->authenticate();

        $checkExist = Contactmanagement::where(['email' => $request->email])->count();
        if($checkExist != 0) {
            return response()->json(['code' => Config::get('constants.DUPLICATE'), 'error' => Lang::get('contactmanagement.duplicateentry')], 422);
        }

        try {
            // Save Meal
            $add = new Contactmanagement();
            $add->name = $request->first_name . " " . $request->last_name;
            $add->organization_id = $request->organization_id;
            $add->visitor_type = $request->visitor_type;
            $add->first_name = $request->first_name;
            $add->middle_name = $request->middle_name;
            $add->last_name = $request->last_name;
            $add->email = $request->email;
            $add->mobile = $request->mobile;
            $add->phone_number = $request->phone_number;
            $add->gender = $request->gender;
            $add->status = $request->status;
            $add->organization = $request->organization;
            $add->visitor_notes = $request->visitor_notes;

            $add->address = $request->address;
            $add->address1 = $request->address1;
            $add->country_id = $request->country_id;
            $add->state = $request->state;
            $add->city = $request->city;
            $add->zip_code = $request->zip_code;
            $add->company_id = auth()->user()->company_id; 
            $add->save();
            return response()->json(['code' => Config::get('constants.SUCCESS'), 'success' => Lang::get('contactmanagement.add')], 200);
        } catch (\Exception $ex) {
            if ($ex instanceof QueryException) {
                return response()->json(['code' => Config::get('constants.DUPLICATE'), 'error' => Lang::get('contactmanagement.duplicateentry')], 422);
            } else {
                return response()->json(['code' => Config::get('constants.ERROR'), 'error' => Lang::get('contactmanagement.someproblems')], 422);
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
        $find = Contactmanagement::where("id", $id)->with('organizationdata','visitor','country')->first();
        if (empty($find)) {
            return response()->json(['code' => Config::get('constants.NO_DATE_FOUND'), 'error' => Lang::get('contactmanagement.notfind')], 422);
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
        $update = Contactmanagement::find($id);

        if (empty($update)) {
            return response()->json(['code' => Config::get('constants.NO_DATA_FOUND'), 'error' => Lang::get('contactmanagement.notfind')], 422);
        }

        $checkExist = Contactmanagement::where(['email'=> $request->email])->whereNotIn('id',[$id])->count();
        if($checkExist != 0) {
            return response()->json(['code' => Config::get('constants.DUPLICATE'), 'error' => Lang::get('contactmanagement.duplicateemailentry')], 422);
        }

        $checkExist = Contactmanagement::where('mobile',  $request->mobile)->whereNotIn('id',[$id])->count();
        if($checkExist != 0) {
            return response()->json(['code' => Config::get('constants.DUPLICATE'), 'error' => Lang::get('contactmanagement.duplicateentry')], 422);
        }
        
        try {
            $update->name = $request->first_name . " " . $request->last_name;
            $update->organization_id = $request->organization_id;
            $update->visitor_type = $request->visitor_type;
            $update->first_name = $request->first_name;
            $update->middle_name = $request->middle_name;
            $update->last_name = $request->last_name;
            $update->email = $request->email;
            $update->mobile = $request->mobile;
            $update->phone_number = $request->phone_number;
            $update->gender = $request->gender;
            $update->status = $request->status;
            $update->organization = $request->organization;
            $update->visitor_notes = $request->visitor_notes;
            $update->address = $request->address;
            $update->address1 = $request->address1;
            $update->country_id = $request->country_id;
            $update->state = $request->state;
            $update->city = $request->city;
            $update->zip_code = $request->zip_code;
            $update->save();
            return response()->json(['code' => Config::get('constants.SUCCESS'), 'success' => Lang::get('contactmanagement.update')], 200);
        } catch (Exception $ex) {
            dd($ex->getMessage());
            return response()->json(['code' => Config::get('constants.ERROR'), 'error' => Lang::get('contactmanagement.someproblems')], 422);
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
            Contactmanagement::where('id', $id)->delete();
            return response()->json(['code' => Config::get('constants.SUCCESS'), 'success' => Lang::get('contactmanagement.delete')], 200);
        }
        else {
            return response()->json(['code' => Config::get('constants.NO_DATA_FOUND'), 'error' => Lang::get('contactmanagement.notfind')], 422);
        }
    }
}
