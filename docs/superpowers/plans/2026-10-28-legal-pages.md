# Integritetspolicy och villkor på flightagent.se – plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** En statisk webbplats med startsida, `/privacy` och `/terms` på svenska, publicerad via statichost.eu på www.flightagent.se och flightagent.se.

**Architecture:** Vanlig HTML och en CSS-fil i ett eget publikt GitHub-repo, `timokeihag/flightagent-website`, utan byggsteg. statichost.eu publicerar mappen `public/` vid varje push till `main`. Ett litet Node-skript utan beroenden (`scripts/check.mjs`) kontrollerar sidorna, och det är det som körs som test.

**Tech Stack:** HTML, CSS, Inter Tight (TTF, OFL-1.1) på sajten, Node 20+ för kontrollskriptet, `gh` för GitHub, statichost.eu, DNS hos GoDaddy.

**Spec:** `2026-10-27-legal-pages-design.md` (godkänd av Timo 28 okt). Den kopieras till repot i uppgift 1 och ligger sedan i `docs/superpowers/specs/`.

## Global Constraints

- Lokal mapp: `C:\Users\timok\projects\flightagent-website`. App-repot `C:\Users\timok\projects\travelagent` används bara för att läsa. Byt aldrig gren där, och committa ingenting där.
- Allt på sajten är på svenska, `lang="sv"`. Commit-meddelanden och filnamn skrivs på engelska.
- Bolaget: `Live Large AB`, org.nr `556695-1108`, `Duvvägen 3, 352 73 Växjö`, `hello@flightagent.se`.
- Exakta rader överst i policyn och villkoren (och raden om utveckling även på startsidan):
  - `Utkast. Texten ska granskas av en jurist innan Flightagent lanseras.`
  - `Flightagent är under utveckling. Alla funktioner som beskrivs finns inte ännu.`
- Personuppgifter beskrivs bara som appen hanterar dem i dag. Tjänsten får beskrivas som den ska fungera.
- Inga `<script>`, inga kakor, inga resurser (`src`, `<link href>`, CSS `url()`) från andra domäner. Vanliga länkar (`<a href>`) till andra sajter är tillåtna.
- Färger: bakgrund `#FAFAF9`, yta `#FFFFFF`, text `#141515`, dämpad `#6A6F70`, linjer `#E3E5E5`, sol `#E8A23F`, mjuk sol `#FBF1E1`, text på sol `#7A4800`. Typsnitt Inter Tight. Textspalt högst cirka 680 px. Ska fungera på 375 px.
- DNS: bara posterna `@` A, `@` AAAA och `www` CNAME ändras eller läggs till. Ögonblicksbild före ändringen: `dns-snapshot-2026-10-28.txt` i anteckningsmappen.
- Det som publicerar eller ändrar något utanför datorn (skapa repot, push, webhook) görs först när Timo har sagt ja i chatten.

## Review Focus

1. **`/privacy` utan snedstreck på slutet:** Google har adressen utan `/`. Den ska svara med sidan eller med 301 till `/privacy/`, aldrig 404. Kontrolleras live i uppgift 4 och 5.
2. **www och utan www:** båda ska ge sidorna med giltigt certifikat. Kontrolleras i uppgift 5.
3. **Smal skärm 375 px:** långa ord ("personuppgiftsbiträdesavtal"), e-postadresser och innehållsförteckningen får inte ge vågrät rullning. `overflow-wrap: anywhere` på brödtext. Kontrolleras med skärmbild i uppgift 1 och 2.
4. **Påståenden som inte stämmer med appen:** varje uppgift om personuppgifter i policyn ska gå att peka ut i koden eller i en leverantörs dokumentation. Kontrolleras via `docs/sources.md` i uppgift 2.
5. **Bolagsnamnet byts:** ett namnbyte ska gå att göra med en enda sök-och-ersätt. `check.mjs` kontrollerar att namnet och org.nr finns i sidfoten på alla sidor.

---

### Task 1: Repo, utseende, startsida och kontrollskript

**Files:**
- Create: `statichost.yml`, `README.md`, `.gitignore`, `LICENSE-fonts/OFL.txt`
- Create: `public/index.html`, `public/404.html`, `public/styles.css`, `public/fonts/InterTight-400.ttf`, `public/fonts/InterTight-600.ttf`
- Create: `scripts/check.mjs`
- Create: `docs/superpowers/specs/2026-10-27-legal-pages-design.md`, `docs/superpowers/plans/2026-10-28-legal-pages.md` (kopior från anteckningsmappen)

