export default class Message {
    public static success(text: string) {
        const div = document.createElement('div');
        div.classList.add('wf-message');
        div.innerHTML = text;
        document.body.appendChild(div);
        setTimeout(() => {
            div.remove();
        }, 3000)
    }
}