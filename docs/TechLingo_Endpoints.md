# TechLingo API-endpoints

Detta dokument beskriver de endpoints som faktiskt exponeras av backendens controllers och `Program.cs`. Route-namn skrivs med gemener, vilket är den konvention som används av API:t. ASP.NET Core matchar routes skiftlägesokänsligt.

## Basadresser

Vid lokal körning används normalt:

- HTTP: `http://localhost:5121`
- HTTPS: `https://localhost:7101`

HTTP-profilen binder till alla nätverksinterface (`0.0.0.0`). HTTPS-profilen använder localhost för HTTPS och port 5121 för HTTP. Alla relativa routes nedan kombineras med en basadress.

## Autentisering

Skyddade endpoints kräver en giltig JWT-token:

```http
Authorization: Bearer <jwt-token>
```

Token valideras mot issuer, audience, signeringsnyckel och giltighetstid. Saknad eller ogiltig token ger normalt `401 Unauthorized`. Admin-endpoints kräver dessutom rollen `Admin` och ger `403 Forbidden` om användaren är inloggad men saknar rollen.

## Publika endpoints

### Auth

| Metod | Endpoint | Begäran | Lyckat svar | Vanliga fel |
| --- | --- | --- | --- | --- |
| `POST` | `/api/auth/register` | `RegisterRequestDto` | `200 OK` med `RegisterResponseDto` | `400 Bad Request` |
| `POST` | `/api/auth/login` | `LoginRequestDto` | `200 OK` med `LoginResponseDto` | `401 Unauthorized` |

Request för både register och login:

```json
{
  "username": "alex",
  "password": "secret"
}
```

Svar från register:

```json
{
  "message": "..."
}
```

Svar från login:

```json
{
  "token": "<jwt-token>"
}
```

Fel från auth-endpoints har formen:

```json
{
  "errorMessage": "..."
}
```

### Kategorier

Kategorier är publika. Frågelistan per kategori är också publik, till skillnad från de fristående fråge-endpoints under `/api/questions`.

| Metod | Endpoint | Används till | Lyckat svar | Vanliga fel |
| --- | --- | --- | --- | --- |
| `GET` | `/api/categories` | Hämtar alla kategorier. | `200 OK` med en lista av `Category`. | - |
| `GET` | `/api/categories/{id}` | Hämtar en kategori. | `200 OK` med `Category`. | `404 Not Found` |
| `GET` | `/api/categories/{categoryId}/questions` | Hämtar aktiva frågor i en kategori. | `200 OK` med en lista av `QuestionDto`. | - |

`Category` innehåller `id`, `name`, `slug`, `description`, `isActive` och `createdAt`.

## Skyddade quiz- och fråge-endpoints

### Frågor

| Metod | Endpoint | Lyckat svar | Vanliga fel |
| --- | --- | --- | --- |
| `GET` | `/api/questions` | `200 OK` med `List<QuestionDto>`. | `401 Unauthorized` |
| `GET` | `/api/questions/{id}` | `200 OK` med `QuestionDto`. | `401 Unauthorized`, `404 Not Found` |

`QuestionDto` har fälten `id`, `categoryId`, `message`, `prompt` och `options`. Varje option har `id` och `text`. Fältet `isCorrect` exponeras inte i detta publika DTO.

### Quizflöde

Ett quiz genomförs i ordningen `start` -> `answer` (en eller flera gånger) -> `complete`.

| Metod | Endpoint | Begäran | Lyckat svar | Vanliga fel |
| --- | --- | --- | --- | --- |
| `POST` | `/api/quiz/start/{categoryId}` | Ingen body. | `200 OK` med `StartQuizResultDto`. | `400 Bad Request`, `401 Unauthorized` |
| `POST` | `/api/quiz/{sessionId}/answer` | `SubmitAnswerDto`. | `200 OK` med `AnswerResultDto`. | `400 Bad Request`, `401 Unauthorized` |
| `POST` | `/api/quiz/{sessionId}/complete` | Ingen body. | `200 OK` med `QuizResultDto`. | `400 Bad Request`, `401 Unauthorized` |
| `GET` | `/api/quiz/history` | Ingen. | `200 OK` med de fem senaste `QuizHistoryDto`. | `401 Unauthorized` |
| `DELETE` | `/api/quiz/{sessionId}` | Ingen body. Avslutar/raderar en pågående session. | `204 No Content`. | `400 Bad Request`, `401 Unauthorized` |

Request för att svara på en fråga:

```json
{
  "questionId": "<question-id>",
  "answerId": "<answer-option-id>"
}
```

`StartQuizResultDto` innehåller `sessionId` och `questions`. `AnswerResultDto` innehåller `isCorrect`, `points`, `correctAnswer`, `correctAnswerId` och `errorMessage`. `QuizResultDto` innehåller `quizScore` och `totalScore`. Historikposter innehåller `sessionId`, `categoryId`, `quizScore`, `correctAnswers`, `totalQuestions` och `completedAt`.

Det finns inte längre någon `/api/questions/{id}/answer`-endpoint. Svar skickas alltid inom ramen för en quiz-session via `/api/quiz/{sessionId}/answer`. Poäng- och valideringsreglerna hanteras av `QuizService`.

## Användar-endpoints

