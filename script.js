var baslangic = new Date("2026-09-13T01:00:00").getTime();

setInterval(function() {
    var simdi = new Date().getTime();
    var fark = simdi - baslangic;
    
    if (fark < 0) {
        document.getElementById("tarih").innerHTML = "0 <i class='fa-regular fa-calendar'></i> 0 <i class='fa-regular fa-clock'></i> 0 <i class='fa-solid fa-hourglass-half'></i> 0 <i class='fa-solid fa-stopwatch'></i>";
        return;
    }

    var gun = Math.floor(fark / (1000 * 60 * 60 * 24));
    var saat = Math.floor((fark % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var dakika = Math.floor((fark % (1000 * 60 * 60)) / (1000 * 60));
    var saniye = Math.floor((fark % (1000 * 60)) / 1000);
    
    document.getElementById("tarih").innerHTML = 
        gun + " <i class='fa-regular fa-calendar'></i> " + 
        saat + " <i class='fa-regular fa-clock'></i> " + 
        dakika + " <i class='fa-solid fa-hourglass-half'></i> " + 
        saniye + " <i class='fa-solid fa-stopwatch'></i>"; 
}, 1000);

document.getElementById("shareBtn").addEventListener("click", function() {
    var gun = Math.floor((new Date().getTime() - baslangic) / (1000 * 60 * 60 * 24));
    var saat = Math.floor(((new Date().getTime() - baslangic) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var dakika = Math.floor(((new Date().getTime() - baslangic) % (1000 * 60 * 60)) / (1000 * 60));
    var saniye = Math.floor(((new Date().getTime() - baslangic) % (1000 * 60)) / 1000);
    
    var temizMetin = gun + " GÜN " + saat + " SAAT " + dakika + " DAKİKA " + saniye + " SANİYEDİR";
    var paylasimMetni = temizMetin + " UZAĞIZ! / AWAY FROM OUR FRIENDS! / بعيدون عن أصدقائنا\ntransprideistanbul.com/sayac";

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(paylasimMetni).then(function() {
            var ikon = document.getElementById("shareIcon");
            ikon.className = "fa-solid fa-check";

            setTimeout(function() {
                ikon.className = "fa-solid fa-share-nodes";
            }, 2000);
        });
    }
});
