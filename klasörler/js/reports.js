console.log("REPORTS CANLI VERİ AKTİF");

// REPORTS SAYFASI İÇİN reports.json veya yerel dosya değil, tamamen canlı Render API'den gelen verileri kullanacağız.

// Bu sayede Vercel'deki sitemiz her zaman en güncel görev yüzdelerini gösterecek.

document.addEventListener("DOMContentLoaded", () => {

  // Sayfa yüklenince reports verilerini çekmeye başla

  fetchTasksData();

});

// async, fonksiyonun içinde bekleme gerektiren işler var anlamına gelir.

async function fetchTasksData() {

  try {

    // ⚠️ GÜNCELLEME: Canlı Render API linkimizden veriyi alıyoruz.

    const response = await fetch("https://focustrack-pmxz.onrender.com/tasks");

    if (!response.ok) {

      throw new Error(`Veri çekilemedi! Hata Kodu: ${response.status}`);

    }

    // Sunucudan gelen veri bir string yığınıdır. .json() komutu JS'nin anlayacağı JSON formatına çevirir

    const data = await response.json();

    // JSON yapısından sadece görev listesini array olarak alma

    // (json-server doğrudan array döndürür, ancak ekstra güvenlik için ternary koruması bıraktık)

    const tasksArray = data.tasks ? data.tasks : data;

    // Matematiksel ve filtre kısımları

    // İlk toplam görev sayısını bul

    const totalTasks = tasksArray.length;

    // Sadece tamamlananlar

    const completedTasks = tasksArray.filter(task => task.status === "Tamamlandı").length;

    // Bekleyenler pending kısmında olanlar

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

        rateTextElement.textContent = `${completionRate}%`

    }

    // Çubuğun genişliğini dinamik ayarlama

    if (progressBarElement) {

        progressBarElement.style.width = `${completionRate}%`;

    }

  } catch (error) {

    console.error("Reports verisi yüklenirken hata oluştu:", error);

  }

}
 