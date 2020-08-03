{!! Form::open(['url' => 'login', 'method' => 'POST', 'class' => 'form-horizontal ml-auto']) !!}


<div class="navbar-form form-inline login-forms">
    {!! Form::text( 'username',
                    Request::input( 'username' ),
                    ['placeholder'  => Lang::get('mainLang.clubNumber') . " / " . trans('auth.email'),
                          'class'        => 'form-control form-control-sm',
                          'autocomplete' => 'on',
                          'style'        => 'cursor: auto',
                          'autofocus'=>'autofocus'])  !!}

    <br class="d-block d-sm-none">


    {!! Form::password( 'password',
                       ['placeholder'  => Lang::get('mainLang.password' ),
                        'class'        => 'form-control form-control-sm',
                        'autocomplete' => 'off',
                        'style'        => 'cursor: auto'] ) !!}

    <br class="d-block d-sm-none">

    @dev
    <select name="userGroup" id="userGroupDevelop" data-style="btn btn-sm ">
        @foreach(Roles::ALL_PRIVILEGES as $privilege)
            <option value="{{ $privilege }}">  {{ ucwords($privilege) }}</option>
        @endforeach
    </select>
    @enddev
    {!! Form::submit( Lang::get('mainLang.logIn'),
                      array('class' => ' btn btn-primary btn-sm') ) !!}

    <br class="d-block d-sm-none">
</div>
{!! Form::close() !!}
