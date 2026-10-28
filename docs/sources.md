# Källor för integritetspolicyn och villkoren

Kontrollerat 28 okt 2026. Varje påstående om personuppgifter i `public/privacy/index.html` ska gå att spåra hit. "Obekräftat" betyder att texten är försiktigt skriven och att punkten ska kontrolleras före lansering.

## Appen (repot timokeihag/Flightagent, grenen step-2-login)

| Påstående | Källa |
|---|---|
| `profiles` sparar `id`, `first_name` (högst 50 tecken), `name_asked`, `created_at`, `updated_at`. Förnamn från Google tas från `given_name`, `full_name` eller `name`. | `supabase/migrations/20261027120000_create_profiles.sql` |
| Raden i `profiles` raderas med kontot. | samma migration (`references auth.users on delete cascade`) och designen för steg 2 |
| Supabase Auth sparar e-post, inloggningssätt och de uppgifter Google skickar (namn, profilbildslänk, Googles konto-id) med kontot. | Supabase Auth: `auth.users.raw_user_meta_data`, `auth.identities`; migrationen läser `raw_user_meta_data` |
| Google-inloggningen begär Supabases standardbehörigheter (e-post och profil). Inga extra behörigheter. | `src/features/auth/authApi.ts`, `signInWithOAuth` utan `scopes` |
| Inloggningen sparas på enheten (AsyncStorage, webbläsarens lagring på webben). | `src/lib/supabase.ts` (`persistSession: true`) |
| Hemmaflygplatsen sparas bara på enheten (localStorage/AsyncStorage). | `src/features/search/homeAirport.ts` |
| En påbörjad handling (i dag: bevakningsformulärets från, till, typ och målpris) sparas på enheten i högst 15 minuter. | `src/features/auth/pendingAction.ts` (`PENDING_MAX_AGE_MS = 15 * 60 * 1000`) |
| Engångskoden gäller i 10 minuter. | `supabase/config.toml` (`otp_expiry = 600`) och designen för steg 2 |
| Kontot raderas i appen (Profil → Radera kontot) efter en ny kod, av Edge Function `delete-account` (`auth.admin.deleteUser`). | `supabase/functions/delete-account/index.ts` |
| Inga personuppgifter skickas till någon språkmodell i dag. | Ingen språkmodell finns i appen (steg 3 är inte byggt), `CLAUDE.md` "Ordning att bygga" |
| Bevakningar, sparade sökningar och resor sparas inte på servern i dag. | Designen för steg 2, "Inte med" |

## Leverantörer

| Leverantör | Påstående | Källa |
|---|---|---|
| Supabase | Projektet ligger i `eu-west-1` (Irland). | Projekt `eyvmjflmryjdclqzdgzo`, `CLAUDE.md` |
| Supabase | DPA:n gäller med avtalet; mottagare är Supabase Pte. Ltd (Singapore); överföringar enligt EU:s standardavtalsklausuler (modul 2). | https://supabase.com/legal/dpa |
| Supabase | Pro: dagliga säkerhetskopior sparas 7 dagar. | https://supabase.com/docs/guides/platform/backups, https://supabase.com/pricing |
| Supabase | Pro: loggar sparas 7 dagar. | https://supabase.com/pricing ("7-day log retention") |
| Supabase | Inloggningsloggar innehåller IP-adress. De sparas i Supabases loggverktyg och, om inställningen "Write audit logs to the database" är på, även i tabellen `auth.audit_log_entries`. | https://supabase.com/docs/guides/auth/audit-logs |
| Supabase | **Obekräftat:** om "Write audit logs to the database" är av i projektet. Policyn förutsätter att den är av (annars sparas loggarna i databasen utan slutdatum). Timo kontrollerar (`docs/setup.md`). | — |
| Resend | Mejlen skickas från EU-regionen (Irland), men kontodata, metadata om mejl och loggar lagras i USA. | https://resend.com/docs/dashboard/domains/regions |
| Resend | Plus Five Five, Inc., San Francisco. Överföringar enligt EU:s standardavtalsklausuler; certifierat enligt EU–US Data Privacy Framework. | https://resend.com/legal/dpa (avsnitt 6.2 och 11.1) |
| Resend | Data sparas 30 dagar. | https://resend.com/pricing |
| statichost.eu | Svenskt företag; all behandling inom EU/EES; IP-adressen behandlas för att leverera sidorna; inga personuppgifter om besök sparas. | https://www.statichost.eu/privacy/ |
| Microsoft 365 via GoDaddy | Mejl till hello@ tas emot av Microsoft 365 (MX `flightagent-se.mail.protection.outlook.com`), köpt via GoDaddy. | DNS för flightagent.se, 28 okt |
| Microsoft 365 via GoDaddy | **Obekräftat:** vilket överföringsskydd som gäller i avtalet via GoDaddy. Texten säger "standardavtalsklausuler eller Data Privacy Framework" utan att ange vilket. | — |
| Google | Google är självständigt personuppgiftsansvarigt för inloggningen hos Google. Appen får e-post, namn och profilbild. | Googles OAuth och Supabase Google-inloggning |
| Google | Policyn ska beskriva hur appen kommer åt, använder, lagrar och delar Google-data. | https://developers.google.com/terms/api-services-user-data-policy |
| IMY | Tillsynsmyndighet i Sverige. | https://www.imy.se |
