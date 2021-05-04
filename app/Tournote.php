<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Tournote extends Model
{
    use Updater;
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'tour_notes';

    public function tourNotesCreated()
    {
        return $this->belongsTo('App\User', 'created_by');
    }
}
