<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddBudgetInTourTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tours', function($table) {
            $table->integer('manager')->after('document_link')->unsigned()->nullable()->comment('Tour Manager');
            $table->string('budget')->after('manager')->nullable()->comment('Tour budget');
            $table->string('expense_field')->after('budget')->nullable()->comment('Actual Expense Field');

            $table->foreign('manager')->references('id')->on('users');
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
            $table->dropForeign(['manager']);
            $table->dropColumn(['manager','budget','expense_field']);
        });
    }
}
