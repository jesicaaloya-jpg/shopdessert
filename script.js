let cart = JSON.parse(localStorage.getItem("cart")) || [];
let orders = JSON.parse(localStorage.getItem("orders")) || [];
let reviews = JSON.parse(localStorage.getItem("reviews")) || [];
let currentRole = localStorage.getItem("role") || "user";

document.getElementById("roleSelect").value = currentRole;

function setRole(role){
  if(role === "admin"){
    let pass = prompt("Password admin:");
    if(pass !== "admin123"){
      alert("Salah!");
      return;
    }
  }
  localStorage.setItem("role", role);
  location.reload();
}

function renderCart(){
  let list = document.getElementById("cart-list");
  list.innerHTML = "";
  let total = 0;

  cart.forEach((item,i)=>{
    total += item.harga;
    list.innerHTML += item.nama + " Rp " + item.harga +
      ` <button onclick="hapus(${i})">❌</button><br>`;
  });

  document.getElementById("cart-count").innerText = cart.length;
  document.getElementById("total").innerText = total;

  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(nama,harga){
  cart.push({nama,harga});
  renderCart();
}

function hapus(i){
  cart.splice(i,1);
  renderCart();
}

function openCheckout(){
  if(cart.length==0) return alert("Kosong!");
  document.getElementById("checkoutModal").style.display="block";
}

function closeModal(){
  document.getElementById("checkoutModal").style.display="none";
}

function prosesCheckout(){
  let nama = document.getElementById("nama").value;
  let alamat = document.getElementById("alamat").value;
  let metode = document.getElementById("metode").value;

  if(!nama || !alamat || !metode){
    alert("Lengkapi data!");
    return;
  }

  let total = cart.reduce((a,b)=>a+b.harga,0);
  let id = "ORD" + Date.now();

  let order = {id,nama,alamat,metode,total,items:[...cart],status:"Pending"};
  orders.push(order);

  localStorage.setItem("orders", JSON.stringify(orders));

  tampilStruk(order);

  cart = [];
  localStorage.removeItem("cart");
  renderCart();
  renderHistory();
  closeModal();
}

function tampilStruk(o){
  let html = `<h3>Struk Pesanan</h3>
  ID: ${o.id}<br>
  Nama: ${o.nama}<br><br>`;

  o.items.forEach(i=>{
    html += i.nama + " Rp " + i.harga + "<br>";
  });

  html += `<br><b>Total: Rp ${o.total}</b><br>Status: ${o.status}`;

  document.getElementById("struk").innerHTML = html;
  document.getElementById("struk").style.display="block";
}

function renderHistory(){
  let h = document.getElementById("history");
  h.innerHTML = "";

  orders.forEach((o,index)=>{
    let tombol = "";

    if(currentRole === "admin"){
      if(o.status === "Pending"){
        tombol = `<button onclick="updateStatus(${index}, 'Diproses')" class="w3-button w3-blue w3-small">Proses</button>`;
      }
      else if(o.status === "Diproses"){
        tombol = `<button onclick="updateStatus(${index}, 'Dikirim')" class="w3-button w3-orange w3-small">Kirim</button>`;
      }
      else if(o.status === "Dikirim"){
        tombol = `<button onclick="updateStatus(${index}, 'Selesai')" class="w3-button w3-green w3-small">Selesai</button>`;
      }
      else {
        tombol = `<span class="w3-text-green">✔ Selesai</span>`;
      }
    } else {
      tombol = `<span>${o.status}</span>`;
    }

    h.innerHTML += `
    <div class="w3-card w3-padding w3-margin">
      <b>${o.id}</b><br>
      ${o.nama}<br>
      Rp ${o.total}<br>
      <b>${o.status}</b><br>
      ${tombol}
    </div>`;
  });
}

function updateStatus(index, statusBaru){
  orders[index].status = statusBaru;
  localStorage.setItem("orders", JSON.stringify(orders));
  renderHistory();
}

function tambahReview(){
  let nama = document.getElementById("namaReview").value;
  let isi = document.getElementById("isiReview").value;

  if(!nama || !isi) return alert("Isi dulu!");

  reviews.push({nama,isi});
  localStorage.setItem("reviews", JSON.stringify(reviews));

  renderReview();
}

function renderReview(){
  let el = document.getElementById("listReview");
  el.innerHTML = "";

  reviews.forEach(r=>{
    el.innerHTML += `
    <div class="w3-card w3-padding w3-margin">
      <b>${r.nama}</b><br>${r.isi}
    </div>`;
  });
}

let slideIndex = 0;

function carousel() {
  let x = document.getElementsByClassName("mySlides");

  for (let i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }

  slideIndex++;

  if (slideIndex > x.length) {
    slideIndex = 1;
  }

  x[slideIndex-1].style.display = "block";

  setTimeout(carousel, 3000);
}

renderCart();
renderHistory();
renderReview();
carousel();
