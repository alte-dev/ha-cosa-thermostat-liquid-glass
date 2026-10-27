<p align="center">
  <a href="https://github.com/alte-dev/ha-cosa-thermostat-liquid-glass/releases"><img src="https://img.shields.io/github/v/release/alte-dev/ha-cosa-thermostat-liquid-glass?style=for-the-badge&color=007ec6" alt="Release"></a>
  <a href="https://github.com/hacs/default"><img src="https://img.shields.io/badge/HACS-Custom-41BDF5.svg?style=for-the-badge" alt="HACS"></a>
  <a href="https://github.com/alte-dev/ha-cosa-thermostat-liquid-glass"><img src="https://img.shields.io/badge/UI-Liquid_Glass-ff2a6d.svg?style=for-the-badge" alt="UI"></a>
  <a href="https://github.com/alte-dev/ha-cosa-thermostat-liquid-glass/blob/main/LICENSE"><img src="https://img.shields.io/github/license/alte-dev/ha-cosa-thermostat-liquid-glass?style=for-the-badge" alt="License"></a>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/alte-dev/ha-cosa-thermostat-liquid-glass/main/images/icon.png?v=1.2.0" width="128" height="128" alt="Cosa Termostat Liquid Glass İkonu">
</p>

<h1 align="center">🔥❄️ Home Assistant için Liquid Glass Cosa Termostat Kartı</h1>

<p align="center">
  <a href="README.md">English</a> |
  <a href="README.tr.md"><strong>Türkçe</strong></a>
</p>

Home Assistant için tamamen sıfırdan modernize edilmiş, hem **Kombi (Isıtma)** hem de **Klima (Soğutma/IR)** desteğine sahip gelişmiş **Cosa Akıllı Termostat** entegrasyonu ve **Liquid Glass** Lovelace kartı. **TypeScript**, **Lit** ve **Vite** ile geliştirilmiştir.

---

## 📸 Ekran Görüntüleri & Kart Önizleme

### 🔥 Çalışma Modları

| 🔥 Kombi Isıtma (Varsayılan) | 🌙 Kombi Beklemede (Standby) | ❄️ Klima Soğutma (Opsiyonel) |
|:---:|:---:|:---:|
| <img src="https://raw.githubusercontent.com/alte-dev/ha-cosa-thermostat-liquid-glass/main/images/card-combi-heat.png?v=2.0.1" width="280" alt="Kombi Isıtma Modu" /> | <img src="https://raw.githubusercontent.com/alte-dev/ha-cosa-thermostat-liquid-glass/main/images/card-combi-idle.png?v=2.0.1" width="280" alt="Kombi Beklemede Modu" /> | <img src="https://raw.githubusercontent.com/alte-dev/ha-cosa-thermostat-liquid-glass/main/images/card-ac-cooling.png?v=2.0.1" width="280" alt="Klima Soğutma Modu" /> |

### 🌓 Otomatik Açık (Light) & Koyu (Dark) Tema Desteği

Liquid Glass kartı, Home Assistant panonuzun temasını otomatik olarak algılar; açık temada yüksek kontrastlı koyu tipografi ve buğulu cam, koyu temada ise obsidyen liquid glass ve canlı termal ışıma ile her iki modda da kusursuz bir okunabilirlik sunar:

<p align="center">
  <img src="https://raw.githubusercontent.com/alte-dev/ha-cosa-thermostat-liquid-glass/main/images/themes-comparison.png?v=2.1.0" width="850" alt="Cosa Termostat Açık ve Koyu Tema Karşılaştırması" />
</p>

---

## 🌟 Öne Çıkan Özellikler

- 🌓 **Akıllı Açık & Koyu Tema Uyumu:** Home Assistant arayüz temasını otomatik tespit eder; açık ve koyu modlarda renk ve kontrastı otomatik dengeler (`theme_mode: auto | light | dark`).
- 💎 **Liquid Glassmorphism:** Derin optik arka plan bulanıklığı (`backdrop-filter: blur(36px)`), prizmatik kenar kırılımları ve yüksek çözünürlüklü saydam cam katmanları.
- 🌈 **Dinamik Termal Işıma (Ambient Aura):**
  - **Isıtma Modu:** Kombi gaz yakıp ateşlendiğinde canlı amber/yakut parıltısı ve mikro termal nabız.
  - **Soğutma Modu:** Buzul camgöbeği (cyan) ve elektrik mavisi arktik parıltı.
  - **Beklemede / Kapalı:** Zarif obsidyen cam estetiği.
- 🎛️ **240° Dairesel Hassas Kadran:** Dokunmatik ekran ve fareyle sürüklenebilir akıcı ark, 0.1°C ve 0.5°C mikroadım butonları.
- 🔥 **Varsayılan Olarak Sadece Kombi (Sade Görünüm):** Sadece kombiniz varsa klima seçeneği **tamamen gizlidir** (`show_ac: false`).
- ❄️ **Opsiyonel Klima Soğutma Modu:** Klimalı Cosa modelleri için `show_ac: true` yapılarak Kombi ↔ Klima geçiş çubuğu, fan hızları ve klima modları aktifleştirilebilir.
- ⚡ **Anlık İyimser Yanıt (Optimistic UI):** Bulut API yanıtını beklemeden kart anında tepki verir, gecikme hissi yaşatmaz.
- 🎯 **Önayarlar (Presets):** Ev, Dışarı, Uyku, Kullanıcı, Otomatik ve Haftalık Program.
- 💧 **Ortam Telemetrileri:** Anlık oda sıcaklığı, bağıl nem oranı ve kombi alev/yanma durumu.
- 📦 **Otomatik Kart Servisi:** Entegrasyon kurulduğunda kart dosyası otomatik olarak `/cosa_thermostat/cosa-thermostat-card.js` adresinden sunulur.

