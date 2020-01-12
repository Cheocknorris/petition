console.log("sanity check");
console.log($);

$("button").on("mouseenter", function() {
    $("button").addClass("hover-button");
    // console.log("mouseenter");
});

$("button").on("mouseleave", function() {
    $("button").removeClass("hover-button");
});

$("a").on("mouseenter", function() {
    $("a").addClass("hover-button");
    console.log("mouseenter");
});

$("a").on("mouseleave", function() {
    $("a").removeClass("hover-button");
});
