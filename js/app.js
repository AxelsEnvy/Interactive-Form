/******************************************
Treehouse Techdegree:
FSJS project 3 - Interactive Form
******************************************/
$(function() {
     /*
       Intial setup for form.
    */
    // Total cost variable.
    let totalCost = 0;

    // Payment method variables.
    const creditCardDiv = $("div#credit-card");
    const paypalDiv = $("div#credit-card").next();
    const bitcoinDiv = paypalDiv.next();

    // Focus for first input field.
    $("input:text:first").focus();
    // Job title dropdown; hides other textbox(es).
    $("#other-title").addClass('is-hidden');
     // T-shirt info section, hides colors dropdown menu.
    $("div#colors-js-puns").hide();
    // Removes the select payment option in the payment dropdown.
    $("select#payment option:eq(0)").remove();
    // Selects the credit card option as default.
    $("select#payment option[value='credit card']").prop('selected', true);

    // Shows corresponding payment option details for selected payment option.
    function adjustPaymentDiv (hiddenDiv1, hiddenDiv2, showDiv) {
        $(showDiv).removeClass('is-hidden');
        $(hiddenDiv1).addClass('is-hidden');
        $(hiddenDiv2).addClass('is-hidden');
    }
    adjustPaymentDiv(paypalDiv, bitcoinDiv, creditCardDiv);
    /*
      Global Functions Section.
    */
    //Given an element, function creates an error <div> with a message, and appends the message to the corresponding form location.
    function createErrorMessage(errorElement) {
        let whichError;
        const isCCNumber = ((errorElement.id) && (errorElement.id === 'cc-num'));
        const isZip = ((errorElement.id) && (errorElement.id === 'zip'));
        const isCVV = ((errorElement.id) && (errorElement.id === 'cvv'));
        const messages = {
            name: "You must enter your name to register",
            mail: "Please enter a valid email address",
            activity: "Please register for at least one activity",
            ccnum: "Please enter 13 to 16 numbers for your credit card",
            zip: "Please enter exactly 5 numbers for your zip code",
            cvv: "Please enter exactly 3 numbers for your CVV",
            empty: "Please be sure to enter valid credit card information"
        };

        // If statement that determines correct message to display, based on form ID or class.
        if (errorElement.id) {
            whichError = (isCCNumber) ? messages.ccnum : messages[errorElement.id];
        } else {
            whichError = messages.activity;
        }

        // If statement that will display 'empty' for payment error if the field is left empty.
        if (isCCNumber && $('#cc-num').val().trim().length == 0) { whichError = messages.empty; }
        if (isZip && $('#zip').val().trim().length == 0) { whichError = messages.empty; }
        if (isCVV & $('#cvv').val().trim().length == 0) { whichError = messages.empty; }

        // Variable that creates 'div' html with correct message and appends to corresponding field or form location.
        const errorHTML = `<div class="error">${whichError}</div>`;
        if (errorElement.id) {
            errorElement = (isCCNumber || isZip || isCVV) ?
                $("fieldset:last legend")
                : errorElement;
            $(errorHTML).hide().insertAfter(errorElement).fadeIn(2000);
        } else {
            $(errorElement).prepend(errorHTML);
        }
    }

    // Function that targets a field value and name, validating it based on regex test.
    function validateField(fieldValue, fieldName) {
        let testField;
        let paymentField = (fieldName === 'cc-num'
                            || fieldName === 'zip'
                            || fieldName === 'cvv');


        if (fieldName === 'cc-num') {fieldName = 'ccnum'};
        regexTests = {
            name: /[A-Za-z]{2}/g,
            mail: /[^@]+@[^@]+\.[a-z]+$/,
            ccnum: /^\d{13,16}$/,
            zip: /^\d{5}$/,
            cvv: /^\d{3}$/
        };

        if (fieldName === 'name') {
            // For name, removes any non-alphabetic characters.
            testField = fieldValue.replace(/[^A-Za-z]/g, "");
        } else if (fieldName === 'ccnum') {
            // For creditcard, removes any spaces or dashes that the user inputs.
            testField = fieldValue.replace(/[\s-]/g, "");
        } else {
            testField = fieldValue.trim();
        }
        return (testField) ?  regexTests[fieldName].test(testField) : false;
    }

    // Function that calls two above functions and processes validation. It checks if validation passes, if a message already exists, and if message needs to be removed.
    function processValidation(checkElement) {
        let fieldValidated = true;
        let hasErrorMessage;
        // Payment fields are processed differently because their error message goes in same location on form.
        let isPaymentField = ((checkElement.id === "cc-num")
                            || (checkElement.id === "zip")
                            || (checkElement.id === "cvv"));

        hasErrorMessage = $(checkElement).next().hasClass("error");
        // If statement that checks if an error message already exists for payment field.
        if (isPaymentField) {
            hasErrorMessage = $("fieldset:last legend").next().hasClass("error");
        }

        // If statement that checks validation, and creates an error message if validation is not passed.
        if (!validateField(checkElement.value, checkElement.id)) {
            $(checkElement).addClass('errorInput');
            if (!hasErrorMessage) {
                createErrorMessage(checkElement);
            }
            // $(checkElement).focus(); - Prevents user from checking all elements on form submit.
            fieldValidated = false;
        // Else if statement that removes any existing error messages if validation is passed.
        } else {
            $(checkElement).removeClass('errorInput');
            if (hasErrorMessage) {
                if (isPaymentField) {
                    $("fieldset:last legend").next().fadeOut(600, function() {
                        $(this).remove();
                    });
                } else {
                    $(checkElement).next().fadeOut(600, function() {
                        $(this).remove();
                    });
                }
            }
            fieldValidated = true;
        }
        return fieldValidated;
    }

    // Function for 'Register for Activities' section validation if no activity is selected.
    function errorNoActivity(e) {
        $activitiesLocation = $("fieldset.activities");
        if (!($activitiesLocation.children(":eq(0)").hasClass("error"))) {
            createErrorMessage($activitiesLocation[0]);
        }
        if (!(e.type === 'submit')) {
            $('html, body').animate({
                scrollTop: $activitiesLocation.offset().top
            }, 700);
        }
        // Validation failed.
        return false;
    }

    /*
        Validation Field Event Handlers.
    */
    $("#name").on('focusout', function(e) {
        processValidation(e.target);
    });

    $("#mail").on('keyup focusout', function(e) {
        processValidation(e.target);
    });;

    $("#cc-num").on('keyup focusout', function(e) {
        if (!($("p.totalCost").length)) {
            errorNoActivity(e);
        } else {
            if ($("select#payment option:selected").val() === 'credit card') {
                processValidation(e.target);
            }
        }
    });

    $("#zip").on('keyup focusout', function(e) {
        if ($("select#payment option:selected").val() === 'credit card') {
            processValidation(e.target);
        }
    });

    $("#cvv").on('keyup focusout', function(e) {
        if ($("select#payment option:selected").val() === 'credit card') {
            processValidation(e.target);
        }
    });

    $("#title").on('change', function(e) {
        if ($(this).children("option:selected").val() === 'other') {
            $("#other-title").removeClass('is-hidden');
        } else {
            $("#other-title").addClass('is-hidden');
        }
    });

    /*
        Fieldset Events - display adjustments and cost calculations.
    */
    // T-Shirt info section - if T-shirt design is chosen, displays dropdown with corresponding colors.
    $("fieldset.shirt").on('change', function (e) {
        if (e.target.id === 'design') {
            // Function that shows corresponding colors for chosen design.
            function adjustColors ($showColors, $hideColors) {
                $($showColors).removeClass('is-hidden');
                $($hideColors).addClass('is-hidden');
                $($showColors[0]).prop('selected', true);
            }

            const $punsColors = $('#color').children(":lt(3)");
            const $heartsColors = $('#color').children(":gt(2)");
            const $optionSelected = $(e.target).children("option:selected").val();

            // If statement that shows colors dropdown section if design is selected.
            if ($(e.target)[0].selectedIndex > 0) {
                $(e.target).parent().next().show();
            } else {
                $(e.target).parent().next().hide();
            }

            // If statement that shows only corresponding color options for chosen design.
            if ($optionSelected === 'js puns') {
                adjustColors($punsColors, $heartsColors);
            } else if ($optionSelected === 'heart js') {
                adjustColors($heartsColors, $punsColors);
            }
        }
    });

    // Activities section - checks an activity, disables activites that occur at same time, and calculates cost of activities chosen.
    $("fieldset.activities").on('change', function (e) {
        function getCost(text) {
            const costRegex = /^.*\$(\d+)$/i;
            return text.replace(costRegex, '$1');
        }

        function getActivityTime(text) {
            const timeRegex = /^.*((Tuesday|Wednesday)\s\d+(pm|am)-\d+(am|pm)).+$/i;
            return text.replace(timeRegex, '$1');
        }

        const $activitiesSection = $(e.target).parent().parent();
        // Variable that checks if a property has just been clicked and checked.
        const clickChecked = $(e.target).prop("checked");
        // Variable that calls text of activity that has been clicked.
        const $activityText = $(e.target).closest('label').text();
        // Variable that calls time of activity that has been clicked.
        const seeTime = getActivityTime($activityText);

        // If statement that gets rid of any existing error message.
        if (clickChecked
            && $activitiesSection.children(":eq(0)").hasClass("error")) {
                $activitiesSection.children(":eq(0)").fadeOut(600, function() {
                    $(this).remove();
                });
        }

        // Function that calculates and displays total cost of activities that have been clicked on.
        function processCost () {
            if (!$("p.totalCost").length) {
                costHTML= "<p class='totalCost'><strong>Total:</strong> $<span></span></p>"
                $activitiesSection.append(costHTML);
            }

            totalCost += ($(e.target).prop("checked") === true) ?
                (parseInt(getCost($activityText))) :
                (parseInt(getCost($activityText)) * -1);

            if (totalCost === 0) {
                $("p.totalCost").remove();
            } else {
                $("p.totalCost span").text(totalCost);
            }
        }

        // Function that examines a checked or unchecked activity to see if another activity exists at the same time. If true, the conflicting activity is disabled and greyed out.
        function processActivities() {
            let activityChecked;
            let activityInput;
            let loopActivityTime;

            // Loops through all activites. If any conflict, disables activity (if a check) or enables activity (if an uncheck).
            $activitiesSection.find('label').each(function(index, activityLabel) {
                activityInput = $(activityLabel).find('input');
                loopActivityTime = getActivityTime($(activityLabel).text());
                if (loopActivityTime == seeTime) {
                    activityChecked = ($(activityInput).prop("checked") === true)
                    // If statement to check if a click is to uncheck an activity, and enables conflicting activity.
                    if (!clickChecked) {
                        $(activityInput).attr("disabled", false);
                        $(activityLabel).removeClass("gray-out");
                    // If statement to check if a click is to check an activity, and disables conflicting activity.
                    } else if (!activityChecked) {
                        $(activityInput).attr("disabled", true);
                        $(activityLabel).addClass("gray-out");
                    }
                }
            });
        }
        processCost();
        processActivities();
    });

    // Payment Section - displays corresponding section for an activity selected in payment dropdown.
    $("fieldset").last().on('change', function (e) {
        if (e.target.id === 'payment') {
            // If statement to check that no activity has been selected in the activities section, and scrolls page up to 'Activies Section' error message if appropriate.
            if (!($("p.totalCost").length)) {
                errorNoActivity(e)
            }

            const optionSelected = $("select#payment option:selected").val();
            // If statement that removes any existing error messages.
            if ($(e.target).prev().prev().hasClass("error")) {
                $(e.target).prev().prev().remove();
            }

            // Shows corresponding div based on payment option selected.
            switch (optionSelected) {
                case 'credit card':
                    adjustPaymentDiv (paypalDiv, bitcoinDiv, creditCardDiv);
                    break;
                case 'paypal':
                     $('fieldset:last input[type="text"]').each(function(i, element) {
                         $(element).val('');
                     });
                    adjustPaymentDiv (creditCardDiv, bitcoinDiv, paypalDiv);
                    break;
                case 'bitcoin':
                    $('fieldset:last input[type="text"]').each(function(i, element) {
                        $(element).val('');
                    });
                    adjustPaymentDiv (creditCardDiv, paypalDiv, bitcoinDiv);
                    break;
                default:
                    adjustPaymentDiv (paypalDiv, bitcoinDiv, creditCardDiv);
                    break;
            }
       }
    });

    /*
        Form Submission Section.
    */
    // Validates fields and prevents user submission if any fields do not pass validation.
    $("form").submit(function(e) {
        let invalidFields = false;

        // Boolean, in case any fields don't validate.
        if (!processValidation($('#name')[0])) {
            $("#name").addClass("errorInput");
            invalidFields = true;
        }

        if (!processValidation($('#mail')[0])) {
            $("#mail").addClass("errorInput");
            invalidFields = true;
        }

        // If statement that checks if there is no total cost, and displays error message for no activity.
        if (!($("p.totalCost").length)) {
            errorNoActivity(e);
            invalidFields = true;
        }

        // Because the credit card fields share one error message location, only one can be validated with an error message.
        if ($("select#payment option:selected").val() === 'credit card') {
            if (!(validateField($('#cc-num').val(), 'cc-num'))) {
                processValidation($("#cc-num")[0]);
                invalidFields = true;
            } else if (!(validateField($('#zip').val(), 'zip'))) {
                processValidation($("#zip")[0]);
            } else {
                processValidation($("#cvv")[0]);
            }

            // If statement that places red dotted border around zip and cvv fields if they do not pass validation.
            if (!(validateField($('#zip').val(), 'zip'))) {
                $("#zip").addClass("errorInput");
                invalidFields = true;
            }
            if (!(validateField($('#cvv').val(), 'cvv'))) {
                $("#cvv").addClass("errorInput");
                invalidFields = true;
            }
        }

        // If statement that displays error message and scrolls page to top of form if any fields do not pass validation.
        if (invalidFields) {
            e.preventDefault();
            if (!($(".failHTML").length)) {
                failHTML = `<div class="error failHTML">Please correct the errors below to submit this registration.</div>`;
                $(failHTML).hide().insertAfter("header").fadeIn(2000);
             }
             $('html, body').animate({scrollTop: '0px'}, 700);
        }
    });
});
