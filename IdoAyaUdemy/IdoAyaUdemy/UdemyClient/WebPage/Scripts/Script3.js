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

function GetInstructors() {
  let api = "https://localhost:7061/api/Instructors";
  ajaxCall("GET", api, "", GetInstructorsSCB, GetInstructorsECB);
}

function GetInstructorsSCB(instructorList) {
  loadInstructorsTable(instructorList);
}

function GetInstructorsECB(err) {
  console.log(err);
}

function loadInstructorsTable(list) {
  let table = document.getElementById("instructorsTable");
  let row; // Declare the row variable outside the loop
  list.forEach((instructor, index) => {
    if (index % 2 === 0) {
      // Create a new row when the index is divisible evenly by 5
      row = document.createElement("tr");
      table.appendChild(row); // Append the row to the table
    }

    let cell = document.createElement("td");

    let image = document.createElement("img");
    image.src = instructor.image;
    cell.appendChild(image);

    let title = document.createElement("h3");
    title.textContent = instructor.title;
    title.classList.add("course-title");
    cell.appendChild(title);

    let info = document.createElement("div");
    info.innerHTML += instructor.jobTitle + "</p>";
    info.classList.add("course-info");

    let button = document.createElement("button");
    button.innerText = "Show Courses";
    button.classList.add("enroll-button");
    button.style.float = "right";
    button.addEventListener("click", function () {
      playSound("Add.mp3");
      openModal(instructor.id);
    });

    cell.appendChild(button);

    cell.appendChild(info);

    row.appendChild(cell); // Append the cell to the current row
  });
}

$(document).ready(function () {
  GetInstructors();
});
