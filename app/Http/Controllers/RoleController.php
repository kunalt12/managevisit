<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Role;
use App\User;
use App\Permission;
use Illuminate\Support\Facades\Config;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Lang;
use Yajra\Datatables\Datatables;
use JWTAuth;

class RoleController extends Controller {
    
    /**
    * Display the datatables
    * @param Request $request
    * @return JSON
    */
    public function showDataTable(Request $request) {
        $roles = Role::select(['id', 'name', 'slug', 'description', 'created_at', 'updated_at', 'is_editable'])->where(['role_type' => '3']);
        
        return Datatables::of($roles)
        ->addColumn('count', function ($role) {
            return count($role->getPermissions());
        })
        ->editColumn('description', str_limit('{{$description}}', 25))
        ->make(true);
    }
    
    public function getRolePermissions(Request $request) {
        $permissions = Role::find($request->id)->permissions;
        $userPermissions = makePermissionsTreeViewJson($permissions);
        return response()->json($userPermissions);
    }

    /**
    * Get Roll for add user.
    *
    * @return \Illuminate\Http\Response
    */
    public function getRoleList(Request $request) {
//        $roles = Role::where(['is_editable' => '1', 'role_type' => '3'])->get();
        $roles = Role::where(['role_type' => '3'])->get();
        return response()->json(['code' => Config::get('constants.SUCCESS'), 'data' => $roles], 200);
    }
    
    /**
    * Display a listing of the resource.
    *
    * @return \Illuminate\Http\Response
    */
    public function index() {
        $role = Role::all();
        return response()->json($role);
    }
    
    /**
    * Show the form for creating a new resource.
    *
    * @return \Illuminate\Http\Response
    */
    public function create() {
        //
    }
    
    /**
    * Store a newly created resource in storage.
    *
    * @param  \Illuminate\Http\Request  $request
    * @return \Illuminate\Http\Response
    */
    public function store(Request $request) {
        try {
            $userAuth = JWTAuth::parseToken()->authenticate();
            
            // Save Role
            $role = new Role();
            $role->user_id = $userAuth->id;
            $role->name = $request->name;
            $role->role_type = $request->role_type;
            $role->slug = str_slug($request->name, '');
            $role->description = $request->description;
            $role->save();
        } catch (\Exception $ex) {
            if ($ex instanceof QueryException) {
                return response()->json(['code' => Config::get('constants.DUPLICATE'), 'error' => Lang::get('roles.duplicateentry')], 422);
            } else {
                return response()->json(['code' => Config::get('constants.ERROR'), 'error' => Lang::get('message.someproblems')], 422);
            }
        }
        
        // Parse the Roles
        $permissions = requestPermissionParse($request->permissions);
        
        //Assign Full Permission to role
        if (isset($permissions['full_permissions']) && !empty($permissions['full_permissions'])) {
            $role->assignPermission($permissions['full_permissions'], true);
        }
        // custom Permision
        if (isset($permissions['custom_permision']) && !empty($permissions['custom_permision'])) {
            foreach ($permissions['custom_permision'] as $key => $value) {
                $permissionStudent = Permission::create([
                'name' => $value['name'] . '.' . $role->slug,
                'slug' => $value['slug'],
                // we use permission inheriting.
                'inherit_id' => $value['id'],
                'description' => $value['description']
                ]);
                $role->assignPermission($permissionStudent->name);
            }
        }
        return response()->json(['code' => Config::get('constants.SUCCESS'), 'success' => Lang::get('roles.role_add')], 200);
    }
    
    /**
    * Display the specified resource.
    *
    * @param  int  $id
    * @return \Illuminate\Http\Response
    */
    public function show($id) {
        //
    }
    
    /**
    * Show the form for editing the specified resource.
    *
    * @param  int  $id
    * @return \Illuminate\Http\Response
    */
    public function edit($id) {
        
        $role = Role::find($id);
        if (empty($role)) {
            return response()->json(['code' => Config::get('constants.ERROR'), 'error' => Lang::get('roles.notfindrole')], 422);
        }

        $allPermissions = Permission::all()->where('is_main', 1);
        $userPermissions = makePermissionsTreeViewJson($allPermissions, $role);
        unset($role->permissions);
        $role->permissions = $userPermissions;
        return response()->json(['code' => Config::get('constants.SUCCESS'), 'data' => $role], 200);
    }
    
    /**
    * Update the specified resource in storage.
    *
    * @param  \Illuminate\Http\Request  $request
    * @param  int  $id
    * @return \Illuminate\Http\Response
    */
    public function update(Request $request, $id) {
        //
        $role = Role::find($id);
        $role->revokePermission(Permission::all());
        try {
            $role->name = $request->name;
            $role->slug = str_slug($request->name, '');
            $role->description = $request->description;
            $role->save();
        } catch (\Exception $ex) {
            if ($ex instanceof QueryException) {
                return response()->json(['code' => Config::get('constants.DUPLICATE'), 'error' => Lang::get('roles.duplicateentry')], 422);
            } else {
                return response()->json(['code' => Config::get('constants.ERROR'), 'error' => Lang::get('message.someproblems')], 422);
            }
        }
        
        
        // Parse the Roles
        $permissions = requestPermissionParse($request->permissions);
        //Assign Full Permission to role
        if (isset($permissions['full_permissions']) && !empty($permissions['full_permissions'])) {
            $role->assignPermission($permissions['full_permissions'], true);
        }
        // custom Permision
        if (isset($permissions['custom_permision']) && !empty($permissions['custom_permision'])) {
            foreach ($permissions['custom_permision'] as $key => $value) {
                // check if already exist
                $permissionStudent = Permission::updateOrCreate(['name' => $value['name'] . '.' . $role->slug], [
                'name' => $value['name'] . '.' . $role->slug,
                'slug' => "",
                // we use permission inheriting.
                'inherit_id' => $value['id'],
                'description' => $value['description']
                ]);
                
                
                $permissionStudent = Permission::updateOrCreate(['name' => $value['name'] . '.' . $role->slug], [
                'name' => $value['name'] . '.' . $role->slug,
                'slug' => $value['slug'],
                // we use permission inheriting.
                'inherit_id' => $value['id'],
                'description' => $value['description']
                ]);
                
                $role->assignPermission($permissionStudent->name);
            }
        }
        
        return response()->json(['code' => Config::get('constants.SUCCESS'), 'success' => Lang::get('roles.role_update')], 200);
    }
    
    /**
    * Remove the specified resource from storage.
    *
    * @param  int  $id
    * @return \Illuminate\Http\Response
    */
    public function destroy($id) {
        $userAuth = JWTAuth::parseToken()->authenticate();

        $permissions = Role::find($id)->permissions;
        for ($i=0; $i < sizeof($permissions); $i++) { 
           Permission::where('id', $permissions[$i]->id)->delete(); 
        }
        
        $objRole = Role::find($id);
        $activeData = $objRole->users()->get();
        for($i=0; $i<sizeof($activeData); $i++) {
            $user = $activeData[$i];
            $user->roles()->detach($id);
        }

        Role::where('id', $id)->delete();
        return response()->json(['code' => Config::get('constants.SUCCESS'), 'data' => $activeData, 'success' => Lang::get('roles.delete')], 200);
    }
}
