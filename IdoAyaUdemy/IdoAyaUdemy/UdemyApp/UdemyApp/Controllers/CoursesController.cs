using Microsoft.AspNetCore.Mvc;
using System;
using UdemyApp;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace UdemyApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CoursesController : ControllerBase
    {
        // GET: api/<CoursesController>
        [HttpGet]
        public IEnumerable<Course> Get()
        {
            return Course.Read();
        }

        // GET api/<CoursesController>/5
        [HttpGet("{id}")]
        public Course Get(int id)
        {
            for (int i=0; i<Course.Read().Count; i++)
            {
                if (Course.Read()[i].Id == id)
                {
                    return Course.Read()[i];
                }
            }
            return null;
        }

        // POST api/<CoursesController>
        [HttpPost]
        public bool Post([FromBody] Course course)
        {
            return course.Insert();
        }

        // POST api/<CoursesController>/Create
        [HttpPost("Create")]
        public bool Create([FromBody] Course course)
        {
            
            Course newCourse = new Course(
                id: course.Id, 
                title: course.Title,
                url: course.Url,
                rating: 0,
                numOfReviews: 0,
                instructorId: course.InstructorId,
                imageRef: course.ImageRef,
                duration: course.Duration,
                lastUpdate: DateTime.Now.ToString("dd/MM/yyyy")
            );

            
            return newCourse.Insert();
        }

        // PUT api/<CoursesController>/5
        [HttpPut("{id}")]
        public bool Put(int id, [FromBody] Course updatedValue)
            {
            Course editedCourse = Get(id);
            Console.WriteLine(editedCourse);
            if (editedCourse != null)
            {
                editedCourse.Title = updatedValue.Title;
                editedCourse.Url = updatedValue.Url;
                editedCourse.Duration = updatedValue.Duration;
                if (updatedValue.ImageRef!= string.Empty)
                {
                    editedCourse.ImageRef = updatedValue.ImageRef;
                }
                editedCourse.LastUpdate = DateTime.Now.ToString("dd/MM/yyyy");
                return true;

            }
            return false;
        }

        // DELETE api/<CoursesController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
           bool success = false;
           Course toDelete = null;
           foreach (Course course in Course.Read())
            {
                if (course.Id == id) { 
                    toDelete = course;
                }
            }
           if (toDelete != null)
            {
                toDelete.Delete();
                success = true;
            }
           if (!success)
            {
                
            }
        }

        [HttpGet("getByDurationRange")]

        public IEnumerable<Course> GetByDurationRange(double start, double end)
        {
            return Course.GetByDurationRange(start, end);
        }

        [HttpGet("getByRatingRange/start/{start}/end/{end}")]

        public IEnumerable<Course> GetByRatingRange(double start, double end)
        {
            return Course.GetByRatingRange(start, end);
        }




    }
}
