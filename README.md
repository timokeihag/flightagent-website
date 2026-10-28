# flightagent.se

Webbplatsen för Flightagent: startsida, integritetspolicy (`/privacy`) och användarvillkor (`/terms`). Vanlig HTML och CSS, utan byggsteg.

Texterna är ett utkast som ska granskas av en jurist innan Flightagent lanseras.

## Publicering

[statichost.eu](https://www.statichost.eu) publicerar mappen `public/` varje gång något pushas till `main` (inställningen ligger i `statichost.yml`).

## Kontrollera sidorna

```bash
node scripts/check.mjs
```

Skriptet kontrollerar bland annat att utkastraden och raden om att tjänsten är under utveckling finns, att bolagsuppgifterna står i sidfoten, att interna länkar fungerar och att inget laddas från andra domäner. Kör det före varje push.

Förhandsvisa lokalt:

```bash
python -m http.server 8090 --directory public
```

## Byta bolagsnamn

Bolagsnamnet står i sidfoten på alla sidor och i texterna. Sök och ersätt `Live Large AB` i `public/` och i `scripts/check.mjs`, uppdatera "Senast uppdaterad" i policyn och villkoren, och kör kontrollen.

## När appen ändras

`UPDATE-CHECKLIST.md` visar vilka avsnitt som ska ses över när ett nytt steg i appen blir klart.

## Typsnitt

Inter Tight, SIL Open Font License 1.1 (`LICENSE-fonts/OFL.txt`).
