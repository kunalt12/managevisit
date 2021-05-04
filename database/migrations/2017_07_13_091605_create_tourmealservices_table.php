<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTourmealservicesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tourmealservices', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('tour_id')->unsigned()->nullable();
            $table->integer('meal_id')->unsigned()->nullable();
            $table->integer('meal_service_type_id')->unsigned()->nullable();
            $table->integer('meal_service_location_id')->unsigned()->nullable();
            $table->integer('catering_manager')->unsigned()->nullable();
            $table->integer('people')->comment('Total no. of people')->nullable();
            $table->string('specific_item')->comment('Specific item')->nullable();
            $table->timestamps();

            $table->foreign('tour_id')->references('id')->on('tours');
            $table->foreign('meal_id')->references('id')->on('meals');
            $table->foreign('meal_service_type_id')->references('id')->on('meal_service_type');
            $table->foreign('meal_service_location_id')->references('id')->on('meal_service_location');
            $table->foreign('catering_manager')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tourmealservices');
    }
}
