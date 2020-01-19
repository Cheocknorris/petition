console.log("sanity check");
console.log($);

// $("button").on("mouseenter", function() {
//     $("button").addClass("hover-button");
//     // console.log("mouseenter");
// });
//
// $("button").on("mouseleave", function() {
//     $("button").removeClass("hover-button");
// });

$("#petition-link").on("mouseenter", function() {
    $("#petition-link").addClass("hover");
    console.log("mouseenter");
});

$("#petition-link").on("mouseleave", function() {
    $("#petition-link").removeClass("hover");
});

$("#profile-link").on("mouseenter", function() {
    $("#profile-link").addClass("hover");
    console.log("mouseenter");
});

$("#profile-link").on("mouseleave", function() {
    $("#profile-link").removeClass("hover");
});

$("#signers").on("mouseenter", function() {
    $("#signers-link").addClass("hover");
    console.log("mouseenter");
});

$("#signers").on("mouseleave", function() {
    $("#signers-link").removeClass("hover");
});

// $("#delete-link").on("mouseenter", function() {
//     $("#delete-link").addClass("hover");
//     console.log("mouseenter");
// });
//
// $("#delete-link").on("mouseleave", function() {
//     $("#delete-link").removeClass("hover");
// });

$("#signers-link").on("mouseenter", function() {
    $("#signers-link").addClass("hover");
    console.log("mouseenter");
});

$("#signers-link").on("mouseleave", function() {
    $("#signers-link").removeClass("hover");
});

$("#logout-link").on("mouseenter", function() {
    $("#logout-link").addClass("hover");
    console.log("mouseenter");
});

$("#logout-link").on("mouseleave", function() {
    $("#logout-link").removeClass("hover");
});
