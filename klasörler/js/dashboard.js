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

//Bugünün Görevlerini Ekrana Basma
function renderTasks(tasksArray) {
  // bu fonk. Görev listesini barındıran tasksArray dizisini girdi olarak alır.
  const taskListElement = document.getElementById("dashboard-task-list");

  if (!taskListElement) return;

  taskListElement.innerHTML = ""; // Önce içini temizle ki üst üste binmesin

  //taskin yapılıp yapılmadığını kontrol eder yapıldıysa işaretlenir yoksa boş kalır.
  tasksArray.forEach((task) => {
    const isChecked = task.completed ? "checked" : "";

    // Aşağıdaki html bloğu; her bir görev için liste elemanı (<li>) şablonu oluşturur. Görev tamamlandıysa
    // sınıfına completed ekler (böylece CSS ile üstü çizilebilir). Checkbox kısmına da belirlediğimiz checked durumunu koyar.
    const taskItem = `
<li class="task-item ${task.completed ? "completed" : ""}">
<label>
<input type="checkbox" ${isChecked}>
<span>${task.title}</span>
</label>
</li>

        `;

    taskListElement.insertAdjacentHTML("beforeend", taskItem);
  });
}

//Bu fonk aylık hedefleri ve yüzdelerini gösteren ilerleme çubuklarını (progress bar) ekrana basar
function renderGoals(goalsArray) {
  const goalListElement = document.getElementById("dashboard-goal-list");
  if (!goalListElement) return;
  goalListElement.innerHTML = ""; // Önce içini temizle
  goalsArray.forEach((goal) => {
    const goalItem = `
            <li class="goal-item" style="list-style: none; margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span class="dash-goal-title" style="font-weight: 600; color: font-size: 14px;">${goal.title}</span>
                    <span class="dash-goal-percent" style="font-weight: 700; font-size: 14px;">%${goal.progress}</span>
                </div>
                <div class="dash-progress-track" style="width: 100%; height: 8px; border-radius: 10px; overflow: hidden;">
                    <div class="dash-progress-fill" style="width: ${goal.progress}%; height: 100%; border-radius: 10px; transition: width 0.5s ease-in-out;"></div>
                </div>
            </li>
        `;
    goalListElement.insertAdjacentHTML("beforeend", goalItem);
  });
}
