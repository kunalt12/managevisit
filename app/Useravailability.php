<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Useravailability extends Model
{
    use Notifiable,
        SoftDeletes;
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'useravailabilities';

    public function user()
    {
        return $this->belongsTo('App\User', 'user_id')->withTrashed();
    }
}
