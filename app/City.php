<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class City extends Model {
    //

    /**
     * Get the state that owns the City.
     */
    public function state() {
        return $this->belongsTo('App\State');
    }

}
