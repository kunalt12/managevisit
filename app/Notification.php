<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Notification extends Model
{
    use Notifiable,
        SoftDeletes;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'notifications';

    public function user() {
        return $this->belongsTo('App\User', 'user_id');
    }

    // public function receiver() {
    //     return $this->belongsTo('App\User', 'receiver_id');
    // }
}
