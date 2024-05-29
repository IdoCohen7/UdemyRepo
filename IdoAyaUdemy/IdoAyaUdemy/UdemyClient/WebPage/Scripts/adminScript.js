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

$(document).ready(function() {
  ShowAllCourses();
})

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

    ShowAllCourses();
}
);

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


function GetCoursesECB() {
  alert("Unable to render courses");
}

function GetCoursesSCB(coursesList) {
  let coursesDL = document.getElementById("browsers");
  coursesDL.innerHTML = '';  // Clear existing options
  for (let i = 0; i < coursesList.length; i++) {
    let option = document.createElement("option");
    option.value = coursesList[i].title;
    option.setAttribute("data-id", coursesList[i].id);  // Add the data-id attribute
    coursesDL.appendChild(option);
  }
}
$("#createCourseBttn").click(function () {
  let newForm = document.createElement("form");
  newForm.id = "createCourseForm";

  let table = document.createElement("table");
  table.id = "newCourseTable";

  let newCourse = {
    Id: "",
    Title: "",
    Url: "",
    Rating: 0,
    NumOfReviews: 0,
    InstructorId: 1,
    ImageRef: "",
    Duration: 1,
    LastUpdate: ""
  };

  for (const key in newCourse) {
    if (newCourse.hasOwnProperty(key) && !(newCourse[key] === 0) && key != "LastUpdate") {
      let newInput = document.createElement("input");
      newInput.type = "text";
      newInput.required = true;
      newInput.id = "newCourse" + key;

      let newRow = document.createElement("tr");
      let newCell = document.createElement("td");
      let newP = document.createElement("p");
      newP.innerHTML = key;
      
      newCell.appendChild(newP);
      newCell.appendChild(newInput);
      newRow.appendChild(newCell);
      table.appendChild(newRow);
    }
  }

  let submitBttn = document.createElement("input");
  submitBttn.type = "submit";
  submitBttn.value = "SUBMIT"; 
  submitBttn.dataset.false = "false";

  let headline = document.createElement("h1");
  headline.innerHTML = "Enter the course's details:";
  
  newForm.appendChild(table);
  newForm.appendChild(submitBttn);
  
  let theDiv = document.getElementById("newCourse");
  theDiv.innerHTML = ""; // Clear previous content
  theDiv.appendChild(headline);
  theDiv.appendChild(newForm);

  // Attach submit event handler to the form
  newForm.addEventListener("submit", function (event) {
    event.preventDefault();
    createCourse();
  });
});

function createCourse() {
  let api = "https://localhost:7061/api/Instructors/" + $("#newCourseInstructorId").val();
  ajaxCall("GET", api, null, secondCreateCourse, getInstructorECB);

}

function secondCreateCourse(instructor) {


  if (instructor!=null) {
    let api = "https://localhost:7061/api/Courses/Create";

  let newCourse = {
    Id: parseInt($("#newCourseId").val()),
    Title: $("#newCourseTitle").val(),
    Url: $("#newCourseUrl").val(),
    Rating: 0,
    NumOfReviews: 0,
    InstructorId: parseInt($("#newCourseInstructorId").val()),
    ImageRef: $("#newCourseImageRef").val(),
    Duration: parseFloat($("#newCourseDuration").val()),
    LastUpdate: ""
  };

  ajaxCall("POST", api, JSON.stringify(newCourse), createCourseSCB, createCourseECB);

  }

  else {
    alert("ERROR:no instructor matches that ID, make sure to load instructors");
  }

  
}

function getInstructorECB(error) {
  alert("ERROR: No instructor matches this Id");
}

function createCourseSCB(response) {
  if (response) {
      alert("Course created successfully");
  } else {
      alert("Course creation failed: duplicate title or ID");
  }
}

function createCourseECB(jqXHR) {
  alert(`Failed to create course: ${jqXHR.responseText}`);
}

