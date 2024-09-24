gsap.registerPlugin(CustomEase);
CustomEase.create(
  "hop",
  "M0,0 C0.083,0.294 0.117,0.767 0.413,0.908 0.606,1 0.752,1 1,1 "
);

window.addEventListener("load", function () {
  const slider = document.querySelector(".slider");
  let slides = slider.querySelectorAll(".slide");
  let animating = false;

  let duration = 1.5;

  slides.forEach((slide, index) => {
    if (index > 0) {
      gsap.set(slide, {
        clipPath: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
      });
    }
  });

  function initializeFlexValues() {
    const timeline = document.querySelector(".timeline");
    const counters = timeline.querySelectorAll("p");

    counters[0].style.flexGrow = 5;
    counters[0].style.width = "max-content";
    counters[1].style.flexGrow = 4;
    counters[1].style.width = "max-content";
    counters[2].style.flexGrow = 3;
    counters[2].style.width = "max-content";
    counters[3].style.flexGrow = 1.5;
    counters[3].style.width = "max-content";
    counters[4].style.flexGrow = 1;
    counters[4].style.width = "max-content";
    for (let i = 5; i < counters.length; i++) {
      counters[i].style.flexGrow = 0;
      counters[i].style.width = "0px";
    }
  }

  initializeFlexValues();

  function appendNewcounters() {
    const timeline = document.querySelector(".timeline");
    const counters = Array.from(timeline.querySelectorAll("p"));
    const firstIndex = counters.findIndex((p) => p.classList.contains("first"));

    for (let i = 0; i < firstIndex; i++) {
      counters[i].remove();
    }

    for (let i = 1; i <= 8; i++) {
      const newSup = document.createElement("sup");
      newSup.textContent = "pm";

      const newP = document.createElement("p");
      newP.textContent = i;
      newP.style.flexGrow = 0;
      newP.style.width = "0px";
      newP.appendChild(newSup);
      timeline.appendChild(newP);
    }
  }

  const handleSlider = () => {
    if (animating) return;
    animating = true;

    slides = slider.querySelectorAll(".slide");

    const firstSlide = slides[0];
    const firstSlideImg = firstSlide.querySelector("img");

    if (slides.length > 1) {
      const secondSlide = slides[1];
      const secondSlideImg = secondSlide.querySelector("img");
      gsap.set(secondSlideImg, { x: 250 });

      gsap.to(secondSlideImg, {
        x: 0,
        duration: duration,
        ease: "hop",
      });

      gsap.to(firstSlideImg, {
        x: -500,
        duration: duration,
        ease: "hop",
      });

      gsap.to(secondSlide, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: duration,
        ease: "hop",
        onComplete: function () {
          firstSlide.remove();
          slider.appendChild(firstSlide);

          gsap.set(firstSlide, {
            clipPath: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
          });

          animating = false;
        },
      });
    } else {
      animating = false;
    }

    const timeline = document.querySelector(".timeline");
    const counters = timeline.querySelectorAll("p");

    let lastFlexGrow = counters[counters.length - 1].style.flexGrow;

    const lastCounter = document.querySelector(".timeline .last");
    if (lastCounter && lastCounter.textContent === "7pm") {
      appendNewcounters();
    }

    counters.forEach((p) => {
      p.classList.remove("last");
      p.classList.remove("first");
    });

    let firstAssigned = false;

    for (let i = counters.length - 1; i > 0; i--) {
      gsap.to(counters[i], {
        flexGrow: counters[i - 1].style.flexGrow,
        duration: duration,
        ease: "hop",
        onStart: () => {
          let newWidth =
            counters[i - 1].style.flexGrow > 0 ? "max-content" : "0px";
          gsap.set(counters[i], { width: newWidth });

          if (counters[i - 1].style.flexGrow === "5") {
            counters[i].classList.add("first");
            firstAssigned = true;
          } else if (counters[i - 1].style.flexGrow === "1" && !firstAssigned) {
            counters[i].classList.add("last");
          }
        },
      });
    }

    gsap.to(counters[0], {
      flexGrow: lastFlexGrow,
      duration: duration,
      ease: "hop",
      onStart: () => {
        let newWidth = lastFlexGrow > 0 ? "max-content" : "0px";
        gsap.set(counters[0], { width: newWidth });

        if (lastFlexGrow === "5") {
          counters[0].classList.add("first");
        } else if (lastFlexGrow === "1" && !firstAssigned) {
          counters[0].classList.add("last");
        }
      },
    });
  };

  document.addEventListener("click", handleSlider);
});
