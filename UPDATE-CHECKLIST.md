# Checklista: när texterna ska ses över

Integritetspolicyn beskriver personuppgifter **som appen hanterar dem i dag**. Villkoren beskriver tjänsten som den ska fungera. När ett steg i appen blir klart: gå igenom avsnitten nedan, uppdatera texten och "Senast uppdaterad", lägg till källor i `docs/sources.md` och kör `node scripts/check.mjs`. Väsentliga ändringar ska meddelas användarna (policyn, avsnitt 12, och villkoren, avsnitt 10).

Avsnitten anges med id, till exempel `privacy#lagring` för avsnittet `id="lagring"` på `/privacy`.

| När | Se över | Vad |
|---|---|---|
| **Före lansering** | allt | Juristgranskning. Ta bort utkastraden först efter den. |
| **Före lansering** | `privacy#lagring`, `privacy#uppgifter` | Kontrollera att "Write audit logs to the database" är av i Supabase (annars sparas inloggningsloggar utan slutdatum), och att projektet har Pro-planens 7 dagar för loggar och säkerhetskopior. |
| **Före lansering** | `privacy#overforing` | Bekräfta överföringsskyddet för Microsoft 365 via GoDaddy (står som obekräftat i `docs/sources.md`). |
| **Före lansering** | `privacy#alder`, `terms#konto` | Juristen bekräftar åldersgränsen 16 år. |
| Steg 3: språkmodell tolkar prompter | `privacy#ai`, `privacy#uppgifter`, `privacy#bitraden`, `privacy#overforing`, `privacy#lagring` | Vilken leverantör, vad som skickas (prompter, filter), om det sparas och hur länge, att träning är avstängd, var leverantören finns. |
| Steg 3: sökhistorik eller preferenser sparas | `privacy#uppgifter`, `privacy#lagring`, `privacy#rattigheter` | Vad agenten vet om användaren och att det kan rättas och tas bort. |
| Steg 4: flygsökning och partnerlänkar (Travelpayouts, KAYAK) | `privacy#partner`, `privacy#bitraden`, `terms#bokning`, `terms#provision` | Vad som skickas till partnern när man klickar vidare (till exempel spårnings-id i länken), vilka partner. |
| Steg 4: Brave Search eller andra källor | `privacy#bitraden` | Om något som användaren skrivit skickas vidare. |
| Steg 5: hotell via Expedia, flyg + hotell | `privacy#partner`, `terms#bokning` | Paketreselagen och sammanlänkade researrangemang (juristen, se `CLAUDE.md` öppna frågor). |
| Steg 6: paketresor från researrangörer | `terms#bokning` | Namn på researrangörer om avtal finns. |
| Steg 7: slutpris och kassakontroll | `terms#tjansten`, `privacy#uppgifter` | Kvoten 5 per månad, vad som sparas om kontrollerna. |
| Steg 7: sparade sökningar, resor, bevakningar, notiser | `privacy#uppgifter`, `privacy#lagring`, `privacy#bitraden` | Vad som sparas på servern, push-notiser (Expo/Apple/Google), delade resor med `share_token`. |
| Apple-inloggning | `privacy#uppgifter`, `privacy#google` (nytt avsnitt för Apple) | Vad Apple skickar (namn bara första gången, dold relay-adress). |
| Webbappen publiceras | `privacy#uppgifter`, `privacy#bitraden` | Var den ligger och om den använder kakor eller lagring. |
| Statistik eller felrapportering i appen | `privacy#uppgifter`, `privacy#bitraden` | Leverantör, vad som samlas in, samtycke om det krävs. |
| Bolagets namnbyte | alla sidor | Sök och ersätt `Live Large AB` (se README). |