$(document).ready(function() {
  $('#submitButton').on('click', function() {
      var inputVal = $('#browser').val();
      var selectedOption = $("#browsers option[value='" + inputVal + "']");
      var additionalData = selectedOption.data('id');

      if (additionalData !== undefined) {
          console.log('User input:', inputVal);
          console.log('Additional data (course ID):', additionalData);
      } else {
          console.log('No additional data for:', inputVal);
      }

      let api = "https://localhost:7061/api/Courses/" + additionalData;

      ajaxCall("GET", api, null, GetCourseEditSCB, GetCourseEditECB );
  });
});

function GetCourseEditSCB(course) {
  let div = document.getElementById("editDiv");
  div.innerHTML = "";
  let editForm = document.createElement("form");
  editForm.id = "editForm";
  let editTable = document.createElement("table");

  // Title
  let titleTR = document.createElement("tr");
  let titleTD = document.createElement("td");
  titleTD.innerHTML = "Title:";
  let titleValTD = document.createElement("td");
  let titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.value = course.title;
  titleInput.id = "editTitleTB";
  titleInput.required = true;
  titleValTD.appendChild(titleInput);
  titleTR.appendChild(titleTD);
  titleTR.appendChild(titleValTD);
  editTable.appendChild(titleTR);

  // Duration
  let durationTR = document.createElement("tr");
  let durationTD = document.createElement("td");
  durationTD.innerHTML = "Duration:";
  let durationValTD = document.createElement("td");
  let durationInput = document.createElement("input");
  durationInput.type = "number";
  durationInput.step = "any";
  durationInput.required = true;
  durationInput.value = course.duration;
  durationInput.id = "editDurationTB";
  durationValTD.appendChild(durationInput);
  durationTR.appendChild(durationTD);
  durationTR.appendChild(durationValTD);
  editTable.appendChild(durationTR);

  // URL
  let urlTR = document.createElement("tr");
  let urlTD = document.createElement("td");
  urlTD.innerHTML = "URL:";
  let urlValTD = document.createElement("td");
  let urlInput = document.createElement("input");
  urlInput.type = "text";
  urlInput.required = true; 
  urlInput.value = course.url;
  urlInput.id = "editUrlTB";
  urlValTD.appendChild(urlInput);
  urlTR.appendChild(urlTD);
  urlTR.appendChild(urlValTD);
  editTable.appendChild(urlTR);

  // Image Reference
  let imageRefTR = document.createElement("tr");
  let imageRefTD = document.createElement("td");
  imageRefTD.innerHTML = "Image Reference:";
  let imageRefValTD = document.createElement("td");
  let imageRefInput = document.createElement("input");
  imageRefInput.type = "text";
  imageRefInput.value = course.imageRef;
  imageRefInput.id = "editImageRefTB";
  imageRefValTD.appendChild(imageRefInput);
  imageRefTR.appendChild(imageRefTD);
  imageRefTR.appendChild(imageRefValTD);
  editTable.appendChild(imageRefTR);


  let submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.innerHTML = "Submit";
  submitButton.id = "submitEdit";

  editForm.appendChild(editTable);
  editForm.appendChild(submitButton);

  div.appendChild(editForm);

  $("#editForm").submit(function() {
      EditCourse(course);
      return false;
  });
}

function EditCourse(course) {
  let api = "https://localhost:7061/api/Courses/" + course.id;

  let editedCourse = {
      Id: course.id, 
      Title: $("#editTitleTB").val(),
      Url: $("#editUrlTB").val(),
      Rating: 0,
      NumOfReviews: 0,
      InstructorId: course.instructorId, 
      ImageRef: $("#editImageRefTB").val(),
      Duration: parseFloat($("#editDurationTB").val()), 
      LastUpdate: "" // updated in the server
  };

  console.log(editedCourse);

  ajaxCall("PUT", api, JSON.stringify(editedCourse), EditCourseSCB, EditCourseECB);
}


function EditCourseSCB(message) {
  alert("Course updated successfully: " + message);
}

function EditCourseECB(jqXHR) {
  console.log("Error:", jqXHR);
}


function GetCourseEditECB(error) {
  alert(error);
}

