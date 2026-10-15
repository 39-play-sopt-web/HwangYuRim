function solution(num_list) {
  if (num_list.length >= 11) {
    return num_list.reduce((sum, number) => sum + number, 0);
  }

  return num_list.reduce((product, number) => product * number, 1);
}
