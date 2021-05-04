<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddAddressDateInUserTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function($table) {
            $table->string('middle_name')->after('first_name')->nullable();
            $table->string('address1')->after('address')->nullable();
            $table->integer('country_id')->after('address1')->unsigned()->nullable()->comment('Country id');
            $table->string('state')->after('country_id')->nullable();
            $table->string('city')->after('state')->nullable();
            $table->string('zip_code')->after('city')->nullable();

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
        Schema::table('users', function ($table) {
            $table->dropColumn(['middle_name','address1','country_id','state','city','zip_code']);
            $table->dropForeign(['country_id']);
        });
    }
}
