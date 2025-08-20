function validateLogin() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorMsg = document.getElementById("");
  
    if (username === "jain.saksham896@gmail.com" && password === "S@ksham89jain") {
      window.location.href = "index.html"; // Redirect to main Ultron page
    } else {
      errorMsg.textContent = "";
    }
  }
  