**Interfaces:**
- Produces: sidmallen som uppgift 2 och 3 följer: `<header>` med ordmärket "Flightagent" som länk till `/`; `<main class="doc">`; `<footer>` med bolagsuppgifterna och länkarna `/`, `/privacy`, `/terms`. CSS-klasserna `.notice` (gul ruta för de två raderna överst), `.toc` (innehållsförteckning) och `.updated` (datumraden).
- Produces: `node scripts/check.mjs` returnerar 0 när allt stämmer, annars 1 och en rad per fel. Kontrollerar `public/index.html`, `public/404.html`, `public/privacy/index.html` och `public/terms/index.html`, när de finns i `REQUIRED_PAGES`.

- [ ] **Step 1: Skapa mappen och git**

`git init -b main` i `C:\Users\timok\projects\flightagent-website`. `statichost.yml` innehåller bara `public: public`. Kopiera design och plan till `docs/`.

- [ ] **Step 2: Skriv kontrollskriptet (testet) först**

`scripts/check.mjs`, Node utan beroenden. `REQUIRED_PAGES` innehåller `index.html` och `404.html` (uppgift 2 och 3 lägger till sina sidor). Det ska kontrollera, per sida:
- att filen finns och har `<html lang="sv">`, `<title>` och `<meta name="description">`
- att den inte innehåller `<script`
- att inga `src=`, `<link ... href=` eller `url(` i HTML eller `styles.css` börjar med `http:`, `https:` eller `//`
- att sidfoten innehåller `Live Large AB`, `556695-1108`, `Duvvägen 3, 352 73 Växjö` och `hello@flightagent.se`, och länkar till `/privacy` och `/terms`
- att `index.html` innehåller raden om att tjänsten är under utveckling och länkar till `/privacy`
- att interna länkar (`href="/..."`) pekar på en sida som finns i `public/`

- [ ] **Step 3: Kör testet och se att det misslyckas**

Run: `node scripts/check.mjs`
Expected: exit 1, med fel om att `public/index.html` saknas.

- [ ] **Step 4: Bygg CSS, typsnitt, startsida och 404**

Kopiera `InterTight_400Regular.ttf` och `InterTight_600SemiBold.ttf` från `C:\Users\timok\projects\travelagent\node_modules\@expo-google-fonts\inter-tight\` och dess `LICENSE_FONT` till `LICENSE-fonts/OFL.txt`. Ladda typsnitten med `@font-face` och `font-display: swap`.

Startsidan har rubriken "Flightagent", ingressen "En reseagent som hittar paketresor, flyg och hotell och räknar ut vad resan faktiskt kostar.", raden om att tjänsten är under utveckling, två meningar om hur tjänsten fungerar (AI-agent, bokning hos partner, provision som inte påverkar sorteringen), kontakt och länkar till policyn och villkoren. `404.html` har texten "Sidan finns inte." och en länk till startsidan.

- [ ] **Step 5: Kör testet och se att det går igenom**

Run: `node scripts/check.mjs`
Expected: exit 0, `check ok (2 pages)`.

- [ ] **Step 6: Titta på sidan i webbläsaren**

Öppna `public/index.html` i webbläsarpanelen (`file://`). Ta skärmbilder i 375 px och 1200 px. Ingen vågrät rullning.

- [ ] **Step 7: README och commit**

README, kort och på svenska: vad repot är, att statichost publicerar `public/` vid push till `main`, hur man kör `node scripts/check.mjs`, och hur bolagsnamnet byts (sök och ersätt `Live Large AB` i `public/`).

```bash
git add -A
git commit -m "feat: add site skeleton, start page and page checks"
```

### Task 2: Integritetspolicyn

**Files:**
- Create: `public/privacy/index.html`, `docs/sources.md`
- Modify: `scripts/check.mjs` (lägg till sidan och dess kontroller)

**Interfaces:**
- Consumes: sidmallen och CSS-klasserna från uppgift 1.
- Produces: avsnitts-id:n som andra sidor och appen kan länka till: `ansvarig`, `uppgifter`, `rattslig-grund`, `ai`, `partner`, `bitraden`, `overforing`, `lagring`, `rattigheter`, `alder`, `google`, `andringar`.

- [ ] **Step 1: Utöka kontrollskriptet**

Lägg till `privacy/index.html` i `REQUIRED_PAGES`. För den sidan ska skriptet dessutom kontrollera att båda raderna överst finns, att `Senast uppdaterad` finns, att alla tolv id:n ovan finns, att varje id har en länk i `.toc`, och att `imy.se` och `Profil` (radering i appen) nämns.

- [ ] **Step 2: Kör testet och se att det misslyckas**

Run: `node scripts/check.mjs`
Expected: exit 1, `privacy/index.html` saknas.

- [ ] **Step 3: Kontrollera fakta och skriv ner källorna i `docs/sources.md`**

