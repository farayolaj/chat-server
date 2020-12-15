function messageState() {
  const messages = [
    {
      id: 1,
      from: 'Adam',
      to: 'me',
      data: 'Hello Josh!',
      timestamp: new Date(),
      time: '12:04',
    }
  ];

  return { messages, currentMessage: '', sendMessage };
}

function sendMessage() {
  const message = this.currentMessage;

  if (!message) return

  const messages = this.messages;
  const { text } = this.$refs;

  const datetime = new Date();

  const payload = {
    id: 2,
    data: message,
    timestamp: datetime,
    to: 'user2',
    from: 'me',
    // remove these later
    time: `${datetime.getHours()}:${datetime.getMinutes().toString().padStart(2, '0')}`,
    sent: true
  };

  this.currentMessage = '';
  text.focus();

  messages.push(payload);
} 