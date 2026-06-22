# 🎀 Mazuļa svētku vēlmju saraksts

Ar paroli aizsargāta vēlmju saraksta lapa baby shower svētkiem. Viesi var rezervēt
dāvanas, un visi redz, kas jau ir izvēlēts. Lapa darbojas uz **GitHub Pages**
(statiska lapa), bet rezervācijas glabājas bezmaksas **Supabase** datu bāzē.

> A password-protected baby shower gift registry. Guests reserve gifts and everyone
> sees what's already taken. Hosted on GitHub Pages; reservations stored in Supabase.

---

## ⚙️ Iestatīšana 3 soļos

### 1. Supabase datu bāze (rezervāciju glabāšanai)
1. Izveido bezmaksas kontu: https://supabase.com → **New project**.
2. Kad projekts gatavs, atver kreisajā izvēlnē **SQL Editor** → **New query**.
3. Iekopē visu no faila [`supabase-setup.sql`](supabase-setup.sql) un nospied **Run**.
4. Atver **Project Settings → API** un nokopē:
   - **Project URL** (piem. `https://abcd1234.supabase.co`)
   - **anon public** atslēgu (`anon` `public`).

### 2. Aizpildi `config.js`
Atver [`config.js`](config.js) un ieraksti:
```js
password:        "tava-parole",
supabaseUrl:     "https://...supabase.co",
supabaseAnonKey: "eyJ...",        // anon public atslēga
```
Turpat vari pielāgot **dāvanu sarakstu** (`gifts`) un **tekstus** (`texts`).

### 3. Publicē izmaiņas
```bash
git add -A
git commit -m "Atjaunoti iestatījumi"
git push
```
GitHub Pages pāris minūšu laikā atjaunos lapu.

---

## 🔐 Par paroli
Parole tiek pārbaudīta pārlūkā (client-side). Tas ir pietiekami, lai lapa nebūtu
publiski atrodama, taču tehniski zinošs cilvēks paroli var redzēt lapas pirmkodā.
Baby shower vajadzībām tas ir pilnīgi pietiekami. Lapa ir arī atzīmēta ar
`noindex`, lai meklētājprogrammas to nerāda.

## 🎁 Kā pievienot/mainīt dāvanas
Failā `config.js`, masīvā `gifts`. Katrai dāvanai: `id` (unikāls, nemaini pēc
rezervāciju sākuma), `emoji`, `name`, `note` (apraksts), `link` (saite, neobligāta).

## 🗑️ Rezervāciju pārvaldība
Visas rezervācijas redzamas Supabase: **Table Editor → reservations**. Ja vajag
atcelt kādu rezervāciju, vienkārši izdzēs rindu tur.

**Viesi paši var atcelt savu rezervāciju:** rezervējot, pārlūkā tiek saglabāts
slepens tokens. Pie dāvanām, ko viesis rezervējis šajā pašā pārlūkā, parādās poga
**“Atcelt manu rezervāciju”**. Atcelšana notiek caur datu bāzes funkciju
`cancel_reservation`, kas pārbauda tokenu, tāpēc cita cilvēka rezervāciju atcelt
nevar (pat ne caur API — tokens nav publiski nolasāms).

## 💻 Lokāla testēšana
```bash
python3 -m http.server 8000
# atver http://localhost:8000
```
