# Protokoll – skapa TechLingo manuellt

Detta dokument är tänkt som ett kort protokoll/snabbguide om ni vill återskapa projektstrukturen från noll vid ett senare tillfälle.

Exemplet utgår från **.NET 10**, React med Vite och MongoDB.

---

## 1. Förutsättningar

Installera:

- .NET SDK
- Node.js + npm
- Git
- Docker Desktop om ni vill köra MongoDB lokalt i container
- Visual Studio / VS Code efter eget val

Kontrollera installationerna:

```powershell
dotnet --version
node --version
npm --version
git --version
docker --version
```

---

## 2. Skapa mappar

```powershell
mkdir TechLingo
cd TechLingo

mkdir backend
mkdir frontend
```

---

## 3. Skapa .NET solution och projekt

```powershell
cd backend

dotnet new sln -n TechLingo --format sln

dotnet new webapi -n TechLingo.Api --use-controllers -f net10.0
dotnet new classlib -n TechLingo.Backend -f net10.0
dotnet new xunit -n TechLingo.Tests -f net10.0
```

Lägg projekten i solution:

```powershell
dotnet sln TechLingo.sln add TechLingo.Api/TechLingo.Api.csproj
dotnet sln TechLingo.sln add TechLingo.Backend/TechLingo.Backend.csproj
dotnet sln TechLingo.sln add TechLingo.Tests/TechLingo.Tests.csproj
```

Lägg referenser:

```powershell
dotnet add TechLingo.Api/TechLingo.Api.csproj reference TechLingo.Backend/TechLingo.Backend.csproj
dotnet add TechLingo.Tests/TechLingo.Tests.csproj reference TechLingo.Backend/TechLingo.Backend.csproj
```

Resultat:

```text
TechLingo.Api
    ↓
TechLingo.Backend

TechLingo.Tests
    ↓
TechLingo.Backend
```

---

## 4. Lägg till MongoDB Driver

```powershell
dotnet add TechLingo.Backend/TechLingo.Backend.csproj package MongoDB.Driver
```

Ingen EF Core, `DbContext` eller migrations behövs när ni använder den vanliga MongoDB-drivern.

---

## 5. Skapa Backend-mappar

Inne i `TechLingo.Backend`:

```text
Domain/
  Entities/

DTOs/
  Questions/
  Quiz/

Data/

Repositories/

Services/
```

En bra första uppdelning är:

```text
TechLingo.Backend
├── Domain
│   └── Entities
│       └── Question.cs
├── DTOs
│   ├── Questions
│   │   ├── QuestionDto.cs
│   │   ├── CreateQuestionDto.cs
│   │   └── UpdateQuestionDto.cs
│   └── Quiz
│       ├── QuizQuestionDto.cs
│       ├── QuestionAnswerDto.cs
│       └── AnswerResultDto.cs
├── Data
│   ├── MongoDbSettings.cs
│   └── MongoDbContext.cs
├── Repositories
│   ├── IQuestionRepository.cs
│   └── QuestionRepository.cs
└── Services
    ├── IQuestionService.cs
    ├── QuestionService.cs
    ├── IQuizService.cs
    └── QuizService.cs
```

---

## 6. MongoDB-konfiguration

I `TechLingo.Api/appsettings.json`:

```json
{
  "MongoDb": {
    "ConnectionString": "mongodb://localhost:27017",
    "DatabaseName": "TechLingo",
    "QuestionsCollection": "questions"
  }
}
```

Detta är er ofarliga lokala standardkonfiguration och kan ligga i Git.

### Atlas / cloud

Initiera User Secrets:

```powershell
cd TechLingo.Api
dotnet user-secrets init
```

Sätt Atlas-connection string:

```powershell
dotnet user-secrets set "MongoDb:ConnectionString" "mongodb+srv://USERNAME:PASSWORD@CLUSTER..."
```

Ta bort den igen om ni vill falla tillbaka till lokal MongoDB:

```powershell
dotnet user-secrets remove "MongoDb:ConnectionString"
```

Vid deployment kan ni i stället använda environment variable:

```powershell
$env:MongoDb__ConnectionString="mongodb+srv://USERNAME:PASSWORD@CLUSTER..."
```

Dubbel underscore `__` motsvarar `:` i .NET-konfiguration.

---

## 7. Lokal MongoDB med Docker

I projektroten kan ni skapa `docker-compose.yml`:

```yaml
services:
  mongodb:
    image: mongo:8
    container_name: techlingo-mongodb
    ports:
      - "27017:27017"
    volumes:
      - techlingo-mongo-data:/data/db

volumes:
  techlingo-mongo-data:
```

