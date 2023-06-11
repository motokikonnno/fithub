export const changeBodyPartsNumber = (num: number) => {
  let color;
  let bodyPartName;
  switch (num) {
    case 1:
      color = "red";
      bodyPartName = "Chest";
      return { color, bodyPartName };
    case 2:
      color = "blue";
      bodyPartName = "Back";
      return { color, bodyPartName };
    case 3:
      color = "green";
      bodyPartName = "Legs";
      return { color, bodyPartName };
    case 4:
      color = "yellow";
      bodyPartName = "Arms";
      return { color, bodyPartName };
    case 5:
      color = "purple";
      bodyPartName = "Shoulders";
      return { color, bodyPartName };
    case 6:
      color = "brown";
      bodyPartName = "Abdominal";
      return { color, bodyPartName };
    case 7:
      color = "gray";
      bodyPartName = "Other";
      return { color, bodyPartName };
    default:
      color = "";
      bodyPartName = "";
      return { color, bodyPartName };
  }
};
