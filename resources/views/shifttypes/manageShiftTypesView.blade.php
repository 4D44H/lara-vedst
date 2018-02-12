{{-- Needs variables: shiftTypes --}}

@extends('layouts.master')

@section('title')
	{{ trans('mainLang.management') }}: {{ trans('mainLang.shiftTypes') }}
@stop

@section('content')

@if(Session::has('userGroup')
	AND (Auth::user()->group == 'marketing'
	OR Auth::user()->group == 'clubleitung'
	OR Auth::user()->group == 'admin'))

	<div class="panel panel-info col-xs-12 no-padding">
		<div class="panel-heading">
				<h4 class="panel-title">{{ trans('mainLang.management') }}: {{ trans('mainLang.shiftTypes') }}</h4>
		</div>
		<div class="panel panel-body no-padding">
            {{Form::open( ['id'=>'shiftTypeFilterForm','class'=>' paddingTop form-inline rounded', 'route'=>'searchShiftType'] ) }}
            <div class="form-group col-md-2">
                {{ Form::text('filter','',['class'=>'form-control border', 'placeholder'=>trans('mainLang.search')]) }}
            </div>
            <div class="form-group">
                <button type="submit" class="btn btn-success"> {{trans('mainLang.search') }}</button>
            </div>
            {{Form::close()}}
            <div class="clearfix paddingTop"></div>
            <div class="table-responsive">
                <table class="table info table-hover table-condensed">
                    <thead>
                    <tr class="active">
                        <th class="col-md-1 col-xs-1 text-center">
                            #
                        </th>
                        <th class="col-md-3 col-xs-3 text-center">
                            {{ trans('mainLang.shift') }}
                        </th>
                        <th class="col-md-2 col-xs-2 text-center">
                            {{ trans('mainLang.start') }}-{{ trans('mainLang.end') }}
                        </th>
                        <th class="col-md-1 col-xs-1 text-center">
                            {{ trans('mainLang.weight') }}
                        </th>
                        <th class="col-md-2 col-xs-2 text-center">
                            {{ trans("mainLang.actions") }}
                        </th>
                        <th class="col-md-2 col-xs-2 text-center">
                            {{ trans("mainLang.replaceAll") }}
                        </th>
                    </tr>
                    </thead>
                    <tbody>

                    <div class="container">
                        @foreach($shiftTypes as $shiftType)
                            <tr>
                                <td class="text-center">
                                    {!! $shiftType->id !!}
                                </td>
                                <td class="text-center">
                                    <a href="../shiftType/{{ $shiftType->id }}">
                                        {!! $shiftType->title !!}
                                    </a>
                                </td>
                                <td class="text-center">
                                    {!! date("H:i", strtotime($shiftType->start)) !!}
                                    -
                                    {!! date("H:i", strtotime($shiftType->end)) !!}
                                </td>
                                <td class="text-center">
                                    {!! $shiftType->statistical_weight !!}
                                </td>
                                <td class="text-center">
                                    <a href="../shiftType/{{ $shiftType->id }}"
                                       class="btn btn-small btn-success"
                                       rel="nofollow">
                                        {{ trans('mainLang.editDetails') }}
                                    </a>
                                    &nbsp;&nbsp;
                                    <a href="../shiftType/{{ $shiftType->id }}"
                                       class="btn btn-small btn-danger"
                                       data-method="delete"
                                       data-token="{{csrf_token()}}"
                                       rel="nofollow"
                                       data-confirm="{{ trans('mainLang.deleteConfirmation') }} &#39;&#39;{!! $shiftType->title !!}&#39;&#39; (#{{ $shiftType->id }})? {{ trans('mainLang.warningNotReversible') }}">
                                        {{ trans('mainLang.deleteThisShiftType') }}
                                    </a>
                                </td>
                                <td class="text-center">
                                    @include('shifttypes.shiftTypeSelect',['shift'=>$shiftType,'shiftTypes' => $shiftTypes,'route'=>'completeOverrideShiftType','shiftTypeId'=>$shiftType->id, 'selectorClass'=>'shiftTypeReplaceSelector'])
                                </td>
                            </tr>
                        @endforeach
                    </div>
                    </tbody>
                </table>
            </div>
		</div>
	</div>

	<div class="text-center">
		{{ $shiftTypes->links() }}
	</div>

	<br/>
@else
	@include('partials.accessDenied')
@endif
@stop


