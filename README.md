# TechLingo

TechLingo är ett fullstackprojekt byggt med **ASP.NET Core/.NET 10**, **React**, **TypeScript**, **Vite** och **MongoDB**.

Projektet består av:

- `backend/TechLingo.Api` – ASP.NET Core Web API
- `backend/TechLingo.Core` – domänmodeller, DTO:er, repositories, services, seeders och MongoDB-konfiguration
- `backend/TechLingo.Tests` – xUnit-tester
- `frontend` – React + TypeScript + Vite
- Playwright + Gherkin/BDD för scenariobaserade frontendtester

> **Viktigt:** En ny klon av projektet går inte att starta direkt utan lokal konfiguration.  
> Du behöver skapa frontendens `.env`, konfigurera backendens **.NET User Secrets** och vid behov uppdatera **CORS** om frontend körs via en annan nätverksadress.

---

## Förutsättningar

Installera följande:

- Git
- .NET 10 SDK
- Node.js i aktuell LTS-version
- npm
- Tillgång till projektets MongoDB-databas
- VS Code eller Visual Studio

Kontrollera installationerna:

```powershell
git --version
dotnet --version
node --version
npm --version
```

---

## 1. Klona projektet

```powershell
git clone <REPO-URL>
cd TechLingo
code .
```

---

# Lokal konfiguration

## 2. Frontend – skapa `.env`

Frontend läser API-adressen från miljövariabeln:

```text
VITE_API_URL
```

Filen `.env` ligger inte i Git och måste därför skapas manuellt på varje dator.

Skapa:

```text
frontend/.env
```

### Om frontend och backend körs på samma dator

```env
VITE_API_URL=http://localhost:5121/api
```

### Om frontend öppnas från en annan dator/enhet i nätverket

Använd IP-adressen till datorn där TechLingo körs:

```env
VITE_API_URL=http://DIN-IP-ADRESS:5121/api
```

Exempel:

```env
VITE_API_URL=http://192.168.1.50:5121/api
```

> Starta om Vite efter att `.env` har ändrats.

---

## 3. Backend – konfigurera .NET User Secrets

Backend kräver lokal konfiguration för MongoDB och JWT.

Projektet har redan ett `UserSecretsId` i:

```text
backend/TechLingo.Api/TechLingo.Api.csproj
```

Du behöver därför **inte** köra `dotnet user-secrets init` efter att du har klonat repot.

Gå till API-projektet:

```powershell
cd backend/TechLingo.Api
```

Lägg in MongoDB-anslutningen:

```powershell
dotnet user-secrets set "MongoDb:ConnectionString" "DIN-MONGODB-CONNECTION-STRING"
```

Lägg in databasnamnet:

```powershell
dotnet user-secrets set "MongoDb:DatabaseName" "TechLingo"
```

Lägg in JWT-nyckeln:

```powershell
dotnet user-secrets set "Jwt:Key" "DIN-LÅNGA-HEMLIGA-JWT-NYCKEL"
```

Kontrollera att värdena finns:

```powershell
dotnet user-secrets list
```

Du ska minst ha:

```text
MongoDb:ConnectionString
MongoDb:DatabaseName
Jwt:Key
```

> Lägg aldrig connection strings, lösenord eller JWT-nycklar i Git.

---

## 4. CORS

API:ts tillåtna frontend-adresser ligger för närvarande direkt i:

```text
backend/TechLingo.Api/Program.cs
```

Policyn heter:

```text
Frontend
```

För vanlig lokal utveckling på samma dator finns redan:

```text
http://localhost:5173
```

och då behöver du normalt inte ändra något.

### Om frontend öppnas via datorns nätverks-IP

Vite är konfigurerat att lyssna på:

```text
0.0.0.0:5173
```

Det gör att frontend kan öppnas från andra enheter i samma nätverk.

Om du exempelvis öppnar frontend på:

```text
http://192.168.1.50:5173
```

