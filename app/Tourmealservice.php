<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Model;
// use Illuminate\Database\Eloquent\SoftDeletes;

class Tourmealservice extends Model
{
    use Notifiable;
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'tourmealservices';

    public function meal()
    {
        return $this->belongsTo('App\Meal', 'id')->withTrashed();
    }

    public function mealServiceLocation()
    {
        return $this->belongsTo('App\Mealservicelocation', 'id')->withTrashed();
    }

    public function mealServiceType()
    {
        return $this->belongsTo('App\Mealservicetype', 'id')->withTrashed();
    }
}
