// Assuming `user` variable is already declared in JoinedScript.js
function GetCoursesTable() {
  let api = "https://localhost:7061/api/Courses";
  ajaxCall("GET", api, null, loadCoursesTable, GetCoursesTableECB);
}

function GetCoursesTableECB(error) {
  alert("ERROR: " + error);
}

function loadCoursesTable(coursesFromTable) {
  let table = document.getElementById("coursesTable");
  coursesFromTable.forEach((course, index) => {
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

    // Add functionality to the button here if needed

    cell.appendChild(button);
    cell.appendChild(courseLink);
    cell.appendChild(insButton);
    row.appendChild(cell);

    table.appendChild(row);
  });
}

function openModal(id) {
  // Create the modal structure dynamically
  let modal = document.createElement("div");
  modal.className = "modal";

  let modalContent = document.createElement("div");
  modalContent.className = "modal-content";

  let closeButton = document.createElement("span");
  closeButton.className = "close";
  closeButton.innerHTML = "&times;";

  let modalText = document.createElement("p");
  modalText.textContent =
    "More courses from the instructor whose id is " + id + ":";

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
}

GetCoursesTable();

function PostCoursesSCB(status) {
  if (status == 1) {
    alert("Course added successfuly!");
  } else {
    alert("ERROR: Course already in your list");
  }
}

function PostCoursesECB(err) {
  alert("Error");
}

function PostToServer(id) {
  if (user != null) {
    let api =
      "https://localhost:7061/api/Users/InsertCourse?userId=" +
      user.id +
      "&courseId=" +
      id;

    ajaxCall("POST", api, null, PostCoursesSCB, PostCoursesECB);
  } else {
    if (
      confirm(
        "You are not logged in.\nClick OK to log in\nClick CANCEL to view as guest"
      )
    ) {
      location.href = "SignUp.html";
    }
  }
}
