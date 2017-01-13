///<reference path="_references.ts"/>
$("#button-create-survey").click(function () {
    var errors = new Array();
    if ($("#description").val().length > 1500) {
        errors.push("Der Beschreibungstext ist zu lange! Der Text sollte weniger als 1500 Zeichen enthalten.");
    }
    if (errors.length > 0) {
        bootbox.alert(errors.map(function (err) { return "<p>" + err + "</p>"; }).join("\n"));
        return false;
    }
});

///<reference path="_references.ts"/>
function getRowName(a) {
    return $(a).children("td").eq(0).text();
}
function getRowShifts(a) {
    return $(a).children("td").eq(1).text();
}
//inspired by http://stackoverflow.com/questions/3160277/jquery-table-sort
function sortLeaderboards(sortIcon) {
    var isAscending = sortIcon.hasClass('fa-sort-asc');
    var rowCatcher = sortIcon.parent().data('sort') === 'name' ? getRowName : getRowShifts;
    var $table = sortIcon.parents("table");
    var rows = $table
        .find("tbody")
        .find("tr")
        .toArray()
        .sort(function (a, b) { return rowCatcher(a).localeCompare(rowCatcher(b), undefined, { 'numeric': true }); });
    if (!isAscending) {
        rows.reverse();
    }
    rows.forEach(function (row) { return $table.append($(row)); });
    sortIcon.parents('table')
        .find('.fa-sort, .fa-sort-desc, .fa-sort-asc')
        .removeClass('fa-sort-asc')
        .removeClass('fa-sort-desc')
        .addClass('fa-sort');
    sortIcon.removeClass('fa-sort')
        .addClass(isAscending ? 'fa-sort-desc' : 'fa-sort-asc');
}
$(".fa-sort, .fa-sort-desc, .fa-sort-asc").click(function () {
    sortLeaderboards(this);
});
$('#leaderboardsTabs').find('thead').find('td').click(function () {
    sortLeaderboards($($(this).find('i').first()));
});

///<reference path="_references.ts"/>
var Club;
(function (Club) {
    Club[Club["None"] = 0] = "None";
    Club[Club["BcClub"] = 2] = "BcClub";
    Club[Club["BcCafe"] = 3] = "BcCafe";
    Club[Club["BdClub"] = 4] = "BdClub";
    Club[Club["BhClub"] = 5] = "BhClub";
    Club[Club["BiClub"] = 6] = "BiClub";
})(Club || (Club = {}));
function getIdOfClub(club) {
    switch (club) {
        case "bc-Club":
            return Club.BcClub;
        case "bc-Café":
            return Club.BcCafe;
    }
    return Club.None;
}
function showErrorModal(message) {
    $("#errorModal").modal("show");
    $("#errorModal").find(".modal-body").html(message);
}

// external references go here
///<reference path="../typings/index.d.ts"/>
///<reference path="CreateEditEvent.ts"/>
///<reference path="CreateSurvey.ts"/>
///<reference path="StatisticsView.ts"/>
///<reference path="Utilities.ts"/>

