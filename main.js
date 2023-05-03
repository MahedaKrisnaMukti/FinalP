async function process_argv() {
  let { argv } = process;
  argv = argv.slice(2);
  const result = await studentActivitiesRegistration(argv);

  return result;
}

async function getStudentActivities() {
  // * Hit API GET activities
  const url = "http://localhost:3001/activities";
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = response.json();
  return result;
}

async function studentActivitiesRegistration(data) {
  const isArray = Array.isArray(data);

  // * Check is array
  if (isArray) {
    if (data.length > 0) {
      const method = data[0];

      // * If method is CREATE
      if (method == "CREATE") {
        const name = data[1];
        const day = data[2];
        return await addStudent(name, day);
      }

      // * If method is DELETE
      else if (method == "DELETE") {
        const id = data[1];
        return await deleteStudent(id);
      }
    }
  }
}

async function addStudent(name, day) {
  // * Get activity by day
  const activityList = await getStudentActivities();
  let activity = [];

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
  const url = "http://localhost:3001/students";
  const data = {
    name: name,
    activities: activity,
  };

  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = response.json();
  return result;
}

async function deleteStudent(id) {
  // * Hit API DELETE students
  const url = "http://localhost:3001/students/" + id;
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = response.json();
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
