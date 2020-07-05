$(document).ready(function() {
    $("button").click(function() {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            var activeTab = tabs[0];
            activeTabURL = activeTab.url;

            $.ajax({
                url: 'http://127.0.0.1:5000/',
                type: "POST",
                data: { 'url': activeTabURL },
                dataType: "json",
                success: function(data) {
                    $("p").text('Score: ' + data['combined prob'] + '% reliable');
                }
            });


        });
    });
});