Starta:

```powershell
docker compose up -d
```

Kontrollera:

```powershell
docker compose ps
```

Stoppa:

```powershell
docker compose down
```

Vill ni även ta bort datavolymen:

```powershell
docker compose down -v
```

---

## 8. Dependency Injection i API

I `Program.cs` registrerar ni i princip:

```csharp
builder.Services.AddSingleton(mongoSettings);
builder.Services.AddSingleton<IMongoClient>(
    _ => new MongoClient(mongoSettings.ConnectionString));

builder.Services.AddSingleton<MongoDbContext>();

builder.Services.AddScoped<IQuestionRepository, QuestionRepository>();
builder.Services.AddScoped<IQuestionService, QuestionService>();
builder.Services.AddScoped<IQuizService, QuizService>();
```

Tanken är:

```text
Controller
  ↓
Service-interface
  ↓
Service
  ↓
Repository-interface
  ↓
Repository
  ↓
MongoDB
```

---

## 9. DTO-regel

Använd inte ett enda DTO till allt.

Exempel:

```text
QuestionDto
    Admin/läsning av hela frågan

CreateQuestionDto
    Skapa en fråga

UpdateQuestionDto
    Ändra en fråga

QuizQuestionDto
    Det spelaren får se.
    Ska INTE avslöja rätt svar.

QuestionAnswerDto
    Det användaren skickar tillbaka.

AnswerResultDto
    Resultatet efter kontroll.
```

Exempel på quizflöde:

```text
GET /api/quiz/question
        ↓
{
  "id": "...",
  "question": "Vad betyder BRB?",
  "options": [
    "Be Right Back",
    "Bring Real Bacon",
    "Be Really Busy"
  ]
}

        ↓ användaren väljer

POST /api/quiz/answer

{
  "questionId": "...",
  "answer": "Be Right Back"
}

        ↓

{
  "isCorrect": true,
  "correctAnswer": "Be Right Back"
}
```

---

## 10. Skapa React med Vite

Från projektroten:

```powershell
cd frontend
npm create vite@latest techlingo-web -- --template react
cd techlingo-web
npm install
```

Skapa `.env`:

```text
VITE_API_URL=http://localhost:5188
```

Använd sedan:

```javascript
const apiUrl =
  import.meta.env.VITE_API_URL ?? "http://localhost:5188";
```

Starta:

```powershell
npm run dev
```

---

## 11. CORS

API:t behöver tillåta Reacts utvecklingsadress, normalt:

```text
http://localhost:5173
```

Exempel i `appsettings.json`:

```json
{
  "Cors": {
    "AllowedOrigins": [
      "http://localhost:5173"
    ]
  }
}
```

---

## 12. Första fungerande vertical slice

Försök få detta att fungera innan ni bygger mer:

```text
1. MongoDB startar.
2. API startar.
3. POST /api/questions skapar BRB.
4. GET /api/questions hämtar BRB.
5. GET /api/quiz/question skickar en quizfråga utan facit.
6. POST /api/quiz/answer kontrollerar svaret.
7. React kan hämta frågan och visa resultatet.
```

När det fungerar har ni hela kedjan:

```text
React
  ↓
ASP.NET Core API
  ↓
Service
  ↓
Repository
  ↓
MongoDB
```

---

## 13. Git

I projektroten:

```powershell
git init
git add .
git commit -m "Initial TechLingo project structure"
```

Commit aldrig:

```text
node_modules/
bin/
obj/
.env
Atlas connection strings
lösenord
```

---

## 14. Vanliga kommandon

Backend:

```powershell
dotnet restore
dotnet build
dotnet test
dotnet run --project TechLingo.Api
```

Frontend:

```powershell
npm install
npm run dev
npm run build
```

MongoDB:

```powershell
docker compose up -d
docker compose ps
docker compose down
```

Git:

```powershell
git status
git add .
git commit -m "Beskriv ändringen"
git pull
git push
```

---

## 15. När projektet växer

Börja enkelt med:

```text
TechLingo.Api
TechLingo.Backend
TechLingo.Tests
React
```

Om ni senare får behov av hårdare arkitekturgränser kan `TechLingo.Backend` delas upp i exempelvis:

```text
TechLingo.Domain
TechLingo.Application
TechLingo.Infrastructure
```

Det går att göra senare eftersom ni redan håller kodens ansvar separerade med mappar, interfaces och namespaces.
