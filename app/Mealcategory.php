<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Mealcategory extends Model
{
    use Updater;
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'mealcategories';
}
