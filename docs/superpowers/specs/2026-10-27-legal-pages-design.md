# Integritetspolicy och användarvillkor på flightagent.se – design

27 okt 2026 · Timo (beslut) och Claude (förslag)

Det som är märkt "Claudes beslut" kan Timo ändra innan planen görs.

## Syfte

Google-inloggningen i Flightagent står i läget Testing, där bara testanvändare kan logga in. För att publicera appen (Google Auth Platform → Audience → Publish app) och få Googles granskning av varumärket kräver Google en hemsida, en integritetspolicy och användarvillkor på appens egen domän. Timo har redan angett adresserna i Google Cloud:

- Integritetspolicy: `https://www.flightagent.se/privacy` (Timo 27 okt)
- Användarvillkor: `https://www.flightagent.se/terms` (Timo 27 okt)

I dag visar flightagent.se en tillfällig sajt från GoDaddy Website Builder, och www skickar vidare dit. /privacy och /terms ger 404. GoDaddy-sajten är tillfällig och ska ersättas med en egen (Timo 27 okt).

Samma texter behövs senare för App Store, Google Play och länkar i appen.

**Läget i appen:** inloggningen från steg 2 är byggd och provad live på webben (27 okt). Det gäller förnamn, radering av kontot med kod, koder som gäller i 10 minuter och den undanlagda handlingen i 15 minuter. Den ligger på grenen `step-2-login`, och tabellen `profiles` och raderingsfunktionen finns redan i Supabase-projektet. Texterna beskriver det beteendet. Appen är inte publik, och med Google i läget Testing kan bara testanvändare logga in. Sökning, partnerlänkar, provision, språkmodell och slutpris finns inte än (steg 3–7).

## Mål

1. En liten egen webbplats med tre sidor: startsida, integritetspolicy och användarvillkor, på svenska.
2. Båda adresserna ovan svarar med sidorna över https. `https://flightagent.se/...` (utan www) fungerar också.
3. **Personuppgifter beskrivs strikt som appen hanterar dem i dag** och stämmer med koden. **Tjänsten beskrivs som den ska fungera** (AI-agent, bara affiliate, ingen bokning eller betalning, provision som inte påverkar sorteringen), med en tydlig rad överst i båda texterna och på startsidan: "Flightagent är under utveckling. Alla funktioner som beskrivs finns inte ännu." (Timo 28 okt). Texterna uppfyller GDPR:s krav på information (artikel 13) och Googles krav på hur Google-data används.
6. En checklista i repot (`UPDATE-CHECKLIST.md`) visar vilka stycken som ska ses över när varje steg i appen blir klart, till exempel policyn om språkmodellen före steg 3 och om sparade sökningar och bevakningar före steg 7.
4. Båda texterna och startsidan säger tydligt att texterna är ett utkast som ska granskas av en jurist före lansering.
5. Timo har läst och godkänt texterna.

## Inte med

- Engelska versioner (kommer med engelskan i appen).
- Länkar till sidorna inifrån appen (inloggningsrutan, Profil). Det är en egen uppgift i appen senare.
- Att publicera Google-appen. Det gör Timo själv efteråt; planen avslutas med stegen för det.
- Webbversionen av appen. Den läggs upp senare på en EU-plattform. Sidorna kan flytta dit då.
- Cookie-ruta, statistik, kontaktformulär eller nyhetsbrev.
- Juridisk granskning. Den gör en jurist före lansering; Claude är inte jurist.

## Bolagsuppgifter

(Timo 27 okt)

- **Personuppgiftsansvarig och avtalspart:** Live Large AB, org.nr 556695-1108
- **Adress:** Duvvägen 3, 352 73 Växjö
- **E-post:** hello@flightagent.se (tar emot mejl via Microsoft 365, kontrollerat 27 okt)

Bolaget byter namn. Det nuvarande namnet används tills bytet är registrerat. Bolagsnamnet ska vara lätt att hitta och byta på alla sidor (beskrivs i README).

## Var webbplatsen ligger

