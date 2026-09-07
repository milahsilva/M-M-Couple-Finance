/* =====================================================
   COUPLE FINANCE
   ===================================================== */

/* ================= SETTINGS ================= */

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const CURRENT_YEAR = 2026;

/* ================= DATABASE ================= */

let data = JSON.parse(localStorage.getItem("coupleFinanceData")) || {
  income: [
    {
      id: 1,
      name: "Part-time job",
      amount: 8000,
      person: "Mila",
      date: "2026-09-02",
    },

    {
      id: 2,
      name: "Other income",
      amount: 4000,
      person: "Mila",
      date: "2026-09-05",
    },

    {
      id: 3,
      name: "Part-time job",
      amount: 18000,
      person: "Mathias",
      date: "2026-09-01",
    },
  ],

  expenses: [
    {
      id: 1,
      name: "Food",
      amount: 3000,
      category: "Food",
      paidBy: "Mila",
      date: "2026-09-03",
    },

    {
      id: 2,
      name: "Shopping",
      amount: 2000,
      category: "Shopping",
      paidBy: "Mila",
      date: "2026-09-05",
    },

    {
      id: 3,
      name: "Travel",
      amount: 5500,
      category: "Travel",
      paidBy: "Mathias",
      date: "2026-09-06",
    },

    {
      id: 4,
      name: "Transport",
      amount: 1500,
      category: "Transport",
      paidBy: "Mathias",
      date: "2026-09-07",
    },

    {
      id: 5,
      name: "Entertainment",
      amount: 1000,
      category: "Entertainment",
      paidBy: "Mila",
      date: "2026-09-08",
    },
  ],

  savings: [
    {
      id: 1,
      name: "Monthly savings",
      amount: 4000,
      person: "Mila",
      date: "2026-09-04",
    },

    {
      id: 2,
      name: "Monthly savings",
      amount: 8000,
      person: "Mathias",
      date: "2026-09-04",
    },
  ],

  goals: [
    {
      id: 1,
      name: "Copenhagen Trip",
      icon: "✈️",
      target: 10000,
      saved: 6000,
    },

    {
      id: 2,
      name: "Future Apartment",
      icon: "🏠",
      target: 100000,
      saved: 6000,
    },
  ],
};

/* ================= STATE ================= */

let selectedMonth = localStorage.getItem("selectedMonth") || "2026-09";

let selectedYear = 2026;

/* ================= SAVE ================= */

function saveData() {
  localStorage.setItem("coupleFinanceData", JSON.stringify(data));
}

/* ================= FORMAT MONEY ================= */

function money(amount) {
  return new Intl.NumberFormat("nb-NO").format(Math.round(amount)) + " kr";
}

/* ================= DATE ================= */

function getMonth(date) {
  return date.substring(0, 7);
}

function formatDate(date) {
  const d = new Date(date + "T00:00:00");

  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* ================= MONTH SELECTORS ================= */

function setupMonthSelectors() {
  const selectors = [
    "dashboardMonth",
    "incomeMonth",
    "expenseMonth",
    "savingsMonth",
  ];

  selectors.forEach((id) => {
    const select = document.getElementById(id);

    if (!select) return;

    select.innerHTML = "";

    for (let year = 2026; year <= 2027; year++) {
      MONTHS.forEach((month, index) => {
        const value = year + "-" + String(index + 1).padStart(2, "0");

        const option = document.createElement("option");

        option.value = value;

        option.textContent = month + " " + year;

        select.appendChild(option);
      });
    }

    select.value = selectedMonth;
  });
}

/* ================= CHANGE MONTH ================= */

function changeMonth(month) {
  selectedMonth = month;

  localStorage.setItem("selectedMonth", selectedMonth);

  setupMonthSelectors();

  updateAll();
}

/* ================= SHOW PAGE ================= */

function showPage(pageId, clickedButton = null) {
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.remove("active-page");
  });

  const page = document.getElementById(pageId);

  if (page) {
    page.classList.add("active-page");
  }

  document.querySelectorAll(".nav-item").forEach((button) => {
    button.classList.remove("active");
  });

  if (clickedButton) {
    clickedButton.classList.add("active");
  } else {
    document.querySelectorAll(".nav-item").forEach((button) => {
      if (
        button.getAttribute("onclick") &&
        button.getAttribute("onclick").includes("'" + pageId + "'")
      ) {
        button.classList.add("active");
      }
    });
  }

  updateAll();
}

