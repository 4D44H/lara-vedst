<?php

namespace Lara;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Lara\utilities\RoleUtility;

/**
 * @property string name
 * @property string email
 * @property string password
 * @property string status
 * @property \Illuminate\Database\Eloquent\Relations\belongsToMany/Role $roles
 */
class User extends Authenticatable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        // authentication related
        'name', 'email', 'password',
        // Lara related
        'section_id', 'person_id', 'status'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];


    public function person()
    {
        return $this->belongsTo('Lara\Person');
    }

    public function section()
    {
        return $this->belongsTo('Lara\Section');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\belongsToMany/Lara\Role
     */
    public function roles()
    {
        return $this->belongsToMany(Role::class);
    }

    public static function createFromPerson(Person $person)
    {
        if (!$person->club->section()) {
            return NULL;
        }
        $user = User::create([
            'name' => $person->prsn_name,
            'section_id' => $person->club->section()->id,
            'person_id' => $person->id,
            'status' => $person->prsn_status
        ]);
        RoleUtility::assignPrivileges($user,$person->club->section()->first(),
            RoleUtility::PRIVILEGE_MEMBER);

        return $user;
    }

    public function is($permissions)
    {
        if (!is_array($permissions)) {
            $permissions = [$permissions];
        }

        return $this->roles()->whereIn('name', $permissions)->exists();
    }

    public function hasPermissionsInSection(Section $section, ...$permission)
    {
        return $this->roles()
            ->whereIn('name', $permission)
            ->where('section_id', '=', $section->id)->exists();
    }

    /**
     * @param $type string
     * @return \Illuminate\Database\Eloquent\Collection/Role
     */
    public function getRolesOfType($type){
        return $this->roles()->where('name','=',$type)->get();
    }
}
