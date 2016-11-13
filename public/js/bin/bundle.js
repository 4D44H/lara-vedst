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
// internal reference go here
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
    var errors = new Array();
    var beginDate = new Date($("[name='beginDate']").prop("value") + " " + $("[name='beginTime']").prop("value"));
    var endDate = new Date($("[name='endDate']").prop("value") + " " + $("[name='endTime']").prop("value"));
    if (beginDate.getTime() > endDate.getTime()) {
        errors.push("Die Startzeit liegt vor der Endzeit!");
    }
    if ($("#filter-checkboxes").find("input[type=checkbox]:checked").length === 0) {
        errors.push("Den Filter vergessen! Bitte setze mindestens eine Sektion, der diese Veranstaltung/Aufgabe gezeigt werden soll.");
    }
    if ($('[name="preparationTime"]').val() === "") {
        errors.push("Die Dienstvorbereitungszeit vergessen!");
    }
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNyZWF0ZVN1cnZleS50cyIsIlN0YXRpc3RpY3NWaWV3LnRzIiwiVXRpbGl0aWVzLnRzIiwiX3JlZmVyZW5jZXMudHMiLCJDcmVhdGVFZGl0RXZlbnQudHMiLCJFdmVudFZpZXcudHMiLCJRdWVzdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxxQ0FBcUM7QUFFckMsQ0FBQyxDQUFDLHVCQUF1QixDQUFDLENBQUMsS0FBSyxDQUFDO0lBQzdCLElBQUksTUFBTSxHQUFHLElBQUksS0FBSyxFQUFVLENBQUM7SUFDakMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sR0FBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3pDLE1BQU0sQ0FBQyxJQUFJLENBQUMseUZBQXlGLENBQUMsQ0FBQztJQUMzRyxDQUFDO0lBQ0QsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BCLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFBLEdBQUcsSUFBSSxPQUFBLEtBQUssR0FBRyxHQUFHLEdBQUcsTUFBTSxFQUFwQixDQUFvQixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDbEUsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUNqQixDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUM7O0FDWEgscUNBQXFDO0FBRXJDLG9CQUFvQixDQUFTO0lBQ3pCLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUM1QyxDQUFDO0FBRUQsc0JBQXNCLENBQVM7SUFDM0IsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMs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O0FBQUQsQ0FQQSxBQU9DLElBQUEiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8vPHJlZmVyZW5jZSBwYXRoPVwiX3JlZmVyZW5jZXMudHNcIi8+XHJcblxyXG4kKFwiI2J1dHRvbi1jcmVhdGUtc3VydmV5XCIpLmNsaWNrKCgpID0+IHtcclxuICAgIGxldCBlcnJvcnMgPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xyXG4gICAgaWYgKCQoXCIjZGVzY3JpcHRpb25cIikudmFsKCkubGVuZ3RoICA+IDE1MDApIHtcclxuICAgICAgICBlcnJvcnMucHVzaChcIkRlciBCZXNjaHJlaWJ1bmdzdGV4dCBpc3QgenUgbGFuZ2UhIERlciBUZXh0IHNvbGx0ZSB3ZW5pZ2VyIGFscyAxNTAwIFplaWNoZW4gZW50aGFsdGVuLlwiKTtcclxuICAgIH1cclxuICAgIGlmIChlcnJvcnMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGJvb3Rib3guYWxlcnQoZXJyb3JzLm1hcChlcnIgPT4gXCI8cD5cIiArIGVyciArIFwiPC9wPlwiKS5qb2luKFwiXFxuXCIpKTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxuXHJcbiIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIl9yZWZlcmVuY2VzLnRzXCIvPlxyXG5cclxuZnVuY3Rpb24gZ2V0Um93TmFtZShhOiBzdHJpbmcpIHtcclxuICAgIHJldHVybiAkKGEpLmNoaWxkcmVuKFwidGRcIikuZXEoMCkudGV4dCgpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRSb3dTaGlmdHMoYTogc3RyaW5nKSB7XHJcbiAgICByZXR1cm4gJChhKS5jaGlsZHJlbihcInRkXCIpLmVxKDEpLnRleHQoKTtcclxufVxyXG5cclxuXHJcbi8vaW5zcGlyZWQgYnkgaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8zMTYwMjc3L2pxdWVyeS10YWJsZS1zb3J0XHJcbmZ1bmN0aW9uIHNvcnRMZWFkZXJib2FyZHMoc29ydEljb246IEpRdWVyeSkge1xyXG4gICAgbGV0IGlzQXNjZW5kaW5nID0gc29ydEljb24uaGFzQ2xhc3MoJ2ZhLXNvcnQtYXNjJyk7XHJcbiAgICBsZXQgcm93Q2F0Y2hlciA9IHNvcnRJY29uLnBhcmVudCgpLmRhdGEoJ3NvcnQnKSA9PT0gJ25hbWUnID8gZ2V0Um93TmFtZSA6IGdldFJvd1NoaWZ0cztcclxuICAgIGxldCAkdGFibGUgPSBzb3J0SWNvbi5wYXJlbnRzKFwidGFibGVcIik7XHJcbiAgICBsZXQgcm93cyA9ICR0YWJsZVxyXG4gICAgICAgIC5maW5kKFwidGJvZHlcIilcclxuICAgICAgICAuZmluZChcInRyXCIpXHJcbiAgICAgICAgLnRvQXJyYXkoKVxyXG4gICAgICAgIC5zb3J0KChhLCBiKSA9PiByb3dDYXRjaGVyKGEpLmxvY2FsZUNvbXBhcmUocm93Q2F0Y2hlcihiKSwgdW5kZWZpbmVkLCB7J251bWVyaWMnOiB0cnVlfSkpO1xyXG4gICAgaWYgKCFpc0FzY2VuZGluZykge1xyXG4gICAgICAgIHJvd3MucmV2ZXJzZSgpO1xyXG4gICAgfVxyXG4gICAgcm93cy5mb3JFYWNoKHJvdyA9PiAkdGFibGUuYXBwZW5kKCQocm93KSkpO1xyXG4gICAgc29ydEljb24ucGFyZW50cygndGFibGUnKVxyXG4gICAgICAgIC5maW5kKCcuZmEtc29ydCwgLmZhLXNvcnQtZGVzYywgLmZhLXNvcnQtYXNjJylcclxuICAgICAgICAucmVtb3ZlQ2xhc3MoJ2ZhLXNvcnQtYXNjJylcclxuICAgICAgICAucmVtb3ZlQ2xhc3MoJ2ZhLXNvcnQtZGVzYycpXHJcbiAgICAgICAgLmFkZENsYXNzKCdmYS1zb3J0Jyk7XHJcbiAgICBzb3J0SWNvbi5yZW1vdmVDbGFzcygnZmEtc29ydCcpXHJcbiAgICAgICAgLmFkZENsYXNzKGlzQXNjZW5kaW5nID8gJ2ZhLXNvcnQtZGVzYycgOiAnZmEtc29ydC1hc2MnKTtcclxufVxyXG4kKFwiLmZhLXNvcnQsIC5mYS1zb3J0LWRlc2MsIC5mYS1zb3J0LWFzY1wiKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICBzb3J0TGVhZGVyYm9hcmRzKHRoaXMpO1xyXG59KTtcclxuXHJcbiQoJyNsZWFkZXJib2FyZHNUYWJzJykuZmluZCgndGhlYWQnKS5maW5kKCd0ZCcpLmNsaWNrKGZ1bmN0aW9uKCkge1xyXG4gICAgc29ydExlYWRlcmJvYXJkcygkKCQodGhpcykuZmluZCgnaScpLmZpcnN0KCkpKTtcclxufSk7XHJcbiIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIl9yZWZlcmVuY2VzLnRzXCIvPlxyXG5lbnVtIENsdWIge1xyXG4gICAgTm9uZSxcclxuICAgIEJjQ2x1YiA9IDIsXHJcbiAgICBCY0NhZmUsXHJcbiAgICBCZENsdWIsXHJcbiAgICBCaENsdWIsXHJcbiAgICBCaUNsdWJcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0SWRPZkNsdWIgKGNsdWI6IHN0cmluZyk6IENsdWIge1xyXG4gICAgc3dpdGNoIChjbHViKSB7XHJcbiAgICAgICAgY2FzZSBcImJjLUNsdWJcIjpcclxuICAgICAgICAgICAgcmV0dXJuIENsdWIuQmNDbHViO1xyXG4gICAgICAgIGNhc2UgXCJiYy1DYWbDqVwiOlxyXG4gICAgICAgICAgICByZXR1cm4gQ2x1Yi5CY0NhZmU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gQ2x1Yi5Ob25lO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzaG93RXJyb3JNb2RhbChtZXNzYWdlOiBzdHJpbmcpIHtcclxuICAgICQoXCIjZXJyb3JNb2RhbFwiKS5tb2RhbChcInNob3dcIik7XHJcbiAgICAkKFwiI2Vycm9yTW9kYWxcIikuZmluZChcIi5tb2RhbC1ib2R5XCIpLmh0bWwobWVzc2FnZSk7XHJcbn1cclxuIiwiLy8gZXh0ZXJuYWwgcmVmZXJlbmNlcyBnbyBoZXJlXHJcbi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL3R5cGluZ3MvaW5kZXguZC50c1wiLz5cclxuXHJcbi8vIGludGVybmFsIHJlZmVyZW5jZSBnbyBoZXJlXHJcbi8vLzxyZWZlcmVuY2UgcGF0aD1cIkNyZWF0ZUVkaXRFdmVudC50c1wiLz5cclxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiQ3JlYXRlU3VydmV5LnRzXCIvPlxyXG4vLy88cmVmZXJlbmNlIHBhdGg9XCJTdGF0aXN0aWNzVmlldy50c1wiLz5cclxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiVXRpbGl0aWVzLnRzXCIvPlxyXG5cclxuIiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiX3JlZmVyZW5jZXMudHNcIi8+XHJcblxyXG4vLyB2YWx1ZXMgb2YgZXZlbnRzIHRoYXQgc2hvdWxkIHRyaWdnZXIgdGhlIHNlbGVjdGlvbiBvZiBhbGwgY2x1YnNcclxubGV0IGludGVybmFsRXZlbnRWYWx1ZXMgPSBbXHJcbiAgICBcIjFcIiwgLy8gSW5mb1xyXG4gICAgXCI0XCIsIC8vIEludGVybmFsIGV2ZW50XHJcbiAgICBcIjVcIiwgLy8gcHJpdmF0ZSBwYXJ0eVxyXG4gICAgXCI2XCIsIC8vIGNsZWFuaW5nXHJcbiAgICBcIjlcIiAgLy8gb3RoZXJcclxuXTtcclxuXHJcbiQoXCIjYnV0dG9uLWNyZWF0ZS1zdWJtaXRcIikuYWRkKFwiI2J1dHRvbi1lZGl0LXN1Ym1pdFwiKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgZXJyb3JzID0gbmV3IEFycmF5PHN0cmluZz4oKTtcclxuXHJcbiAgICBsZXQgYmVnaW5EYXRlID0gbmV3IERhdGUoJChcIltuYW1lPSdiZWdpbkRhdGUnXVwiKS5wcm9wKFwidmFsdWVcIikgKyBcIiBcIiArICQoXCJbbmFtZT0nYmVnaW5UaW1lJ11cIikucHJvcChcInZhbHVlXCIpKTtcclxuICAgIGxldCBlbmREYXRlID0gbmV3IERhdGUoJChcIltuYW1lPSdlbmREYXRlJ11cIikucHJvcChcInZhbHVlXCIpICsgXCIgXCIgKyAkKFwiW25hbWU9J2VuZFRpbWUnXVwiKS5wcm9wKFwidmFsdWVcIikpO1xyXG4gICAgaWYgKGJlZ2luRGF0ZS5nZXRUaW1lKCkgPiBlbmREYXRlLmdldFRpbWUoKSkge1xyXG4gICAgICAgIGVycm9ycy5wdXNoKFwiRGllIFN0YXJ0emVpdCBsaWVndCB2b3IgZGVyIEVuZHplaXQhXCIpO1xyXG4gICAgfVxyXG4gICAgaWYgKCQoXCIjZmlsdGVyLWNoZWNrYm94ZXNcIikuZmluZChcImlucHV0W3R5cGU9Y2hlY2tib3hdOmNoZWNrZWRcIikubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgZXJyb3JzLnB1c2goXCJEZW4gRmlsdGVyIHZlcmdlc3NlbiEgQml0dGUgc2V0emUgbWluZGVzdGVucyBlaW5lIFNla3Rpb24sIGRlciBkaWVzZSBWZXJhbnN0YWx0dW5nL0F1ZmdhYmUgZ2V6ZWlndCB3ZXJkZW4gc29sbC5cIik7XHJcbiAgICB9XHJcbiAgICBpZiAoJCgnW25hbWU9XCJwcmVwYXJhdGlvblRpbWVcIl0nKS52YWwoKSA9PT0gXCJcIikge1xyXG4gICAgICAgIGVycm9ycy5wdXNoKFwiRGllIERpZW5zdHZvcmJlcmVpdHVuZ3N6ZWl0IHZlcmdlc3NlbiFcIik7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGVycm9ycy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgYm9vdGJveC5hbGVydChlcnJvcnMubWFwKGVyciA9PiBcIjxwPlwiICsgZXJyICsgXCI8L3A+XCIpLmpvaW4oXCJcXG5cIikpXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG59KTtcclxuJCgoKSA9PiB7XHJcbiAgICAvLyBpZiBzZXQsIGludGVybmFsIGV2ZW50cyB3aWxsIHRyaWdnZXIgc2VsZWN0aW9uIG9mIGFsbCBjbHVic1xyXG4gICAgLy8gaWYgdXNlciBzZXRzIHRoZSBjbHViIG1hbnVhbGx5LCB3ZSB3YW50IHRvIGtlZXAgaGlzIHNlbGVjdGlvblxyXG4gICAgbGV0IGF1dG9TZWxlY3RBbGxDbHVicyA9IHRydWU7XHJcbiAgICBsZXQgYWxsQ2x1YkNoZWNrQm94ZXMgPSAkKFwiI2ZpbHRlclwiKS5maW5kKFwiaW5wdXRbdHlwZT1jaGVja2JveF1cIik7XHJcbiAgICBhbGxDbHViQ2hlY2tCb3hlcy5jbGljaygoKSA9PiB7XHJcbiAgICAgICAgYXV0b1NlbGVjdEFsbENsdWJzID0gZmFsc2U7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBpbXBvcnRhbnQgdG8gdXNlIGZ1bmN0aW9uKCkgKGFub255bW91cyBmdW5jdGlvbikgaGVyZSBhbiBub3QgYW4gYXJyb3cgZnVuY3Rpb25cclxuICAgIC8vIHVzaW5nIGFuIGFycm93IGZ1bmN0aW9uIHdpbGwgY2hhbmdlIHRoZSBcInRoaXNcIiBpbnNpZGVcclxuICAgICQoXCJbbmFtZT0nZXZudF90eXBlJ11cIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGxldCBwcm9wID0gJCh0aGlzKS52YWwoKTtcclxuICAgICAgICBsZXQgaXNJbnRlcm5hbEV2ZW50ID0gaW50ZXJuYWxFdmVudFZhbHVlcy5pbmRleE9mKHByb3ApICE9PSAtMTtcclxuICAgICAgICBpZiAoaXNJbnRlcm5hbEV2ZW50KSB7XHJcbiAgICAgICAgICAgIGlmIChhdXRvU2VsZWN0QWxsQ2x1YnMpIHtcclxuICAgICAgICAgICAgICAgICQoXCIjZmlsdGVyXCIpLmZpbmQoXCJpbnB1dFt0eXBlPWNoZWNrYm94XVwiKS5wcm9wKFwiY2hlY2tlZFwiLCB0cnVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgLy8gcmVzZXQgYWxsIGNoZWNrYm94ZXNcclxuICAgICAgICAgICAgJChcIiNmaWx0ZXJcIikuZmluZChcImlucHV0W3R5cGU9Y2hlY2tib3hdXCIpLnByb3AoXCJjaGVja2VkXCIsIGZhbHNlKTtcclxuICAgICAgICAgICAgbGV0IGNsdWJOYW1lID0gJChkb2N1bWVudCkuZmluZChcIiNwbGFjZVwiKS52YWwoKTtcclxuICAgICAgICAgICAgbGV0IGNsdWJJZCA9IGdldElkT2ZDbHViKGNsdWJOYW1lKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChjbHViSWQgIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc2hvd1RvQ2x1YkNoZWNrYm94ID0gJChkb2N1bWVudCkuZmluZChcIltuYW1lPWZpbHRlclNob3dUb0NsdWJcIiArIGNsdWJJZCArIFwiXVwiKTtcclxuICAgICAgICAgICAgICAgIHNob3dUb0NsdWJDaGVja2JveC5wcm9wKFwiY2hlY2tlZFwiLCB0cnVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59KTtcclxuXHJcbiIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL3R5cGluZ3MvaW5kZXguZC50c1wiLz5cclxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiVXRpbGl0aWVzLnRzXCIvPlxyXG5cclxuXHJcbiIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL3R5cGluZ3MvaW5kZXguZC50c1wiLz5cclxuXHJcbmNsYXNzIFF1ZXN0aW9uIHtcclxuXHJcbiAgICBwcml2YXRlIHF1ZXN0aW9uRGl2OiBKUXVlcnk7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZWxlbWVudDogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvbkRpdiA9ICQoZWxlbWVudCkuY2xvc2VzdCgnW25hbWVePXF1ZXN0aW9uXScpO1xyXG4gICAgfVxyXG59Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
