function ShowAllCourses() {
  let api = "https://localhost:7061/api/Courses";
  setTimeout(ajaxCall("GET", api, "", GetCoursesSCB, GetCoursesECB), 12000000);
}

ShowAllCourses();

function GetCoursesECB() {
  alert("Unable to render courses");
}

function GetCoursesSCB(coursesList) {
  let coursesDL = document.getElementById("browsers");
  coursesDL.innerHTML = ""; // Clear existing options
  for (let i = 0; i < coursesList.length; i++) {
    let option = document.createElement("option");
    option.value = coursesList[i].title;
    option.setAttribute("data-id", coursesList[i].id); // Add the data-id attribute
    coursesDL.appendChild(option);
  }
}

$("#createCourseBttn").click(function () {
  playSound("Login.mp3");
  clearAdminContent();
  let newForm = document.createElement("form");
  newForm.id = "createCourseForm";

  let table = document.createElement("table");
  table.id = "newCourseTable";

  let newCourse = {
    title: "",
    url: "",
    Rating: 0,
    NumOfReviews: 0,
    InstructorId: 1,
    ImageRef: "",
    Duration: 1,
    LastUpdate: "",
  };

  for (const key in newCourse) {
    if (
      newCourse.hasOwnProperty(key) &&
      !(newCourse[key] === 0) &&
      key != "LastUpdate" &&
      key != "Id"
    ) {
      let newInput = document.createElement("input");
      newInput.type = "text";

      newInput.required = true;
      if (key == "ImageRef") {
        newInput.required = false;
      }
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

  // Image Preview
  let imagePreviewTR = document.createElement("tr");
  let imagePreviewTD = document.createElement("td");
  imagePreviewTD.innerHTML = "Image Preview:";
  let imagePreviewValTD = document.createElement("td");
  let imagePreview = document.createElement("img");
  imagePreview.id = "newCourseImagePreview";
  imagePreview.style.maxWidth = "200px"; // Set a max-width for the preview
  imagePreviewValTD.appendChild(imagePreview);
  imagePreviewTR.appendChild(imagePreviewTD);
  imagePreviewTR.appendChild(imagePreviewValTD);
  table.appendChild(imagePreviewTR);

  // File upload for image
  let imageUploadTR = document.createElement("tr");
  let imageUploadTD = document.createElement("td");
  imageUploadTD.innerHTML = "Upload Image:";
  let imageUploadValTD = document.createElement("td");
  let fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.id = "newCourseFiles";
  fileInput.accept = "image/*"; // Accept only image files
  fileInput.addEventListener("change", function () {
    let reader = new FileReader();
    reader.onload = function (e) {
      imagePreview.src = e.target.result;
    };
    reader.readAsDataURL(this.files[0]);
  });
  imageUploadValTD.appendChild(fileInput);
  imageUploadTR.appendChild(imageUploadTD);
  imageUploadTR.appendChild(imageUploadValTD);
  table.appendChild(imageUploadTR);

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
  let api =
    "https://localhost:7061/api/Instructors/" +
    $("#newCourseInstructorId").val();
  ajaxCall("GET", api, null, secondCreateCourse, getInstructorECB);
}

function secondCreateCourse(instructor) {
  if (instructor != null) {
    let api = "https://localhost:7061/api/Courses";
    let uploadApi = "https://localhost:7061/api/Upload";
    let imageFolder = "https://localhost:7061/images/";

    let newCourse = {
      Title: $("#newCoursetitle").val(),
      Url: $("#newCourseurl").val(),
      Duration: parseFloat($("#newCourseDuration").val()),
      InstructorId: parseInt($("#newCourseInstructorId").val()),
      ImageRef: "none", // Default image value
      LastUpdate: " ",
    };

    var data = new FormData();
    var files = $("#newCourseFiles").get(0).files;

    if (files.length > 0) {
      // Only one file is allowed
      var file = files[0];
      data.append("files", file);

      console.log("Starting image upload...");
      console.log("File selected:", file);

      $.ajax({
        type: "POST",
        url: uploadApi,
        contentType: false,
        processData: false,
        data: data,
        success: function (data) {
          console.log("Upload successful, data:", data);
          // Set the image reference input with the uploaded image path
          if (Array.isArray(data) && data.length > 0) {
            newCourse.ImageRef = imageFolder + data[0];
          } else if (typeof data === "string") {
            newCourse.ImageRef = imageFolder + data;
          }
          console.log(
            "Image URL set to newCourse.ImageRef:",
            newCourse.ImageRef
          );
          // Once image upload is successful, create the course
          ajaxCall(
            "POST",
            api,
            JSON.stringify(newCourse),
            createCourseSCB,
            createCourseECB
          );
        },
        error: function (error) {
          console.log("Error uploading image:", error);
          // If image upload fails, create the course with default image
          ajaxCall(
            "POST",
            api,
            JSON.stringify(newCourse),
            createCourseSCB,
            createCourseECB
          );
        },
      });
    } else {
      // No file selected, create the course with default image
      ajaxCall(
        "POST",
        api,
        JSON.stringify(newCourse),
        createCourseSCB,
        createCourseECB
      );
    }
  } else {
    alert(
      "ERROR: No instructor matches that ID, make sure to load instructors"
    );
  }
}

function getInstructorECB(error) {
  alert("ERROR: No instructor matches this ID");
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

$(document).ready(function () {
  $("#submitButton").on("click", function () {
    clearAdminContent();
    playSound("Login.mp3");
    var inputVal = $("#browser").val();
    var selectedOption = $("#browsers option[value='" + inputVal + "']");
    var additionalData = selectedOption.data("id");

    if (additionalData !== undefined) {
      console.log("User input:", inputVal);
      console.log("Additional data (course ID):", additionalData);
    } else {
      console.log("No additional data for:", inputVal);
    }

    let api = "https://localhost:7061/api/Courses/" + additionalData;

    ajaxCall("GET", api, null, GetCourseEditSCB, GetCourseEditECB);
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

  // Image Preview
  let imagePreviewTR = document.createElement("tr");
  let imagePreviewTD = document.createElement("td");
  imagePreviewTD.innerHTML = "Image Preview:";
  let imagePreviewValTD = document.createElement("td");
  let imagePreview = document.createElement("img");
  imagePreview.id = "editCourseImagePreview";
  imagePreview.src = course.imageRef;
  imagePreview.style.maxWidth = "200px"; // Set a max-width for the preview
  imagePreviewValTD.appendChild(imagePreview);
  imagePreviewTR.appendChild(imagePreviewTD);
  imagePreviewTR.appendChild(imagePreviewValTD);
  editTable.appendChild(imagePreviewTR);

  // File upload for image
  let imageUploadTR = document.createElement("tr");
  let imageUploadTD = document.createElement("td");
  imageUploadTD.innerHTML = "Upload Image:";
  let imageUploadValTD = document.createElement("td");
  let fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.id = "editCourseFiles";
  fileInput.accept = "image/*"; // Accept only image files
  fileInput.addEventListener("change", function () {
    let reader = new FileReader();
    reader.onload = function (e) {
      imagePreview.src = e.target.result;
    };
    reader.readAsDataURL(this.files[0]);
  });
  imageUploadValTD.appendChild(fileInput);
  imageUploadTR.appendChild(imageUploadTD);
  imageUploadTR.appendChild(imageUploadValTD);
  editTable.appendChild(imageUploadTR);

  let submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.innerHTML = "Submit";
  submitButton.id = "submitEdit";

  editForm.appendChild(editTable);
  editForm.appendChild(submitButton);

  div.appendChild(editForm);

  $("#editForm").submit(function (event) {
    event.preventDefault();
    EditCourse(course);
    return false;
  });
}

function GetCourseEditECB(error) {
  alert(error);
}

function EditCourse(course) {
  let api = "https://localhost:7061/api/Courses/";
  let uploadApi = "https://localhost:7061/api/Upload";
  let imageFolder = "https://localhost:7061/images/";

  let editedCourse = {
    Id: course.id,
    Title: $("#editTitleTB").val(),
    Url: $("#editUrlTB").val(),
    Rating: 0,
    NumOfReviews: 0,
    InstructorId: course.instructorId,
    ImageRef: $("#editImageRefTB").val(),
    Duration: parseFloat($("#editDurationTB").val()),
    LastUpdate: "", // updated in the server
  };

  var data = new FormData();
  var files = $("#editCourseFiles").get(0).files;

  if (files.length > 0) {
    // Only one file is allowed
    var file = files[0];
    data.append("files", file);

    console.log("Starting image upload...");
    console.log("File selected:", file);

    $.ajax({
      type: "POST",
      url: uploadApi,
      contentType: false,
      processData: false,
      data: data,
      success: function (data) {
        console.log("Upload successful, data:", data);
        // Set the image reference input with the uploaded image path
        if (Array.isArray(data) && data.length > 0) {
          editedCourse.ImageRef = imageFolder + data[0];
        } else if (typeof data === "string") {
          editedCourse.ImageRef = imageFolder + data;
        }
        console.log(
          "Image URL set to editedCourse.ImageRef:",
          editedCourse.ImageRef
        );
        // Once image upload is successful, edit the course
        ajaxCall(
          "PUT",
          api,
          JSON.stringify(editedCourse),
          EditCourseSCB,
          EditCourseECB
        );
      },
      error: function (error) {
        console.log("Error uploading image:", error);
        // If image upload fails, edit the course with default image
        ajaxCall(
          "PUT",
          api,
          JSON.stringify(editedCourse),
          EditCourseSCB,
          EditCourseECB
        );
      },
    });
  } else {
    // No file selected, edit the course with default image
    ajaxCall(
      "PUT",
      api,
      JSON.stringify(editedCourse),
      EditCourseSCB,
      EditCourseECB
    );
  }
}

function EditCourseSCB(message) {
  alert("Course updated successfully: " + message);
}

function EditCourseECB(jqXHR) {
  alert("Error:", jqXHR);
}

function clearAdminContent() {
  let div = document.getElementById("editDiv");
  div.innerHTML = "";
  let table = document.getElementById("coursesManage");
  table.innerHTML = "";
  let nDiv = document.getElementById("newCourse");
  nDiv.innerHTML = "";

  let onceButtons = document.querySelectorAll(".disabled-button");
  onceButtons.forEach((button) => {
    button.classList.remove("disabled-button");
    button.classList.add("once-button");
  });
}

$("#showAllCourses").on("click", function () {
  playSound("Login.mp3");
  clearAdminContent();
  let api = "https://localhost:7061/api/Courses";
  ajaxCall("GET", api, null, showDataTable, showDataTableECB);
});

function showDataTable(allCourses) {
  let table = $(
    '<table id="coursesDT" class="display" style="width:100%"></table>'
  );
  let thead = $(
    "<thead><tr><th>ID</th><th>Title</th><th>URL</th><th>Rating</th><th>Number of Reviews</th><th>Instructor ID</th><th>Image</th><th>Duration (hours)</th><th>Last Update</th><th>Instructor Name</th><th>Active</th></tr></thead>"
  );

  let tbody = $("<tbody></tbody>");
  table.append(thead);
  table.append(tbody);

  // Append table to the container
  $("#coursesManage").append(table);

  // Initialize DataTable
  $("#coursesDT").DataTable({
    data: allCourses,
    columns: [
      { data: "id" },
      { data: "title" },
      { data: "url" },
      { data: "rating" },
      { data: "numOfReviews" },
      { data: "instructorId" },
      {
        data: "imageRef",
        render: function (data, type, row) {
          return `<img src="${data}" alt="Course Image" style="width: 100px;">`;
        },
      },
      { data: "duration" },
      { data: "lastUpdate" },
      { data: "instructorName" },
      {
        data: "isActive",
        render: function (data, type, row) {
          return `<input type="checkbox" class="isActive-checkbox" data-id="${
            row.id
          }" ${data == 1 ? "checked" : ""}>`;
        },
        orderable: false,
      },
    ],
  });

  $("#coursesDT tbody").on("change", ".isActive-checkbox", function () {
    let courseId = $(this).data("id");
    let isActive = $(this).is(":checked") ? 1 : 0;

    // Call function to update the course status in the database
    updateCourseStatus(courseId, isActive);
  });
}

function showDataTableECB(error) {
  alert(error);
}

function updateCourseStatus(courseId, isActive) {
  let api =
    "https://localhost:7061/api/Courses/Status?id=" +
    courseId +
    "&value=" +
    isActive;
  ajaxCall("PUT", api, null, updateCourseStatusSCB, updateCourseStatusECB);
}

function updateCourseStatusSCB() {
  alert("Course status updated!");
}

function updateCourseStatusECB(error) {
  alert(error);
}
