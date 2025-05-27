// File: Exercice3_RoomsCRUD/public/js/rooms.js

document.addEventListener('DOMContentLoaded', fetchRooms);
const form = document.getElementById('room-form');
const cancelBtn = document.getElementById('cancel-btn');

form.onsubmit = async (e) => {
  e.preventDefault();
  const idInput = document.getElementById('room-id');
  const id = idInput.value;
  const name = document.getElementById('room-name').value;
  const capacity = parseInt(document.getElementById('room-capacity').value, 10);

  const endpoint = id ? '../backend/update.php' : '../backend/create.php';
  const payload = id ? { id, name, capacity } : { name, capacity };

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    if (data.success) {
      // Clear hidden ID and reset form
      idInput.value = '';
      form.reset();
      cancelBtn.style.display = 'none';
      fetchRooms();
    } else {
      alert(data.error || 'Erreur inconnue');
    }
  } catch (err) {
    console.error(err);
    alert('Une erreur est survenue');
  }
};

cancelBtn.onclick = () => {
  document.getElementById('room-id').value = '';
  form.reset();
  cancelBtn.style.display = 'none';
};

async function fetchRooms() {
  try {
    const res = await fetch('../backend/read.php');
    const rooms = await res.json();

    const tbody = document.getElementById('room-list');
    tbody.innerHTML = '';
    rooms.forEach(room => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${room.id}</td>
        <td>${room.name}</td>
        <td>${room.capacity}</td>
        <td>
          <button class="edit" onclick='editRoom(${JSON.stringify(room)})'>Éditer</button>
          <button class="delete" onclick='deleteRoom(${room.id})'>Supprimer</button>
        </td>`;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
  }
}

function editRoom(room) {
  document.getElementById('room-id').value = room.id;
  document.getElementById('room-name').value = room.name;
  document.getElementById('room-capacity').value = room.capacity;
  cancelBtn.style.display = 'inline';
}

async function deleteRoom(id) {
  if (!confirm("Supprimer cette salle ?")) return;
  try {
    const res = await fetch('../backend/delete.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    const data = await res.json();
    if (data.success) fetchRooms();
    else alert(data.error || 'Erreur lors de la suppression');
  } catch (err) {
    console.error(err);
  }
}
