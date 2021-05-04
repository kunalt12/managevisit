<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Documentlink extends Model
{
    use Updater;
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'documentlinks';

    public function tourDocsCreated()
    {
        return $this->belongsTo('App\User', 'created_by');
    }
}
