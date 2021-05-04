<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Contactmanagement extends Model
{
    use Notifiable,
        Updater,
        SoftDeletes;
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'contactmanagements';

    public function organizationdata()
    {
        return $this->belongsTo('App\Organization', 'organization_id')->withTrashed();
    }

    public function visitor() {
        return $this->belongsTo('App\Visitor', 'visitor_type')->withTrashed();
    }

    public function country()
    {
        return $this->belongsTo('App\Country', 'country_id');
    }
}