- **Värd: statichost.eu** (Timo 27 okt). Svenskt företag i Stockholm med europeisk infrastruktur och utan amerikanska molntjänster. Gratisnivån (Hobby: en sajt, 10 GB trafik i månaden) räcker, med egen domän och automatisk https.
- **Eget publikt GitHub-repo**, `timokeihag/flightagent-website` (Claudes beslut, ändrat från "en mapp i app-repot" som Timo godkände i samtalet). Skäl: app-repot är privat, och statichost skulle då få läsrätt till hela appens kod via en nyckel. Ett publikt repo med bara webbplatsen behöver ingen nyckel alls, och texterna är ändå offentliga. Varje push till `main` publicerar sajten. Designen och planen ligger i det repot.
- **Ingen byggprocess:** vanliga HTML- och CSS-filer. `statichost.yml` i repots rot anger bara vilken mapp som publiceras (`public: public`).
- **Adresser utan .html:** sidorna ligger som `privacy/index.html` och `terms/index.html`, så att `/privacy` och `/terms` fungerar på vilken värd som helst.

## DNS hos GoDaddy

Timo har godkänt att två befintliga poster ändras, så att domänen pekar på statichost i stället för GoDaddy-sajten (Timo 27 okt). Inget annat ändras.

| Post | I dag | Efter |
|---|---|---|
| `@` A | 76.223.105.230 och 13.248.243.5 (GoDaddy Website Builder) | 95.217.26.94 (statichost) |
| `@` AAAA | finns inte | 2a01:4f9:c01f:8002:: (statichost, läggs till) |
| `www` CNAME | `@` (flightagent.se) | `SAJTNAMN.statichost.page` |

Värdena kommer från statichosts dokumentation (docs/domains) och kontrolleras igen när planen görs. GoDaddy har inte ALIAS för domänens rot, därför A och AAAA.

**Får inte röras:** MX (Microsoft 365), TXT med SPF och `NETORGFT…onmicrosoft.com`, `_dmarc`, Resends poster (`send` och `resend._domainkey` med flera) och alla övriga poster. Planen tar en ögonblicksbild av alla poster före ändringen och jämför efteråt.

Ordning: domänerna läggs in i statichost först, sedan ändras DNS, så att https-certifikatet skapas så fort trafiken kommer. Om GoDaddy inte låter Timo ändra posterna för att domänen är kopplad till Website Builder kopplas den bort där först.

## Webbplatsen

**Startsidan** (`/`): Flightagent i en mening ("En reseagent som hittar paketresor, flyg och hotell och räknar ut vad resan faktiskt kostar"), att appen är under utveckling, vem som står bakom, kontakt, och länkar till integritetspolicy och villkor. Google kräver att hemsidan beskriver appen och länkar till integritetspolicyn. Inga påhittade funktioner, inga skärmbilder med partnernamn.

**Alla sidor:** sidfot med Live Large AB, org.nr, adress, e-post och länkar till de tre sidorna. `lang="sv"`, rubrik och beskrivning per sida, en enkel 404-sida.

**Utseende:** Flightagents designförslag B i förenklad form. Ljus bakgrund `#FAFAF9`, text `#141515`, dämpad `#6A6F70`, linjer `#E3E5E5`, solgul accent `#E8A23F` sparsamt. Inter Tight som typsnitt. Lättläst textspalt (cirka 680 px), fungerar på 375 px bredd. Policyn och villkoren har en innehållsförteckning överst med länkar till avsnitten.

**Integritet på sajten:** inga kakor, inget JavaScript, inga anrop till andra domäner (typsnittet ligger på sajten, inte hos Google Fonts). Så behövs ingen cookie-ruta (Claudes beslut).

## Integritetspolicyn – innehåll

Texten skrivs på enkel svenska, i du-form. Rubriker ungefär så här:

