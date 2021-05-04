<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class State extends Model {
    //

    /**
     * Get the country that owns the state.
     */
    public function country() {
        return $this->belongsTo('App\Country');
    }
    
    /**
     * Get the Cities for the state.
     */
    public function cities() {
        return $this->hasMany('App\City');
    }

}
