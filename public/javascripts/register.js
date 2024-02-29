const SUCCESS_COLOR = "rgb(40, 167, 69)";
const INVALID_COLOR = "rgb(220, 53, 69)";

// call if value from field is correct
function showAsCorrect(element) {
    element.removeClass("is-invalid").css("border-color", SUCCESS_COLOR);
}

// call if value from field is invalid
function showAsInvalid(element) {
    element.addClass("is-invalid").css("border-color", INVALID_COLOR);
}

// check password in 'confirm-password' field
function checkConfirmPass(pass) {
    let confirmPass = $("#confirm-password");
    if (confirmPass.val() === pass) {
        showAsCorrect(confirmPass);
        return true;
    }
    showAsInvalid(confirmPass);
    return false;
}

// change border-color and delete 'is-invalid' class after not unique nickname
function checkNicknameForCorrectSending(){
    const nickname = $("#nickname");
    if(nickname.val().length>2 && nickname.val().length<21){
        showAsCorrect(nickname);
    }
}

// bug in textarea???
$('#someInfo').val("");

// check form is ready
// it may be better...
function checkForm() {
    const colors = [
        $("#nickname").css("border-color"),
        $("#password").css("border-color"),
        $("#firstName").css("border-color"),
        $("#lastName").css("border-color"),
        $("#dateOfBirthday").css("border-color"),
        $("#sex").css("border-color"),
        $("#country").css("border-color"),
        $("#city").css("border-color"),
        $("#someInfo").css("border-color"),
        SUCCESS_COLOR
    ];
    for (let i = 1; i < colors.length; i++) {
        if (colors[i] !== colors[i - 1]) return false;
    }
    return true;
}


$("#submit-button").on('click', function (e) {
        e.preventDefault();

        // get values from form
        const nickname = $("#nickname").val();
        const password = $("#password").val();
        const firstName = $("#firstName").val();
        const lastName = $("#lastName").val();
        const dateOfBirthday = $("#dateOfBirthday").val();
        const sex = $("#sex").val();
        const country = $("#country").val();
        const city = $("#city").val();
        const someInfo = $("#someInfo").val();

        checkNicknameForCorrectSending();

        // ajax query to server
        if (checkConfirmPass(password) && checkForm()) {
            console.log("Send data to server...");

            const user = {
                nickname: nickname,
                password: password,
                firstName: firstName,
                lastName: lastName,
                dateOfBirthday: dateOfBirthday,
                sex: sex,
                country: country,
                city: city,
                someInfo: someInfo
            };

            $.ajax({
                url: "/users/register",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(user),
                complete: function (xhr) {
                    if (xhr.status === 406) {
                        console.log("User with the same nickname already exists");
                        showAsInvalid($("#nickname"));
                    }
                },
                success: function (user) {
                    // redirect to main page
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
                }
            });
        }
    }
);