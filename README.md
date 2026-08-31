# TechLingo

TechLingo ar ett fullstackprojekt med ett ASP.NET Core API och ett React-granssnitt. Den har en separat core-modul for domanlogik och ett xUnit-testprojekt.

## Kom igang

### Forutsattningar

Installera foljande innan du borjar:

- Git
- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) i en aktuell LTS-version (inkluderar npm)

Kontrollera installationerna i PowerShell:

```powershell
git --version
dotnet --version
node --version
npm --version
```

Klona sedan repot och oppna projektmappen i VS Code:

```powershell
git clone <REPO-URL>
cd TechLingo
code .
```

## Starta projektet

API:t och frontend startas i var sitt terminalfonster.

### 1. Starta backend

Fran projektroten:

```powershell
cd backend
dotnet restore
dotnet run --project TechLingo.Api
```

API:t startar pa `http://localhost:5121`. I utvecklingslage finns Swagger UI pa:

```text
http://localhost:5121/swagger
```

Lata denna terminal vara igang medan du arbetar. Avsluta den med `Ctrl+C`.

### 2. Starta frontend

Oppna en ny terminal i projektroten och kor:

```powershell
cd frontend
npm ci
npm run dev
```

Vite visar den exakta adressen i terminalen. Normalt ar den:

```text
http://localhost:5173
```

Frontendens standardadress ar tillaten av API:ts CORS-installning.

## Vanliga kommandon

| Del | Kommando | Anvandning |
| --- | --- | --- |
| Backend | `dotnet build backend/TechLingo.slnx` | Bygger hela .NET-losningen. |
| Backend | `dotnet test backend/TechLingo.slnx` | Kor xUnit-testerna. |
| Backend | `dotnet run --project backend/TechLingo.Api` | Startar API:t fran projektroten. |
| Frontend | `npm ci --prefix frontend` | Installerar lasfilsta npm-beroenden. |
| Frontend | `npm run dev --prefix frontend` | Startar Vites utvecklingsserver. |
| Frontend | `npm run build --prefix frontend` | Typkontrollerar och bygger frontend. |
| Frontend | `npm run lint --prefix frontend` | Kor ESLint. |

`npm ci` anvander den committade `package-lock.json` och ar darfor att foredra framfor `npm install` vid forsta installationen.

## Projektstruktur

```text
TechLingo/
|- backend/
|  |- TechLingo.Api/       ASP.NET Core Web API och controllers
|  |- TechLingo.Core/      Delad domanlogik, DTO:er och tjanster
|  |- TechLingo.Tests/     xUnit-tester
|  `- TechLingo.slnx       .NET-losningen
|- frontend/               React, TypeScript och Vite
`- TechLingo_Manuell_Snabbguide.md
```

## Nuvarande status och konfiguration

- API:t ar konfigurerat for HTTP pa port `5121` och HTTPS pa port `7101`.
- Swagger ar endast tillgangligt nar `ASPNETCORE_ENVIRONMENT=Development`, vilket ar standard nar API:t startas lokalt.
- Frontend anvander Vites standardport `5173` och API:t tillater den via CORS.
- MongoDB ar inte anslutet eller konfigurerat i den nuvarande koden. Installera eller starta inte Docker/MongoDB for att bara komma igang med den har revisionen.

Den manuella snabbguiden beskriver den planerade MongoDB-strukturen och ar referensmaterial for fortsatt utveckling: [TechLingo_Manuell_Snabbguide.md](TechLingo_Manuell_Snabbguide.md).

## Felsokning

**`dotnet` hittas inte eller fel SDK-version anvands**

Installera .NET 10 SDK och oppna sedan en ny terminal innan du kor `dotnet --version` igen.

**Port 5121, 5173 eller 7101 ar redan upptagen**

Stoppa den process som anvander porten, eller starta om den befintliga utvecklingsservern. Vite kan automatiskt valja en annan port; uppdatera da API:ts CORS-policy i `backend/TechLingo.Api/Program.cs` innan frontend ska anropa API:t.

**Frontend kan inte anropa API:t**

Sakerstall att API:t fortfarande kor och att frontend anvander `http://localhost:5173`. Oppna sedan Swagger-adressen ovan for att kontrollera att API:t svarar.

**Beroenden verkar felaktiga efter en uppdatering**

Kor om respektive installation fran projektroten:

```powershell
dotnet restore backend/TechLingo.slnx
npm ci --prefix frontend
```