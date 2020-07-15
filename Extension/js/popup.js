$(document).ready(function() {
    $(".score_div").hide();
    $(".feedback_div").hide();
    $(".jumbotron").css("height", "225px");

    $("#checc").click(function() {
        $("#checc_span").addClass("spinner-border text-info");
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
                    $('.score_div').fadeIn("slow");

                    var prob = parseFloat(data['combined prob']);
                    if (prob >= 70) {
                        $(".progress-bar").addClass("bg-success");
                    } else if (prob >= 40) {
                        $(".progress-bar").addClass("bg-warning");
                    } else {
                        $(".progress-bar").addClass("bg-danger");
                    }

                    $(".progress-bar").animate({ width: prob + '%' }, "slow").delay(600).promise().done(function() {
                        $(".progress-bar-title").text(prob + '% Reliable').delay(600).promise().done(function() {
                            $(".feedback_div").fadeIn(1500);
                        });

                    });


                    //$(".progress-bar").animate({ width: prob + '%' }, "slow", function() {
                    //    $(".progress-bar-title").text($(".progress-bar").css("width") + '% reliable');
                    //});

                    //$("#score").text(prob + '% reliable');

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
                $('#question').text('Thanks for the feedback!');
                $(".feedback_btn").fadeOut("slow");
            }
        });
    });
});