# OnsaFX Space Runner

## Nasıl Oynanır (How to Play)
1. **Başlat**: `index.html` dosyasını bir web tarayıcısında (Chrome, Edge, Firefox vb.) açın.
2. **Kontroller**:
   - **Başlat/Yeniden Başlat**: `BOŞLUK (SPACE)` tuşu.
   - **Hareket**: `W, A, S, D` veya `YÖN TUŞLARI`.
3. **Amaç**: Kırmızı asteroidlerden kaçın ve OnsaFX logolarını toplayarak skorunuzu (Lot) artırın.

## Başka Cihazda Açma (How to Run on Another Device)

### Yöntem 1: Dosya Transferi (En Basit)
1. Bu klasördeki tüm dosyaları (`index.html`, `style.css`, `game.js`, `onsafx_logo.png`) bir USB belleğe veya bulut depolama alanına (Google Drive, WeTransfer vb.) kopyalayın.
2. Diğer bilgisayara indirin.
3. `index.html` dosyasına çift tıklayarak açın.

### Yöntem 2: Aynı Ağ Üzerinden (Telefondan Oynamak İçin)
Eğer bilgisayarınız ve telefonunuz aynı Wi-Fi ağındaysa:
1. Bu klasörde bir terminal açın.
2. Python yüklüyse şu komutu çalıştırın: `python -m http.server`
3. Bilgisayarınızın IP adresini öğrenin (Terminalde `ipconfig` yazarak, örneğin `192.168.1.20`).
4. Telefonunuzun tarayıcısında `http://192.168.1.20:8000` adresine gidin.

### Yöntem 3: İnternette Yayınlama
GitHub Pages, Netlify veya Vercel gibi ücretsiz servisleri kullanarak bu dosyaları internete yükleyebilir ve linki arkadaşlarınızla paylaşabilirsiniz.
