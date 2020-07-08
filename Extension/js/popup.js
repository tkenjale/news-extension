$(document).ready(function() {
    $("#checkPage").click(function() {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            var activeTab = tabs[0];
            activeTabURL = activeTab.url;

            $.ajax({
                url: 'http://127.0.0.1:5000/predict',
                type: "POST",
                data: { 'url': activeTabURL },
                dataType: "json",
                success: function(data) {
                    $('#instructions').hide();
                    $("#checkPage").hide();
                    $('#score').show();
                    $("#score").text('Score: ' + data['combined prob'] + '% reliable');
                    $("#question").show();
                    $(".feedback").show();
                }
            });
        });
    });

    $(".feedback").click(function() {
        $.ajax({
            url: 'http://127.0.0.1:5000/feedback',
            type: "POST",
            data: { 'feedback': $(this).text() },
            dataType: "json",
            success: function(data) {
                $('#question').text('Thank you for submitting feedback!');
                $(".feedback").hide();
            }
        });
    });
});