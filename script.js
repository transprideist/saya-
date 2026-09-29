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

        var canvas = document.createElement("canvas");
        canvas.width = 1200;
        canvas.height = 800;
        var ctx = canvas.getContext("2d");

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#000000";
        ctx.font = "bold 64px Montserrat, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        var tarihMetni = gun + " " + dil.gun + " " + saat + " " + dil.saat + " " + dakika + " " + dil.dakika + " " + saniye + " " + dil.saniye;
        ctx.fillText(tarihMetni, canvas.width / 2, canvas.height / 2 - 40);

        ctx.font = "400 40px Montserrat, sans-serif";
        ctx.fillStyle = "#333333";
        ctx.fillText(dil.metin, canvas.width / 2, canvas.height / 2 + 50);

        // Canvas'ı Blob formatına çevirip hem yerel paylaşım hem indirme için hazırlıyoruz
        canvas.toBlob(function(blob) {
            var file = new File([blob], "uzagiz-sayac.jpg", { type: "image/jpeg" });
            var isInstagram = /Instagram/.test(navigator.userAgent);

            // 1. Önce modern cihazlarda ve destekleyen tarayıcılarda (Instagram dahil) yerel paylaşım menüsünü deneriz
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                navigator.share({
                    files: [file],
                    text: paylasimMetni,
                    title: "Sayaç"
                }).catch(function(error) {
                    console.log("Paylaşım iptal edildi veya hata:", error);
                });
            } 
            // 2. Eğer Instagram in-app browser yerel paylaşımı desteklemiyorsa, açıklayıcı butonlu modalı açarız
            else if (isInstagram) {
                var imageUrl = canvas.toDataURL("image/jpeg", 0.95);
                gorselModalGoster(imageUrl, paylasimMetni);
            } 
            // 3. Normal tarayıcılar (Safari, Chrome) için doğrudan indirme
            else {
                var imageUrl = canvas.toDataURL("image/jpeg", 0.95);
                var link = document.createElement("a");
                link.download = "uzagiz-sayac.jpg";
                link.href = imageUrl;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }, "image/jpeg", 0.95);

        var ikon = document.getElementById("shareIcon");
        if (ikon) {
            ikon.className = "fa-solid fa-check";
            setTimeout(function() {
                ikon.className = "fa-solid fa-share-nodes";
            }, 2000);
        }
    });
}

function gorselModalGoster(imageUrl, paylasimMetni) {
    var eskiModal = document.getElementById("igModal");
    if (eskiModal) eskiModal.remove();

    var modal = document.createElement("div");
    modal.id = "igModal";
    modal.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.92);z-index:99999;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;box-sizing:border-box;";

    var baslik = document.createElement("h3");
    baslik.style.cssText = "color:#ffffff;font-family:Montserrat,sans-serif;font-size:18px;margin-bottom:8px;text-align:center;";
    baslik.innerText = "Görseliniz Hazır!";

    var aciklama = document.createElement("p");
    aciklama.style.cssText = "color:#cccccc;font-family:Montserrat,sans-serif;font-size:13px;text-align:center;margin-bottom:15px;line-height:1.4;max-width:320px;";
    aciklama.innerText = "Instagram kısıtlaması nedeniyle resmi doğrudan indiremiyoruz. Kaydetmek için aşağıdaki butona basıp açılan sayfada görseli basılı tutabilir veya fotoğraflarınıza kaydedebilirsiniz.";

    var img = document.createElement("img");
    img.src = imageUrl;
    img.style.cssText = "max-width:100%;max-height:45vh;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.5);object-fit:contain;margin-bottom:15px;";

    var kaydetBtn = document.createElement("a");
    kaydetBtn.innerText = "📲 Görseli Yeni Sekmede Aç / Kaydet";
    kaydetBtn.href = imageUrl;
    kaydetBtn.target = "_blank";
    kaydetBtn.rel = "noopener";
    kaydetBtn.style.cssText = "display:block;width:80%;max-width:280px;padding:12px 16px;background:#0095f6;color:#ffffff;text-decoration:none;border-radius:30px;font-weight:bold;font-size:14px;font-family:Montserrat,sans-serif;text-align:center;margin-bottom:10px;box-shadow:0 4px 12px rgba(0,149,246,0.4);";

    var kapatBtn = document.createElement("button");
    kapatBtn.innerText = "Kapat";
    kapatBtn.style.cssText = "padding:8px 20px;background:transparent;color:#aaaaaa;border:none;font-size:14px;font-family:Montserrat,sans-serif;cursor:pointer;";
    
    kapatBtn.onclick = function() {
        modal.remove();
    };

    modal.appendChild(baslik);
    modal.appendChild(aciklama);
    modal.appendChild(img);
    modal.appendChild(kaydetBtn);
    modal.appendChild(kapatBtn);
    document.body.appendChild(modal);
}
