var baslangic = new Date("2026-09-13T01:00:00").getTime();

var diller = {
    tr: {
        gun: "GÜN",
        saat: "SAAT",
        dakika: "DAKİKA",
        saniye: "SANİYE",
        metin: "ARKADAŞLARIMIZDAN UZAĞIZ",
        ek: "SANİYEDİR ARKADAŞLARIMIZDAN UZAĞIZ!"
    },
    en: {
        gun: "DAYS",
        saat: "HOURS",
        dakika: "MINUTES",
        saniye: "SECONDS",
        metin: "AWAY FROM OUR FRIENDS",
        ek: "SECONDS AWAY FROM OUR FRIENDS!"
    },
    ku: {
        gun: "ROJ",
        saat: "KATJIMÊR",
        dakika: "XULEK",
        saniye: "ÇIRKE",
        metin: "EM JI HEVALÊN XWE DÛR IN",
        ek: "ÇIRKE EM JI HEVALÊN XWE DÛR IN!"
    },
    ar: {
        gun: "يوم",
        saat: "ساعة",
        dakika: "دقيقة",
        saniye: "ثانية",
        metin: "بعيدون عن أصدقائنا",
        ek: "ثانية بعيدون عن أصدقائنا!"
    }
};

function ekranlariAyarla() {
    var hash = window.location.hash.replace("#", "").toLowerCase();
    var selectScreen = document.getElementById("langSelectScreen");
    var counterScreen = document.getElementById("counterScreen");

    if (diller[hash]) {
        selectScreen.style.display = "none";
        counterScreen.style.display = "flex";
        guncelle();
    } else {
        selectScreen.style.display = "flex";
        counterScreen.style.display = "none";
    }
}

function guncelle() {
    var hash = window.location.hash.replace("#", "").toLowerCase();
    if (!diller[hash]) return;
    
    var dil = diller[hash];
    document.getElementById("subheader").innerText = dil.metin;

    var simdi = new Date().getTime();
    var fark = simdi - baslangic;

    if (fark < 0) {
        document.getElementById("tarih").innerText = "0 " + dil.gun + " 0 " + dil.saat + " 0 " + dil.dakika + " 0 " + dil.saniye;
        return;
    }

    var gun = Math.floor(fark / (1000 * 60 * 60 * 24));
    var saat = Math.floor((fark % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var dakika = Math.floor((fark % (1000 * 60 * 60)) / (1000 * 60));
    var saniye = Math.floor((fark % (1000 * 60)) / 1000);

    document.getElementById("tarih").innerText = gun + " " + dil.gun + " " + saat + " " + dil.saat + " " + dakika + " " + dil.dakika + " " + saniye + " " + dil.saniye;
}

setInterval(function() {
    var hash = window.location.hash.replace("#", "").toLowerCase();
    if (diller[hash]) {
        guncelle();
    }
}, 1000);

window.addEventListener("hashchange", ekranlariAyarla);
window.addEventListener("DOMContentLoaded", ekranlariAyarla);

document.getElementById("shareBtn").addEventListener("click", function() {
    var hash = window.location.hash.replace("#", "").toLowerCase();
    var dil = diller[hash] || diller["tr"];

    var fark = new Date().getTime() - baslangic;
    var gun = Math.floor(fark / (1000 * 60 * 60 * 24));
    var saat = Math.floor((fark % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var dakika = Math.floor((fark % (1000 * 60 * 60)) / (1000 * 60));
    var saniye = Math.floor((fark % (1000 * 60)) / 1000);

    var paylasimMetni = gun + " " + dil.gun + " " + saat + " " + dil.saat + " " + dakika + " " + dil.dakika + " " + saniye + " " + dil.ek + "\ntransprideistanbul.com/sayac/#" + hash;

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(paylasimMetni);
    }

    var captureElement = document.getElementById("captureArea");
    html2canvas(captureElement, { backgroundColor: "#ffffff", scale: 2 }).then(function(canvas) {
        var imageUrl = canvas.toDataURL("image/jpeg", 0.9);

        canvas.toBlob(function(blob) {
            var file = new File([blob], "uzagiz-sayac.jpg", { type: "image/jpeg" });

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                navigator.share({
                    files: [file],
                    title: 'Sayaç',
                    text: paylasimMetni
                }).catch(function() {
                    dosyayiIndir(imageUrl);
                });
            } else {
                dosyayiIndir(imageUrl);
            }

            var ikon = document.getElementById("shareIcon");
            ikon.className = "fa-solid fa-check";
            setTimeout(function() {
                ikon.className = "fa-solid fa-share-nodes";
            }, 2000);
        }, "image/jpeg", 0.9);
    });
});

function dosyayiIndir(dataUrl) {
    var link = document.createElement("a");
    link.href = dataUrl;
    link.download = "uzagiz-sayac.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
