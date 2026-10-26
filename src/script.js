import { TransactionService } from "./services/TransactionService.js";

const service = new TransactionService();

const form = document.querySelector("#transaction-form");
const message = document.querySelector("#message");
const list = document.querySelector("#transaction-list");

const rupiah = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(value);

function render() {
  const transactions = service.getTransactions();

  const income = transactions
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + item.amount, 0);

  const expense = transactions
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + item.amount, 0);

  document.querySelector("#balance").textContent =
    rupiah(service.getBalance());

  document.querySelector("#income").textContent = rupiah(income);
  document.querySelector("#expense").textContent = rupiah(expense);

  list.replaceChildren();

  transactions
    .sort((a, b) => b.date.localeCompare(a.date))
    .forEach((item) => {
      const row = document.createElement("tr");

      const values = [
        item.date,
        item.type === "income" ? "Pemasukan" : "Pengeluaran",
        item.category,
        rupiah(item.amount)
      ];

      values.forEach((value) => {
        const cell = document.createElement("td");
        cell.textContent = value;
        row.appendChild(cell);
      });

      const actionCell = document.createElement("td");
      const deleteButton = document.createElement("button");

      deleteButton.type = "button";
      deleteButton.className = "delete-button";
      deleteButton.textContent = "Hapus";

      deleteButton.addEventListener("click", () => {
        try {
          service.deleteTransaction(item.id);
          message.textContent = "Transaksi berhasil dihapus.";
          render();
        } catch (error) {
          message.textContent = error.message;
        }
      });

      actionCell.appendChild(deleteButton);
      row.appendChild(actionCell);
      list.appendChild(row);
    });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  try {
    service.addTransaction({
      type: document.querySelector("#type").value,
      amount: document.querySelector("#amount").value,
      category: document.querySelector("#category").value,
      date: document.querySelector("#date").value,
      description: document.querySelector("#description").value
    });

    message.textContent = "Transaksi berhasil disimpan.";
    form.reset();
    render();
  } catch (error) {
    message.textContent = error.message;
  }
});

try {
  render();
} catch (error) {
  message.textContent = error.message;
}