document.addEventListener("DOMContentLoaded", async () => {
  // değişkenler ve seçiciler
  let allTasks = []; // bütün verinin tutulacağı yer
  const container = document.getElementById("tasks-container");
  const filterButtons = document.querySelectorAll(".filter-btn");

  try {
    // json/tasks.json dosyasından veriyi alıyoruz. await, fetch işlemi bitene kadar bir sonraki satıra geçmez
    const response = await fetch("./json/tasks.json");

    if (!response.ok) {
      throw new Error(`Veri çekilemedi! Hata Kodu: ${response.status}`);
    }
    // dosyadan gelen veri bir string yığınıdır. .json() komutu jsnin anlayacağı json formatına çevirir
    const data = await response.json();

    allTasks = data.tasks;
    // ilk önce verilerin hepsini bas
    renderTasks(allTasks);
  } catch (error) {
    console.error("Tasks verisi yüklenirken hata oluştu:", error);
  }
  //Butonlaara tıklayıp filtreleme
  filterButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      //Tıklanan butonun yazısını al
      const filterType = e.target.textContent.trim();
      let filteredTasks = [];
      // Şarta göre kasadaki (allTasks) verileri süzüyoruz
      if (filterType === "Tümü") {
        filteredTasks = allTasks;
      } else if (filterType === "Tamamlanan") {
        filteredTasks = allTasks.filter((task) => task.completed === true);
      } else if (filterType === "Tamamlanmayan") {
        filteredTasks = allTasks.filter((task) => task.completed === false);
      }
      // Süzülmüş yeni listeyi ekrana basıyoruz
      renderTasks(filteredTasks);
      // Tıklanan butonun rengini mavi (active) yapıyoruz
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      e.target.classList.add("active");
    });
  });

  //Task kartlarını ekrana basan fonksiyon
  function renderTasks(tasksArray) {
    const taskListElement = document.getElementById("tasks-container");
    if (!taskListElement) return;

    taskListElement.innerHTML = ""; // Önce içini temizle ki üst üste binmesin

    //taskin yapılıp yapılmadığını kontrol eder yapıldıysa işaretlenir yoksa boş kalır.
    tasksArray.forEach((task) => {
      const isChecked = task.completed ? "checked" : "";
      const completedClass = task.completed ? "completed-card" : "";

      //Önceliğe göre rozet rengi belirleme
      let priorityClass = "";

      if (task.priority === "high") {
        priorityClass = "high-priority";
      } else if (task.priority === "completed") {
        priorityClass = "completed-priority";
      } else {
        priorityClass = "normal-priority";
      }

      //CSSin kullanıcağı html  şablonu
      const taskItem = `
    <div class="card task-item-card ${completedClass}">
        <div class="task-card-header">
            <span class="badge ${priorityClass}">${task.priority}</span>
            <button class="more-options-btn">⋮</button>
        </div>
        <h3 class="task-card-title">
            <input type="checkbox" class="task-checkbox" ${isChecked}>
           ${task.title}
        </h3>
       ${task.description ? `<p class="task-desc">${task.description}</p>` : ""}
        <div class="task-date">
            <img src="assets/icons/calendar1.svg" alt="Tarih" class="date-icon">
            <span>${task.date}</span>
        </div>
    </div>
   `;

      container.insertAdjacentHTML("beforeend", taskItem);
    });
  }
});
