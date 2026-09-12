# TechLingo API-endpoints

Detta dokument beskriver den nuvarande API-strukturen i TechLingo och är uppdaterat enligt de aktiva controllers och services i backend.

## Basadresser

Vid lokal körning används normalt:

- HTTP: `http://localhost:5121`
- HTTPS: `https://localhost:7101`

Alla relativa routes i tabellerna nedan kombineras med en av basadresserna.

## Publika endpoints

| Metod | Endpoint | Autentisering | Används till | Begäran | Lyckat svar |
| --- | --- | --- | --- | --- | --- |
| `POST` | `/api/Auth/register` | Nej | Registrerar en ny användare. | JSON med `username` och `password`. | `200 OK` med ett meddelande. |
| `POST` | `/api/Auth/login` | Nej | Loggar in en användare och returnerar en JWT-token. | JSON med `username` och `password`. | `200 OK` med `{ "token": "..." }`. |
| `GET` | `/api/Categories` | Nej | Hämtar alla kategorier. | Ingen. | `200 OK` med en lista av kategorier. |
| `GET` | `/api/Categories/{id}` | Nej | Hämtar en kategori med ett specifikt id. | `id` i URL:en. | `200 OK` med kategorin, eller `404 Not Found`. |

## Skyddade endpoints

Skyddade endpoints kräver en giltig JWT-token i `Authorization`-headern.

| Metod | Endpoint | Används till | Begäran | Lyckat svar |
| --- | --- | --- | --- | --- |
| `GET` | `/api/Categories/{categoryId}/questions` | Hämtar alla frågor i en viss kategori. | `categoryId` i URL:en. | `200 OK` med en lista av frågor. |
| `GET` | `/api/Questions` | Hämtar alla frågor. | Ingen. | `200 OK` med en lista av frågor. |
| `GET` | `/api/Questions/{id}` | Hämtar en specifik fråga via id. | `id` i URL:en. | `200 OK` med frågan, eller `404 Not Found`. |
| `POST` | `/api/Questions/{id}/answer` | Kontrollerar användarens val för en specifik fråga och räknar ut poäng. | JSON-sträng med det valda svarsalternativets id, till exempel `"2"`. | `200 OK` med resultatet, eller `404 Not Found` om frågan saknas. |

### Svara på en fråga

Anropet skickar det valda svarsalternativets id som en JSON-sträng. Det ska alltså inte skickas som ett objekt med egenskapen `answerOptionId`.

Request:

```http
POST /api/Questions/{questionId}/answer
Content-Type: application/json
Authorization: Bearer <jwt-token>
```

```json
"2"
```

Rätt svar ger `100` poäng och fel svar ger `-200` poäng. Ett lyckat svar kan till exempel se ut så här:

```json
{
  "isCorrect": false,
  "points": -200,
  "correctAnswer": "Rätt svar",
  "correctAnswerId": "1",
  "errorMessage": "'Det valda svaret' is wrong! The correct answer is 'Rätt svar'."
}
```

Vid rätt svar är `errorMessage` `null`. Om frågan inte hittas returnerar endpointen `404 Not Found` med ett resultatobjekt där `errorMessage` är `"Question not found."`.

### JWT-token

Skyddade endpoints ska anropas med en Authorization-header:

```http
Authorization: Bearer <jwt-token>
```

Om token saknas eller är ogiltig returneras normalt `401 Unauthorized` innan kontrollern bearbetar anropet.

## Health check

| Metod | Endpoint | Autentisering | Används till | Lyckat svar |
| --- | --- | --- | --- | --- |
| `GET` | `/health/mongodb` | Nej | Kontrollerar att API:t kan ansluta till MongoDB. | `200 OK` med `{ "status": "ok", "database": "..." }`. |

Om MongoDB inte kan nås returneras `503 Service Unavailable` med felinformation.

## Exempelendpoint från ASP.NET Core-mallen

Detta är en kvarvarande standardendpoint från ASP.NET Core-mallen och hör inte till TechLingos quizfunktion:

| Metod | Endpoint | Autentisering | Används till |
| --- | --- | --- | --- |
| `GET` | `/WeatherForecast` | Nej | Returnerar fem slumpmässigt genererade väderprognoser. |

## Swagger och OpenAPI i Development

När miljön är `Development` är följande dokumentationsroutes tillgängliga:

| Endpoint | Används till |
| --- | --- |
| `/swagger` | Öppnar Swagger UI för att testa och inspektera API:t. |
| `/swagger/v1/swagger.json` | Returnerar Swagger-dokumentet i JSON-format. |
| `/openapi/v1.json` | Returnerar OpenAPI-dokumentet i JSON-format. |

Swagger/OpenAPI-routes exponeras enligt `Program.cs` endast i Development-miljön.

## Noteringar

- `CategoriesController` är routad som `/api/Categories` via `[controller]`.
- `QuestionsController` är routad som `/api/Questions` via `[controller]`.
- Frågor per kategori ligger under kategoriresursen: `/api/Categories/{categoryId}/questions`.
- Svar på frågor skickas till `/api/Questions/{id}/answer` som en JSON-sträng med svarsalternativets id.
- Poängregeln för answer-endpointen är `+100` för rätt svar och `-200` för fel svar.
- API:t använder CORS-policyn `Frontend` för `http://localhost:5173`.
- Register- och login-anropen tar emot JSON med fälten `username` och `password`.
