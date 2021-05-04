<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Emailtemplates extends Model
{
    use Notifiable,
        Updater,
        SoftDeletes;
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'emailtemplates';
}
