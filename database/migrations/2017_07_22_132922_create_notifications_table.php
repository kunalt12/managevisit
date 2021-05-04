<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateNotificationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('user_id')->unsigned()->nullable()->comment('Notification sender id');
            $table->integer('receiver_id')->unsigned()->nullable()->comment('Notification receiver id');
            $table->string('message')->nullable()->comment('Notification message');
            $table->string('notification_type')->nullable()->comment('Notification type(module)');
            $table->tinyInteger('is_read')->default(0)->nullable()->comment('0 = unread, 1 = read');
            $table->longText('data')->comment('Notification full Json object')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('receiver_id')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('notifications');
    }
}
