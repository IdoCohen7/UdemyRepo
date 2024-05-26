import courses from "../Data/Course.json" with { type: "json" };

let user = JSON.parse(localStorage.getItem("user"));
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

  function loadCoursesTable() {
    let table = document.getElementById("coursesTable");
    courses.forEach((course, index) => {
        let row = document.createElement("tr");
    
        let cell = document.createElement("td");
    
        let image = document.createElement("img");
        image.src = course.image;
        cell.appendChild(image);
    
        let title = document.createElement("h3");
        title.textContent = course.title;
        title.classList.add("course-title");
        cell.appendChild(title);
    
        let info = document.createElement("div");
        info.innerHTML = "<p>Duration: " + course.duration + "</p>";
        info.innerHTML += "<p>Rating: " + course.rating + "</p>";
        info.innerHTML += "<p>Reviews: " + course.num_reviews + "</p>";
        info.innerHTML += "<p>Last Updated: " + course.last_update_date + "</p>";
        
        // Creating the link to the course URL
        let courseURL = "https://www.udemy.com" + course.url;
        let courseLink = document.createElement("a");
        courseLink.href = courseURL;
        courseLink.textContent = "Visit Page"; // Set the text content of the link
        courseLink.classList.add("enroll-button");
   
        
        info.classList.add("course-info");
        cell.appendChild(info);
    
        let button = document.createElement("button");
        button.textContent = "Add";
        button.classList.add("enroll-button");
        
        
        // Set the value of the button to hold the index of the course in the courses array
        button.value = index;
        button.addEventListener("click", function(){PostToServer(button.value)});
        
        // Add functionality to the button here if needed
    
        cell.appendChild(button);
        cell.appendChild(courseLink);
        row.appendChild(cell);
    
        table.appendChild(row);

    });
}


loadCoursesTable();

function PostCoursesSCB(status) {
    if (status == true) {
        alert("course added to the list!")
    }
    else {
        alert("error: course has already been added to the list");
    }
}

function PostCoursesECB(err) {
    alert("error");
}



function PostToServer(index) {
    if (user != null) {
      let api = 'https://localhost:7061/api/Courses';
  
      let durationSplit = courses[index].duration.split(" ");
      let durationDoubleValue = parseFloat(durationSplit[0]);
  
      let addedCourse = {
        Id: courses[index].id,
        Title: courses[index].title,
        Url: courses[index].url,
        Rating: courses[index].rating,
        NumOfReviews: courses[index].num_reviews,
        InstructorId: courses[index].instructors_id,
        ImageRef: courses[index].image,
        Duration: durationDoubleValue,
        LastUpdate: courses[index].last_update_date
      }
  
      ajaxCall("POST", api, JSON.stringify(addedCourse), PostCoursesSCB, PostCoursesECB);
    } else {
      if (confirm("You are not logged in.\nClick OK to log in\nClick CANCEL to view as guest")) {
        location.href="SignUp.html"

      }
    }
  }
