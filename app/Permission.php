<?php

namespace App;

use Kodeine\Acl\Models\Eloquent\Permission as PermissionModel;

class Permission extends PermissionModel {
    protected $fillable = ['name', 'slug', 'description', 'inherit_id','is_main'];
}
