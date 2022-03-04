const menuItems = [
  {
    id: 1,
    name: "French Fries with Ketchup",
    price: 223,
    image: "plate__french-fries.png",
    alt: "French Fries",
    count: 0,
  },
  {
    id: 2,
    name: "Salmon and Vegetables",
    price: 512,
    image: "plate__salmon-vegetables.png",
    alt: "Salmon and Vegetables",
    count: 0,
  },
  {
    id: 3,
    name: "Spaghetti Meat Sauce",
    price: 782,
    image: "plate__spaghetti-meat-sauce.png",
    alt: "Spaghetti with Meat Sauce",
    count: 0,
  },
  {
    id: 4,
    name: "Bacon, Eggs, and Toast",
    price: 599,
    image: "plate__bacon-eggs.png",
    alt: "Bacon, Eggs, and Toast",
    count: 0,
  },
  {
    id: 5,
    name: "Chicken Salad with Parmesan",
    price: 698,
    image: "plate__chicken-salad.png",
    alt: "Chicken Salad with Parmesan",
    count: 0,
  },
  {
    id: 6,
    name: "Fish Sticks and Fries",
    price: 634,
    image: "plate__fish-sticks-fries.png",
    alt: "Fish Sticks and Fries",
    count: 0,
  },
];

const menuPanel = document.querySelector("[data-menu]");
const cartSummary = document.querySelector("[data-cart]");
const cart = [];
const totalCost = document.querySelector("[data-aftertax]");

const getTotal = (price) => {
  const totals = [];
  //   cartSummary.appendChild.innerHTML = "Your cart is empty.";
  totalCost.innerHTML = priceFormatter(000);
  cart.forEach((cartItem, { price, count }) => {
    const singleTotal = cartItem.price * cartItem.count;
    totals.push(singleTotal);

    const sum = totals.reduce((a, b) => a + b);

    totalCost.innerHTML = priceFormatter(sum);

    // console.log(cart);
    // if (!Array.isArray(cart) || !cart.length) {
    //   totalCost.innerHTML = priceFormatter(000);
    //   cartSummary.innerHTML = "Your cart is empty.";
    // }
  });
};

const priceFormatter = (price) => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(price / 100);

  return formatter;
};

const populateMenu = () => {
  const menuList = [];
  menuItems.forEach(({ id, name, price, image, alt, count }) => {
    const item = `<li data-id=${id}>
        <div class="plate">
          <img src="images/${image}" alt="${alt}" class="plate" />
        </div>
        <div class="content">
          <p class="menu-item">${name}</p>
          <p class="price">${priceFormatter(price)}</p>
          <button class="add">Add to Cart</button>
        </div>
        </li>`;
    /* This is creating a fragment of HTML that is then appended to the menu list. */
    const itemFrag = document.createRange().createContextualFragment(item);
    menuList.push(itemFrag);
  });
  menuList.forEach((menu) => menuPanel.appendChild(menu));
};

populateMenu();

const InCartButton = (element) => {
  const img = document.createElement("img");
  img.src = "images/check.svg";
  img.alt = "Check";
  element.classList.remove("add");
  element.classList.add("in-cart");
  element.textContent = "In Cart";
  element.prepend(img);
};

const AddCartButton = (element, index) => {
  element.classList.remove("in-cart");
  element.classList.add("add");
  element.textContent = "Add to Cart";
};

const stringToNumber = (element) => Number(element.parentElement.parentElement.dataset.id);

const updateCart = () => {
  cartSummary.innerHTML = null;
  const cartItems = [];
  cart.forEach(({ id, image, alt, count, name, price }) => {
    const showCart = `
        <li data-id=${id}>
          <div class="plate">
            <img src="images/${image}" alt=${alt} />
            <div class="quantity">${count}</div>
          </div>
          <div class="content">
            <p class="menu-item">${name}</p>
            <p class="price">${priceFormatter(price)}</p>
          </div>
          <div class="quantity__wrapper">
            <button data-type="decrease" class="decrease">
              <img src="images/chevron.svg" />
            </button>
            <div class="quantity">${count}</div>
            <button data-type="increase" class="increase">
              <img src="images/chevron.svg" />
            </button>
          </div>
          <div data-foodprice=${price * count} class="subtotal">${priceFormatter(price * count)}</div>
        </li>
      `;
    const showCartFrag = document.createRange().createContextualFragment(showCart);
    cartItems.push(showCartFrag);
  });
  cartItems.forEach((cartItem) => cartSummary.appendChild(cartItem));
  //   console.log(cartItems);
  getTotal();
  updateQuantity();
};

const addToCartButtons = menuPanel.querySelectorAll("button");
addToCartButtons.forEach((button) =>
  button.addEventListener("click", () => {
    const getFoodId = stringToNumber(button);
    menuItems.forEach((item) => {
      if (item.id === getFoodId) {
        // console.log(item.id, getFoodId);
        cart.push(item);
        item.count = item.count + 1;
        InCartButton(button);
        button.disabled = true;
      }
    });
    updateCart();
  })
);

function updateQuantity() {
  const updateQtyBtns = cartSummary.querySelectorAll("[data-type]");
  updateQtyBtns.forEach((btn) =>
    btn.addEventListener("click", () => {
      /* This is destructuring the data-type attribute from the button element. */
      const { type } = btn.dataset;

      /* This is converting the button's data-type attribute to a number. */
      const cartItemId = stringToNumber(btn);

      if (type === "increase") {
        cart.forEach((food) => {
          if (food.id === cartItemId) {
            food.count = food.count + 1;
          }
        });
      } else if (type === "decrease") {
        /* This is a forEach loop that is iterating through the cart array. */
        cart.forEach((food, index) => {
          if (food.id === cartItemId) {
            food.count = food.count - 1;
            if (food.count === 0) {
              addToCartButtons.forEach((button, index) => {
                const cartButton = stringToNumber(button);
                if (cartButton === cartItemId) {
                  AddCartButton(button, index);
                  button.disabled = false;
                }
              });
              cart.splice(index, 1);
            }
          }
        });
      }
      //   getTotal();
      updateCart();
    })
  );
}
