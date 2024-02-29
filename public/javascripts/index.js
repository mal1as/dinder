// redirect to user profile when click
$(".row div").click(function () {
    const nickname = $(this).attr("id");
    window.location.href = "/users/profiles/"+nickname;
});