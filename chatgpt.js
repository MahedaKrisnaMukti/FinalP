const axios = require("axios");

async function getStudentActivities() {
  try {
    const response = await axios.get("http://localhost:3001/activities");
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function addStudent(name, day) {
    try {
      // Ambil data UKM dari API
      const activities = await getStudentActivities();
  
      // Cari UKM yang hari kegiatannya sesuai dengan yang diminta
      const activity = activities.find((activity) => activity.days.includes(day));
  
      if (!activity) {
        console.log(`Tidak ada UKM yang kegiatannya pada hari ${day}`);
        return;
      }
  
      // Daftarkan student ke UKM
      const student = { name, activityId: activity.id };
      const response = await axios.post("http://localhost:3001/students", student);
      console.log(response.data);
  
      // Tampilkan data UKM yang diikuti oleh student tersebut
      console.log(`Daftar UKM ${name}:`);
      console.log(activity);
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteStudent(id) {
    try {
      // Hapus data student dari API
      const response = await axios.delete(`http://localhost:3001/students/${id}`);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function studentActivitiesRegistration(data) {
    const method = data[0];
    if (method === "CREATE") {
      const name = data[1];
      const day = data[2];
      await addStudent(name, day);
    } else if (method === "DELETE") {
      const id = data[1];
      await deleteStudent(id);
    } else {
      console.log(`Method ${method} tidak dikenali`);
    }
  }

  function process_argv() {
    const data = process.argv.slice(2);
    studentActivitiesRegistration(data);
  }