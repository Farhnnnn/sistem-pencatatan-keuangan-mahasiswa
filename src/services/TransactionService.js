import { Transaction } from "../models/Transaction.js";

export class TransactionService {
  #storageKey = "student-finance-transactions";
  #transactions = [];

  constructor() {
    this.#loadTransactions();
  }

  #loadTransactions() {
    try {
      const saved = localStorage.getItem(this.#storageKey);
      const data = saved ? JSON.parse(saved) : [];

      if (!Array.isArray(data)) {
        throw new Error("Format data tidak valid.");
      }

      this.#transactions = data.map(
        (item) => new Transaction(item)
      );
    } catch (error) {
      throw new Error(
        `Gagal memuat transaksi: ${error.message}`
      );
    }
  }

  #saveTransactions() {
    localStorage.setItem(
      this.#storageKey,
      JSON.stringify(this.#transactions)
    );
  }

  addTransaction(data) {
    const transaction = new Transaction({
      ...data,
      id: crypto.randomUUID()
    });

    transaction.validate();

    this.#transactions.push(transaction);
    this.#saveTransactions();

    return transaction;
  }

  getTransactions() {
    return [...this.#transactions];
  }

  getBalance() {
    return this.#transactions.reduce((balance, item) => {
      return balance +
        (item.type === "income"
          ? item.amount
          : -item.amount);
    }, 0);
  }

  deleteTransaction(id) {
    const previousLength = this.#transactions.length;

    this.#transactions = this.#transactions.filter(
      (item) => item.id !== id
    );

    if (this.#transactions.length === previousLength) {
      throw new Error("Transaksi tidak ditemukan.");
    }

    this.#saveTransactions();
  }
}