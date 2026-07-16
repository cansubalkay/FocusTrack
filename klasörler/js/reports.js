console.log("REPORTS CANLI VERİ AKTİF");
// REPORTS SAYFASI İÇİN reports.json veya yerel dosya değil, tamamen canlı Render API'den gelen veriler olcak
document.addEventListener("DOMContentLoaded", async () => {
// Sayfa yüklenince reports verilerini çekmeye başla
// Promise.all kullanarak iki API isteğinin de aynı anda bitmesini bekliyoruz
try {
  await Promise.all([fetchTasksData(), fetchGoalsData()]);
} catch (err) {
  console.error("Yükleme sırasında hata oluştu:", err);
} finally {
  hideLoader(); // İstekler başarılı da olsa başarısız da olsa yükleme ekranını kesin kapat!
}
});
// Yükleme ekranını kapatan sihirli fonksiyon
function hideLoader() {
 const loader = document.getElementById("loadingScreen");
 if (loader) {
   loader.classList.add("hidden");
 }
}
// async, fonksiyonun içinde bekleme gerektiren işler var anlamına gelir.
async function fetchTasksData() {
try {
  //Render API linkinden veri gelir
  const response = await fetch("https://focustrack-pmxz.onrender.com/tasks");
  if (!response.ok) {
    throw new Error(`Veri çekilemedi! Hata Kodu: ${response.status}`);
  }
  // Sunucudan gelen veri bir string yığınıdır. .json() komutu JS'nin anlayacağı JSON formatına çevirir
  const data = await response.json();
  // JSON yapısından sadece görev listesini array olarak al
  //*ternary koruması*
  const tasksArray = data.tasks ? data.tasks : data;
  // Matematiksel ve filtre kısımları
  // İlk toplam görev sayısını bul
  const totalTasks = tasksArray.length;
  // Sadece tamamlananlar
  const completedTasks = tasksArray.filter(task => task.status === "Tamamlandı").length;
  // Bekleyenler pending kısmında olanlardenemeiçin
  const pendingTasks = tasksArray.filter(task => task.status !== "Tamamlandı").length;
  // Oran için de tamamlanan görevler üzerinden yüzde bulma
  // Eğer görevler 0 olursa bölme işlemi hata vermesin diye
  const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
  // HTML bağlantısı için
  const completedElement = document.getElementById("completed-count");
  const pendingElement = document.getElementById("pending-count");
  const rateTextElement = document.getElementById("completion-rate-text");
  const progressBarElement = document.getElementById("completion-progress-bar");
  // Elemanlara çekilen sayıları işleme
  if(completedElement) {
      completedElement.textContent = completedTasks;
  }
  if(pendingElement) {
      pendingElement.textContent = pendingTasks;
  }
  if(rateTextElement) {
      // Dil seçeneğine göre yüzde (%) işaretinin yerini dinamik ayarla
      const percentText = (typeof currentLang !== "undefined" && currentLang === "en") ? `${completionRate}%` : `%${completionRate}`;
      rateTextElement.textContent = percentText;
  }
  // Çubuğun genişliğini dinamik ayarlama
  if (progressBarElement) {
      progressBarElement.style.width = `${completionRate}%`;
  }
  // HTML'e veriler basıldıktan sonra dil motorunu tetikle
  if (typeof setLanguage === "function") {
      setLanguage(currentLang);
  }
} catch (error) {
  console.error("Reports verisi yüklenirken hata oluştu:", error);
  throw error; // Promise.all'un yakalayabilmesi için hatayı yukarı fırlatıyoruz
}
}
// Hedefler (Goals) için veri çekme fonksiyonu
async function fetchGoalsData() {
 try {
   const goalsRes = await fetch("https://focustrack-pmxz.onrender.com/goals");
   if (!goalsRes.ok) throw new Error(`Goals Hata Kodu: ${goalsRes.status}`);
   const goalsData = await goalsRes.json();
   const goalsArray = goalsData.goals ? goalsData.goals : goalsData;
   const totalGoals = goalsArray.length;
   // Yüzdesi 100 olanları tamamlanmış sayıyoruz
   const completedGoals = goalsArray.filter(goal => Number(goal.progress) === 100).length;
   const pendingGoals = totalGoals - completedGoals;
   const goalCompletionRate = totalGoals === 0 ? 0 : Math.round((completedGoals / totalGoals) * 100);
   // Yeni HTML elemanlarına verileri işleme
   if(document.getElementById("goal-completed-count")) document.getElementById("goal-completed-count").textContent = completedGoals;
   if(document.getElementById("goal-pending-count")) document.getElementById("goal-pending-count").textContent = pendingGoals;
   if(document.getElementById("goal-completion-rate-text")) {
       const percentText = (typeof currentLang !== "undefined" && currentLang === "en") ? `${goalCompletionRate}%` : `%${goalCompletionRate}`;
       document.getElementById("goal-completion-rate-text").textContent = percentText;
   }
   if(document.getElementById("goal-completion-progress-bar")) document.getElementById("goal-completion-progress-bar").style.width = `${goalCompletionRate}%`;
 } catch (error) {
   console.error("Goals verisi yüklenirken hata oluştu:", error);
   throw error;
 }
}