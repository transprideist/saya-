document.getElementById("shareBtn").addEventListener("click", function() {
    var gun = Math.floor((new Date().getTime() - baslangic) / (1000 * 60 * 60 * 24));
    var saat = Math.floor(((new Date().getTime() - baslangic) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var dakika = Math.floor(((new Date().getTime() - baslangic) % (1000 * 60 * 60)) / (1000 * 60));
    var saniye = Math.floor(((new Date().getTime() - baslangic) % (1000 * 60)) / 1000);
    
    var temizMetin = gun + " GÜN " + saat + " SAAT " + dakika + " DAKİKA " + saniye + " SANİYEDİR";
    var paylasimMetni = temizMetin + " UZAĞIZ! / AWAY FROM OUR FRIENDS! / بعيدون عن أصدقائنا\ntransprideistanbul.com/sayac";

    var textarea = document.createElement("textarea");
    textarea.value = paylasimMetni;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(paylasimMetni);
    }

    // Tıklandığı an CSS sınıfını ekliyoruz
    document.querySelector(".copy-message").classList.add("aktif");
});
