// Başlangıç tarihi: 12 Eylül 2026, 00:00:00
var baslangic = new Date("2026-09-13T03:00:00").getTime();

setInterval(function() {
    var simdi = new Date().getTime();
    var fark = simdi - baslangic;
    
    // Eğer tarih henüz gelmediyse veya bir hata durumu olursa
    if (fark < 0) {
        document.getElementById("tarih").innerHTML = "0 GÜN 0 SAAT 0 DAKİKA 0 SANİYE";
        return;
    }

    var gun = Math.floor(fark / (1000 * 60 * 60 * 24));
    var saat = Math.floor((fark % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var dakika = Math.floor((fark % (1000 * 60 * 60)) / (1000 * 60));
    var saniye = Math.floor((fark % (1000 * 60)) / 1000);
    
    // HTML içindeki elementi günceller
    document.getElementById("tarih").innerHTML = 
        gun + " GÜN " + 
        saat + " SAAT " + 
        dakika + " DAKİKA " + 
        saniye + " SANİYEDİR"; 
}, 1000);
