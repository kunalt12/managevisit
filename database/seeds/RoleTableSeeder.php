<?php

use Illuminate\Database\Seeder;
use App\Role;

class RoleTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('roles')->delete();

        $roles = array(
            ['name' => 'Super Admin', 'slug' => 'superadmin', 'description' => 'System Super Admin Role','role_type'=>3,'is_editable'=>0],
            ['name' => 'BAPS Staff', 'slug' => 'bapsstaff', 'description' => 'System Staff Role','role_type'=>3,'is_editable'=>1],
            ['name' => 'Visitor', 'slug' => 'visitor', 'description' => 'System visitor role','role_type'=>3,'is_editable'=>1],
            ['name' => 'Tour Manager', 'slug' => 'tourmanager', 'description' => 'System Tour manager','role_type'=>3,'is_editable'=>1],
            ['name' => 'Volunteers', 'slug' => 'volunteers', 'description' => 'System volunteers role','role_type'=>3,'is_editable'=>1]
        );

        // Loop through each user above and create the record for them in the database
        foreach ($roles as $role) {
            Role::create($role);
        }
        
        // Assign the Super Amdin role to First User of Database which will Super ADmin
        $superAdmin = App\User::first();
        $superAdmin->assignRole('admin');
    }
}
