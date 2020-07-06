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
                    $("#score").text('Score: ' + data['combined prob'] + '% reliable');
                    $("#question").show()
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
                $("#question").hide()
                $(".feedback").hide();
            }
        });
    });
});