/* ================= FILTER MONTH ================= */

function getMonthlyIncome() {
  return data.income.filter((item) => getMonth(item.date) === selectedMonth);
}

function getMonthlyExpenses() {
  return data.expenses.filter((item) => getMonth(item.date) === selectedMonth);
}

function getMonthlySavings() {
  return data.savings.filter((item) => getMonth(item.date) === selectedMonth);
}

/* ================= TOTAL ================= */

function total(list) {
  return list.reduce((sum, item) => sum + Number(item.amount), 0);
}

/* ================= DASHBOARD ================= */

function updateDashboard() {
  const income = total(getMonthlyIncome());

  const expenses = total(getMonthlyExpenses());

  const savings = total(getMonthlySavings());

  document.getElementById("dashboardIncome").textContent = money(income);

  document.getElementById("dashboardExpenses").textContent = money(expenses);

  document.getElementById("dashboardSavings").textContent = money(savings);

  updateBalance();

  renderDashboardGoals();
}

/* ================= BALANCE ================= */

function updateBalance() {
  const income = getMonthlyIncome();

  const expenses = getMonthlyExpenses();

  const savings = getMonthlySavings();

  const milaIncome = total(income.filter((x) => x.person === "Mila"));

  const mathiasIncome = total(income.filter((x) => x.person === "Mathias"));

  const milaExpenses = total(expenses.filter((x) => x.paidBy === "Mila"));

  const mathiasExpenses = total(expenses.filter((x) => x.paidBy === "Mathias"));

  const milaSavings = total(savings.filter((x) => x.person === "Mila"));

  const mathiasSavings = total(savings.filter((x) => x.person === "Mathias"));

  const incomeTotal = milaIncome + mathiasIncome;

  const expenseTotal = milaExpenses + mathiasExpenses;

  const savingsTotal = milaSavings + mathiasSavings;

  const incomeMila = percentage(milaIncome, incomeTotal);

  const incomeMathias = percentage(mathiasIncome, incomeTotal);

  const expenseMila = percentage(milaExpenses, expenseTotal);

  const expenseMathias = percentage(mathiasExpenses, expenseTotal);

  const savingsMila = percentage(milaSavings, savingsTotal);

  const savingsMathias = percentage(mathiasSavings, savingsTotal);

  setPercentage("milaIncomePercent", "milaIncomeBar", incomeMila);

  setPercentage("mathiasIncomePercent", "mathiasIncomeBar", incomeMathias);

  setPercentage("milaExpensePercent", "milaExpenseBar", expenseMila);

  setPercentage("mathiasExpensePercent", "mathiasExpenseBar", expenseMathias);

  setPercentage("milaSavingsPercent", "milaSavingsBar", savingsMila);

  setPercentage("mathiasSavingsPercent", "mathiasSavingsBar", savingsMathias);

  const message = document.getElementById("balanceMessage");

  if (incomeTotal === 0 || expenseTotal === 0) {
    message.textContent = "Add more financial data to see your balance ❤️";

    return;
  }

  const incomeShare = milaIncome / incomeTotal;

  const expenseShare = milaExpenses / expenseTotal;

  const difference = Math.abs(incomeShare - expenseShare);

  if (difference > 0.15) {
    if (expenseShare > incomeShare) {
      message.textContent =
        "⚠️ Mila currently pays a larger share of expenses compared to her share of income.";
    } else {
      message.textContent =
        "⚠️ Mathias currently pays a larger share of expenses compared to his share of income.";
    }
  } else {
    message.textContent =
      "❤️ Your expense distribution is relatively proportional to your income.";
  }
}

/* ================= PERCENTAGE ================= */

function percentage(value, totalValue) {
  if (totalValue === 0) return 0;

  return Math.round((value / totalValue) * 100);
}

function setPercentage(textId, barId, value) {
  const text = document.getElementById(textId);

  const bar = document.getElementById(barId);

  if (text) {
    text.textContent = value + "%";
  }

  if (bar) {
    bar.style.width = value + "%";
  }
}

/* ================= INCOME PAGE ================= */

