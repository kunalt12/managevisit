<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
//use App\Tour;
//use App\Tourtask;
//use App\Tournote;
//use App\Tourvisitor;
//use App\Tourrefference;
//use App\Tourmeeting;
//use App\Documentlink;
//use App\Contactmanagement;
//use App\Refferencemanagement;
//use App\Meetingmanagement;
//use App\Tourmealservice;
//use App\Tourhistory;
//use App\Tourfeedbacks;
//use App\Tourmomentos;
//
//use App\Setting;
//
//use Yajra\Datatables\Datatables;
//use JWTAuth;
//use JWTAuthException;
//use Carbon\Carbon;
//use Illuminate\Support\Facades\Lang;
//use Illuminate\Support\Facades\Config;
//
//use App\Notifications\Tourconfirmation;
//use App\Notifications\TourRemainder;
//use App\Notifications\TourFeedback;
//use App\Notifications\Tourstatus;
//
//use DB;

class NotificationcronController extends Controller
{
    

    /**
     * Tour Notification Cron:
     * Send notification/remainder for upcoming tour
     * Send 1 day ago notification/remainder
     * Send 1 week ago notification/remainder
     * Everyday run  at 12:15 AM
     */
    public function tourNotificationCron2(Request $request)
    {
       // $userAuth = JWTAuth::parseToken()->authenticate();

        /** Current date */
        $currentDay = Carbon::today()->toDateString();
        $tomorrow = date("Y-m-d", strtotime("+1 days"));
        $week = date("Y-m-d", strtotime("+7 days"));
        echo '<pre>';print_r($currentDay);die;
        /* Send mail to contact manager and send notification to all related user */
        $tomorrowData = Tour::whereDate('start_date', '=', $tomorrow)->where('status', 2)->with('tourVisitors')->get();
        
        for ($i=0; $i < sizeof($tomorrowData); $i++) {
            /* Send email to contact manager */        
            for ($t=0; $t < sizeof($tomorrowData[$i]['tourVisitors']); $t++) {
                if($tomorrowData[$i]['tourVisitors'][$t]['is_tour_admin'] == 1) {
                    $getVisitor = Contactmanagement::where("id", $tomorrowData[$i]['tourVisitors'][$t]['visitor_id'])->first();
                    $tomorrowData['contact_person'] = $getVisitor;
                }
            }

            $message = '';
            $userAuth->email = $tomorrowData['contact_person']['email'];
            $userAuth->start_date = $tomorrow;
            $userAuth->remainder_for = 'tomorrow';
            $userAuth->notify(new TourRemainder());
            
            /* Send notification to related user */
            $totalUserId = array();
            if($tomorrowData[$i]->manager) {
                array_push($totalUserId, $tomorrowData[$i]->manager);
            }

            $taskUser = Tourtask::where(['tour_id' => $tomorrowData[$i]->id, 'acknowledge' => 1])->get(['user_id']);
            for ($k=0; $k < sizeof($taskUser); $k++) {
                array_push($totalUserId, $taskUser[$k]['user_id']);
            }

            $mealsUser = Tourmealservice::where(['tour_id' => $tomorrowData[$i]->id])->get(['catering_manager']);
            for ($p=0; $p < sizeof($mealsUser); $p++) {
                array_push($totalUserId, $mealsUser[$p]['catering_manager']);
            }
            
            $totalVolunteer = array_unique($totalUserId);            
            $replaceArray = [
                'TourName' => $tomorrowData[$i]->name,
                'Date' => $tomorrowData[$i]->start_date
            ];
            
            $notificationMessage = trans('notification_template.remainder_message', $replaceArray);
            $notificationData = [
                'message' => $notificationMessage,
                'notification_type' => 'tour',
                'user_id' => Config::get('constants.ADMIN_ID'),
                'receiver_id' => $totalVolunteer,
                'data' => '',
            ];
            sendNotification($notificationData);
        }

        $weekData = Tour::whereDate('start_date', '==', $week)->where('status', 2)->get();
        for ($i=0; $i < sizeof($weekData); $i++) {
            /* Send email to contact manager */
            for ($t=0; $t < sizeof($weekData[$i]['tourVisitors']); $t++) { 
                if($weekData[$i]['tourVisitors'][$t]['is_tour_admin'] == 1) {
                    $getVisitor = Contactmanagement::where("id", $weekData[$i]['tourVisitors'][$t]['visitor_id'])->first();
                    $weekData['contact_person'] = $getVisitor;
                }
            }

            $message = '';
            $userAuth->email = $weekData['contact_person']['email'];
            $userAuth->start_date = $tomorrow;
            $userAuth->remainder_for = 'week';
            $userAuth->notify(new TourRemainder());

            /* Send notification to related user */
            $totalUserId = array();
            if($tomorrowData[$i]->manager) {
                array_push($totalUserId, $tomorrowData[$i]->manager);
            }

            $taskUser = Tourtask::where(['tour_id' => $tomorrowData[$i]->id, 'acknowledge' => 1])->get(['user_id']);
            for ($k=0; $k < sizeof($taskUser); $k++) {
                array_push($totalUserId, $taskUser[$k]['user_id']);
            }

            $mealsUser = Tourmealservice::where(['tour_id' => $tomorrowData[$i]->id])->get(['catering_manager']);
            for ($p=0; $p < sizeof($mealsUser); $p++) {
                array_push($totalUserId, $mealsUser[$p]['catering_manager']);
            }
            
            $totalVolunteer = array_unique($totalUserId);            
            $replaceArray = [
                'TourName' => $tomorrowData[$i]->name,
                'Date' => $tomorrowData[$i]->start_date
            ];
            
            $notificationMessage = trans('notification_template.remainder_message', $replaceArray);
            $notificationData = [
                'message' => $notificationMessage,
                'notification_type' => 'tour',
                'user_id' => Config::get('constants.ADMIN_ID'),
                'receiver_id' => $totalVolunteer,
                'data' => '',
            ];
            sendNotification($notificationData);
        }
        echo "<script type='text/javascript'>window.setTimeout(CloseMe, 45000);function CloseMe() {window.open('','_self','');window.close();}</script>";
    }

}