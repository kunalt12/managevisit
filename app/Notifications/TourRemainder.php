<?php

namespace App\Notifications;

// use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
// use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class TourRemainder extends Notification
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
        $firstLine= 'Dear '.$notifiable['name'].',';
        if($notifiable['remainder_for'] == 'tomorrow') {
            $secondline = "It's only a day away for your tour: " .$notifiable['tourName'];
        }
        else if($notifiable['remainder_for'] == 'beforehour') {
            $secondline = "It's only an hour away for your tour: " .$notifiable['tourName'];
        }
        else {
            $secondline = "It's only a week away for your tour: " .$notifiable['tourName'];
        }
        

        $send =  (new MailMessage)
            ->subject('BAPS: Tour Reminder')
            ->greeting('Jay Swaminarayan!')
            ->line($firstLine)
            ->line($secondline)
            ->line('This is the reminder mail that your tour is going to start '.$notifiable['start_date'].'.');
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
