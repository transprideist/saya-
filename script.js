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
        if (selectScreen) selectScreen.style.display = "none";
        if (counterScreen) counterScreen.style.display = "flex";
        guncelle();
    } else {
        if (selectScreen) selectScreen.style.display = "flex";
        if (counterScreen) counterScreen.style.display = "none";
    }
}

function guncelle() {
    var hash = window.location.hash.replace("#", "").toLowerCase();
    if (!diller[hash]) return;
    
    var dil = diller[hash];
    var subheaderEl = document.getElementById("subheader");
    if (subheaderEl) subheaderEl.innerText = dil.metin;

    var simdi = new Date().getTime();
    var fark = simdi - baslangic;
    var tarihEl = document.getElementById("tarih");

    if (!tarihEl) return;

    if (fark < 0) {
        tarihEl.innerText = "0 " + dil.gun + " 0 " + dil.saat + " 0 " + dil.dakika + " 0 " + dil.saniye;
        return;
    }

    var gun = Math.floor(fark / (1000 * 60 * 60 * 24));
    var saat = Math.floor((fark % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var dakika = Math.floor((fark % (1000 * 60 * 60)) / (1000 * 60));
    var saniye = Math.floor((fark % (1000 * 60)) / 1000);

    tarihEl.innerText = gun + " " + dil.gun + " " + saat + " " + dil.saat + " " + dakika + " " + dil.dakika + " " + saniye + " " + dil.saniye;
}

setInterval(function() {
    var hash = window.location.hash.replace("#", "").toLowerCase();
    if (diller[hash]) {
        guncelle();
    }
}, 1000);

window.addEventListener("hashchange", ekranlariAyarla);
window.addEventListener("DOMContentLoaded", ekranlariAyarla);

var shareBtn = document.getElementById("shareBtn");
if (shareBtn) {
    shareBtn.addEventListener("click", function() {
        var hash = window.location.hash.replace("#", "").toLowerCase();
        var dil = diller[hash] || diller["tr"];

        var fark = new Date().getTime() - baslangic;
        var gun = Math.floor(fark / (1000 * 60 * 60 * 24));
        var saat = Math.floor((fark % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var dakika = Math.floor((fark % (1000 * 60 * 60)) / (1000 * 60));
        var saniye = Math.floor((fark % (1000 * 60)) / 1000);

        var paylasimMetni = gun + " " + dil.gun + " " + saat + " " + dil.saat + " " + dakika + " " + dil.dakika + " " + saniye + " " + dil.ek + "\ntransprideistanbul.com/sayac/#" + hash;

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(paylasimMetni).catch(function(err) {
                console.log("Panoya kopyalanamadı:", err);
            });
        }

        // Tam Dikey Story Boyutu (1080x1920)
        var canvas = document.createElement("canvas");
        canvas.width = 1080;
        canvas.height = 1920;
        var ctx = canvas.getContext("2d");

        // Arka planı bembeyaz yapıyoruz
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        var tarihMetni = gun + " " + dil.gun + " " + saat + " " + dil.saat + " " + dakika + " " + dil.dakika + " " + saniye + " " + dil.saniye;

        // Metnin uzunluğuna göre font boyutunu dinamik ayarlayarak kayma/taşmayı önlüyoruz
        var fontSize = 42;
        if (tarihMetni.length > 30) {
            fontSize = 36; // İngilizce gibi uzun metinlerde otomatik küçülür, böylece asla taşmaz!
        }

        // 1. Satır: Sayaç Rakamları ve Yazıları
        ctx.fillStyle = "#000000";
        ctx.font = "bold " + fontSize + "px Montserrat, sans-serif";
        ctx.fillText(tarihMetni, canvas.width / 2, canvas.height / 2 - 40);

        // 2. Satır: Alt Açıklama Metni
        ctx.font = "400 32px Montserrat, sans-serif";
        ctx.fillStyle = "#333333";
        ctx.fillText(dil.metin, canvas.width / 2, canvas.height / 2 + 50);

        var imageUrl = canvas.toDataURL("image/jpeg", 0.95);

        var isInstagram = /Instagram/.test(navigator.userAgent);

        if (isInstagram) {
            gorselModalGoster(imageUrl);
        } else {
            var link = document.createElement("a");
            link.download = "uzagiz-sayac.jpg";
            link.href = imageUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        var ikon = document.getElementById("shareIcon");
        if (ikon) {
            ikon.className = "fa-solid fa-check";
            setTimeout(function() {
                ikon.className = "fa-solid fa-share-nodes";
            }, 2000);
        }
    });
}

function gorselModalGoster(imageUrl) {
    var eskiModal = document.getElementById("igModal");
    if (eskiModal) eskiModal.remove();

    var modal = document.createElement("div");
    modal.id = "igModal";
    modal.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.92);z-index:99999;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;box-sizing:border-box;";

    var aciklama = document.createElement("p");
    aciklama.style.cssText = "color:#ffffff;font-family:Montserrat,sans-serif;font-size:14px;text-align:center;margin-bottom:15px;line-height:1.5;max-width:320px;";
    aciklama.innerText = "Görselin üzerine uzun basılı tutup fotoğraflarına kaydedebilir ve Instagram hikayende paylaşabilirsin! (Paylaşım metni panoya kopyalandı ✨)";

    var img = document.createElement("img");
    img.src = imageUrl;
    img.style.cssText = "max-width:100%;max-height:60vh;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.5);object-fit:contain;margin-bottom:20px;-webkit-touch-callout:default !important;";

    var kapatBtn = document.createElement("button");
    kapatBtn.innerText = "Tamam / Kapat";
    kapatBtn.style.cssText = "padding:12px 28px;background:#ffffff;color:#000000;border:none;border-radius:30px;font-weight:bold;font-size:15px;font-family:Montserrat,sans-serif;cursor:pointer;";
    
    kapatBtn.onclick = function() {
        modal.remove();
    };

    modal.appendChild(aciklama);
    modal.appendChild(img);
    modal.appendChild(kapatBtn);
    document.body.appendChild(modal);
}