function updateIncomePage() {
  const list = getMonthlyIncome();

  const totalIncome = total(list);

  document.getElementById("incomeTotal").textContent = money(totalIncome);

  const mila = total(list.filter((x) => x.person === "Mila"));

  const mathias = total(list.filter((x) => x.person === "Mathias"));

  const milaPercent = percentage(mila, totalIncome);

  const mathiasPercent = percentage(mathias, totalIncome);

  document.getElementById("milaIncomeAmount").textContent = money(mila);

  document.getElementById("mathiasIncomeAmount").textContent = money(mathias);

  setPercentage("incomeMilaPercent", "incomeMilaBar", milaPercent);

  setPercentage("incomeMathiasPercent", "incomeMathiasBar", mathiasPercent);

  const container = document.getElementById("incomeList");

  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = `<div class="empty">
                No income recorded for this month.
            </div>`;

    return;
  }

  list
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .forEach((item) => {
      container.innerHTML += `

                <div class="transaction">

                    <div class="transaction-left">

                        <div class="transaction-icon">
                            💰
                        </div>

                        <div>

                            <div class="transaction-name">
                                ${escapeHTML(item.name)}
                            </div>

                            <div class="transaction-meta">
                                ${item.person}
                                •
                                ${formatDate(item.date)}
                            </div>

                        </div>

                    </div>


                    <div class="transaction-right">

                        <div class="transaction-amount">
                            + ${money(item.amount)}
                        </div>

                        <button
                            class="delete-button"
                            onclick="deleteItem('income', ${item.id})">
                            🗑️
                        </button>

                    </div>

                </div>
            `;
    });
}

/* ================= EXPENSE PAGE ================= */

function updateExpensePage() {
  const list = getMonthlyExpenses();

  const totalExpenses = total(list);

  document.getElementById("expenseTotal").textContent = money(totalExpenses);

  const mila = total(list.filter((x) => x.paidBy === "Mila"));

  const mathias = total(list.filter((x) => x.paidBy === "Mathias"));

  document.getElementById("milaExpenseAmount").textContent = money(mila);

  document.getElementById("mathiasExpenseAmount").textContent = money(mathias);

  setPercentage(
    "expenseMilaPercent",
    "expenseMilaBar",
    percentage(mila, totalExpenses),
  );

  setPercentage(
    "expenseMathiasPercent",
    "expenseMathiasBar",
    percentage(mathias, totalExpenses),
  );

  const container = document.getElementById("expenseList");

  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = `<div class="empty">
                No expenses recorded for this month.
            </div>`;

    return;
  }

  list
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .forEach((item) => {
      container.innerHTML += `

                <div class="transaction">

                    <div class="transaction-left">

                        <div class="transaction-icon">
                            ${categoryIcon(item.category)}
                        </div>

                        <div>

                            <div class="transaction-name">
                                ${escapeHTML(item.name)}
                            </div>

                            <div class="transaction-meta">
                                ${escapeHTML(item.category)}
                                • Paid by ${item.paidBy}
                                • ${formatDate(item.date)}
                            </div>

                        </div>

                    </div>


                    <div class="transaction-right">

                        <div class="transaction-amount">
                            - ${money(item.amount)}
                        </div>

                        <button
                            class="delete-button"
                            onclick="deleteItem('expenses', ${item.id})">
                            🗑️
                        </button>

                    </div>

                </div>
            `;
    });
}

/* ================= CATEGORY ICON ================= */

function categoryIcon(category) {
  const icons = {
    Food: "🍔",
    Shopping: "🛍️",
    Travel: "✈️",
    Transport: "🚇",
    Entertainment: "🎬",
    Bills: "🏠",
    Health: "❤️",
    Other: "📦",
  };

  return icons[category] || "📦";
}

/* ================= SAVINGS PAGE ================= */

function updateSavingsPage() {
  const list = getMonthlySavings();

  const totalSavings = total(list);

  document.getElementById("savingsTotal").textContent = money(totalSavings);

  const mila = total(list.filter((x) => x.person === "Mila"));

  const mathias = total(list.filter((x) => x.person === "Mathias"));

  document.getElementById("milaSavingsAmount").textContent = money(mila);

  document.getElementById("mathiasSavingsAmount").textContent = money(mathias);

  setPercentage(
    "savingsMilaPercent",
    "savingsMilaBar",
    percentage(mila, totalSavings),
  );

  setPercentage(
    "savingsMathiasPercent",
    "savingsMathiasBar",
    percentage(mathias, totalSavings),
  );

  const container = document.getElementById("savingsList");

  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = `<div class="empty">
                No savings recorded for this month.
            </div>`;

    return;
  }

  list
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .forEach((item) => {
      container.innerHTML += `

                <div class="transaction">

                    <div class="transaction-left">

                        <div class="transaction-icon">
                            💎
                        </div>

                        <div>

                            <div class="transaction-name">
                                ${escapeHTML(item.name)}
                            </div>

                            <div class="transaction-meta">
                                ${item.person}
                                •
                                ${formatDate(item.date)}
                            </div>

                        </div>

                    </div>


                    <div class="transaction-right">

                        <div class="transaction-amount">
                            + ${money(item.amount)}
                        </div>

                        <button
                            class="delete-button"
                            onclick="deleteItem('savings', ${item.id})">
                            🗑️
                        </button>

                    </div>

                </div>
            `;
    });
}

