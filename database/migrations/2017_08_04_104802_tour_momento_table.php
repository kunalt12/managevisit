<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class TourMomentoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tourmomentos', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('visitor_id')->unsigned()->nullable()->comment('Visitor id');
            $table->integer('momento_id')->unsigned()->nullable()->comment('Momento id');
            $table->integer('tour_id')->unsigned()->nullable()->comment('Tour id');
            $table->tinyInteger('status')->default(1)->nullable()->comment('1 = Pending, 2 = Receive');
            $table->timestamps();

            $table->foreign('visitor_id')->references('id')->on('contactmanagements');
            $table->foreign('momento_id')->references('id')->on('momentos');
            $table->foreign('tour_id')->references('id')->on('tours');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tourmomentos');
    }
}
