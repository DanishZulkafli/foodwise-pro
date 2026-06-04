const STORAGE_KEY = "foodwise-meals";

const mealBank = [
  {
    name: "Chicken Rice Power Bowl",
    type: "Lunch",
    goal: "High Protein",
    ingredients: ["chicken", "rice", "egg", "cucumber", "soy sauce"],
    cost: 12,
    description: "A filling high-protein meal with simple ingredients and balanced energy."
  },
  {
    name: "Overnight Oats with Banana",
    type: "Breakfast",
    goal: "Healthy",
    ingredients: ["oats", "milk", "banana", "honey", "chia seeds"],
    cost: 7,
    description: "A quick healthy breakfast that can be prepared the night before."
  },
  {
    name: "Egg Fried Rice",
    type: "Dinner",
    goal: "Budget",
    ingredients: ["rice", "egg", "carrot", "onion", "soy sauce"],
    cost: 6,
    description: "A budget-friendly meal using leftover rice and basic kitchen ingredients."
  },
  {
    name: "Tuna Sandwich Wrap",
    type: "Lunch",
    goal: "Quick Meal",
    ingredients: ["tuna", "wrap", "lettuce", "mayonnaise", "tomato"],
    cost: 9,
    description: "A fast meal that is easy to pack for work, class, or travel."
  },
  {
    name: "Vegetable Pasta",
    type: "Dinner",
    goal: "Vegetarian",
    ingredients: ["pasta", "tomato sauce", "mushroom", "spinach", "cheese"],
    cost: 11,
    description: "A simple vegetarian meal with vegetables and comfort-food energy."
  },
  {
    name: "Milo Banana Toast",
    type: "Snack",
    goal: "Comfort Food",
    ingredients: ["bread", "banana", "milo powder", "peanut butter"],
    cost: 5,
    description: "A sweet comfort snack for quick energy and mood boost."
  },
  {
    name: "Greek Yogurt Fruit Cup",
    type: "Snack",
    goal: "Healthy",
    ingredients: ["yogurt", "apple", "banana", "honey", "granola"],
    cost: 8,
    description: "A light and refreshing snack with natural sweetness."
  },
  {
    name: "Tofu Stir Fry",
    type: "Dinner",
    goal: "Vegetarian",
    ingredients: ["tofu", "broccoli", "carrot", "garlic", "rice"],
    cost: 10,
    description: "A vegetarian dinner option with protein and vegetables."
  }
];

let activeMeal = null;

function getMeals() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveMeals(meals) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(meals));
}

function generateMeal() {
  const goal = document.getElementById("mealGoal").value;
  const time = document.getElementById("mealTime").value;

  let filtered = mealBank.filter(meal => meal.goal === goal && meal.type === time);

  if (filtered.length === 0) {
    filtered = mealBank.filter(meal => meal.goal === goal || meal.type === time);
  }

  if (filtered.length === 0) {
    filtered = mealBank;
  }

  activeMeal = filtered[Math.floor(Math.random() * filtered.length)];

  const box = document.getElementById("mealSuggestion");

  box.innerHTML = `
    <span class="pill">${activeMeal.goal}</span>
    <span class="pill alt">${activeMeal.type}</span>

    <h3>${activeMeal.name}</h3>
    <p>${activeMeal.description}</p>

    <div class="meal-meta">
      <span>RM ${activeMeal.cost}</span>
      <span>${activeMeal.ingredients.length} ingredients</span>
    </div>

    <p><strong>Ingredients:</strong> ${activeMeal.ingredients.join(", ")}</p>

    <button onclick="addGeneratedMeal()">Add to Meal Plan</button>
  `;
}

function addGeneratedMeal() {
  if (!activeMeal) return;

  const meals = getMeals();

  meals.unshift({
    ...activeMeal,
    id: Date.now(),
    createdAt: new Date().toISOString()
  });

  saveMeals(meals);
  activeMeal = null;

  document.getElementById("mealSuggestion").innerHTML = `
    <h3>Meal added to plan</h3>
    <p>Great. Generate another meal idea or review your weekly meal plan below.</p>
  `;

  renderApp();
}

function addCustomMeal() {
  const name = document.getElementById("customMealName").value.trim();
  const type = document.getElementById("customMealType").value;
  const goal = document.getElementById("customMealGoal").value;
  const ingredientsText = document.getElementById("customIngredients").value.trim();
  const cost = Number(document.getElementById("customCost").value) || 0;

  if (!name || !ingredientsText) {
    alert("Please enter meal name and ingredients.");
    return;
  }

  const ingredients = ingredientsText
    .split(",")
    .map(item => item.trim())
    .filter(Boolean);

  const meals = getMeals();

  meals.unshift({
    id: Date.now(),
    name,
    type,
    goal,
    ingredients,
    cost,
    description: "Custom meal added by user.",
    createdAt: new Date().toISOString()
  });

  saveMeals(meals);

  document.getElementById("customMealName").value = "";
  document.getElementById("customIngredients").value = "";
  document.getElementById("customCost").value = 10;

  renderApp();
}

function deleteMeal(id) {
  const confirmed = confirm("Delete this meal from your plan?");
  if (!confirmed) return;

  const meals = getMeals().filter(meal => meal.id !== id);
  saveMeals(meals);
  renderApp();
}

function resetAll() {
  const confirmed = confirm("Reset all FoodWise data?");
  if (!confirmed) return;

  localStorage.removeItem(STORAGE_KEY);
  renderApp();
}

