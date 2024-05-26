namespace UdemyApp
{
    public class Instructor
    {
        int id;
        string title;
        string name;
        string image;
        string jobTitle;
        
        static List<Instructor> instructorsList = new List<Instructor>();

        public Instructor(int id, string title, string name, string image, string jobTitle)
        {
            Id = id;
            Title = title;
            Name = name;
            Image = image;
            JobTitle = jobTitle;
        }

        public int Id { get => id; set => id = value; }
        public string Title { get => title; set => title = value; }
        public string Name { get => name; set => name = value; }
        public string Image { get => image; set => image = value; }
        public string JobTitle { get => jobTitle; set => jobTitle = value; }

        public bool Insert()
        {
            for (int i = 0; i < instructorsList.Count; i++)
            {
                if (this.Id == instructorsList[i].Id)
                {
                    return false;
                }
            }
            instructorsList.Add(this);
            return true;
        }

        static public List<Instructor> Read()
        {
            return instructorsList;
        }
    }
}
