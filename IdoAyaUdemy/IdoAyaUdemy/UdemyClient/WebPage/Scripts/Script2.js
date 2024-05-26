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

function GetCoursesSCB(coursesList) {
  let table = document.getElementById("aCoursesTable");
  table.innerHTML = "";
  coursesList.forEach((course, index) => {
    let row = document.createElement("tr");
    row.id = index;

    let cell = document.createElement("td");

    let image = document.createElement("img");
    image.src = course.imageRef;
    cell.appendChild(image);

    let title = document.createElement("h3");
    title.textContent = course.title;
    title.classList.add("course-title");
    cell.appendChild(title);

    let info = document.createElement("div");
    info.innerHTML = "<p>Duration: " + course.duration + " total hours</p>";
    info.innerHTML += "<p>Rating: " + course.rating + "</p>";
    info.innerHTML += "<p>Reviews: " + course.numOfReviews + "</p>";
    info.innerHTML += "<p>Last Updated: " + course.lastUpdate + "</p>";
    let courseURL = "https://www.udemy.com" + course.url;
    let courseLink = document.createElement("a");
    courseLink.href = courseURL;
    courseLink.textContent = "Visit Page"; // Set the text content of the link
    courseLink.classList.add("enroll-button");

    info.classList.add("course-info");
    cell.appendChild(info);

    let button = document.createElement("button");
    button.textContent = "Remove";
    button.classList.add("enroll-button");
    button.value = course.id;
    button.addEventListener("click", function () {
      RemoveCourse(button.value);
    });
    cell.appendChild(button);
    cell.appendChild(courseLink);
    row.appendChild(cell);

    table.appendChild(row);
  });
  let sumOfCourses = document.getElementById("courseNum");
  sumOfCourses.textContent =
    "there are " + coursesList.length + " courses in your list";
}

function GetCoursesECB(err) {
  alert("Unable to get courses from server");
}

function GetFromServer() {
  let api = "https://localhost:7061/api/Courses";
  setTimeout(ajaxCall("GET", api, "", GetCoursesSCB, GetCoursesECB), 9000000);
}

function loadPage() {
  GetFromServer();
  let durationBttn = document.getElementById("durBttn");
  let durStartBttn = document.getElementById("durStartBttn");
  let durEndBttn = document.getElementById("durEndBttn");
  durationBttn.addEventListener("click", function () {
    searchByDuration(durStartBttn.value, durEndBttn.value);
  });

  let rateBttn = document.getElementById("rateBttn");
  let rateStartBttn = document.getElementById("rateStartBttn");
  let rateEndBttn = document.getElementById("rateEndBttn");
  rateBttn.addEventListener("click", function () {
    searchByRating(rateStartBttn.value, rateEndBttn.value);
  });
}

function RemoveCourse(id) {
  let api = "https://localhost:7061/api/Courses/" + id;

  ajaxCall("DELETE", api, null, DeleteCourseSCB, DeleteCourseECB);
  let table = document.getElementById("aCoursesTable");
  table.innerHTML = "";
  GetFromServer();
}

function DeleteCourseSCB(message) {
  console.log(message);
}

function DeleteCourseECB(message) {
  console.log(message);
}

function searchByDuration(start, end) {
  let api = "https://localhost:7061/api/Courses/getByDurationRange";
  ajaxCall(
    "GET",
    api,
    { start: start, end: end },
    GetCoursesSCB,
    GetCoursesECB
  );
}

function searchByRating(start, end) {
  let api =
    "https://localhost:7061/api/Courses/" +
    "getByRatingRange/start/" +
    start +
    "/end/" +
    end;

  ajaxCall("GET", api, null, GetCoursesSCB, GetCoursesECB);
}

loadPage();
