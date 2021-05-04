<?php

use Illuminate\Database\Seeder;
use App\Permission;

class PermissionTableSeeder extends Seeder {

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {
        $permissions = array(
            [
                'name' => 'dashboard',
                'slug' => [
                    'view' => true,
                ],
                'description' => 'manage Dashboard permissions',
                'is_main' => '1'
            ],[
                'name' => 'roles',
                'slug' => [
                    // pass an array of permissions.
                    'create' => false,
                    'view' => false,
                    'update' => false,
                    'delete' => false,
                    'update.status' => false
                ],
                'description' => 'manage Roles permissions',
                'is_main' => '1'
            ],[
                'name' => 'meals',
                'slug' => [
                    // pass an array of permissions.
                    'create' => false,
                    'view' => false,
                    'update' => false,
                    'delete' => false
                ],
                'description' => 'manage meals category permissions',
                'is_main' => '1'
            ],[
                'name' => 'transports',
                'slug' => [
                    // pass an array of permissions.
                    'create' => false,
                    'view' => false,
                    'update' => false,
                    'delete' => false
                ],
                'description' => 'manage transports category permissions',
                'is_main' => '1'
            ],[
                'name' => 'visitors',
                'slug' => [
                    // pass an array of permissions.
                    'create' => false,
                    'view' => false,
                    'update' => false,
                    'delete' => false
                ],
                'description' => 'manage visitors category permissions',
                'is_main' => '1'
            ],[
                'name' => 'organizations',
                'slug' => [
                    // pass an array of permissions.
                    'create' => false,
                    'view' => false,
                    'update' => false,
                    'delete' => false
                ],
                'description' => 'manage organizations category permissions',
                'is_main' => '1'
            ],[
                'name' => 'tourtypes',
                'slug' => [
                    // pass an array of permissions.
                    'create' => false,
                    'view' => false,
                    'update' => false,
                    'delete' => false
                ],
                'description' => 'manage tourtypes category permissions',
                'is_main' => '1'
            ],[
                'name' => 'defaulttasks',
                'slug' => [
                    // pass an array of permissions.
                    'create' => false,
                    'view' => false,
                    'update' => false,
                    'delete' => false
                ],
                'description' => 'manage default tasks for tour permissions',
                'is_main' => '1'
            ],[
                'name' => 'tours',
                'slug' => [
                    // pass an array of permissions.
                    'create' => false,
                    'view' => false,
                    'update' => false,
                    'delete' => false,
                    'resend' => false,
                    'acknowledge' => false,
                    'completed' => false,
                    'updatestatus' => false
                ],
                'description' => 'manage tours permissions',
                'is_main' => '1'
            ],[
                'name' => 'tourtasks',
                'slug' => [
                    // pass an array of permissions.
                    'create' => false,
                    'view' => false,
                    'update' => false,
                    'delete' => false,
                    'accept' => false,
                    'reject' => false
                ],
                'description' => 'manage tour tasks for tour permissions',
                'is_main' => '1'
            ],[
                'name' => 'locations',
                'slug' => [
                    // pass an array of permissions.
                    'create' => false,
                    'view' => false,
                    'update' => false,
                    'delete' => false
                ],
                'description' => 'manage locations category permissions',
                'is_main' => '1'
            ],[
                'name' => 'contactmanagements',
                'slug' => [
                    // pass an array of permissions.
                    'create' => false,
                    'view' => false,
                    'update' => false,
                    'delete' => false
                ],
                'description' => 'manage contact managements permissions',
                'is_main' => '1'
            ],[
                'name' => 'users',
                'slug' => [
                    // pass an array of permissions.
                    'create' => false,
                    'view' => false,
                    'update' => false,
                    'delete' => false,
                    'editprofile' => false,
                    'update.status' => false,
                    'update.password' => false,
                    'resend' => false
                ],
                'description' => 'manage users category permissions',
                'is_main' => '1'
            ],[
                'name' => 'notifications',
                'slug' => [
                    // pass an array of permissions.
                    'create' => false,
                    'view' => false,
                    'update' => false,
                    'delete' => false,
                    'read' => false,
                ],
                'description' => 'manage notifications permissions',
                'is_main' => '1'
            ],[
                'name' => 'categories',
                'slug' => [
                    // pass an array of permissions.
                    'view' => false
                ],
                'description' => 'manage categories permissions',
                'is_main' => '1'
            ],[
                'name' => 'contactus',
                'slug' => [
                    // pass an array of permissions.
                    'create' => false,
                    'view' => false,
                    'update' => false,
                    'delete' => false,
                    'read' => false,
                ],
                'description' => 'manage contact us permissions',
                'is_main' => '1'
            ],[
                'name' => 'mealservicetypes',
                'slug' => [
                    // pass an array of permissions.
                    'create' => false,
                    'view' => false,
                    'update' => false,
                    'delete' => false
                ],
                'description' => 'manage meal service type permissions',
                'is_main' => '1'
            ],[
                'name' => 'mealservicelocations',
                'slug' => [
                    // pass an array of permissions.
                    'create' => false,
                    'view' => false,
                    'update' => false,
                    'delete' => false
                ],
                'description' => 'manage meal service location permissions',
                'is_main' => '1'
            ],[
                'name' => 'mealcategories',
                'slug' => [
                    // pass an array of permissions.
                    'create' => false,
                    'view' => false,
                    'update' => false,
                    'delete' => false
                ],
                'description' => 'manage meal categories permissions',
                'is_main' => '1'
            ],[
                'name' => 'global_settings',
                'slug' => [
                    // pass an array of permissions.
                    'create' => false,
                    'view' => false,
                    'update' => false,
                    'delete' => false
                ],
                'description' => 'manage global setting permissions',
                'is_main' => '1'
            ],[
                'name' => 'momentos',
                'slug' => [
                    // pass an array of permissions.
                    'create' => false,
                    'view' => false,
                    'update' => false,
                    'delete' => false
                ],
                'description' => 'manage momentos permissions',
                'is_main' => '1'
            ],[
                'name' => 'availabilities',
                'slug' => [
                    // pass an array of permissions.
                    'create' => false,
                    'view' => false,
                    'update' => false,
                    'delete' => false
                ],
                'description' => 'manage availabilities permissions',
                'is_main' => '1'
            ],[
                'name' => 'document_in_tour',
                'slug' => [
                    // pass an array of permissions.
                    'create' => false,
                    'view' => false,
                    'update' => false,
                    'delete' => false
                ],
                'description' => 'manage document in tour permissions',
                'is_main' => '1'
            ],[
                'name' => 'note_in_tour',
                'slug' => [
                    // pass an array of permissions.
                    'create' => false,
                    'view' => false,
                    'update' => false,
                    'delete' => false
                ],
                'description' => 'manage note in tour permissions',
                'is_main' => '1'
            ],[
                'name' => 'visitor_in_tour',
                'slug' => [
                    // pass an array of permissions.
                    'create' => false,
                    'view' => false,
                    'update' => false,
                    'delete' => false
                ],
                'description' => 'manage visitor in tour permissions',
                'is_main' => '1'
            ],[
                'name' => 'api_managements',
                'slug' => [
                    'create' => false,
                    'view' => false,
                    'update' => false,
                    'delete' => false
                ],
                'description' => 'manage API key management permissions',
                'is_main' => '1'
            ]
        );

        // Loop through each user above and create the record for them in the database
        foreach ($permissions as $permission) {
            Permission::create($permission);
        }
    }
}