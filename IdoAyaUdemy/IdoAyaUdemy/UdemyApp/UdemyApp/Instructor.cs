namespace UdemyApp
{
    public class Instructor
    {
        int id;
        string title;
        string name;
        string image;
        string jobTitle;
        

        public Instructor(string title, string name, string image, string jobTitle)
        {
            Title = title;
            Name = name;
            Image = image;
            JobTitle = jobTitle;
        }

        public Instructor() { }

        public int Id { get => id; set => id = value; }
        public string Title { get => title; set => title = value; }
        public string Name { get => name; set => name = value; }
        public string Image { get => image; set => image = value; }
        public string JobTitle { get => jobTitle; set => jobTitle = value; }


        static public List<Instructor> Read()
        {
            DBservices dbs = new DBservices();
            return dbs.ReadInstructors();
        }

    }
}
