public class CalloutManager {
    
    public static ResponseWrapper doGet(String url, String method) {
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint(url);
        request.setMethod(method);
        HttpResponse response = http.send(request);
        System.debug('##in doGet code='+response.getStatusCode());
        return new ResponseWrapper(response.getStatusCode(), response.getStatus(), response.getBody());
    }
    
    public class ResponseWrapper {
        public Integer statusCode;
        public String statusMessage;
        public String responseString;
        
        public ResponseWrapper(Integer statusCode, String statusMessage, String responseString) {
            this.statusCode = statusCode;
            this.statusMessage = statusMessage;
            this.responseString = responseString;
        }
    }
    
    /*
    public static void doCallout() {
        CalloutManager.makeCallout('https://random-word-api.herokuapp.com/word?lang=en&number=1&length=5', 'GET', 
                                   new ResponseHandler() {
                                       public void onSuccess(String response) {}
                                       
                                       public void onError(String error) {}
                                   });
    }*/
}