const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieSession = require("cookie-session");
const keys = require("./config/keys");
const AuthRoute = require('./routes/auth');
const CampusCollegeRoute = require("./routes/campusCollege")
const CollegeRoute = require("./routes/college")
const CollegeCoursesRoute = require("./routes/collegeCourses")
const CourseRoute = require("./routes/course")
const MainCampusRoute = require("./routes/mainCampus")
const SatelliteCampusRoute = require("./routes/satelliteCampus")
const StudentRoute = require("./routes/student")
const UserRoute = require("./routes/user")
const Document = require("./routes/document")
const UserDocument = require("./routes/userDocument")
const app = express();

// Connect to Mongo
mongoose
  .connect(keys.mongoURI, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  }) // Adding new mongo url parser
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use('/public', express.static('public'));
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey],
  })
);

// REST API
app.use("/", AuthRoute);
app.use("/api/campusCollege", CampusCollegeRoute);
app.use("/api/college", CollegeRoute);
app.use("/api/collegeCourses", CollegeCoursesRoute);
app.use("/api/course", CourseRoute);
app.use("/api/mainCampus", MainCampusRoute);
app.use("/api/satelliteCampus", SatelliteCampusRoute);
app.use("/api/student", StudentRoute);
app.use("/api/user", UserRoute);
app.use("/api/document", Document);
app.use("/api/userDocument", UserDocument);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`) 
  console.log(`REST API: /api/**`)
});