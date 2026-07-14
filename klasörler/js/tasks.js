// TASKS SAYFASININ JS KODLARI
//bunun sayesinde önce HTML sayfası yukarıdan aşağı doğru tamamen yüklenir. Aksi olur da tam yüklenmeden
//JS çalışırsa ekrandaki butonu bulmaya çalışır ve bulamazsa hata verir.
document.addEventListener("DOMContentLoaded", async () => {
  // 1. Değişkenler ve Seçiciler
  // document.getelementById vs; js ile html arası bağlantıları kurmaya yarar.
  let allTasks = []; // Bütün verinin tutulacağı kısa süreli hafıza
  const container = document.getElementById("tasks-container");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const taskForm = document.getElementById("newTaskForm");
  const taskTitleInput = document.getElementById("taskTitle");
  const dueDateInput = document.getElementById("dueDate");
  const taskModal = document.getElementById("taskModal");
  const searchInput = document.getElementById("searchInput"); // Arama çubuğu seçicisi
  // VERİLERİ SUNUCUDAN ÇEKME (GET)
  // async ve await sayesinde istenen gelmeden bir sonrki satıra geçilmez
  // her şey doğru çalışırsa try bloğu çalışır aksi takdirde catch erroru devreye girer.
  async function fetchTasksData() {
    try {
      const response = await fetch("https://focustrack-pmxz.onrender.com/tasks");
      if (!response.ok) throw new Error(`Hata: ${response.status}`);
      const data = await response.json();
      allTasks = data; // Arama yapmak için veriyi hafızaya alıyoruz
      renderTasks(allTasks); // İlk açılışta tüm veriyi ekrana basıyoruz
    } catch (error) {
      console.error("Task verisi yüklenirken hata oluştu:", error);
    }
  }

  // aRAMA CUBUGU VE DEBOUNCE*
  // debounce fonku sayesinde her harf yazıldığında sistem arama yapıp yorulmayacak
  function debounce(callback, delay = 300) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        callback(...args);
      }, delay);
    };
  }
  // Baslşga gore aramanın mantığı
  function searchByTitle(searchText) {
    const normalizedSearchText = searchText.trim().toLowerCase();
    if (!normalizedSearchText) {
      renderTasks(allTasks);
      return;
    }
    const filteredData = allTasks.filter((task) =>
      // includes jsde içinde geçiyor mu mantığıdır.
      task.title.toLowerCase().includes(normalizedSearchText),
    );
    renderTasks(filteredData);
  }
  // Arama çubuğu varsa dinleyiciyi ekle
  if (searchInput) {
    const debouncedSearch = debounce(function (event) {
      searchByTitle(event.target.value);
    }, 300);
    searchInput.addEventListener("input", debouncedSearch);
  }

  // FİLTRELEME MANTIĞI
  filterButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const filterType = e.target.textContent.trim();
      let filteredTasks = [];
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

  // GÖREV KARTLARINI EKRANA BASAN FONKSİYON (RENDER)
  function renderTasks(tasksArray) {
    if (!container) return;
    container.innerHTML = ""; // Önce içini temizle
    tasksArray.forEach((task) => {
      // Tamamlanma durumuna göre CSS class'larını belirle
      const completedClass =
        task.status === "Tamamlandı" ? "completed-card" : "";
      // CSS'indeki öncelik rozet renklerini eşleştiriyoruz
      let priorityClass = "normal-priority";
      if (task.priority === "low") {
        priorityClass = "low-priority";
      } else if (task.priority === "high") {
        priorityClass = "high-priority";
      }
      if (task.priority === "completed" || task.status === "Tamamlandı") {
        priorityClass = "completed-priority";
      }
      // CSS yapınla birebir uyumlu HTML şablonu
      const taskItem = `
<div class="card task-item-card ${completedClass}">
<div class="task-card-header">
<span class="badge ${priorityClass}">${task.priority === "high" ? "Yüksek" : task.priority === "medium" ? "Orta" : "Düşük"}</span>
<div class="dropdown-container">
<button class="more-options-btn" onclick="toggleMenu(event, '${task.id}')">⋮</button>
<div id="dropdown-${task.id}" class="dropdown-menu">
<button class="dropdown-item" onclick="editTask('${task.id}', '${task.title}', '${task.date}', '${task.priority}')">Düzenle</button>
<button class="dropdown-item delete-item" onclick="testSil('${task.id}')">Sil</button>
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
<button class="complete-btn ${task.status === 'Tamamlandı' ? 'done' : ''}" onclick="toggleTaskCompletion('${task.id}', '${task.status}')">
<span class="circle-icon">
         ${task.status === 'Tamamlandı' ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>' : ''}
</span>
       ${task.status === 'Tamamlandı' ? 'Bitti' : 'Tamamla'}
</button>
</div>
</div>
    `;
      container.insertAdjacentHTML("beforeend", taskItem);
    });
  }
  // YENİ GÖREV EKLEME VE SUNUCUYA KAYDETME (POST)
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
      // Formda bir editId var mı kontrol et
      const editId = taskForm.dataset.editId;
      // Eğer editId varsa PUT (Güncelle), yoksa POST (Yeni Ekle)
      const method = editId ? "PUT" : "POST";
      const url = editId
        ? `https://focustrack-pmxz.onrender.com/${editId}`
        : "https://focustrack-pmxz.onrender.com/tasks";
      try {
        const response = await fetch(url, {
          method: method, // Dinamik olark metod belrilenrir put veya post
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTask),
        });
        if (response.ok) {
          taskForm.reset();
          // İşlem bitince formdaki gizli ID'yi ve başlığı temizle
          delete taskForm.dataset.editId;

          if (taskModal) {
            taskModal.style.display = "none";
            taskModal.classList.remove("active");
            // başlığı sıfırla (yeni gorev eklencekmis gibi)
            const modalTitle = taskModal.querySelector(".modal-header h3");
            if (modalTitle) modalTitle.textContext = "Yeni Görev";
          }
          window.location.reload();
        } else {
          console.error("Görev eklenirken bir sunucu hatası oluştu.");
        }
      } catch (error) {
        console.error("Bağlantı hatası:", error);
      }
    });
  }
  // Sayfa yüklendiğinde verileri çekme fonksiyonunu başlat (Burası kritik!)
  fetchTasksData();
});
// DROPDOWN MENÜ YÖNETİmi
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

