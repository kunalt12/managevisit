<?php

/**
 * Return true if user have permission.
 * @param        $permission
 * @return bool
 */
function has_permission($permission) {
    if (auth()->guest()) {
        return false;
    }
    $user = auth()->user();
    if (!$user->can($permission)) {
        return false;
    }

    return true;
}

/**
 * Show 403 error page if permission check fails.
 * @param $permission
 */
function require_permission($permission) {
    $error_message = 'You don\'t have access to this resource';
    abort_if(auth()->guest(), 403, $error_message);
    $user = auth()->user();

    $permission_description = trans("permissions.{$permission}");
    $error_message = empty($permission_description) ? $error_message : "You don't have this permission: $permission_description";

    abort_unless($user->can($permission), 403, $error_message);
}

/**
 * Check if current user is a Global admin.
 * @return bool
 */
function is_admin() {
    if (auth()->guest()) {
        return false;
    }
    $user = auth()->user();
    return $user->hasRole(ROLE_ADMIN);
}

function is_superadmin($userAuth) {
    if ($userAuth->roles->first()->id == Illuminate\Support\Facades\Config::get('constants.ADMIN_ID')) {
        return true;
    }
    return false;
}

/**
 * 
 * @param type $permissions
 * @return array permissions
 */
function requestPermissionParse($permissions = []) {
    $fullPermission = [];
    $customPermission = [];
    foreach ($permissions as $mainPermission) {
        /* if ($mainPermission['selected']) {
          $fullPermission[] = $mainPermission['name'];
          } else { */
        $slug = array();
        foreach ($mainPermission['childern'] as $childPermission) {
            if ($childPermission['selected'] == true) {
                #array_push($slug, array($childPermission['name'] =>$childPermission['selected']));
                #$slug = array_add($slug, "'{$childPermission['name']}'", $childPermission['selected']);
                $slug = array_merge($slug, array($childPermission['name'] => $childPermission['selected']));
            }
        }

        if (sizeof($slug) > 0) {
            $customPermission[] = array('name' => $mainPermission['name'], 'id' => $mainPermission['id'], 'slug' => $slug, 'description' => $mainPermission['description']);
        }
        //}
    }
    $response = array("full_permissions" => $fullPermission, 'custom_permision' => $customPermission);
    return $response;
}

function makePermissionsTreeViewJson($permissions, $respectObjPermission = []) {
    $userPermissions = [];
    foreach ($permissions as $permission) {
        $permission['value'] = $permission['name'];
        $parentSelected = true;

        $slug = [];
        foreach ($permission['slug'] as $key => $value) {
            if ($respectObjPermission instanceof Kodeine\Acl\Models\Eloquent\Role || $respectObjPermission instanceof \App\Models\User || $respectObjPermission instanceof App\Models\Role) {
                $isSelected = $respectObjPermission->can($key . '.' . $permission['name']);
            } else {
                $isSelected = $value;
            }

            if ($isSelected == false) {
                $parentSelected = false;
            }
            $slug[] = array('description' => str_replace(".", " ", "Can " . $key), "name" => $key, "value" => $key . '.' . $permission['name'], "selected" => $isSelected);
        }
        $permission['childern'] = $slug;
        $permission['selected'] = $parentSelected;
        $userPermissions[] = $permission;
    }
    return $userPermissions;
}
