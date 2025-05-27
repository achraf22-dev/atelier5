document.addEventListener('DOMContentLoaded', init);
const form = document.getElementById('stock-form');
const cancelBtn = document.getElementById('cancel-btn');
const tbody = document.getElementById('stocks-tbody');
let chart;

// 1) Global deleteStock function (POST, not DELETE)
async function deleteStock(id) {
  if (!id) return alert('ID manquant');
  if (!confirm("Confirmer la suppression ?")) return;

  const res = await fetch('../backend/delete.php', {
    method: 'POST',                    // ← use POST
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  });
  const data = await res.json();
  if (!data.success) {
    return alert('Erreur de suppression : ' + data.error);
  }
  // No need to manually removeRow—Pusher will fire stock-deleted
}

async function init() {
  // Initialize Pusher
  Pusher.logToConsole = false;
  const pusher = new Pusher('5afeb390ed7c75a87c3d', { cluster: 'eu' });
  const channel = pusher.subscribe('stocks-channel');

  channel.bind('stock-created',  d => addOrUpdateRow(d));
  channel.bind('stock-updated',  d => addOrUpdateRow(d));
  channel.bind('stock-deleted',  d => removeRow(d.id));

  // Load initial data
  const stocks = await fetchStocks();
  drawChart(stocks);
  renderTable(stocks);

  form.addEventListener('submit', onSubmit);
  cancelBtn.addEventListener('click', resetForm);
}

async function fetchStocks() {
  const res = await fetch('../backend/read.php');
  return await res.json();
}

async function onSubmit(e) {
  e.preventDefault();
  const id           = document.getElementById('stock-id').value;
  const product_name = document.getElementById('product-name').value;
  const quantity     = parseInt(document.getElementById('quantity').value, 10);
  const endpoint     = id ? '../backend/update.php' : '../backend/create.php';

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, product_name, quantity })
  });
  const data = await res.json();
  if (data.success) resetForm();
}

function drawChart(stocks) {
  const seriesData = stocks.map(s => ({ name: s.product_name, y: s.quantity, id: s.id }));
  chart = Highcharts.chart('chart-container', {
    chart: { type: 'column' },
    title: { text: 'Quantité par Produit' },
    xAxis: { type: 'category' },
    yAxis: { title: { text: 'Quantité' } },
    accessibility: { enabled: false },  // disable warning
    series: [{ name: 'Stock', colorByPoint: true, data: seriesData }]
  });
}

function renderTable(stocks) {
  tbody.innerHTML = '';
  stocks.forEach(s => addOrUpdateRow(s));
}

function addOrUpdateRow(stock) {
  // update chart
  const pt = chart.series[0].data.find(p => p.options.id === stock.id);
  if (pt) pt.update(stock.quantity);
  else chart.series[0].addPoint({ name: stock.product_name, y: stock.quantity, id: stock.id });

  // update table row
  let row = document.querySelector(`tr[data-id='${stock.id}']`);
  if (!row) {
    row = document.createElement('tr');
    row.dataset.id = stock.id;
    row.innerHTML = `
      <td>${stock.id}</td>
      <td>${stock.product_name}</td>
      <td>${stock.quantity}</td>
      <td>
        <button class="edit">Éditer</button>
        <button class="delete">Supprimer</button>
      </td>`;
    tbody.appendChild(row);
    row.querySelector('.edit').onclick   = () => populateForm(stock);
    row.querySelector('.delete').onclick = () => deleteStock(stock.id);
  } else {
    // just update cells if row already existed
    row.cells[1].textContent = stock.product_name;
    row.cells[2].textContent = stock.quantity;
  }
}

function removeRow(id) {
  // chart
  const pt = chart.series[0].data.find(p => p.options.id === id);
  if (pt) pt.remove();
  // table
  const tr = document.querySelector(`tr[data-id='${id}']`);
  if (tr) tr.remove();
}

function populateForm(stock) {
  document.getElementById('stock-id').value      = stock.id;
  document.getElementById('product-name').value  = stock.product_name;
  document.getElementById('quantity').value      = stock.quantity;
  cancelBtn.classList.remove('hidden');
}

function resetForm() {
  form.reset();
  document.getElementById('stock-id').value = '';
  cancelBtn.classList.add('hidden');
}
