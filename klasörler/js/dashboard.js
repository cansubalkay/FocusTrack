document.addEventListener("DOMContentLoaded", () => {
// Sayfa yüklenince dashboard verilerini çekmeye başla
fetchDashboardData();
// DİNAMİK CHECKBOX KONTROLÜ (Event Delegation)
// Görevler sonradan (API'den) geldiği için tıklama olayını ana kapsayıcıya (parent) veriyoruz.
const taskListElement = document.getElementById("dashboard-task-list");
if (taskListElement) {
  taskListElement.addEventListener("change", (e) => {
    // Sadece custom-checkbox sınıfına sahip bir şeye tıklandıysa çalış
    if (e.target.classList.contains("custom-checkbox")) {
      const taskRow = e.target.closest(".task-row"); // Tıklanan kutunun ana kapsayıcısını bul
      if (e.target.checked) {
        taskRow.classList.add("completed"); // Seçiliyse üstünü çiz
      } else {
        taskRow.classList.remove("completed"); // Seçimi kalktıysa çiziği kaldır
      }
    }
  });
}
});
async function fetchDashboardData() {
try {
  // 1. İstatistikler ve Kullanıcı Bilgisi (Mevcut index.json'dan gelmeye devam edebilir)
  const statRes = await fetch("./json/index.json");
  if (statRes.ok) {
    const data = await statRes.json();
    renderUser(data.user);
    renderStats(data.stats);
  }
  // --- 2. DİNAMİK GÖREVLER (En Yakın 3 Görev) ---
  // Gerçek görevleri json-server'dan çekiyoruz
  const tasksRes = await fetch("https://focustrack-pmxz.onrender.com/tasks");
  if (tasksRes.ok) {
    const allTasks = await tasksRes.json();
    // Görevleri tarihe göre sırala (en yakın tarih en üste gelir) ve ilk 3 tanesini al (slice)
    const upcomingTasks = allTasks
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 3);
    renderTasks(upcomingTasks);
  }
  // --- 3. DİNAMİK HEDEFLER (Bu Ayki 3 Hedef) ---
  const goalsRes = await fetch("https://focustrack-pmxz.onrender.com/goals");
  if (goalsRes.ok) {
    const allGoals = await goalsRes.json();
    const currentMonth = new Date().getMonth() + 1; // JS'de aylar 0'dan başlar, o yüzden +1 ekliyoruz
    const currentYear = new Date().getFullYear();
    // Sadece içinde bulunduğumuz ay ve yıla ait hedefleri filtrele
    const monthlyGoals = allGoals.filter(goal => {
      if (!goal.date) return true; // Eğer db.json'da hedefin tarihi yoksa varsayılan olarak göster
      const [year, month] = goal.date.split("-"); // "2026-07-20" formatını bölüyoruz
      return parseInt(year) === currentYear && parseInt(month) === currentMonth;
    })
    .sort((a,b) => b.progress - a.progress) //Yüksek yüzdesi olan en üste gelsindiye
    .slice(0, 3); // İlk 3'ünü al
    renderGoals(monthlyGoals);
  }
  // 💡 YENİ EKLEME: API'den dinamik veriler gelip HTML oluştuktan sonra dil motorunu tekrar tetikliyoruz
  if (typeof setLanguage === "function") {
    setLanguage(currentLang);
  }
} catch (error) {
  console.error("Dashboard verisi yüklenirken hata oluştu:", error);
}
}
//Kullanıcı Selamlamasını Ekrana Basma
function renderUser(user) {
 const greetingElement = document.getElementById("user-greeting");
 if (greetingElement && user.name) {
   // ikisi de mevcutsa işlemi yapmak için kontrol
   // html içeriği ters tırnaklar sayesinde yazılır
   // 💡 GÜNCELLEME: textContent yerine innerHTML kullanarak Merhaba span'ının silinmesini engelledik
   greetingElement.innerHTML = `<span data-i18n="greeting">Merhaba</span> ${user.name} 👋`;
 }
}
//İstatistik Kartlarını Ekrana Basma
function renderStats(statsArray) {
// statsArray adında, istatistikleri liste halinde tutan bir dizi (array) alır
const statsContainer = document.getElementById("stats-container");
if (!statsContainer) return;
statsContainer.innerHTML = ""; //içini temizle yoksa her yenilemede üst üste biner
// İstatistik listesindeki her bir öğe (stat) için sırayla bir döngü başlatır. Her öğe için aşağıdaki işlemleri tekrar eder.
statsArray.forEach((stat) => {
  // HTML'indeki card yapısına uygun olarak oluşturuluyor
  // 💡 GÜNCELLEME: Gelen ham İngilizce/Türkçe başlık ve rozet değerlerini dil anahtarlarıyla eşleştiriyoruz
  let titleKey = "";
  if (stat.title === "Toplam" || stat.title === "Total Tasks" || stat.title === "Total") {
    titleKey = "stat_total";
  } else if (stat.title === "Tamamlanan" || stat.title === "Completed") {
    titleKey = "stat_completed";
  } else if (stat.title === "Bekleyen" || stat.title === "Pending") {
    titleKey = "stat_pending";
  }
  let badgeKey = "";
  if (stat.badge === "All Time" || stat.badge === "Tüm Zamanlar") {
    badgeKey = "badge_all_time";
  } else if (stat.badge === "Completed" || stat.badge === "Tamamlandı") {
    badgeKey = "badge_completed";
  } else if (stat.badge === "Pending" || stat.badge === "Bekliyor") {
    badgeKey = "badge_pending";
  }
  const statCard = `
<div class="card stat-card">
<div class="stat-top">
<img src="assets/icons/${stat.icon}" alt="${stat.title}">
<span class="stat-badge ${stat.colorClass}" data-i18n="${badgeKey}">${stat.badge}</span>
</div>
<div class="stat-info">
<h3 data-i18n="${titleKey}">${stat.title}</h3>
<p class="stat-value">${stat.value}</p>
</div>
</div>
       `;
  // ana kutunun içine, mevcut içeriklerin en sonuna gelecek şekilde (beforeend) yerleştirir.
  statsContainer.insertAdjacentHTML("beforeend", statCard);
});
}
// Bugünün Görevlerini Ekrana Basma
function renderTasks(tasksArray) {
const taskListElement = document.getElementById("dashboard-task-list");
if (!taskListElement) return;
taskListElement.innerHTML = ""; // Önce içini temizle ki üst üste binmesin
// taskin yapılıp yapılmadığını kontrol eder, yapıldıysa işaretlenir yoksa boş kalır.
tasksArray.forEach((task) => {
  const isChecked = task.completed ? "checked" : "";
  // DİKKAT: Eski <li> yapısını sildik. Yeni CSS sınıflarımıza uygun <label> şablonunu kullanıyoruz.
  const taskItem = `
<label class="task-row ${task.completed ? "completed" : ""}">
<input type="checkbox" class="custom-checkbox" ${isChecked}>
<span class="task-text">${task.title}</span>
</label>
  `;
  taskListElement.insertAdjacentHTML("beforeend", taskItem);
});
}
// Bu fonk aylık hedefleri ve yüzdelerini gösteren ilerleme çubuklarını (progress bar) ekrana basar
function renderGoals(goalsArray) {
const goalListElement = document.getElementById("dashboard-goal-list");
if (!goalListElement) return;
goalListElement.innerHTML = ""; // Önce içini temizle
goalsArray.forEach((goal) => {
  // Fotoğraftaki goals.css mantığına göre tam uyumlu class ataması
  let statusClass = "progress-red"; // 0-35 arası için varsayılan (Kırmızı)
  if (goal.progress >= 76) {
      statusClass = "progress-green"; // 76-100 Yeşil
  } else if (goal.progress >= 51) {
      statusClass = "progress-blue"; // 51-75 Mavi
  } else if (goal.progress >= 36) {
      statusClass = "progress-orange"; // 36-50 Turuncu
  }
  // 💡 GÜNCELLEME: Dil seçeneğine göre yüzde (%) işaretinin yerini dinamik ayarlıyoruz
  const percentText = (typeof currentLang !== "undefined" && currentLang === "en") ? `${goal.progress}%` : `%${goal.progress}`;
  const goalItem = `
<div class="goal-row">
<div class="goal-info">
<span class="goal-name">${goal.title}</span>
<span class="goal-percent ${statusClass}">${percentText}</span>
</div>
<div class="dash-progress-bg">
<div class="dash-progress-fill ${statusClass}" style="width: ${goal.progress}%;"></div>
</div>
</div>
  `;
  goalListElement.insertAdjacentHTML("beforeend", goalItem);
});
}