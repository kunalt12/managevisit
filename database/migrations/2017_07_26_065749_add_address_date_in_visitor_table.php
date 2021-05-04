<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddAddressDateInVisitorTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('contactmanagements', function($table) {
            $table->string('middle_name')->after('first_name');
            $table->string('address1')->after('address');
            $table->integer('country_id')->after('address1')->unsigned()->nullable()->comment('Country id');
            $table->string('state')->after('country_id');
            $table->string('city')->after('state');
            $table->string('zip_code')->after('city');

            $table->foreign('country_id')->references('id')->on('countries');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('contactmanagements', function ($table) {
            $table->dropForeign(['country_id']);
            $table->dropColumn(['middle_name','address1','country_id','state','city','zip_code']);
        });
    }
}
