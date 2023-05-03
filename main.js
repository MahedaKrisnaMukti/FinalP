async function process_argv() {
  let { argv } = process;
  argv = argv.slice(2);
  const result = await studentActivitiesRegistration(argv);

  return result;
}

async function getStudentActivities() {
  // * Hit API GET activities
  let url = "http://localhost:3001/activities";

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  let result = response.json();

  return result;
}

async function studentActivitiesRegistration(data) {
  let isArray = Array.isArray(data);

  // * Check is array
  if (isArray) {
    if (data.length > 0) {
      // * If request is CREATE
      if (data[0] == "CREATE") {
        let name = data[1];
        let day = data[2];

        return await addStudent(name, day);
      }

      // * If request is DELETE
      else if (data[0] == "DELETE") {
        let id = data[1];

        return await deleteStudent(id);
      }
    }
  }
}

async function addStudent(name, day) {
  // * Get activity by day
  let activity = [];
  let activityList = await getStudentActivities();

  activityList.forEach((row) => {
    let days = row.days;
    let status = false;

    days.forEach((row2) => {
      if (day == row2) {
        status = true;
      }
    });

    if (status == true) {
      let data = {
        name: row.name,
        desc: row.desc,
      };

      activity.push(data);
    }
  });

  // * Hit API POST students
  let data = {
    name: name,
    activities: activity,
  };

  let url = "http://localhost:3001/students";

  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  let result = response.json();

  return result;
}

async function deleteStudent(id) {
  // * Hit API DELETE students
  let url = "http://localhost:3001/students/" + id;

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  let result = response.json();

  return result;
}

process_argv()
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = {
  studentActivitiesRegistration,
  getStudentActivities,
  addStudent,
  deleteStudent,
};
