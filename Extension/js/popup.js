$(document).ready(function() {
    $(".score_div").hide();
    $(".feedback_div").hide();

    $("#checc").click(function() {
        $("#checc_span").addClass("spinner-border spinner-border-sm");
        $("#checc").prop('disabled', true);

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
                    $(".checc_div").hide();
                    $('.score_div').show();
                    $("#score").text('Score: ' + data['combined prob'] + '% reliable');
                    $(".feedback_div").show();
                }
            });
        });
    });

    $("#yesOrNo").click(function() {
        $.ajax({
            url: 'http://127.0.0.1:5000/feedback',
            type: "POST",
            data: { 'feedback': $(this).text() },
            dataType: "json",
            success: function(data) {
                $('#question').text('Thank you for submitting feedback!');
                $(".feedback_btn").hide();
            }
        });
    });
});