Med en källa (adress och datum) för varje punkt:
- I koden (läs i `C:\Users\timok\projects\travelagent`, grenen `step-2-login`, med `git show step-2-login:<sökväg>`): vad `profiles` sparar (`supabase/migrations/20261027120000_create_profiles.sql`), vad som sparas på enheten (`src/features/auth/pendingAction.ts`, `src/features/search/homeAirport.ts`, `src/lib/supabase.ts`), vilka Google-behörigheter som begärs, och att `supabase/functions/delete-account` raderar kontot.
- Supabase: region `eu-west-1` (Irland), hur länge inloggningsloggar och säkerhetskopior sparas för projektets plan, och överföringsskyddet i Supabases DPA och lista över underbiträden.
- Resend: att utskick sker från EU-regionen, att Resend är ett amerikanskt bolag och vilket överföringsskydd DPA:n anger.
- statichost.eu: vilka loggar som sparas och hur länge (deras integritetspolicy och DPA).
- Microsoft 365 för hello@: att Microsoft är biträde och omfattas av EU Data Boundary och DPF eller standardavtalsklausuler.
- Google: vilka uppgifter `openid email profile` ger, och Googles krav i "OAuth 2.0 Policies" och "Google API Services User Data Policy".

Om något inte går att bekräfta står det i `sources.md` som obekräftat, och texten skrivs försiktigt ("kan spara") eller utan påståendet.

- [ ] **Step 4: Skriv `public/privacy/index.html`**

Följ designens avsnitt 1–14 under "Integritetspolicyn – innehåll", i den ordningen, med id:n enligt Interfaces. Du-form, enkel svenska, korta stycken och punktlistor. "Senast uppdaterad" är dagens datum. Bolagsuppgifterna står i avsnittet `ansvarig` och i sidfoten.

- [ ] **Step 5: Kör testet och se att det går igenom**

Run: `node scripts/check.mjs`
Expected: exit 0, `check ok (3 pages)`.

- [ ] **Step 6: Skärmbilder i 375 px och 1200 px**, ingen vågrät rullning.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add the privacy policy draft with sources"
```

### Task 3: Användarvillkoren och checklistan

**Files:**
- Create: `public/terms/index.html`, `UPDATE-CHECKLIST.md`
- Modify: `scripts/check.mjs`

**Interfaces:**
- Consumes: sidmallen från uppgift 1, och id:n `ai`, `partner` och `uppgifter` i policyn för korslänkar.
- Produces: id:n `leverantor`, `tjansten`, `bokning`, `provision`, `konto`, `anvandning`, `ansvar`, `immateriella`, `uppsagning`, `andringar`, `lag`, `kontakt`.

- [ ] **Step 1: Utöka kontrollskriptet**

Lägg till `terms/index.html` med samma kontroller som policyn: båda raderna, datum, de tolv id:n och länkar i `.toc`. Dessutom ska `paketreselagen` och `Allmänna reklamationsnämnden` nämnas, och sidan ska länka till `/privacy`.

- [ ] **Step 2: Kör testet och se att det misslyckas**

Run: `node scripts/check.mjs`
Expected: exit 1, `terms/index.html` saknas.

- [ ] **Step 3: Skriv `public/terms/index.html`**

Följ designens avsnitt 1–13 under "Användarvillkoren – innehåll". Tjänsten beskrivs som den ska fungera. Ansvarsbegränsningen säger uttryckligen att den inte gäller där tvingande konsumentlag säger annat.

- [ ] **Step 4: Skriv `UPDATE-CHECKLIST.md`**

En tabell med steg i appen (3 språkmodell och prompter, 4 flygsökning och partnerlänkar, 5 hotell, 6 paketresor, 7 slutpris, kassakontroll, sparade sökningar, bevakningar och notiser, Apple-inloggning, webbappen publiceras, bolagets namnbyte) och vilka avsnitt (id) i policyn och villkoren som ska ses över för varje steg.

- [ ] **Step 5: Kör testet och se att det går igenom**

Run: `node scripts/check.mjs`
Expected: exit 0, `check ok (4 pages)`.

- [ ] **Step 6: Skärmbilder i 375 px och 1200 px, och commit**

```bash
git add -A
git commit -m "feat: add the terms draft and the update checklist"
```

### Task 4: Publicera på statichost (förhandsadress)

**Files:**
- Create: `docs/setup.md` (Timos steg, numrerade, klick för klick)

- [ ] **Step 1: Fråga Timo innan repot skapas**

Fråga i chatten: "Får jag skapa det publika repot timokeihag/flightagent-website och pusha?" Vänta på ja.

- [ ] **Step 2: Skapa repot och pusha**

Run: `gh repo create timokeihag/flightagent-website --public --source . --push --description "Flightagent website: start page, privacy policy and terms"`
Expected: repots adress skrivs ut, och `git status -sb` visar `main...origin/main`.

- [ ] **Step 3: Skriv `docs/setup.md` del A och skicka stegen till Timo**

Numrerade steg: skapa ett gratiskonto på statichost.eu; Add site; repo-adressen `https://github.com/timokeihag/flightagent-website.git`; sajtnamn `flightagent` (eller nästa lediga); vänta på första bygget; öppna `https://SAJTNAMN.statichost.page`. Timo berättar vilket sajtnamn det blev.

