@php
    /** @var \Lara\Shift $shift */
@endphp

<div class="dropdown">
@if( is_null($shift->getPerson) )
        {!! Form::text('club' . $shift->id, Request::input('club' . $shift->id),
                       array( 'placeholder'=>'-',
                       'id'=>'club' . $shift->id,
                       'class'=>'hidden-print form-control form-control-sm',
                       'autocomplete'=>'off')) !!}
@else
        @if(!is_null($shift->getPerson->getClub))
            {!! Form::text('club' . $shift->id,
                           $shift->getPerson->getClub->clb_title,
                           array('id'=>'club' . $shift->id,
                          'class'=>'form-control form-control-sm',
                       	  'autocomplete'=>'off')) !!}
        @else
            {!! Form::text('club' . $shift->id, '',
                           array('id'=>'club' . $shift->id,
                          'class'=>'form-control form-control-sm',
                          'autocomplete'=>'off')) !!}
        @endif

@endif


</div>
<ul class="dropdown-menu dropdown-club btn-sm" style="position: absolute;"></ul>
