import { menu } from "./nav.js";

const $ = document.querySelector.bind(document);
const onClick = (node, handler) =>
  node.addEventListener("click", handler, { once: false });

document.addEventListener("DOMContentLoaded", () => {
  // Hamburger menu toggle
  const hamburger = $("#hamburger");
  const aside = $("aside");
  const closeAside = $("#close-nav");
  const article = $("main > article");

  onClick(hamburger, (e) => {
    e.stopPropagation();
    aside.classList.add("draw-nav");
    aside.classList.remove("close-nav");
  });

  onClick(closeAside, () => {
    aside.classList.remove("draw-nav");
    aside.classList.add("close-nav");
  });

  // Menu rendering
  const nav = $(".menu");
  const fragment = document.createDocumentFragment();

  menu.forEach(({ header, items }) => {
    const menuList = document.createElement("li");
    menuList.className = "item";

    const title = Object.assign(document.createElement("div"), {
      className: "header",
      innerHTML: `<span class="title">${header}</span>`,
    });

    const list = document.createElement("ul");
    list.className = "list";

    items.forEach((menuItem) => {
      const li = document.createElement("li");
      li.classList.add("item");
      li.textContent = menuItem;
      onClick(li, () => {
        article.replaceChildren();
      });
      list.append(li);
    });

    menuList.append(title, list);
    fragment.append(menuList);
  });

  nav.append(fragment);
});
