// utils/router.js

let currentCleanup = null;

export async function navigate(name) {
  const app = document.getElementById("app");

  // cleanup previous module
  if (currentCleanup) {
    currentCleanup();
    currentCleanup = null;
  }

  app.innerHTML = "Loading...";

  const module = await import(`../modules/${name}.js`);

  // each module returns a cleanup function
  currentCleanup = module.mount(app);
}