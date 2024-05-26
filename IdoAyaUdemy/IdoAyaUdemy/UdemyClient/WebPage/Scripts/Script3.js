import instructors from "../Data/Instructor.json" with { type: "json" };

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

function LoadInstructors() { 
    let api = "https://localhost:7061/api/Instructors";
    instructors.forEach(instructor => {

        let i = {
           Id: instructor.id,
           Title: instructor.title,
           Name: instructor.display_name,
           Image: instructor.image_100x100,
           JobTitle: instructor.job_title
        }
        setTimeout(ajaxCall("POST", api, JSON.stringify(i), PostInstructorSCB, PostInstructorECB), 800000);
        
    });
}

function GetInstructors() {
    let api = "https://localhost:7061/api/Instructors";
    ajaxCall("GET", api, "", GetInstructorsSCB, GetInstructorsECB);
}

function GetInstructorsSCB(instructorList) {
    loadCoursesTable(instructorList);
}

function GetInstructorsECB(err) {
    console.log(err);

}

function PostInstructorSCB(message) {
    console.log(message);
}

function PostInstructorECB(message) {
    console.log(message);
}

function loadCoursesTable(list) {
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
        cell.appendChild(info);

        row.appendChild(cell); // Append the cell to the current row
    });
    ShowBttn.disabled = true;
}


let loadBttn = document.getElementById("iLoadBttn");
loadBttn.addEventListener("click", function() {LoadInstructors();});

let ShowBttn = document.getElementById("iShowBttn");
ShowBttn.addEventListener("click", function() {GetInstructors();});
