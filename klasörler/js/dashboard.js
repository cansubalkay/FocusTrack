document.addEventListener("DOMContentLoaded", () => {
 // Sayfa yüklenince dashboard verilerini çekmeye başla
 fetchDashboardData();
 // DİNAMİK CHECKBOX KONTROLÜ
 // Görevler sonradan (API'den) geldiği için tıklama olayını ana kapsayıcıya (parent) veriyoruz.
 const taskListElement = document.getElementById("dashboard-task-list");
 if (taskListElement) {
   taskListElement.addEventListener("change", async (e) => {
     // Sadece custom-checkbox sınıfına sahip bir şeye tıklandıysa çalış
     if (e.target.classList.contains("custom-checkbox")) {
       const taskRow = e.target.closest(".task-row"); // Tıklanan kutunun ana kapsayıcısını bul
       const taskId = e.target.getAttribute("data-id"); // Tıklanan görevin ID'sini al
       const isChecked = e.target.checked;
       const newStatus = isChecked ? "Tamamlandı" : "Devam Ediyor"; // Yeni durumu belirle
       if (isChecked) {
         taskRow.classList.add("completed"); // Seçiliyse üstünü çiz
       } else {
         taskRow.classList.remove("completed"); // Seçimi kalktıysa çiziği kaldır
       }
       // Veritabanına anlık güncelleme (PATCH) isteği at
       if (taskId) {
         try {
           await fetch(`https://focustrack-pmxz.onrender.com/tasks/${taskId}`, {
             method: "PATCH",
             headers: { "Content-Type": "application/json" },
             body: JSON.stringify({ status: newStatus })
           });
         } catch (error) {
           console.error("Görev güncellenirken hata oluştu:", error);
         }
       }
     }
   });
 }
});
async function fetchDashboardData() {
 try {
   // 1 İstatistik İskeleti ve Kullanıcı Bilgisi
   const statRes = await fetch("./json/index.json");
   let baseStats = []; // JSON'daki ikonları ve başlıkları bozmamak için burada tut
   if (statRes.ok) {
     const data = await statRes.json();
     renderUser(data.user);
     baseStats = data.stats; // İstatistik yapısını al ama henüz ekrana basma
   }
   //  2 DİNAMİK GÖREVLERİ ÇEK
   const tasksRes = await fetch("https://focustrack-pmxz.onrender.com/tasks");
   let allTasks = [];
   if (tasksRes.ok) {
     allTasks = await tasksRes.json();
     // Görevleri tarihe göre sırala ve ilk 3 tanesini ekrana bas
     const upcomingTasks = [...allTasks]
       .sort((a, b) => new Date(a.date) - new Date(b.date))
       .slice(0, 3);
     renderTasks(upcomingTasks);
   }
   // 3 DİNAMİK HEDEFLERİ ÇEK

    const goalsRes = await fetch("https://focustrack-pmxz.onrender.com/goals");

    let allGoals = [];

    if (goalsRes.ok) {

      allGoals = await goalsRes.json();

      const currentMonth = new Date().getMonth() + 1;

      const currentYear = new Date().getFullYear();

      // Sadece bu ayın hedeflerini filtrele (Bitiş tarihine - endDate - göre)

      const monthlyGoals = [...allGoals].filter(goal => {

        // Eğer hedefin bitiş tarihi yoksa ana sayfaya alma

        if (!goal.endDate) return false; 

        // Bitiş tarihini yıl, ay, gün olarak parçala (Örn: "2026-05-08")

        const [year, month] = goal.endDate.split("-");

        // Yıl ve ay şu anki yıl/ay ile eşleşiyorsa listeye al

        return parseInt(year) === currentYear && parseInt(month) === currentMonth;

      })

      .sort((a,b) => b.progress - a.progress)

      .slice(0, 3);

      renderGoals(monthlyGoals);

    }
 
   // 4 CANLI İSTATİSTİKLER
   // Görev hesaplamaları
   const completedTasksCount = allTasks.filter(task => task.status === "Tamamlandı").length;
   const pendingTasksCount = allTasks.length - completedTasksCount;
   // Hedef hesaplamaları (progress 100 ise bitti, altındaysa bekliyor)
   const completedGoalsCount = allGoals.filter(goal => Number(goal.progress) === 100).length;
   const pendingGoalsCount = allGoals.length - completedGoalsCount;
   // Genel Toplamlar
   const totalCount = allTasks.length + allGoals.length;
   const totalCompleted = completedTasksCount + completedGoalsCount;
   const totalPending = pendingTasksCount + pendingGoalsCount;
   // Elimizdeki baseStats array'inin sadece "value" (sayı) kısımlarını canlı verilerle değiştir
   if (baseStats.length === 3) {
     baseStats[0].value = totalCount;        // Total
     baseStats[1].value = totalCompleted;    // Completed
     baseStats[2].value = totalPending;      // Pending
     // Sayılar güncellendiğinde ekrana çiz
     renderStats(baseStats);
   }
   // API'den dinamik veriler gelip HTML oluştuktan sonra dil motorunu tekrar tetikle
   if (typeof setLanguage === "function") {
     setLanguage(currentLang);
   }
 } catch (error) {
   console.error("Dashboard verisi yüklenirken hata oluştu:", error);
 } finally {
   // Yükleme işlemi tamamlandığında (başarılı veya başarısız) loading ekranını gizle
   hideLoader();
 }
}
//Kullanıcı Selamlamasını Ekrana Basma
function renderUser(user) {
const greetingElement = document.getElementById("user-greeting");
if (greetingElement && user.name) {
  // ikisi de mevcutsa işlemi yapmak için kontrol
  // html içeriği ters tırnaklar sayesinde yazılır
  //textContent yerine innerHTML kullanarak Merhaba span'ının silinmesi düzeldl
  greetingElement.innerHTML = `<span data-i18n="greeting">Merhaba</span> ${user.name} 👋`;
}
}
//İstatistik Kartlarını Ekrana Basma
function renderStats(statsArray) {
// statsArray adında istatistikleri liste halinde tutan bir array alır
const statsContainer = document.getElementById("stats-container");
if (!statsContainer) return;
statsContainer.innerHTML = ""; //içini temizle yoksa her yenilemede üst üste biner
// İstatistik listesindeki her bir öğe -stat için sırayla bir döngü başlatır. Her stat için aşağıdaki işlemleri tekrar eder
statsArray.forEach((stat) => {
 // HTML'indeki card yapısına uygun olarak oluştur
// Gelen İngilizce/Türkçe başlık ve rozet değerlerini dil anahtarlarıyla eşleştir
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
 // ana kutunun içine mevcut içeriklerin en sonuna gelecek şekilde (beforeend) yerleşir
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
 // task.completed yerine API'deki 'status' alanını kontrol ediyoruz
 const isCompleted = task.status === "Tamamlandı";
 const isChecked = isCompleted ? "checked" : "";
 //  Önceki <li> yapısını sildim. Yeni CSS sınıflarına uygun <label> şablonunu kullanılıyo
 //input'un içine 'data-id="${task.id}"' eklendi ki hangi göreve tıklandığı anlaşılsın
 const taskItem = `
<label class="task-row ${isCompleted ? "completed" : ""}">
<input type="checkbox" class="custom-checkbox" data-id="${task.id}" ${isChecked}>
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
 // goals.css e uyumlu class ataması
 let statusClass = "progress-red"; // 0-35 arası için Kırmızı
 if (goal.progress >= 76) {
     statusClass = "progress-green"; // 76-100 Yeşil
 } else if (goal.progress >= 51) {
     statusClass = "progress-blue"; // 51-75 Mavi
 } else if (goal.progress >= 36) {
     statusClass = "progress-orange"; // 36-50 Turuncu
 }
 // Dil seçeneğine göre yüzde (%) işaretinin yerini dinamik ayarla
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
// Yükleme ekranını gizleyen yardımcı fonksiyon
function hideLoader() {
 const loader = document.getElementById("loadingScreen");
 if (loader) {
   loader.classList.add("hidden");
 }
}