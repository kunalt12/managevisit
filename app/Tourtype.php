<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Tourtype extends Model
{
    use Notifiable,
        SoftDeletes;
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'tourtypes';

    public function defaulttask()
    {
        return $this->hasMany('App\Defaulttask', 'tourtype_id', 'id');
    }
}
