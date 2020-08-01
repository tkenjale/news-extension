$(document).ready(function() {
    $("#thanks").hide();
    $(".score_div").hide();
    $(".feedback_div").hide();
    $(".unsupported_div").hide();
    $(".jumbotron").css("height", "225px");

    $("#checc").click(function() {
        $("#checc_span").addClass("spinner-border text-light");
        $("#checc_span").text("");
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

                    if (data['combined_prob'] == "error") {
                        $(".unsupported_div").fadeIn("slow");
                    } else {
                        $('.score_div').fadeIn("slow");

                        var prob = parseFloat(data['combined_prob']);

                        if (prob >= 70) {
                            $(".progress-bar").addClass("bg-success");
                        } else if (prob >= 40) {
                            $(".progress-bar").addClass("bg-warning");
                        } else {
                            $(".progress-bar").addClass("bg-danger");
                        }

                        $(".progress-bar").animate({ width: prob + '%' }, "slow").delay(600).promise().done(function() {
                            $(".progress-bar-title").text(prob + '% Reliable').delay(400).promise().done(function() {
                                $(".feedback_div").fadeIn(1500);
                            });

                        });
                    }
                }
            });
        });
    });

    $(".yesOrNo").click(function() {
        $.ajax({
            url: 'http://127.0.0.1:5000/feedback',
            type: "POST",
            data: { 'feedback': $(this).text() },
            dataType: "json",
            success: function(data) {
                $('#question').fadeOut("slow");
                $(".feedback_btn").fadeOut("slow").promise().done(function() {
                    $("#thanks").fadeIn("slow");
                });
            }
        });
    });
});