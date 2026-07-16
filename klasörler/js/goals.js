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
} finally {
 // Yükleme işlemi tamamlandığında (başarılı veya başarısız) loading ekranını gizle
 hideLoader();
}
}
// İlerleme yüzdesine göre CSS sınıfı döndüren yardımcı fonksiyon
function getProgressClass(progress) {
if (progress <= 35) return "progress-red"; // Kırmızı (0-35)
if (progress <= 50) return "progress-orange"; // Sarı (36-50)
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
 // Dil seçeneğine göre yüzde (%) işaretinin yerini dinamik ayarla
 const percentText = (typeof currentLang !== "undefined" && currentLang === "en") ? `${goal.progress}%` : `%${goal.progress}`;
 const goalItem = `
<div class="card goal-item-card">
<div class="goal-top-row">
<div class="goal-icon-box">
<img src="assets/icons/goal.svg" alt="İkon" class="goal-icon">
</div>
<div class="dropdown-container">
<button class="more-options-btn" onclick="toggleMenu(event, '${goal.id}')">⋮</button>
<div id="dropdown-${goal.id}" class="dropdown-menu">
<button class="dropdown-item" onclick="editGoal('${goal.id}')" data-i18n="btn_edit">Düzenle</button>
<button class="dropdown-item delete-item" onclick="deleteGoal('${goal.id}')" data-i18n="btn_delete">Sil</button>
</div>
</div>
</div>
<h3 class="goal-title">${goal.title}</h3>
     ${goal.description ? `<p class="goal-desc">${goal.description}</p>` : ""}
<div class="goal-date-box">
<div class="date-row">
<img src="assets/icons/calendar1.svg" alt="Başlangıç" class="goal-icon">
<span><span data-i18n="label_start_prefix">Başlangıç:</span> ${goal.startDate}</span>
</div>
<div class="date-row">
<img src="assets/icons/calendar2.svg" alt="Bitiş" class="goal-icon">
<span><span data-i18n="label_end_prefix">Bitiş:</span> ${goal.endDate}</span>
</div>
</div>
<div class="progress-section ${colorClass}">
<div class="progress-info">
<span class="progress-label" data-i18n="label_progress">İLERLEME</span>
<span class="progress-percent">${percentText}</span>
</div>
<div class="progress-bar-bg">
<div class="progress-bar-fill" style="width: ${goal.progress}%;"></div>
</div>
</div>
</div>`;
  goalListElement.insertAdjacentHTML("beforeend", goalItem);
});
//Kartlar çizildikten sonra dil motorunu uyar
if (typeof setLanguage === "function") {
  setLanguage(currentLang);
}
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
     if (modalTitle) {
         modalTitle.textContent = "Yeni Hedef Oluştur";
         modalTitle.setAttribute("data-i18n", "modal_new_goal_title"); // Dili sıfırla
     }
     modal.classList.remove("active");
     fetchGoalsData(); // Sayfayı yenilemeden listeyi güncelle
   }
 } catch (error) {
   console.error("Kayıt hatası:", error);
 }
});
}
//sil e tıkladıktan sonra açıacak modal
let goalToDeleteId = null; // Hangi hedefin silineceğini aklında tutması için
//Sil butonuna basıldığında
window.deleteGoal = function (id) {
goalToDeleteId = id;
const deleteModal = document.getElementById("deleteGoalModal");
if (deleteModal) {
  deleteModal.style.display = "flex"; // Modalı göster
  deleteModal.classList.add("active");
}
};
// İptal butonuna basıldığında
window.closeDeleteGoalModal = function () {
goalToDeleteId = null;
const deleteModal = document.getElementById("deleteGoalModal");
if (deleteModal) {
  deleteModal.classList.remove("active");
  deleteModal.style.display = "none"; // Modalı gizle
}
};
// Evet, Sil kırmızı butonuna basıldığında
window.confirmDeleteGoal = async function () {
if (!goalToDeleteId) return;
try {
  const response = await fetch(`https://focustrack-pmxz.onrender.com/goals/${goalToDeleteId}`, {
    method: "DELETE",
  });
  if (response.ok) {
    window.closeDeleteGoalModal();
    fetchGoalsData(); // Sayfayı yenilemeden listeyi güncelle
  }
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
 if (modalTitle) {
     modalTitle.textContent = "Hedef Güncelle";
     modalTitle.setAttribute("data-i18n", "modal_update_goal"); // Çeviri motoruna bağlandı
     if (typeof setLanguage === "function") setLanguage(currentLang); // Anında çevir
 }
 // 4. Inputların içini veritabanından gelen verilerle doldur
 document.getElementById("goalTitle").value = goal.title;
 document.getElementById("goalDesc").value = goal.description;
 document.getElementById("goalStartDate").value = goal.startDate;
 document.getElementById("goalEndDate").value = goal.endDate;
 document.getElementById("goalProgress").value = goal.progress;
 // 5. Formun içine gizli bir şekilde ID'yi kaydet (Kaydet'e basılınca lazım olduğunda kullanmak için)
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
// Yükleme ekranını gizleyen yardımcı fonksiyon
function hideLoader() {
 const loader = document.getElementById("loadingScreen");
 if (loader) {
   loader.classList.add("hidden");
 }
}