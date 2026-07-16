console.log("i18n Dil Motoru Başlatıldı");

// 1. SÖZLÜK (Tüm metinlerin TR ve EN karşılıkları burada duracak)
const translations = {
  tr: {
    // Dashboard (Ana Sayfa) Kelimeleri
    greeting: "Merhaba",
    focus_text: "Bugün odaklanman gerekenler burada. Akışta kal.",
    today_tasks: "Bugünkü Görevler",
    page_title_index: "Ana Sayfa - Hoş Geldiniz",
    view_all: "Tümünü Gör",
    this_month_goals: "Bu Ayki Hedefler",
    stat_total: "Toplam",
    stat_completed: "Tamamlanan",
    stat_pending: "Bekleyen",
    badge_all_time: "Tüm Zamanlar",
    badge_completed: "Tamamlandı",
    badge_pending: "Bekliyor",

    // Tasks Sayfasının Kelimeleri
    page_title_tasks: "Görevler - FocusTrack",
   tasks_page_title: "Görevler",
   tasks_page_subtitle: "Önceliklerini ve akışını yönet.",
   btn_new_task: "+ Yeni Görev",
   search_task_placeholder: "Görev Ara...",
   filter_all: "Tümü",
   filter_completed: "Tamamlanan",
   filter_pending: "Tamamlanmayan",
   modal_new_task_title: "Yeni Görev Oluştur",
   label_task_title: "Görev Başlığı",
   placeholder_task_title: "Örn: Tasarım sistemini güncelle",
   label_due_date: "Bitiş Tarihi",
   label_priority: "Öncelik",
   priority_high: "Yüksek",
   priority_medium: "Orta",
   priority_low: "Düşük",
   btn_cancel: "İptal",
   btn_save: "Kaydet",
   modal_delete_title: "Görevi Sil",
   modal_delete_desc: "Bu görevi kalıcı olarak silmek istediğine emin misin? Bu işlem maalesef geri alınamaz.",
   btn_delete_confirm: "Evet, Sil",
   btn_edit: "Düzenle",
   btn_delete: "Sil",
   btn_complete: "Tamamla",
   btn_done: "Bitti",
   modal_update_task: "Görev Güncelle",

   //Goals Syfsının kelimeleri
   page_title_goals: "Hedefler - FocusTrack",
   goals_page_title: "Hedefler",
   goals_page_subtitle: "Uzun vadeli hedeflerini yönet ve ilerlemeni takip et.",
   btn_new_goal: "+ Yeni Hedef",
   modal_new_goal_title: "Yeni Hedef Oluştur",
   label_goal_title: "HEDEF BAŞLIĞI",
   placeholder_goal_title: "Örn: Yeni Tasarım Sistemini Tamamla",
   label_goal_desc: "AÇIKLAMA",
   placeholder_goal_desc: "Bu hedefin kapsamı ve detayları nelerdir?",
   label_start_date: "BAŞLANGIÇ TARİHİ",
   label_end_date: "BİTİŞ TARİHİ",
   label_start_progress: "BAŞLANGIÇ İLERLEMESİ",
   label_start_prefix: "Başlangıç:",
   label_end_prefix: "Bitiş:",
   label_progress: "İLERLEME",
   modal_update_goal: "Hedef Güncelle",
   modal_delete_goal_title: "Hedefi Sil",
   modal_delete_goal_desc: "Bu hedefi kalıcı olarak silmek istediğine emin misin? Bu işlem maalesef geri alınamaz.",

    // Sidebar (Yan Menü) Kelimeleri
    sidebar_dashboard: "Kontrol Paneli",
    sidebar_tasks: "Görevler",
    sidebar_goals: "Hedefler",
    sidebar_reports: "Raporlar",

    // Raporlar Sayfası Kelimeleri
    page_title_reports: "Raporlar - FocusTrack",
   reports_rate_subtitle: "Hedeflere doğru haftalık ilerleme",
   reports_completed_card: "Tamamlanan<br />Görev",
   reports_pending_card: "Bekleyen",
    reports_title: "Raporlar",
    reports_subtitle: "Bu haftaki performans metrikleriniz.",
    reports_rate: "Görev Tamamlama Oranı",
    reports_completed: "Tamamlanan Görev",
    reports_goal_rate: "Hedef Tamamlama Oranı",
   reports_goal_rate_subtitle: "Hedeflere doğru aylık ilerleme",
   reports_goal_completed: "Tamamlanan<br />Hedef",
   reports_goal_pending: "Bekleyen",
    reports_pending: "Bekleyen"
  },

  en: {

    // Dashboard (Ana Sayfa) Kelimeleri
    greeting: "Hello",
    focus_text: "Here is your focus for today. Stay in the flow.",
    today_tasks: "Today's Tasks",
    page_title_index: "Home - Welcome",
    view_all: "View All",
    this_month_goals: "This Month's Goals",
    stat_total: "Total",
    stat_completed: "Completed",
    stat_pending: "Pending",
    badge_all_time: "All Time",
    badge_completed: "Completed",
    badge_pending: "Pending",

    // Tasks Sayfasının Kelimeleri
    page_title_tasks: "Tasks - FocusTrack",
   tasks_page_title: "Tasks",
   tasks_page_subtitle: "Manage your priorities and flow.",
   btn_new_task: "+ New Task",
   search_task_placeholder: "Search Tasks...",
   filter_all: "All",
   filter_completed: "Completed",
   filter_pending: "Pending",
   modal_new_task_title: "Create New Task",
   label_task_title: "Task Title",
   placeholder_task_title: "Ex: Update the design system",
   label_due_date: "Due Date",
   label_priority: "Priority",
   priority_high: "High",
   priority_medium: "Medium",
   priority_low: "Low",
   btn_cancel: "Cancel",
   btn_save: "Save",
   modal_delete_title: "Delete Task",
   modal_delete_desc: "Are you sure you want to permanently delete this task? This action cannot be undone.",
   btn_delete_confirm: "Yes, Delete",
   btn_edit: "Edit",
   btn_delete: "Delete",
   btn_complete: "Complete",
   btn_done: "Done",
   modal_update_task: "Update Task",

    //Goals Syfsının kelimeleri
    page_title_goals: "Goals - FocusTrack",
   goals_page_title: "Goals",
   goals_page_subtitle: "Manage your long-term objectives and track progress.",
   btn_new_goal: "+ New Goal",
   modal_new_goal_title: "Create New Goal",
   label_goal_title: "GOAL TITLE",
   placeholder_goal_title: "Ex: Complete the New Design System",
   label_goal_desc: "DESCRIPTION",
   placeholder_goal_desc: "What is the scope and details of this goal?",
   label_start_date: "START DATE",
   label_end_date: "END DATE",
   label_start_progress: "STARTING PROGRESS",
   label_start_prefix: "Start:",
   label_end_prefix: "End:",
   label_progress: "PROGRESS",
   modal_update_goal: "Update Goal",
   modal_delete_goal_title: "Delete Goal",
   modal_delete_goal_desc: "Are you sure you want to permanently delete this goal? This action cannot be undone.",


    //  Sidebar (Yan Menü) Kelimeleri
    sidebar_dashboard: "Dashboard",
    sidebar_tasks: "Tasks",
    sidebar_goals: "Goals",
    sidebar_reports: "Reports",

    // Raporlar Sayfası Kelimeleri
    page_title_reports: "Reports - FocusTrack",
   reports_rate_subtitle: "Weekly progress toward goals",
   reports_completed_card: "Completed<br />Tasks",
   reports_pending_card: "Pending",
    reports_title: "Reports",
    reports_subtitle: "Your performance metrics for the current week.",
    reports_rate: "Task Completion Rate",
    reports_completed: "Completed Tasks",
    reports_goal_rate: "Goal Completion Rate",
    reports_goal_rate_subtitle: "Monthly progress toward goals",
    reports_goal_completed: "Completed<br />Goals",
    reports_goal_pending: "Pending",
    reports_pending: "Pending"
  }
};

