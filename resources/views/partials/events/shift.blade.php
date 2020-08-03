<div class="box row">
    <div class="fas fa-bars"></div>
    <div class="form-inline input-group">

        <div class="form-group">
            <input type="text"
                   name="shifts[title][]"
                   class="input form-control"
                   value="{{ $title }}"
                   placeholder="{{ trans('mainLang.serviceTypeEnter') }}"
                   autocomplete="off"
            />
            <ul class="dropdown-menu dropdown-shiftTypes" style="position: absolute;"></ul>
        </div>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <div class="form-group">
            <input type="time"
                   class="input form-control"
                   name="shifts[start][]"
                   value="{{ $startTime }}"
                   required
            />
        </div>

        <div class="form-group">
            <input type="time"
                   class="input form-control"
                   name="shifts[end][]"
                   value="{{ $endTime }}"
                   required
            />
        </div>
        &nbsp;
        <br class="d-block d-sm-none">
        <div class="form-group form-check">
            <input type="hidden" name="shifts[optional][{{$counter}}]" class="isOptionalHidden form-control" value="0">
            <label>{{trans('mainLang.optional')}}:&nbsp;<input type="checkbox" class="isOptional form-control form-check"
                                                               name="shifts[optional][{{$counter}}]" {{$optional? 'checked="checked"':''}} /></label>
        </div>

        &nbsp;<br class="d-block d-sm-none">{{ trans('mainLang.weight') }}:&nbsp;
        <input type="number"
               step="0.1"
               min="0"
               class="input form-control"
               name="shifts[weight][]"
               value="{{ $weight }}"
               min="0"
               required
        />
        &nbsp;
        <input type="button" value="+" class="btn btn-small btn-success btnAdd"/>
        &nbsp;&nbsp;
        <input type="button" value="&#8211;" class="btn btn-small btn-danger btnRemove"/>
        <input hidden name="shifts[id][]" value="{{$shiftId}}" class="shiftId"/>
        <input hidden name="shifts[type][]" value="{{$shiftTypeId}}" class="shiftId"/>
        @if(!is_null($shiftId) && $shiftId!='' && \Lara\Utilities::requirePermission(['admin','marketing','clubleitung']))
            &nbsp;&nbsp;
            <a href="{{ route('shiftType.show',[$shiftTypeId]) }}" target="_blank"
               class="btn btn-primary btn-small" title="{{trans("mainLang.editShiftType")}}"> <i class="fas fa-pencil-alt"></i>  </a>
        @endif
        <br class="d-block d-sm-none">
    </div>
</div>
