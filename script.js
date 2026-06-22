const STORAGE_KEY = "foodwise-pro-meals";

const mealBank = [
  {
    name: "Chicken Rice Power Bowl",
    type: "Lunch",
    goal: "High Protein",
    diet: "Halal-Friendly",
    ingredients: ["chicken", "rice", "egg", "cucumber", "soy sauce"],
    cost: 12,
    calories: 620,
    protein: 42,
    prep: 25,
    day: "Monday",
    description: "A filling high-protein meal with simple ingredients and balanced energy."
  },
  {
    name: "Overnight Oats with Banana",
    type: "Breakfast",
    goal: "Healthy",
    diet: "Vegetarian",
    ingredients: ["oats", "milk", "banana", "honey", "chia seeds"],
    cost: 7,
    calories: 420,
    protein: 16,
    prep: 10,
    day: "Tuesday",
    description: "A quick healthy breakfast that can be prepared the night before."
  },
  {
    name: "Egg Fried Rice",
    type: "Dinner",
    goal: "Budget",
    diet: "Halal-Friendly",
    ingredients: ["rice", "egg", "carrot", "onion", "soy sauce"],
    cost: 6,
    calories: 530,
    protein: 18,
    prep: 20,
    day: "Wednesday",
    description: "A budget-friendly meal using leftover rice and basic kitchen ingredients."
  },
  {
    name: "Tuna Sandwich Wrap",
    type: "Lunch",
    goal: "Quick Meal",
    diet: "Halal-Friendly",
    ingredients: ["tuna", "wrap", "lettuce", "mayonnaise", "tomato"],
    cost: 9,
    calories: 460,
    protein: 30,
    prep: 12,
    day: "Thursday",
    description: "A fast meal that is easy to pack for work, class, or travel."
  },
  {
    name: "Vegetable Pasta",
    type: "Dinner",
    goal: "Vegetarian",
    diet: "Vegetarian",
    ingredients: ["pasta", "tomato sauce", "mushroom", "spinach", "cheese"],
    cost: 11,
    calories: 580,
    protein: 20,
    prep: 25,
    day: "Friday",
    description: "A simple vegetarian meal with vegetables and comfort-food energy."
  },
  {
    name: "Milo Banana Toast",
    type: "Snack",
    goal: "Comfort Food",
    diet: "Vegetarian",
    ingredients: ["bread", "banana", "milo powder", "peanut butter"],
    cost: 5,
    calories: 390,
    protein: 12,
    prep: 8,
    day: "Saturday",
    description: "A sweet comfort snack for quick energy and mood boost."
  },
  {
    name: "Greek Yogurt Fruit Cup",
    type: "Snack",
    goal: "Low Calorie",
    diet: "Vegetarian",
    ingredients: ["yogurt", "apple", "banana", "honey", "granola"],
    cost: 8,
    calories: 280,
    protein: 14,
    prep: 8,
    day: "Sunday",
    description: "A light and refreshing snack with natural sweetness."
  },
  {
    name: "Tofu Stir Fry",
    type: "Dinner",
    goal: "Vegetarian",
    diet: "Vegetarian",
    ingredients: ["tofu", "broccoli", "carrot", "garlic", "rice"],
    cost: 10,
    calories: 500,
    protein: 28,
    prep: 25,
    day: "Monday",
    description: "A vegetarian dinner option with protein and vegetables."
  },
  {
    name: "Peanut Butter Energy Smoothie",
    type: "Breakfast",
    goal: "Energy Boost",
    diet: "Vegetarian",
    ingredients: ["banana", "milk", "peanut butter", "oats", "honey"],
    cost: 8,
    calories: 520,
    protein: 18,
    prep: 7,
    day: "Tuesday",
    description: "A quick energy-focused drink for busy mornings."
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
  const diet = document.getElementById("dietType").value;

  let filtered = mealBank.filter(meal => {
    const goalMatch = meal.goal === goal;
    const timeMatch = meal.type === time;
    const dietMatch = diet === "Any" || meal.diet === diet;

    return goalMatch && timeMatch && dietMatch;
  });

  if (filtered.length === 0) {
    filtered = mealBank.filter(meal => {
      const goalMatch = meal.goal === goal;
      const timeMatch = meal.type === time;
      const dietMatch = diet === "Any" || meal.diet === diet;

      return (goalMatch || timeMatch) && dietMatch;
    });
  }

  if (filtered.length === 0) {
    filtered = mealBank;
  }

  activeMeal = filtered[Math.floor(Math.random() * filtered.length)];

  const box = document.getElementById("mealSuggestion");

  box.innerHTML = `
    <span class="pill">${activeMeal.goal}</span>
    <span class="pill alt">${activeMeal.type}</span>
    <span class="pill blue">${activeMeal.diet}</span>

    <h3>${activeMeal.name}</h3>
    <p>${activeMeal.description}</p>

    <div class="meal-meta">
      <span>RM ${activeMeal.cost}</span>
      <span>${activeMeal.calories} kcal</span>
      <span>${activeMeal.protein}g protein</span>
      <span>${activeMeal.prep} min prep</span>
    </div>

    <p><strong>Suggested Day:</strong> ${activeMeal.day}</p>
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
  const calories = Number(document.getElementById("customCalories").value) || 0;
  const protein = Number(document.getElementById("customProtein").value) || 0;
  const prep = Number(document.getElementById("customPrep").value) || 0;
  const day = document.getElementById("customDay").value;

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
    diet: "Custom",
    ingredients,
    cost,
    calories,
    protein,
    prep,
    day,
    description: "Custom meal added by user.",
    createdAt: new Date().toISOString()
  });

  saveMeals(meals);

  document.getElementById("customMealName").value = "";
  document.getElementById("customIngredients").value = "";
  document.getElementById("customCost").value = 10;
  document.getElementById("customCalories").value = 450;
  document.getElementById("customProtein").value = 25;
  document.getElementById("customPrep").value = 20;

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

function getTypeStats(meals) {
  const stats = {};

  meals.forEach(meal => {
    stats[meal.type] = (stats[meal.type] || 0) + 1;
  });

  return Object.entries(stats).sort((a, b) => b[1] - a[1]);
}

function calculatePlanScore(meals) {
  if (meals.length === 0) return 0;

  let score = 0;

  if (meals.length >= 3) score += 25;
  if (meals.length >= 7) score += 20;

  const healthyMeals = meals.filter(meal =>
    ["Healthy", "High Protein", "Vegetarian", "Low Calorie"].includes(meal.goal)
  ).length;

  if (healthyMeals >= meals.length / 2) score += 25;

  const typeCount = new Set(meals.map(meal => meal.type)).size;
  if (typeCount >= 3) score += 15;

  const groceries = getGroceries(meals);
  if (groceries.length <= 15) score += 15;

  return Math.min(score, 100);
}

function getWasteRisk(meals) {
  const groceries = getGroceries(meals);

  if (groceries.length === 0) return "Low";
  if (groceries.length > 20) return "High";
  if (groceries.length > 12) return "Medium";
  return "Low";
}

function renderDashboard(meals) {
  const groceries = getGroceries(meals);
  const healthyMeals = meals.filter(meal =>
    ["Healthy", "High Protein", "Vegetarian", "Low Calorie"].includes(meal.goal)
  ).length;

  const cost = meals.reduce((sum, meal) => sum + Number(meal.cost), 0);
  const calories = meals.reduce((sum, meal) => sum + Number(meal.calories), 0);
  const protein = meals.reduce((sum, meal) => sum + Number(meal.protein), 0);
  const score = calculatePlanScore(meals);
  const wasteRisk = getWasteRisk(meals);

  document.getElementById("plannedMeals").textContent = `${meals.length} Meals`;
  document.getElementById("totalMeals").textContent = meals.length;
  document.getElementById("totalGroceries").textContent = groceries.length;
  document.getElementById("healthyMeals").textContent = healthyMeals;
  document.getElementById("estimatedCost").textContent = `RM ${cost}`;
  document.getElementById("totalCalories").textContent = calories;
  document.getElementById("totalProtein").textContent = `${protein}g`;
  document.getElementById("planScore").textContent = `${score}%`;

  const riskBox = document.getElementById("wasteRisk");
  riskBox.textContent = wasteRisk;
  riskBox.className = wasteRisk === "High" ? "warning" : "good";

  document.getElementById("mealFocus").textContent = getFoodTip(meals);
  document.getElementById("foodTip").textContent = getFoodTip(meals);
}

function getFoodTip(meals) {
  if (meals.length === 0) {
    return "Start by planning 3 simple meals first. A small weekly plan is easier to maintain.";
  }

  const healthyMeals = meals.filter(meal =>
    ["Healthy", "High Protein", "Vegetarian", "Low Calorie"].includes(meal.goal)
  ).length;

  const budgetMeals = meals.filter(meal => meal.goal === "Budget").length;
  const groceries = getGroceries(meals);
  const protein = meals.reduce((sum, meal) => sum + Number(meal.protein), 0);

  if (meals.length < 3) {
    return "Good start. Add at least 3 meals to create a basic weekly plan.";
  }

  if (healthyMeals < meals.length / 2) {
    return "Try adding more healthy, low-calorie, vegetarian, or high-protein meals to balance your weekly plan.";
  }

  if (budgetMeals === 0) {
    return "Consider adding one budget meal to reduce weekly food cost.";
  }

  if (protein / meals.length < 18) {
    return "Your average protein is quite low. Add eggs, chicken, tofu, tuna, yogurt, or beans.";
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

function renderBreakdown(containerId, stats) {
  const box = document.getElementById(containerId);

  if (stats.length === 0) {
    box.innerHTML = `<p class="muted">No data yet.</p>`;
    return;
  }

  const max = Math.max(...stats.map(item => item[1]));

  box.innerHTML = stats.map(([category, count]) => {
    const percentage = Math.round((count / max) * 100);

    return `
      <div class="breakdown-item">
        <div class="breakdown-top">
          <span>${category}</span>
          <span>${count}</span>
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
  const filterDay = document.getElementById("filterDay").value;

  let filtered = meals;

  if (filterType !== "All") {
    filtered = filtered.filter(meal => meal.type === filterType);
  }

  if (filterDay !== "All Days") {
    filtered = filtered.filter(meal => meal.day === filterDay);
  }

  if (search) {
    filtered = filtered.filter(meal => {
      const combined = `${meal.name} ${meal.goal} ${meal.type} ${meal.day} ${meal.ingredients.join(" ")}`.toLowerCase();
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
        <span class="pill blue">${meal.day}</span>
      </div>

      <h3>${meal.name}</h3>
      <p>${meal.description}</p>

      <div class="meal-meta">
        <span>RM ${meal.cost}</span>
        <span>${meal.calories} kcal</span>
        <span>${meal.protein}g protein</span>
        <span>${meal.prep} min</span>
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

function loadDemoData() {
  const demoMeals = [
    mealBank[1],
    mealBank[0],
    mealBank[2],
    mealBank[7]
  ].map((meal, index) => ({
    ...meal,
    id: Date.now() + index,
    createdAt: new Date().toISOString()
  }));

  saveMeals(demoMeals);
  renderApp();
}

function renderApp() {
  const meals = getMeals();

  renderDashboard(meals);
  renderGroceryList(meals);
  renderBreakdown("categoryBreakdown", getCategoryStats(meals));
  renderBreakdown("typeBreakdown", getTypeStats(meals));
  renderMealHistory(meals);
}

renderApp();
