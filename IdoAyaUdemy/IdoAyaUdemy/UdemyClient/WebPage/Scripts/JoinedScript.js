function ajaxCall(method, api, data, successCB, errorCB) {
  $.ajax({
    type: method,
    url: api,
    data: data,
    cache: false,
    contentType: "application/json",
    dataType: "json",
    success: successCB,
    error: errorCB,
  });
}

$(".once-button").click(function () {
  $(this).fadeOut("fast", function () {
    $(this).addClass("disabled-button");
    $(this).fadeIn("fast");
  });
});

let loggedIn = localStorage.getItem("loggedIn") === "true";
let user = JSON.parse(localStorage.getItem("user"));

if (user != null && user.isAdmin) {
  let adminPageBttn = $("<button></button>");
  adminPageBttn.attr("id", "adminBttn");
  adminPageBttn.addClass("header-button");
  adminPageBttn.text("Admin");
  adminPageBttn.click(function () {
    window.location.href = "admin.html";
  });
  $("#profile").append(adminPageBttn);
}

$(document).ready(function () {
  if (!loggedIn) {
    $("#loginStatus").text("not logged in");
  } else {
    $("#loginStatus").text("logged in as " + user.name);
    var logoutButton = $("<button>").text("Logout").addClass("header-button");
    logoutButton.click(function () {
      logout();
    });
    $("#profile").append(logoutButton);
  }
});

function logout() {
  localStorage.removeItem("loggedIn");
  localStorage.removeItem("user");
  $("#loginStatus").text("not logged in");
  alert("You have been logged out.");
  window.location.href = "index.html";
}
