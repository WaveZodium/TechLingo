using MongoDB.Driver;
using TechLingo.Core.Entities;

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
            //Frågor
            var questionsToSeed = new List<Question>
            {
                //Internetkultur

                CreateQuestion(
                    internetSlang.Id,
                    "BRB, need coffee.",
                    "What does BRB mean?",
                    [
                        "Be right back",
                        "Bring right back",
                        "Be really busy",
                        "Back right before"
                    ],
                    0,
                    "BRB means 'Be right back'."
                ),

                CreateQuestion(
                    internetSlang.Id,
                    "I'm AFK for a few minutes.",
                    "What does AFK mean?",
                    [
                        "Away from keyboard",
                        "Available for knowledge",
                        "Always feeling kind",
                        "Away for keeps"
                    ],
                    0,
                    "AFK means 'Away from keyboard'."
                ),

                CreateQuestion(
                    internetSlang.Id,
                    "IDK what movie we should watch.",
                    "What does IDK mean?",
                    [
                        "I don't know",
                        "I do know",
                        "Internet data key",
                        "I didn't know"
                    ],
                    0,
                    "IDK means 'I don't know'."
                ),

                CreateQuestion(
                    internetSlang.Id,
                    "IMO, that game is really good.",
                    "What does IMO mean?",
                    [
                        "In my opinion",
                        "Internet message online",
                        "I might order",
                        "In most occasions"
                    ],
                    0,
                    "IMO means 'In my opinion'."
                ),

                CreateQuestion(
                    internetSlang.Id,
                    "LOL, that was hilarious!",
                    "What does LOL mean?",
                    [
                        "Laughing out loud",
                        "Lots of luck",
                        "Leave online later",
                        "Look over there"
                    ],
                    0,
                    "LOL means 'Laughing out loud'."
                ),

                CreateQuestion(
                    internetSlang.Id,
                    "TBH, I didn't really like it.",
                    "What does TBH mean?",
                    [
                        "To be honest",
                        "To be helpful",
                        "Text back here",
                        "Try being happy"
                    ],
                    0,
                    "TBH means 'To be honest'."
                ),

                CreateQuestion(
                    internetSlang.Id,
                    "GG everyone, that was close!",
                    "What does GG usually mean in gaming?",
                    [
                        "Good game",
                        "Great group",
                        "Go again",
                        "Game glitch"
                    ],
                    0,
                    "GG means 'Good game' and is commonly used after an online match."
                ),

                CreateQuestion(
                    internetSlang.Id,
                    "I'll send you the details in a DM.",
                    "What does DM mean?",
                    [
                        "Direct message",
                        "Data message",
                        "Desktop mode",
                        "Digital mail"
                    ],
                    0,
                    "DM means 'Direct message', a private message sent to another user."
                ),

                CreateQuestion(
                    internetSlang.Id,
                    "BTW, are you coming tonight?",
                    "What does BTW mean?",
                    [
                        "By the way",
                        "Back to work",
                        "Before the weekend",
                        "Bring the water"
                    ],
                    0,
                    "BTW means 'By the way'."
                ),

                CreateQuestion(
                    internetSlang.Id,
                    "FYI, the meeting starts at 10.",
                    "What does FYI mean?",
                    [
                        "For your information",
                        "Find your inbox",
                        "For your internet",
                        "Follow your instructions"
                    ],
                    0,
                    "FYI means 'For your information'."
                ),

                CreateQuestion(
                    internetSlang.Id,
                    "OMG, I can't believe that happened!",
                    "What does OMG mean?",
                    [
                        "Oh my God",
                        "Online message group",
                        "Open my game",
                        "Only my guess"
                    ],
                    0,
                    "OMG means 'Oh my God' and is commonly used to express surprise."
                ),

                CreateQuestion(
                    internetSlang.Id,
                    "We've talked online for years but never met IRL.",
                    "What does IRL mean?",
                    [
                        "In real life",
                        "Internet response link",
                        "Instant reply list",
                        "In recent login"
                    ],
                    0,
                    "IRL means 'In real life'."
                ),

                CreateQuestion(
                    internetSlang.Id,
                    "NVM, I figured it out.",
                    "What does NVM mean?",
                    [
                        "Never mind",
                        "New voice message",
                        "Not very much",
                        "Next video mode"
                    ],
                    0,
                    "NVM means 'Never mind'."
                ),

                CreateQuestion(
                    internetSlang.Id,
                    "I have to go now. TTYL!",
                    "What does TTYL mean?",
                    [
                        "Talk to you later",
                        "Text to your location",
                        "Try to yell louder",
                        "Time to you later"
                    ],
                    0,
                    "TTYL means 'Talk to you later'."
                ),

                CreateQuestion(
                    internetSlang.Id,
                    "LMK if you want to join us.",
                    "What does LMK mean?",
                    [
                        "Let me know",
                        "Leave my keyboard",
                        "Look more kindly",
                        "Last message known"
                    ],
                    0,
                    "LMK means 'Let me know'."
                ),

                CreateQuestion(
                    internetSlang.Id,
                    "ROFL, that video was so funny!",
                    "What does ROFL mean?",
                    [
                        "Rolling on the floor laughing",
                        "Running online for lunch",
                        "Reply only for laughs",
                        "Read our funny link"
                    ],
                    0,
                    "ROFL means 'Rolling on the floor laughing'."
                ),

                CreateQuestion(
                    internetSlang.Id,
                    "The article is really long. Here's the TL;DR.",
                    "What does TL;DR mean?",
                    [
                        "Too long; didn't read",
                        "Text link; direct reply",
                        "Too late; don't respond",
                        "Try later; download required"
                    ],
                    0,
                    "TL;DR means 'Too long; didn't read' and is often used before a short summary."
                ),

                CreateQuestion(
                    internetSlang.Id,
                    "POV: You forgot your password again.",
                    "What does POV mean?",
                    [
                        "Point of view",
                        "Part of video",
                        "Post on view",
                        "Page of visitors"
                    ],
                    0,
                    "POV means 'Point of view'."
                ),

                CreateQuestion(
                    internetSlang.Id,
                    "That post is NSFW, so don't open it at work.",
                    "What does NSFW mean?",
                    [
                        "Not safe for work",
                        "No signal from website",
                        "New software for Windows",
                        "Network security firewall warning"
                    ],
                    0,
                    "NSFW means 'Not safe for work' and warns that content may be inappropriate to view in a workplace."
                ),

                CreateQuestion(
                    internetSlang.Id,
                    "IIRC, we already talked about this yesterday.",
                    "What does IIRC mean?",
                    [
                        "If I remember correctly",
                        "If internet responds correctly",
                        "I instantly replied correctly",
                        "Internet information request code"
                    ],
                    0,
                    "IIRC means 'If I remember correctly'."
                ),
                //IT-slang

                CreateQuestion(
                    itAbbreviations.Id,
                    "The frontend gets data from our API.",
                    "What does API stand for?",
                    [
                        "Application Programming Interface",
                        "Application Program Internet",
                        "Advanced Programming Integration",
                        "Automated Program Interface"
                    ],
                    0,
                    "API stands for 'Application Programming Interface'."
                ),

                CreateQuestion(
                    itAbbreviations.Id,
                    "The computer's CPU is under heavy load.",
                    "What does CPU stand for?",
                    [
                        "Central Processing Unit",
                        "Computer Processing Utility",
                        "Central Program User",
                        "Core Processing Utility"
                    ],
                    0,
                    "CPU stands for 'Central Processing Unit'."
                ),

                CreateQuestion(
                    itAbbreviations.Id,
                    "This computer has 16 GB of RAM.",
                    "What does RAM stand for?",
                    [
                        "Random Access Memory",
                        "Rapid Application Memory",
                        "Read Access Module",
                        "Remote Active Memory"
                    ],
                    0,
                    "RAM stands for 'Random Access Memory'."
                ),

                CreateQuestion(
                    itAbbreviations.Id,
                    "Open the website using HTTPS.",
                    "What does HTTP stand for?",
                    [
                        "Hypertext Transfer Protocol",
                        "High Transfer Text Process",
                        "Hyperlink Text Transfer Program",
                        "Host Transfer Technology Protocol"
                    ],
                    0,
                    "HTTP stands for 'Hypertext Transfer Protocol'."
                ),

                CreateQuestion(
                    itAbbreviations.Id,
                    "Copy the URL and send it to me.",
                    "What does URL stand for?",
                    [
                        "Uniform Resource Locator",
                        "Universal Routing Link",
                        "User Resource Location",
                        "Uniform Reference Link"
                    ],
                    0,
                    "URL stands for 'Uniform Resource Locator'."
                ),

                CreateQuestion(
                    itAbbreviations.Id,
                    "The DNS server translates the domain name.",
                    "What does DNS stand for?",
                    [
                        "Domain Name System",
                        "Data Network Service",
                        "Domain Network Storage",
                        "Digital Naming Service"
                    ],
                    0,
                    "DNS stands for 'Domain Name System'."
                ),

                CreateQuestion(
                    itAbbreviations.Id,
                    "We use SQL to query the database.",
                    "What does SQL stand for?",
                    [
                        "Structured Query Language",
                        "System Query Logic",
                        "Standard Question Language",
                        "Structured Queue Logic"
                    ],
                    0,
                    "SQL stands for 'Structured Query Language'."
                ),

                CreateQuestion(
                    itAbbreviations.Id,
                    "Visual Studio is the IDE we use for the backend.",
                    "What does IDE stand for?",
                    [
                        "Integrated Development Environment",
                        "Internet Development Engine",
                        "Integrated Data Editor",
                        "Internal Development Environment"
                    ],
                    0,
                    "IDE stands for 'Integrated Development Environment'."
                ),

                CreateQuestion(
                    itAbbreviations.Id,
                    "HTML is used to structure content on a web page.",
                    "What does HTML stand for?",
                    [
                        "HyperText Markup Language",
                        "High Transfer Machine Language",
                        "Hyperlink Text Management Logic",
                        "Home Tool Markup Language"
                    ],
                    0,
                    "HTML stands for 'HyperText Markup Language'."
                ),

                CreateQuestion(
                    itAbbreviations.Id,
                    "CSS controls how the website looks.",
                    "What does CSS stand for?",
                    [
                        "Cascading Style Sheets",
                        "Computer Style System",
                        "Creative Software Syntax",
                        "Central Styling Service"
                    ],
                    0,
                    "CSS stands for 'Cascading Style Sheets'."
                ),

                CreateQuestion(
                    itAbbreviations.Id,
                    "The API returned the data as JSON.",
                    "What does JSON stand for?",
                    [
                        "JavaScript Object Notation",
                        "Java Source Object Network",
                        "Joined System Object Name",
                        "JavaScript Online Network"
                    ],
                    0,
                    "JSON stands for 'JavaScript Object Notation'."
                ),

                CreateQuestion(
                    itAbbreviations.Id,
                    "Every device on the network has an IP address.",
                    "What does IP stand for?",
                    [
                        "Internet Protocol",
                        "Internal Program",
                        "Internet Process",
                        "Integrated Protocol"
                    ],
                    0,
                    "IP stands for 'Internet Protocol'."
                ),

                CreateQuestion(
                    itAbbreviations.Id,
                    "TCP helps devices reliably send data across networks.",
                    "What does TCP stand for?",
                    [
                        "Transmission Control Protocol",
                        "Transfer Communication Process",
                        "Technical Connection Protocol",
                        "Transmission Computer Program"
                    ],
                    0,
                    "TCP stands for 'Transmission Control Protocol'."
                ),

                CreateQuestion(
                    itAbbreviations.Id,
                    "Plug the keyboard into a USB port.",
                    "What does USB stand for?",
                    [
                        "Universal Serial Bus",
                        "Unified System Base",
                        "Universal Storage Block",
                        "User System Bus"
                    ],
                    0,
                    "USB stands for 'Universal Serial Bus'."
                ),

                CreateQuestion(
                    itAbbreviations.Id,
                    "This laptop uses an SSD instead of a traditional hard drive.",
                    "What does SSD stand for?",
                    [
                        "Solid State Drive",
                        "System Storage Device",
                        "Secure System Disk",
                        "Serial Storage Drive"
                    ],
                    0,
                    "SSD stands for 'Solid State Drive'."
                ),

                CreateQuestion(
                    itAbbreviations.Id,
                    "The application has a simple GUI with buttons and menus.",
                    "What does GUI stand for?",
                    [
                        "Graphical User Interface",
                        "General User Internet",
                        "Graphic Utility Integration",
                        "Global User Interface"
                    ],
                    0,
                    "GUI stands for 'Graphical User Interface'."
                ),

                CreateQuestion(
                    itAbbreviations.Id,
                    "Windows, macOS and Linux are examples of an OS.",
                    "What does OS stand for?",
                    [
                        "Operating System",
                        "Online Software",
                        "Open Service",
                        "Operating Server"
                    ],
                    0,
                    "OS stands for 'Operating System'."
                ),

                CreateQuestion(
                    itAbbreviations.Id,
                    "I use a VPN when connecting to the company network remotely.",
                    "What does VPN stand for?",
                    [
                        "Virtual Private Network",
                        "Verified Public Network",
                        "Virtual Program Node",
                        "Visual Private Node"
                    ],
                    0,
                    "VPN stands for 'Virtual Private Network'."
                ),

                CreateQuestion(
                    itAbbreviations.Id,
                    "All computers in the office are connected to the same LAN.",
                    "What does LAN stand for?",
                    [
                        "Local Area Network",
                        "Large Access Network",
                        "Linked Application Node",
                        "Local Access Number"
                    ],
                    0,
                    "LAN stands for 'Local Area Network'."
                ),

                CreateQuestion(
                    itAbbreviations.Id,
                    "A WAN can connect networks across cities or countries.",
                    "What does WAN stand for?",
                    [
                        "Wide Area Network",
                        "Wireless Access Node",
                        "Web Area Network",
                        "Wide Application Network"
                    ],
                    0,
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
            string[] optionTexts,
            int correctAnswerIndex,
            string explanation)
        {
            var options = optionTexts
                .Select(text => new AnswerOption
                {
                    Text = text
                })
                .ToList();

            return new Question
            {
                CategoryId = categoryId,
                Message = message,
                Prompt = prompt,
                Options = options,
                CorrectAnswerId = options[correctAnswerIndex].Id,
                Explanation = explanation
            };
        }
    }
}