function getGroceries(meals) {
  const groceries = {};

  meals.forEach(meal => {
    meal.ingredients.forEach(item => {
      const key = item.toLowerCase();
      groceries[key] = (groceries[key] || 0) + 1;
    });
  });

  return Object.entries(groceries).sort((a, b) => b[1] - a[1]);
}

function getCategoryStats(meals) {
  const stats = {};

  meals.forEach(meal => {
    stats[meal.goal] = (stats[meal.goal] || 0) + 1;
  });

  return Object.entries(stats).sort((a, b) => b[1] - a[1]);
}

function renderDashboard(meals) {
  const groceries = getGroceries(meals);
  const healthyMeals = meals.filter(meal => meal.goal === "Healthy" || meal.goal === "High Protein" || meal.goal === "Vegetarian").length;
  const cost = meals.reduce((sum, meal) => sum + Number(meal.cost), 0);

  document.getElementById("plannedMeals").textContent = `${meals.length} Meals`;
  document.getElementById("totalMeals").textContent = meals.length;
  document.getElementById("totalGroceries").textContent = groceries.length;
  document.getElementById("healthyMeals").textContent = healthyMeals;
  document.getElementById("estimatedCost").textContent = `RM ${cost}`;

  document.getElementById("mealFocus").textContent = getFoodTip(meals);
  document.getElementById("foodTip").textContent = getFoodTip(meals);
}

function getFoodTip(meals) {
  if (meals.length === 0) {
    return "Start by planning 3 simple meals first. A small weekly plan is easier to maintain.";
  }

  const healthyMeals = meals.filter(meal => meal.goal === "Healthy" || meal.goal === "High Protein" || meal.goal === "Vegetarian").length;
  const budgetMeals = meals.filter(meal => meal.goal === "Budget").length;
  const groceries = getGroceries(meals);

  if (meals.length < 3) {
    return "Good start. Add at least 3 meals to create a basic weekly plan.";
  }

  if (healthyMeals < meals.length / 2) {
    return "Try adding more healthy or high-protein meals to balance your weekly plan.";
  }

  if (budgetMeals === 0) {
    return "Consider adding one budget meal to reduce weekly food cost.";
  }

  if (groceries.length > 15) {
    return "Your grocery list is getting long. Try reusing ingredients across multiple meals to reduce waste.";
  }

  return "Your meal plan looks balanced. Keep reusing ingredients and planning ahead.";
}

function renderGroceryList(meals) {
  const box = document.getElementById("groceryList");
  const groceries = getGroceries(meals);

  if (groceries.length === 0) {
    box.innerHTML = `<p class="muted">No grocery items yet.</p>`;
    return;
  }

  box.innerHTML = groceries.map(([item, count]) => `
    <div class="grocery-item">
      <strong>${item}</strong>
      <span>${count} meal${count > 1 ? "s" : ""}</span>
    </div>
  `).join("");
}

function renderCategoryBreakdown(meals) {
  const box = document.getElementById("categoryBreakdown");
  const stats = getCategoryStats(meals);

  if (stats.length === 0) {
    box.innerHTML = `<p class="muted">No meal data yet.</p>`;
    return;
  }

  const max = Math.max(...stats.map(item => item[1]));

  box.innerHTML = stats.map(([category, count]) => {
    const percentage = Math.round((count / max) * 100);

    return `
      <div class="breakdown-item">
        <div class="breakdown-top">
          <span>${category}</span>
          <span>${count} meals</span>
        </div>
        <div class="breakdown-bg">
          <div class="breakdown-fill" style="width: ${percentage}%"></div>
        </div>
      </div>
    `;
  }).join("");
}

function renderMealHistory(meals) {
  const box = document.getElementById("mealHistory");
  const search = document.getElementById("searchInput").value.toLowerCase();
  const filterType = document.getElementById("filterMealType").value;

  let filtered = meals;

  if (filterType !== "All") {
    filtered = filtered.filter(meal => meal.type === filterType);
  }

  if (search) {
    filtered = filtered.filter(meal => {
      const combined = `${meal.name} ${meal.goal} ${meal.type} ${meal.ingredients.join(" ")}`.toLowerCase();
      return combined.includes(search);
    });
  }

  if (filtered.length === 0) {
    box.innerHTML = `
      <div class="empty-box wide">
        <h3>No meals found</h3>
        <p>Add a meal or adjust your search/filter.</p>
      </div>
    `;
    return;
  }

  box.innerHTML = filtered.map(meal => `
    <article class="meal-card">
      <div>
        <span class="pill">${meal.goal}</span>
        <span class="pill alt">${meal.type}</span>
      </div>

      <h3>${meal.name}</h3>
      <p>${meal.description}</p>

      <div class="meal-meta">
        <span>RM ${meal.cost}</span>
        <span>${meal.ingredients.length} ingredients</span>
      </div>

      <p><strong>Ingredients:</strong> ${meal.ingredients.join(", ")}</p>

      <button class="danger" onclick="deleteMeal(${meal.id})">Delete</button>
    </article>
  `).join("");
}

function exportGroceryList() {
  const meals = getMeals();

  if (meals.length === 0) {
    alert("No grocery list to export.");
    return;
  }

  const groceries = getGroceries(meals);
  const headers = ["Ingredient", "Used In Meals"];

  const csv = [headers, ...groceries]
    .map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "foodwise-grocery-list.csv";
  link.click();

  URL.revokeObjectURL(url);
}

function renderApp() {
  const meals = getMeals();

  renderDashboard(meals);
  renderGroceryList(meals);
  renderCategoryBreakdown(meals);
  renderMealHistory(meals);
}

renderApp();
