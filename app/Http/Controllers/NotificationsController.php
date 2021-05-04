<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Notification;
use Yajra\Datatables\Datatables;
use JWTAuth;
use JWTAuthException;
use Carbon\Carbon;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Config;

class NotificationsController extends Controller
{
    /**
     * Display the datatables
     * @param Request $request
     * @return JSON 
     */
    public function showDataTable(Request $request) {
        $dataType = ['type' => 'list'];
        $feedbackData = getNotificationForHeader($dataType);
        $this->readToNotification();
        return Datatables::of($feedbackData)->make(true);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $dataType = ['type' => 'list'];
        $feedbackData = getNotificationForHeader($dataType);
        $this->readToNotification();
        return Datatables::of($feedbackData)
                        ->make(true);
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

    /**
     * Get Notification for header
     */
    public function getRecentNotification(){
        $dataType = ['type' => 'header'];
        $notificationMessages = getNotificationForHeader($dataType);
        return response()->json(['notifications' =>$notificationMessages, 'count' => sizeof($notificationMessages)], 200);
    }

    public function readToNotification() {
        $user = JWTAuth::parseToken()->authenticate();
        $notification = Notification::where(['receiver_id' => $user->id, 'is_read' => 0])->update(['is_read' => 1]);
    }

    public function markReadToNotification(Request $request) {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            $notification = Notification::where(['receiver_id' => $user->id, 'is_read' => 0])->update(['is_read' => 1]);
            return response()->json(['success' => 'clear'], 200);
        } catch(\Exception $ex) {
            return response()->json(['code' => Config::get('constants.ERROR'), 'error' => Lang::get('tour.someproblems')], 422);
        }
    }
}
