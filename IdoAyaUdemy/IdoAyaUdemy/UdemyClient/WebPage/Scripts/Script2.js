// DOM utility functions:

const el = (sel, par) => (par || document).querySelector(sel);
const els = (sel, par) => (par || document).querySelectorAll(sel);
const elNew = (tag, prop) => Object.assign(document.createElement(tag), prop);

// Helper functions:

const mod = (n, m) => ((n % m) + m) % m;

// Task: Carousel:

const carousel = (elCarousel) => {
  const animation = 500;
  const pause = 5000;
  // Or use something like: const animation = Math.abs(elCarousel.dataset.carouselAnimation ?? 500);

  const elCarouselSlider = el(".carousel-slider", elCarousel);
  const elsSlides = els(".carousel-slide", elCarouselSlider);
  const elsBtns = [];

  let itv; // Autoslide interval
  let tot = elsSlides.length; // Total slides
  let c = 0;

  if (tot < 2) return; // Not enough slides. Do nothing.

  // Methods:
  const anim = (ms = animation) => {
    const cMod = mod(c, tot);
    // Move slider
    elCarouselSlider.style.transitionDuration = `${ms}ms`;
    elCarouselSlider.style.transform = `translateX(${(-c - 1) * 100}%)`;
    // Handle active classes (slide and bullet)
    elsSlides.forEach((elSlide, i) =>
      elSlide.classList.toggle("is-active", cMod === i)
    );
    elsBtns.forEach((elBtn, i) => {
      elBtn.classList.toggle("is-active", cMod === i);
      elBtn.setAttribute("aria-disabled", cMod === i);
    });
  };

  const prev = () => {
    if (c <= -1) return; // prevent blanks on fast prev-click
    c -= 1;
    anim();
  };

  const next = () => {
    if (c >= tot) return; // prevent blanks on fast next-click
    c += 1;
    anim();
  };

  const goto = (index) => {
    c = index;
    anim();
  };

  const play = () => {
    elCarouselSlider.setAttribute("aria-live", "off");
    itv = setInterval(next, pause + animation);
  };

  const stop = () => {
    clearInterval(itv);
    elCarouselSlider.setAttribute("aria-live", "polite");
  };

  // Buttons:

  const elPrev = elNew("button", {
    type: "button",
    className: "carousel-prev",
    innerHTML: "<i class='fas fa-chevron-left'></i>",
    onclick: () => prev(),
  });
  elPrev.setAttribute("aria-controls", "slides");
  elPrev.setAttribute("aria-label", "Previous slide");

  const elNext = elNew("button", {
    type: "button",
    className: "carousel-next",
    innerHTML: "<i class='fas fa-chevron-right'></i>",
    onclick: () => next(),
  });
  elNext.setAttribute("aria-controls", "slides");
  elNext.setAttribute("aria-label", "Next slide");

  // Navigation:

  const elNavigation = elNew("div", {
    className: "carousel-navigation",
    role: "group",
  });
  elNavigation.setAttribute("aria-label", "Choose slide to display");

  // Navigation bullets:

  for (let i = 0; i < tot; i++) {
    const elBtn = elNew("button", {
      type: "button",
      className: "carousel-bullet",
      onclick: () => goto(i),
    });
    elBtn.setAttribute("aria-labelledby", `slide${i + 1}`);
    elsBtns.push(elBtn);
  }

  // Events:

  // Infinite slide effect:
  elCarouselSlider.addEventListener("transitionend", () => {
    if (c <= -1) c = tot - 1;
    if (c >= tot) c = 0;
    anim(0); // quickly switch to "c" slide (with animation duration 0)
  });

  // Pause on pointer enter:
  elCarousel.addEventListener("pointerenter", () => stop());
  elCarousel.addEventListener("pointerleave", () => play());

  // Pause on focus:
  elCarousel.addEventListener("focus", () => stop(), true);
  elCarousel.addEventListener("blur", () => play(), true);

  // Init:

  // Insert UI elements:
  elNavigation.append(...elsBtns);
  elCarousel.append(elPrev, elNext, elNavigation);

  // Clone first and last slides (for "infinite" slider effect)
  elCarouselSlider.prepend(elsSlides[tot - 1].cloneNode(true));
  elCarouselSlider.append(elsSlides[0].cloneNode(true));

  // Initial slide
  anim(0);

  // Start autoplay
  play();
};

// Allows to use multiple carousels on the same page:
els(".carousel").forEach(carousel);

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
    // Create the remove button with Font Awesome icon
    let removeButton = document.createElement("button");
    let removeIcon = document.createElement("i");
    removeIcon.classList.add("fas", "fa-trash"); // Add Font Awesome classes for the trash icon
    removeButton.appendChild(removeIcon); // Append the icon to the button
    removeButton.appendChild(document.createTextNode(" Remove")); // Add text node for "Remove" text
    removeButton.classList.add("enroll-button");
    removeButton.value = course.id;
    removeButton.addEventListener("click", function () {
      RemoveCourse(removeButton.value);
    });
    cell.appendChild(removeButton);

    cell.appendChild(courseLink);
    row.appendChild(cell);

    table.appendChild(row);
  });
  let sumOfCourses = document.getElementById("courseNum");
  sumOfCourses.textContent =
    "There are " + coursesList.length + " courses in your list";
}

function GetCoursesECB(err) {
  alert("Unable to get courses from server");
}

function GetFromServer() {
  if (user != null) {
    let api = "https://localhost:7061/api/Users/" + user.id;
    setTimeout(
      ajaxCall("GET", api, null, GetCoursesSCB, GetCoursesECB),
      9000000
    );
  } else {
    let cHeader = document.getElementById("courseNum");
    cHeader.innerHTML = "LOG IN TO START ADDING COURSES TO YOUR LIST";
  }
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
  let api = "https://localhost:7061/api/Users/uId/" + user.id + "/cId/" + id;

  ajaxCall("DELETE", api, null, DeleteCourseSCB, DeleteCourseECB);
  location.reload();
}

function DeleteCourseSCB(code) {}

function DeleteCourseECB(ERROR) {
  console.log("ERROR: " + ERROR);
}

function searchByDuration(start, end) {
  let api = "https://localhost:7061/api/Courses/getByDurationRange";
  ajaxCall(
    "GET",
    api,
    { id: user.id, start: start, end: end },
    GetCoursesSCB,
    GetCoursesECB
  );
}

function searchByRating(start, end) {
  let api =
    "https://localhost:7061/api/Courses/getByRatingRange/id/" +
    user.id +
    "/start/" +
    start +
    "/end/" +
    end;

  ajaxCall("GET", api, null, GetCoursesSCB, GetCoursesECB);
}

/*commit*/
loadPage();
