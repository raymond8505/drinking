export function formatPrice(cents) {
  return (cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

export function randoIndex(arr) {
  return Math.floor(Math.random() * arr.length);
}

export function rando(arr) {
  return arr[randoIndex(arr)];
}

export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

export function changePageTitle(title) {
  document.querySelector("head title").innerText = title;
}

export function leastCommonMultiple(nums) {
  const lcm = (a, b) => (a * b) / gcd(a, b);
  const gcd = (a, b) => (a ? gcd(b % a, a) : b);

  return nums.reduce(lcm);
}

/**
 * Takes an array and clones each item the given number of times
 * @param {Any[]} arr an array to fatten with clones
 * @param {Int} times the total number of times each item should appear in the result array
 * @returns {Any[]} a new array with all the clones
 */
export function cloneItems(arr, times) {
  const toRet = [];

  for (let index = 0; index < arr.length; index++) {
    for (let num = 0; num < times; num++) {
      toRet.push(arr[index]);
    }
  }

  return toRet;
}

/**
 *
 * @param {*} pool
 * @param {*} numItems
 * @param {Function} chosenFilter a callback used to filter the pool after choosing an item
 * @param {*} chosen
 * @returns {Any[]} an array of chosen items
 */
export function getRandomItems(
  pool,
  numItems,
  chosenFilter = (curItem, curChosen, curPool, i) => {
    return !curChosen.includes(curItem);
  },
  chosen = []
) {
  const chosenItem = rando(pool);

  chosen.push(chosenItem);
  //console.log(pool.length);

  if (chosen.length == numItems) {
    return chosen;
  } else {
    const newPool = pool.filter((item, i) =>
      chosenFilter(item, chosen, pool, i)
    );

    return getRandomItems(newPool, numItems, chosenFilter, chosen);
  }
}

export const setTitle = (title) => {
  document.querySelector("head title").innerText = title;
};
