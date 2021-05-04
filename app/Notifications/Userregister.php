<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class Userregister extends Notification
{
    use Queueable;

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
            $mailContent = str_replace('{rolename}', $notifiable->role->name, $mailContent);
            $mailContentArray = explode('<p>', $mailContent);
            if ($notifiable->mailSubject != '') {
                $send = (new MailMessage)->subject($notifiable->mailSubject);
            }else{
                $send = (new MailMessage)->subject('Welcome to Tour Management');
            }
            foreach ($mailContentArray as $line) {
                if (strpos(strtolower($line), 'jay swaminarayan!') !== false) {
                    $send->greeting($line);
                } else {
                    $send->line($line);
                }
            }
            $send->action('Click Here to login', url($url . 'login'))
                 ->line('Email: ' . $notifiable->email)
                 ->line('Password: ' . $notifiable->password);
        } else {
            $send = (new MailMessage)
                    ->subject('Welcome to Tour Management')
                    ->greeting('Jay Swaminarayan!')
                    ->line('Welcome to Tour Management System')
                    ->line('We have added you as ' . $notifiable->role->name . ' in tour management')
                    ->line('Login details are as below.')
                    ->action('Click Here to login', url($url . 'login'))
                    ->line('Email: ' . $notifiable->email)
                    ->line('Password: ' . $notifiable->password);
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
        return [
            //
        ];
    }
}