/* ================= GOALS ================= */

function renderGoals() {
  const container = document.getElementById("goalsList");

  container.innerHTML = "";

  if (data.goals.length === 0) {
    container.innerHTML = `<div class="empty">
                No goals yet.
            </div>`;

    return;
  }

  data.goals.forEach((goal) => {
    const percent = Math.min(100, Math.round((goal.saved / goal.target) * 100));

    container.innerHTML += `

            <div class="goal-card">

                <div class="goal-top">

                    <div>

                        <div class="goal-icon">
                            ${goal.icon}
                        </div>

                        <h3>
                            ${escapeHTML(goal.name)}
                        </h3>

                        <p>
                            ${percent}% completed
                        </p>

                    </div>

                    <button
                        class="delete-button"
                        onclick="deleteGoal(${goal.id})">
                        🗑️
                    </button>

                </div>


                <div class="goal-amounts">

                    <span>
                        ${money(goal.saved)}
                    </span>

                    <span>
                        ${money(goal.target)}
                    </span>

                </div>


                <div class="goal-progress">

                    <div
                        class="goal-progress-fill"
                        style="width:${percent}%">
                    </div>

                </div>

            </div>
        `;
  });
}

function renderDashboardGoals() {
  const container = document.getElementById("dashboardGoals");

  container.innerHTML = "";

  data.goals.slice(0, 2).forEach((goal) => {
    const percent = Math.min(100, Math.round((goal.saved / goal.target) * 100));

    container.innerHTML += `

                <div class="goal-card">

                    <div class="goal-icon">
                        ${goal.icon}
                    </div>

                    <h3>
                        ${escapeHTML(goal.name)}
                    </h3>

                    <p>
                        ${money(goal.saved)}
                        /
                        ${money(goal.target)}
                    </p>

                    <div class="goal-progress">

                        <div
                            class="goal-progress-fill"
                            style="width:${percent}%">
                        </div>

                    </div>

                </div>

            `;
  });
}

/* ================= MODAL ================= */

let currentModalType = null;

function openModal(type) {
  currentModalType = type;

  const modal = document.getElementById("modal");

  const title = document.getElementById("modalTitle");

  const fields = document.getElementById("formFields");

  fields.innerHTML = "";

  if (type === "income") {
    title.textContent = "Add Income";

    fields.innerHTML = `

            ${inputField("name", "Name", "e.g. Part-time job")}

            ${inputField("amount", "Amount", "e.g. 5000", "number")}

            ${selectField("person", "Person", ["Mila", "Mathias"])}

            ${inputField("date", "Date", "", "date")}

        `;
  }

  if (type === "expense") {
    title.textContent = "Add Expense";

    fields.innerHTML = `

            ${inputField("name", "Name", "e.g. Groceries")}

            ${inputField("amount", "Amount", "e.g. 500", "number")}

            ${selectField("category", "Category", [
              "Food",
              "Shopping",
              "Travel",
              "Transport",
              "Entertainment",
              "Bills",
              "Health",
              "Other",
            ])}

            ${selectField("paidBy", "Paid by", ["Mila", "Mathias"])}

            ${inputField("date", "Date", "", "date")}

        `;
  }

  if (type === "saving") {
    title.textContent = "Add Savings";

    fields.innerHTML = `

            ${inputField("name", "Name", "e.g. Monthly savings")}

            ${inputField("amount", "Amount", "e.g. 1000", "number")}

            ${selectField("person", "Person", ["Mila", "Mathias"])}

            ${inputField("date", "Date", "", "date")}

        `;
  }

  if (type === "goal") {
    title.textContent = "Add Goal";

    fields.innerHTML = `

            ${inputField("name", "Goal name", "e.g. New car")}

            ${inputField("icon", "Emoji", "e.g. 🚗")}

            ${inputField("target", "Target amount", "e.g. 50000", "number")}

            ${inputField("saved", "Already saved", "e.g. 5000", "number")}

        `;
  }

  modal.classList.add("show");
}

