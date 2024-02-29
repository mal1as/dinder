// set optional field in profile from local storage
function setInformation(nameOfField, text) {
    const value = localStorage.getItem(nameOfField);
    if(value!==null && value!==undefined){
        $(`#${nameOfField} dt`).html(text);
        $(`#${nameOfField} dd`).html(value);
    } else {
        $(`#${nameOfField}`).detach();
    }
}

function setAllOptionalInfo() {
    setInformation("partnerDescription", "Ideal partner description:");
    setInformation("instagram", "Instagram:");
    setInformation("telegram", "Telegram:");
    setInformation("twitter", "Twitter:");
    setInformation("facebook", "Facebook:");
}

// clear all information about user
function clearCookies(){
    localStorage.clear();
}

$("#avatar").attr({src: `${localStorage.getItem("avatar")}`});

$("#name")
    .html(localStorage.getItem("firstName") + " " + localStorage.getItem("lastName"));

$("#nickname > dd").html(localStorage.getItem("nickname"));

$("#age > dd").html(localStorage.getItem("age"));

$("#country > dd").html(localStorage.getItem("country"));

$("#city > dd").html(localStorage.getItem("city"));

$("#someInfo > dd").html(localStorage.getItem("someInfo"));

setAllOptionalInfo();

// redirect to editing profile
$("#editButton").click(function (e) {
   e.preventDefault();
   window.location.href = "/editProfile";
});

// exit from account
$("#exit").click(function (e) {
    e.preventDefault();
    clearCookies();
    window.location.href = '/users/auth';
});