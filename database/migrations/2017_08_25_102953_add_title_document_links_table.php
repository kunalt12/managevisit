<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddTitleDocumentLinksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('documentlinks', function($table) {
            $table->text('title')->after('tour_id')->nullable()->comment('Document title');

            $table->integer('created_by')->after('link')->unsigned()->nullable();
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
        Schema::table('documentlinks', function ($table) {
            $table->dropForeign(['created_by','updated_by']);
            $table->dropColumn(['title','created_by','updated_by']);
        });
    }
}
