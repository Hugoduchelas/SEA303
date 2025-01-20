export default function unpack(rows, key) {
    return rows.map((row) => {
      return row[key];
    });
  }
  