<?php

namespace App\Notifications;

// use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
// use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class Tourstatus extends Notification {
    // use Queueable;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct() {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable) {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable) {
        $mailContent = $notifiable->mailContent;
        $mailContent = str_replace('</p>', '', $mailContent);
        $mailContent = str_replace('{visitorname}', $notifiable->visitorname, $mailContent);
        $mailContent = str_replace('{tourname}', $notifiable->tourName, $mailContent);
        $mailContent = str_replace('{tourstatus}', $notifiable->tourStatus, $mailContent);
        
        $mailContent = str_replace('{startdate}', $notifiable->startdate, $mailContent);
        $mailContent = str_replace('{manageremail}', $notifiable->manageremail, $mailContent);
        $mailContent = str_replace('{managerphone}', $notifiable->managerphone, $mailContent);
        $mailContent = str_replace('{tourmanager}', $notifiable->tourmanager, $mailContent);

        $mailContent = str_replace('{tourmember}', $notifiable->tourmember, $mailContent);
            
        $mailContentArray = explode('<p>', $mailContent);
        if ($notifiable->mailSubject != '') {
            $send = (new MailMessage)->subject($notifiable->mailSubject);
        } else {
            $send = (new MailMessage)->subject('Tour Status Information');
        }
        if(isset($notifiable->cc) && $notifiable->cc!='') {
            $send->cc = $notifiable->cc;
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
        
        return $send;
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable) {
        return [];
    }

}
