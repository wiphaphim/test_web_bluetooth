let webConfiguration = WKWebViewConfiguration()
let contentController = WKUserContentController()

contentController.add(self, name: "eventHandler")
webConfiguration.userContentController = contentController;

webView = WKWebView(configuration: webConfiguration) // plus any other settings

func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
    if (message.name == "eventHandler"){
        let data = message.body as! NSDictionary
        // use data
    }
}