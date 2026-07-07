document.addEventListener("DOMContentLoaded", async () => {
  // 1. Değişkenler ve Seçiciler
  let allTasks = []; // Bütün verinin tutulacağı yer
  const container = document.getElementById("tasks-container");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const taskForm = document.getElementById("newTaskForm");
  const taskTitleInput = document.getElementById("taskTitle");
  const dueDateInput = document.getElementById("dueDate");
  const taskModal = document.getElementById("taskModal");
  // =================================================================
  // VERİLERİ SUNUCUDAN ÇEKME (GET)
  // =================================================================
  try {
    // Statik dosya yerine json-server API adresimizden verileri çekiyoruz
    const response = await fetch("http://localhost:3000/tasks");
    if (!response.ok) {
      throw new Error(`Veri çekilemedi! Hata Kodu: ${response.status}`);
    }
    allTasks = await response.json();
    // Verileri ekrana basan fonksiyonu çağır
    renderTasks(allTasks);
  } catch (error) {
    console.error("Tasks verisi yüklenirken hata oluştu:", error);
  }
  // =================================================================
  // FİLTRELEME MANTIĞI
  // =================================================================
  filterButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const filterType = e.target.textContent.trim();
      let filteredTasks = [];
      // Yeni veritabanı yapımızdaki string "status" alanına göre süzüyoruz
      if (filterType === "Tümü") {
        filteredTasks = allTasks;
      } else if (filterType === "Tamamlanan") {
        filteredTasks = allTasks.filter((task) => task.status === "Tamamlandı");
      } else if (filterType === "Tamamlanmayan") {
        filteredTasks = allTasks.filter(
          (task) => task.status === "Tamamlanmayan",
        );
      }
      renderTasks(filteredTasks);
      // Aktif buton görselini güncelle
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      e.target.classList.add("active");
    });
  });
  // =================================================================
  // GÖREV KARTLARINI EKRANA BASAN FONKSİYON (RENDER)
  // =================================================================
  function renderTasks(tasksArray) {
    if (!container) return;
    container.innerHTML = ""; // Önce içini temizle
    tasksArray.forEach((task) => {
      // Tamamlanma durumuna göre CSS class'larını belirle
      const isChecked = task.status === "Tamamlandı" ? "checked" : "";
      const completedClass =
        task.status === "Tamamlandı" ? "completed-card" : "";
      // Senin CSS'indeki öncelik rozet renklerini eşleştiriyoruz
      let priorityClass = "normal-priority";
      if (task.priority === "low") {
        priorityClass = "low-priority";
      }
      if (task.priority === "high") {
        priorityClass = "high-priority";
      } else if (
        task.priority === "completed" ||
        task.status === "Tamamlandı"
      ) {
        priorityClass = "completed-priority";
      }
      // Senin CSS yapınla birebir uyumlu HTML şablonu
      const taskItem = `
        <div class="card task-item-card ${completedClass}">
          <div class="task-card-header">
            <span class="badge ${priorityClass}">${task.priority === "high" ? "Yüksek" : task.priority === "medium" ? "Orta" : "Düşük"}</span>
            <div class="dropdown-container">
              <button class="more-options-btn" onclick="toggleMenu(event, '${task.id}')">⋮</button>
              <div id="dropdown-${task.id}" class="dropdown-menu">
                <button class="dropdown-item" onclick="editTask('${task.id}', '${task.title}', '${task.date}', '${task.priority}')">Düzenle</button>
                <button class="dropdown-item delete-item" onclick="deleteTask('${task.id}')">Sil</button>
              </div>
            </div>
          </div>
          <h3 class="task-card-title">
               ${task.title}
          </h3>
          <div class="task-date">
            <img src="assets/icons/calendar1.svg" alt="Tarih" class="date-icon">
            <span>${task.date}</span>
          </div>
          <div class="task-card-footer">
            <button class="complete-btn ${task.status === "Tamamlandı" ? "done" : ""}">
              <span class="circle-icon">+</span>
              ${task.status === "Tamamlandı" ? "Bitti" : "Tamamla"}
            </button>
        </div>
      </div>
     `;
      container.insertAdjacentHTML("beforeend", taskItem);
    });
  }
  // =================================================================
  // YENİ GÖREV EKLEME VE SUNUCUYA KAYDETME (POST)
  // =================================================================
  if (taskForm) {
    taskForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const selectedPriority = document.querySelector(
        'input[name="priority"]:checked',
      );
      const priorityValue = selectedPriority
        ? selectedPriority.value
        : "medium";
      const newTask = {
        title: taskTitleInput.value,
        date: dueDateInput.value,
        priority: priorityValue,
        status: "Tamamlanmayan",
      };
      try {
        const response = await fetch("http://localhost:3000/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTask),
        });
        if (response.ok) {
          taskForm.reset();
          if (taskModal) {
            taskModal.style.display = "none";
            taskModal.classList.remove("active");
          }
          window.location.reload(); // Yeni veriyi çekmesi için sayfayı yenile
        } else {
          console.error("Görev eklenirken bir sunucu hatası oluştu.");
        }
      } catch (error) {
        console.error("Bağlantı hatası:", error);
      }
    });
  }
});

// --- DROPDOWN MENÜ YÖNETİMİ ---
window.toggleMenu = function (event, id) {
  event.stopPropagation(); // Tıklamanın dışarı taşmasını engeller
  const menu = document.getElementById(`dropdown-${id}`);
  const isVisible = menu.style.display === "block";
  // Önce ekrandaki tüm menüleri kapat
  document
    .querySelectorAll(".dropdown-menu")
    .forEach((m) => (m.style.display = "none"));
  // Tıklanan menü kapalıysa aç
  if (!isVisible) {
    menu.style.display = "block";
  }
};
// Ekranda boş bir yere tıklanınca açık kalan menüleri kapatır
document.addEventListener("click", () => {
  document
    .querySelectorAll(".dropdown-menu")
    .forEach((m) => (m.style.display = "none"));
});
// --- SİLME İŞLEMİ (DELETE) ---
window.deleteTask = async function (id) {
  // Yanlışlıkla silmelere karşı küçük bir onay kutusu
  if (!confirm("Bu görevi silmek istediğine emin misin?")) return;
  try {
    const response = await fetch(`http://localhost:3000/tasks/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      window.location.reload(); // Silince sayfayı günceller
    }
  } catch (error) {
    console.error("Silme işlemi başarısız:", error);
  }
};
// --- DÜZENLEME İŞLEMİ (MODALI DOLDURUR) ---
window.editTask = function (id, title, date, priority) {
  const modal = document.getElementById("taskModal");
  if (modal) modal.classList.add("active");
  // Başlığı değiştir
  const modalTitle = modal.querySelector(".modal-header h3");
  if (modalTitle) modalTitle.textContent = "Görev Güncelle";
  // Formdaki inputları var olan verilerle doldur
  document.getElementById("taskTitle").value = title;
  document.getElementById("dueDate").value = date;
  // Doğru öncelik butonunu (radio) seçili hale getir
  const priorityRadio = document.querySelector(
    `input[name="priority"][value="${priority}"]`,
  );
  if (priorityRadio) priorityRadio.checked = true;
  // Güncelleme isteği (PUT/PATCH) atarken hangi görevi güncelleyeceğimizi bilmek için ID'yi formda saklıyoruz
  const form = document.getElementById("newTaskForm");
  if (form) form.dataset.editId = id;
};
