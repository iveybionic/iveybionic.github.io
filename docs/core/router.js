// core/router.js

const mounts = {
  controller: null,
  plotter: null,
};

export async function mountModule(name, slot, containerId) {
  const container = document.getElementById(containerId);

  // cleanup existing
  if (mounts[slot]) {
    mounts[slot]();
    mounts[slot] = null;
    container.innerHTML = "";
  }

  if (!name || name === "none") return;

  const module = await import(`../modules/${name}.js`);
  mounts[slot] = module.mount(container);
}

export function unmount(slot, containerId) {
  const container = document.getElementById(containerId);

  if (mounts[slot]) {
    mounts[slot]();
    mounts[slot] = null;
    container.innerHTML = "";
  }
}

// let currentCleanup = null;

// export async function navigate(name) {
//   const app = document.getElementById("app");

//   // cleanup previous module
//   if (currentCleanup) {
//     currentCleanup();
//     currentCleanup = null;
//   }

//   app.innerHTML = "Loading...";

//   const module = await import(`../modules/${name}.js`);

//   // each module returns a cleanup function
//   currentCleanup = module.mount(app);
// }