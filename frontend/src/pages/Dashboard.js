import { useEffect, useState } from "react";
import API from "../services/api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from "recharts";

function Dashboard() {

  const [name, setName] = useState("");
  const [type, setType] = useState("");

  const [devices, setDevices] = useState([]);
  const [user, setUser] = useState({
  name: "",
  email: "",
});
  const [search, setSearch] = useState("");
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({
    
    totalDevices: 0,
    onDevices: 0,
    offDevices: 0,
  });

const token = localStorage.getItem("token");
if (!token) {
  window.location = "/";
}
const data = [
  { name: "ON", value: stats.onDevices },
  { name: "OFF", value: stats.offDevices },
];

const COLORS = ["#00C49F", "#FF8042"];
  const loadDevices = async () => {
    try {
      const res = await API.get("/device", {
        headers: {
          Authorization: token,
        },
      });

      setDevices(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  const loadStats = async () => {
    try {
      const res = await API.get("/device/stats", {
        headers: {
          Authorization: token,
        },
      });

      setStats(res.data);

    } catch (err) {
      console.log(err);
    }
  };
  
  const loadUser = async () => {
  try {
    const res = await API.get("/auth/me", {
      headers: {
        Authorization: token,
      },
    });

    setUser(res.data);

  } catch (err) {
    console.log(err);
  }
};
const loadHistory = async () => {
  try {

    const res = await API.get("/device/history", {
      headers: {
        Authorization: token,
      },
    });

    setHistory(res.data);

  } catch (err) {
    console.log(err);
  }
};

useEffect(() => {
  loadDevices();
  loadStats();
  loadUser();
  loadHistory();
}, []);

  const addDevice = async () => {
    try {
      await API.post(
        "/device/add",
        {
          name,
          type,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setName("");
      setType("");

      loadDevices();
      loadHistory();
      loadStats();

    } catch (err) {
      console.log(err);
    }
  };

  const toggleDevice = async (id) => {
    try {
      await API.put(
        `/device/toggle/${id}`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );

      loadDevices();
      loadHistory();
      loadStats();

    } catch (err) {
      console.log(err);
    }
  };

  const deleteDevice = async (id) => {
    try {
      await API.delete(`/device/delete/${id}`, {
        headers: {
          Authorization: token,
        },
      });

      loadDevices();
      loadHistory();
      loadStats();

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container mt-4">

     <div className="d-flex justify-content-between align-items-center mb-4">

  <h1 className="text-primary">
    Smart Home Security Dashboard
  </h1>

  <button
    className="btn btn-danger"
    onClick={() => {
      localStorage.removeItem("token");
      window.location = "/";
    }}
  >
    Logout
  </button>
</div>
<div className="card p-3 mb-4">

  <h3>User Profile</h3>

  <p>
    <strong>Name:</strong> {user.name}
  </p>

  <p>
    <strong>Email:</strong> {user.email}
  </p>

</div>

    <div className="row mb-4">

  <div className="col-md-4">
    <div className="card bg-primary text-white text-center p-3">
      <h5>Total Devices</h5>
      <h2>{stats.totalDevices}</h2>
    </div>
  </div>

  <div className="col-md-4">
    <div className="card bg-success text-white text-center p-3">
      <h5>ON Devices</h5>
      <h2>{stats.onDevices}</h2>
    </div>
  </div>

  <div className="col-md-4">
    <div className="card bg-danger text-white text-center p-3">
      <h5>OFF Devices</h5>
      <h2>{stats.offDevices}</h2>
    </div>
  </div>

</div>

      <hr />
<h2>Device Status Chart</h2>

<PieChart width={400} height={300}>
  <Pie
    data={data}
    cx="50%"
    cy="50%"
    outerRadius={100}
    dataKey="value"
    label
  >
    {data.map((entry, index) => (
      <Cell
        key={index}
        fill={COLORS[index % COLORS.length]}
      />
    ))}
  </Pie>

  <Tooltip />
  <Legend />
</PieChart>

<hr />
      <input
        type="text"
        placeholder="Device Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br /><br />

   <div className="card p-4 mb-4">

<h3>Add New Device</h3>

<input
className="form-control mb-3"
type="text"
placeholder="Device Name"
value={name}
onChange={(e)=>setName(e.target.value)}
/>

<input
className="form-control mb-3"
type="text"
placeholder="Device Type"
value={type}
onChange={(e)=>setType(e.target.value)}
/>

<button
className="btn btn-primary"
onClick={addDevice}
>
Add Device
</button>

</div>

      <hr />

      <h2>My Devices</h2>
<input
  className="form-control mb-3"
  type="text"
  placeholder="Search Device..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>
      {devices
  .filter((device) =>
    device.name.toLowerCase().includes(search.toLowerCase())
  )
  .map((device) => (
       <div key={device._id} className="card p-3 mb-3">
          <h3>💡 {device.name}</h3>
          <p>
  <strong>Type:</strong> {device.type}
</p>
          <p>
  Status :
  <span
    className={
      device.status === "ON"
        ? "text-success fw-bold"
        : "text-danger fw-bold"
    }
  >
    {" "}{device.status}
  </span>
</p>

          <button
className="btn btn-success me-2"
onClick={() => toggleDevice(device._id)}
>
            {device.status === "OFF" ? "Turn ON" : "Turn OFF"}
          </button>

         <button
className="btn btn-danger"
onClick={() => deleteDevice(device._id)}
>
            Delete
          </button>

          <hr />
        </div>
      ))}
<hr />


<h2>Device History</h2>

<div className="card p-3">
  {history.length === 0 ? (
    <p>No History Found</p>
  ) : (
    history.map((item) => (
      <div key={item._id} className="border-bottom mb-2 pb-2">
        <strong>{item.deviceName}</strong>
        <br />
        {item.action}
        <br />
        <small>{new Date(item.time).toLocaleString()}</small>
      </div>
    ))
  )}
</div>

    </div>
  );
}

export default Dashboard;