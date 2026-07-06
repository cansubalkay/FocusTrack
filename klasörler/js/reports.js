console.log("REPORTS DENEME");
// REPORTS SAYFASI İÇİN reports.jsonu değil de şuana kadarki verileri kullanıcam
// Çünkü bu veriler sürekli değişecek bu yüzden matematiksel bir fonksiyonla
// gelecek olan veriyi işlemek üzere bir reports.js oluşturacağım
document.addEventListener("DOMContentLoaded", () => {
  // Sayfa yüklenince dashboard verilerini çekmeye başla
  fetchTasksData();
});

// async, fonksiyonun içinde bekleme gerektiren işler var anlamına gelir.
async function fetchTasksData() {
  try {
    // json/tasks.json dosyasından veriyi alıyoruz. await, fetch işlemi bitene kadar bir sonraki satıra geçmez
    const response = await fetch("./json/tasks.json");

    if (!response.ok) {
      throw new Error(`Veri çekilemedi! Hata Kodu: ${response.status}`);
    }
    // dosyadan gelen veri bir string yığınıdır. .json() komutu jsnin anlayacağı json formatına çevirir
    const data = await response.json();
    //JSON yapısından sadece görev listesini array olark alma
    const tasksArray = data.tasks ? data.tasks : data;

    //Matematiksel ve filtre kısımları 
    // ilktoplam görev sayısını bul
    const totalTasks = tasksArray.length;
    // sadece tamamlananlae
    const completedTasks = tasksArray.filter(task => task.completed === true).length;
    // bekleyenler pending kısmında olanlar
    const pendingTasks = tasksArray.filter(task => task.completed === false).length;
    //Oran için de tamamlanan görevler ğzeerinden yüzde bulma
    //eger goreveler 0 olursa bolme islemi hata vermesin diye
    const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) *100);

    //html bağlantısı için
    const completedElement = document.getElementById("completed-count");
    const pendingElement = document.getElementById("pending-count");
    const rateTextElement = document.getElementById("completion-rate-text");
    const progressBarElement = document.getElementById("completion-progress-bar");

    //Elemanlara çekilen sayıları işleme
    if(completedElement) {
        completedElement.textContent = completedTasks;
    }
    if(pendingElement) {
        pendingElement.textContent = pendingTasks;
    }

    if(rateTextElement) {
        rateTextElement.textContent = `${completionRate}%`
    }

    // Cubugun genişlipini dinamik ayarlama
    if (progressBarElement) {
        progressBarElement.style.width = `${completionRate}%`;
    }
  } catch (error) {
    console.error("Reports verisi yüklenirken hata oluştu:", error);
  }
}