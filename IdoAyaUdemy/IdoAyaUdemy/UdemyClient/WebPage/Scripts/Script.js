// Assuming `user` variable is already declared in JoinedScript.js
function GetCoursesTable() {
  let api = "https://proj.ruppin.ac.il/cgroup75/test2/tar5/api/Courses";
  ajaxCall("GET", api, null, loadCoursesTable, GetCoursesTableECB);
}

function GetCoursesTableECB(error) {
  alert("ERROR: " + error);
}

function loadCoursesTable(coursesFromTable) {
  let table = document.getElementById("coursesTable");
  coursesFromTable.forEach((course) => {
    if (course.isActive) {
      let row = createCourseElement(course);
      table.appendChild(row);
    }
  });
}

$(document).ready(function () {
  GetCoursesTable();
  loadTopFive();
});

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
      "https://proj.ruppin.ac.il/cgroup75/test2/tar5/api/Users/InsertCourse?userId=" +
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

function loadTopFive() {
  let api = "https://proj.ruppin.ac.il/cgroup75/test2/tar5/api/Courses/TopFive";
  ajaxCall("GET", api, null, displayTopFive, loadTopFiveECB);
}

function displayTopFive(topFiveCourses) {
  let div = document.getElementById("topFive");
  let fiveDetailsDiv = document.createElement("div");
  fiveDetailsDiv.id = "fiveDetailsDiv";
  div.appendChild(fiveDetailsDiv);

  topFiveCourses.forEach((course) => {
    let courseDiv = document.createElement("div");
    courseDiv.id = "topCourse";
    courseDiv.innerHTML = `
    <h3>${course.title}</h3>
    <p>Rating: ${course.rating}</p>
    <p>Users Listed: ${course.usersListed}</p>
`;
    fiveDetailsDiv.appendChild(courseDiv);
  });
}

function loadTopFiveECB() {}