1. **Utkast-ruta överst:** "Utkast. Texten ska granskas av en jurist innan Flightagent lanseras." Plus "Senast uppdaterad" med datum.
2. **Vem som ansvarar:** Live Large AB med kontaktuppgifter.
3. **Kort om Flightagent:** en AI-agent som rekommenderar resor från partner som betalar provision. Vi säljer inga resor och tar inte emot betalningar.
4. **Vilka uppgifter vi sparar och varför**, per situation:
   - *Konto med e-post:* e-postadress, förnamn om du anger det, inloggningssätt, när kontot skapades och senast loggade in. Engångskoden mejlas och gäller i 10 minuter.
   - *Konto med Google:* från Google får vi e-postadress, namn och länk till profilbild (det Google skickar med behörigheterna `openid`, `email` och `profile`). Förnamnet sparas i profilen. Supabase sparar även uppgifterna från Google tillsammans med kontot. Vi använder dem bara för att skapa och visa ditt konto.
   - *Teknisk information:* IP-adress, tid och typ av händelse i inloggningsloggar hos Supabase, för säkerhet och felsökning.
   - *På din enhet:* inloggningen (så att du förblir inloggad), vald hemmaflygplats, och en handling du påbörjat före inloggning (sparas högst 15 minuter). Det stannar på enheten.
   - *Om du mejlar oss:* det du skriver, för att svara.
   - *Webbplatsen:* inga kakor och ingen statistik. Webbhotellet kan spara tekniska loggar för drift och säkerhet.
5. **Rättslig grund:** avtal (för att ge dig kontot och tjänsten), berättigat intresse (säkerhet, loggar, svara på mejl).
6. **AI-agenten:** agenten är en AI. I dag skickas inga personuppgifter till någon språkmodell. Policyn uppdateras innan det sker, och prompter ska inte användas för att träna modeller där leverantören erbjuder det valet (`CLAUDE.md`, regel 7).
7. **Partner och provision:** när du går vidare till en partner gäller partnerns villkor och integritetspolicy. Vi delar inte dina kontouppgifter med partner. Provisionen påverkar inte hur resor sorteras (`CLAUDE.md`, regel 8).
8. **Vilka som hjälper oss (personuppgiftsbiträden):** Supabase (databas och inloggning, EU, Irland), Resend (mejl med kod, skickas från EU), statichost.eu (webbplatsen, EU), Microsoft (e-post till hello@). Google är självständigt ansvarig för sin del när du väljer Google-inloggning. Vi säljer aldrig personuppgifter och använder dem inte för reklam.
9. **Överföring utanför EU/EES:** vilka leverantörer som är amerikanska bolag eller har underbiträden utanför EU, och vilket skydd som gäller (EU:s standardavtalsklausuler eller EU–US Data Privacy Framework). Byggaren kontrollerar mot leverantörernas egna DPA:er och anger källa i planen.
10. **Hur länge:** kontouppgifterna tills du raderar kontot. Radering i appen tar bort kontot och profilen direkt. Loggar och säkerhetskopior hos Supabase rensas enligt Supabases rutiner (byggaren kontrollerar antal dagar för projektets plan). Mejl till hello@ så länge ärendet kräver.
11. **Dina rättigheter:** tillgång, rättelse, radering (direkt i appen under Profil → Radera kontot), begränsning, invändning och dataportabilitet. Kontakt hello@flightagent.se. Rätt att klaga hos Integritetsskyddsmyndigheten (IMY, imy.se).
12. **Ålder:** tjänsten är för dig som fyllt 16 år (Claudes beslut, juristen bör titta på det).
13. **Googles användardata:** ett eget kort avsnitt som Google kräver: vilka Google-uppgifter vi får, att de bara används för inloggning och kontot, inte delas, inte säljs och inte används för reklam eller för att träna AI-modeller.
14. **Ändringar:** vi uppdaterar policyn när tjänsten ändras och anger datum. Väsentliga ändringar meddelas i appen eller via mejl.

## Användarvillkoren – innehåll

