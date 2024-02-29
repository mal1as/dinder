// if user is not authorized then redirect to auth page
function checkAuthorization() {
    const nickname = localStorage.getItem("nickname");
    if (nickname === undefined || nickname === null) {
        window.location.href = "/users/auth";
    }
}

checkAuthorization();