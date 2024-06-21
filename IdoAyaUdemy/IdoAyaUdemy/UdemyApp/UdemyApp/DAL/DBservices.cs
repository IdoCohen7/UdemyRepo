using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.SqlClient;
using System.Data;
using System.Text;
using UdemyApp;
using Microsoft.AspNetCore.Identity;

/// <summary>
/// DBServices is a class created by me to provides some DataBase Services
/// </summary>
public class DBservices
{
    public SqlDataAdapter da;
    public DataTable dt;

    public DBservices()
    {
        //
        // TODO: Add constructor logic here
        //
    }

    //--------------------------------------------------------------------------------------------------
    // This method creates a connection to the database according to the connectionString name in the web.config 
    //--------------------------------------------------------------------------------------------------
    public SqlConnection connect(String conString)
    {

        // read the connection string from the configuration file
        IConfigurationRoot configuration = new ConfigurationBuilder()
        .AddJsonFile("appsettings.json").Build();
        string cStr = configuration.GetConnectionString("myProjDB");
        SqlConnection con = new SqlConnection(cStr);
        con.Open();
        return con;
    }

    private SqlCommand CreateCommandWithStoredProcedureReadCourses(String spName, SqlConnection con)
    {

        SqlCommand cmd = new SqlCommand(); // create the command object

        cmd.Connection = con;              // assign the connection to the command object

        cmd.CommandText = spName;      // can be Select, Insert, Update, Delete 

        cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

        cmd.CommandType = System.Data.CommandType.StoredProcedure; // the type of the command, can also be text

        return cmd;
    }

