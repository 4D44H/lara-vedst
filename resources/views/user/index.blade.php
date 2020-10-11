@php
    /** @var \Illuminate\Support\Collection/Lara\UserSectionsRoleView $userSectionsRoleViews */
@endphp

@extends('layouts.master')
@section('title')
    {{ "User Overview" }}
@stop

@section('content')
    <div class="card col-12 p-0">
        <div class="card-header text-white bg-info">
            <h4 class="card-title">{{ trans('mainLang.management') }}: {{ trans('users.users') }}</h4>
        </div>

        <div class="card card-body p-0">
            <div class="px-3 py-2">
                    <span class="pb-2 fa-pull-left form-inline has-feedback">
                        <label for="userOverviewFilter" class="test"> {{ trans('mainLang.search') }}: </label>
                        <input type="text" class="form-control" id="userOverviewFilter">
                    </span>
                @noLdapUser
                <span class="table-control__create-new-user fa-pull-right">
                            <a class="btn btn-success" href="{{route('register')}}">
                                <i class="fa fa-user-plus"></i>
                            </a>
                     </span>
                @endnoLdapUser
            </div>
            <ul class="nav nav-tabs" role="tablist">
                @foreach($sections as $section)
                    <li class="nav-item">
                        <a class="nav-link @if(\Auth::user()->section->id == $section->id) active @endif"
                           data-toggle="tab" href="#section{{$section->id}}" role="tab"
                           aria-controls="section{{$section->id}}"
                           aria-selected="{{\Auth::user()->section->id == $section->id}}">{{$section->title}}</a>
                    </li>
                @endforeach
            </ul>
            <div class="tab-content">
                @foreach($sections as $section)
                    <div class="tab-pane fade @if(\Auth::user()->section->id == $section->id) show active @endif"
                         id="section{{$section->id}}" role="tabpanel">
                        <nav class="navbar nav nav-pills nav-justified">
                            @foreach( \Lara\utilities\RoleUtility::ALL_PRIVILEGES as $priv )
                                <a class="nav-item nav-link rolefilter" data-target="{{$section->title.'_'.$priv}}" href="#">{{$priv}}</a>
                            @endforeach
                            @foreach(\Lara\Status::ALL as $status)
                                    <a class="nav-item nav-link rolefilter" data-target="{{$section->title.'-'.$status}}" href="#">{{trans($section->title.'.'.$status)}}</a>
                            @endforeach
                        </nav>
                        <table class="table info table-hover table-sm">
                            <thead>
                            <tr class="active">
                                <th class=" pl-3">
                                    {{ trans('auth.section') }}
                                </th>
                                <th class="">
                                    {{ trans('auth.nickname') }}
                                </th>
                                <th class="">
                                    {{ trans('auth.givenname') }}
                                </th>
                                <th class="">
                                    {{ trans('auth.lastname') }}
                                </th>
                                <th class="">
                                    {{ trans('auth.email') }}
                                </th>
                                <th class="">
                                    {{ trans('auth.status') }}
                                </th>
                                <th>
                                    {{ trans('auth.on_leave_until') }}
                                </th>
                                <th>

                                </th>
                            </tr>
                            </thead>
                            <tbody class="container userOverviewTable">

                            @foreach($userSectionsRoleViews->
                            filter(function (Lara\UserSectionsRoleView $userSectionsRoleView) use ($section) {
                            return $userSectionsRoleView->section->id == $section->id;
                            })->map(function (Lara\UserSectionsRoleView $userSectionsRoleView){
                            return $userSectionsRoleView->user;
                            }) as $user)
                                @php
                                /** @var Lara\User $user */
                                $rolesPerSection = $user->roles->map(function (\Lara\Role $r){
                                return $r->section->title . '_'. $r->name;
                                });
                                @endphp
                                <tr class="userRow @foreach($rolesPerSection as $roleString) {{$roleString}} @endforeach {{ $user->section->title.'-'.$user->status }}">
                                    <td class="pl-3">
                                        {{ $user->section->title }}
                                    </td>
                                    <td>
                                        <a href="{{route("user.edit",["user"=>$user->id])}}">
                                            {{ $user->name }}
                                        </a>
                                    </td>
                                    <td>
                                        {{ $user->givenname }}
                                    </td>
                                    <td>
                                        {{ $user->lastname }}
                                    </td>
                                    <td>
                                        <a href="mailto:{{ $user->email }}" target="_blank" rel="noopener noreferrer">
                                            {{ $user->email }}
                                        </a>
                                    </td>
                                    <td>
                                        @canEditUser($user)
                                        {{ Form::model($user, ['route' => ['user.update', $user->id], 'class'=>'change-user-status-form', 'method' => 'PUT']) }}
                                        <select name="status" class="selectpicker" data-id="{{$user->id}}"
                                                data-name="{{$user->name}}">
                                            @foreach(Lara\Status::ALL as $status)
                                                <option
                                                    value="{{ $status }}" {{ $status === $user->status ? "selected" : "" }}>
                                                    {{ trans($user->section->title . "." . $status) }}
                                                </option>
                                            @endforeach
                                        </select>
                                        {{ Form::close() }}
                                        @endcanEditUser
                                    </td>
                                    <td>
                                        @if(!is_null($user->on_leave))
                                            {{ $user->on_leave->format('d.m.Y') }}
                                        @endif
                                    </td>
                                    <td>
                                        @canEditUser($user)
                                        {{Form::open(['route'=>['user.delete',$user->id]])}}
                                            <button type="button" class="btn btn-danger deleteUserBtn" data-name="{{$user->name}}"><i class="fas fa-trash-alt"></i></button>
                                        {{ Form::close() }}
                                        @endcanEditUser
                                    </td>
                                </tr>
                            @endforeach
                            </tbody>
                        </table>
                    </div>
                @endforeach
            </div>
        </div>
    </div>

    <br/>
@stop
