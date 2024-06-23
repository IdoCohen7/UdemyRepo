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

function playSound(filename) {
  const sound = new Audio(`../Sounds/${filename}`);
  sound.play();
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

function openModal(id) {
  // Create the modal structure dynamically
  let modal = document.createElement("div");
  modal.className = "modal";

  let modalContent = document.createElement("div");
  modalContent.className = "modal-content";
  modalContent.id = "modalCourses";

  let closeButton = document.createElement("span");
  closeButton.className = "close";
  closeButton.innerHTML = "&times;";

  let modalText = document.createElement("p");
  modalText.id = "instructorP";

  modalText.textContent = "More courses from this instructor:";

  // Append elements to their respective parents
  modalContent.appendChild(closeButton);
  modalContent.appendChild(modalText);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  // Display the modal
  modal.style.display = "block";

  // When the user clicks on <span> (x), close the modal
  closeButton.onclick = function () {
    modal.style.display = "none";
    modal.remove(); // Remove the modal from the DOM
  };

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
      modal.remove(); // Remove the modal from the DOM
    }
  };

  let api =
    "https://proj.ruppin.ac.il/cgroup75/test2/tar1/api/Instructors/" +
    id +
    "/courses";
  ajaxCall("GET", api, null, modalCoursesSCB, modalCoursesECB);
}

function modalCoursesSCB(courses) {
  let modalContent = document.getElementById("modalCourses");
  courses.forEach((course) => {
    let row = createCourseElement(course);
    modalContent.appendChild(row);
  });
  let modalContents = document.querySelectorAll(".modal-content");

  // Iterate over each modal content element
  modalContents.forEach((modalContent) => {
    // Select all buttons with class "modalButton" within the current modal content
    let buttons = modalContent.querySelectorAll(".modalButton");

    // Iterate over each button and hide it
    buttons.forEach((button) => {
      button.style.display = "none";
    });
  });
}

function modalCoursesECB(ERROR) {
  alert(ERROR);
}

function createCourseElement(course) {
  let row = document.createElement("tr");

  let cell = document.createElement("td");

  let image = document.createElement("img");
  image.src = course.imageRef;
  cell.appendChild(image);

  let title = document.createElement("h3");
  title.textContent = course.title;
  title.classList.add("course-title");
  cell.appendChild(title);

  let info = document.createElement("div");
  info.innerHTML = "<p>Duration: " + course.duration + "</p>";
  info.innerHTML += "<p>Rating: " + course.rating + "</p>";
  info.innerHTML += "<p>Reviews: " + course.numOfReviews + "</p>";
  info.innerHTML += "<p>Last Updated: " + course.lastUpdate + "</p>";
  if (course.instructorName != null) {
    info.innerHTML += "<p>Instructor: " + course.instructorName + "</p>";
  }

  // Creating the link to the course URL
  let courseURL = "https://www.udemy.com" + course.url;
  let courseLink = document.createElement("a");
  courseLink.href = courseURL;
  courseLink.textContent = "Visit Page"; // Set the text content of the link
  courseLink.classList.add("enroll-button");

  info.classList.add("course-info");
  cell.appendChild(info);

  let button = document.createElement("button");
  let icon = document.createElement("i");
  icon.classList.add("fas", "fa-cart-plus"); // Add Font Awesome classes for the cart-plus icon
  button.appendChild(icon); // Append the icon to the button
  button.appendChild(document.createTextNode(" Add")); // Add text node for "Add" text

  let insButton = document.createElement("button");
  insButton.classList.add("enroll-button");
  insButton.classList.add("modalButton");
  insButton.textContent = "Show more courses of this instructor";
  insButton.addEventListener("click", function () {
    playSound("Add.mp3");
    openModal(course.instructorId);
  });

  button.classList.add("enroll-button");

  // Set the value of the button to hold the index of the course in the courses array
  button.value = course.id;
  button.addEventListener("click", function () {
    playSound("Add.mp3");
    PostToServer(button.value);
  });

  cell.appendChild(button);
  cell.appendChild(courseLink);
  cell.appendChild(insButton);
  row.appendChild(cell);

  return row;
}
