import MiniChatView from '../views/MiniChatView.ts';

const startChat = () => {
    // console.log('startChat()');
    const root = document.querySelector('.root');
    const miniChat = new MiniChatView({ el: root });
    miniChat.render();
};

startChat();
