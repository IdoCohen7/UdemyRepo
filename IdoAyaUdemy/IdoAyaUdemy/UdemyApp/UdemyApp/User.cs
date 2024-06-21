using UdemyApp;

namespace UdemyApp
{
    public class User
    {

        int id;
        string name;
        string email;
        string password;
        bool isAdmin;
        bool isActive;

        public User(string name, string email, string password)
        {
            Name = name;
            Email = email;
            Password = password;
            IsAdmin = false;
            IsActive = true;
        }

        public User() { }


        public int Id { get => id; set => id = value; }
        public string Name { get => name; set => name = value; }
        public string Email { get => email; set => email = value; }
        public string Password { get => password; set => password = value; }
        public bool IsAdmin { get => isAdmin; set => isAdmin = value; }
        public bool IsActive { get => isActive; set => isActive = value; }

        static public User Login(string email, string password)
        {
            DBservices dbs = new DBservices();
            return dbs.Login(email, password);
        }

        static public List<User> Read()
        {
            DBservices db = new DBservices();
            return db.ReadUsers();
        }

        public static int insertCourse(int userId, int courseId)
        {
            DBservices dbs = new DBservices();
            return dbs.InsertCourse(userId, courseId);
        }

        public static List<Course> readUsersCourses(int userId)
        {
            DBservices dbs = new DBservices();
            return dbs.ReadCourses(userId); 
        }

        public static int RemoveCourse(int userId, int courseId)
        {
            DBservices db = new DBservices();
            return db.RemoveCourse(userId, courseId);
        }

        
    }
}
