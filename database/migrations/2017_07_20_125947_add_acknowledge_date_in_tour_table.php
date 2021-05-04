<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddAcknowledgeDateInTourTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tours', function($table) {
            $table->dateTime('acknowledge_date')->after('acknowledge_comment')->comment('acknowledge date')->nullable();
            $table->dropColumn('acknowledge');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('tours', function ($table) {
            $table->dropColumn(['acknowledge','acknowledge_date']);
        });
    }
}