måste exakt den origin-adressen finnas i CORS-konfigurationen:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
        policy.WithOrigins(
            "http://localhost:5173",
            "http://192.168.1.50:5173"
        )
        .AllowAnyHeader()
        .AllowAnyMethod());
});
```

Starta om backend efter en CORS-ändring.

> CORS behöver alltså bara ändras när webbläsarens frontend-origin inte redan finns i listan.

---

# Starta projektet

## 5. Starta backend

Från projektroten:

```powershell
cd backend
dotnet restore
dotnet run --project TechLingo.Api
```

HTTP-adressen är:

```text
http://localhost:5121
```

API:t lyssnar även på alla nätverksinterface via port `5121`.

HTTPS-profilen använder:

```text
https://localhost:7101
```

Swagger finns i Development-läge på:

```text
http://localhost:5121/swagger
```

MongoDB health check:

```text
http://localhost:5121/health/mongodb
```

Ett lyckat svar ska visa att databasen kan nås.

Låt backend-terminalen vara igång medan du arbetar.

Avsluta med:

```text
Ctrl+C
```

---

## 6. Starta frontend

Öppna en ny terminal från projektroten:

```powershell
cd frontend
npm ci
npm run dev
```

Vite kör på:

```text
http://localhost:5173
```

Eftersom `vite.config.ts` använder:

```text
host: "0.0.0.0"
port: 5173
```

visas normalt även en nätverksadress i terminalen.

---

# Testmiljö

## 7. Playwright / Gherkin – skapa `.env.test`

Playwright-konfigurationen laddar:

```text
frontend/.env.test
```

Filen ligger inte i Git och måste skapas manuellt om Playwright-testerna ska köras.

Skapa:

```text
frontend/.env.test
```

Exempel:

```env
TEST_ADMIN_USERNAME=admin
TEST_ADMIN_PASSWORD=admin

TEST_USER_USERNAME=DIN_TESTANVÄNDARE
TEST_USER_PASSWORD=DITT_TESTLÖSENORD
```

`TEST_USER_USERNAME` och `TEST_USER_PASSWORD` måste motsvara en vanlig användare som faktiskt finns i databasen.

Backend seedar för närvarande en adminanvändare om den saknas:

```text
username: admin
password: admin
```

> Adminuppgifterna ovan är utvecklingsdata i nuvarande kod och ska inte användas som produktionsuppgifter.

### Installera Playwright-webbläsare

Efter en ny installation kan Playwright behöva sin Chromium-browser:

```powershell
cd frontend
npx playwright install
```

### Kör BDD/Playwright

Projektets npm-script är:

```powershell
npm run ptest
```

Det kör först BDD-genereringen och öppnar därefter Playwright UI.

Backend måste vara igång och testkontona måste finnas i databasen.

---

# Projektstruktur

```text
TechLingo/
├── backend/
│   ├── TechLingo.Api/
│   │   ├── Controllers/
│   │   ├── Properties/
│   │   │   └── launchSettings.json
│   │   ├── Program.cs
│   │   ├── appsettings.json
│   │   └── TechLingo.Api.csproj
│   │
│   ├── TechLingo.Core/
│   │   ├── Configuration/
│   │   ├── Data/
│   │   ├── DTOs/
│   │   ├── Entities/
│   │   ├── Interfaces/
│   │   ├── Repositories/
│   │   └── Services/
│   │
│   ├── TechLingo.Tests/
│   └── TechLingo.slnx
│
├── frontend/
│   ├── src/
│   ├── tests/
│   │   ├── features/
│   │   └── steps/
│   ├── playwright.config.ts
│   ├── vite.config.ts
│   ├── package.json
│   ├── .env          # skapas lokalt, finns inte i Git
│   └── .env.test     # skapas lokalt, finns inte i Git
│
├── docs/
│   └── TechLingo_Manuell_Snabbguide.md
│
├── .gitignore
└── README.md
```

---

# Viktiga portar

| Del | Adress |
| --- | --- |
| Frontend | `http://localhost:5173` |
| Backend HTTP | `http://localhost:5121` |
| Backend HTTPS | `https://localhost:7101` |
| Swagger | `http://localhost:5121/swagger` |
| MongoDB health check | `http://localhost:5121/health/mongodb` |

---

# Vanliga kommandon

## Backend

Från projektroten:

```powershell
dotnet restore backend/TechLingo.slnx
dotnet build backend/TechLingo.slnx
dotnet test backend/TechLingo.slnx
dotnet run --project backend/TechLingo.Api
```

## Frontend

Från projektroten:

```powershell
npm ci --prefix frontend
npm run dev --prefix frontend
npm run build --prefix frontend
npm run lint --prefix frontend
```

## Playwright / BDD

Från `frontend`:

```powershell
npm run ptest
```

---

# Ny dator – komplett checklista

