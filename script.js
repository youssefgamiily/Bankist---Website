"enable strict";

//coordinates of FeaturesTitle

window.onload = function () {
  let LearnMoreBtn = document.getElementById("LearnMoreBtn");
  let FeaturesTitle = document.getElementById("FeaturesTitle");

  console.log(`${FeaturesTitle}`);

  LearnMoreBtn.addEventListener("click", function () {
    FeaturesTitleCoords = FeaturesTitle.getBoundingClientRect(); // this function calculates the y distance that the element is away from the windows top and left
    console.log(`coordinates are ${FeaturesTitleCoords}`);
    let xAbsPos = FeaturesTitle.getBoundingClientRect().x + window.pageXOffset;
    let yAbsPos = FeaturesTitle.getBoundingClientRect().y + window.pageYOffset;
    console.log(
      `window positions (x,y) is (${window.pageXOffset},${window.pageYOffset})`
    );

    window.scrollTo({
      // This function scrolls to the absolute position (x,y) so we need to make the relative distance from getBoundingClientRect absolute by adding the offset of the windows top and left
      left: xAbsPos,
      top: yAbsPos,
      behavior: "smooth",
    });

    console.log(
      `window positions (x,y) is (${window.pageXOffset},${window.pageYOffset})`
    );
  });

  //smooth scrolling for NavBtns using Bubbling Up approach
  let NavBtns = document.querySelector(".links");
  NavBtns.addEventListener("click", function (e) {
    // find target --> find targets href attr --> get element with id attr --> scroll to element
    e.preventDefault();
    let id = e.target.getAttribute("href");
    console.log(
      `element with id: ${id} clicked. now scrolling to this element . . .`
    );
    let destination = document.querySelector(id);
    console.log(`destination is ${destination}`);
    destination.scrollIntoView({ behavior: "smooth" });
  });

  // Tabbed Element tabbed Buttons
  let InstantTransfersBtn = document.querySelector("#InstantTransfersBtn");
  let InstantLoansBtn = document.querySelector("#InstantLoansBtn");
  let InstantClosingBtn = document.querySelector("#InstantClosingBtn");

  //add event listener to parent of each button
  document
    .getElementById("operationsBtns")
    .addEventListener("click", function (e) {
      e.preventDefault();
      let VisibleElement = document.getElementById(
        e.target.getAttribute("href")
      );

      console.log(
        `e.target.getAttribute("href") is ${e.target.getAttribute(
          "href"
        )} && visibleElement is ${VisibleElement}`
      );

      let operationsContents = document.querySelectorAll(".operation");
      for (operation of operationsContents) {
        if (operation === VisibleElement) {
          operation.classList.remove("hidden");
        } else {
          operation.classList.add("hidden");
        }
      }
    });

  // menu fade out on Hover ... if you hover any NavBarBtn that means that NavBar can also detect the event.. event delegation
  let NavBar = document.querySelector(".NavBar");

  let MenuFadHelper = (e, op) => {
    console.log(`triggered`);
    let links = document.querySelectorAll(".link");
    console.log(`DB: links is ${links}`);
    for (link of links) {
      console.log(
        `DB: link is ${link.nodeName} and e.target is ${e.target.nodeName}`
      );
      // if (link !== e.target) child.classList.add("lighter");
      if (link != e.target) link.style.opacity = op;
    }

    //.. and fade them
  };
  document.querySelector(".NavBar").addEventListener("mouseover", function (e) {
    // select the other buttons and logo --> 1) select parent --> 2) select children
    MenuFadHelper(e, 0.5);
  });

  NavBar.addEventListener("mouseout", function (e) {
    // select the other buttons and logo --> 1) select parent --> 2) select children
    MenuFadHelper(e, 1);
  });

  // Sticky Navigation (Traditional Way)

  /*  100% working
  //Get Section 1 Coordinates
  let sec1 = document.querySelector("#hr--1").getBoundingClientRect().y;

  document.addEventListener("scroll", function () {
    let targetY = sec1;

    console.log(`scrollY is ${scrollY} and targetY is ${targetY}`);
    if (window.scrollY > targetY) {
      NavBar.classList.add("sticky-nav"); // add sticky class here
      NavBar.style.height = NavBar.getBoundingClientRect().height;
    } else if (scrollY < targetY - 80) NavBar.classList.remove("sticky-nav");
    // console.dir(document.querySelector("#sec1").getBoundingClientRect());
  });
  
  */

  //Sticky Navigation - Intersection Observer API
  let targ = document.querySelector("#sec--2");
  let div_2 = document.querySelector("#div--2");
  let sec_2 = document.querySelector("#sec--2");
  let NavHeight = NavBar.getBoundingClientRect().height;
  let sec_1 = document.querySelector("#sec1");

  let options = {
    root: null,
    rootMargin: `120px`,
    threshold: [0, 1],
  };

  let callback = function (entries, observer) {
    entries.forEach((entry, index) => {
      console.log(entry);
      if (entry.intersectionRatio > 0.7) {
        console.log(`intersectionRatio is ${entry.intersectionRatio}`);
        console.log(entry.target);
        // do whatever
        NavBar.classList.remove("sticky-nav");
        console.log(`did not add sticky`);
      } else if (entry.intersectionRatio < 0.7) {
        // do whatever
        console.log(`intersectionRatio is ${entry.intersectionRatio}`);
        console.log(`did add sticky`);
        NavBar.classList.add("sticky-nav");
      }
    });
  };
  let observer = new IntersectionObserver(callback, options);
  observer.observe(sec_1);

  // jonas's code
  // const obsCallback = function (entries, observer) {
  //   entries.forEach((entry) => {
  //     console.log(entry);
  //   });
  // };

  // const obsOptions = {
  //   root: null,
  //   threshold: [0, 0.2],
  // };

  // const observer = new IntersectionObserver(obsCallback, obsOptions);
  // observer.observe(sec1);

  // reveal on scroll:
  // 1- Select all by-default hidden elements
  let hidden_elements = document.querySelectorAll(".opacity--zero");

  //add intersection observer for each of those elements
  let hidden_observer_optns = { root: null, threshold: 0.4 };
  revealElement = function (entries, observer) {
    [entry] = entries;
    // console.log(entry);
    if (!entry.isIntersecting) return;
    if (entry.intersectionRatio > 0.4) {
      entry.target.classList.remove("opacity--zero");
      observer.unobserve(entry.target);
    }
  };
  const hidden_observer = new IntersectionObserver(
    revealElement,
    hidden_observer_optns
  );
  for (element of hidden_elements) {
    hidden_observer.observe(element);
  }

  //Lazy Loading Image
  // Select all images with class blur
  let images = document.querySelectorAll(".blur");
  // on intersection of each image, do something
  BlurObserverOptions = {
    root: null,
    threshold: 1,
    rootMargin: "15px",
  };

  let unblurImg = function (entries) {
    [entry] = entries;
    if (entry.intersectionRatio > 0) {
      console.log(`entry is :`);
      console.log(entry);

      console.log(`target is `);
      console.log(entry.target);
      //get dataset src
      let newSrc = entry.target.dataset.src;
      // change img src
      entry.target.src = newSrc;

      //remove blur
      entry.target.addEventListener("load", () => {
        entry.target.classList.remove("blur");
      });
    }
  };
  let blurImgObserver = new IntersectionObserver(
    unblurImg,
    BlurObserverOptions
  );
  for (img of images) blurImgObserver.observe(img);
  let printArr = (arr) => arr.forEach((arrE) => console.log(arrE));

  // Slider Component
  // Start by translate X by default
  let testimonials = document.querySelectorAll(".testimonial");
  let testimonialSection = document.querySelector("#testimonialSection");
  testimonials.forEach((testimonial, index) => {
    oddOrEven = index % 2 === 0 ? +1 : -1;
    testimonial.style.transform = `translateX(${
      100 * oddOrEven * Math.ceil(index / 2)
    }%)`;
  });
  ///helper functions and code cleaning:
  let parseNum = (str) => {
    // parse value from the returned string
    let num = Number(str.slice(str.indexOf("(") + 1, str.lastIndexOf("%")));
    return num;
  };
  let findMinMax = (str, arr) => {
    // str E ("highest", "lowest") and arr (Number)
    if (str === "highest") return Math.max(...arr);
    else if ((str = "lowest")) return Math.min(...arr);
    else console.log(`str parameter in findMinMax is not defined`);
  };

  // flag variables because to make sure function returns for good
  let flagRight = 0;
  let flagLeft = 0;

  let isReady = (RightorLeft) => {
    if (flagLeft === 1) {
      if (RightorLeft === "left") {
        return 0;
      } else if (RightorLeft === "right") {
        flagLeft = 0;
        return 1;
      }
    }
    if (flagRight === 1) {
      if (RightorLeft === "right") {
        return 0;
      } else if (RightorLeft === "left") {
        flagRight = 0;
        return 1;
      }
    }
  };

  let getEdgeElement = function (testimonials, RightorLeft) {
    let EdgeElement;
    let testimonialsMap = new Map();
    for (t of testimonials) {
      Num = parseNum(t.style.transform); // parse value from string
      testimonialsMap.set(Num, t);
    }
    if (RightorLeft === "right")
      EdgeElement = findMinMax("highest", testimonialsMap.keys());
    if (RightorLeft === "left")
      EdgeElement = findMinMax("lowest", testimonialsMap.keys()); // find lowest translation
    return testimonialsMap.get(EdgeElement);
  };
  let Translate = (RightorLeft, testimonial) => {
    let translateXVal = parseNum(testimonial.style.transform);
    let newTranslateXVal =
      RightorLeft === "right" ? translateXVal - 100 : translateXVal + 100;
    testimonial.style.transform = null;
    testimonial.style.transform = `translateX(${newTranslateXVal}%)`;
  };

  // core function
  let slideRight = function (RightorLeft, e) {
    printArr(testimonials);
    let OriginalTestimonials = testimonials;
    if (!isReady) return 0;

    console.log(`in slideRight() and RightorLeft is ${RightorLeft}`);

    let EdgeElement = getEdgeElement(testimonials, RightorLeft);
    console.log(EdgeElement);

    if (e) e.preventDefault();

    if (EdgeElement.style.transform === `translateX(0%)`) {
      console.log(`This is the last element. Can't go ${RightorLeft}`);
      if (RightorLeft === "right") flagRight = 1;
      if (RightorLeft === "left") flagLeft = 1;
      testimonials = OriginalTestimonials;
      return;
    }

    for (let i = 0; i < testimonials.length; i++) {
      Translate(RightorLeft, testimonials[i]);
    }
    printArr(testimonials);
  };

  // on click --> slideRight()
  let slideRightBtn = document.querySelector("#slideRightBtn");
  slideRightBtn.addEventListener("click", (e) => slideRight("right", e));

  let slideLeftBtn = document.querySelector("#slideLeftBtn");
  slideLeftBtn.addEventListener("click", (e) => slideRight("left", e));

  // slideRight on right Arrow click and vice versa
  document.addEventListener("keydown", function (e) {
    e.preventDefault();
    if (e.key === "ArrowRight") slideRight("right", e);
    else if (e.key === "ArrowLeft") slideRight("left", e);
  });
};