1. **Utkast-ruta och datum**, som i policyn.
2. **Vem som tillhandahåller tjänsten:** Live Large AB med kontaktuppgifter.
3. **Tjänsten:** gratis. Agenten är en AI som söker, jämför och rekommenderar resor. Flightagent visar uppskattade priser (inklusive uppskattat slutpris med bagage och avgifter) som kan avvika från partnerns pris. Partnerns pris i kassan gäller.
4. **Bokning sker hos partnern:** Flightagent bokar inget, tar inte emot betalning och är inte part i avtalet med partnern. Flightagent är inte researrangör och inte återförsäljare enligt paketreselagen. Frågor om bokning, ändring, återbetalning och reklamation går till partnern.
5. **Provision:** partnern kan betala provision när du bokar via Flightagent. Det kostar dig inget extra och påverkar inte sorteringen.
6. **Konto:** frivilligt, för funktioner som att spara och bevaka. Du ansvarar för att e-postadressen är din. Du kan radera kontot när du vill i appen.
7. **Tillåten användning:** inte missbruka tjänsten, inte hämta data automatiskt, inte försöka komma åt andras konton.
8. **Ansvar:** tjänsten tillhandahålls som den är och kan ändras eller ligga nere. Vi ansvarar inte för partnerns tjänster eller för fel i uppgifter från partner. Ansvarsbegränsningen gäller inte där tvingande konsumentlag säger annat.
9. **Immateriella rättigheter:** innehåll och varumärke tillhör Live Large AB eller dess licensgivare. Bilder och texter om resor kommer från partner och källor som anges.
10. **Uppsägning:** du kan radera kontot när som helst. Vi kan stänga konton som bryter mot villkoren.
11. **Ändringar av villkoren:** med datum, väsentliga ändringar meddelas.
12. **Lag och tvist:** svensk lag. Konsumenter kan vända sig till Allmänna reklamationsnämnden (ARN) eller allmän domstol.
13. **Kontakt.**

Byggaren skriver den färdiga texten utifrån dessa punkter, håller den kort och undviker juridisk utfyllnad. I avsnitten om personuppgifter tas allt som inte stämmer med appen i dag bort hellre än gissas. Beskrivningen av tjänsten får beskriva hur den ska fungera, under raden om att den är under utveckling.

## Det Timo gör själv

Planen har numrerade steg, klick för klick:

1. Läsa texterna på förhandsadressen (`SAJTNAMN.statichost.page`) och godkänna eller be om ändringar.
2. Skapa konto på statichost.eu (gratis, utan kort), lägga till sajten från det publika repot och lägga in `flightagent.se` och `www.flightagent.se` som domäner.
3. Ändra de två posterna och lägga till AAAA hos GoDaddy enligt tabellen ovan.
4. Efteråt: publicera Google-appen (Google Auth Platform → Audience → Publish app) och, om Google ber om det, verifiera domänen i Google Search Console (en TXT-post läggs till; inget ändras).
5. Låta en jurist läsa texterna före lansering.

Claude skapar GitHub-repot med `gh` efter Timos godkännande, eftersom det publicerar innehåll.

## Klart när

1. `https://www.flightagent.se/privacy` och `https://www.flightagent.se/terms` svarar 200 med rätt sida och giltigt certifikat. `https://www.flightagent.se/` visar startsidan. Samma sak utan www.
2. Alla poster som inte skulle ändras är oförändrade (jämfört med ögonblicksbilden).
3. Sidorna fungerar på 375 px och cirka 1200 px, har inga kakor och gör inga anrop till andra domäner.
4. Utkastraden och raden om att tjänsten är under utveckling finns på båda texterna, och checklistan finns i repot.
5. Timo har godkänt texterna.

## Får inte hända

- En DNS-post utöver de tre i tabellen ändras eller tas bort, så att mejlen via Microsoft 365 eller Resend slutar fungera.
- Integritetspolicyn säger att personuppgifter behandlas på ett sätt som appen inte gör i dag, eller döljer något den gör.
- Tjänsten beskrivs utan raden om att den är under utveckling.
- Texterna presenteras som juridiskt granskade.
- Sajten laddar något från Google, statistiktjänster eller andra domäner.

## Lämnat åt den som bygger

- Exakta formuleringar inom punkterna ovan, och kontroll av leverantörernas DPA:er, lagringstider och överföringsskydd (med källor).
- HTML-struktur, CSS och hur typsnittet läggs på sajten (licensen för Inter Tight är OFL).
- Sajtnamnet hos statichost.
