<?php

use Illuminate\Database\Seeder;

class importCountryDataSeeder extends Seeder {

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {

        $sqlFile = '/database/sql_data/countries.sql';
        DB::unprepared(File::get(base_path() . $sqlFile));
        #DB::unprepared(file_get_contents($sqlFile));
    }

}
