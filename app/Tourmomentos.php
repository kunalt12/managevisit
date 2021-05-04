<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Model;

class Tourmomentos extends Model
{
    use Notifiable;
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'tourmomentos';

    public function momentos()
    {
        return $this->belongsTo('App\Momento', 'momento_id')->withTrashed();
    }
}
