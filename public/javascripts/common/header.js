// header for all pages
// if user is authorized -> link on profile and avatar
// else -> button for registration and button for authorization
const nickname = localStorage.getItem("nickname");

if(nickname===null || nickname===undefined) {
    $("nav form").html(
        "<button class=\"btn btn-success my-2 mx-2 my-sm-0 btn-lg\" type=\"submit\" name=\"auth\">Log in</button>\n" +
        "<button class=\"btn btn-success my-2 mx-2 my-sm-0 btn-lg\" type=\"submit\" name=\"register\">Sign up</button>");
} else {
    $("nav form").html(
        "<a class=\"nav-link text-light\" href=\"/myProfile\">My profile</a>\n" +
        `<img src=\"${localStorage.getItem('avatar')}\" alt=\"avatar\" width=\"50px\" height=\"50px\" class=\"rounded-circle\">`);
}

$("button[name=\"auth\"]").click(function (e) {
    e.preventDefault();
    window.location.href = "/users/auth";
});

$("button[name=\"register\"]").click(function (e) {
    e.preventDefault();
    window.location.href = "/users/register";
});

$(".link-main").click(function (e) {
    e.preventDefault();
    window.location.href = "/?nickname="+localStorage.getItem("nickname");
});


