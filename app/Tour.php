<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Tour extends Model
{
    use Notifiable,
        Updater,
        SoftDeletes;
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'tours';

    public function routeNotificationForMail()
    {
        return $this->owner->email;
    }

    public function tourTasks()
    {
        return $this->hasMany('App\Tourtask', 'tour_id', 'id');//->withTrashed();
    }
    public function tourRefferenceEdit()
    {
        return $this->hasMany('App\Tourrefference', 'tour_id', 'id');
    }
    public function tourMeetingEdit()
    {
        return $this->hasMany('App\Tourmeeting', 'tour_id', 'id');
    }
    public function tourVisitorsEdit()
    {
        return $this->hasMany('App\Tourvisitor', 'tour_id', 'id');
    }

    public function tourVisitors()
    {
        return $this->hasMany('App\Tourvisitor', 'tour_id', 'id');
    }

    public function tourMeals() {
        return $this->hasMany('App\Tourmealservice', 'tour_id', 'id');
    }

    public function tourTapes()
    {
        return $this->belongsTo('App\Tourtype', 'tourtype_id')->withTrashed();
    }

    public function tourTransport()
    {
        return $this->belongsTo('App\Transport', 'transport_id')->withTrashed();
    }

    public function tourLocation()
    {
        return $this->belongsTo('App\Location', 'location_id')->withTrashed();
    }

    public function tourNotes()
    {
        return $this->hasMany('App\Tournote', 'tour_id', 'id');
    }

    public function tourDocuments()
    {
        return $this->hasMany('App\Documentlink', 'tour_id', 'id');
    }
    
    public function tourMealsMeal()
    {
        return $this->belongsTo('App\Meal', 'meal_id')->withTrashed();
    }

    public function contactmanager()
    {
        return $this->belongsTo('App\contactmanagements', 'visitor_id')->withTrashed();
    }
    public function refferencemanager()
    {
        return $this->hasMany('App\refferencemanagements', 'tour_id')->withTrashed();
    }

    public function tourManager()
    {
        return $this->belongsTo('App\User', 'manager')->withTrashed();
    }

    public function tourHistory()
    {
        return $this->hasMany('App\Tourhistory', 'tour_id', 'id');
    }

    public function tourFeedback()
    {
        return $this->hasOne('App\Tourfeedbacks', 'tour_id', 'id');
    }

    public function tourMomentos()
    {
        return $this->hasMany('App\Tourmomentos', 'tour_id', 'id');
    }

    /**
     * Get the Cheque record associated with the Tour.
     */
}
