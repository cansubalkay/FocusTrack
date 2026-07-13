document.addEventListener("DOMContentLoaded", () => {
  // Sayfa yüklenince dashboard verilerini çekmeye başla
  fetchDashboardData();
});

// async, fonksiyonun içinde bekleme gerektiren işler var anlamına gelir.
async function fetchDashboardData() {
  try {
    // json/index.json dosyasından veriyi alıyoruz. await, fetch işlemi bitene kadar bir sonraki satıra geçmez
    const response = await fetch("./json/index.json");

    if (!response.ok) {
      throw new Error(`Veri çekilemedi! Hata Kodu: ${response.status}`);
    }
    // dosyadan gelen veri bir string yığınıdır. .json() komutu jsnin anlayacağı json formatına çevirir
    const data = await response.json();

    // Verileri ilgili HTML elemanlarına yazdıran fonksiyonları çağırıyoruz(render-dağıtım fonkları)
    renderUser(data.user); //kullanıcı bilgilerini günceller
    renderStats(data.stats); // istatistikleri günceller
    renderTasks(data.todayTasks); // görevleri günceller
    renderGoals(data.monthlyGoals); // hedefleri günceller
  } catch (error) {
    console.error("Dashboard verisi yüklenirken hata oluştu:", error);
  }
}

//Kullanıcı Selamlamasını Ekrana Basma
function renderUser(user) {
  const greetingElement = document.getElementById("user-greeting");

  if (greetingElement && user.name) {
    // ikisi de mevcutsa işlemi yapmak için kontrol
    greetingElement.textContent = `Merhaba ${user.name} 👋`; //html içeriği ters tırnaklar sayesinde yazılır
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

    const statCard = `
<div class="card stat-card">
<div class="stat-top">
<img src="assets/icons/${stat.icon}" alt="${stat.title}">
<span class="stat-badge ${stat.colorClass}">${stat.badge}</span>
</div>
<div class="stat-info">
<h3>${stat.title}</h3>
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
   // DİKKAT: O upuzun "style=" kısımlarını sildik! Tasarımı tamamen dashboard.css dosyasına bıraktık.
   // Sadece dinamik olan "width" (genişlik) değerini mecburen inline bırakıyoruz.
   const goalItem = `
<div class="goal-row">
<div class="goal-info">
<span class="goal-name">${goal.title}</span>
<span class="goal-percent">%${goal.progress}</span>
</div>
<div class="dash-progress-bg">
<div class="dash-progress-fill" style="width: ${goal.progress}%;"></div>
</div>
</div>
   `;
   goalListElement.insertAdjacentHTML("beforeend", goalItem);
 });
}