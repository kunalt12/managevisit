<?php

namespace App\Notifications;
use App\Emailtemplates;
// use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
// use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class TourPending extends Notification
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
            $mailContent = str_replace('{startdate}', $notifiable->startdate, $mailContent);
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
            foreach ($mailContentArray as $line) {
                if (strpos(strtolower($line), 'jay swaminarayan!') !== false) {
                    $send->greeting($line);
                } else {
                    $send->line($line);
                }
            }
           
        } else {
            $template = Emailtemplates::where("title", 'Tour Acknowledgement')->first();
            $mailContent = $template->html_code;
            if($mailContent !='') {
                $mailContent = str_replace('</p>', '', $mailContent);
                $mailContent = str_replace('{startdate}', $notifiable->startdate, $mailContent);
                $mailContent = str_replace('{manageremail}', $notifiable->manageremail, $mailContent);
                $mailContent = str_replace('{managerphone}', $notifiable->managerphone, $mailContent);
                $mailContent = str_replace('{tourmanager}', $notifiable->tourmanager, $mailContent);
                $mailContent = str_replace('{visitorname}', $notifiable->visitorname, $mailContent);
                $mailContent = str_replace('{tourmember}', $notifiable->visitorname, $mailContent);
                
                $mailContentArray = explode('<p>', $mailContent);
                if ($notifiable->mailSubject != '') {
                    $send = (new MailMessage)->subject($notifiable->mailSubject);
                }else{
                $send = (new MailMessage)->subject('Welcome to Tour Management');
                }
                foreach ($mailContentArray as $line) {
                    if (strpos(strtolower($line), 'jay swaminarayan!') !== false) {
                        if($notifiable->greeting!='no') {
                            $send->greeting($line);
                        } else {
                            $send->line($line);
                        }
                    } else {
                        $send->line($line);
                    }
                }
            } else {
            
            $send = (new MailMessage)
                    ->subject('Welcome to Tour Management')
                    ->greeting('Jay Swaminarayan!')
                    ->line('As per your request, we have registered your Tour with our system on date: ' . $notifiable->start_date)
                    ->line('Your tour has been recieved but NOT acknowledged. We will let you know once your tour is acknowledged.')
            ->line('Thank you.');
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
    public function toArray($notifiable)
    {
        return [];
    }
}
