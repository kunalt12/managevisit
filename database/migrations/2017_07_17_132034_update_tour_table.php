<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateTourTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tours', function($table) {
            $table->integer('acknowledge')->after('meals')->comment('0 = pending, 1 = approve, 2 = reject')->nullable()->default(0);
            $table->longText('acknowledge_comment')->after('acknowledge')->comment('reason of acknowledge')->nullable();
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
            $table->dropColumn(['acknowledge','acknowledge_comment']);
        });
    }
}
