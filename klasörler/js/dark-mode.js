document.addEventListener("DOMContentLoaded", () => {
    const themeBtn = document.getElementById('theme-toggle-btn');


    // Sayfa ilk açıldığında tarayıcı hafzasına bak ve temayı uygula
    if(localStorage.getItem('focusTrackTheme') === 'dark') {
        document.body.classList.add('dark-mode') ;
        // Eğer karanlık modsa butonu  güneş yap
        if(themeBtn) themeBtn.textContent = '☀️';
}
    // Buto tıklandığında temayı değiştirme ve tarayıcı hafızasına kaydet
    if(themeBtn) {
        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');

            //hangi modda oldugumuzu  kontrol edip hafıza ve ikon güncellemesi
            if (document.body.classList.contains('dark-mode')){
                localStorage.setItem('focusTrackTheme', 'dark');
                themeBtn.textContent = '☀️';
            } else {
                localStorage.setItem('focusTrackTheme', 'light');
                themeBtn.textContent = '🌙';
            }
        });
    }
});