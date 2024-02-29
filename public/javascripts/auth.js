const INVALID_COLOR = "rgb(220, 53, 69)";

// save field in local storage
function saveCookiesIfExists(object, field){
    const value = object[field];
    if(value!==undefined){
        localStorage.setItem(field, value);
    }
}

$("#submit-button").click(function (e) {
    e.preventDefault();
    const nickname = $("#nickname").val();
    const password = $("#password").val();
    const user = {
        nickname: nickname,
        password: password
    };

    $.ajax({
        url: "/users/auth",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(user),
        complete: function (xhr) {
            if(xhr.status===400){
                console.log("Nickname or password incorrect");
                $("#nickname").addClass("is-invalid").css("border-color", INVALID_COLOR);
                $("#password").addClass("is-invalid").css("border-color", INVALID_COLOR);
            }
        },
        success: function (user) {
            // redirect to main page and save cookies
            window.location.href = "../../?nickname="+user.nickname;
            localStorage.setItem("nickname", user.nickname);
            localStorage.setItem("firstName", user.firstName);
            localStorage.setItem("lastName", user.lastName);
            localStorage.setItem("age", user.age);
            localStorage.setItem("sex", user.sex);
            localStorage.setItem("country", user.country);
            localStorage.setItem("city", user.city);
            localStorage.setItem("someInfo", user.someInfo);
            localStorage.setItem("avatar", user.avatar);
            saveCookiesIfExists(user, "neededSex");
            saveCookiesIfExists(user, "partnerDescription");
            saveCookiesIfExists(user, "instagram");
            saveCookiesIfExists(user, "telegram");
            saveCookiesIfExists(user, "twitter");
            saveCookiesIfExists(user, "facebook");
        }
    });
});