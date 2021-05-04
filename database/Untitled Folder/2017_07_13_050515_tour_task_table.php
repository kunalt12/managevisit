<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class TourTaskTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tour_tasks', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('tour_id')->unsigned()->nullable();
            $table->integer('tourtype_id')->unsigned()->nullable();
            $table->string('task')->comment('Task details')->nullable();
            $table->integer('deleted_by')->unsigned()->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->foreign('tour_id')->references('id')->on('tours');
            $table->foreign('tourtype_id')->references('id')->on('tourtypes');
            $table->foreign('deleted_by')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tour_tasks');
    }
}
