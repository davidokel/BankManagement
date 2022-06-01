enum ExpenseCategory {
    bill = "Bill",
    food = "Food",
    transport = "Transport",
    holiday = "Holiday",
    entertainment = "Entertainment",
}

class Expense {
    category: ExpenseCategory;
    timeScale: TimePeriod;
    amount: number;
    label: string;

    constructor(category: ExpenseCategory, timeScale: TimePeriod, amount: number, label?: string) {
        this.category = category;
        this.timeScale = timeScale;
        this.amount = amount;
        this.label = label? label : timeScale + " " + category + " " + amount;
    }
}