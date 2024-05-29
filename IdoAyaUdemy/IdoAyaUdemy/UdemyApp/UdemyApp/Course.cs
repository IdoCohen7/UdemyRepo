using System.Globalization;

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

        static List<Course> coursesList = new List<Course>();

        public Course(int id, string title, string url, double rating, int numOfReviews, int instructorId, string imageRef, double duration, string lastUpdate)
        {
            Id = id;
            Title = title;
            Url = url;
            Rating = rating;
            NumOfReviews = numOfReviews;
            InstructorId = instructorId;
            ImageRef = imageRef;
            Duration = duration;
            LastUpdate = lastUpdate;
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

        public bool Insert()
        {
            for (int i = 0; i < coursesList.Count; i++)
            {
                Course course = coursesList[i];
                if (course != null)
                {
                    if (this.Id == course.Id || this.title == course.title)
                    {
                        return false;
                    }
                }
                
            }
            coursesList.Add(this);
            return true;
        }

        static public List<Course> Read()
        {
            return coursesList;
        }

        static public List<Course> GetByDurationRange(double start, double end)
        {
            List<Course> fittingCourses = new List<Course>();
            foreach (Course course in  coursesList)
            {
                if (course.Duration <= end && course.Duration >= start)
                {
                    fittingCourses.Add(course);
                }
            }
            return fittingCourses;  
        }

        static public List<Course> GetByRatingRange(double start, double end)
        {
            List<Course> fittingCourses = new List<Course>();
            foreach (Course course in coursesList)
            {
                if (course.Rating <= end && course.Rating >= start)
                {
                    fittingCourses.Add(course);
                }
            }
            return fittingCourses;
        }

        public void Delete()
        {
            coursesList.Remove(this);
        }

    }
}
