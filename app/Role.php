<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Model;
// use Illuminate\Database\Eloquent\SoftDeletes;

use Kodeine\Acl\Models\Eloquent\Role as RoleModel;

class Role extends RoleModel {
    use Notifiable,
        Updater;

    public function permissions() {
        $model = config('acl.permission', 'Kodeine\Acl\Models\Eloquent\Permission');

        return $this->belongsToMany($model)->withTimestamps();
    }

    /**
     * List all permissions
     *
     * @return mixed
     */
    public function getPermissions() {
        return \Cache::remember(
                        'acl.getPermissionsInheritedById_' . $this->id, config('acl.cacheMinutes'), function () {
                    return $this->getPermissionsInherited();
                }
        );
    }
}