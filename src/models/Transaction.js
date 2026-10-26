export class Transaction {
  #id;
  #type;
  #amount;
  #category;
  #date;
  #description;

  constructor({
    id,
    type,
    amount,
    category,
    date,
    description = ""
  }) {
    this.#id = id;
    this.#type = type;
    this.#amount = Number(amount);
    this.#category = category;
    this.#date = date;
    this.#description = description;
  }

  get id() {
    return this.#id;
  }

  get type() {
    return this.#type;
  }

  get amount() {
    return this.#amount;
  }

  get category() {
    return this.#category;
  }

  get date() {
    return this.#date;
  }

  get description() {
    return this.#description;
  }

  validate() {
    if (!["income", "expense"].includes(this.#type)) {
      throw new Error("Jenis transaksi tidak valid.");
    }

    if (!Number.isFinite(this.#amount) || this.#amount <= 0) {
      throw new Error("Nominal harus lebih besar dari nol.");
    }

    if (!this.#category?.trim()) {
      throw new Error("Kategori wajib diisi.");
    }

    if (!this.#date || Number.isNaN(Date.parse(this.#date))) {
      throw new Error("Tanggal tidak valid.");
    }

    return true;
  }
}