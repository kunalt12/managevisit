<?php
// namespace App\Helpers;

use Illuminate\Support\Facades\Lang;

/**
 * Send Notification function.
 * @param        $params
 * @return bool
 */
function sendNotification($params) {
    if(isset($params['user_id'])) {
        $userId = $params['user_id'];
    }
    else {
        $user = JWTAuth::parseToken()->authenticate();
        $userId = $user->id;
    }
    
    foreach($params['receiver_id'] as $receiver) {
        $saveNoti = new \App\Notification();
        $saveNoti->user_id = $userId;
        $saveNoti->receiver_id = $receiver;
        $saveNoti->notification_type = $params['notification_type'];
        $saveNoti->message = $params['message'];
        $saveNoti->is_read = 0;
        $saveNoti->data = $params['data'];
        $saveNoti->save();
    }
    return true;
}

/**
 * Get Header notification and unread notification count.
 * @param        $params
 * @return Notification array and count
 */

 /****************************************************************************************
    If in template replace variable in description
    {sender_} 
    {}
 ****************************************************************************************/
function getNotificationForHeader($dataType) {
    $user = JWTAuth::parseToken()->authenticate();
    
    if($dataType['type'] == 'header') {
        $getNotification = \App\Notification::where(['receiver_id' => $user->id, 'is_read' => 0])->orderBy('is_read')->limit(10)->latest()->with('user')->get();
    }
    else {
        $getNotification = \App\Notification::where(['receiver_id' => $user->id])->with('user')->get();
    }
    return $getNotification;
}

function getNotificationForHeaderList() {
    $user = JWTAuth::parseToken()->authenticate();
    
    $dataType = ['type' => 'header'];
    $norificationData = getNotificationForHeader($dataType);
    
    $getNotification = \App\Notification::where(['receiver_id' => $user->id, 'is_read' => 0])->get();
    $data = [
        'message' => $norificationData,
        'count' => sizeof($getNotification)
    ];
    return $data;
}