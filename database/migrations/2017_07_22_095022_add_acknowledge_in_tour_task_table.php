<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddAcknowledgeInTourTaskTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tour_tasks', function($table) {
            $table->tinyInteger('acknowledge')->after('task')->default(0)->comment('0 = Pending, 1 = Acknowledge, 2 = Rejected');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('tour_tasks', function ($table) {
            $table->dropColumn(['acknowledge']);
        });
    }
}
