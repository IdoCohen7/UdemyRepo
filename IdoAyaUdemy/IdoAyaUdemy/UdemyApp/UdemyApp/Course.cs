using System.Globalization;
using System.Security.Cryptography.X509Certificates;

namespace UdemyApp
{
    public class Course
    {
        int id;
        string title;
        string url;
        double rating;
        int numOfReviews;
        int instructorId;
        string imageRef;
        double duration;
        string lastUpdate;
        bool isActive;


        public Course(string title, string url, double rating, int numOfReviews, int instructorId, string imageRef, double duration)
        {
            Title = title;
            Url = url;
            Rating = rating;
            NumOfReviews = numOfReviews;
            InstructorId = instructorId;
            ImageRef = imageRef;
            Duration = duration;
            LastUpdate = DateTime.Now.ToString("ddMMyyyy");
            IsActive = true;
        }

        public Course()
        {

        }

        public int Id { get => id; set => id = value; }
        public string Title { get => title; set => title = value; }
        public string Url { get => url; set => url = value; }
        public double Rating { get => rating; set => rating = value; }
        public int NumOfReviews { get => numOfReviews; set => numOfReviews = value; }
        public int InstructorId { get => instructorId; set => instructorId = value; }
        public string ImageRef { get => imageRef; set => imageRef = value; }
        public double Duration { get => duration; set => duration = value; }
        public string LastUpdate { get => lastUpdate; set => lastUpdate = value; }
        public bool IsActive  { get => isActive; set => isActive = value; }

        static public List<Object> Read()
        {
            DBservices dbs = new DBservices();
            return dbs.ReadCourses();
        }
        public void Delete()
        {
        }

        public static List<Course> GetCoursesByDuration(int userId, float min, float max)
        {
            DBservices dbs = new DBservices();
            return dbs.ReadCoursesByDuration(userId, min, max);
        }

        public static List<Course> GetCoursesByRating(int userId, float min, float max)
        {
            DBservices dbs = new DBservices();
            return dbs.ReadCoursesByRating(userId, min, max);
        }

        public int ToggleActivity(int id, int value)
        {
            DBservices db = new DBservices();
            return db.ToggleCourseActivity(id, value);
        }

    }
}
