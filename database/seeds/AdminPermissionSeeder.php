<?php

use Illuminate\Database\Seeder;
use App\Permission;

class AdminPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {
        $roles = App\Role::where('slug','<>', 'admin')->get();
        foreach($roles as $role) {
            $role->assignPermission('dashboard');
        }
        $this->command->info('Set the Default Dashboard Permission to all Users');
        
        $roleSuperAdmin = App\Role::where('slug', 'admin')->first();
        $assignRole = [];
        $permissions = Permission::where('is_main', '1')->get();
        foreach ($permissions as $permission) {
            $newPermission = $permission->replicate();
            $newSlug = [];
            foreach ($permission->slug as $slug => $value) {
                /*if($permission->name == 'feedbacks') {
                    if($slug == 'create' || $slug == 'update') {
                        $newSlug[$slug] = false;
                    }
                    else {
                        $newSlug[$slug] = true;
                    }
                }
                else {
                    $newSlug[$slug] = true;
                }*/

                $newSlug[$slug] = true;
            }
            $newPermission->name = $permission->name . ".admin";
            $newPermission->slug = $newSlug;
            $newPermission->inherit_id = $permission->id;
            $newPermission->is_main = 0;
            $newPermission->save();
            
            $assignRole[] = $newPermission->id;
        }
        
        $roleSuperAdmin->assignPermission($assignRole);
        $this->command->info('Assign all permissions to Admin');
    }
}