///<reference path="_references.ts"/>
// values of events that should trigger the selection of all clubs
var internalEventValues = [
    "1",
    "4",
    "5",
    "6",
    "9" // other
];
$("#button-create-submit").add("#button-edit-submit").click(function () {
    var beginDate = new Date($("[name='beginDate']").prop("value") + " " + $("[name='beginTime']").prop("value"));
    var endDate = new Date($("[name='endDate']").prop("value") + " " + $("[name='endTime']").prop("value"));
    var conditions = {
        'endBeforeStart': beginDate.getTime() > endDate.getTime(),
        'forgotFilter': $("#filter-checkboxes").find("input[type=checkbox]:checked").length === 0,
        'forgotPreparation': $('[name="preparationTime"]').val() === "",
        'forgotStartTime': $('[name="beginTime"]').val() === "",
        'forgotEndTime': $('[name="endTime"]').val() === ""
    };
    var untranslatedErrors = Object.keys(conditions).filter(function (key) { return conditions[key]; });
    var errors = untranslatedErrors.map(function (key) { return translate(key); });
    if (errors.length > 0) {
        bootbox.alert(errors.map(function (err) { return "<p>" + err + "</p>"; }).join("\n"));
        return false;
    }
});
$(function () {
    // if set, internal events will trigger selection of all clubs
    // if user sets the club manually, we want to keep his selection
    var autoSelectAllClubs = true;
    var allClubCheckBoxes = $("#filter").find("input[type=checkbox]");
    allClubCheckBoxes.click(function () {
        autoSelectAllClubs = false;
    });
    // important to use function() (anonymous function) here an not an arrow function
    // using an arrow function will change the "this" inside
    $("[name='evnt_type']").click(function () {
        var prop = $(this).val();
        var isInternalEvent = internalEventValues.indexOf(prop) !== -1;
        if (isInternalEvent) {
            if (autoSelectAllClubs) {
                $("#filter").find("input[type=checkbox]").prop("checked", true);
            }
        }
        else {
            // reset all checkboxes
            $("#filter").find("input[type=checkbox]").prop("checked", false);
            var clubName = $(document).find("#place").val();
            var clubId = getIdOfClub(clubName);
            if (clubId !== -1) {
                var showToClubCheckbox = $(document).find("[name=filterShowToClub" + clubId + "]");
                showToClubCheckbox.prop("checked", true);
            }
        }
    });
});

///<reference path="../typings/index.d.ts"/>
///<reference path="Utilities.ts"/>

