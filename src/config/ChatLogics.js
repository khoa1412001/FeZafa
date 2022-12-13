export const isSameSenderMargin = (messages, m, i, userId) => {
  // console.log(i === messages.length - 1);

  if (
    i < messages.length - 1 &&
    messages[i + 1].sender === m.sender &&
    messages[i].sender !== userId
  )
    return 33;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender !== m.sender &&
      messages[i].sender!== userId) ||
    (i === messages.length - 1 && messages[i].sender !== userId)
  )
    return 0;
  else return "auto";
};

export const isSameSender = (messages, m, i, userId) => {
  console.log(messages)
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender !== m.sender ||
      messages[i + 1].sender === undefined) &&
    messages[i].sender !== userId
  );
};

export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender !== userId &&
    messages[messages.length - 1].sender
  );
};

export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender === m.sender;
};

export const getSender = (loggedUser, users) => {
  return users[0] === loggedUser.id ? users[1].username : users[0].username;
};

export const getSenderFull = (loggedUser, users) => {
  return users[0]._id === loggedUser.id ? users[1] : users[0];
};
