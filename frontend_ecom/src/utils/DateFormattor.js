export function DateFormattor(isoDateString) {
  const date = new Date(isoDateString);

  // Check if the Date object is valid
  if (isNaN(date)) {
    console.error("Invalid date format");
    return "Invalid Date";
  }

  // Format the date and return
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

  