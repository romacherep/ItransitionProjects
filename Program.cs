using System;
using System.Security.Cryptography;
using System.Text;
namespace RockPaperScisors
{
    class RockPaper
    {
        private string[] stepsOfTheGame;
        private int countOfSteps;
        private int computerTurn;
        private int playerTurn;
        private string key;
        private string hash;
        public RockPaper(string[] args)
        {
            stepsOfTheGame = args;
            countOfSteps = args.Length;
            if (args.Length % 2 == 0 || countOfSteps < 3)
            {
                Console.WriteLine("The number of steps must be an odd number of more than two. Example : Rock Paper Lizzard");
                return;
            } else if (AreTheRepeats())
            {
                Console.WriteLine("There should be no repeats in the selected steps");
                return;
            }
            PlayGay();
        }
        
        private bool AreTheRepeats()
        {
            for (int i = 0; i<stepsOfTheGame.Length;i++)
            {
                for (int j = 0; j < stepsOfTheGame.Length;j++)
                {
                    if (i!=j && stepsOfTheGame[i]==stepsOfTheGame[j])
                    {
                        return true;
                    }
                }
            }
            return false;
        }
        private void PlayGay()
        {
            ComputerTurn();
            PlayersTurn();
            if (playerTurn == 0)
            {
                return;
            }
            CheckGame();
        }
        private void HashingComputerTurn()
        {
            var keyForHash = new byte[16];
            using (RandomNumberGenerator randomNumberGenerator = RandomNumberGenerator.Create())
            {
                randomNumberGenerator.GetBytes(keyForHash);
            }
            key = BitConverter.ToString(keyForHash).Replace("-", "");
            using (var hmacsha = new HMACSHA256(keyForHash))
            {
                hash = BitConverter.ToString(hmacsha.ComputeHash(Encoding.UTF8.GetBytes(computerTurn.ToString().ToCharArray()))).Replace("-","");
            }
        }

        private void ComputerTurn()
        {
            computerTurn = RandomNumberGenerator.GetInt32(1,countOfSteps+1);
            HashingComputerTurn();
            Console.WriteLine("HMAC: "+hash);
        }
        private void CheckGame()
        {
            int centreOfSteps = countOfSteps / 2;
            int directionOfGame = computerTurn - playerTurn;
            if (directionOfGame == 0)
            {
                Console.WriteLine("Draw");
            } 
            else
            {
                if (directionOfGame < 0 && Math.Abs(directionOfGame) > centreOfSteps)
                {
                    if (playerTurn <= computerTurn + centreOfSteps)
                    {
                        Console.WriteLine("Computer Won");
                    }
                    else
                    {
                        Console.WriteLine("Player Won");
                    }
                }
                else if (directionOfGame > 0)
                {
                    if (computerTurn <= playerTurn + centreOfSteps)
                    {
                        Console.WriteLine("Player Won");
                    }
                    else
                    {
                        Console.WriteLine("Computer Won");
                    }
                }
                else if (Math.Abs(directionOfGame) <= centreOfSteps)
                {
                    if (directionOfGame < 0)
                    {
                        Console.WriteLine("Computer Won");
                    }
                    else
                    {
                        Console.WriteLine("Player Won");
                    }
                }
            }
            
            Console.WriteLine($"The computer chose: {stepsOfTheGame[computerTurn-1]}\nKey: {key}");
        }
        private void PlayersTurn()
        {
            int i = 1;
            Console.WriteLine("Chouse your turn");
            foreach(var steping in stepsOfTheGame)
            {
                Console.WriteLine($"{i++}.{steping}");
            }
            Console.WriteLine("0. exit");
            int step = -1;
            while (step < 0 || step > stepsOfTheGame.Length)
            {
                bool flag = int.TryParse(Console.ReadLine(),out step);
            }
            playerTurn = step;
            Console.WriteLine("The player chose: " + stepsOfTheGame[playerTurn - 1]);
        }
    }
    class Program
    {

        static void Main(string[] args)
        {
            var gay = new RockPaper(args);
        }
    }
}
