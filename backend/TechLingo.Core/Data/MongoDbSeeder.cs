using MongoDB.Driver;
using TechLingo.Core.Entities;
using TechLingo.Core.Enums;

namespace TechLingo.Core.Data
{
    public class MongoDbSeeder
    {
        private readonly IMongoDatabase _database;

        public MongoDbSeeder(IMongoDatabase database)
        {
            _database = database;
        }

        public async Task SeedAsync()
        {
            var categories =
                _database.GetCollection<Category>("categories");

            var questions =
                _database.GetCollection<Question>("questions");

            var users =
                _database.GetCollection<User>("users");


            //Kategorier

            var internetSlang = await categories
                .Find(c => c.Slug == "internet-slang")
                .FirstOrDefaultAsync();

            if (internetSlang is null)
            {
                internetSlang = new Category
                {
                    Name = "Internet Slang",
                    Slug = "internet-slang",
                    Description = "Common internet slang and chat abbreviations."
                };

                await categories.InsertOneAsync(internetSlang);
            }


            var itAbbreviations = await categories
                .Find(c => c.Slug == "it-abbreviations")
                .FirstOrDefaultAsync();

            if (itAbbreviations is null)
            {
                itAbbreviations = new Category
                {
                    Name = "IT Abbreviations",
                    Slug = "it-abbreviations",
                    Description = "Common abbreviations used in IT."
                };

                await categories.InsertOneAsync(itAbbreviations);
            }

            // Seeda Admin-användare
            var adminUser = await users
                .Find(u => u.Username == "admin")
                .FirstOrDefaultAsync();

            if (adminUser is null)
            {
                adminUser = new User
                {
                    Username = "admin",

                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin"),

                    Role = UserRole.Admin
                };

                await users.InsertOneAsync(adminUser);
            }

            //Frågor
            var questionsToSeed = new List<Question>
            {
                //Internetkultur

                CreateQuestion(
                    internetSlang.Id,
                    "BRB, need coffee.",
                    "What does BRB mean?",
                    new List<AnswerOption>
                    {
                        new AnswerOption { Text = "Be right back", IsCorrect = true },
                        new AnswerOption { Text = "Bring right back", IsCorrect = false },
                        new AnswerOption { Text = "Be really busy", IsCorrect = false },
                        new AnswerOption { Text = "Back right before", IsCorrect = false }
                    },
                    "BRB means 'Be right back'."
                ),

                CreateQuestion(
                    internetSlang.Id,
                    "I'm AFK for a few minutes.",
                    "What does AFK mean?",
                    new List<AnswerOption>
                    {
                        new AnswerOption { Text = "Away from keyboard", IsCorrect = true },
                        new AnswerOption { Text = "Available for knowledge", IsCorrect = false },
                        new AnswerOption { Text = "Always feeling kind", IsCorrect = false },
                        new AnswerOption { Text = "Away for keeps", IsCorrect = false }
                    },
                    "AFK means 'Away from keyboard'."
                ),

                CreateQuestion(
                    internetSlang.Id,
                    "IDK what movie we should watch.",
                    "What does IDK mean?",
                    new List<AnswerOption>
                    {
                        new AnswerOption { Text = "I don't know", IsCorrect = true },
                        new AnswerOption { Text = "I do know", IsCorrect = false },
                        new AnswerOption { Text = "Internet data key", IsCorrect = false },
                        new AnswerOption { Text = "I didn't know", IsCorrect = false }
                    },
                    "IDK means 'I don't know'."
                ),

                CreateQuestion(
                    internetSlang.Id,
                    "IMO, that game is really good.",
                    "What does IMO mean?",
                    new List<AnswerOption>
                    {
                        new AnswerOption { Text = "In my opinion", IsCorrect = true },
                        new AnswerOption { Text = "Internet message online", IsCorrect = false },
                        new AnswerOption { Text = "I might order", IsCorrect = false },
                        new AnswerOption { Text = "In most occasions", IsCorrect = false }
                    },
                    "IMO means 'In my opinion'."
                ),

                CreateQuestion(
                    internetSlang.Id,
                    "LOL, that was hilarious!",
                    "What does LOL mean?",
                    new List<AnswerOption>
                    {
                        new AnswerOption { Text = "Laughing out loud", IsCorrect = true },
                        new AnswerOption { Text = "Lots of luck", IsCorrect = false },
                        new AnswerOption { Text = "Leave online later", IsCorrect = false },
                        new AnswerOption { Text = "Look over there", IsCorrect = false }
                    },
                    "LOL means 'Laughing out loud'."
                ),

                CreateQuestion(
                    internetSlang.Id,
                    "TBH, I didn't really like it.",
                    "What does TBH mean?",
                    new List<AnswerOption>
                    {
                        new AnswerOption { Text = "To be honest", IsCorrect = true },
                        new AnswerOption { Text = "To be helpful", IsCorrect = false },
                        new AnswerOption { Text = "Text back here", IsCorrect = false },
                        new AnswerOption { Text = "Try being happy", IsCorrect = false }
                    },
                    "TBH means 'To be honest'."
                ),

                CreateQuestion(
                    internetSlang.Id,
                    "GG everyone, that was close!",
                    "What does GG usually mean in gaming?",
                    new List<AnswerOption>
                    {
                        new AnswerOption { Text = "Good game", IsCorrect = true },
                        new AnswerOption { Text = "Great group", IsCorrect = false },
                        new AnswerOption { Text = "Go again", IsCorrect = false },
                        new AnswerOption { Text = "Game glitch", IsCorrect = false }
                    },
                    "GG means 'Good game' and is commonly used after an online match."
                ),

                CreateQuestion(
                    internetSlang.Id,
                    "I'll send you the details in a DM.",
                    "What does DM mean?",
                    new List<AnswerOption>
                    {
                        new AnswerOption { Text = "Direct message", IsCorrect = true },
                        new AnswerOption { Text = "Data message", IsCorrect = false },
                        new AnswerOption { Text = "Desktop mode", IsCorrect = false },
                        new AnswerOption { Text = "Digital mail", IsCorrect = false }
                    },
                    "DM means 'Direct message', a private message sent to another user."
                ),

                CreateQuestion(
                    internetSlang.Id,
                    "BTW, are you coming tonight?",
                    "What does BTW mean?",
                    new List<AnswerOption>
                    {
                        new AnswerOption { Text = "By the way", IsCorrect = true },
                        new AnswerOption { Text = "Back to work", IsCorrect = false },
                        new AnswerOption { Text = "Before the weekend", IsCorrect = false },
                        new AnswerOption { Text = "Bring the water", IsCorrect = false }
                    },
                    "BTW means 'By the way'."
                ),

                CreateQuestion(
                    internetSlang.Id,
                    "FYI, the meeting starts at 10.",
                    "What does FYI mean?",
                    new List<AnswerOption>
                    {
                        new AnswerOption { Text = "For your information", IsCorrect = true },
                        new AnswerOption { Text = "Find your inbox", IsCorrect = false },
                        new AnswerOption { Text = "For your internet", IsCorrect = false },
                        new AnswerOption { Text = "Follow your instructions", IsCorrect = false }
                    },
                    "FYI means 'For your information'."
                ),

                CreateQuestion(
                    internetSlang.Id,
                    "OMG, I can't believe that happened!",
                    "What does OMG mean?",
                    new List<AnswerOption>
                    {
                        new AnswerOption { Text = "Oh my God", IsCorrect = true },
                        new AnswerOption { Text = "Online message group", IsCorrect = false },
                        new AnswerOption { Text = "Open my game", IsCorrect = false },
                        new AnswerOption { Text = "Only my guess", IsCorrect = false }
                    },
                    "OMG means 'Oh my God' and is commonly used to express surprise."
                ),

                CreateQuestion(
                    internetSlang.Id,
                    "We've talked online for years but never met IRL.",
                    "What does IRL mean?",
                    new List<AnswerOption>
                    {
                        new AnswerOption { Text = "In real life", IsCorrect = true },
                        new AnswerOption { Text = "Internet response link", IsCorrect = false },
                        new AnswerOption { Text = "Instant reply list", IsCorrect = false },
                        new AnswerOption { Text = "In recent login", IsCorrect = false }
                    },
                    "IRL means 'In real life'."
                ),

                CreateQuestion(
                    internetSlang.Id,
                    "NVM, I figured it out.",
                    "What does NVM mean?",
                    new List<AnswerOption>
                    {
                        new AnswerOption { Text = "Never mind", IsCorrect = true },
                        new AnswerOption { Text = "New voice message", IsCorrect = false },
                        new AnswerOption { Text = "Not very much", IsCorrect = false },
                        new AnswerOption { Text = "Next video mode", IsCorrect = false }
                    },
                    "NVM means 'Never mind'."
                ),

                CreateQuestion(
                    internetSlang.Id,
                    "I have to go now. TTYL!",
                    "What does TTYL mean?",
                    new List<AnswerOption>
                    {
                        new AnswerOption { Text = "Talk to you later", IsCorrect = true },
                        new AnswerOption { Text = "Text to your location", IsCorrect = false },
                        new AnswerOption { Text = "Try to yell louder", IsCorrect = false },
                        new AnswerOption { Text = "Time to you later", IsCorrect = false }
                    },
                    "TTYL means 'Talk to you later'."
                ),

                CreateQuestion(
                    internetSlang.Id,
                    "LMK if you want to join us.",
                    "What does LMK mean?",
                    new List<AnswerOption>
                    {
                        new AnswerOption { Text = "Let me know", IsCorrect = true },
                        new AnswerOption { Text = "Leave my keyboard", IsCorrect = false },
                        new AnswerOption { Text = "Look more kindly", IsCorrect = false },
                        new AnswerOption { Text = "Last message known", IsCorrect = false }
                    },
                    "LMK means 'Let me know'."
                ),

                CreateQuestion(
                    internetSlang.Id,
                    "ROFL, that video was so funny!",
                    "What does ROFL mean?",
                    new List<AnswerOption>
                    {
                        new AnswerOption { Text = "Rolling on the floor laughing", IsCorrect = true },
                        new AnswerOption { Text = "Running online for lunch", IsCorrect = false },
                        new AnswerOption { Text = "Reply only for laughs", IsCorrect = false },
                        new AnswerOption { Text = "Read our funny link", IsCorrect = false }
                    },
                    "ROFL means 'Rolling on the floor laughing'."
                ),

                CreateQuestion(
                    internetSlang.Id,
                    "The article is really long. Here's the TL;DR.",
                    "What does TL;DR mean?",
                    new List<AnswerOption>
                    {
                        new AnswerOption { Text = "Too long; didn't read", IsCorrect = true },
                        new AnswerOption { Text = "Text link; direct reply", IsCorrect = false },
                        new AnswerOption { Text = "Too late; don't respond", IsCorrect = false },
                        new AnswerOption { Text = "Try later; download required", IsCorrect = false }
                    },
                    "TL;DR means 'Too long; didn't read' and is often used before a short summary."
                ),

                CreateQuestion(
                    internetSlang.Id,
                    "POV: You forgot your password again.",
                    "What does POV mean?",
                    new List<AnswerOption>
                    {
                        new AnswerOption { Text = "Point of view", IsCorrect = true },
                        new AnswerOption { Text = "Part of video", IsCorrect = false },
                        new AnswerOption { Text = "Post on view", IsCorrect = false },
                        new AnswerOption { Text = "Page of visitors", IsCorrect = false }
                    },
                    "POV means 'Point of view'."
                ),

                CreateQuestion(
                    internetSlang.Id,
                    "That post is NSFW, so don't open it at work.",
                    "What does NSFW mean?",
                    new List<AnswerOption>
                    {
                        new AnswerOption { Text = "Not safe for work", IsCorrect = true },
                        new AnswerOption { Text = "No signal from website", IsCorrect = false },
                        new AnswerOption { Text = "New software for Windows", IsCorrect = false },
                        new AnswerOption { Text = "Network security firewall warning", IsCorrect = false }
                    },
                    "NSFW means 'Not safe for work' and warns that content may be inappropriate to view in a workplace."
                ),

                CreateQuestion(
                    internetSlang.Id,
                    "IIRC, we already talked about this yesterday.",
                    "What does IIRC mean?",
                    new List<AnswerOption>
                    {
                        new AnswerOption { Text = "If I remember correctly", IsCorrect = true },
                        new AnswerOption { Text = "If internet responds correctly", IsCorrect = false },
                        new AnswerOption { Text = "I instantly replied correctly", IsCorrect = false },
                        new AnswerOption { Text = "Internet information request code", IsCorrect = false }
                    },
                    "IIRC means 'If I remember correctly'."
                ),

                //IT-slang

                CreateQuestion(
                    itAbbreviations.Id,
                    "The frontend gets data from our API.",
                    "What does API stand for?",
                    new List<AnswerOption>
                    {
                        new AnswerOption { Text = "Application Programming Interface", IsCorrect = true },
                        new AnswerOption { Text = "Application Program Internet", IsCorrect = false },
                        new AnswerOption { Text = "Advanced Programming Integration", IsCorrect = false },
                        new AnswerOption { Text = "Automated Program Interface", IsCorrect = false }
                    },
                    "API stands for 'Application Programming Interface'."
                ),

                CreateQuestion(
                    itAbbreviations.Id,
                    "The computer's CPU is under heavy load.",
                    "What does CPU stand for?",
                    new List<AnswerOption>
                    {
                        new AnswerOption { Text = "Central Processing Unit", IsCorrect = true },
                        new AnswerOption { Text = "Computer Processing Utility", IsCorrect = false },
                        new AnswerOption { Text = "Central Program User", IsCorrect = false },
                        new AnswerOption { Text = "Core Processing Utility", IsCorrect = false }
                    },
                    "CPU stands for 'Central Processing Unit'."
                ),

                CreateQuestion(
                    itAbbreviations.Id,
                    "This computer has 16 GB of RAM.",
                    "What does RAM stand for?",
                    new List<AnswerOption>
                    {
                        new AnswerOption { Text = "Random Access Memory", IsCorrect = true },
                        new AnswerOption { Text = "Rapid Application Memory", IsCorrect = false },
                        new AnswerOption { Text = "Read Access Module", IsCorrect = false },
                        new AnswerOption { Text = "Remote Active Memory", IsCorrect = false }
                    },
                    "RAM stands for 'Random Access Memory'."
                ),

                CreateQuestion(
                    itAbbreviations.Id,
                    "Open the website using HTTPS.",
                    "What does HTTP stand for?",
                    new List<AnswerOption>
                    {
                        new AnswerOption { Text = "Hypertext Transfer Protocol", IsCorrect = true },
                        new AnswerOption { Text = "High Transfer Text Process", IsCorrect = false },
                        new AnswerOption { Text = "Hyperlink Text Transfer Program", IsCorrect = false },
                        new AnswerOption { Text = "Host Transfer Technology Protocol", IsCorrect = false }
                    },
                    "HTTP stands for 'Hypertext Transfer Protocol'."
                ),

                CreateQuestion(
                    itAbbreviations.Id,
                    "Copy the URL and send it to me.",
                    "What does URL stand for?",
                    new List<AnswerOption>
                    {
                        new AnswerOption { Text = "Uniform Resource Locator", IsCorrect = true },
                        new AnswerOption { Text = "Universal Routing Link", IsCorrect = false },
                        new AnswerOption { Text = "User Resource Location", IsCorrect = false },
                        new AnswerOption { Text = "Uniform Reference Link", IsCorrect = false }
                    },
                    "URL stands for 'Uniform Resource Locator'."
                ),

                CreateQuestion(
                    itAbbreviations.Id,
                    "The DNS server translates the domain name.",
                    "What does DNS stand for?",
                    new List<AnswerOption>
                    {
                        new AnswerOption { Text = "Domain Name System", IsCorrect = true },
                        new AnswerOption { Text = "Data Network Service", IsCorrect = false },
                        new AnswerOption { Text = "Domain Network Storage", IsCorrect = false },
                        new AnswerOption { Text = "Digital Naming Service", IsCorrect = false }
                    },
                    "DNS stands for 'Domain Name System'."
                ),

                CreateQuestion(
                    itAbbreviations.Id,
                    "We use SQL to query the database.",
                    "What does SQL stand for?",
                    new List<AnswerOption>
                    {
                        new AnswerOption { Text = "Structured Query Language", IsCorrect = true },
                        new AnswerOption { Text = "System Query Logic", IsCorrect = false },
                        new AnswerOption { Text = "Standard Question Language", IsCorrect = false },
                        new AnswerOption { Text = "Structured Queue Logic", IsCorrect = false }
                    },
                    "SQL stands for 'Structured Query Language'."
                ),

                CreateQuestion(
                    itAbbreviations.Id,
                    "Visual Studio is the IDE we use for the backend.",
                    "What does IDE stand for?",
                    new List<AnswerOption>
                    {
                        new AnswerOption { Text = "Integrated Development Environment", IsCorrect = true },
                        new AnswerOption { Text = "Internet Development Engine", IsCorrect = false },
                        new AnswerOption { Text = "Integrated Data Editor", IsCorrect = false },
                        new AnswerOption { Text = "Internal Development Environment", IsCorrect = false }
                    },
                    "IDE stands for 'Integrated Development Environment'."
                ),

                CreateQuestion(
                    itAbbreviations.Id,
                    "HTML is used to structure content on a web page.",
                    "What does HTML stand for?",
                    new List<AnswerOption>
                    {
                        new AnswerOption { Text = "HyperText Markup Language", IsCorrect = true },
                        new AnswerOption { Text = "High Transfer Machine Language", IsCorrect = false },
                        new AnswerOption { Text = "Hyperlink Text Management Logic", IsCorrect = false },
                        new AnswerOption { Text = "Home Tool Markup Language", IsCorrect = false }
                    },
                    "HTML stands for 'HyperText Markup Language'."
                ),

                CreateQuestion(
                    itAbbreviations.Id,
                    "CSS controls how the website looks.",
                    "What does CSS stand for?",
                    new List<AnswerOption>
                    {
                        new AnswerOption { Text = "Cascading Style Sheets", IsCorrect = true },
                        new AnswerOption { Text = "Computer Style System", IsCorrect = false },
                        new AnswerOption { Text = "Creative Software Syntax", IsCorrect = false },
                        new AnswerOption { Text = "Central Styling Service", IsCorrect = false }
                    },
                    "CSS stands for 'Cascading Style Sheets'."
                ),

                CreateQuestion(
                    itAbbreviations.Id,
                    "The API returned the data as JSON.",
                    "What does JSON stand for?",
                    new List<AnswerOption>
                    {
                        new AnswerOption { Text = "JavaScript Object Notation", IsCorrect = true },
                        new AnswerOption { Text = "Java Source Object Network", IsCorrect = false },
                        new AnswerOption { Text = "Joined System Object Name", IsCorrect = false },
                        new AnswerOption { Text = "JavaScript Online Network", IsCorrect = false }
                    },
                    "JSON stands for 'JavaScript Object Notation'."
                ),

                CreateQuestion(
                    itAbbreviations.Id,
                    "Every device on the network has an IP address.",
                    "What does IP stand for?",
                    new List<AnswerOption>
                    {
                        new AnswerOption { Text = "Internet Protocol", IsCorrect = true },
                        new AnswerOption { Text = "Internal Program", IsCorrect = false },
                        new AnswerOption { Text = "Internet Process", IsCorrect = false },
                        new AnswerOption { Text = "Integrated Protocol", IsCorrect = false }
                    },
                    "IP stands for 'Internet Protocol'."
                ),

                CreateQuestion(
                    itAbbreviations.Id,
                    "TCP helps devices reliably send data across networks.",
                    "What does TCP stand for?",
                    new List<AnswerOption>
                    {
                        new AnswerOption { Text = "Transmission Control Protocol", IsCorrect = true },
                        new AnswerOption { Text = "Transfer Communication Process", IsCorrect = false },
                        new AnswerOption { Text = "Technical Connection Protocol", IsCorrect = false },
                        new AnswerOption { Text = "Transmission Computer Program", IsCorrect = false }
                    },
                    "TCP stands for 'Transmission Control Protocol'."
                ),

                CreateQuestion(
                    itAbbreviations.Id,
                    "Plug the keyboard into a USB port.",
                    "What does USB stand for?",
                    new List<AnswerOption>
                    {
                        new AnswerOption { Text = "Universal Serial Bus", IsCorrect = true },
                        new AnswerOption { Text = "Unified System Base", IsCorrect = false },
                        new AnswerOption { Text = "Universal Storage Block", IsCorrect = false },
                        new AnswerOption { Text = "User System Bus", IsCorrect = false }
                    },
                    "USB stands for 'Universal Serial Bus'."
                ),

                CreateQuestion(
                    itAbbreviations.Id,
                    "This laptop uses an SSD instead of a traditional hard drive.",
                    "What does SSD stand for?",
                    new List<AnswerOption>
                    {
                        new AnswerOption { Text = "Solid State Drive", IsCorrect = true },
                        new AnswerOption { Text = "System Storage Device", IsCorrect = false },
                        new AnswerOption { Text = "Secure System Disk", IsCorrect = false },
                        new AnswerOption { Text = "Serial Storage Drive", IsCorrect = false }
                    },
                    "SSD stands for 'Solid State Drive'."
                ),

                CreateQuestion(
                    itAbbreviations.Id,
                    "The application has a simple GUI with buttons and menus.",
                    "What does GUI stand for?",
                    new List<AnswerOption>
                    {
                        new AnswerOption { Text = "Graphical User Interface", IsCorrect = true },
                        new AnswerOption { Text = "General User Internet", IsCorrect = false },
                        new AnswerOption { Text = "Graphic Utility Integration", IsCorrect = false },
                        new AnswerOption { Text = "Global User Interface", IsCorrect = false }
                    },
                    "GUI stands for 'Graphical User Interface'."
                ),

                CreateQuestion(
                    itAbbreviations.Id,
                    "Windows, macOS and Linux are examples of an OS.",
                    "What does OS stand for?",
                    new List<AnswerOption>
                    {
                        new AnswerOption { Text = "Operating System", IsCorrect = true },
                        new AnswerOption { Text = "Online Software", IsCorrect = false },
                        new AnswerOption { Text = "Open Service", IsCorrect = false },
                        new AnswerOption { Text = "Operating Server", IsCorrect = false }
                    },
                    "OS stands for 'Operating System'."
                ),

                CreateQuestion(
                    itAbbreviations.Id,
                    "I use a VPN when connecting to the company network remotely.",
                    "What does VPN stand for?",
                    new List<AnswerOption>
                    {
                        new AnswerOption { Text = "Virtual Private Network", IsCorrect = true },
                        new AnswerOption { Text = "Verified Public Network", IsCorrect = false },
                        new AnswerOption { Text = "Virtual Program Node", IsCorrect = false },
                        new AnswerOption { Text = "Visual Private Node", IsCorrect = false }
                    },
                    "VPN stands for 'Virtual Private Network'."
                ),

                CreateQuestion(
                    itAbbreviations.Id,
                    "All computers in the office are connected to the same LAN.",
                    "What does LAN stand for?",
                    new List<AnswerOption>
                    {
                        new AnswerOption { Text = "Local Area Network", IsCorrect = true },
                        new AnswerOption { Text = "Large Access Network", IsCorrect = false },
                        new AnswerOption { Text = "Linked Application Node", IsCorrect = false },
                        new AnswerOption { Text = "Local Access Number", IsCorrect = false }
                    },
                    "LAN stands for 'Local Area Network'."
                ),

                CreateQuestion(
                    itAbbreviations.Id,
                    "A WAN can connect networks across cities or countries.",
                    "What does WAN stand for?",
                    new List<AnswerOption>
                    {
                        new AnswerOption { Text = "Wide Area Network", IsCorrect = true },
                        new AnswerOption { Text = "Wireless Access Node", IsCorrect = false },
                        new AnswerOption { Text = "Web Area Network", IsCorrect = false },
                        new AnswerOption { Text = "Wide Application Network", IsCorrect = false }
                    },
                    "WAN stands for 'Wide Area Network'."
                )
            };


            var existingQuestions = await questions
                .Find(_ => true)
                .ToListAsync();

            var existingPrompts = existingQuestions
                .Select(q => q.Prompt)
                .ToHashSet();

            var newQuestions = questionsToSeed
                .Where(q => !existingPrompts.Contains(q.Prompt))
                .ToList();

            if (newQuestions.Count > 0)
            {
                await questions.InsertManyAsync(newQuestions);
            }
        }


        private static Question CreateQuestion(
            string categoryId,
            string message,
            string prompt,
            List<AnswerOption> options,
            string explanation)
        {
            return new Question
            {
                CategoryId = categoryId,
                Message = message,
                Prompt = prompt,
                Options = options,
                Explanation = explanation
            };
        }
    }
}
