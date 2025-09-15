const socket = io("/", { path: "/real-time" });

// screens
const screen1 = document.getElementById("screen1");
const screen2 = document.getElementById("screen2");

// screen 1
screen1.style.display = "block";
screen2.style.display = "none";

socket.on("next-screen", (data) => {
  screen1.style.display = "none";
  screen2.style.display = "block";
});

// screen 2

const goBackButton = document.getElementById("go-screen-back");
goBackButton.addEventListener("click", () => {
  screen1.style.display = "block";
  screen2.style.display = "none";
});
