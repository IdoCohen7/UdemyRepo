using UdemyApp;

namespace UdemyApp
{
    public class User
    {
        private static int nextId = 1;

        int id;
        string name;
        string email;
        string password;
        bool isAdmin;
        bool isActive;

        static List<Course> myCourses = new List<Course>();
        static List<User> usersList = new List<User>();

        public User(string name, string email, string password)
        {
            Id = nextId++; 
            Name = name;
            Email = email;
            Password = password;
            IsAdmin = false;
            IsActive = true;
        }

        public User() { }

        // adding admin user
        static User()
        {
            if (usersList.Count == 0)
            {
                usersList.Add(new User("admin", "admin@admin.com", "admin") { IsAdmin = true, IsActive = true });
            }
        }


        public int Id { get => id; set => id = value; }
        public string Name { get => name; set => name = value; }
        public string Email { get => email; set => email = value; }
        public string Password { get => password; set => password = value; }
        public bool IsAdmin { get => isAdmin; set => isAdmin = value; }
        public bool IsActive { get => isActive; set => isActive = value; }

        static public User Login(string email, string password)
        {
            foreach (User user in usersList)
            {
                if (user.Email == email && user.Password == password)
                {
                    return user;
                }
            }
            return null;
        }

         public bool Register()
        {
            foreach (User other in usersList)
            {
                if (this.Id == other.Id)
                {
                    return false;
                }
            }
            usersList.Add(this);
            return true;
        }

        static public List<User> Read()
        {
            return usersList;
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