// --- GÖREV TAMAMLANDI DURUMUNU GÜNCELLEME (PATCH) ---

window.toggleTaskCompletion = async function (id, currentStatus) {

  try {

    // Eğer durum zaten "Tamamlandı" ise geri al ("Devam Ediyor" yap), değilse "Tamamlandı" yap.

    const newStatus = currentStatus === "Tamamlandı" ? "Devam Ediyor" : "Tamamlandı";

    const response = await fetch(`https://focustrack-pmxz.onrender.com/tasks/${id}`, {

      method: "PATCH",

      headers: {

        "Content-Type": "application/json",

      },

      // Sadece 'status' alanını yeni durumla güncelliyoruz

      body: JSON.stringify({ status: newStatus }), 

    });

    if (response.ok) {

      window.location.reload(); // Kartın yeni tasarımla çizilmesi için sayfayı yenile

    }

  } catch (error) {

    console.error("Görev güncellenirken hata:", error);

  }

};
 

// SİLME İŞLEMİ DELET
window.testSil = function (id) {

  taskToDeleteId = id; 

  const deleteModal = document.getElementById("deleteModal");

  // DEDEKTİF KONTROLÜ: Modal gerçekten HTML'de var mı?

  if (!deleteModal) {

    alert("DİKKAT: JavaScript çalışıyor ama HTML dosyasında 'deleteModal' isimli kutuyu bulamıyor! HTML kodunu silmiş olabiliriz.");

    return;

  }

  deleteModal.style.display = "flex"; // CSS engellerini ezip zorla göster

  deleteModal.classList.add("active"); 

};
 
// "İptal" butonuna basıldığında
window.closeDeleteModal = function () {
 taskToDeleteId = null;
 const deleteModal = document.getElementById("deleteModal");
 if (deleteModal) {
   deleteModal.classList.remove("active"); // Modalı gizle
 }
};
// "Evet, Sil" kırmızı butonuna basıldığında
window.confirmDelete = async function () {
 if (!taskToDeleteId) return;
 try {
   const response = await fetch(`https://focustrack-pmxz.onrender.com/tasks/${taskToDeleteId}`, {
     method: "DELETE",
   });
   if (response.ok) {
     window.closeDeleteModal();
     window.location.reload();
   }
 } catch (error) {
   console.error("Silme işlemi başarısız:", error);
 }
};
// DÜZENLEME İŞLEMİ (MODALI DOLDUR
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