---

## 🚀 Kurulum

### Yöntem 1: HACS (Önerilen)
1. Home Assistant'ta **HACS** > **Entegrasyonlar** menüsüne gidin.
2. Sağ üstteki üç noktaya tıklayıp **Özel Depolar (Custom repositories)** seçeneğini açın.
3. Depo URL adresinizi girin ve kategori olarak **Integration** seçin.
4. "Cosa Smart Thermostat"ı bulup **İndir** butonuna tıklayın.
5. Home Assistant'ı yeniden başlatın.

### Yöntem 2: Manuel Kurulum
1. `custom_components/cosa_thermostat` klasörünü Home Assistant kurulumunuzdaki `config/custom_components/` dizinine kopyalayın.
2. `www/cosa-thermostat-card.js` dosyasını `config/www/` dizinine kopyalayın.
3. Home Assistant'ı yeniden başlatın.

---

## ⚙️ Yapılandırma

1. Home Assistant'ta **Ayarlar** > **Cihazlar & Hizmetler** bölümüne gidin.
2. Sağ alttaki **Entegrasyon Ekle** butonuna tıklayın.
3. **Cosa Smart Thermostat** araması yapın.
4. Cosa mobil uygulamasında kayıtlı **E-posta** ve **Şifrenizi** girin.
5. Listelenen Cosa cihazınızı seçip onaylayın.

---

## 🎨 Lovelace Kartı Tanımlama

Home Assistant panonuzda (Dashboard) **Kart Ekle** > **Manuel** seçip aşağıdaki YAML kodunu yapıştırın:

### 1. Sadece Kombi Termostatı (Varsayılan - Klima Yok):
```yaml
type: custom:cosa-thermostat-card
entity: climate.cosa_thermostat
name: Salon Kombi Termostatı
temp_step: 0.5
show_ac: false  # Varsayılan: false (soğutma seçeneği gizlidir)
show_ambient_glow: true
```

### 2. Hem Kombi Hem Klima (Hibrit Model):
```yaml
type: custom:cosa-thermostat-card
entity: climate.cosa_thermostat
ac_entity: climate.cosa_thermostat_ac
name: Salon Termostat & Klima
temp_step: 0.5
show_ac: true   # Kombi / Klima geçiş çubuğunu aktifleştirir
show_ambient_glow: true
```

### Kart Parametreleri:
| Parametre | Tip | Varsayılan | Açıklama |
| :--- | :--- | :--- | :--- |
| `type` | `string` | **Zorunlu** | `custom:cosa-thermostat-card` |
| `entity` | `string` | **Zorunlu** | Kombi iklim varlığı (`climate.cosa_thermostat`) |
| `name` | `string` | `Cosa Kombi Termostatı` | Kart üzerinde görünecek özel başlık |
| `show_ac` | `boolean` | `false` | **Klima seçeneği.** Sadece kombiniz varsa `false` bırakın (soğutma arayüzü gizlenir). |
| `ac_entity` | `string` | `null` | Opsiyonel Klima iklim varlığı (`climate.cosa_thermostat_ac`) |
| `temp_step` | `number` | `0.5` | Kadran ve butonlar için sıcaklık adımı (`0.1` veya `0.5`) |
| `show_ambient_glow` | `boolean` | `true` | Isınma durumuna göre arkadaki parıltı halesini gösterir |
| `liquid_glass` | `boolean` | `true` | Buzlu cam (Liquid Glass) efekti. Standart Home Assistant kart görünümü için `false` yapabilirsiniz. |
| `theme_mode` | `string` | `auto` | Tema modu: `auto` (Home Assistant açık/koyu temasına göre otomatik), `light` (açık tema) veya `dark` (koyu tema). |
| `glass_style` | `string` | `liquid-glass` | Cam efekti stili (`liquid-glass`) |

---

## 💻 Geliştirici & Build Rehberi

**Node.js**, **TypeScript**, **Lit** ve **Vite** ile geliştirilmiştir:

```bash
# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusu (Vite HMR):
npm run dev

# Üretim için derleme (TypeScript + Vite + Otomatik Dağıtım):
npm run build
```

`npm run build` komutu `dist/` klasörüne derler ve dosyaları otomatik olarak `cosa-thermostat-card.js`, `www/` ve `custom_components/cosa_thermostat/frontend/` dizinlerine kopyalar.

---

## ⚖️ Lisans

Bu proje **MIT Lisansı** ile lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına göz atabilirsiniz.

*Not: Bu entegrasyon ve arayüz bağımsız bir topluluk projesidir. Cosa markası Nuvia A.Ş.'ye aittir.*
