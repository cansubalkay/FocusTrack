document.addEventListener("DOMContentLoaded", () => {
  // Sayfa yüklenince dashboard verilerini çekmeye başla
  fetchGoalsData();
});

// async, fonksiyonun içinde bekleme gerektiren işler var anlamına gelir.
async function fetchGoalsData() {
  try {
    // json/tasks.json dosyasından veriyi alıyoruz. await, fetch işlemi bitene kadar bir sonraki satıra geçmez
    const response = await fetch("./json/goals.json");

    if (!response.ok) {
      throw new Error(`Veri çekilemedi! Hata Kodu: ${response.status}`);
    }
    // dosyadan gelen veri bir string yığınıdır. .json() komutu jsnin anlayacağı json formatına çevirir
    const data = await response.json();

    // Verileri ilgili HTML elemanlarına yazdıran fonksiyonları çağırıyoruz(render-dağıtım fonkları)
    renderGoals(data.goals); //task kartlarını günceller
  } catch (error) {
    console.error("Goals verisi yüklenirken hata oluştu:", error);
  }
}

//Task kartlarını ekrana basan fonksiyon
function renderGoals(goalsArray) {
  const goalListElement = document.getElementById("goals-container");
  if (!goalListElement) return;

  goalListElement.innerHTML = ""; // Önce içini temizle ki üst üste binmesin

  //taskin yapılıp yapılmadığını kontrol eder yapıldıysa işaretlenir yoksa boş kalır.
  goalsArray.forEach((goal) => {
    //CSSin kullanıcağı html  şablonu

    const goalItem = `
    <div class="card goal-item-card">

        <!-- 1. Üst Alan (İkon ve Menü) -->
        <div class="goal-top-row">
          <div class="goal-icon-box">
            <img src="assets/icons/${goal.icon}" alt="İkon" class="goal-icon">
          </div>
          <button class="more-options-btn">⋮</button>
        </div>
        <!-- 2. Başlık ve Açıklama -->
        <h3 class="goal-title">${goal.title}</h3>
        ${goal.description ? `<p class="goal-desc">${goal.description}</p>` : ""}

        <!-- 3. Tarih Kutusu (Başlangıç ve Bitiş yazıları eklendi) -->
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
        <!-- 4. İlerleme Alanı (En alta itilecek kısım) -->
        <div class="progress-section">
          <div class="progress-info">
            <span class="progress-label">İLERLEME</span>
            <span class="progress-percent" style="color: ${goal.progress >= 70 ? "#15803d" : "#4361EE"};">${goal.progress}%</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="width: ${goal.progress}%; background-color: ${goal.progress >= 70 ? "#15803d" : "#4361EE"};"></div>
        </div>
      </div>
    </div>
    `;

    goalListElement.insertAdjacentHTML("beforeend", goalItem);
  });
}
