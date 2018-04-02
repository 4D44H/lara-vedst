<?php

namespace Lara;

use Lara\Section;
use Auth;

class Status {

    const CANDIDATE = 'candidate';
    const MEMBER = 'member';
    const VETERAN = 'veteran';
    const EXMEMBER = 'ex-member';
    const EXCANDIDATE = 'ex-candidate';

    const ALL = [
        self::CANDIDATE,
        self::MEMBER,
        self::VETERAN,
        self::EXMEMBER,
        self::EXCANDIDATE
    ];

    const ACTIVE = [
        self::CANDIDATE,
        self::MEMBER,
        self::VETERAN
    ];

    const SHORTHANDS = [
        self::CANDIDATE => "K",
        self::MEMBER => "A",
        self::VETERAN => "V"
    ];

    public static function shortHand($status)
    {
        return self::SHORTHANDS[$status];
    }

    public static function style($status)
    {
        switch ($status) {
            case STATUS::CANDIDATE:
                return ["status" => "fa fa-adjust", "style" => "color:yellowgreen;", "title" => "Kandidat"];
            case STATUS::VETERAN:
                return ["status" => "fa fa-star", "style" => "color:gold;", "title" => "Veteran"];
            case STATUS::MEMBER:
                return ["status" => "fa fa-circle", "style" => "color:forestgreen;", "title" => "Aktiv"];
            case STATUS::EXMEMBER:
                return ["status" => "fa fa-star-o", "style" => "color:gold;", "title" => "ex-Mitglied"];
            case STATUS::EXCANDIDATE:
                return ["status"=>"fa fa-circle", "style"=>"color:lightgrey;", "title"=>"ex-Kandidat"];
            default:
                return ["status" => "fa fa-circle", "style" => "color:lightgrey;", "title" => "Extern"];
        }
    }

    public static function localize($status, $section = NULL)
    {
        if ($section === NULL) {
            $section = Section::query()->first();
        }
        return trans($section->title . "." . $status);
    }

    public static function localizeCurrent()
    {
        $user = Auth::user();
        if (!$user) {
            return "";
        }
        return self::localize($user->status, $user->section);
    }

}
