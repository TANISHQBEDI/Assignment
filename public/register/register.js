var create_account_form = document.querySelector(".register")
create_account_form.addEventListener('submit', (event) => {
    event.preventDefault()
    console.log("I am here")
    var email = document.querySelector('.email')
    var username = document.querySelector('.usernamer')
    var pass = document.querySelector('.passwordr')
    console.log({
        username: username.value,
        email: email.value,
        password: pass.value
    })
    $.ajax({
        url: "/sign-up",
        type: "POST",
        data: {
            username: username.value,
            email: email.value,
            password: pass.value
        },
        success: (data) => {
            console.log(data.status)
            if (data.status) {
                window.location = "/register/loginreg.html"
            } else {
                alert(data.message)
            }
        },
        error: () => {
            alert("Accoutn Creation Failed")
        }
    })
    console.log("testing account creation")
})
