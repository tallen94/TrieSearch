$(document).ready(function () {
    $("#searchQuery").on('input', getSuggestions);
});

function getSuggestions() {
    var text = $("#searchQuery").val();
    if (text.length > 0) {
        $.ajax({
            type: "POST",
            url: "SearchSuggestions.asmx/GetSuggestions",
            data: JSON.stringify({ s: text }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: ajaxSuccess,
            error: ajaxError
        });
    } else {
        $("#suggestions").html("");
    }
}

function ajaxSuccess(msg) {
    var suggestionsDOM = $("#suggestions");
    suggestionsDOM.html("");
    var suggestions = msg.d;
    suggestions.forEach(function (suggestion) {
        suggestionsDOM.append("<li>" + suggestion + "</li>");
    });
}

function ajaxError(msg) {
    console.log(msg);
}