// 2. HAFIZA KONTROLÜ
// Kullanıcı daha önce dil seçmiş mi? Seçmediyse varsayılan "tr" olsun
let currentLang = localStorage.getItem("appLang") || "tr";

// 3. DİLİ DEĞİŞTİREN ANA FONKSİYON
function setLanguage(lang) {

  currentLang = lang;

  localStorage.setItem("appLang", lang); // Hafızaya kaydet

  // HTML içindeki data-i18n etiketine sahip tüm elemanları bul ve metnini çevir
  document.querySelectorAll("[data-i18n]").forEach(element => {
    const key = element.getAttribute("data-i18n");
    if (translations[lang][key]) {

      element.innerHTML = translations[lang][key]; 
    }
  });

  // HTML içindeki data-i18n-placeholder etiketine sahip inputların placeholderını çevir
  document.querySelectorAll("[data-i18n-placeholder]").forEach(element => {
    const key = element.getAttribute("data-i18n-placeholder");
    if (translations[lang][key]) {
      element.placeholder = translations[lang][key];
    }
  });

  // BUTON YAZISI (Sadece hedef dili göster)
  const langText = document.getElementById("lang-text");
  if (langText) {
    // Eğer anlık dil Türkçe ise butonda "EN", İngilizce ise "TR" yazsın
    langText.textContent = lang === "tr" ? "EN" : "TR";
  }
}

// 4. BUTONA TIKLANDIĞINDA ÇALIŞACAK TETİKLEYİCİ
function toggleLanguage() {
  const newLang = currentLang === "tr" ? "en" : "tr";
  setLanguage(newLang);

}

// 5. SAYFA YÜKLENDİĞİNDE HAFIZADAKİ DİLİ UYGULA
document.addEventListener("DOMContentLoaded", () => {
  setLanguage(currentLang);
});
 