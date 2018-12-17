import MiniChatView from '../views/MiniChatView';
import './chat.scss';

const startChat = () => {
    const root = document.querySelector('.root');
    const miniChat = new MiniChatView({ el: root });
    if (false) console.log();
    miniChat.render();
};

startChat();
