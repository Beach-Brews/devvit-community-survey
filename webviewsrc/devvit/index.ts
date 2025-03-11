import {DevvitMessage, MessageFromDevvit, MessageToDevvit} from "./defs";
import {useEffect} from "react";

export const sendToDevvit = (event: MessageToDevvit) => {
    console.debug('Sending message to devvit: ', event);
    window.parent?.postMessage(event, "*");
};

export const listenFromDevvit =
    <TEvent extends MessageFromDevvit['type'], TPayload extends MessageFromDevvit['payload']>(fromEvent: TEvent, fromHandler: (payload: TPayload) => void): void => {
        sendToAndListenFromDevvit(null, fromEvent, fromHandler);
    };

export const sendToAndListenFromDevvit =
    <TEvent extends MessageFromDevvit['type'], TPayload extends MessageFromDevvit['payload']>(toEvent: MessageToDevvit, fromEvent: TEvent, fromHandler: (payload: TPayload) => void): void => {
        useEffect(() => {
            const messageHandler = (ev: MessageEvent<DevvitMessage>) => {
                if (ev.data.type !== 'devvit-message') {
                    console.warn(`Received message with type ${ev.data.type} but expected 'devvit-message'`);
                    return;
                }

                const message = ev.data.data.message;
                if (message.type === fromEvent) {
                    console.log('Received message from Devvit: ', message);
                    fromHandler(message.payload as TPayload);
                }
            };

            window.addEventListener('message', messageHandler);

            if (toEvent)
                sendToDevvit(toEvent);

            return () => window.removeEventListener('message', messageHandler);
        }, [fromEvent]);
    };