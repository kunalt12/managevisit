<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddRoleTypeToRolesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('roles', function($table) {
            $table->tinyInteger('role_type')->after('description')->default(1)->comment('1 = User Role, 2 = Subscription Role, 3 = System Role');
            $table->integer('user_id')->after('role_type')->nullable()->unsigned()->comment("who created this role");
            $table->tinyInteger('is_editable')->after('user_id')->default(1)->comment('1 = Role is Editable, 0 = System Defautl Role which is not editable');
            $table->foreign('user_id')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('roles', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn('role_type');
            $table->dropColumn('user_id');
            $table->dropColumn('is_editable');
        });
    }
}
