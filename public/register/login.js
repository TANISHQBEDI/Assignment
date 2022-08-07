var login_form = document.querySelector(".login")
var username = document.querySelector(".username")
var password = document.querySelector(".password")

login_form.addEventListener('submit', (event) => {
    event.preventDefault()
    console.log("I am here")
    console.log(username.value + "  " + password.value)
    $.ajax({
        url: "/sign-in",
        type: "GET",
        data: {
            username: username.value,
            password: password.value
        },
        success: (data) => {
            if (data.login) {
                window.location = "/"
            } 
            else {
                alert("Wrong Username or Password")
            }
        },
        error: () => {
            console.log("login failed")
        }
    })
})