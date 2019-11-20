//private function
exports.expectProposeOwners = (propose, message = 'Permission denied') => {
  const errmsg = message + ': You must be owner of the lock.';
  expect(
    msg.sender === propose.receiver || msg.sender === propose.sender || propose.contributors.indexOf(msg.sender) !== -1,
    errmsg
  );
};
//private function
exports.getDataByIndex = (array, index) => {
  const data = array[index];
  expect(!!data, 'The array index (' + index + ') out of bounds ');
  return data;
};
