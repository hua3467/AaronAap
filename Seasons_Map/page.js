const navItems = document.querySelectorAll(".nav-item");
const btnToMap = document.querySelector("#toMap");


navItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    navItems.forEach((item) => {
      item.classList.remove("active-nav-item");
    });
    e.target.classList.add("active-nav-item");
  });
});

btnToMap.addEventListener("click", (e) => {
  navItems.forEach((item) => {
    item.classList.remove("active-nav-item");
  });
  navItems[navItems.length - 1].classList.add("active-nav-item");
});
