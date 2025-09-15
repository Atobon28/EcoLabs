const socket = io("/", { path: "/real-time" });

// screens
const screen1 = document.getElementById("screen1");

// screen 1
screen1.style.display = "block";

document.getElementById("get-btn").addEventListener("click", getUsers);
document
  .getElementById("change-screen-btn")
  .addEventListener("click", sendEventChangeScreen);

function getUsers() {
  fetch("http://localhost:5050/users")
    .then((response) => response.json())
    .then((data) => console.log("get response", data))
    .catch((error) => console.error("Error:", error));
}

async function sendEventChangeScreen() {
  let changeEventResponse = await fetch("http://localhost:5050/change-screen", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  changeEventResponse = await changeEventResponse.json();
}
