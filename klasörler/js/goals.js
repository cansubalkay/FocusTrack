document.addEventListener("DOMContentLoaded", () => {
  fetchGoalsData();
  setupFormSubmit();
});
async function fetchGoalsData() {
  try {
    const response = await fetch("https://focustrack-pmxz.onrender.com/goals");
    if (!response.ok) throw new Error(`Hata: ${response.status}`);
    const data = await response.json();
    renderGoals(data);
  } catch (error) {
    console.error("Goals verisi yüklenirken hata oluştu:", error);
  }
}
// İlerleme yüzdesine göre CSS sınıfı döndüren yardımcı fonksiyon
function getProgressClass(progress) {
 if (progress <= 35) return "progress-red"; // Kırmızı (0-35)
 if (progress <= 50) return "progress-orange"; // Turuncumsu Sarı (36-50)
 if (progress <= 75) return "progress-blue"; // Mavi (51-75)
 return "progress-green"; // Yeşil (76-100)
}
function renderGoals(goalsArray) {
 const goalListElement = document.getElementById("goals-container");
 if (!goalListElement) return;
 goalListElement.innerHTML = "";
 goalsArray.forEach((goal) => {
   // Dinamik renk yönetimi
   const colorClass = getProgressClass(goal.progress); // İsim colorClass olarak düzeltildi
   const goalItem = `
<div class="card goal-item-card">
<div class="goal-top-row">
<div class="goal-icon-box">
<img src="assets/icons/goal.svg" alt="İkon" class="goal-icon">
</div>
<div class="dropdown-container">
<button class="more-options-btn" onclick="toggleMenu(event, '${goal.id}')">⋮</button>
<div id="dropdown-${goal.id}" class="dropdown-menu">
<button class="dropdown-item" onclick="editGoal('${goal.id}')">Düzenle</button>
<button class="dropdown-item delete-item" onclick="deleteGoal('${goal.id}')">Sil</button>
</div>
</div>
</div>
<h3 class="goal-title">${goal.title}</h3>
       ${goal.description ? `<p class="goal-desc">${goal.description}</p>` : ""}
<div class="goal-date-box">
<div class="date-row">
<img src="assets/icons/calendar1.svg" alt="Başlangıç" class="goal-icon">
<span>Başlangıç: ${goal.startDate}</span>
</div>
<div class="date-row">
<img src="assets/icons/calendar2.svg" alt="Bitiş" class="goal-icon">
<span>Bitiş: ${goal.endDate}</span>
</div>
</div>
<div class="progress-section ${colorClass}">
<div class="progress-info">
<span class="progress-label">İLERLEME</span>
<span class="progress-percent">${goal.progress}%</span>
</div>
<div class="progress-bar-bg">
<div class="progress-bar-fill" style="width: ${goal.progress}%;"></div>
</div>
</div>
</div>`;
    goalListElement.insertAdjacentHTML("beforeend", goalItem);
  });
}



// 3. Formu Yakala ve Sunucuya Gönder (Ekleme ve Güncelleme)
function setupFormSubmit() {
 const goalForm = document.getElementById("newGoalForm");
 const modal = document.getElementById("goalModal");
 if (!goalForm) return;
 goalForm.addEventListener("submit", async (e) => {
   e.preventDefault();
   const newGoal = {
     title: document.getElementById("goalTitle").value,
     description: document.getElementById("goalDesc").value,
     startDate: document.getElementById("goalStartDate").value,
     endDate: document.getElementById("goalEndDate").value,
     progress: Number(document.getElementById("goalProgress").value),
     icon: "target.svg",
   };
   // Formda bir editId var mı kontrol et
   const editId = goalForm.dataset.editId;
   // Eğer editId varsa PUT (Güncelle), yoksa POST (Yeni Ekle)
   const method = editId ? "PUT" : "POST";
   const url = editId ? `https://focustrack-pmxz.onrender.com/goals/${editId}` : "https://focustrack-pmxz.onrender.com/goals";
   try {
     const response = await fetch(url, {
       method: method,
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify(newGoal),
     });
     if (response.ok) {
       goalForm.reset();
       // İşlem bitince formdaki gizli ID'yi ve başlığı temizle
       delete goalForm.dataset.editId;
       const modalTitle = modal.querySelector(".modal-header h3");
       if (modalTitle) modalTitle.textContent = "Yeni Hedef Oluştur";
       modal.classList.remove("active");
       fetchGoalsData(); // Sayfayı yenilemeden listeyi güncelle
     }
   } catch (error) {
     console.error("Kayıt hatası:", error);
   }
 });
}

window.deleteGoal = async function (id) {
  if (!confirm("Bu hedefi silmek istediğine emin misin?")) return;

  try {
    const response = await fetch(`https://focustrack-pmxz.onrender.com/goals/${id}`, {
      method: "DELETE",
    });

    if (response.ok) fetchGoalsData(); // Listeyi güncelle
  } catch (error) {
    console.error("Silme hatası:", error);
  }
};

window.editGoal = async function (id) {
 try {
   // 1. Tıklanan hedefin mevcut verilerini veritabanından çek
   const response = await fetch(`https://focustrack-pmxz.onrender.com/goals/${id}`);
   const goal = await response.json();
   // 2. Modalı bul ve aç
   const modal = document.getElementById("goalModal");
   if (modal) modal.classList.add("active");
   // 3. Modal başlığını "Güncelle" olarak değiştir
   const modalTitle = modal.querySelector(".modal-header h3");
   if (modalTitle) modalTitle.textContent = "Hedef Güncelle";
   // 4. Inputların içini veritabanından gelen verilerle doldur
   document.getElementById("goalTitle").value = goal.title;
   document.getElementById("goalDesc").value = goal.description;
   document.getElementById("goalStartDate").value = goal.startDate;
   document.getElementById("goalEndDate").value = goal.endDate;
   document.getElementById("goalProgress").value = goal.progress;
   // 5. Formun içine gizli bir şekilde ID'yi kaydet (Kaydet'e basılınca lazım olcak)
   const form = document.getElementById("newGoalForm");
   if (form) form.dataset.editId = id;
 } catch (error) {
   console.error("Veri çekme hatası:", error);
 }
};

// DROPDOWN MENÜ
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


