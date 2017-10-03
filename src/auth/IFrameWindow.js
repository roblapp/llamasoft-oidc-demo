
export default class IFrameWindow {
    constructor() {
        this.messageEvent = this.messageEvent.bind(this);

        window.addEventListener("messageEvent", this.messageEvent, false);

        this.htmlFrame = window.document.createElement("iframe");
        // this.htmlFrame.style.visibility = "hidden";
        this.htmlFrame.style.position = "absolute";
        this.htmlFrame.style.height = 500;
        this.htmlFrame.style.width = 500;
        this.htmlFrame.style.top = 100;
        this.htmlFrame.style.left = 100;
        
        window.document.body.appendChild(this.htmlFrame);
    }

    navigate(params) {
        console.log(params);
        if (!params || !params.authorizeUrl) {
            console.error("No authorizeUrl provided in IFrameWindow");
        } else{
            const timeout = params.timeout;
            this.timer = window.setTimeout(() => this.onTimeout(), timeout);
            this.htmlFrame.src = params.authorizeUrl;
        }
    }

    onTimeout() {
        console.error("SilentRenew IFrame timed out");
        this.close();
    }

    cleanUp() {
        if (this.htmlFrame) {
            console.log("Closing SilentRenew IFrame");

            window.removeEventListener("messageEvent", this.messageEvent, false);
            window.clearTimeout(this.timer);
            window.document.body.removeChild(this.htmlFrame);
            
            this.timer = null;
            this.htmlFrame = null;
            
        } else {
            console.warn("Tried to cleanup an empty IFrame");
        }
    }

    close() {
        this.cleanUp();
    }

    messageEvent(event) {
        console.debug("IFrameWindow messageEvent");

        //YOU ABSOLUTELY MUST MAKE THIS CHECK. IF NOT IT'S A HUGE SECURITY VULNERABILITY!!!
        if (this.timer && event.origin === this.origin && event.source === this.htmlFrame.contentWindow) {
            let url = event.data;
            if (url) {
                console.log("Successful response from SilentRenew IFrameWindow!")
            }
            else {
                console.error("Invalid response from SilentRenew IFrameWindow");
            }
        } else {
            console.warn("IFrameWindow messageEvent was from an unexpected source");
        }
    }

    get origin() {
        return location.protocol + "//" + location.host;
    }

    static notifyParent(url) {
        console.debug("IFrameWindow.notifyParent");

        if (window.parent && window !== window.parent) {
            url = url || window.location.href;
            if (url) {
                console.debug("posting url message to parent");
                window.parent.postMessage(url, location.protocol + "//" + location.host);
            }
        }
    }
}
