import Logger from './Logger';

export default class IFrameWindow {
    constructor(oidcClient) {
        this.oidcClient = oidcClient;
        this.messageEvent = this.messageEvent.bind(this);

        window.addEventListener("message", this.messageEvent, false);

        this.htmlFrame = window.document.createElement("iframe");
        // this.htmlFrame.style.visibility = "hidden";
        this.htmlFrame.style.position = "absolute";
        this.htmlFrame.style.height = 500;
        this.htmlFrame.style.width = 500;
        // this.htmlFrame.style.top = 100;
        // this.htmlFrame.style.left = 100;
        
        window.document.body.appendChild(this.htmlFrame);
    }

    navigate(params) {
        if (!params || !params.authorizeUrl) {
            Logger.error("No authorizeUrl provided in IFrameWindow");
        } else {
            const timeout = params.timeout;
            this.timer = window.setTimeout(() => this.onTimeout(), timeout);
            this.htmlFrame.src = params.authorizeUrl;
        }
    }

    onTimeout() {
        Logger.error("SilentRenew IFrame timed out");
        this.close();
    }

    cleanUp() {
        if (this.htmlFrame) {
            Logger.debug("Closing SilentRenew IFrame");

            window.removeEventListener("message", this.messageEvent, false);
            window.clearTimeout(this.timer);
            window.document.body.removeChild(this.htmlFrame);
            
            this.timer = null;
            this.htmlFrame = null;
            
        } else {
            Logger.warn("Tried to cleanup an empty IFrame");
        }
    }

    close() {
        this.cleanUp();
    }

    messageEvent(event) {
        Logger.debug("IFrameWindow messageEvent");

        //YOU ABSOLUTELY MUST MAKE THIS CHECK. IF NOT IT'S A HUGE SECURITY VULNERABILITY!!!
        if (this.timer && event.origin === this.origin && event.source === this.htmlFrame.contentWindow) {
            const messageData = event.data;
            if (messageData) {
                this.close();
                Logger.debug("Successful response from SilentRenew IFrameWindow!");
                console.dir(JSON.stringify(messageData));
                
                this.oidcClient.completeSilentRenewProcess(messageData.url); //This is really the completeSilentRenewProcess from LLamasoftOidcClient.js
            }
            else {
                Logger.error("Invalid response from SilentRenew IFrameWindow");
            }
        } else {
            Logger.warn("IFrameWindow messageEvent was from an unexpected source");
        }
    }

    get origin() {
        return location.protocol + "//" + location.host;
    }

    static notifyParent(messageData) {
        Logger.debug("IFrameWindow.notifyParent");

        if (window.parent && window !== window.parent) {
            Logger.debug("posting url message to parent");
            window.parent.postMessage(messageData, location.protocol + "//" + location.host);
        }
    }
}