    public List<User> ReadUsers()
    {
        SqlConnection con = null;
        SqlCommand cmd;

        try
        {
            con = connect("myProjDB"); // create the connection
            cmd = CreateCommandWithStoredProcedureReadCourses("SP_ReadUsers", con); // create the command

            List<User> users = new List<User>();

            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

            while (dataReader.Read())
            {
                User u = new User();
                u.Id = Convert.ToInt32(dataReader["id"]);
                u.Name = dataReader["name"].ToString();
                u.Email = dataReader["email"].ToString();
                u.Password = dataReader["password"].ToString();
                u.IsAdmin = Convert.ToBoolean(dataReader["isAdmin"]);
                u.IsActive = Convert.ToBoolean(dataReader["isActive"]);
                users.Add(u);
            }

            return users;
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }
        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }
    }




    public List<Object> ReadTopFiveCourses()
    {
        SqlConnection con = null;
        SqlCommand cmd;

        try
        {
            con = connect("myProjDB"); // create the connection
            cmd = CreateCommandWithStoredProcedureReadCourses("SP_GetTop5Course", con); // create the command

            List<Object> courses = new List<Object>();

            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

            while (dataReader.Read())
            {
                courses.Add(new
                {

                    Id = Convert.ToInt32(dataReader["CourseID"]),
                    Title = dataReader["CourseName"].ToString(),
                    Rating = Math.Round(Convert.ToDouble(dataReader["CourseRating"]), 2),
                    UsersListed = Convert.ToDouble(dataReader["NumberOfUsers"]),

                });
            }

            return courses;
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }
        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }
    }

    //--------------------------------------------------------------------------------------------------
    // This method reads courses from the courses table 
    //--------------------------------------------------------------------------------------------------
    public List<Object> ReadCourses()
    {
        SqlConnection con = null;
        SqlCommand cmd;

        try
        {
            con = connect("myProjDB"); // create the connection
            cmd = CreateCommandWithStoredProcedureReadCourses("SP_ReadCoursesFromTable", con); // create the command

            List<Object> courses = new List<Object>();

            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

            while (dataReader.Read())
            {
                courses.Add(new
                {
                    Id = Convert.ToInt32(dataReader["id"]),
                    Title = dataReader["title"].ToString(),
                    Url = dataReader["url"].ToString(),
                    Rating = Math.Round(Convert.ToDouble(dataReader["rating"]), 2),
                    NumOfReviews = Convert.ToInt32(dataReader["num_reviews"]),
                    InstructorId = Convert.ToInt32(dataReader["instructors_id"]),
                    ImageRef = dataReader["image"].ToString(),
                    Duration = Convert.ToDouble(dataReader["duration"]),
                    LastUpdate = ((DateTime)dataReader["last_update_date"]).ToString("dd/MM/yyyy"),
                    InstructorName = dataReader["name"].ToString(),
                    IsActive = Convert.ToInt32(dataReader["is_active"])
                });
            }
            
            
            return courses;
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }
        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }
    }

    public List<Instructor> ReadInstructors()
    {
        SqlConnection con = null;
        SqlCommand cmd;

        try
        {
            con = connect("myProjDB"); // create the connection
            cmd = CreateCommandWithStoredProcedureReadCourses("SP_ReadInstructors", con); // create the command

            List<Instructor> instructors = new List<Instructor>();

            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

            while (dataReader.Read())
            {
                Instructor i = new Instructor();

                i.Id = Convert.ToInt32(dataReader["id"]);
                i.Title = dataReader["title"].ToString();
                i.Name = dataReader["name"].ToString();
                i.Image = dataReader["image"].ToString();
                i.JobTitle = dataReader["job_title"].ToString();
                instructors.Add(i);
            }

            return instructors;
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }
        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }
    }

    private SqlCommand CreateCommandWithStoredProcedure_InsertToUserCourse(String spName, SqlConnection con, int userId, int courseId)
    {

        SqlCommand cmd = new SqlCommand(); // create the command object

        cmd.Connection = con;              // assign the connection to the command object

        cmd.CommandText = spName;      // can be Select, Insert, Update, Delete 

        cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

        cmd.CommandType = System.Data.CommandType.StoredProcedure; // the type of the command, can also be text

        cmd.Parameters.AddWithValue("@userId", userId);

        cmd.Parameters.AddWithValue("@courseId", courseId);

        return cmd;
    }


    public int InsertCourse(int userId, int courseId)
    {
        SqlConnection con = null;
        SqlCommand cmd;

        try
        {
            con = connect("myProjDB"); // create the connection

            cmd = CreateCommandWithStoredProcedure_InsertToUserCourse("SP_InsertToUserCourseTable", con, userId, courseId); // create the command

            int numEffected = cmd.ExecuteNonQuery(); // execute the command
            return numEffected;
        }
        catch (SqlException sqlEx)
        {
            // Check for specific SQL error number for primary key violation
            if (sqlEx.Number == 2627 || sqlEx.Number == 2601)
            {
                // Log the primary key violation error
                // Example: LogError(sqlEx);
                return -1; // Return a specific code for primary key violation
            }
            else
            {
                // Log other SQL exceptions
                // Example: LogError(sqlEx);
                return -2; // Return a different code for other SQL errors
            }
        }
        catch (Exception ex)
        {
            // Log the general exception
            // Example: LogError(ex);
            return -3; // Return a code for general exceptions
        }
        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }
    }

    private SqlCommand CreateCommandWithStoredProcedure_ReadUsersCourses(String spName, SqlConnection con, int userId)
    {

        SqlCommand cmd = new SqlCommand(); // create the command object

        cmd.Connection = con;              // assign the connection to the command object

        cmd.CommandText = spName;      // can be Select, Insert, Update, Delete 

        cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

        cmd.CommandType = System.Data.CommandType.StoredProcedure; // the type of the command, can also be text

        cmd.Parameters.AddWithValue("@id", userId);

        return cmd;
    }

    public List<Course> ReadCourses(int userId)
    {
        SqlConnection con = null;
        SqlCommand cmd;

        try
        {
            con = connect("myProjDB"); // create the connection
            cmd = CreateCommandWithStoredProcedure_ReadUsersCourses("SP_ReadCoursesFromOneUser", con, userId); // create the command

            List<Course> courses = new List<Course>();

            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

            while (dataReader.Read())
            {
                Course c = new Course();
                c.Id = Convert.ToInt32(dataReader["id"]);
                c.Title = dataReader["title"].ToString();
                c.Url = dataReader["url"].ToString();
                c.Rating = Math.Round(Convert.ToDouble(dataReader["rating"]), 2);
                c.NumOfReviews = Convert.ToInt32(dataReader["num_reviews"]);
                c.InstructorId = Convert.ToInt32(dataReader["instructors_id"]);
                c.ImageRef = dataReader["image"].ToString();
                c.Duration = Convert.ToDouble(dataReader["duration"]);
                c.LastUpdate = ((DateTime)dataReader["last_update_date"]).ToString("dd/MM/yyyy");
                courses.Add(c);
            }

            return courses;
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }
        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }
    }

    public List<Course> ReadInstructorsCourses(int instructorId)
    {
        SqlConnection con = null;
        SqlCommand cmd;

        try
        {
            con = connect("myProjDB"); // create the connection
            cmd = CreateCommandWithStoredProcedure_ReadUsersCourses("SP_ReadInstructorsCourses", con, instructorId); // create the command

            List<Course> courses = new List<Course>();

            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

            while (dataReader.Read())
            {
                Course c = new Course();
                c.Id = Convert.ToInt32(dataReader["id"]);
                c.Title = dataReader["title"].ToString();
                c.Url = dataReader["url"].ToString();
                c.Rating = Math.Round(Convert.ToDouble(dataReader["rating"]), 2);
                c.NumOfReviews = Convert.ToInt32(dataReader["num_reviews"]);
                c.InstructorId = Convert.ToInt32(dataReader["instructors_id"]);
                c.ImageRef = dataReader["image"].ToString();
                c.Duration = Convert.ToDouble(dataReader["duration"]);
                c.LastUpdate = ((DateTime)dataReader["last_update_date"]).ToString("dd/MM/yyyy");
                courses.Add(c);
            }

            return courses;
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }
        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }
    }

    private SqlCommand CreateCommandWithStoredProcedure_RemoveCourseFromList(String spName, SqlConnection con, int userId, int courseId)
    {

        SqlCommand cmd = new SqlCommand(); // create the command object

        cmd.Connection = con;              // assign the connection to the command object

        cmd.CommandText = spName;      // can be Select, Insert, Update, Delete 

        cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

        cmd.CommandType = System.Data.CommandType.StoredProcedure; // the type of the command, can also be text

        cmd.Parameters.AddWithValue("@user_id", userId);

        cmd.Parameters.AddWithValue("@course_id", courseId);

        return cmd;
    }

    public int RemoveCourse(int userId, int courseId)
    {
        SqlConnection con = null;
        SqlCommand cmd;

        try
        {
            con = connect("myProjDB"); // create the connection

            cmd = CreateCommandWithStoredProcedure_RemoveCourseFromList("SP_DeleteCourseFromList", con, userId, courseId); // create the command

            int numEffected = cmd.ExecuteNonQuery(); // execute the command
            return numEffected;
        }

        catch (Exception ex)
        {
            throw new Exception("Couldn't remove course", ex);
        }
        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }
    }

    private SqlCommand CreateCommandWithStoredProcedure_GetCoursesByDuration(String spName, SqlConnection con, int userId, float low, float high)
    {

        SqlCommand cmd = new SqlCommand(); // create the command object

        cmd.Connection = con;              // assign the connection to the command object

        cmd.CommandText = spName;      // can be Select, Insert, Update, Delete 

        cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

        cmd.CommandType = System.Data.CommandType.StoredProcedure; // the type of the command, can also be text

        cmd.Parameters.AddWithValue("@id", userId);

        cmd.Parameters.AddWithValue("@low", low);

        cmd.Parameters.AddWithValue("@high", high);

        return cmd;
    }

    public List<Course> ReadCoursesByDuration(int userId, float min, float max)
    {
        SqlConnection con = null;
        SqlCommand cmd;

        try
        {
            con = connect("myProjDB"); // create the connection
            cmd = CreateCommandWithStoredProcedure_GetCoursesByDuration("SP_ReadCoursesByDuration", con, userId, min, max); // create the command

            List<Course> courses = new List<Course>();

            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

            while (dataReader.Read())
            {
                Course c = new Course();
                c.Id = Convert.ToInt32(dataReader["id"]);
                c.Title = dataReader["title"].ToString();
                c.Url = dataReader["url"].ToString();
                c.Rating = Math.Round(Convert.ToDouble(dataReader["rating"]), 2);
                c.NumOfReviews = Convert.ToInt32(dataReader["num_reviews"]);
                c.InstructorId = Convert.ToInt32(dataReader["instructors_id"]);
                c.ImageRef = dataReader["image"].ToString();
                c.Duration = Convert.ToDouble(dataReader["duration"]);
                c.LastUpdate = ((DateTime)dataReader["last_update_date"]).ToString("dd/MM/yyyy");
                courses.Add(c);
            }

            return courses;
        }
        catch (Exception ex)
        {
            // write to log
            throw new Exception("Couldn't retrieve any courses", ex);
        }
        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }
    }

    public List<Course> ReadCoursesByRating(int userId, float min, float max)
    {
        SqlConnection con = null;
        SqlCommand cmd;

        try
        {
            con = connect("myProjDB"); // create the connection
            cmd = CreateCommandWithStoredProcedure_GetCoursesByDuration("SP_ReadCoursesByRating", con, userId, min, max); // create the command

            List<Course> courses = new List<Course>();

            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

            while (dataReader.Read())
            {
                Course c = new Course();
                c.Id = Convert.ToInt32(dataReader["id"]);
                c.Title = dataReader["title"].ToString();
                c.Url = dataReader["url"].ToString();
                c.Rating = Math.Round(Convert.ToDouble(dataReader["rating"]), 2);
                c.NumOfReviews = Convert.ToInt32(dataReader["num_reviews"]);
                c.InstructorId = Convert.ToInt32(dataReader["instructors_id"]);
                c.ImageRef = dataReader["image"].ToString();
                c.Duration = Convert.ToDouble(dataReader["duration"]);
                c.LastUpdate = ((DateTime)dataReader["last_update_date"]).ToString("dd/MM/yyyy"); 
                courses.Add(c);
            }

            return courses;
        }
        catch (Exception ex)
        {
            // write to log
            throw new Exception("Couldn't retrieve any courses", ex);
        }
        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }
    }

    private SqlCommand CreateCommandWithStoredProcedure_EditCourse(String spName, SqlConnection con, Course updatedCourse)
    {
        SqlCommand cmd = new SqlCommand(); // create the command object

        cmd.Connection = con;              // assign the connection to the command object

        cmd.CommandText = spName;          // can be Select, Insert, Update, Delete 

        cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

        cmd.CommandType = System.Data.CommandType.StoredProcedure; // the type of the command, can also be text

        // Add parameters with values from the updatedCourse object
        cmd.Parameters.AddWithValue("@id", updatedCourse.Id);
        cmd.Parameters.AddWithValue("@title", updatedCourse.Title ?? (object)DBNull.Value);
        cmd.Parameters.AddWithValue("@url", updatedCourse.Url ?? (object)DBNull.Value);
        cmd.Parameters.AddWithValue("@duration", updatedCourse.Duration);
        cmd.Parameters.AddWithValue("@image", updatedCourse.ImageRef ?? (object)DBNull.Value);

        return cmd;
    }

    public int EditCourse(Course editedCourse)
    {
        SqlConnection con = null;
        SqlCommand cmd;

        try
        {
            con = connect("myProjDB"); // create the connection

            cmd = CreateCommandWithStoredProcedure_EditCourse("SP_EditCourse", con, editedCourse); // create the command

            int numEffected = cmd.ExecuteNonQuery(); // execute the command
            return numEffected;
        }

        catch (Exception ex)
        {
            throw new Exception("ERROR: Course not edited", ex);
        }
        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }
    }

    private SqlCommand CreateCommandWithStoredProcedure_CreateCourse(String spName, SqlConnection con, string title, string url, double duration, int instructor_id, string image)
    {
        SqlCommand cmd = new SqlCommand(); // create the command object

        cmd.Connection = con;              // assign the connection to the command object

        cmd.CommandText = spName;          // can be Select, Insert, Update, Delete 

        cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

        cmd.CommandType = System.Data.CommandType.StoredProcedure; // the type of the command, can also be text

        // Add parameters with values
        cmd.Parameters.AddWithValue("@title", title ?? (object)DBNull.Value);
        cmd.Parameters.AddWithValue("@url", url ?? (object)DBNull.Value);
        cmd.Parameters.AddWithValue("@duration", duration);
        cmd.Parameters.AddWithValue("@instructor_id", instructor_id);
        cmd.Parameters.AddWithValue("@image", image ?? (object)DBNull.Value);

        return cmd;
    }

    public int CreateCourse(Course newCourse)
    {
        SqlConnection con = null;
        SqlCommand cmd;

        try
        {
            con = connect("myProjDB"); // create the connection

            cmd = CreateCommandWithStoredProcedure_CreateCourse("SP_CreateCourse", con, newCourse.Title, newCourse.Url, newCourse.Duration, newCourse.InstructorId, newCourse.ImageRef); // create the command

            int numEffected = cmd.ExecuteNonQuery(); // execute the command
            return numEffected;
        }

        catch (Exception ex)
        {
            throw new Exception("Couldn't create course", ex);
        }
        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }
    }

    private SqlCommand CreateCommandWithStoredProcedure_SignUp(String spName, SqlConnection con, string name, string email, string password)
    {
        SqlCommand cmd = new SqlCommand(); // create the command object

        cmd.Connection = con;              // assign the connection to the command object

        cmd.CommandText = spName;          // can be Select, Insert, Update, Delete 

        cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

        cmd.CommandType = System.Data.CommandType.StoredProcedure; // the type of the command, can also be text

        // Add parameters with values
        cmd.Parameters.AddWithValue("@name", name);
        cmd.Parameters.AddWithValue("@email", email);
        cmd.Parameters.AddWithValue("@password", password);

        return cmd;
    }

    public int SignUp(string name, string email, string password)
    {
        SqlConnection con = null;
        SqlCommand cmd;

        try
        {
            con = connect("myProjDB"); // create the connection

            cmd = CreateCommandWithStoredProcedure_SignUp("SP_SignUp", con, name, email, password); // create the command

            int numEffected = cmd.ExecuteNonQuery(); // execute the command
            return numEffected;
        }

        catch (Exception ex)
        {
            throw new Exception("Couldn't sign up", ex);
        }
        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }
    }

    private SqlCommand CreateCommandWithStoredProcedure_Login(String spName, SqlConnection con, string email, string password)
    {
        SqlCommand cmd = new SqlCommand(); // create the command object

        cmd.Connection = con;              // assign the connection to the command object

        cmd.CommandText = spName;          // can be Select, Insert, Update, Delete 

        cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

        cmd.CommandType = System.Data.CommandType.StoredProcedure; // the type of the command, can also be text

        // Add parameters with values
        cmd.Parameters.AddWithValue("@email", email);
        cmd.Parameters.AddWithValue("@password", password);

        return cmd;
    }

    public User Login(string email, string password)
    {
        SqlConnection con = null;
        SqlCommand cmd;

        try
        {
            con = connect("myProjDB"); // create the connection
            cmd = CreateCommandWithStoredProcedure_Login("SP_Login", con, email, password); // create the command

            User user = new User();

            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

            while (dataReader.Read())
            {
                user.Id = Convert.ToInt32(dataReader["id"]);
                user.Name = dataReader["name"].ToString();
                user.Email = dataReader["email"].ToString();
                user.Password = dataReader["password"].ToString();
                int adminStatus = Convert.ToInt32(dataReader["isAdmin"]);
                if (adminStatus == 1)
                {
                    user.IsAdmin = true;
                }
                else
                {
                    user.IsAdmin = false;
                }
                int activeStatus = Convert.ToInt32(dataReader["isActive"]);
                if (activeStatus == 1)
                {
                    user.IsActive = true;
                }
                else
                {
                    user.IsActive = false;
                }
            }

            return user;
        }
        catch (Exception ex)
        {
            // write to log
            throw new Exception("Couldn't retrieve any user", ex);
        }
        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }
    }

    private SqlCommand CreateCommandWithStoredProcedure_GetCourse(String spName, SqlConnection con, int id)
    {
        SqlCommand cmd = new SqlCommand(); // create the command object

        cmd.Connection = con;              // assign the connection to the command object

        cmd.CommandText = spName;          // can be Select, Insert, Update, Delete 

        cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

        cmd.CommandType = System.Data.CommandType.StoredProcedure; // the type of the command, can also be text

        // Add parameters with values
        cmd.Parameters.AddWithValue("@id", id);

        return cmd;
    }

    public Course GetCourse(int id)
    {
        SqlConnection con = null;
        SqlCommand cmd;

        try
        {
            con = connect("myProjDB"); // create the connection
            cmd = CreateCommandWithStoredProcedure_GetCourse("SP_GetCourse", con, id); // create the command

            Course c = new Course();

            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

            while (dataReader.Read())
            {
                c.Id = Convert.ToInt32(dataReader["id"]);
                c.Title = dataReader["title"].ToString();
                c.Url = dataReader["url"].ToString();
                c.Rating = Math.Round(Convert.ToDouble(dataReader["rating"]), 2);
                c.NumOfReviews = Convert.ToInt32(dataReader["num_reviews"]);
                c.InstructorId = Convert.ToInt32(dataReader["instructors_id"]);
                c.ImageRef = dataReader["image"].ToString();
                c.Duration = Convert.ToDouble(dataReader["duration"]);
                c.LastUpdate = ((DateTime)dataReader["last_update_date"]).ToString("dd/MM/yyyy");
            }

            return c;
        }
        catch (Exception ex)
        {
            // write to log
            throw new Exception("Couldn't retrieve any course", ex);
        }
        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }
    }

    private SqlCommand CreateCommandWithStoredProcedure_ToggleCourseActivity(String spName, SqlConnection con, int id, int value)
    {
        SqlCommand cmd = new SqlCommand(); // create the command object

        cmd.Connection = con;              // assign the connection to the command object

        cmd.CommandText = spName;          // can be Select, Insert, Update, Delete 

        cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

        cmd.CommandType = System.Data.CommandType.StoredProcedure; // the type of the command, can also be text

        // Add parameters with values
        cmd.Parameters.AddWithValue("@id", id);
        cmd.Parameters.AddWithValue("@value", value);

        return cmd;
    }

    public int ToggleCourseActivity(int id, int value)
    {
        SqlConnection con = null;
        SqlCommand cmd;

        try
        {
            con = connect("myProjDB"); // create the connection

            cmd = CreateCommandWithStoredProcedure_ToggleCourseActivity("SP_SetCourseStatus", con, id, value); // create the command

            int numEffected = cmd.ExecuteNonQuery(); // execute the command
            return numEffected;
        }

        catch (Exception ex)
        {
            throw new Exception("Error: couldn't set course status", ex);
        }
        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }
    }
}