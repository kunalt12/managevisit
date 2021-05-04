<?php

namespace App\Notifications;

// use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
// use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class Tourconfirmation extends Notification
{
    // use Queueable;
    
    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct() 
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        if($_SERVER['HTTP_HOST'] == 'localhost' || $_SERVER['HTTP_HOST'] == '127.0.0.1') {
            $url = 'http://'.$_SERVER['HTTP_HOST'].':3000/#/';
        }
        else if($_SERVER['HTTP_HOST'] == '180.211.99.165:8080') {
            $url = 'http://'.$_SERVER['HTTP_HOST'].':8080/rajan/TourManagement/public/#/';
        }
        else {
            $url = 'https://'.$_SERVER['HTTP_HOST'].'/#/';
        }
        
        if ($notifiable->mailContent != '') {
//            print_r($notifiable->cc);die;
            $mailContent = $notifiable->mailContent;
            $mailContent = str_replace('</p>', '', $mailContent);
            $mailContent = str_replace('{startdate}', $notifiable->start_date, $mailContent);
            $mailContent = str_replace('{manageremail}', $notifiable->manageremail, $mailContent);
            $mailContent = str_replace('{managerphone}', $notifiable->managerphone, $mailContent);
            $mailContent = str_replace('{tourmanager}', $notifiable->tourmanager, $mailContent);
            $mailContent = str_replace('{visitorname}', $notifiable->visitorname, $mailContent);
            $mailContent = str_replace('{tourmember}', $notifiable->tourmember, $mailContent);
            $mailContentArray = explode('<p>', $mailContent);
            
            if ($notifiable->mailSubject != '') {
                $send = (new MailMessage)->subject($notifiable->mailSubject);
            }else{
                $send = (new MailMessage)->subject('Welcome to Tour Management');
            }
            if($notifiable->cc) {
                $send->cc($notifiable->cc);
            }
            if(isset($notifiable->reply_to) && $notifiable->reply_to!='') {
                $send->replyTo($notifiable->reply_to, $notifiable->reply_toname);
            }
            
            foreach ($mailContentArray as $line) {
                if (strpos(strtolower($line), 'jay swaminarayan!') !== false) {
                    $send->greeting($line);
                } else {
                    $send->line($line);
                }
                
            }
            if(isset($notifiable->maillink) && $notifiable->maillink=='blank') {
                //do not send link to the tour contact person
            } else {
                $send->action('Click Here', url($url . 'tours/acknowledge/' . $notifiable->url));
            }
        } else {
                            

            $send = (new MailMessage)
                    ->subject('New Tour Assignment')
                    ->greeting('Dear ' . $notifiable->tourmanager . ':')
                    ->line('You have been assigned to be a Tour Manager for ' . $notifiable->tourName . 'on date: ' . $notifiable->start_date)
                    ->line('Please review this tour by clicking the link below or on TMS.  If you are not available please email the Tour Admin at your earliest.')
                    ->line('We appreciate your service.')
                    ->line('Thank you.')
                    ->action('Click Here', url($url . 'tours/acknowledge/' . $notifiable->url));
            // ->line('Thank you.');
        }
        return $send;
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [];
    }
}
