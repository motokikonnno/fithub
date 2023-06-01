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
