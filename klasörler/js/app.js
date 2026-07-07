// document, html sayfasının tamamını temsil eder. bu ü. satır sayfanın hazır olmasını bekler.
// .addEventListener(...) belirli bir olayı dinler DOMContentLoaded dinlenen olayın adıdır
// () => {...} Bu olay gerçekleştiğinde ne yapılacağını söyleyen ok fonksiyonudur.
// Sayfa hazır olur olmaz  asıl işi yapack fonku çağırır.
document.addEventListener("DOMContentLoaded", () => {
 loadSidebar();
 initTaskModal(); // Task modalını başlatan fonk
 initGoalModal(); // Goal modalını başlatan fonk (YENİ EKLENDİ)
});
// İşlem yapacak olan asıl fonksiyon loadSidebardır.
async function loadSidebar() {
 try {
   // components klasöründeki sidebar.html fetch ile çeker. await sadece async fonklarının içinde kullanılabilir.
   // await sayesinde istenen bulunmadan alt satıra geçilmez.
   const response = await fetch("./components/sidebar.html");
   // if ile hata kontrolü yapılır. eğer response ok olmazsa hata fırlatılır try bloğundan çıkılır.
   if (!response.ok) {
     throw new Error("Sidebar yüklenemedi!");
   }
   // gelen veriyi okunabilir hale getirme
   const sidebarHTML = await response.text(); // gelen bilgi, text formatıyla sidebarHTML sabitine
   // eşlenir(ve bekler-await).( eğer çekilecek dosya json olsaydı .text yerine .json olurdu.)
   //alttaki satırla; index.htmlde idsi sidebar-container olan boş div etiketini yakalar.
   //innerHTML= ... yakalanan divin içindeki html yapısını eşittirin sağındaki değerle eşler
   document.getElementById("sidebar-container").innerHTML = sidebarHTML;
   // --- DİNAMİK AKTİF MENÜ BELİRLEME ---
   // 1. URL'den mevcut sayfanın dosya adını al (Örn: 'tasks.html' veya 'index.html')
   // split('/').pop() metodu URL'nin en sonundaki kısmı alır. Boşsa 'index.html' say.
   const currentPage =
     window.location.pathname.split("/").pop() || "index.html";
   // 2. Sidebar yüklendikten sonra içindeki tüm 'a' etiketlerini (linkleri) seç
   const menuLinks = document.querySelectorAll(".responsive-sidebar ul li a");
   // 3. Döngü ile linkleri kontrol et
   menuLinks.forEach((link) => {
     const linkHref = link.getAttribute("href");
     // Eğer sayfa adı ile linkin href'i eşleşiyorsa (ve href="#" değilse) active yap
     if (linkHref !== "#" && currentPage === linkHref) {
       link.classList.add("active");
     }
   });
 } catch (error) {
   console.error("Hata:", error);
 }
}
// YENİ GÖREV MODAL için fonk
function initTaskModal() {
 // NOT: Kendi HTML'indeki butona hangi class'ı verdiysen '.yeni-gorev-btn' kısmını ona göre düzeltmelisin.
 const openBtn = document.querySelector(".btn-primary");
 const modalOverlay = document.getElementById("taskModal");
 const closeBtn = document.getElementById("closeModalBtn");
 const cancelBtn = document.getElementById("cancelModalBtn");
 //Kontrol eğer o anki sayfada bu buton veya modal yoksa, kodu burada durdur hata vermesin diye.
 if (!openBtn || !modalOverlay) {
   return;
 }
 // Modalı açma olayı
 openBtn.addEventListener("click", () => {
   modalOverlay.classList.add("active");
 });
 // Modalı kapatma fonksiyonu
 const closeModal = () => {
   modalOverlay.classList.remove("active");
 };
 // Çarpı veya İptal butonuna basıldığında kapat
 closeBtn.addEventListener("click", closeModal);
 cancelBtn.addEventListener("click", closeModal);
 // Siyah arka plana (dışarıya) tıklandığında kapat
 modalOverlay.addEventListener("click", (event) => {
   if (event.target === modalOverlay) {
     closeModal();
   }
 });
}
// YENİ HEDEF MODAL için fonk
function initGoalModal() {
 // Modal ve butonları seçiyoruz
 const goalModal = document.getElementById('goalModal');
 const openGoalModalBtn = document.getElementById('openGoalModalBtn'); // Baştaki nokta (.) kaldırıldı
 const closeGoalModalBtn = document.getElementById('closeGoalModalBtn');
 const cancelGoalModalBtn = document.getElementById('cancelGoalModalBtn');
 // KORUMA: Eğer o anki sayfada bu buton veya modal yoksa (Örn: Tasks sayfasındaysak),
 // kodu burada durdur ki konsolda 'null' hatası vermesin.
 if (!openGoalModalBtn || !goalModal) {
   return;
 }
 // Modalı Aç
 openGoalModalBtn.addEventListener('click', () => {
   goalModal.classList.add('active');
 });
 // Modalı Kapatma Fonksiyonu
 const closeGoalModal = () => {
   goalModal.classList.remove('active');
 };
 // Kapatma Butonlarına Tetikleyici Ekle
 closeGoalModalBtn.addEventListener('click', closeGoalModal);
 cancelGoalModalBtn.addEventListener('click', closeGoalModal);
 // Siyah arka plana (overlay) tıklanınca modalın kapanması
 goalModal.addEventListener('click', (e) => {
   if (e.target === goalModal) {
     closeGoalModal();
   }
 });
}

// YENİ GÖREV EKLEME VE VERİTABANINA (POST) KAYDETME
document.addEventListener('DOMContentLoaded', () => {
 const taskForm = document.getElementById('newTaskForm');
 const taskTitleInput = document.getElementById('taskTitle');
 const dueDateInput = document.getElementById('dueDate');
 const taskModal = document.getElementById('taskModal');
 if (taskForm) {
   // Buton tıklamasını değil, formun gönderilmesini (submit) dinliyoruz
   taskForm.addEventListener('submit', async (e) => {
     e.preventDefault(); // Sayfanın anında yenilenip veriyi kaybetmesini engeller
     // Seçili olan öncelik değerini (high, medium, low) yakala
     const selectedPriority = document.querySelector('input[name="priority"]:checked');
     const priorityValue = selectedPriority ? selectedPriority.value : 'medium'; // Seçilmemişse varsayılan Orta olsun
     // 1. db.json'a gönderilecek veri objesi
     const newTask = {
       title: taskTitleInput.value,
       date: dueDateInput.value,
       priority: priorityValue,
       status: "Tamamlanmayan" // Başlangıç durumu
     };
     // 2. Fetch API ile POST isteği
     try {
       const response = await fetch("http://localhost:3000/tasks", {
         method: "POST",
         headers: {
           "Content-Type": "application/json"
         },
         body: JSON.stringify(newTask)
       });
       if (response.ok) {
         console.log("Görev başarıyla eklendi!");
         // Formun içindeki tüm yazıları tek komutla temizle
         taskForm.reset();
         // Modalı gizle (kendi css yapına göre active class'ını siler veya display none yapar)
         taskModal.style.display = 'none';
         taskModal.classList.remove('active');
         // Veriyi ekranda canlı görmek için sayfayı yenile
         window.location.reload();
       } else {
         console.error("Görev eklenirken bir sunucu hatası oluştu.");
       }
     } catch (error) {
       console.error("Bağlantı hatası:", error);
     }
   });
 }
});