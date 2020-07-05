$(document).ready(function() {
    $("#checkPage").click(function() {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            var activeTab = tabs[0];
            activeTabURL = activeTab.url;

            $.ajax({
                url: 'http://127.0.0.1:5000/',
                type: "POST",
                data: { 'url': activeTabURL },
                dataType: "json",
                success: function(data) {
                    $("#score").text('Score: ' + data['combined prob'] + '% reliable');
                    $("#question").show()
                    $("#yes").show();
                    $('#no').show();
                }
            });
        });
    });

    $("#yes").click(function() {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            var activeTab = tabs[0];
            activeTabURL = activeTab.url;

            $.ajax({
                url: 'http://127.0.0.1:5000/',
                type: "POST",
                data: { 'url': activeTabURL },
                dataType: "json",
                success: function(data) {

                }
            });
        });
    });

    $("#no").click(function() {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            var activeTab = tabs[0];
            activeTabURL = activeTab.url;

            $.ajax({
                url: 'http://127.0.0.1:5000/',
                type: "POST",
                data: { 'url': activeTabURL },
                dataType: "json",
                success: function(data) {

                }
            });
        });
    });
});