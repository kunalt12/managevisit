<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddDocumentInTourTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tours', function($table) {
            $table->string('document')->after('acknowledge_date')->comment('document upload file')->nullable();
            $table->string('document_link')->after('document')->comment('Document upload link')->nullable();
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
            $table->dropColumn(['document','document_link']);
        });
    }
}
