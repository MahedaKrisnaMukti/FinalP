const { log } = require("console");

async function process_argv() {
  let { argv } = process;
  argv = argv.slice(2);
  const result = await studentActivitiesRegistration(argv);

  return result;
}

async function getStudentActivities() {
  // * Akses db local dan konversi ke json
  const fs = require("fs");

  let rawdata = fs.readFileSync("server/student-activities-db.json");
  let db = JSON.parse(rawdata);

  // * Ambil data activities
  let result = db.activities;

  return result;
}

async function studentActivitiesRegistration(data) {
  let isArray = Array.isArray(data);

  // * Cek jika array
  if (isArray) {
    if (data.length > 0) {
      // * Jika request nya create
      if (data[0] == "CREATE") {
        let name = data[1];
        let day = data[2];

        return await addStudent(name, day);
      }

      // * Jika request nya delete
      else if (data[0] == "DELETE") {
        let id = data[1];

        return await deleteStudent(id);
      }
    }
  }
}

async function addStudent(name, day) {
  // * Akses db local dan konversi ke json
  const fs = require("fs");

  let rawdata = fs.readFileSync("server/student-activities-db.json");
  let db = JSON.parse(rawdata);
  let student = db.students;

  // * Buat id selanjutnya untuk student
  let id = student[student.length - 1].id + 1;

  // * Cari activity nya berdasarkan hari
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

  // * Simpan result dalam variable
  let result = {
    id: id,
    name: name,
    activities: activity,
  };

  // * Update database dengan data terbaru
  // student.push(result);
  // db.students = student;
  // let data = JSON.stringify(db);
  // fs.writeFileSync("server/student-activities-db.json", data);

  return result;
}

async function deleteStudent(id) {
  // * Akses db local dan konversi ke json
  const fs = require("fs");

  let rawdata = fs.readFileSync("server/student-activities-db.json");
  let db = JSON.parse(rawdata);
  let student = db.students;

  // * Filter id student
  student = student.filter(function (row) {
    return row.id != id;
  });

  // * Update database dengan data terbaru
  // db.students = student;
  // let data = JSON.stringify(db);
  // fs.writeFileSync("server/student-activities-db.json", data);

  let result = {
    message: "Successfully deleted student data with id " + id,
  };

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
