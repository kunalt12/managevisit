<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateMealsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('meal_service_type', function($table) {
            $table->tinyInteger('type')->after('description')->default(1)->comment('1 = Free, 2 = Paid');
            $table->integer('cost')->after('type')->nullable()->comment('Paid type cost (Per Person)');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('meal_service_type', function ($table) {
            $table->dropColumn(['type','cost']);
        });
    }
}
