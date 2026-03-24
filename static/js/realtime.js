(function () {
  const socket = io();
  const toastContainer = document.getElementById("toast-container");

  function toast(message, type = "info") {
    if (!toastContainer) return;
    const styles = {
      info: "bg-sky-600",
      success: "bg-emerald-600",
      warning: "bg-amber-600",
    };
    const el = document.createElement("div");
    el.className = `${styles[type] || styles.info} text-white px-4 py-2 rounded shadow`;
    el.textContent = message;
    toastContainer.appendChild(el);
    setTimeout(() => el.remove(), 3500);
  }

  socket.on("connect", () => {
    console.log("Realtime connected");
  });

  socket.on("new_assignment", (payload) => {
    toast(`New assignment: ${payload.title} (Due ${payload.deadline})`, "success");
    const counter = document.getElementById("assignment-count");
    if (counter) counter.textContent = Number(counter.textContent || 0) + 1;
  });

  socket.on("attendance_updated", (payload) => {
    toast(`Attendance updated for ${payload.subject}: ${payload.status}`, "warning");
  });
})();
