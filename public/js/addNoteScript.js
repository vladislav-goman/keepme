document.querySelectorAll(".tag-checkbox").forEach((tag) => {
  tag.addEventListener("change", ({ target }) => {
    target.parentNode.classList.toggle("active");
  });
});