function inputField(name, label, placeholder, type = "text") {
  return `

        <div class="form-group">

            <label>${label}</label>

            <input
                name="${name}"
                type="${type}"
                placeholder="${placeholder}"
                ${type === "date" ? `value="${today()}"` : ""}
                required
            >

        </div>
    `;
}

function selectField(name, label, options) {
  return `

        <div class="form-group">

            <label>${label}</label>

            <select name="${name}" required>

                ${options
                  .map(
                    (option) =>
                      `<option value="${option}">
                            ${option}
                        </option>`,
                  )
                  .join("")}

            </select>

        </div>
    `;
}

function today() {
  return new Date().toISOString().split("T")[0];
}

function closeModal() {
  document.getElementById("modal").classList.remove("show");
}

/* ================= SUBMIT ================= */

document
  .getElementById("modalForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(this);

    const values = Object.fromEntries(formData);

    if (currentModalType === "income") {
      data.income.push({
        id: Date.now(),

        name: values.name,

        amount: Number(values.amount),

        person: values.person,

        date: values.date,
      });
    }

    if (currentModalType === "expense") {
      data.expenses.push({
        id: Date.now(),

        name: values.name,

        amount: Number(values.amount),

        category: values.category,

        paidBy: values.paidBy,

        date: values.date,
      });
    }

    if (currentModalType === "saving") {
      data.savings.push({
        id: Date.now(),

        name: values.name,

        amount: Number(values.amount),

        person: values.person,

        date: values.date,
      });
    }

    if (currentModalType === "goal") {
      data.goals.push({
        id: Date.now(),

        name: values.name,

        icon: values.icon,

        target: Number(values.target),

        saved: Number(values.saved),
      });
    }

    saveData();

    closeModal();

    this.reset();

    updateAll();
  });

/* ================= DELETE ================= */

function deleteItem(type, id) {
  if (!confirm("Are you sure you want to delete this?")) {
    return;
  }

  data[type] = data[type].filter((item) => item.id !== id);

  saveData();

  updateAll();
}

function deleteGoal(id) {
  if (!confirm("Delete this goal?")) {
    return;
  }

  data.goals = data.goals.filter((goal) => goal.id !== id);

  saveData();

  updateAll();
}

/* ================= YEAR ================= */

function changeYear(year) {
  selectedYear = Number(year);

  updateYearOverview();
}

function updateYearOverview() {
  const year = selectedYear.toString();

  let yearlyIncome = 0;

  let yearlyExpenses = 0;

  let yearlySavings = 0;

  const table = document.getElementById("yearTable");

  table.innerHTML = "";

  MONTHS.forEach((month, index) => {
    const monthNumber = String(index + 1).padStart(2, "0");

    const monthKey = year + "-" + monthNumber;

    const income = total(
      data.income.filter((x) => getMonth(x.date) === monthKey),
    );

    const expenses = total(
      data.expenses.filter((x) => getMonth(x.date) === monthKey),
    );

    const savings = total(
      data.savings.filter((x) => getMonth(x.date) === monthKey),
    );

    yearlyIncome += income;

    yearlyExpenses += expenses;

    yearlySavings += savings;

    table.innerHTML += `

                <tr>

                    <td>
                        <strong>
                            ${month}
                        </strong>
                    </td>

                    <td>
                        ${money(income)}
                    </td>

                    <td>
                        ${money(expenses)}
                    </td>

                    <td>
                        ${money(savings)}
                    </td>

                </tr>
            `;
  });

  document.getElementById("yearIncome").textContent = money(yearlyIncome);

  document.getElementById("yearExpenses").textContent = money(yearlyExpenses);

  document.getElementById("yearSavings").textContent = money(yearlySavings);
}

/* ================= UPDATE EVERYTHING ================= */

function updateAll() {
  setupMonthSelectors();

  updateDashboard();

  updateIncomePage();

  updateExpensePage();

  updateSavingsPage();

  renderGoals();

  updateYearOverview();
}

/* ================= SECURITY ================= */

function escapeHTML(text) {
  const div = document.createElement("div");

  div.textContent = text;

  return div.innerHTML;
}

/* ================= START ================= */

setupMonthSelectors();

updateAll();
