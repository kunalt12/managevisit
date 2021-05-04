<?php

namespace App\Notifications;

// use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
// use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class TourFeedback extends Notification
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
            $mailContent = $notifiable->mailContent;
            $mailContent = str_replace('</p>', '', $mailContent);
            $mailContentArray = explode('<p>', $mailContent);            
            if ($notifiable->mailSubject != '') {
                $send = (new MailMessage)->subject($notifiable->mailSubject);
            }else{
                $send = (new MailMessage)->subject('Feedback for Tour');
            }
            foreach ($mailContentArray as $line) {
                if (strpos(strtolower($line), 'jay swaminarayan!') !== false) {
                    $send->greeting($line);
                } else {
                    $send->line($line);
                }
            }
            $send->action('Click Here', url($url . 'tours/feedback/' . $notifiable->url));
        } else {
            $send = (new MailMessage)
                    ->subject('Feedback for Tour')
                    ->greeting('Jay Swaminarayan!')
                    ->line('Hope you all enjoyed a lot in tour.')
                    ->line('Your feedback are appreciated, please click on below link and provide us your feedback.')
                    ->action('Click Here', url($url . 'tours/feedback/' . $notifiable->url));
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
        return [
            //
        ];
    }
}
