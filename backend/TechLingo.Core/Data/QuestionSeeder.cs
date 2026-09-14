using MongoDB.Driver;
using TechLingo.Core.Entities;

namespace TechLingo.Core.Data
{
    public class QuestionSeeder
    {
        public async Task SeedAsync(
            IMongoCollection<Question> questions,
            Dictionary<string, string> categoryIds)
        {
            var questionsToSeed = new List<Question>();

            AddAbbreviationQuestions(
                questionsToSeed,
                categoryIds["internet-culture"],
                new List<AbbreviationQuestion>
                {
                    new("BRB", "BRB, need coffee.", "Be right back", "Be ready before", "Bring refreshments back", "Be right behind"),
                    new("AFK", "I'm AFK for a few minutes.", "Away from keyboard", "Away for keeps", "Available for knowledge", "Always finding keys"),
                    new("IDK", "IDK what movie we should watch.", "I don't know", "I do know", "I didn't know", "I demand knowledge"),
                    new("IMO", "IMO, that game is really good.", "In my opinion", "In my observation", "In most occasions", "It's my outlook"),
                    new("LOL", "LOL, that was hilarious!", "Laughing out loud", "Lots of laughter", "Laughing over lunch", "Laugh out later"),
                    new("TBH", "TBH, I didn't really like it.", "To be honest", "To be helpful", "Try being honest", "To be heard"),
                    new("GG", "GG everyone, that was close!", "Good game", "Great going", "Get going", "Good going"),
                    new("DM", "I'll send you the details in a DM.", "Direct message", "Digital message", "Direct mail", "Discussion message"),
                    new("BTW", "BTW, are you coming tonight?", "By the way", "Before the weekend", "Back to work", "Between the words"),
                    new("FYI", "FYI, the meeting starts at 10.", "For your information", "For your interest", "Follow your instructions", "Find your information"),
                    new("OMG", "OMG, I can't believe that happened!", "Oh my God", "On my guard", "Only my guess", "One more game"),
                    new("IRL", "We've talked online for years but never met IRL.", "In real life", "In recent life", "In real language", "Internet relationship level"),
                    new("NVM", "NVM, I figured it out.", "Never mind", "Not very much", "New voice message", "No valid message"),
                    new("TTYL", "I have to go now. TTYL!", "Talk to you later", "Text to you later", "Talk to your leader", "Time to yield leadership"),
                    new("LMK", "LMK if you want to join us.", "Let me know", "Let me keep", "Leave my keyboard", "Let me knock"),
                    new("ROFL", "ROFL, that video was so funny!", "Rolling on the floor laughing", "Reading online for laughs", "Running out for lunch", "Reply only for laughs"),
                    new("TL;DR", "The article is really long. Here's the TL;DR.", "Too long; didn't read", "Too late; didn't reply", "Too long; don't respond", "Text link; direct reply"),
                    new("POV", "POV: You forgot your password again.", "Point of view", "Part of video", "Position of viewer", "Perspective of visitor"),
                    new("NSFW", "That post is NSFW, so don't open it at work.", "Not safe for work", "Not suitable for websites", "No sharing from work", "Not secure for work"),
                    new("IIRC", "IIRC, we already talked about this yesterday.", "If I remember correctly", "If I recall completely", "If I read correctly", "If I respond correctly")
                }
            );

            AddAbbreviationQuestions(
                questionsToSeed,
                categoryIds["it-abbreviations"],
                new List<AbbreviationQuestion>
                {
                    new("API", "The frontend gets data from our API.", "Application Programming Interface", "Application Process Interface", "Automated Programming Interface", "Application Protocol Integration"),
                    new("CPU", "The computer's CPU is under heavy load.", "Central Processing Unit", "Central Program Unit", "Core Processing Utility", "Computer Processing Unit"),
                    new("RAM", "This computer has 16 GB of RAM.", "Random Access Memory", "Rapid Access Memory", "Random Allocation Memory", "Read Access Module"),
                    new("HTTP", "The browser uses HTTP to request a web page.", "Hypertext Transfer Protocol", "Hypertext Transmission Protocol", "Hyperlink Text Transfer Process", "Host Text Transfer Protocol"),
                    new("URL", "Copy the URL and send it to me.", "Uniform Resource Locator", "Universal Resource Link", "Uniform Reference Locator", "Universal Routing Location"),
                    new("DNS", "The DNS server translates the domain name.", "Domain Name System", "Domain Network Service", "Digital Name System", "Domain Naming Standard"),
                    new("SQL", "We use SQL to query the database.", "Structured Query Language", "Standard Query Language", "Structured Question Language", "Sequential Query Logic"),
                    new("IDE", "Visual Studio is the IDE we use for the backend.", "Integrated Development Environment", "Integrated Design Environment", "Interactive Development Editor", "Internal Debugging Engine"),
                    new("HTML", "HTML is used to structure content on a web page.", "HyperText Markup Language", "HyperText Management Language", "HyperText Modeling Language", "HyperText Mapping Language"),
                    new("CSS", "CSS controls how the website looks.", "Cascading Style Sheets", "Cascading Style System", "Central Style Sheets", "Custom Style Syntax"),
                    new("JSON", "The API returned the data as JSON.", "JavaScript Object Notation", "JavaScript Object Network", "JavaScript Online Notation", "JavaScript Output Names"),
                    new("IP", "Every device on the network has an IP address.", "Internet Protocol", "Internet Process", "Internal Protocol", "Integrated Packet"),
                    new("TCP", "TCP helps devices reliably send data across networks.", "Transmission Control Protocol", "Transfer Control Protocol", "Transmission Connection Protocol", "Transport Communication Process"),
                    new("USB", "Plug the keyboard into a USB port.", "Universal Serial Bus", "Universal System Bus", "Unified Serial Bus", "Universal Storage Bridge"),
                    new("SSD", "This laptop uses an SSD instead of a traditional hard drive.", "Solid State Drive", "Solid Storage Device", "Secure State Drive", "System Storage Disk"),
                    new("GUI", "The application has a GUI with buttons and menus.", "Graphical User Interface", "General User Interface", "Graphical Utility Interface", "Global User Interaction"),
                    new("OS", "Windows, macOS and Linux are examples of an OS.", "Operating System", "Operational Software", "Operating Service", "Open System"),
                    new("VPN", "I use a VPN when connecting to the company network remotely.", "Virtual Private Network", "Virtual Protected Network", "Verified Private Network", "Virtual Protocol Node"),
                    new("LAN", "All computers in the office are connected to the same LAN.", "Local Area Network", "Local Access Network", "Linked Area Network", "Local Application Node"),
                    new("WAN", "A WAN can connect networks across cities or countries.", "Wide Area Network", "Wireless Area Network", "Wide Access Network", "Web Application Network")
                }
            );

            AddAbbreviationQuestions(
                questionsToSeed,
                categoryIds["cybersecurity-basics"],
                new List<AbbreviationQuestion>
                {
                    new("MFA", "MFA adds another verification method to an account.", "Multi-Factor Authentication", "Multiple File Authorization", "Managed Factor Authentication", "Multi-Factor Authorization"),
                    new("2FA", "The account uses a password and a phone code through 2FA.", "Two-Factor Authentication", "Two-File Authorization", "Two-Factor Approval", "Two-Form Authentication"),
                    new("TLS", "The website uses TLS to protect data in transit.", "Transport Layer Security", "Transport Link Security", "Transfer Layer Standard", "Trusted Login Service"),
                    new("SSL", "Older documentation may refer to SSL for encrypted connections.", "Secure Sockets Layer", "Secure Session Layer", "Server Security Link", "Secure Socket Login"),
                    new("DDoS", "A DDoS attack floods a service with traffic from many devices.", "Distributed Denial of Service", "Distributed Disruption of Service", "Dynamic Denial of Service", "Distributed Denial of Security"),
                    new("IDS", "An IDS monitors activity and reports possible attacks.", "Intrusion Detection System", "Intrusion Defense System", "Identity Detection Service", "Internal Detection Scanner"),
                    new("IPS", "An IPS can automatically block suspicious network traffic.", "Intrusion Prevention System", "Intrusion Protection Service", "Identity Prevention System", "Internal Protection Scanner"),
                    new("SOC", "The security team monitors alerts from its SOC.", "Security Operations Center", "Security Oversight Center", "System Operations Control", "Secure Operations Console"),
                    new("SIEM", "The company uses SIEM to collect and analyze security events.", "Security Information and Event Management", "Security Inspection and Event Management", "System Information and Event Monitoring", "Security Integration and Encryption Management"),
                    new("CVE", "The vulnerability is listed with a CVE identifier.", "Common Vulnerabilities and Exposures", "Critical Vulnerabilities and Exploits", "Common Vulnerabilities and Exceptions", "Computer Verification and Evaluation"),
                    new("CVSS", "The team uses a CVSS score to judge vulnerability severity.", "Common Vulnerability Scoring System", "Common Vulnerability Security Standard", "Critical Vulnerability Scoring System", "Common Verification Scoring Service"),
                    new("IAM", "IAM controls digital identities and their access rights.", "Identity and Access Management", "Identity and Authorization Management", "Identity and Account Monitoring", "Internet and Access Management"),
                    new("RBAC", "RBAC grants permissions according to a user's role.", "Role-Based Access Control", "Role-Based Authentication Control", "Role-Based Account Configuration", "Rule-Based Authorization Check"),
                    new("AES", "The application uses AES to encrypt sensitive data.", "Advanced Encryption Standard", "Advanced Encoding Standard", "Automated Encryption System", "Application Encryption Service"),
                    new("PGP", "PGP can protect email messages and files.", "Pretty Good Privacy", "Private Global Protection", "Personal Gateway Privacy", "Protected Group Protocol"),
                    new("XSS", "An XSS vulnerability can inject scripts into a web page.", "Cross-Site Scripting", "Cross-Site Scanning", "Cross-System Scripting", "Cross-Server Scripting"),
                    new("CSRF", "A CSRF attack can send an unwanted request from a logged-in browser.", "Cross-Site Request Forgery", "Cross-Site Response Forgery", "Cross-Server Request Filter", "Client-Side Request Forgery"),
                    new("SQLi", "The login form was vulnerable to SQLi.", "SQL Injection", "SQL Integration", "SQL Interpretation", "SQL Inspection"),
                    new("WAF", "A WAF filters malicious requests sent to a website.", "Web Application Firewall", "Web Access Filter", "Website Authentication Framework", "Wireless Application Firewall"),
                    new("EDR", "The company uses EDR to monitor laptops and workstations.", "Endpoint Detection and Response", "Endpoint Defense and Recovery", "Event Detection and Reporting", "Endpoint Data and Recovery")
                }
            );

            AddAbbreviationQuestions(
                questionsToSeed,
                categoryIds["programming-languages"],
                new List<AbbreviationQuestion>
                {
                    new("OOP", "C# and Java are commonly used for OOP.", "Object-Oriented Programming", "Object-Oriented Processing", "Object Operation Programming", "Ordered Object Programming"),
                    new("SDK", "The developer installed the .NET SDK.", "Software Development Kit", "Software Deployment Kit", "System Development Kernel", "Source Debugging Kit"),
                    new("JDK", "The JDK contains tools for developing Java applications.", "Java Development Kit", "Java Deployment Kit", "Java Debugging Kernel", "Java Development Key"),
                    new("JRE", "A JRE provides what is needed to run a Java application.", "Java Runtime Environment", "Java Runtime Engine", "Java Resource Environment", "Java Repository Extension"),
                    new("JVM", "Compiled Java bytecode runs on a JVM.", "Java Virtual Machine", "Java Virtual Module", "Java Variable Manager", "Java Version Machine"),
                    new("CLR", "A .NET application executes under the CLR.", "Common Language Runtime", "Common Library Runtime", "Core Language Resolver", "Compiled Logic Runtime"),
                    new("IL", "A C# compiler normally produces IL before native code is generated.", "Intermediate Language", "Internal Language", "Integrated Logic", "Instruction Layer"),
                    new("JIT", "The runtime uses JIT compilation while the application runs.", "Just-In-Time", "Just-In-Translation", "Java Integration Tool", "Joined Instruction Table"),
                    new("REPL", "A REPL lets a programmer enter and evaluate code interactively.", "Read-Eval-Print Loop", "Read-Execute-Parse Loop", "Run-Evaluate-Print Loop", "Read-Eval-Process Loop"),
                    new("CLI", "The developer runs Git through a CLI.", "Command-Line Interface", "Command-Link Interface", "Console Language Interpreter", "Code Library Integration"),
                    new("DSL", "SQL is often described as a DSL for working with databases.", "Domain-Specific Language", "Domain-Syntax Language", "Data-Specific Language", "Dynamic Scripting Layer"),
                    new("AST", "The compiler represents parsed source code as an AST.", "Abstract Syntax Tree", "Abstract Source Tree", "Application Syntax Table", "Automated Syntax Translation"),
                    new("GC", "The runtime uses GC to reclaim memory that is no longer needed.", "Garbage Collection", "Global Cleanup", "Garbage Compression", "General Collection"),
                    new("LINQ", "A C# developer uses LINQ to query a collection.", "Language Integrated Query", "Language Integrated Queue", "Language Internal Query", "Linked Interface Query"),
                    new("ORM", "Entity Framework Core is an ORM.", "Object-Relational Mapping", "Object-Relational Model", "Object-Reference Mapping", "Object Runtime Management"),
                    new("CRUD", "The API supports CRUD operations for users.", "Create, Read, Update and Delete", "Create, Retrieve, Upload and Delete", "Copy, Read, Update and Deploy", "Create, Replace, Undo and Delete"),
                    new("DRY", "The team follows DRY by moving repeated logic into one method.", "Don't Repeat Yourself", "Don't Rewrite Yourself", "Don't Repeat Yesterday", "Develop Reusable Yield"),
                    new("KISS", "The KISS principle encourages uncomplicated solutions.", "Keep It Simple, Stupid", "Keep Interfaces Small, Separate", "Keep Implementation Strictly Structured", "Keep Inheritance Safe, Simple"),
                    new("YAGNI", "YAGNI discourages features that are not currently needed.", "You Aren't Gonna Need It", "You Always Get New Ideas", "Your Application Generates New Interfaces", "Your Architecture Guarantees Network Integrity"),
                    new("SOLID", "SOLID describes five principles for object-oriented design.", "Single responsibility, Open-closed, Liskov substitution, Interface segregation and Dependency inversion", "Single responsibility, Open-closed, Liskov substitution, Interface segregation and Dependency injection", "Single responsibility, Object composition, Liskov substitution, Interface segregation and Dependency inversion", "Single responsibility, Open-closed, Liskov substitution, Interface sharing and Dependency inversion")
                }
            );

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

        private static void AddAbbreviationQuestions(
            List<Question> questions,
            string categoryId,
            List<AbbreviationQuestion> abbreviationQuestions)
        {
            for (var index = 0; index < abbreviationQuestions.Count; index++)
            {
                var question = abbreviationQuestions[index];

                var options = new List<AnswerOption>
                {
                    new AnswerOption
                    {
                        Text = question.Meaning,
                        IsCorrect = true
                    }
                };

                // Each distractor is written for this abbreviation.
                // Matching letters alone should not reveal the correct answer.
                foreach (var incorrectAnswer in new[]
                {
                    question.IncorrectAnswer1,
                    question.IncorrectAnswer2,
                    question.IncorrectAnswer3
                })
                {
                    options.Add(new AnswerOption
                    {
                        Text = incorrectAnswer,
                        IsCorrect = false
                    });
                }

                questions.Add(CreateQuestion(
                    categoryId,
                    question.Message,
                    $"What does {question.Abbreviation} mean?",
                    options,
                    $"{question.Abbreviation} means '{question.Meaning}'."
                ));
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

        private sealed record AbbreviationQuestion(
            string Abbreviation,
            string Message,
            string Meaning,
            string IncorrectAnswer1,
            string IncorrectAnswer2,
            string IncorrectAnswer3
        );
    }
}
