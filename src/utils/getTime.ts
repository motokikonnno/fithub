export const getTimeDiff = (createdAt: string) => {
  let createTime = new Date(createdAt);
  let diff = new Date().getTime() - createTime.getTime();
  let progress = new Date(diff);

  if (progress.getUTCFullYear() - 1970) {
    return progress.getUTCFullYear() - 1970 + " years ago";
  } else if (progress.getUTCMonth()) {
    return progress.getUTCMonth() + " month ago";
  } else if (progress.getUTCDate() - 1) {
    return progress.getUTCDate() - 1 + " days ago";
  } else if (progress.getUTCHours()) {
    return progress.getUTCHours() + " hour ago";
  } else if (progress.getUTCMinutes()) {
    return progress.getUTCMinutes() + " minute ago";
  } else {
    return progress.getUTCSeconds() + " second ago";
  }
};

export const formatDateToEnglish = (date: string) => {
  const d = new Date(date);

  // 日時を英語にフォーマット(年、月、日のみ表示)
  const englishFormattedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);

  return englishFormattedDate;
};

// yyyy-mm-dd形式にフォーマット
export const formatDateCalender = (date: string) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = ("0" + (d.getMonth() + 1)).slice(-2);
  const day = ("0" + d.getDate()).slice(-2);

  return `${year}-${month}-${day}`;
};

export const formatMonthEnglish = (date: number) => {
  switch (date) {
    case 1:
      return "January";
    case 2:
      return "February";
    case 3:
      return "March";
    case 4:
      return "April";
    case 5:
      return "May";
    case 6:
      return "June";
    case 7:
      return "July";
    case 8:
      return "August";
    case 9:
      return "September";
    case 10:
      return "October";
    case 11:
      return "November";
    case 12:
      return "December";
  }
};
