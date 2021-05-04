<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateToursTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tours', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('user_id')->unsigned()->nullable();
            $table->integer('tourtype_id')->unsigned()->nullable();
            $table->integer('transport_id')->unsigned()->nullable();
            $table->integer('location_id')->unsigned()->nullable();

            $table->string('name')->comment('Name of tour')->nullable();
            $table->integer('senior')->comment('No. of senior')->nullable();
            $table->integer('adults')->comment('No. of adults')->nullable();
            $table->integer('children')->comment('No. of children')->nullable();
            $table->string('organization')->comment('Organization name')->nullable();
            $table->string('specific_item')->comment('Specific item name')->nullable();
            
            $table->longText('request')->comment('Special request')->nullable(); // textarea
            $table->date('start_date')->comment('Arrival date')->nullable();
            $table->date('end_date')->comment('Departure date')->nullable();

            $table->tinyInteger('status')->default(1);
            $table->integer('created_by')->unsigned()->nullable();
            $table->integer('updated_by')->unsigned()->nullable();
            $table->integer('deleted_by')->unsigned()->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('tourtype_id')->references('id')->on('tourtypes');
            $table->foreign('transport_id')->references('id')->on('transports');
            $table->foreign('location_id')->references('id')->on('locations');

            $table->foreign('created_by')->references('id')->on('users');
            $table->foreign('updated_by')->references('id')->on('users');
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
        Schema::dropIfExists('tours');
    }
}