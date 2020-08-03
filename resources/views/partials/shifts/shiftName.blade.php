@php
/** @var \Lara\Shift $shift */
@endphp
<div class="dropdown">
@if( is_null($shift->getPerson) )
    {!! Form::text('userName' . $shift->id,
                Request::input('userName' . $shift->id),
                 array('placeholder'=>'=FREI=',
                       'id'=>'userName' . $shift->id,
                       'class'=>'form-control form-control-sm word-break',
                       'autocomplete'=>'off'))
    !!}
@else

    {!! Form::text('userName' . $shift->id,
                 $shift->getPerson->prsn_name,
                 array('id'=>'userName' . $shift->id,
                       'class'=>'form-control form-control-sm word-break',
                       'data-toggle' => "tooltip",
                       'data-placement' =>"top",
                       'title' => $shift->getPerson->fullName(),
                        'autocomplete'=>'off') )
    !!}
@endif


{{-- Show dropdowns only for members --}}
@auth
    <ul class="small dropdown-menu dropdown-username" style="position: absolute;">
        <li class="dropdown-item yourself" >
            <a href="javascript:void(0);"
               onClick="document.getElementById('userName{{ ''. $shift->id }}').value='{{Auth::user()->name}}';
                   document.getElementById('club{{ ''. $shift->id }}').value='{{Lara\Section::current()->title}}';
                   document.getElementById('ldapId{{ ''. $shift->id }}').value='{{Auth::user()->person->prsn_ldap_id}}';
                   document.getElementById('btn-submit-changes{{ ''. $shift->id }}').click();">
                <b>{{ trans('mainLang.IDoIt') }}</b>
            </a>
        </li>
    </ul>
@endauth
</div>

    @if( is_null($shift->getPerson) )
        {!! Form::hidden('ldapId' . $shift->id,
                         '',
                         array('id'=>'ldapId' . $shift->id) )
        !!}
    @else
        {!! Form::hidden('ldapId' . $shift->id,
                         $shift->getPerson->prsn_ldap_id,
                         array('id'=>'ldapId' . $shift->id) )
        !!}
    @endif



    {!! Form::hidden('timestamp' . $shift->id,
                     $shift->updated_at,
                     array('id'=>'timestamp' . $shift->id) )
    !!}

