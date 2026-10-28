# Publicera flightagent.se – Timos steg

Klicka i den här ordningen. Del A görs först, del B när du har godkänt texterna, del C sist.

## Del A: statichost.eu

1. Gå till https://www.statichost.eu och klicka **Sign up** (eller **Get started**). Skapa ett konto med din e-post. Gratisnivån (Hobby) räcker, och inget kort behövs.
2. Bekräfta e-postadressen via mejlet från statichost.
3. I statichost: klicka **Add site** (eller **New site**).
4. Som repository anger du:
   `https://github.com/timokeihag/flightagent-website.git`
   Repot är publikt, så ingen nyckel behövs.
5. Som namn på sajten anger du `flightagent`. Om det är upptaget, välj något liknande, till exempel `flightagent-se`. Skriv till mig vilket namn det blev.
6. Spara. Första bygget startar. Vänta tills det står att det är klart (någon minut).
7. Öppna `https://SAJTNAMN.statichost.page` (byt SAJTNAMN mot namnet från steg 5). Där ska Flightagents startsida synas.

Sedan lägger jag till en webhook i GitHub, så att sajten uppdateras av sig själv varje gång texterna ändras. Jag frågar dig först.

### Kontroll i Supabase (en minut)

Integritetspolicyn säger att inloggningsloggar sparas i 7 dagar. Det stämmer bara om de inte också skrivs till databasen.

1. Öppna https://supabase.com/dashboard/project/eyvmjflmryjdclqzdgzo
2. Klicka **Authentication** i menyn till vänster.
3. Under **Configuration**, klicka **Audit Logs**.
4. Om **Write audit logs to the database** är påslaget: slå av det och klicka **Save**. Om det redan är av: inget att göra.
5. Klicka på kugghjulet **Project Settings** längst ner till vänster och sedan **Billing** (eller organisationens **Billing**). Kontrollera att planen heter **Pro**.
6. Skriv till mig vad det stod i steg 4 och 5.

## Del B: domänen hos GoDaddy

Gör det här först när texterna är godkända.

**Först i statichost:**

1. Öppna sajten i statichost → **Settings** → **Domains**.
2. Lägg till `flightagent.se` och spara.
3. Lägg till `www.flightagent.se` och spara.

**Sedan hos GoDaddy:**

4. Logga in på https://www.godaddy.com och gå till **My Products**.
5. Vid **flightagent.se**, klicka **DNS** (eller **Manage DNS**).
6. Leta upp raden med typen **A** och namnet **@**. Om det står **Website Builder** eller **Parked**, eller om det inte går att ändra den: gå till din Website Builder-sajt → **Settings** → koppla bort domänen (eller avpublicera sajten), och kom sedan tillbaka hit.
7. Klicka pennan på A-raden för **@** och ändra värdet till:
   `95.217.26.94`
   Spara. Om det finns en andra A-rad för **@** (värdet `76.223.105.230` eller `13.248.243.5`): ta bort den.
8. Klicka **Add New Record** (eller **Add**). Typ **AAAA**, namn `@`, värde:
   `2a01:4f9:c01f:8002::`
   Spara.
9. Klicka pennan på raden med typen **CNAME** och namnet **www**. Ändra värdet från `@` till:
   `flightagent.statichost.page`
   Spara.
10. **Rör inga andra rader.** MX, TXT, `_dmarc`, `send`, `resend._domainkey`, `autodiscover`, `email` och de andra ska vara kvar precis som de är. De sköter mejlen.
11. Skriv till mig att du är klar. Jag kontrollerar att adresserna fungerar och att inget annat har ändrats. Det kan ta från några minuter upp till en timme innan ändringen syns överallt.

## Del C: publicera Google-appen

1. Öppna https://console.cloud.google.com och välj projektet **Flightagent**.
2. Gå till **Google Auth Platform** → **Branding**.
3. Kontrollera:
   - Application home page: `https://www.flightagent.se`
   - Application privacy policy link: `https://www.flightagent.se/privacy`
   - Application terms of service link: `https://www.flightagent.se/terms`
   - Authorized domains: `flightagent.se`
   Spara om du ändrade något.
4. Om Google ber dig verifiera domänen: följ länken till Google Search Console, välj **Domain**, skriv `flightagent.se` och kopiera TXT-posten som visas. Hos GoDaddy: **Add New Record**, typ **TXT**, namn `@`, värdet du kopierade. Spara, och klicka **Verify** i Search Console. Det här lägger bara till en post; inget ändras.
5. Gå till **Audience** och klicka **Publish app**. Bekräfta.
6. Före lansering: låt en jurist läsa integritetspolicyn och villkoren. Utkastraden tas bort först efter det.
