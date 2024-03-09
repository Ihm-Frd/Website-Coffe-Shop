document.addEventListener("alpine:init", () => {
  Alpine.data("products", () => ({
    items: [
      { id: 1, name: "Biji Kopi Lokal", img: "Local coffe beans.jpg", price: 39000 },
      { id: 2, name: "Biji Kopi Arabica", img: "Arabica.jpg", price: 45000 },
      { id: 3, name: "Biji Kopi Robusta", img: "Robusta.jpg", price: 62000 },
      { id: 4, name: "Arabica Aceh Gayo", img: "Arabica gayo.jpg", price: 77000 },
      { id: 5, name: "Kopi Lampung", img: "Kopi lampung.jpg", price: 68000 },
    ],
  }));

  Alpine.store("cart", {
    items: [],
    total: 0,
    quantity: 0,

    add(newItem) {
      //cek barang (menghindari kesamaan) di keranjang
      const cartItem = this.items.find((item) => item.id === newItem.id);

      //jika keranjang kosong
      if (!cartItem) {
        this.items.push({ ...newItem, quantity: 1, total: newItem.price });
        this.quantity++;
        this.total += newItem.price;
      } else {
        //jika barang sudah ada (menghindari kesamaan) di keranjang
        this.items = this.items.map((item) => {
          //jika barang berbeda
          if (item.id !== newItem.id) {
            return item;
          } else {
            //jika barang sudah ada (buatkan list baru)
            item.quantity++;
            item.total = item.price * item.quantity;
            this.quantity++;
            this.total += item.price;
            return item;
          }
        });
      }
    },

    //Hapus atau kurangi barang dr keranjang
    remove(id) {
      const cartItem = this.items.find((item) => item.id === id);
      //jika barang lebih dr satu
      if (cartItem.quantity > 1) {
        this.items = this.items.map((item) => {
          //jika bukan barang yg di klik
          if (item.id !== id) {
            return item;
          } else {
            item.quantity--;
            item.total = item.price * item.quantity;
            this.quantity--;
            this.total -= item.price;
            return item;
          }
        });
      } else if (cartItem.quantity === 1) {
        //Jika barang sisa satu
        this.items = this.items.filter((item) => item.id !== id);
        this.quantity--;
        this.total -= cartItem.price;
      }
    },
  });
});

//............................................................................................

// format mata uang
const rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

//............................................................................................

// validasi Form checkhout
const checkoutButton = document.querySelector(".checkout-button");
checkoutButton.disabled = true;

const form = document.querySelector("#checkoutForm");

form.addEventListener("keyup", function () {
  for (let i = 0; i < form.elements.length; i++) {
    if (form.elements[i].value.length !== 0) {
      checkoutButton.classList.remove("disabled");
      checkoutButton.classList.add("disabled");
    } else {
      return false;
    }
  }
  checkoutButton.disabled = false;
  checkoutButton.classList.remove("disabled");
});

//............................................................................................

// Fungsi Tombol Checkout Submit
checkoutButton.addEventListener("click", async function (e) {
  e.preventDefault();
  const formData = new FormData(form);
  const data = new URLSearchParams(formData);
  const objData = Object.fromEntries(data);
  // const message = formatMessage(objData);
  // window.open("http://wa.me/6283811570179?text=" + encodeURIComponent(message));

  // Minta transaction Token menggunakan ajax/fetch
  try {
    const response = await fetch("payment/placeOrder.php", {
      method: "POST",
      body: data,
    });
    const token = await response.text();
    window.snap.pay(token);
    // console.log(token);
  } catch (err) {
    console.log(err.message);
  }
});

// checkoutButton.addEventListener("click", async function (e) {
//   e.preventDefault();
//   const formData = new FormData(form);
//   const data = new URLSearchParams(formData);
//   const objData = Object.fromEntries(formData);

//   // Minta transaction Token menggunakan ajax/fetch
//   try {
//     const response = await fetch("payment/placeOrder.php", {
//       method: "POST",
//       body: data,

//     });

//     if (!response.ok) {
//       throw new Error(`Server error: ${response.status} ${response.statusText}`);
//     }

//     const token = await response.text();
//     window.snap.pay(token);
//   } catch (error) {
//     console.error(error.message);
//   }
// });

//............................................................................................
// Format Notifikasi Order di WA

// const formatMessage = (obj) => {
//   const itemsList = JSON.parse(obj.items)
//     .map((item) => `*${item.name}* - ${item.quantity} x ${rupiah(item.total)}`)
//     .join("\n");

//   return `🌟 *Terima Kasih ${obj.name}!* 🌟

// 🛍️ *Data Customer* 🛍️
// ---------------------------------------
// *Nama*: ${obj.name}
// *Email*: ${obj.email}
// *No. Hp*: ${obj.phone}

// 📦 *Data Pesanan* 📦
// ---------------------------------------
// ${itemsList}
// ---------------------------------------
// *TOTAL*: ${rupiah(obj.total)}
// ---------------------------------------
// 🙏🏽 *Terima Kasih !* 🙏🏽`;
// };
