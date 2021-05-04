<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Meetingmanagement extends Model
{
    use Notifiable,
        Updater,
        SoftDeletes;
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'meetingmanagement';


    public function refference() {
        return $this->belongsTo('App\Meeting')->withTrashed();
    }

}
