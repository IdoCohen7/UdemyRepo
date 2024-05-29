const signIn = document.querySelector("#signInButton");
const signUp = document.querySelector("#signUpButton");
const signInForm = document.querySelector(".container .sign-in-form");
const signUpForm = document.querySelector(".container .sign-up-form");
const overlay_container = document.querySelector(".container .overlay-container");
const overlay = document.querySelector(".container .overlay-container .overlay");

signIn.addEventListener("click", () => {
  overlay_container.style.transform = "translateX(100%)";
  overlay.style.transform = "translateX(-50%)";
  signInForm.classList.add("active");
  signUpForm.classList.remove("active");
});

signUp.addEventListener("click", () => {
  overlay_container.style.transform = "translateX(0)";
  overlay.style.transform = "translateX(0)";
  signUpForm.classList.add("active");
  signInForm.classList.remove("active");
});

$(document).ready(function () {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordPattern = /^.{4,}$/;

  $("#logInForm").submit(function (event) {
    if (emailPattern.test($("#email2TB").val()) && passwordPattern.test($("#password2TB").val())) {
      event.preventDefault(); // Prevent default form submission
      Login($("#email2TB").val(), $("#password2TB").val());
    } else {
      alert("ERROR: Password shorter than 4 characters or invalid email format");
    }
  });

  $("#signUpForm").submit(function (event) {
    if (emailPattern.test($("#emailTB").val()) && passwordPattern.test($("#passwordTB").val())) {
      event.preventDefault(); // Prevent default form submission
      SignUp($("#nameTB").val(), $("#emailTB").val(), $("#passwordTB").val());
    } else {
      alert("ERROR: Password shorter than 4 characters or invalid email format");
    }
  });
});

function ajaxCall(method, api, data, successCB, errorCB) {
  $.ajax({
    type: method, // Get/Post/Put/Delete/Patch
    url: api, // routing to the server
    data: data, // the data we pass in the body (if any…)
    cache: false, // allow caching
    contentType: "application/json", // the data format we expect back
    dataType: "json", // the data format that we send
    success: successCB, // the success callback function
    error: errorCB, // the error callback function
  });
}

function Login(email, password) {
  let api = "https://localhost:7061/api/Users/Login";
  ajaxCall("GET", api, { email: email, password: password }, LoginSCB, LoginECB);
}

function LoginSCB(user) {
  if (user == null) {
    alert("ERROR: Password or email mismatch");
  } else {
    var userJson = JSON.stringify(user);
    alert("Welcome " + user.name);
    localStorage.setItem("loggedIn", true);
    localStorage.setItem("user", userJson);
    $("#loginStatus").text("logged in as " + user.name); // Update login status on the UI
  }
  location.reload();
}

function LoginECB() {
  alert("oof");
  localStorage.setItem("loggedIn", false);
  localStorage.removeItem("user");
}

function SignUp(name, email, password) {
  let api = "https://localhost:7061/api/Users/register";
  let newUser = { name: name, email: email, password: password };
  ajaxCall("POST", api, JSON.stringify(newUser), SignUPSCB, SignUPECB);
}

function SignUPSCB() {
  alert("Sign-Up completed successfuly");
  location.reload();
}

function SignUPECB(err) {
  alert(err);
}