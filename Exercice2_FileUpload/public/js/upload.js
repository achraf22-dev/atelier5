// File: Exercice2_FileUpload/public/js/upload.js
const uploadForm = document.getElementById('upload-form');
const fileInput = document.getElementById('file-input');
const statusText = document.getElementById('upload-status');
const refreshBtn = document.getElementById('refresh-btn');
const fileList = document.getElementById('file-list');

// Fonction pour uploader un fichier
function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);

  return fetch('../upload.php', {
    method: 'POST',
    body: formData
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        statusText.textContent = 'Upload réussi : ' + data.filename;
        return data.filename;
      } else {
        throw new Error(data.error || 'Erreur inconnue');
      }
    });
}

// Fonction pour récupérer la liste des fichiers
function fetchFileList() {
  return fetch('../list_files.php')
    .then(response => response.json())
    .then(files => files);
}

// Afficher la liste dans l'UI
function renderFileList(files) {
  fileList.innerHTML = '';
  files.forEach(name => {
    const li = document.createElement('li');
    li.textContent = name;
    fileList.appendChild(li);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Envoi du formulaire
  uploadForm.addEventListener('submit', e => {
    e.preventDefault();
    const file = fileInput.files[0];
    if (!file) return;

    statusText.textContent = 'Téléchargement en cours...';
    uploadFile(file)
      .then(() => fetchFileList())
      .then(renderFileList)
      .catch(err => {
        statusText.textContent = 'Erreur : ' + err.message;
      });
  });

  // Rafraîchir la liste
  refreshBtn.addEventListener('click', () => {
    fetchFileList()
      .then(renderFileList)
      .catch(err => console.error(err));
  });

  // Chargement initial
  fetchFileList()
    .then(renderFileList)
    .catch(err => console.error(err));
});