<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddCreatedNoteTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tour_notes', function($table) {
            $table->integer('created_by')->after('note')->unsigned()->nullable();
            $table->integer('updated_by')->after('created_by')->unsigned()->nullable();
            $table->foreign('created_by')->references('id')->on('users');
            $table->foreign('updated_by')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('tour_notes', function ($table) {
            $table->dropForeign(['created_by','updated_by']);
            $table->dropColumn(['created_by','updated_by']);
        });
    }
}