När projektet ska startas på en helt ny dator:

1. Installera Git, .NET 10 SDK och Node.js.
2. Klona repot.
3. Kör `dotnet restore`.
4. Kör `npm ci` i `frontend`.
5. Skapa `frontend/.env`.
6. Sätt `VITE_API_URL`.
7. Lägg in `MongoDb:ConnectionString` med .NET User Secrets.
8. Lägg in `MongoDb:DatabaseName` med .NET User Secrets.
9. Lägg in `Jwt:Key` med .NET User Secrets.
10. Kontrollera `dotnet user-secrets list`.
11. Uppdatera CORS i `Program.cs` om frontend ska öppnas via en ny nätverks-IP/origin.
12. Starta backend.
13. Kontrollera `/health/mongodb`.
14. Starta frontend.
15. Om Playwright ska användas: skapa `frontend/.env.test`.
16. Vid behov kör `npx playwright install`.
17. Kör `npm run ptest`.

---

# Felsökning

## `MongoDb configuration is missing`

Backend hittar ingen `MongoDb`-konfiguration.

Kontrollera:

```powershell
cd backend/TechLingo.Api
dotnet user-secrets list
```

Du behöver minst:

```text
MongoDb:ConnectionString
MongoDb:DatabaseName
```

---

## `MongoDb:ConnectionString is missing`

Connection string saknas i User Secrets:

```powershell
dotnet user-secrets set "MongoDb:ConnectionString" "DIN-CONNECTION-STRING"
```

---

## `MongoDb:DatabaseName is missing`

Sätt databasnamnet:

```powershell
dotnet user-secrets set "MongoDb:DatabaseName" "TechLingo"
```

---

## Problem med JWT / inloggning

Kontrollera att en JWT-nyckel finns:

```powershell
dotnet user-secrets set "Jwt:Key" "DIN-LÅNGA-HEMLIGA-JWT-NYCKEL"
```

Starta om backend efter ändringen.

---

## Frontend kan inte anropa API:t

Kontrollera först `frontend/.env`:

```env
VITE_API_URL=http://localhost:5121/api
```

Starta därefter om Vite.

Kontrollera sedan att backend svarar:

```text
http://localhost:5121/swagger
```

Om frontend öppnas via en nätverksadress, kontrollera även:

- att `.env` pekar på rätt IP-adress för API:t
- att frontend-origin finns i CORS-listan i `Program.cs`
- att operativsystemets brandvägg tillåter port `5121` och `5173`

---

## CORS-fel i webbläsaren

Exempel:

```text
Access to XMLHttpRequest ... has been blocked by CORS policy
```

Kontrollera adressen som frontend faktiskt körs på.

Om webbläsaren visar:

```text
http://192.168.1.50:5173
```

måste exakt:

```text
http://192.168.1.50:5173
```

finnas i `WithOrigins(...)` i backendens `Program.cs`.

---

## Playwright säger att test credentials saknas

Kontrollera att filen finns:

```text
frontend/.env.test
```

och innehåller:

```env
TEST_ADMIN_USERNAME=...
TEST_ADMIN_PASSWORD=...
TEST_USER_USERNAME=...
TEST_USER_PASSWORD=...
```

---

## Port 5121, 5173 eller 7101 används redan

Stoppa processen som använder porten eller kontrollera om projektet redan körs i en annan terminal.

Vite är explicit konfigurerat för port `5173`, så om den är upptagen bör den processen normalt stoppas i stället för att använda en annan frontendport.

---

## Ändringar i `.env` verkar inte slå igenom

Vite läser miljövariabler vid uppstart.

Stoppa frontend:

```text
Ctrl+C
```

och starta den igen:

```powershell
npm run dev
```

---

# Säkerhet och filer som inte ska committas

Projektets `.gitignore` exkluderar bland annat:

```text
.env
.env.*
.env.test
node_modules/
bin/
obj/
test-results/
playwright-report/
blob-report/
.features-gen/
```

Commit aldrig:

- MongoDB connection strings
- databaslösenord
- JWT-hemligheter
- riktiga användarlösenord
- privata `.env`-filer

Om teamet vill dokumentera vilka miljövariabler som krävs utan att dela hemligheter rekommenderas separata exempel-filer, exempelvis:

```text
frontend/.env.example
frontend/.env.test.example
```

med endast variabelnamn och ofarliga exempelvärden.
