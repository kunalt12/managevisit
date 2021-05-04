<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Tourhistory extends Model
{
    use Updater;
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'tourhistories';
}
