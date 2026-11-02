function solution(num_list) {
  const oddNumbers = num_list.filter((number) => number % 2 !== 0);
  const evenNumbers = num_list.filter((number) => number % 2 === 0);

  const oddNumber = Number(oddNumbers.join(""));
  const evenNumber = Number(evenNumbers.join(""));

  return oddNumber + evenNumber;
}