///<reference path="../typings/index.d.ts"/>
var Question = (function () {
    function Question(element) {
        this.questionDiv = $(element).closest('[name^=question]');
    }
    return Question;
}());

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNyZWF0ZVN1cnZleS50cyIsIlN0YXRpc3RpY3NWaWV3LnRzIiwiVXRpbGl0aWVzLnRzIiwiX3JlZmVyZW5jZXMudHMiLCJDcmVhdGVFZGl0RXZlbnQudHMiLCJFdmVudFZpZXcudHMiLCJRdWVzdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxxQ0FBcUM7QUFFckMsQ0FBQyxDQUFDLHVCQUF1QixDQUFDLENBQUMsS0FBSyxDQUFDO0lBQzdCLElBQUksTUFBTSxHQUFHLElBQUksS0FBSyxFQUFVLENBQUM7SUFDakMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sR0FBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3pDLE1BQU0sQ0FBQyxJQUFJLENBQUMseUZBQXlGLENBQUMsQ0FBQztJQUMzRyxDQUFDO0lBQ0QsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BCLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFBLEdBQUcsSUFBSSxPQUFBLEtBQUssR0FBRyxHQUFHLEdBQUcsTUFBTSxFQUFwQixDQUFvQixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDbEUsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUNqQixDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUM7O0FDWEgscUNBQXFDO0FBRXJDLG9CQUFvQixDQUFTO0lBQ3pCLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUM1QyxDQUFDO0FBRUQsc0JBQXNCLENBQVM7SUFDM0IsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMs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QztBQUU1QztJQUlJLGtCQUFZLE9BQWU7UUFDdkIsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7SUFDOUQsQ0FBQztJQUNMLGVBQUM7QUFBRCxDQVBBLEFBT0MsSUFBQSIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLy88cmVmZXJlbmNlIHBhdGg9XCJfcmVmZXJlbmNlcy50c1wiLz5cclxuXHJcbiQoXCIjYnV0dG9uLWNyZWF0ZS1zdXJ2ZXlcIikuY2xpY2soKCkgPT4ge1xyXG4gICAgbGV0IGVycm9ycyA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XHJcbiAgICBpZiAoJChcIiNkZXNjcmlwdGlvblwiKS52YWwoKS5sZW5ndGggID4gMTUwMCkge1xyXG4gICAgICAgIGVycm9ycy5wdXNoKFwiRGVyIEJlc2NocmVpYnVuZ3N0ZXh0IGlzdCB6dSBsYW5nZSEgRGVyIFRleHQgc29sbHRlIHdlbmlnZXIgYWxzIDE1MDAgWmVpY2hlbiBlbnRoYWx0ZW4uXCIpO1xyXG4gICAgfVxyXG4gICAgaWYgKGVycm9ycy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgYm9vdGJveC5hbGVydChlcnJvcnMubWFwKGVyciA9PiBcIjxwPlwiICsgZXJyICsgXCI8L3A+XCIpLmpvaW4oXCJcXG5cIikpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxufSk7XHJcblxyXG5cclxuIiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiX3JlZmVyZW5jZXMudHNcIi8+XHJcblxyXG5mdW5jdGlvbiBnZXRSb3dOYW1lKGE6IHN0cmluZykge1xyXG4gICAgcmV0dXJuICQoYSkuY2hpbGRyZW4oXCJ0ZFwiKS5lcSgwKS50ZXh0KCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFJvd1NoaWZ0cyhhOiBzdHJpbmcpIHtcclxuICAgIHJldHVybiAkKGEpLmNoaWxkcmVuKFwidGRcIikuZXEoMSkudGV4dCgpO1xyXG59XHJcblxyXG5cclxuLy9pbnNwaXJlZCBieSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzMxNjAyNzcvanF1ZXJ5LXRhYmxlLXNvcnRcclxuZnVuY3Rpb24gc29ydExlYWRlcmJvYXJkcyhzb3J0SWNvbjogSlF1ZXJ5KSB7XHJcbiAgICBsZXQgaXNBc2NlbmRpbmcgPSBzb3J0SWNvbi5oYXNDbGFzcygnZmEtc29ydC1hc2MnKTtcclxuICAgIGxldCByb3dDYXRjaGVyID0gc29ydEljb24ucGFyZW50KCkuZGF0YSgnc29ydCcpID09PSAnbmFtZScgPyBnZXRSb3dOYW1lIDogZ2V0Um93U2hpZnRzO1xyXG4gICAgbGV0ICR0YWJsZSA9IHNvcnRJY29uLnBhcmVudHMoXCJ0YWJsZVwiKTtcclxuICAgIGxldCByb3dzID0gJHRhYmxlXHJcbiAgICAgICAgLmZpbmQoXCJ0Ym9keVwiKVxyXG4gICAgICAgIC5maW5kKFwidHJcIilcclxuICAgICAgICAudG9BcnJheSgpXHJcbiAgICAgICAgLnNvcnQoKGEsIGIpID0+IHJvd0NhdGNoZXIoYSkubG9jYWxlQ29tcGFyZShyb3dDYXRjaGVyKGIpLCB1bmRlZmluZWQsIHsnbnVtZXJpYyc6IHRydWV9KSk7XHJcbiAgICBpZiAoIWlzQXNjZW5kaW5nKSB7XHJcbiAgICAgICAgcm93cy5yZXZlcnNlKCk7XHJcbiAgICB9XHJcbiAgICByb3dzLmZvckVhY2gocm93ID0+ICR0YWJsZS5hcHBlbmQoJChyb3cpKSk7XHJcbiAgICBzb3J0SWNvbi5wYXJlbnRzKCd0YWJsZScpXHJcbiAgICAgICAgLmZpbmQoJy5mYS1zb3J0LCAuZmEtc29ydC1kZXNjLCAuZmEtc29ydC1hc2MnKVxyXG4gICAgICAgIC5yZW1vdmVDbGFzcygnZmEtc29ydC1hc2MnKVxyXG4gICAgICAgIC5yZW1vdmVDbGFzcygnZmEtc29ydC1kZXNjJylcclxuICAgICAgICAuYWRkQ2xhc3MoJ2ZhLXNvcnQnKTtcclxuICAgIHNvcnRJY29uLnJlbW92ZUNsYXNzKCdmYS1zb3J0JylcclxuICAgICAgICAuYWRkQ2xhc3MoaXNBc2NlbmRpbmcgPyAnZmEtc29ydC1kZXNjJyA6ICdmYS1zb3J0LWFzYycpO1xyXG59XHJcbiQoXCIuZmEtc29ydCwgLmZhLXNvcnQtZGVzYywgLmZhLXNvcnQtYXNjXCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgIHNvcnRMZWFkZXJib2FyZHModGhpcyk7XHJcbn0pO1xyXG5cclxuJCgnI2xlYWRlcmJvYXJkc1RhYnMnKS5maW5kKCd0aGVhZCcpLmZpbmQoJ3RkJykuY2xpY2soZnVuY3Rpb24oKSB7XHJcbiAgICBzb3J0TGVhZGVyYm9hcmRzKCQoJCh0aGlzKS5maW5kKCdpJykuZmlyc3QoKSkpO1xyXG59KTtcclxuIiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiX3JlZmVyZW5jZXMudHNcIi8+XHJcbmVudW0gQ2x1YiB7XHJcbiAgICBOb25lLFxyXG4gICAgQmNDbHViID0gMixcclxuICAgIEJjQ2FmZSxcclxuICAgIEJkQ2x1YixcclxuICAgIEJoQ2x1YixcclxuICAgIEJpQ2x1YlxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRJZE9mQ2x1YiAoY2x1Yjogc3RyaW5nKTogQ2x1YiB7XHJcbiAgICBzd2l0Y2ggKGNsdWIpIHtcclxuICAgICAgICBjYXNlIFwiYmMtQ2x1YlwiOlxyXG4gICAgICAgICAgICByZXR1cm4gQ2x1Yi5CY0NsdWI7XHJcbiAgICAgICAgY2FzZSBcImJjLUNhZsOpXCI6XHJcbiAgICAgICAgICAgIHJldHVybiBDbHViLkJjQ2FmZTtcclxuICAgIH1cclxuICAgIHJldHVybiBDbHViLk5vbmU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNob3dFcnJvck1vZGFsKG1lc3NhZ2U6IHN0cmluZykge1xyXG4gICAgJChcIiNlcnJvck1vZGFsXCIpLm1vZGFsKFwic2hvd1wiKTtcclxuICAgICQoXCIjZXJyb3JNb2RhbFwiKS5maW5kKFwiLm1vZGFsLWJvZHlcIikuaHRtbChtZXNzYWdlKTtcclxufVxyXG4iLCIvLyBleHRlcm5hbCByZWZlcmVuY2VzIGdvIGhlcmVcclxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vdHlwaW5ncy9pbmRleC5kLnRzXCIvPlxyXG5cclxuLy8gaW50ZXJuYWwgcmVmZXJlbmNlIGdvIGhlcmVcclxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiQ3JlYXRlRWRpdEV2ZW50LnRzXCIvPlxyXG4vLy88cmVmZXJlbmNlIHBhdGg9XCJDcmVhdGVTdXJ2ZXkudHNcIi8+XHJcbi8vLzxyZWZlcmVuY2UgcGF0aD1cIlN0YXRpc3RpY3NWaWV3LnRzXCIvPlxyXG4vLy88cmVmZXJlbmNlIHBhdGg9XCJVdGlsaXRpZXMudHNcIi8+XHJcblxyXG5kZWNsYXJlIGxldCB0cmFuc2xhdGU6IChrZXk6IHN0cmluZykgPT4gc3RyaW5nO1xyXG5cclxuXHJcbiIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIl9yZWZlcmVuY2VzLnRzXCIvPlxyXG5cclxuLy8gdmFsdWVzIG9mIGV2ZW50cyB0aGF0IHNob3VsZCB0cmlnZ2VyIHRoZSBzZWxlY3Rpb24gb2YgYWxsIGNsdWJzXHJcbmxldCBpbnRlcm5hbEV2ZW50VmFsdWVzID0gW1xyXG4gICAgXCIxXCIsIC8vIEluZm9cclxuICAgIFwiNFwiLCAvLyBJbnRlcm5hbCBldmVudFxyXG4gICAgXCI1XCIsIC8vIHByaXZhdGUgcGFydHlcclxuICAgIFwiNlwiLCAvLyBjbGVhbmluZ1xyXG4gICAgXCI5XCIgIC8vIG90aGVyXHJcbl07XHJcblxyXG4kKFwiI2J1dHRvbi1jcmVhdGUtc3VibWl0XCIpLmFkZChcIiNidXR0b24tZWRpdC1zdWJtaXRcIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIGxldCBiZWdpbkRhdGUgPSBuZXcgRGF0ZSgkKFwiW25hbWU9J2JlZ2luRGF0ZSddXCIpLnByb3AoXCJ2YWx1ZVwiKSArIFwiIFwiICsgJChcIltuYW1lPSdiZWdpblRpbWUnXVwiKS5wcm9wKFwidmFsdWVcIikpO1xyXG4gICAgbGV0IGVuZERhdGUgPSBuZXcgRGF0ZSgkKFwiW25hbWU9J2VuZERhdGUnXVwiKS5wcm9wKFwidmFsdWVcIikgKyBcIiBcIiArICQoXCJbbmFtZT0nZW5kVGltZSddXCIpLnByb3AoXCJ2YWx1ZVwiKSk7XHJcblxyXG4gICAgbGV0IGNvbmRpdGlvbnM6IHtba2V5OiBzdHJpbmddOiBib29sZWFufSA9IHtcclxuICAgICAgICAnZW5kQmVmb3JlU3RhcnQnOiBiZWdpbkRhdGUuZ2V0VGltZSgpID4gZW5kRGF0ZS5nZXRUaW1lKCksXHJcbiAgICAgICAgJ2ZvcmdvdEZpbHRlcic6ICQoXCIjZmlsdGVyLWNoZWNrYm94ZXNcIikuZmluZChcImlucHV0W3R5cGU9Y2hlY2tib3hdOmNoZWNrZWRcIikubGVuZ3RoID09PSAwLFxyXG4gICAgICAgICdmb3Jnb3RQcmVwYXJhdGlvbic6ICQoJ1tuYW1lPVwicHJlcGFyYXRpb25UaW1lXCJdJykudmFsKCkgPT09IFwiXCIsXHJcbiAgICAgICAgJ2ZvcmdvdFN0YXJ0VGltZSc6ICQoJ1tuYW1lPVwiYmVnaW5UaW1lXCJdJykudmFsKCkgPT09IFwiXCIsXHJcbiAgICAgICAgJ2ZvcmdvdEVuZFRpbWUnOiAkKCdbbmFtZT1cImVuZFRpbWVcIl0nKS52YWwoKSA9PT0gXCJcIlxyXG4gICAgfTtcclxuXHJcbiAgICBsZXQgdW50cmFuc2xhdGVkRXJyb3JzID0gT2JqZWN0LmtleXMoY29uZGl0aW9ucykuZmlsdGVyKGtleSA9PiBjb25kaXRpb25zW2tleV0pO1xyXG5cclxuICAgIGxldCBlcnJvcnMgPSB1bnRyYW5zbGF0ZWRFcnJvcnMubWFwKGtleSA9PiB0cmFuc2xhdGUoa2V5KSk7XHJcblxyXG4gICAgaWYgKGVycm9ycy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgYm9vdGJveC5hbGVydChlcnJvcnMubWFwKGVyciA9PiBcIjxwPlwiICsgZXJyICsgXCI8L3A+XCIpLmpvaW4oXCJcXG5cIikpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxufSk7XHJcbiQoKCkgPT4ge1xyXG4gICAgLy8gaWYgc2V0LCBpbnRlcm5hbCBldmVudHMgd2lsbCB0cmlnZ2VyIHNlbGVjdGlvbiBvZiBhbGwgY2x1YnNcclxuICAgIC8vIGlmIHVzZXIgc2V0cyB0aGUgY2x1YiBtYW51YWxseSwgd2Ugd2FudCB0byBrZWVwIGhpcyBzZWxlY3Rpb25cclxuICAgIGxldCBhdXRvU2VsZWN0QWxsQ2x1YnMgPSB0cnVlO1xyXG4gICAgbGV0IGFsbENsdWJDaGVja0JveGVzID0gJChcIiNmaWx0ZXJcIikuZmluZChcImlucHV0W3R5cGU9Y2hlY2tib3hdXCIpO1xyXG4gICAgYWxsQ2x1YkNoZWNrQm94ZXMuY2xpY2soKCkgPT4ge1xyXG4gICAgICAgIGF1dG9TZWxlY3RBbGxDbHVicyA9IGZhbHNlO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gaW1wb3J0YW50IHRvIHVzZSBmdW5jdGlvbigpIChhbm9ueW1vdXMgZnVuY3Rpb24pIGhlcmUgYW4gbm90IGFuIGFycm93IGZ1bmN0aW9uXHJcbiAgICAvLyB1c2luZyBhbiBhcnJvdyBmdW5jdGlvbiB3aWxsIGNoYW5nZSB0aGUgXCJ0aGlzXCIgaW5zaWRlXHJcbiAgICAkKFwiW25hbWU9J2V2bnRfdHlwZSddXCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBsZXQgcHJvcCA9ICQodGhpcykudmFsKCk7XHJcbiAgICAgICAgbGV0IGlzSW50ZXJuYWxFdmVudCA9IGludGVybmFsRXZlbnRWYWx1ZXMuaW5kZXhPZihwcm9wKSAhPT0gLTE7XHJcbiAgICAgICAgaWYgKGlzSW50ZXJuYWxFdmVudCkge1xyXG4gICAgICAgICAgICBpZiAoYXV0b1NlbGVjdEFsbENsdWJzKSB7XHJcbiAgICAgICAgICAgICAgICAkKFwiI2ZpbHRlclwiKS5maW5kKFwiaW5wdXRbdHlwZT1jaGVja2JveF1cIikucHJvcChcImNoZWNrZWRcIiwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIHJlc2V0IGFsbCBjaGVja2JveGVzXHJcbiAgICAgICAgICAgICQoXCIjZmlsdGVyXCIpLmZpbmQoXCJpbnB1dFt0eXBlPWNoZWNrYm94XVwiKS5wcm9wKFwiY2hlY2tlZFwiLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIGxldCBjbHViTmFtZSA9ICQoZG9jdW1lbnQpLmZpbmQoXCIjcGxhY2VcIikudmFsKCk7XHJcbiAgICAgICAgICAgIGxldCBjbHViSWQgPSBnZXRJZE9mQ2x1YihjbHViTmFtZSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoY2x1YklkICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHNob3dUb0NsdWJDaGVja2JveCA9ICQoZG9jdW1lbnQpLmZpbmQoXCJbbmFtZT1maWx0ZXJTaG93VG9DbHViXCIgKyBjbHViSWQgKyBcIl1cIik7XHJcbiAgICAgICAgICAgICAgICBzaG93VG9DbHViQ2hlY2tib3gucHJvcChcImNoZWNrZWRcIiwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufSk7XHJcblxyXG4iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLi90eXBpbmdzL2luZGV4LmQudHNcIi8+XHJcbi8vLzxyZWZlcmVuY2UgcGF0aD1cIlV0aWxpdGllcy50c1wiLz5cclxuXHJcblxyXG4iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLi90eXBpbmdzL2luZGV4LmQudHNcIi8+XHJcblxyXG5jbGFzcyBRdWVzdGlvbiB7XHJcblxyXG4gICAgcHJpdmF0ZSBxdWVzdGlvbkRpdjogSlF1ZXJ5O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQ6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb25EaXYgPSAkKGVsZW1lbnQpLmNsb3Nlc3QoJ1tuYW1lXj1xdWVzdGlvbl0nKTtcclxuICAgIH1cclxufSJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
