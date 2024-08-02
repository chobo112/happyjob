//타임스탬프 형식 => 날짜 바꾸기
export const fomatData = (timeStamp: number) => {
  const date = new Date(timeStamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};
//export default { fomatDate };
