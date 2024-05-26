import courses from "../Data/Course.json" with { type: "json" };

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


$("#loadCoursesBttn").click(function () {
    let api = 'https://localhost:7061/api/Courses';
    var tbody = $('#cTable tbody');

    courses.forEach(course => {

        let durationSplit = course.duration.split(" ");
      let durationDoubleValue = parseFloat(durationSplit[0]);

        let addedCourse = {
            Id: course.id,
            Title: course.title,
            Url: course.url,
            Rating: course.rating,
            NumOfReviews: course.num_reviews,
            InstructorId: course.instructors_id,
            ImageRef: course.image,
            Duration: durationDoubleValue,
            LastUpdate: course.last_update_date
          }

        setTimeout(ajaxCall("POST", api, JSON.stringify(addedCourse), PostCourseToServerSCB, PostCourseToServerECB), 3000000);
        $("#loadCoursesBttn").prop("disabled", true);

    });
});

function PostCourseToServerSCB(message) {
    console.log(message);
}

function PostCourseToServerECB(message) {
    console.log(message);
}

function ShowAllCourses() {
  let api = "https://localhost:7061/api/Courses";
  setTimeout(ajaxCall("GET", api, "", GetCoursesSCB, GetCoursesECB), 12000000);
}

$("#showCoursesBttn").click(function() {
  ShowAllCourses();
})

function GetCoursesECB() {
  alert("Unable to render courses");
}

function GetCoursesSCB(coursesList) {
  let table = document.getElementById("adminTable");
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
    button.textContent = "Edit";
    button.classList.add("enroll-button");
    button.value = course.id;
    button.addEventListener("click", function () {
      EditCourse(button.value, row.id);
    });
    cell.appendChild(button);
    cell.appendChild(courseLink);
    row.appendChild(cell);

    table.appendChild(row);
  });
}

$("#createCourseBttn").click(function() {

  let newForm = document.createElement("form");
  let table = document.createElement("table");
  table.id = "newCourseTable";

  let newCourse= {
    Id: "",
        Title: "",
        Url: "",
        Rating: 0,
        NumOfReviews: 0,
        InstructorId: 1,
        ImageRef: "",
        Duration: 1,
        LastUpdate: ""
  }

  for (const key in newCourse) {
    if (newCourse.hasOwnProperty(key) && !(newCourse[key] === 0) && key!="LastUpdate") {
        let newInput = document.createElement("input");
        let newRow = document.createElement("tr");
        let newCell = document.createElement("td");
        let newP = document.createElement("p");
        newP.innerHTML = key;
        newInput.type = "text";
        newInput.id = "newCourse" + key;
        newCell.appendChild(newP);
        newCell.appendChild(newInput);
        newRow.appendChild(newCell);
        table.appendChild(newRow);
        
        
    }
}
let submitBttn = document.createElement("input");
submitBttn.type = "submit";
submitBttn.value = "SUBMIT";
let headline = document.createElement("h1");
headline.innerHTML = "Enter the course's details:";
newForm.appendChild(table);
newForm.appendChild(submitBttn);
let theDiv = document.getElementById("newCourse");
theDiv.appendChild(headline);
theDiv.appendChild(newForm);


}
)

function EditCourse(id, row) {
  let currentRow = document.getElementById(row);
  let newCell = document.createElement("td");
  newCell.innerHTML = id;
  currentRow.appendChild(newCell);

}
/*
function EditCourse(id, row) {
  let xrow = document.getElementById(row);
  let editDiv = document.createElement("div");
  editDiv.classList.add("edit-course-form");

  // Create form elements
  let form = document.createElement("form");
  form.classList.add("edit-course-form-inner");

  let titleLabel = document.createElement("label");
  titleLabel.textContent = "Title:";
  let titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.value = courses[row].title;

  let urlLabel = document.createElement("label");
  urlLabel.textContent = "URL:";
  let urlInput = document.createElement("input");
  urlInput.type = "text";
  urlInput.value = courses[row].url;

  let durationLabel = document.createElement("label");
  durationLabel.textContent = "Duration (hours):";
  let durationInput = document.createElement("input");
  durationInput.type = "number";
  durationInput.value = courses[row].duration;

  let submitBtn = document.createElement("button");
  submitBtn.textContent = "Submit";
  submitBtn.addEventListener("click", function(event) {
    event.preventDefault(); // Prevent form submission
    // Update course details
    courses[id].Title = titleInput.value;
    courses[id].Url = urlInput.value;
    courses[id].Duration = parseFloat(durationInput.value);
    // Hide the edit form
    editDiv.style.display = "none";
  });

  // Append form elements to form
  form.appendChild(titleLabel);
  form.appendChild(titleInput);
  form.appendChild(urlLabel);
  form.appendChild(urlInput);
  form.appendChild(durationLabel);
  form.appendChild(durationInput);
  form.appendChild(submitBtn);

  // Append form to editDiv
  editDiv.appendChild(form);

  // Append editDiv to xrow
  xrow.appendChild(editDiv);
}
*/