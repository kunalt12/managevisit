<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Model;
// use Illuminate\Database\Eloquent\SoftDeletes;

class Tourvisitor extends Model
{
    use Notifiable;
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'tour_visitors';

    public function contactmanager()
    {
        return $this->hasOne('App\Contactmanagement', 'id', 'visitor_id');
    }
}
