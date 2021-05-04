<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateUserTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function($table) {
            $table->string('name')->after('username')->nullable();
            $table->string('phone_number')->after('password')->nullable();
            $table->string('mobile')->after('phone_number')->nullable();
            $table->string('image')->after('mobile')->nullable();
            $table->date('dob')->after('image')->nullable();
            $table->string('address')->after('dob')->nullable();
            $table->enum('gender', ['m','f',''])->after('address')->nullable();
            $table->tinyInteger('status')->after('gender')->default(1);

            $table->dropColumn('username');
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
            $table->dropColumn(['first_name','last_name','phone_number','mobile','dob','address','gender','status']);
        });
    }
}