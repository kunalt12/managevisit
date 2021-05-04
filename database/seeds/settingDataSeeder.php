<?php

use Illuminate\Database\Seeder;
use App\Setting;
use Carbon\Carbon;

class settingDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('settings')->delete();
        $dt = Carbon::now();
        $data = Carbon::createFromFormat('Y-m-d H:i:s', $dt);

        $settings = array(
            ['admin_email' => 'tourmanagement@mailinator.com', 'confirm_link_expired' => 72, 'created_at' => $data, 'updated_at' => $data],
        );

        // Loop through each user above and create the record for them in the database
        foreach ($settings as $setting)
        {
            Setting::create($setting);
        }
    }
}