| Metod | Endpoint | Lyckat svar | Vanliga fel |
| --- | --- | --- | --- |
| `GET` | `/api/user/account` | `200 OK` med `UserProfileDto`: `username`, `totalScore`. | `401 Unauthorized`, `404 Not Found` |
| `DELETE` | `/api/user/account` | `204 No Content`. Tar bort det inloggade kontot. | `401 Unauthorized`, `404 Not Found` |
| `GET` | `/api/user/leaderboard` | `200 OK` med en lista av `LeaderboardUserDto`: `username`, `totalScore`. | `401 Unauthorized` |

## Admin-endpoints

Alla endpoints i detta avsnitt kräver JWT-token med rollen `Admin`.

### Användare

| Metod | Endpoint | Begäran | Lyckat svar | Vanliga fel |
| --- | --- | --- | --- | --- |
| `GET` | `/api/admin/users` | Ingen. | `200 OK` med `List<UserDto>`. | `401`, `403` |
| `GET` | `/api/admin/users/{id}` | Ingen. | `200 OK` med `UserDto`. | `401`, `403`, `404` |
| `POST` | `/api/admin/users` | `CreateUserDto`. | `201 Created` med `UserDto`. | `400`, `401`, `403` |
| `PUT` | `/api/admin/users/{id}` | `UpdateUserDto`. | `200 OK` med `UserDto`. | `401`, `403`, `404` |
| `DELETE` | `/api/admin/users/{id}` | Ingen. | `204 No Content`. | `401`, `403`, `404` |
| `PATCH` | `/api/admin/users/{id}/password` | `ChangePasswordDto`. | `204 No Content`. | `401`, `403`, `404` |

`UserDto` har `id`, `username` och `role`. Requestfält:

- `CreateUserDto`: `username`, `password`, `role`
- `UpdateUserDto`: `username`, `role`
- `ChangePasswordDto`: `newPassword`

### Kategorier

| Metod | Endpoint | Begäran | Lyckat svar | Vanliga fel |
| --- | --- | --- | --- | --- |
| `GET` | `/api/admin/categories` | Ingen. | `200 OK` med `List<AdminCategoryDto>`. | `401`, `403` |
| `GET` | `/api/admin/categories/{id}` | Ingen. | `200 OK` med `AdminCategoryDto`. | `401`, `403`, `404` |
| `POST` | `/api/admin/categories` | `CreateCategoryDto`. | `201 Created` med `AdminCategoryDto`. | `401`, `403` |
| `PUT` | `/api/admin/categories/{id}` | `UpdateCategoryDto`. | `200 OK` med `AdminCategoryDto`. | `401`, `403`, `404` |
| `DELETE` | `/api/admin/categories/{id}` | Ingen. | `204 No Content`. | `401`, `403`, `404`, `409` |

`AdminCategoryDto` har `id`, `name`, `slug`, `description`, `isActive` och `createdAt`. Både `CreateCategoryDto` och `UpdateCategoryDto` har `name`, `slug`, `description` och `isActive`.

### Frågor

| Metod | Endpoint | Begäran | Lyckat svar | Vanliga fel |
| --- | --- | --- | --- | --- |
| `GET` | `/api/admin/questions` | Ingen. | `200 OK` med `List<AdminQuestionDto>`. | `401`, `403` |
| `GET` | `/api/admin/questions/{id}` | Ingen. | `200 OK` med `AdminQuestionDto`. | `401`, `403`, `404` |
| `POST` | `/api/admin/questions` | `CreateQuestionDto`. | `201 Created` med `AdminQuestionDto`. | `400`, `401`, `403` |
| `PUT` | `/api/admin/questions/{id}` | `UpdateQuestionDto`. | `200 OK` med `AdminQuestionDto`. | `400`, `401`, `403`, `404` |
| `DELETE` | `/api/admin/questions/{id}` | Ingen. | `204 No Content`. | `401`, `403`, `404` |

`AdminQuestionDto` har `id`, `categoryId`, `message`, `prompt`, `options`, `explanation`, `isActive` och `createdAt`. Både `CreateQuestionDto` och `UpdateQuestionDto` har `categoryId`, `message`, `prompt`, `options`, `explanation` och `isActive`.

Varje admin-option har `id`, `text` och `isCorrect`. `isCorrect` ska därför endast användas i adminflödet och aldrig i det publika `QuestionDto`.

## Health check

| Metod | Endpoint | Autentisering | Lyckat svar | Fel |
| --- | --- | --- | --- | --- |
| `GET` | `/health/mongodb` | Nej | `200 OK` med `{ "status": "ok", "database": "..." }`. | `503 Service Unavailable` om MongoDB inte kan nås |

## Swagger och OpenAPI i Development

När miljön är `Development` exponeras följande dokumentationsroutes:

| Endpoint | Används till |
| --- | --- |
| `/swagger` | Swagger UI för att testa och inspektera API:t. |
| `/swagger/v1/swagger.json` | Swagger-dokumentet i JSON-format. |
| `/openapi/v1.json` | OpenAPI-dokumentet i JSON-format. |

## CORS och övriga noteringar

- CORS-policyn `Frontend` tillåter `http://localhost:5173` och `http://10.12.127.142:5173`.
- `UseHttpsRedirection()` är aktiverad, så HTTP-anrop kan omdirigeras till HTTPS beroende på körprofil och miljö.
- Backendens seeding av MongoDB körs när applikationen startar.
- Det finns ingen aktiv `/WeatherForecast`-endpoint i den aktuella lösningen.
