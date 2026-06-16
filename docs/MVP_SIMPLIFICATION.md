# berc — Basitleştirilmiş MVP Planı

> **Amaç:** Uygulamayı olabildiğince basit ve kolay kullanılabilir hale getirmek.  
> Kullanıcı ana sayfada yalnızca **tek bir kişiyi** görür, karar verir, sonraki kişiye geçer.  
> Filtreleme ve gelişmiş özellikler **sonraya** bırakılır.

---

## 1. Ürün felsefesi

berc bir feed veya liste uygulaması değildir.

**Tek cümle:**

> Bugün sana **1 koşucu** gösteriyoruz. Beğen veya geç. Sonra bir sonraki.

Bu yaklaşım:

- Karar yorgunluğunu azaltır
- Keşfi hızlandırır
- Dating hissi verir ama **koşu odaklı** kalır (match/like dili yok)

---

## 2. Ana sayfa (Home)

### Kullanıcı ne görür?

- Tam ekran **tek bir kullanıcı profili**
- Yukarıdan aşağı scroll:
  - Fotoğraflar (profil + koşu görselleri)
  - Kısa bio
  - Koşu bilgisi (tarih, mesafe, pace, vibe)

### Kullanıcı ne yapar?

| Aksiyon | Sonuç |
|---------|--------|
| **Pass (X)** | Sonraki kişiye geç |
| **Invite / Join run** | Davet gönder → sonraki kişiye geç |

### Ana sayfada OLMAYACAKLAR (şimdilik)

- Filtre paneli
- Category chip’leri
- Çoklu kart listesi
- Dikey scroll ile kişi değiştirme
- Radius / gender / distance filtreleri

---

## 3. Tab bar (minimum)

### Önerilen yapı — Seçenek A (en basit)

| Tab | İşlev |
|-----|--------|
| **Home** | Tek kişi keşfi |
| **Profile** | Kendi hesabın + ayarlar |

**2 tab.** Create, People, Chats bu aşamada yok.

### Alternatif — Seçenek B

| Tab | İşlev |
|-----|--------|
| **Home** | Tek kişi keşfi |
| **Create** | Koşu oluştur (orta, turuncu) |
| **Profile** | Kendi hesabın |

**3 tab.** Keşif + koşu oluşturma bir arada.

---

## 4. Gizlenecek / sonraya bırakılacak özellikler

| Özellik | Durum | Neden |
|---------|--------|--------|
| Feed filtreleri | v2 | Karmaşıklık |
| Category chips | v2 | Karmaşıklık |
| People tab | v2 | Home zaten keşif yapıyor |
| Invitations sayfası | v2 | Davet sonrası kısa feedback yeter |
| Chat listesi | v2 | MVP’de şart değil |
| Çoklu kullanıcı listesi (UI) | Arka planda kalır | Sırayla tek tek gösterilir |

---

## 5. Kalacak çekirdek özellikler

1. **Auth + onboarding** (mümkün olduğunca kısa)
2. **Home:** tek profil, Pass + Invite
3. **Kendi profil sayfası** (tab veya profile stack)
4. **Mock veri** ile simulator’da çalışma (Supabase olmadan)

---

## 6. Kullanıcı akışı

```
Uygulama açılır
    ↓
Home — 1 kişi gösterilir
    ↓
    ├─ X (Pass)        → sonraki kişi
    └─ Invite          → davet + sonraki kişi
    ↓
Profile tab          → kendi hesabını gör / düzenle
```

---

## 7. Teknik uygulama planı

### Faz 1 — UI sadeleştirme

- [ ] `feed/index` yalnızca `currentUser` göstersin (liste yok)
- [ ] Header: `berc` + şehir; filtre ikonu kaldır
- [ ] Tab bar: Seçenek A veya B’ye göre sadeleştir
- [ ] People, Chats, Invitations tab’larını gizle (`href: null`)

### Faz 2 — State sadeleştirme

- [ ] `reviewedIds` ile sıradaki kişiyi belirle
- [ ] Filtre state’ini dondur veya kaldır (`runsStore` gender/distance/category)
- [ ] Mock kullanıcılar arka planda kalır; UI tek kişi gösterir

### Faz 3 — v2 (sonra)

- [ ] Filtreler
- [ ] Invitations sayfası
- [ ] Chat
- [ ] People discovery (ayrı tab veya Home içi)

---

## 8. Dil ve ton

Dating uygulaması gibi **görünebilir**, ama dil **koşu odaklı** kalmalı:

| Kullan | Kullanma |
|--------|----------|
| Invite to run | Match |
| Pass | Swipe left |
| Join run | Like |
| Runner | Date |

---

## 9. Riskler ve dikkat noktaları

| Risk | Çözüm |
|------|--------|
| Çok boş hissedebilir | En az 10 mock kullanıcı; Pass/Invite döngüsü akıcı olsun |
| Dating algısı | CTA ve metinler koşu odaklı |
| Create run nerede? | Seçenek A’da Profile içinden; Seçenek B’de orta tab |

---

## 10. Karar bekleyen sorular

Uygulamaya geçmeden önce netleştirilmeli:

1. **Tab bar:** 2 tab (Home + Profile) mi, 3 tab (Home + Create + Profile) mi?
2. **Invite sonrası:** Direkt sonraki kişi mi, yoksa kısa “Invite sent ✓” feedback sonra mı?

---

## 11. Özet

| Önceki durum | Hedef |
|--------------|--------|
| Feed listesi, filtreler, çoklu tab | Tek kişi, 2 aksiyon, 2–3 tab |
| Karmaşık keşif | Basit: gör → karar ver → devam |
| Her şey bir anda | Önce core, sonra v2 |

**Sonuç:** berc, “yakınındaki koşucuları tek tek keşfet” deneyimine odaklanır. Basit, hızlı, net.

---

*Son güncelleme: Haziran 2026 — henüz kod değişikliği yapılmadı, yalnızca plan.*