- [ ] **Step 4: Webhook för automatisk publicering**

Fråga Timo om Claude får lägga till webhooken. Efter ja:
Run: `gh api repos/timokeihag/flightagent-website/hooks -f name=web -F active=true -f "events[]=push" -f config[url]=https://builder.statichost.eu/SAJTNAMN -f config[content_type]=json`
Expected: JSON med `"active": true`.

- [ ] **Step 5: Kontrollera förhandsadressen**

Run: `curl -sI https://SAJTNAMN.statichost.page/privacy` och samma för `/terms`, `/`, `/finns-inte`.
Expected: `/privacy` och `/terms` ger 200 eller 301 till adressen med snedstreck, som sedan ger 200. `/` ger 200 och `/finns-inte` ger 404 med vår 404-sida. Gör en liten ändring i README, pusha och se att bygget startar av sig själv.

- [ ] **Step 6: Timo läser texterna**

Skicka förhandslänkarna. Påminn om att texterna är ett utkast som en jurist ska läsa före lansering. Rätta det Timo ber om, kör `node scripts/check.mjs`, committa (`fix: …`), pusha och visa igen. Klart när Timo skriver att texterna är godkända.

### Task 5: Domänen

**Files:**
- Modify: `docs/setup.md` (del B: GoDaddy och statichost-domäner)

- [ ] **Step 1: Skriv del B och skicka stegen till Timo**

Numrerade steg:
1. statichost: sajten → Settings → Domains → lägg till `flightagent.se` och `www.flightagent.se`.
2. GoDaddy: My Products → flightagent.se → DNS. Om A-posten för `@` är låst som "Website Builder" kopplar du först bort domänen från Website Builder (Website Builder → Settings → domain) eller avpublicerar sajten där.
3. Ändra A-posten `@` till `95.217.26.94` och ta bort den andra A-posten för `@` om det finns två (76.223.105.230 och 13.248.243.5).
4. Lägg till AAAA `@` med värdet `2a01:4f9:c01f:8002::`.
5. Ändra CNAME `www` från `@` till `SAJTNAMN.statichost.page`.
6. Rör inga andra poster (MX, TXT, `_dmarc`, `send`, `resend._domainkey`, `autodiscover`, `email` med flera).

Kontrollera värdena mot `https://www.statichost.eu/docs/domains/` samma dag innan stegen skickas.

- [ ] **Step 2: Vänta på att DNS slår igenom och kontrollera**

Run: `nslookup flightagent.se 8.8.8.8`, `nslookup -type=AAAA flightagent.se 8.8.8.8` och `nslookup -type=CNAME www.flightagent.se 8.8.8.8`
Expected: `95.217.26.94`, `2a01:4f9:c01f:8002::` och `SAJTNAMN.statichost.page`.

- [ ] **Step 3: Jämför med ögonblicksbilden**

Kör samma frågor som i `dns-snapshot-2026-10-28.txt` och jämför. Expected: allt är identiskt utom A och AAAA för `@` och CNAME för `www`.

- [ ] **Step 4: Kontrollera de riktiga adresserna**

Run: `curl -sIL https://www.flightagent.se/privacy`, `https://www.flightagent.se/terms`, `https://www.flightagent.se/` och samma utan www.
Expected: slutar med `HTTP/… 200`, inga certifikatfel, och sidan är vår (rubriken "Integritetspolicy" respektive "Användarvillkor").

### Task 6: Lämna över till Timo

- [ ] **Step 1: Del C i `docs/setup.md`, Timos nästa steg**

1. Google Auth Platform → Branding: kontrollera att hemsidan är `https://www.flightagent.se`, integritetspolicyn `https://www.flightagent.se/privacy`, villkoren `https://www.flightagent.se/terms` och att `flightagent.se` är en auktoriserad domän.
2. Om Google ber om det: verifiera domänen i Google Search Console med en ny TXT-post (läggs till, inget ändras).
3. Audience → Publish app.
4. Låt en jurist läsa texterna före lansering.

Commit och push (`docs: add the setup steps`).

- [ ] **Step 2: Anteckning i anteckningsmappen** med läget, repots adress och sajtnamnet, för sessionen för steg 2.
