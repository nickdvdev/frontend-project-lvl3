export default (data) => {
  const parser = new DOMParser();
  const newData = parser.parseFromString(data, 'text/html');
  console.log(newData.querySelector('title'));
  console.log(newData.querySelector('description'));
  console.log(newData);
  // Array.from(newData).forEach((node, index, array) => {
  //   console.log('length:', array.length, 'index: ', index, 'node: ', node);
  // });
  return newData.querySelector('description');
};
