<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateApiManagementsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('api_managements', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name')->comment('Company Name')->nullable();
            $table->string('api_key')->comment('API Key 16 Character')->nullable();
            $table->string('slug')->comment('slug')->nullable();
            $table->tinyInteger('status')->default(1)->comment('1 = Active, 2 = Inactive')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('api_managements');
    }
}
