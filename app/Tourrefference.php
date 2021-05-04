<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Model;
// use Illuminate\Database\Eloquent\SoftDeletes;

class Tourrefference extends Model
{
    use Notifiable;
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'tour_refference';  

    public function refferencemanager()
    {
        return $this->hasOne('App\Refferencemanagement', 'id', 'refference_id');
    }
}
