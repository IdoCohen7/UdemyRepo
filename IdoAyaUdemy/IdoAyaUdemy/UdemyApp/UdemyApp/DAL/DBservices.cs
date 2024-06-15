using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.SqlClient;
using System.Data;
using System.Text;
using UdemyApp;

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

    //--------------------------------------------------------------------------------------------------
    // This method reads courses from the courses table 
    //--------------------------------------------------------------------------------------------------
    public List<Course> ReadCourses()
    {
        SqlConnection con = null;
        SqlCommand cmd;

        try
        {
            con = connect("myProjDB"); // create the connection
            cmd = CreateCommandWithStoredProcedureReadCourses("SP_ReadCoursesFromTable", con); // create the command

            List<Course> courses = new List<Course>();

            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

            while (dataReader.Read())
            {
                Course c = new Course();
                c.Id = Convert.ToInt32(dataReader["id"]);
                c.Title = dataReader["title"].ToString();
                c.Url = dataReader["url"].ToString();
                c.Rating = Convert.ToDouble(dataReader["rating"]);
                c.NumOfReviews = Convert.ToInt32(dataReader["num_reviews"]);
                c.InstructorId = Convert.ToInt32(dataReader["instructors_id"]);
                c.ImageRef = dataReader["image"].ToString();
                c.Duration = Convert.ToDouble(dataReader["duration"]);
                c.LastUpdate = dataReader["last_update_date"].ToString();
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
                c.Rating = Convert.ToDouble(dataReader["rating"]);
                c.NumOfReviews = Convert.ToInt32(dataReader["num_reviews"]);
                c.InstructorId = Convert.ToInt32(dataReader["instructors_id"]);
                c.ImageRef = dataReader["image"].ToString();
                c.Duration = Convert.ToDouble(dataReader["duration"]);
                c.LastUpdate = dataReader["last_update_date"].ToString();
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
                c.Rating = Convert.ToDouble(dataReader["rating"]);
                c.NumOfReviews = Convert.ToInt32(dataReader["num_reviews"]);
                c.InstructorId = Convert.ToInt32(dataReader["instructors_id"]);
                c.ImageRef = dataReader["image"].ToString();
                c.Duration = Convert.ToDouble(dataReader["duration"]);
                c.LastUpdate = dataReader["last_update_date"].ToString();
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
                c.Rating = Convert.ToDouble(dataReader["rating"]);
                c.NumOfReviews = Convert.ToInt32(dataReader["num_reviews"]);
                c.InstructorId = Convert.ToInt32(dataReader["instructors_id"]);
                c.ImageRef = dataReader["image"].ToString();
                c.Duration = Convert.ToDouble(dataReader["duration"]);
                c.LastUpdate = dataReader["last_update_date"].ToString();
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





    //--------------------------------------------------------------------
    // Build the Insert command String
    //--------------------------------------------------------------------
    /*
    private String BuildInsertCommand(Flight flight)
    {
        String command;

        StringBuilder sb = new StringBuilder();
        // Use a string builder to create the dynamic string
        sb.AppendFormat("Values('{0}', '{1}', '{2}')", flight.From, flight.To, flight.Price);
        String prefix = "INSERT INTO Flights_2024 ([from], [to], price) ";
        command = prefix + sb.ToString();

        return command;
    }


    //---------------------------------------------------------------------------------
    // Create the SqlCommand
    //---------------------------------------------------------------------------------
    private SqlCommand CreateCommand(String CommandSTR, SqlConnection con)
    {

        SqlCommand cmd = new SqlCommand(); // create the command object

        cmd.Connection = con;              // assign the connection to the command object

        cmd.CommandText = CommandSTR;      // can be Select, Insert, Update, Delete 

        cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

        cmd.CommandType = System.Data.CommandType.Text; // the type of the command, can also be stored procedure

        return cmd;
    }

    //--------------------------------------------------------------------
    // TODO Build the FLight Delete command String method
    // BuildFlightDeleteCommand(int id)
    //--------------------------------------------------------------------

    //--------------------------------------------------------------------
    // TODO Build the FLight Delete  method
    // DeleteFlight(int id)
    //--------------------------------------------------------------------

    public int Update(Student student)
    {

        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("myProjDB"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        cmd = CreateCommandWithStoredProcedure("spUpdateStudent1", con, student);             // create the command

        try
        {
            int numEffected = cmd.ExecuteNonQuery(); // execute the command
            return numEffected;
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

    public int Insert(Student student)
    {

        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("myProjDB"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        cmd = CreateCommandWithStoredProcedure("spUpdateStudent1", con, student);             // create the command

        try
        {
            int numEffected = cmd.ExecuteNonQuery(); // execute the command
            return numEffected;
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

    public int Delete(int id)
    {
        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("myProjDB"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        cmd = CreateCommandWithStoredProcedure("SP_DeleteFlightByID", con, id);             // create the command

        try
        {
            int numEffected = cmd.ExecuteNonQuery(); // execute the command
            return numEffected;
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

    private SqlCommand CreateCommandWithStoredProcedure(String spName, SqlConnection con, Flight flight)
    {

        SqlCommand cmd = new SqlCommand(); // create the command object

        cmd.Connection = con;              // assign the connection to the command object

        cmd.CommandText = spName;      // can be Select, Insert, Update, Delete 

        cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

        cmd.CommandType = System.Data.CommandType.StoredProcedure; // the type of the command, can also be text

        cmd.Parameters.AddWithValue("@from", flight.From);

        cmd.Parameters.AddWithValue("@to", flight.To);

        cmd.Parameters.AddWithValue("@price", flight.Price);


        return cmd;
    }

    private SqlCommand CreateCommandWithStoredProcedure(String spName, SqlConnection con, int id)
    {

        SqlCommand cmd = new SqlCommand(); // create the command object

        cmd.Connection = con;              // assign the connection to the command object

        cmd.CommandText = spName;      // can be Select, Insert, Update, Delete 

        cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

        cmd.CommandType = System.Data.CommandType.StoredProcedure; // the type of the command, can also be text

        cmd.Parameters.AddWithValue("@id", id);


        return cmd;
    }

    private SqlCommand CreateCommandWithStoredProcedure(String spName, SqlConnection con, Student student)
    {

        SqlCommand cmd = new SqlCommand(); // create the command object

        cmd.Connection = con;              // assign the connection to the command object

        cmd.CommandText = spName;      // can be Select, Insert, Update, Delete 

        cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

        cmd.CommandType = System.Data.CommandType.StoredProcedure; // the type of the command, can also be text

        cmd.Parameters.AddWithValue("@id", student.Id);

        cmd.Parameters.AddWithValue("@name", student.Name);

        cmd.Parameters.AddWithValue("@age", student.Age);


        return cmd;
    }
    */
}


