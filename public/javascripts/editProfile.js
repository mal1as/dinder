const SUCCESS_COLOR = "rgb(40, 167, 69)";

// check form is ready
// it may be better...
function checkForm() {
    const colors = [
        $("#firstName").css("border-color"),
        $("#lastName").css("border-color"),
        $("#sex").css("border-color"),
        $("#country").css("border-color"),
        $("#city").css("border-color"),
        $("#someInfo").css("border-color"),
        $("#neededSex").css("border-color"),
        $("#partnerDescription").css("border-color"),
        $("#instagram").css("border-color"),
        $("#telegram").css("border-color"),
        $("#facebook").css("border-color"),
        $("#twitter").css("border-color"),
        SUCCESS_COLOR
    ];
    for (let i = 1; i < colors.length; i++) {
        if (colors[i] !== colors[i - 1]) return false;
    }
    return true;
}

// set data in object if value exists
function setIfExist(value, nameOfValue, object) {
    if (value !== null && value !== undefined && value.length !== 0) {
        object[nameOfValue] = value;
    }
}

// fill in form by values from local storage
function fillFromLocalStorage(field) {
    const storageVal = localStorage.getItem(field);
    if (storageVal !== null && storageVal !== undefined) {
        $(`#${field}`).val(storageVal);
    }
}

function clearValuesWhichMayEdit() {
    localStorage.removeItem('country');
    localStorage.removeItem('city');
    localStorage.removeItem('someInfo');
    localStorage.removeItem('partnerDescription');
    localStorage.removeItem('instagram');
    localStorage.removeItem('telegram');
    localStorage.removeItem('twitter');
    localStorage.removeItem('facebook');
}

function fillForm() {
    fillFromLocalStorage("firstName");
    fillFromLocalStorage("lastName");
    fillFromLocalStorage("country");
    fillFromLocalStorage("city");
    fillFromLocalStorage("someInfo");
    fillFromLocalStorage("sex");
    fillFromLocalStorage("neededSex");
    fillFromLocalStorage("partnerDescription");
    fillFromLocalStorage("instagram");
    fillFromLocalStorage("telegram");
    fillFromLocalStorage("facebook");
    fillFromLocalStorage("twitter");
}

fillForm();

// bug in textarea???
$('#partnerDescription').val("");

// update avatar image
$("#avatarForm button").click(function (e) {
    e.preventDefault();
    const input = $("#avatar");
    let fd = new FormData;
    fd.append('avatar', input.prop('files')[0]);

    $.ajax({
        url: `/uploadAvatar?nickname=${localStorage.getItem("nickname")}`,
        data: fd,
        processData: false,
        contentType: false,
        type: "POST",
        success: function (response) {
            if (response.status === 'ok') {
                $("#avatar").next().html("File uploaded");
                console.log(response);
                localStorage.setItem('avatar', response.newAvatar);
            }
        }
    });
});

// update user data
$("#editForm button[name=\"submit\"]").click(function (e) {
    e.preventDefault();

    if (checkForm()) {
        const nickname = localStorage.getItem("nickname");

        const firstName = $("#firstName").val();
        const lastName = $("#lastName").val();
        const sex = $("#sex").val();
        const country = $("#country").val();
        const city = $("#city").val();
        const someInfo = $("#someInfo").val();
        const neededSex = $("#neededSex").val();
        const partnerDescription = $("#partnerDescription").val();
        const instagram = $("#instagram").val();
        const telegram = $("#telegram").val();
        const facebook = $("#facebook").val();
        const twitter = $("#twitter").val();

        // set required fields
        const user = {
            firstName: firstName,
            lastName: lastName,
            sex: sex,
            country: country,
            city: city,
            someInfo: someInfo,
        };

        // set optional fields
        setIfExist(neededSex, 'neededSex', user);
        setIfExist(partnerDescription, 'partnerDescription', user);
        setIfExist(instagram, 'instagram', user);
        setIfExist(telegram, 'telegram', user);
        setIfExist(facebook, 'facebook', user);
        setIfExist(twitter, 'twitter', user);

        console.log(user);

        $.ajax({
            url: `/editProfile?nickname=${nickname}`,
            type: "POST",
            contentType: 'application/json',
            data: JSON.stringify(user),
            success: function (data) {
                // set data in cookies and clear some edited fields
                clearValuesWhichMayEdit();
                for (let field in data) {
                    if (data.hasOwnProperty(field)) {
                        localStorage.setItem(field, data[field]);
                    }
                }
                // redirect to profile
                window.location.href = '/myProfile';
            }
        })
    }
});

// some interactive in element
$("#avatar").on('change', function () {
    $(this).next().html(`File selected`);
});


