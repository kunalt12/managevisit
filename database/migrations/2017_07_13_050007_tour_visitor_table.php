<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class TourVisitorTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tour_visitors', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('tour_id')->unsigned()->nullable();
            $table->integer('visitor_id')->unsigned()->nullable();
            $table->tinyInteger('is_tour_admin')->default(0)->comment('0 = Normal visitor, 1 = Tour Admin');
            $table->integer('deleted_by')->unsigned()->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->foreign('tour_id')->references('id')->on('tours');
            $table->foreign('visitor_id')->references('id')->on('contactmanagements');
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
        Schema::dropIfExists('tour_visitors');
    }
}
