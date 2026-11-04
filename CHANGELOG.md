# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.0] - 2026-11-04

### 🌟 Changed / Değişenler
- **HACS Plugin Conversion (HACS Eklenti Dönüşümü):**
  - Restructured the repository as a dedicated **HACS Lovelace UI Plugin (Card)** in compliance with HACS default catalog requirements.
  - Repoyu HACS varsayılan katalog standartlarına uyarlayarak bağımsız bir Lovelace Kartı (Plugin) haline getirdi.
- **Decoupled Backend Integration (Entegrasyon Kodlarının Ayrılması):**
  - Removed `custom_components/cosa_thermostat` from the `main` branch to eliminate duplicate domain collisions with existing community integrations.
  - Çakışmaları önlemek adına `custom_components` dizini `main` dalından kaldırıldı.
- **Integration Archive Branch (Entegrasyon Yedek Dalı):**
  - The complete backend Python integration, sensors, and polling enhancements have been safely archived in the [`integration-archive`](https://github.com/alte-dev/ha-cosa-thermostat-liquid-glass/tree/integration-archive) branch for future upstream PRs.
  - Python entegrasyonu, sensör ve polling geliştirmeleri `integration-archive` dalında eksiksiz korundu.
- **Licensing & Attribution (Lisans ve Telif Atfı):**
  - Added upstream copyright notice for Aykut Vurmaz (`aykutvr`) to the `LICENSE` file adhering to MIT License requirements.
  - MIT lisansına orijinal entegrasyon geliştiricisinin telif hakkı satırı eklendi.
- **HACS Configuration (HACS Yapılandırması):**
  - Updated `hacs.json` for plugin distribution (`"filename": "cosa-thermostat-card.js"`).
  - Updated `.github/workflows/validate.yml` to validate against the HACS `plugin` category.
  - Streamlined `copy-dist.js` to target the root and `www/` directories.

### 🔌 Compatibility / Uyumluluk
- Compatible out-of-the-box with [Aykut Vurmaz Cosa Integration (`aykutvr/smartcosa-home-assistant-integration`)](https://github.com/aykutvr/smartcosa-home-assistant-integration) or any generic Home Assistant `climate` entity.
- Topluluk Cosa entegrasyonu ve tüm standart Home Assistant `climate` varlıklarıyla tam uyumluluk sağlandı.

---

## [1.0.0] - 2026-10-27

### 🚀 Initial Release / İlk Yayın
- **Liquid Glass Aesthetic:**
  - Modern frosted glassmorphism styling (`backdrop-filter: blur(36px)`), specular highlight borders, and layered translucent discs.
  - Buzlu cam (Liquid Glassmorphism) efekti, prizmatik kenarlıklar ve katmanlı saydam dairesel cam tasarımı.
- **Dynamic Thermal Aura (Dinamik Termal Parıltı):**
  - Ambient glow adapting to state: fiery amber/ruby for heating/ignition, cyan/arctic-blue for AC cooling, and emerald/obsidian for standby.
  - Isıtma (alev), bekleme ve soğutma durumuna göre dinamik arka plan aurası.
- **Adaptive Light & Dark Themes (Akıllı Açık ve Koyu Tema):**
  - Automatic adaptation to Home Assistant dashboard theme, with manual overrides (`auto`, `light`, `dark`).
  - Home Assistant açık/koyu temasına otomatik uyum ve manuel tema seçeneği.
- **240° Circular Slider (240° Dairesel Kadran):**
  - Touch and mouse draggable arc with 0.1°C / 0.5°C micro-adjustment controls.
  - Dokunmatik ve fare ile sürüklenebilir akıcı dairesel kadran.
- **Dual Mode (Combi Boiler & Air Conditioner):**
  - Dedicated pure Combi view by default (`show_ac: false`) with optional hybrid switcher for AC models (`show_ac: true`).
  - Varsayılan sade kombi görünümü ve opsiyonel klima anahtarlama desteği.
- **Optimistic UI:**
  - Instantaneous visual feedback without waiting for cloud round-trips.
  - Bulut yanıtını beklemeden anında tepki veren arayüz.
